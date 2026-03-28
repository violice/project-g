import {Component, OnDestroy, signal} from '@angular/core';
import {PitchDetector} from 'pitchy';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  private readonly noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  private readonly clarityThreshold = 0.92;

  readonly status = signal('Нажмите "Начать", чтобы включить микрофон.');
  readonly isListening = signal(false);
  readonly detectedNote = signal<string | null>(null);
  readonly detectedFrequency = signal<number | null>(null);
  readonly clarity = signal<number | null>(null);
  readonly detuneCents = signal<number | null>(null);

  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private detector: PitchDetector<Float32Array<ArrayBuffer>> | null = null;
  private inputBuffer: Float32Array<ArrayBuffer> | null = null;
  private animationFrameId: number | null = null;

  async startDetection(): Promise<void> {
    if (this.isListening()) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      this.status.set('Браузер не поддерживает доступ к микрофону.');
      return;
    }

    try {
      this.status.set('Запрашиваю доступ к микрофону...');

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      });

      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.1;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      this.inputBuffer = new Float32Array(
        new ArrayBuffer(this.analyser.fftSize * Float32Array.BYTES_PER_ELEMENT)
      );
      this.detector = PitchDetector.forFloat32Array(this.inputBuffer.length);

      this.isListening.set(true);
      this.status.set('Слушаю сигнал...');
      this.validateNode();
    } catch (error) {
      console.error(error);
      await this.stopDetection('Не удалось получить доступ к микрофону.');
    }
  }

  async stopDetection(statusMessage = 'Детектор остановлен.'): Promise<void> {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.sourceNode?.disconnect();
    this.sourceNode = null;
    this.analyser = null;

    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    this.detector = null;
    this.inputBuffer = null;

    this.isListening.set(false);
    this.detectedNote.set(null);
    this.detectedFrequency.set(null);
    this.detuneCents.set(null);
    this.clarity.set(null);
    this.status.set(statusMessage);
  }

  ngOnDestroy(): void {
    void this.stopDetection();
  }

  isInTune(): boolean {
    return Math.abs(this.detuneCents() ?? 0) <= 5;
  }

  detuneAmount(): number {
    return Math.abs(this.detuneCents() ?? 0);
  }

  private validateNode(): void {
    if (!this.analyser || !this.detector || !this.inputBuffer || !this.audioContext) {
      return;
    }

    this.analyser.getFloatTimeDomainData(this.inputBuffer);

    this.analyseNote()
    this.analyseVolume()
  }

  private analyseVolume() {
    // console.log(this.inputBuffer)
    const buffer = this.inputBuffer!!
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    sum /= buffer.length
    console.log(Math.sqrt(sum) > 0.2)
  }

  private analyseNote() {
    const [pitch, clarity] = this.detector!!.findPitch(this.inputBuffer!!, this.audioContext!!.sampleRate);
    this.clarity.set(clarity);

    if (pitch > 0 && clarity >= this.clarityThreshold) {
      const note = this.frequencyToNote(pitch);

      this.detectedFrequency.set(pitch);
      this.detectedNote.set(note.name);
      this.detuneCents.set(note.cents);
      this.status.set('Нота определена.');
    } else {
      this.detectedFrequency.set(null);
      this.detectedNote.set(null);
      this.detuneCents.set(null);
      this.status.set('Ищу стабильную ноту...');
    }

    this.animationFrameId = requestAnimationFrame(() => this.validateNode());
  }

  private frequencyToNote(frequency: number): { name: string; cents: number } {
    const midiNote = Math.round(12 * Math.log2(frequency / 440) + 69);
    const noteIndex = ((midiNote % 12) + 12) % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    const exactFrequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    const cents = Math.round(1200 * Math.log2(frequency / exactFrequency));

    return {
      name: `${this.noteNames[noteIndex]}${octave}`,
      cents,
    };
  }
}
