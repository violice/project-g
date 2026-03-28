import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SongSelector, Player, Visualizer } from "@/features/learn";
import { NoteChecker } from "@/features/note-checker";

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 pb-12 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white transition-all"
        >
          <span>&#8592;</span>
          <span>На главную</span>
        </Link>

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-slate-800">Обучение гитаре</h1>
          <p className="text-slate-400 mt-1">Выберите песню и начните учиться</p>
        </div>

        <SongSelector />

        <div className="mb-6">
          <div className="flex gap-3">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Player />
            {mode === "practice" && (
              <div className="mb-6">
                <NoteChecker />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm sticky top-8">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Легенда</h3>
              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-700 text-white text-center leading-5 font-bold">
                    3
                  </span>
                  <span>Номер лада на струне</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/50" />
                  <span>Правильно сыгранная нота</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-amber-400/40 border border-amber-400" />
                  <span>Текущая нота</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-rose-500/30 border border-rose-500" />
                  <span>Тактовая черта</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-400 border" />
                  <span>Позиция воспроизведения</span>
                </div>
              </div>
              {mode === "practice" && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Включите проверку нот, затем нажмите &laquo;Воспроизвести&raquo;. Играйте на
                    гитаре, когда увидите ноту — система проверит, правильно ли вы сыграли.
                  </p>
                </div>
              )}
              {mode === "listen" && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Нажмите &laquo;Воспроизвести&raquo;, чтобы услышать мелодию и увидеть партитуру.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Visualizer />
      </div>
    </main>
  );
}
