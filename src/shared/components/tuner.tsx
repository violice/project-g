import { useAudioPitchDetector } from "@/shared/lib/audio-pitch/audio-pitch";

export function Tuner() {
  const { status, currentResult, isListening, isInTune, detuneAmount, start, stop, error } =
    useAudioPitchDetector({
      clarityThreshold: 0.92,
      onNoteDetected: result => {
        console.log("Note detected:", result.note?.name, result.frequency);
      },
      onNoteLost: () => {
        console.log("Note lost");
      },
    });

  const getStatusText = () => {
    switch (status) {
      case "inactive":
        return 'Нажмите "Начать", чтобы включить микрофон.';
      case "requesting":
        return "Запрашиваю доступ к микрофону...";
      case "listening":
        return currentResult?.note ? "Нота определена." : "Ищу стабильную ноту...";
      case "error":
        return error || "Произошла ошибка.";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-xl bg-white/50 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--sea-ink)]">Тюнер</h2>
        <button
          onClick={isListening ? stop : start}
          disabled={status === "requesting"}
          className={`rounded-full px-4 py-2 font-semibold transition ${
            isListening
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-[var(--lagoon-deep)] text-white hover:opacity-90"
          } disabled:opacity-50`}
        >
          {isListening ? "Стоп" : "Начать"}
        </button>
      </div>

      <p className="mb-4 text-sm text-[var(--sea-ink-soft)]">{getStatusText()}</p>

      {currentResult?.note && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-6xl font-bold text-[var(--sea-ink)]">
              {currentResult.note.name}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                isInTune ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isInTune
                ? "В строю"
                : `${currentResult.note.cents > 0 ? "+" : ""}${currentResult.note.cents} cents`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--sea-ink-soft)]">Частота:</span>{" "}
              <span className="font-medium">{currentResult.frequency.toFixed(2)} Hz</span>
            </div>
            <div>
              <span className="text-[var(--sea-ink-soft)]">Уверенность:</span>{" "}
              <span className="font-medium">{(currentResult.clarity * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="relative h-4 rounded-full bg-gray-200">
              <div
                className={`absolute top-0 h-full rounded-full transition-all ${
                  isInTune ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{
                  left: "50%",
                  width: `${Math.min(detuneAmount * 2, 50)}%`,
                  transform: `translateX(${currentResult.note.cents > 0 ? "0" : "-100%"})`,
                }}
              />
              <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gray-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
