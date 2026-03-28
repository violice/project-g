import { PitchDetector } from "pitchy";
import { frequencyToNote, DEFAULT_NOTE_NAMES } from "./audio-pitch.notes";
import type { AudioPitchDetectorConfig, PitchDetectionResult } from "./audio-pitch.types";

export class AudioPitchDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private detector: PitchDetector<Float32Array<ArrayBuffer>> | null = null;
  private inputBuffer: Float32Array | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;
  private onAnalysis: ((result: PitchDetectionResult | null) => void) | null = null;

  private readonly noteNames: readonly string[];
  private readonly clarityThreshold: number;
  private readonly fftSize: number;
  private readonly smoothingTimeConstant: number;
  private readonly volumeThreshold: number;
  private readonly stabilityFrames: number;
  private readonly frequencySmoothingWindow: number;

  private historyBuffer: { frequency: number; noteName: string; timestamp: number }[] = [];
  private lastStableNote: string | null = null;
  private lastStableFrequency: number = 0;

  constructor(config: AudioPitchDetectorConfig = {}) {
    this.noteNames = config.noteNames ?? DEFAULT_NOTE_NAMES;
    this.clarityThreshold = config.clarityThreshold ?? 0.82;
    this.fftSize = config.fftSize ?? 2048;
    this.smoothingTimeConstant = config.smoothingTimeConstant ?? 0.05;
    this.volumeThreshold = config.volumeThreshold ?? 0.5;
    this.stabilityFrames = config.stabilityFrames ?? 2;
    this.frequencySmoothingWindow = config.frequencySmoothingWindow ?? 3;
  }

  async start(onAnalysis: (result: PitchDetectionResult | null) => void): Promise<void> {
    if (this.isRunning) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Browser does not support microphone access");
    }

    this.onAnalysis = onAnalysis;

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
      },
    });

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;

    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.sourceNode.connect(this.analyser);

    this.inputBuffer = new Float32Array(this.analyser.fftSize);
    this.detector = PitchDetector.forFloat32Array(this.inputBuffer.length);

    this.isRunning = true;
    this.analyze();
  }

  async stop(): Promise<void> {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.sourceNode?.disconnect();
    this.sourceNode = null;
    this.analyser = null;

    this.mediaStream?.getTracks().forEach(track => track.stop());
    this.mediaStream = null;

    if (this.audioContext) {
      if (this.audioContext.state !== "closed") {
        await this.audioContext.close();
      }
      this.audioContext = null;
    }

    this.detector = null;
    this.inputBuffer = null;
    this.isRunning = false;
    this.onAnalysis = null;
    this.historyBuffer = [];
    this.lastStableNote = null;
    this.lastStableFrequency = 0;
  }

  get isActive(): boolean {
    return this.isRunning;
  }

  private analyseVolume() {
    const buffer = this.inputBuffer!!;
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    sum /= buffer.length;
    return Math.sqrt(sum);
  }

  private analyze(): void {
    if (!this.isRunning) {
      return;
    }

    if (!this.analyser || !this.detector || !this.inputBuffer || !this.audioContext) {
      this.animationFrameId = requestAnimationFrame(() => this.analyze());
      return;
    }

    this.analyser.getFloatTimeDomainData(this.inputBuffer as Float32Array<ArrayBuffer>);

    const [pitch, clarity] = this.detector.findPitch(
      this.inputBuffer,
      this.audioContext.sampleRate,
    );

    let volume = this.analyseVolume();
    
    volume = 1 / (1 + Math.exp(-100 * (volume - 0.02)));

    const rawResult: PitchDetectionResult | null =
      pitch > 0 && clarity >= this.clarityThreshold && volume >= this.volumeThreshold
        ? {
            frequency: pitch,
            clarity,
            note: frequencyToNote(pitch, this.noteNames),
          }
        : null;

    const result = this.applyStabilityLogic(rawResult);

    this.onAnalysis?.(result);

    this.animationFrameId = requestAnimationFrame(() => this.analyze());
  }

  private applyStabilityLogic(rawResult: PitchDetectionResult | null): PitchDetectionResult | null {
    const now = Date.now();

    if (rawResult && rawResult.note) {
      this.historyBuffer.push({
        frequency: rawResult.frequency,
        noteName: rawResult.note.name,
        timestamp: now,
      });
    }

    const windowStart = now - 500;
    this.historyBuffer = this.historyBuffer.filter(entry => entry.timestamp > windowStart);

    if (this.historyBuffer.length < this.stabilityFrames) {
      return null;
    }

    const recentEntries = this.historyBuffer.slice(-this.stabilityFrames);
    const noteCounts = new Map<string, number>();
    for (const entry of recentEntries) {
      noteCounts.set(entry.noteName, (noteCounts.get(entry.noteName) || 0) + 1);
    }

    let mostFrequentNote: string | null = null;
    let maxCount = 0;
    for (const [noteName, count] of noteCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentNote = noteName;
      }
    }

    const noteConfirmed = maxCount >= Math.ceil(this.stabilityFrames * 0.6);

    if (!noteConfirmed) {
      return null;
    }

    if (mostFrequentNote !== this.lastStableNote) {
      this.lastStableNote = mostFrequentNote;
      const frequenciesForNote = recentEntries
        .filter(e => e.noteName === mostFrequentNote)
        .map(e => e.frequency);
      this.lastStableFrequency = this.getSmoothedFrequency(frequenciesForNote);
    }

    const avgClarity = rawResult?.clarity ?? 0.9;

    return {
      frequency: this.lastStableFrequency,
      clarity: avgClarity,
      note: frequencyToNote(this.lastStableFrequency, this.noteNames),
    };
  }

  private getSmoothedFrequency(frequencies: number[]): number {
    const window = frequencies.slice(-this.frequencySmoothingWindow);
    const sum = window.reduce((a, b) => a + b, 0);
    return sum / window.length;
  }
}
