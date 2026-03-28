import { useEffect, useRef } from "react";
import { noteCheckerActions, noteCheckerStore } from "@/features/note-checker";
import { songs } from "@/shared/data";
import { MusicPlayer, MusicActionType } from "@/shared/lib/music-player";
import type { Composition } from "@/shared/lib/music-player";
import {
  useSongIndex,
  usePlaybackState,
  useProgress,
  usePosition,
  usePlaybackSpeed,
  useRenderer,
  learnActions,
} from "../model/learn-store";

interface PlayerProps {
  playerRef?: React.MutableRefObject<MusicPlayer | null>;
}

function cloneWithBpm(composition: Composition, bpm: number): Composition {
  return JSON.parse(JSON.stringify({ ...composition, bpm }));
}

export function Player({ playerRef }: PlayerProps) {
  const currentSongIndex = useSongIndex();
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const position = usePosition();
  const playbackSpeed = usePlaybackSpeed();

  const internalPlayerRef = useRef<MusicPlayer | null>(null);
  const activePlayerRef = playerRef ?? internalPlayerRef;
  const renderer = useRenderer();
  const rendererRef = useRef(renderer);
  rendererRef.current = renderer;

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
        noteCheckerActions.reset();
        rendererRef.current?.resetPlayhead();
      },
      onPause: () => learnActions.setPlaybackState("paused"),
      onStop: () => {
        learnActions.setPlaybackState("stopped");
        learnActions.setProgress(0);
        learnActions.setPosition({ tact: 0, beat: 0, total: 0 });
        learnActions.updateVisualizerState({ currentTact: 0, currentNote: 0, columnIndex: 0 });
        noteCheckerActions.reset();
        rendererRef.current?.resetPlayhead();
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
      onProgress: progress => {
        if (rendererRef.current) {
          rendererRef.current.updatePlayheadProgress({
            tactIndex: progress.tactIndex,
            noteIndex: progress.noteIndex,
            fraction: progress.fraction,
          });
        }
      },
      onEnd: () => {
        learnActions.setProgress(100);
        learnActions.setPlaybackState("stopped");
      },
    });

    const baseBpm = songs[0].bpm;
    const actualBpm = Math.round(baseBpm * playbackSpeed);
    player.loadComposition(cloneWithBpm(songs[0].composition, actualBpm));

    return () => {
      player.handleAction(MusicActionType.STOP);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (activePlayerRef.current) {
      const baseBpm = songs[currentSongIndex].bpm;
      const actualBpm = Math.round(baseBpm * playbackSpeed);
      const comp = cloneWithBpm(songs[currentSongIndex].composition, actualBpm);
      activePlayerRef.current.loadComposition(comp);
    }
  }, [currentSongIndex, playbackSpeed]);

  const handlePlay = () => {
    if (activePlayerRef.current) {
      const baseBpm = songs[currentSongIndex].bpm;
      const actualBpm = Math.round(baseBpm * playbackSpeed);
      const comp = cloneWithBpm(songs[currentSongIndex].composition, actualBpm);
      activePlayerRef.current.loadComposition(comp);
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
    const newSpeed = Math.min(2, playbackSpeed + 0.1);
    learnActions.setPlaybackSpeed(parseFloat(newSpeed.toFixed(1)));
  };

  const handleBpmDown = () => {
    const newSpeed = Math.max(0.1, playbackSpeed - 0.1);
    learnActions.setPlaybackSpeed(parseFloat(newSpeed.toFixed(1)));
  };

  const statusColors = {
    playing: "bg-emerald-500",
    paused: "bg-amber-500",
    stopped: "bg-slate-400",
  };
  const statusLabels = { playing: "Играет", paused: "Пауза", stopped: "Остановлено" };

  return (
    <section className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <span className="font-semibold text-xl text-slate-800">{songs[currentSongIndex].name}</span>
        <span
          className={`px-3 py-1 rounded-full text-sm text-white font-medium ${statusColors[playbackState]}`}
        >
          {statusLabels[playbackState]}
        </span>
      </div>
      <p className="text-sm mb-5 text-slate-400">
        {songs[currentSongIndex].description} &bull; {songs[currentSongIndex].bpm} BPM
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <button
          onClick={handlePlay}
          className="px-4 py-2.5 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-sm flex items-center gap-2"
        >
          <span>&#9654;</span> Воспроизвести
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2.5 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all shadow-sm flex items-center gap-2"
        >
          <span>&#10074;&#10074;</span> Пауза
        </button>
        <button
          onClick={handleStop}
          className="px-4 py-2.5 rounded-lg font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all shadow-sm flex items-center gap-2"
        >
          <span>&#9632;</span> Стоп
        </button>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2.5 shadow-sm">
          <span className="text-xs font-semibold text-slate-700">Скорость:</span>
          <button
            onClick={handleBpmDown}
            className="px-2 py-0.5 rounded-md font-bold text-slate-600 hover:bg-slate-200 transition-all"
          >
            -
          </button>
          <span className="py-0.5 text-sm font-mono font-bold text-slate-700 min-w-[48px] text-center">
            {playbackSpeed.toFixed(1)}x
          </span>
          <button
            onClick={handleBpmUp}
            className="px-2 py-0.5 rounded-md font-bold text-slate-600 hover:bg-slate-200 transition-all"
          >
            +
          </button>
        </div>
      </div>

      <div className="h-2 rounded-full overflow-hidden mb-2 bg-slate-200">
        <div
          className="h-full transition-all duration-150 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 font-mono">
        {position.tact === 0 && position.total === 0
          ? "---"
          : `Такт ${position.tact}/${position.total} \u2022 Доля ${position.beat}`}
      </p>
    </section>
  );
}
