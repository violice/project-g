import { SoundService } from './sound-service';

export class PlaySoundService {
  private soundService: SoundService;

  constructor() {
    this.soundService = new SoundService();
  }

  playSound(rates: number[]): void {
    const audioCtx = new AudioContext();

    const FIXED_SAMPLE_RATE = 200000;
    const FIXED_BUFFER_SIZE = 200000;
    const duration = 1;

    const audioBuffer = audioCtx.createBuffer(2, FIXED_BUFFER_SIZE, FIXED_SAMPLE_RATE);
    const channelData = audioBuffer.getChannelData(0);
    const channelData1 = audioBuffer.getChannelData(1);

    const sampleArrays = rates.map(rate => this.soundService.karplusStrong(rate));

    const samples: number[] = [];
    for (let i = 0; i < FIXED_BUFFER_SIZE; i++) {
      let sample = 0;
      for (let j = 0; j < sampleArrays.length; j++) {
        sample += sampleArrays[j][i] || 0;
      }
      samples.push(sample / sampleArrays.length);
    }

    for (let i = 0; i < FIXED_BUFFER_SIZE; i++) {
      channelData[i] = samples[i];
      channelData1[i] = samples[i] * 0.9;
    }

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(0, 0, duration);
    source.stop(duration);

    setTimeout(() => {
      audioCtx.close();
    }, duration * 1000 + 100);
  }

  clear(): void {}
}
