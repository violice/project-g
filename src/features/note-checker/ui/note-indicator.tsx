import type { PitchDetectionResult } from "@/shared/lib/audio-pitch";

interface NoteIndicatorProps {
  status: "inactive" | "requesting" | "listening" | "error";
  currentResult: PitchDetectionResult | null;
}

export function NoteIndicator({ status, currentResult }: NoteIndicatorProps) {
  const getStatusText = () => {
    switch (status) {
      case "inactive":
        return "Ожидание...";
      case "requesting":
        return "Запрос доступа к микрофону...";
      case "listening":
        return "Слушаю...";
      case "error":
        return "Ошибка";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-3 h-3 rounded-full ${
          status === "listening"
            ? "bg-green-500 animate-pulse"
            : status === "error"
              ? "bg-red-500"
              : "bg-slate-300"
        }`}
      />
      <div className="flex-1">
        <span className="text-sm text-slate-600">{getStatusText()}</span>
      </div>
      {currentResult?.note && (
        <div className="text-lg font-bold text-slate-800">{currentResult.note.name}</div>
      )}
    </div>
  );
}
