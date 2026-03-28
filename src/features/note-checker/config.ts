export interface NoteCheckerConfig {
  timeWindowMs: number;
  frequencyTolerance: number;
  clarityThreshold: number;
  volumeThreshold: number;
}

export const DEFAULT_NOTE_CHECKER_CONFIG: NoteCheckerConfig = {
  timeWindowMs: 500,
  frequencyTolerance: 5,
  clarityThreshold: 0.82,
  volumeThreshold: 0.5,
};
