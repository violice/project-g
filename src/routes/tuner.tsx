import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Tuner } from "@/widgets/tuner";

export const Route = createFileRoute("/tuner")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
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
      </div>
    </main>
  );
}
