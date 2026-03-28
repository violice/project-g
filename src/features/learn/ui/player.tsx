import { useEffect, useRef } from "react";
import { noteCheckerActions, noteCheckerStore } from "@/features/note-checker";
import { songs } from "@/shared/data";
import { MusicPlayer, MusicActionType } from "@/shared/lib/music-player";
import {
  useSongIndex,
  usePlaybackState,
  useProgress,
  usePosition,
  learnActions,
} from "../model/learn-store";

interface PlayerProps {
  playerRef?: React.MutableRefObject<MusicPlayer | null>;
}

export function Player({ playerRef }: PlayerProps) {
  const currentSongIndex = useSongIndex();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const position = usePosition();

  const internalPlayerRef = useRef<MusicPlayer | null>(null);
  const activePlayerRef = playerRef ?? internalPlayerRef;

  const handleNoteCheck = (frequencies: number[], tact: number, note: number) => {
    if (noteCheckerStore.state.enabled && frequencies.length > 0) {
      noteCheckerActions.setExpectedFrequencies(frequencies);
      noteCheckerActions.updatePosition(tact, note);
    }
  };

  useEffect(() => {
    const player = new MusicPlayer();
    activePlayerRef.current = player;

    player.setEvents({
      onPlay: () => {
        learnActions.setPlaybackState("playing");
        learnActions.setProgress(0);
        learnActions.updateVisualizerState({ currentTact: 0, currentNote: 0, columnIndex: 0 });
        if (noteCheckerStore.state.enabled) {
          noteCheckerActions.reset();
        }
      },
      onPause: () => learnActions.setPlaybackState("paused"),
      onStop: () => {
        learnActions.setPlaybackState("stopped");
        learnActions.setProgress(0);
        learnActions.setPosition({ tact: 0, beat: 0, total: 0 });
        learnActions.updateVisualizerState({ currentTact: 0, currentNote: 0, columnIndex: 0 });
        noteCheckerActions.reset();
      },
      onNote: (frequencies, tact, note) => {
        handleNoteCheck(frequencies, tact, note);
      },
      onTick: pos => {
        const staves = songs[currentSongIndex].composition.staves[0].tacts;
        let columnIndex = 0;

        for (let i = 0; i < staves.length; i++) {
          if (i === pos.tact) {
            columnIndex += pos.note;
            break;
          }
          columnIndex += staves[i].notes.length;
        }

        const totalColumns = staves.reduce((sum, t) => sum + t.notes.length, 0);
        const newProgress = Math.min(100, (columnIndex / Math.max(1, totalColumns - 1)) * 100);
        learnActions.setProgress(newProgress);
        learnActions.setPosition({
          tact: pos.tact + 1,
          beat: pos.note + 1,
          total: staves.length,
        });
        learnActions.updateVisualizerState({
          currentTact: pos.tact,
          currentNote: pos.note,
          columnIndex,
        });
      },
      onEnd: () => {
        learnActions.setProgress(100);
        learnActions.setPlaybackState("stopped");
      },
    });

    player.loadComposition(songs[0].composition);

    return () => {
      player.handleAction(MusicActionType.STOP);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (activePlayerRef.current) {
      activePlayerRef.current.loadComposition(songs[currentSongIndex].composition);
    }
  }, [currentSongIndex]);

  const handlePlay = () => {
    if (activePlayerRef.current) {
      activePlayerRef.current.loadComposition(songs[currentSongIndex].composition);
      activePlayerRef.current.handleAction(MusicActionType.PLAY);
    }
  };

  const handlePause = () => {
    if (activePlayerRef.current) {
      activePlayerRef.current.handleAction(MusicActionType.SUSPEND);
    }
  };

  const handleStop = () => {
    if (activePlayerRef.current) {
      activePlayerRef.current.handleAction(MusicActionType.STOP);
    }
  };

  const handleBpmUp = () => {
    const newBpm = songs[currentSongIndex].composition.bpm + 10;
    songs[currentSongIndex].composition.bpm = newBpm;
    songs[currentSongIndex].bpm = newBpm;
    learnActions.setBpm(newBpm);
  };

  const handleBpmDown = () => {
    const newBpm = Math.max(60, songs[currentSongIndex].composition.bpm - 10);
    songs[currentSongIndex].composition.bpm = newBpm;
    songs[currentSongIndex].bpm = newBpm;
    learnActions.setBpm(newBpm);
  };

  return (
    <section className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Now Playing</h2>
      <div className="rounded-lg p-4 mb-4 bg-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-lg text-slate-800">
            {songs[currentSongIndex].name}
          </span>
          <span
            className={`px-3 py-1 rounded text-sm text-white capitalize ${
              playbackState === "playing"
                ? "bg-green-500"
                : playbackState === "paused"
                  ? "bg-yellow-500"
                  : "bg-slate-500"
            }`}
          >
            {playbackState}
          </span>
        </div>
        <p className="text-sm mb-4 text-slate-500">
          {songs[currentSongIndex].description} &bull; {songs[currentSongIndex].bpm} BPM
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handlePlay}
            className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            Play
          </button>
          <button
            onClick={handlePause}
            className="px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
          >
            Pause
          </button>
          <button
            onClick={handleStop}
            className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            Stop
          </button>
          <button
            onClick={handleBpmUp}
            className="px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
          >
            BPM +10
          </button>
          <button
            onClick={handleBpmDown}
            className="px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all"
          >
            BPM -10
          </button>
        </div>

        <div className="h-2 rounded overflow-hidden mb-2 bg-slate-300">
          <div
            className="h-full transition-all duration-150 rounded bg-gradient-to-r from-blue-500 to-blue-400"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="text-sm text-slate-500">
          Position:{" "}
          {position.tact === 0 && position.total === 0
            ? "-- / --"
            : `Tact ${position.tact}/${position.total} \u2022 Beat ${position.beat}`}
        </p>
      </div>
    </section>
  );
}
