import { useEffect, useRef } from "react";
import { useCorrectNotes, noteCheckerStore } from "@/features/note-checker";
import { songs } from "@/shared/data";
import { TabRenderer } from "@/shared/lib/tab-renderer";
import { useSongIndex, learnActions } from "../model/learn-store";

export function Visualizer() {
  const currentSongIndex = useSongIndex();
  const correctNotes = useCorrectNotes();
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
      rendererRef.current.resetPlayhead();
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (rendererRef.current && noteCheckerStore.state.enabled) {
      rendererRef.current.updateCorrectNotes(new Set(correctNotes));
    }
  }, [correctNotes]);

  return (
    <section className="bg-white rounded-xl p-5 mb-6 border border-slate-200 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700 mb-4">Партитура</h2>
      <div
        ref={containerRef}
        className="rounded-lg overflow-x-auto border border-slate-200 min-h-[220px] max-h-[450px]"
      />
    </section>
  );
}
