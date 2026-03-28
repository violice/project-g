import type { NoteInfo } from "./audio-pitch.types";

export const DEFAULT_NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export const A4_FREQUENCY = 440;
export const A4_MIDI_NOTE = 69;

export function frequencyToMidi(frequency: number): number {
  return Math.round(12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI_NOTE);
}

export function midiToFrequency(midiNote: number): number {
  return A4_FREQUENCY * Math.pow(2, (midiNote - A4_MIDI_NOTE) / 12);
}

export function frequencyToNote(
  frequency: number,
  noteNames: readonly string[] = DEFAULT_NOTE_NAMES,
): NoteInfo {
  const midiNote = frequencyToMidi(frequency);
  const noteIndex = ((midiNote % 12) + 12) % 12;
  const octave = Math.floor(midiNote / 12) - 1;
  const exactFrequency = midiToFrequency(midiNote);
  const cents = Math.round(1200 * Math.log2(frequency / exactFrequency));

  return {
    name: `${noteNames[noteIndex]}${octave}`,
    octave,
    frequency: exactFrequency,
    cents,
  };
}

export function isInTune(cents: number, threshold = 5): boolean {
  return Math.abs(cents) <= threshold;
}

export function getDetuneAmount(cents: number): number {
  return Math.abs(cents);
}

export function getDetuneDirection(cents: number): "sharp" | "flat" | "in-tune" {
  if (Math.abs(cents) <= 5) return "in-tune";
  return cents > 0 ? "sharp" : "flat";
}
