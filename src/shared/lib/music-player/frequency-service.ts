import type { Tuning } from './models';
export { type Tuning };

export class FrequencyService {
  private readonly tuning: Tuning[] = [
    { note: 'E', frequency: 330 },
    { note: 'B', frequency: 247 },
    { note: 'G', frequency: 196 },
    { note: 'D', frequency: 147 },
    { note: 'A', frequency: 110 },
    { note: 'E', frequency: 82 },
  ];

  setTuning(tuning: Tuning[]): void {
    this.tuning.length = 0;
    this.tuning.push(...tuning);
  }

  calculateFrequency(stringIndex: number, fret: number): number {
    const freq = Math.round((2 ** (fret / 12.0)) * this.tuning[stringIndex].frequency);
    return freq;
  }

  getTuning(): Tuning[] {
    return [...this.tuning];
  }
}
