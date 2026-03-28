import type { Composition, StaveInfo, TactInfo, NoteDto } from "../music-player";

export interface TabState {
  currentTact: number;
  currentNote: number;
  columnIndex: number;
  correctNotes?: Set<string>;
}

export interface TabOptions {
  stringNames?: string[];
  showTactNumbers?: boolean;
}

export interface LayoutInfo {
  width: number;
  height: number;
}

export type { Composition, StaveInfo, TactInfo, NoteDto };
