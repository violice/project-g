import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Music, Mic2, ArrowLeft, Sparkles } from "lucide-react";
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
  icon: Icon,
  description,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
        isActive
          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center gap-4 mb-2">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isActive
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500"
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <span className="font-bold text-slate-800 text-lg">{label}</span>
      </div>
      <p className="text-sm text-slate-500 ml-16">{description}</p>
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
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white transition-all duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">На главную</span>
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700">Интерактивное обучение</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Обучение гитаре
              </h1>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Выберите песню и начните учиться. Играйте с визуализацией нот и получайте мгновенный
                фидбек.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <SongSelector />

            {/* Mode Selection */}
            <section className="flex flex-col sm:flex-row gap-4">
              <ModeTab
                label="Прослушать"
                isActive={mode === "listen"}
                onClick={() => setMode("listen")}
                description="Послушать оригинал и увидеть партитуру"
                icon={Mic2}
              />
              <ModeTab
                label="Практиковаться"
                isActive={mode === "practice"}
                onClick={() => setMode("practice")}
                description="Играть на гитаре и проверять ноты"
                icon={Music}
              />
            </section>

            {/* Main Content Grid - Player and Legend */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <Player />
                {mode === "practice" && <NoteChecker />}
              </div>
              <div className="lg:col-span-2">
                <Legend mode={mode} />
              </div>
            </section>

            {/* Visualizer - Full Width */}
            <section>
              <Visualizer />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-slate-200 mt-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800">CrazyTunes</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <span>Интерактивное обучение</span>
              <span>•</span>
              <span>Распознавание нот</span>
              <span>•</span>
              <span>Мгновенный фидбек</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
