import { useEffect, useRef } from "react";
import { Play, Pause, Square, Gauge, Music } from "lucide-react";
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
    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{songs[currentSongIndex].name}</h2>
            <p className="text-sm text-slate-500">
              {songs[currentSongIndex].description} • {songs[currentSongIndex].bpm} BPM
            </p>
          </div>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm text-white font-bold shadow-lg ${statusColors[playbackState]}`}
        >
          {statusLabels[playbackState]}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={handlePlay}
          className="px-6 py-3 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Play className="w-5 h-5" /> Воспроизвести
        </button>

        <button
          onClick={handlePause}
          className="px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Pause className="w-5 h-5" /> Пауза
        </button>

        <button
          onClick={handleStop}
          className="px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-slate-200 transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Square className="w-5 h-5" /> Стоп
        </button>

        <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-3 border-2 border-slate-200">
          <Gauge className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-bold text-slate-700">Скорость:</span>
          <button
            onClick={handleBpmDown}
            className="w-8 h-8 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center"
          >
            −
          </button>
          <span className="text-base font-mono font-bold text-slate-700 min-w-[56px] text-center">
            {playbackSpeed.toFixed(1)}x
          </span>
          <button
            onClick={handleBpmUp}
            className="w-8 h-8 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="h-3 rounded-full overflow-hidden bg-slate-200">
          <div
            className="h-full transition-all duration-150 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="text-sm text-slate-500 font-mono font-medium">
          {position.tact === 0 && position.total === 0
            ? "Готово к воспроизведению"
            : `Такт ${position.tact}/${position.total} • Доля ${position.beat}`}
        </p>
      </div>
    </section>
  );
}
