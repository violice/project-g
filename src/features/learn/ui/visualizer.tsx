import { useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
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
    <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Партитура</h2>
          <p className="text-sm text-slate-500">Визуализация нот и тактов</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="rounded-xl overflow-x-auto border-2 border-slate-200 min-h-[220px] max-h-[450px] bg-slate-50"
      />
    </section>
  );
}
