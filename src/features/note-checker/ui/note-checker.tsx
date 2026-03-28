import { useEffect, useCallback, useState } from "react";
import { usePlaybackState } from "@/features/learn/model/learn-store";
import { useAudioPitchDetector, type PitchDetectionResult } from "@/shared/lib/audio-pitch";
import {
  noteCheckerStore,
  noteCheckerActions,
  useNoteCheckerEnabled,
  useCorrectNotes,
} from "../model/note-checker-store";
import { NoteIndicator } from "./note-indicator";

interface NoteCheckerProps {
  onNoteDetected?: (result: PitchDetectionResult) => void;
}

export function NoteChecker({ onNoteDetected }: NoteCheckerProps) {
  const enabled = useNoteCheckerEnabled();
  const correctNotes = useCorrectNotes();
  const playbackState = usePlaybackState();
  const config = noteCheckerStore.state.config;
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({ correct: 0, total: 0 });

  const handleNoteDetected = useCallback(
    (result: PitchDetectionResult) => {
      if (!result.note) return;

      noteCheckerActions.checkNote(result.frequency, result.clarity);
      onNoteDetected?.(result);
    },
    [onNoteDetected],
  );

  const { status, start, stop, currentResult } = useAudioPitchDetector({
    clarityThreshold: config.clarityThreshold,
    onNoteDetected: handleNoteDetected,
  });

  useEffect(() => {
    if (enabled && status === "inactive") {
      start();
    } else if (!enabled && status === "listening") {
      stop();
    }
  }, [enabled, status, start, stop]);

  useEffect(() => {
    if (playbackState === "stopped" && enabled) {
      const total = noteCheckerStore.state.playedNotes;
      const correct = correctNotes.length;
      setResultData({ correct, total });
      setShowResult(true);
    }
  }, [playbackState, enabled, correctNotes.length]);

  const toggleEnabled = () => {
    const newEnabled = !noteCheckerStore.state.enabled;
    noteCheckerActions.setEnabled(newEnabled);
    setShowResult(false);

    if (newEnabled) {
      start();
    } else {
      stop();
    }
  };

  const getAccuracyPercent = () => {
    if (resultData.total === 0) return 0;
    return Math.round((resultData.correct / resultData.total) * 100);
  };

  const getResultColor = () => {
    const percent = getAccuracyPercent();
    if (percent >= 80) return "text-green-600";
    if (percent >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm min-h-[100px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Проверка нот</h3>
        <button
          onClick={toggleEnabled}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            enabled
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {enabled ? "Вкл" : "Выкл"}
        </button>
      </div>

      {enabled && (
        <div className="mt-4 space-y-3">
          <NoteIndicator status={status} currentResult={currentResult} />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Окно: {config.timeWindowMs}мс</span>
            <span>Точность: {config.frequencyTolerance}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{
                  width: `${
                    noteCheckerStore.state.playedNotes > 0
                      ? Math.round((correctNotes.length / noteCheckerStore.state.playedNotes) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-sm font-medium text-slate-600 tabular-nums">
              {correctNotes.length}/{noteCheckerStore.state.playedNotes}
            </span>
          </div>
        </div>
      )}

      {showResult && resultData.total > 0 && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Результат</h4>
          <div className="flex items-center gap-4">
            <div className={`text-2xl font-bold ${getResultColor()}`}>{getAccuracyPercent()}%</div>
            <div className="text-sm text-slate-600">
              {resultData.correct} из {resultData.total} нот
            </div>
          </div>
          {getAccuracyPercent() >= 80 && (
            <p className="text-sm text-green-600 mt-2">Отлично! Продолжай в том же духе!</p>
          )}
          {getAccuracyPercent() >= 50 && getAccuracyPercent() < 80 && (
            <p className="text-sm text-yellow-600 mt-2">Хорошо! Ещё немного практики!</p>
          )}
          {getAccuracyPercent() < 50 && (
            <p className="text-sm text-red-600 mt-2">Попробуй медленнее или уменьши темп.</p>
          )}
        </div>
      )}
    </div>
  );
}
