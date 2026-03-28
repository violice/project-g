import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SongSelector, Player, Visualizer } from "@/features/learn";
import { usePlaybackState } from "@/features/learn/model/learn-store";
import { Legend } from "@/features/learn/ui/legend";
import { NoteChecker, noteCheckerActions } from "@/features/note-checker";

export const Route = createFileRoute("/learn")({
  component: RouteComponent,
});

type Mode = "listen" | "practice";

function ModeTab({
  label,
  icon,
  description,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
        isActive ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-3 mb-1">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400"
          }`}
        >
          {icon}
        </div>
        <span className="font-semibold text-slate-800">{label}</span>
      </div>
      <p className="text-xs text-slate-400 ml-11">{description}</p>
    </button>
  );
}

function RouteComponent() {
  const [mode, setMode] = useState<Mode>("listen");
  const playbackState = usePlaybackState();

  useEffect(() => {
    if (mode === "practice" && playbackState === "playing") {
      noteCheckerActions.setEnabled(true);
    } else if (playbackState === "stopped") {
      noteCheckerActions.setEnabled(false);
    }
  }, [mode, playbackState]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white transition-all"
          >
            <span>&#8592;</span>
            <span>На главную</span>
          </Link>
        </div>

        <section className="mb-2">
          <h1 className="text-3xl font-bold text-slate-800">Обучение гитаре</h1>
          <p className="text-slate-400 mt-1">Выберите песню и начните учиться</p>
        </section>

        <SongSelector />

        <section className="flex gap-3">
          <ModeTab
            label="Прослушать"
            isActive={mode === "listen"}
            onClick={() => setMode("listen")}
            description="Послушать оригинал и увидеть партитуру"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            }
          />
          <ModeTab
            label="Практиковаться"
            isActive={mode === "practice"}
            onClick={() => setMode("practice")}
            description="Играть на гитаре и проверять ноты"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            }
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Player />
            {mode === "practice" && (
              <div className="mb-6">
                <NoteChecker />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <Legend mode={mode} />
          </div>
        </section>

        <Visualizer />
      </div>
    </main>
  );
}
