interface LegendProps {
  mode: "practice" | "listen";
}

export function Legend({ mode }: LegendProps) {
  return (
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
            Включите проверку нот, затем нажмите &laquo;Воспроизвести&raquo;. Играйте на гитаре,
            когда увидите ноту — система проверит, правильно ли вы сыграли.
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
  );
}
