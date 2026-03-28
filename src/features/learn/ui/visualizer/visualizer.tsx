import { useEffect, useRef } from "react";
import { songs } from "@/shared/data";
import { TabRenderer } from "@/shared/lib/tab-renderer";
import { useSongIndex, useVisualizerState, learnActions } from "../../model/learn-store";

export function Visualizer() {
  const currentSongIndex = useSongIndex();
  const visualizerState = useVisualizerState();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<TabRenderer | null>(null);

  useEffect(() => {
    if (containerRef.current && !rendererRef.current) {
      const renderer = new TabRenderer(containerRef.current, {
        showTactNumbers: true,
      });
      rendererRef.current = renderer;
      learnActions.setRenderer(renderer);
      renderer.render(songs[currentSongIndex].composition);
      renderer.updateState({ currentTact: 0, currentNote: 0, columnIndex: 0 });
    }

    return () => {
      if (rendererRef.current) {
        rendererRef.current.destroy();
        rendererRef.current = null;
        learnActions.setRenderer(null);
      }
    };
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.render(songs[currentSongIndex].composition);
      rendererRef.current.updateState({
        currentTact: 0,
        currentNote: 0,
        columnIndex: 0,
      });
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.updateState({
        currentTact: visualizerState.currentTact,
        currentNote: visualizerState.currentNote,
        columnIndex: visualizerState.columnIndex,
      });
    }
  }, [visualizerState]);

  return (
    <section className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Score Visualization</h2>
      <div
        ref={containerRef}
        className="rounded-lg overflow-x-auto bg-slate-900 min-h-[200px] max-h-[400px]"
      />
    </section>
  );
}
