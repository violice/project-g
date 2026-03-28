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

  constructor(config: AudioPitchDetectorConfig = {}) {
    this.noteNames = config.noteNames ?? DEFAULT_NOTE_NAMES;
    this.clarityThreshold = config.clarityThreshold ?? 0.92;
    this.fftSize = config.fftSize ?? 2048;
    this.smoothingTimeConstant = config.smoothingTimeConstant ?? 0.1;
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
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.detector = null;
    this.inputBuffer = null;
    this.isRunning = false;
    this.onAnalysis = null;
  }

  get isActive(): boolean {
    return this.isRunning;
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

    const result: PitchDetectionResult | null =
      pitch > 0 && clarity >= this.clarityThreshold
        ? {
            frequency: pitch,
            clarity,
            note: frequencyToNote(pitch, this.noteNames),
          }
        : null;

    this.onAnalysis?.(result);

    this.animationFrameId = requestAnimationFrame(() => this.analyze());
  }
}
