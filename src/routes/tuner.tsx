import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Music, Sparkles } from "lucide-react";
import { Tuner } from "@/widgets/tuner";

export const Route = createFileRoute("/tuner")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
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
                <span className="text-sm font-semibold text-blue-700">
                  Точное распознавание частот
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Тюнер
              </h1>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Настройте гитару с помощью микрофона. Точное распознавание частот в реальном
                времени.
              </p>
            </div>
          </div>

          {/* Tuner Widget */}
          <div className="max-w-3xl mx-auto">
            <Tuner />
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 py-6 border-t border-slate-200 bg-white/50">
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
