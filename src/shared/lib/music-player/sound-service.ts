export class SoundService {
  private readonly N = 200000;

  karplusStrong(rate: number): number[] {
    const noise = this.noise(this.N / rate);
    const hps = this.highPass(noise, 0.5);
    const hbs = this.highBand(hps, noise.length, 0.1);
    const samples = [...hbs];

    for (let i = noise.length; i < this.N; i++) {
      samples.push(0);
      samples[i] = this.zeroOrderHold(samples, noise.length, i);
      samples[i] = this.decay(samples, i, 0.5);
      samples[i] = this.roundOff(samples, i, 0.4);
    }

    return this.lowPass(samples, 0.32, (Math.PI * rate) / this.N);
  }

  private noise(n: number): number[] {
    return Array.from({ length: n }, () => Math.random() * 2 - 1);
  }

  private highPass(data: number[], p: number): number[] {
    const result: number[] = new Array(data.length);
    result[0] = (1 - p) * data[0];
    for (let i = 1; i < data.length; i++) {
      result[i] = (1 - p) * data[i] + p * result[i - 1];
    }
    return result;
  }

  private highBand(data: number[], n: number, beta: number): number[] {
    const result: number[] = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      if (i - Math.round(beta * n) < 0) {
        result[i] = data[i];
      } else {
        result[i] = data[i] - data[i - Math.round(beta * n)];
      }
    }
    return result;
  }

  private zeroOrderHold(data: number[], n: number, i: number): number {
    return data[i - n];
  }

  private decay(data: number[], i: number, s: number): number {
    return 0.996 * (1 - s) * data[i] + s * data[i - 1];
  }

  private roundOff(data: number[], i: number, c: number): number {
    return c * (data[i] - data[i - 1]) + data[i - 1];
  }

  private lowPass(samples: number[], l: number, w: number): number[] {
    const filteredSamples: number[] = new Array(samples.length);
    const buffer: number[] = new Array(samples.length);
    buffer[0] = (w / (1 + w)) * samples[0];

    for (let i = 1; i < samples.length; i++) {
      buffer[i] =
        (w / (1 + w)) * (samples[i] + samples[i - 1]) + ((1 - w) / (1 + w)) * buffer[i - 1];
    }

    for (let i = 0; i < buffer.length; i++) {
      filteredSamples[i] = samples[i] * Math.pow(l, 1.333) + (1 - l) * buffer[i];
    }
    return filteredSamples;
  }
}
