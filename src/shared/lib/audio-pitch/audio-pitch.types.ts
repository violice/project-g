export interface NoteInfo {
  name: string;
  octave: number;
  frequency: number;
  cents: number;
}

export interface PitchDetectionResult {
  frequency: number;
  clarity: number;
  note: NoteInfo | null;
}

export interface AudioPitchDetectorConfig {
  fftSize?: number;
  smoothingTimeConstant?: number;
  clarityThreshold?: number;
  noteNames?: string[];
}

export interface AudioPitchDetectorState {
  isListening: boolean;
  currentResult: PitchDetectionResult | null;
  error: string | null;
}

export interface UseAudioPitchDetectorOptions extends AudioPitchDetectorConfig {
  onNoteDetected?: (result: PitchDetectionResult) => void;
  onNoteLost?: () => void;
}

export type AudioPitchDetectorStatus = "inactive" | "requesting" | "listening" | "error";
