import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { songs } from "@/shared/data";
import { MusicPlayer, MusicActionType } from "@/shared/lib/music-player";
import { TabRenderer } from "@/shared/lib/tab-renderer";

export const Route = createFileRoute("/learn")({
  component: RouteComponent,
});

function RouteComponent() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playbackState, setPlaybackState] = useState<"playing" | "paused" | "stopped">("stopped");
  const [progress, setProgress] = useState(0);
  const [position, setPosition] = useState({ tact: 0, beat: 0, total: 0 });

  const playerRef = useRef<MusicPlayer | null>(null);
  const tabRendererRef = useRef<TabRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const player = new MusicPlayer();
    playerRef.current = player;

    player.setEvents({
      onPlay: () => {
        setPlaybackState("playing");
        setProgress(0);
      },
      onPause: () => setPlaybackState("paused"),
      onStop: () => {
        setPlaybackState("stopped");
        setProgress(0);
        setPosition({ tact: 0, beat: 0, total: 0 });
      },
      onTick: pos => {
        const staves = songs[currentSongIndex].composition.staves[0].tacts;
        let columnIndex = 0;
        const tactCount = staves.length;

        for (let i = 0; i < staves.length; i++) {
          if (i === pos.tact) {
            columnIndex += pos.note;
            break;
          }
          columnIndex += staves[i].notes.length;
        }

        if (tabRendererRef.current) {
          tabRendererRef.current.updateState({
            currentTact: pos.tact,
            currentNote: pos.note,
            columnIndex,
          });
        }

        const totalColumns = staves.reduce((sum, t) => sum + t.notes.length, 0);
        const newProgress = Math.min(100, (columnIndex / Math.max(1, totalColumns - 1)) * 100);
        setProgress(newProgress);
        setPosition({ tact: pos.tact + 1, beat: pos.note + 1, total: tactCount });
      },
      onEnd: () => {
        setProgress(100);
        setPlaybackState("stopped");
      },
    });

    player.loadComposition(songs[0].composition);

    return () => {
      player.handleAction(MusicActionType.STOP);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (containerRef.current && !tabRendererRef.current) {
      const renderer = new TabRenderer(containerRef.current, {
        showTactNumbers: true,
      });
      tabRendererRef.current = renderer;
      renderer.render(songs[currentSongIndex].composition);
      renderer.updateState({ currentTact: 0, currentNote: 0, columnIndex: 0 });
    }

    return () => {
      if (tabRendererRef.current) {
        tabRendererRef.current.destroy();
        tabRendererRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (tabRendererRef.current) {
      tabRendererRef.current.render(songs[currentSongIndex].composition);
      tabRendererRef.current.updateState({ currentTact: 0, currentNote: 0, columnIndex: 0 });
    }
    if (playerRef.current) {
      playerRef.current.loadComposition(songs[currentSongIndex].composition);
    }
  }, [currentSongIndex]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.loadComposition(songs[currentSongIndex].composition);
      playerRef.current.handleAction(MusicActionType.PLAY);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.handleAction(MusicActionType.SUSPEND);
    }
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.handleAction(MusicActionType.STOP);
    }
  };

  const handleBpmUp = () => {
    songs[currentSongIndex].composition.bpm += 10;
    songs[currentSongIndex].bpm = songs[currentSongIndex].composition.bpm;
  };

  const handleBpmDown = () => {
    songs[currentSongIndex].composition.bpm = Math.max(
      60,
      songs[currentSongIndex].composition.bpm - 10,
    );
    songs[currentSongIndex].bpm = songs[currentSongIndex].composition.bpm;
  };

  const handleSelectSong = (index: number) => {
    if (playerRef.current) {
      playerRef.current.handleAction(MusicActionType.STOP);
    }
    setCurrentSongIndex(index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 px-4 pb-8 pt-14">
      <Link
        to="/"
        className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
      >
        <span>←</span>
        <span>На главную</span>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Music Player Demo</h1>
      <p className="text-center mb-8 text-slate-500">
        Guitar synthesizer using Karplus-Strong algorithm
      </p>

      <section className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Select a Song</h2>
        <div className="flex flex-col gap-3">
          {songs.map((song, index) => (
            <button
              key={index}
              onClick={() => handleSelectSong(index)}
              className={`text-left p-4 rounded-lg border transition-all ${
                index === currentSongIndex
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <h3 className="font-semibold text-slate-800">{song.name}</h3>
              <p className="text-sm text-slate-500">{song.description}</p>
              <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-slate-100 text-slate-500">
                {song.bpm} BPM
              </span>
            </button>
          ))}
        </div>
      </section>

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
            {songs[currentSongIndex].description} • {songs[currentSongIndex].bpm} BPM
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
              : `Tact ${position.tact}/${position.total} • Beat ${position.beat}`}
          </p>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Score Visualization</h2>
        <div
          ref={containerRef}
          className="rounded-lg overflow-x-auto bg-slate-900 min-h-[200px] max-h-[400px]"
        />
      </section>
    </main>
  );
}
