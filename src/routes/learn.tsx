import { useEffect, useRef, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  const [logs, setLogs] = useState<{ message: string; type: "note" | "info" }[]>([
    { message: "Ready to play. Select a song and press Play.", type: "info" },
  ]);
  const [position, setPosition] = useState({ tact: 0, beat: 0, total: 0 });

  const playerRef = useRef<MusicPlayer | null>(null);
  const tabRendererRef = useRef<TabRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: "note" | "info" = "info") => {
    setLogs(prev => [
      ...prev,
      { message: `[${new Date().toLocaleTimeString()}] ${message}`, type },
    ]);
  }, []);

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
      onNote: frequencies => {
        addLog(`Note: ${frequencies.map(f => Math.round(f) + "Hz").join(", ")}`, "note");
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
        addLog("Song ended!", "info");
        setProgress(100);
        setPlaybackState("stopped");
      },
    });

    player.loadComposition(songs[0].composition);

    return () => {
      player.handleAction(MusicActionType.STOP);
    };
  }, [currentSongIndex, addLog]);

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
    addLog("Starting playback...", "info");
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
    addLog("Stopped.", "info");
    if (playerRef.current) {
      playerRef.current.handleAction(MusicActionType.STOP);
    }
  };

  const handleBpmUp = () => {
    songs[currentSongIndex].composition.bpm += 10;
    songs[currentSongIndex].bpm = songs[currentSongIndex].composition.bpm;
    addLog(`BPM increased to ${songs[currentSongIndex].composition.bpm}`, "info");
  };

  const handleBpmDown = () => {
    songs[currentSongIndex].composition.bpm = Math.max(
      60,
      songs[currentSongIndex].composition.bpm - 10,
    );
    songs[currentSongIndex].bpm = songs[currentSongIndex].composition.bpm;
    addLog(`BPM decreased to ${songs[currentSongIndex].composition.bpm}`, "info");
  };

  const handleSelectSong = (index: number) => {
    if (playerRef.current) {
      playerRef.current.handleAction(MusicActionType.STOP);
    }
    setCurrentSongIndex(index);
  };

  const clearLogs = () => {
    setLogs([{ message: "Ready to play. Select a song and press Play.", type: "info" }]);
  };

  return (
    <div className="page-wrap px-4 pb-8 pt-14">
      <h1
        className="display-title text-3xl font-bold text-center mb-2"
        style={{ color: "var(--sea-ink)" }}
      >
        Music Player Demo
      </h1>
      <p className="text-center mb-8" style={{ color: "var(--sea-ink-soft)" }}>
        Guitar synthesizer using Karplus-Strong algorithm
      </p>

      <section className="island-shell p-6 mb-6">
        <h2 className="island-kicker mb-4">Select a Song</h2>
        <div className="flex flex-col gap-3">
          {songs.map((song, index) => (
            <button
              key={index}
              onClick={() => handleSelectSong(index)}
              className={`text-left p-4 rounded-lg border transition-all ${
                index === currentSongIndex
                  ? "border-lagoon-deep bg-lagoon/10"
                  : "border-line bg-surface hover:border-lagoon"
              }`}
              style={{
                backgroundColor:
                  index === currentSongIndex ? "rgba(79, 184, 178, 0.1)" : "var(--surface)",
                borderColor: index === currentSongIndex ? "var(--lagoon-deep)" : "var(--line)",
              }}
            >
              <h3 className="font-semibold" style={{ color: "var(--sea-ink)" }}>
                {song.name}
              </h3>
              <p className="text-sm" style={{ color: "var(--sea-ink-soft)" }}>
                {song.description}
              </p>
              <span
                className="inline-block mt-2 px-2 py-1 rounded text-xs"
                style={{ backgroundColor: "var(--chip-bg)", color: "var(--sea-ink-soft)" }}
              >
                {song.bpm} BPM
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="island-shell p-6 mb-6">
        <h2 className="island-kicker mb-4">Now Playing</h2>
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-lg" style={{ color: "var(--sea-ink)" }}>
              {songs[currentSongIndex].name}
            </span>
            <span
              className="px-3 py-1 rounded text-sm text-white capitalize"
              style={{
                backgroundColor:
                  playbackState === "playing"
                    ? "#4caf50"
                    : playbackState === "paused"
                      ? "#ff9800"
                      : "#666",
              }}
            >
              {playbackState}
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--sea-ink-soft)" }}>
            {songs[currentSongIndex].description} • {songs[currentSongIndex].bpm} BPM
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handlePlay}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "#646cff", color: "white", border: "1px solid #646cff" }}
            >
              Play
            </button>
            <button
              onClick={handlePause}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--chip-bg)", border: "1px solid var(--line)" }}
            >
              Pause
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "#ff4444", color: "white", border: "1px solid #ff4444" }}
            >
              Stop
            </button>
            <button
              onClick={handleBpmUp}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--chip-bg)", border: "1px solid var(--line)" }}
            >
              BPM +10
            </button>
            <button
              onClick={handleBpmDown}
              className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--chip-bg)", border: "1px solid var(--line)" }}
            >
              BPM -10
            </button>
          </div>

          <div className="h-2 rounded overflow-hidden mb-2" style={{ backgroundColor: "#333" }}>
            <div
              className="h-full transition-all duration-150 rounded"
              style={{
                width: `${Math.round(progress)}%`,
                background: "linear-gradient(90deg, #646cff, #bd34fe)",
              }}
            />
          </div>
          <p className="text-sm" style={{ color: "var(--sea-ink-soft)" }}>
            Position:{" "}
            {position.tact === 0 && position.total === 0
              ? "-- / --"
              : `Tact ${position.tact}/${position.total} • Beat ${position.beat}`}
          </p>
        </div>
      </section>

      <section className="island-shell p-6 mb-6">
        <h2 className="island-kicker mb-4">Score Visualization</h2>
        <div
          ref={containerRef}
          className="rounded-lg overflow-x-auto"
          style={{
            backgroundColor: "#1a1a2e",
            minHeight: "200px",
            maxHeight: "400px",
          }}
        />
      </section>

      <section className="island-shell p-6">
        <h2 className="island-kicker mb-4">Event Log</h2>
        <div
          className="rounded-lg p-4 overflow-y-auto font-mono text-sm"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            maxHeight: "200px",
          }}
        >
          {logs.map((log, index) => (
            <div
              key={index}
              style={{
                margin: "0.25rem 0",
                color: log.type === "note" ? "#4fc3f7" : "#aaa",
              }}
            >
              {log.message}
            </div>
          ))}
        </div>
        <button
          onClick={clearLogs}
          className="mt-3 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--chip-bg)", border: "1px solid var(--line)" }}
        >
          Clear Log
        </button>
      </section>
    </div>
  );
}
