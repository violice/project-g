import { useState, useEffect, useRef, useCallback } from "react";
import { AudioPitchDetector } from "./audio-pitch.detector";
import { isInTune } from "./audio-pitch.notes";
import type {
  UseAudioPitchDetectorOptions,
  PitchDetectionResult,
  AudioPitchDetectorStatus,
} from "./audio-pitch.types";

export interface UseAudioPitchDetectorReturn {
  status: AudioPitchDetectorStatus;
  currentResult: PitchDetectionResult | null;
  error: string | null;
  isListening: boolean;
  isInTune: boolean;
  detuneAmount: number;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function useAudioPitchDetector(
  options: UseAudioPitchDetectorOptions = {},
): UseAudioPitchDetectorReturn {
  const {
    clarityThreshold = 0.92,
    fftSize = 2048,
    smoothingTimeConstant = 0.1,
    noteNames,
    onNoteDetected,
    onNoteLost,
  } = options;

  const [status, setStatus] = useState<AudioPitchDetectorStatus>("inactive");
  const [currentResult, setCurrentResult] = useState<PitchDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectorRef = useRef<AudioPitchDetector | null>(null);
  const previousResultRef = useRef<PitchDetectionResult | null>(null);

  const handleAnalysis = useCallback(
    (result: PitchDetectionResult | null) => {
      setCurrentResult(result);

      if (result) {
        if (!previousResultRef.current && onNoteDetected) {
          onNoteDetected(result);
        }
        previousResultRef.current = result;
      } else {
        if (previousResultRef.current && onNoteLost) {
          onNoteLost();
        }
        previousResultRef.current = null;
      }
    },
    [onNoteDetected, onNoteLost],
  );

  const start = useCallback(async () => {
    try {
      setError(null);
      setStatus("requesting");

      detectorRef.current = new AudioPitchDetector({
        clarityThreshold,
        fftSize,
        smoothingTimeConstant,
        noteNames,
      });

      await detectorRef.current.start(handleAnalysis);
      setStatus("listening");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start detector";
      setError(message);
      setStatus("error");
    }
  }, [clarityThreshold, fftSize, smoothingTimeConstant, noteNames, handleAnalysis]);

  const stop = useCallback(async () => {
    if (detectorRef.current) {
      await detectorRef.current.stop();
      detectorRef.current = null;
    }
    setCurrentResult(null);
    previousResultRef.current = null;
    setStatus("inactive");
  }, []);

  useEffect(() => {
    return () => {
      detectorRef.current?.stop();
    };
  }, []);

  return {
    status,
    currentResult,
    error,
    isListening: status === "listening",
    isInTune: currentResult ? isInTune(currentResult.note?.cents ?? 0) : false,
    detuneAmount: Math.abs(currentResult?.note?.cents ?? 0),
    start,
    stop,
  };
}
