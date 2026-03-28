import { useStore } from "@tanstack/react-store";
import { createStore } from "@tanstack/store";
import type { TabRenderer } from "@/shared/lib/tab-renderer";

export type PlaybackState = "playing" | "paused" | "stopped";

export interface Position {
  tact: number;
  beat: number;
  total: number;
}

export interface VisualizerState {
  currentTact: number;
  currentNote: number;
  columnIndex: number;
}

export interface LearnState {
  currentSongIndex: number;
  playbackState: PlaybackState;
  progress: number;
  position: Position;
  bpm: number;
  playbackSpeed: number;
  renderer: TabRenderer | null;
  visualizerState: VisualizerState;
}

const initialState: LearnState = {
  currentSongIndex: 0,
  playbackState: "stopped",
  progress: 0,
  position: { tact: 0, beat: 0, total: 0 },
  bpm: 120,
  playbackSpeed: 1,
  renderer: null,
  visualizerState: { currentTact: 0, currentNote: 0, columnIndex: 0 },
};

export const learnStore = createStore<LearnState>(initialState);

export const useSongIndex = () => useStore(learnStore, s => s.currentSongIndex);
export const usePlaybackState = () => useStore(learnStore, s => s.playbackState);
export const useProgress = () => useStore(learnStore, s => s.progress);
export const usePosition = (): Position => useStore(learnStore, s => s.position);
export const useBpm = () => useStore(learnStore, s => s.bpm);
export const usePlaybackSpeed = () => useStore(learnStore, s => s.playbackSpeed);
export const useRenderer = (): TabRenderer | null => useStore(learnStore, s => s.renderer);
export const useVisualizerState = (): VisualizerState =>
  useStore(learnStore, s => s.visualizerState);

export const learnActions = {
  setSongIndex: (index: number) =>
    learnStore.setState(prev => ({ ...prev, currentSongIndex: index })),
  setPlaybackState: (state: PlaybackState) =>
    learnStore.setState(prev => ({ ...prev, playbackState: state })),
  setProgress: (progress: number) => learnStore.setState(prev => ({ ...prev, progress })),
  setPosition: (position: Position) => learnStore.setState(prev => ({ ...prev, position })),
  setBpm: (bpm: number) => learnStore.setState(prev => ({ ...prev, bpm })),
  setPlaybackSpeed: (speed: number) =>
    learnStore.setState(prev => ({ ...prev, playbackSpeed: speed })),
  resetPosition: () =>
    learnStore.setState(prev => ({
      ...prev,
      position: { tact: 0, beat: 0, total: 0 },
      progress: 0,
      visualizerState: { currentTact: 0, currentNote: 0, columnIndex: 0 },
    })),
  setRenderer: (renderer: TabRenderer | null) =>
    learnStore.setState(prev => ({ ...prev, renderer })),
  updateVisualizerState: (state: Partial<VisualizerState>) =>
    learnStore.setState(prev => ({
      ...prev,
      visualizerState: { ...prev.visualizerState, ...state },
    })),
};
