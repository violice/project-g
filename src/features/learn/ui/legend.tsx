import { Info, Lightbulb, Play, Target } from "lucide-react";

interface LegendProps {
  mode: "practice" | "listen";
}

export function Legend({ mode }: LegendProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 sticky top-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Info className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Легенда</h3>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-6 h-6 rounded bg-slate-700 text-white text-center leading-6 font-bold text-xs">
            3
          </span>
          <span className="text-slate-600 font-medium">Номер лада</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
          <span className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500" />
          <span className="text-emerald-800 font-medium">Правильная нота</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
          <span className="w-6 h-6 rounded bg-amber-400/40 border border-amber-400" />
          <span className="text-amber-800 font-medium">Текущая нота</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-100">
          <span className="w-6 h-6 rounded bg-rose-500/30 border border-rose-500" />
          <span className="text-rose-800 font-medium">Тактовая черта</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
          <span className="w-6 h-6 rounded bg-emerald-400 border border-emerald-500" />
          <span className="text-blue-800 font-medium">Позиция</span>
        </div>
      </div>

      {mode === "practice" && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Target className="w-3 h-3 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Включите проверку нот, нажмите{" "}
              <strong className="text-slate-800">Воспроизвести</strong> и играйте.
            </p>
          </div>
        </div>
      )}

      {mode === "listen" && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Play className="w-3 h-3 text-blue-600" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Нажмите <strong className="text-slate-800">Воспроизвести</strong> для прослушивания.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-3 h-3 text-amber-600" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Совет:</strong> Сначала слушайте, потом
            практикуйтесь.
          </p>
        </div>
      </div>
    </div>
  );
}
