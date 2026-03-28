import { useStore } from "@tanstack/react-store";
import { createStore } from "@tanstack/store";
import { frequencyToNote, DEFAULT_NOTE_NAMES } from "@/shared/lib/audio-pitch";
import type { NoteCheckerConfig } from "../config";
import { DEFAULT_NOTE_CHECKER_CONFIG } from "../config";

export interface NoteCheckerState {
  enabled: boolean;
  correctNotes: string[];
  totalNotes: number;
  expectedFrequencies: number[];
  currentTact: number;
  currentNote: number;
  config: NoteCheckerConfig;
  noteStartTime: number;
}

const initialState: NoteCheckerState = {
  enabled: false,
  correctNotes: [],
  totalNotes: 0,
  expectedFrequencies: [],
  currentTact: -1,
  currentNote: -1,
  config: DEFAULT_NOTE_CHECKER_CONFIG,
  noteStartTime: 0,
};

export const noteCheckerStore = createStore<NoteCheckerState>(initialState);

export const useNoteCheckerEnabled = () => useStore(noteCheckerStore, s => s.enabled);
export const useCorrectNotes = () => useStore(noteCheckerStore, s => s.correctNotes);
export const useNoteCheckerConfig = () => useStore(noteCheckerStore, s => s.config);

export const noteCheckerActions = {
  setEnabled: (enabled: boolean) =>
    noteCheckerStore.setState(prev => ({
      ...prev,
      enabled,
      correctNotes: enabled ? prev.correctNotes : [],
      expectedFrequencies: [],
      currentTact: -1,
      currentNote: -1,
    })),

  setExpectedFrequencies: (frequencies: number[]) =>
    noteCheckerStore.setState(prev => ({
      ...prev,
      expectedFrequencies: frequencies,
      totalNotes: prev.totalNotes + (frequencies.length > 0 ? 1 : 0),
      noteStartTime: Date.now(),
    })),

  updatePosition: (tact: number, note: number) =>
    noteCheckerStore.setState(prev => ({
      ...prev,
      currentTact: tact,
      currentNote: note,
    })),

  markNoteCorrect: (tact: number, note: number) => {
    const key = `${tact}-${note}`;
    noteCheckerStore.setState(prev => {
      if (prev.correctNotes.includes(key)) return prev;
      return { ...prev, correctNotes: [...prev.correctNotes, key] };
    });
  },

  checkNote: (detectedFrequency: number, clarity: number): boolean => {
    const state = noteCheckerStore.state;
    const { expectedFrequencies, config, currentTact, currentNote } = state;

    if (expectedFrequencies.length === 0) return false;
    if (clarity < config.clarityThreshold) return false;

    const elapsed = Date.now() - state.noteStartTime;
    if (elapsed > config.timeWindowMs) return false;

    const tolerance = config.frequencyTolerance / 100;
    const matches = expectedFrequencies.some((expected: number) => {
      const lower = expected * (1 - tolerance);
      const upper = expected * (1 + tolerance);
      return detectedFrequency >= lower && detectedFrequency <= upper;
    });

    if (matches && currentTact >= 0 && currentNote >= 0) {
      noteCheckerActions.markNoteCorrect(currentTact, currentNote);
    }

    return matches;
  },

  frequencyToNoteName: (frequency: number): string | null => {
    const noteInfo = frequencyToNote(frequency, DEFAULT_NOTE_NAMES);
    return noteInfo?.name || null;
  },

  getMidiNoteFromFrequency: (frequency: number): number => {
    return Math.round(12 * Math.log2(frequency / 440) + 69);
  },

  reset: () =>
    noteCheckerStore.setState(prev => ({
      ...prev,
      correctNotes: [],
      totalNotes: 0,
      expectedFrequencies: [],
      currentTact: -1,
      currentNote: -1,
    })),

  updateConfig: (partial: Partial<NoteCheckerConfig>) =>
    noteCheckerStore.setState(prev => ({
      ...prev,
      config: { ...prev.config, ...partial },
    })),
};
