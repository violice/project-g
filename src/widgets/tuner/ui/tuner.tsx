import { Mic, MicOff, Volume2, Activity, Target } from "lucide-react";
import { useAudioPitchDetector, getStringForFrequency } from "@/shared/lib/audio-pitch";

export const Tuner = () => {
  const { status, currentResult, isListening, isInTune, detuneAmount, start, stop, error } =
    useAudioPitchDetector({
      clarityThreshold: 0.82,
      onNoteDetected: result => {
        console.log("Note detected:", result.note?.name, result.frequency);
      },
      onNoteLost: () => {
        console.log("Note lost");
      },
    });

  const detectedString = currentResult ? getStringForFrequency(currentResult.frequency) : null;

  const getStatusText = () => {
    switch (status) {
      case "inactive":
        return 'Нажмите "Начать", чтобы включить микрофон и начать настройку.';
      case "requesting":
        return "Запрашиваю доступ к микрофону...";
      case "listening":
        return currentResult?.note ? "Нота определена!" : "Ищу стабильную ноту...";
      case "error":
        return error || "Произошла ошибка.";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "inactive":
        return <MicOff className="w-5 h-5" />;
      case "requesting":
        return <Activity className="w-5 h-5 animate-pulse" />;
      case "listening":
        return currentResult?.note ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />;
      case "error":
        return <MicOff className="w-5 h-5" />;
      default:
        return <Mic className="w-5 h-5" />;
    }
  };

  return (
    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Тюнер</h2>
            <p className="text-sm text-slate-500">Настройка гитары</p>
          </div>
        </div>

        <button
          onClick={isListening ? stop : start}
          disabled={status === "requesting"}
          className={`rounded-xl px-6 py-3 font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:-translate-y-0.5 ${
            isListening
              ? "bg-rose-100 text-rose-600 hover:bg-rose-200 border-2 border-rose-200"
              : "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/25 border-2 border-blue-500"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
        >
          {getStatusIcon()}
          {isListening ? "Стоп" : "Начать"}
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div
          className={`w-3 h-3 rounded-full ${
            status === "listening"
              ? isInTune
                ? "bg-emerald-500"
                : "bg-amber-500"
              : status === "error"
                ? "bg-rose-500"
                : "bg-slate-400"
          } ${status === "listening" && !currentResult?.note ? "animate-pulse" : ""}`}
        />
        <p className="text-sm text-slate-600 font-medium">{getStatusText()}</p>
      </div>

      {/* Note Display */}
      {currentResult?.note && (
        <div className="space-y-6">
          {/* Main Note */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-7xl font-extrabold text-slate-800 tracking-tight">
                {currentResult.note.name}
              </span>
              {currentResult.note.octave && (
                <span className="text-2xl font-bold text-slate-400">
                  {currentResult.note.octave}
                </span>
              )}
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-bold shadow-md ${
                isInTune
                  ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200"
                  : "bg-amber-100 text-amber-700 border-2 border-amber-200"
              }`}
            >
              {isInTune
                ? "В строю ✓"
                : `${currentResult.note.cents > 0 ? "↑ " : "↓ "}${Math.abs(currentResult.note.cents)} cents`}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Частота</p>
              <p className="text-lg font-bold text-slate-800 font-mono">
                {currentResult.frequency.toFixed(2)}
                <span className="text-sm text-slate-400 ml-1">Hz</span>
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Струна</p>
              <p className="text-lg font-bold text-slate-800">
                {detectedString ? (
                  <>
                    {detectedString.string}
                    <span className="text-sm text-slate-400 ml-1">({detectedString.note})</span>
                  </>
                ) : (
                  "—"
                )}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Уверенность</p>
              <p className="text-lg font-bold text-slate-800 font-mono">
                {(currentResult.clarity * 100).toFixed(1)}
                <span className="text-sm text-slate-400 ml-1">%</span>
              </p>
            </div>
          </div>

          {/* Tuning Meter */}
          <div className="pt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>↓ Низко</span>
              <span className="text-slate-600 font-medium">В строю</span>
              <span>Высоко ↑</span>
            </div>
            <div className="relative h-6 rounded-full bg-slate-200 overflow-hidden">
              {/* Center marker */}
              <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-slate-400 z-10" />

              {/* Safe zone */}
              <div className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 bg-emerald-200/50 z-0" />

              {/* Indicator bar */}
              <div
                className={`absolute top-1 bottom-1 rounded-full transition-all duration-150 ${
                  isInTune ? "bg-emerald-500" : "bg-amber-500"
                }`}
                style={{
                  left: "50%",
                  width: `${Math.min(Math.abs(detuneAmount) * 1.5, 45)}%`,
                  transform: `translateX(${currentResult.note.cents > 0 ? "0" : "-100%"})`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>-50</span>
              <span className="text-emerald-600 font-bold">0</span>
              <span>+50</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentResult?.note && status !== "error" && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Mic className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">
            {status === "listening" ? "Играйте на гитаре..." : "Нажмите Начать для настройки"}
          </p>
        </div>
      )}
    </section>
  );
};
