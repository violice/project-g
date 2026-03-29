import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-4 py-6 border-t border-slate-200 bg-white/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800">CrazyTunes</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-slate-500 text-center">
          <span>Интерактивное обучение</span>
          <span className="hidden sm:inline">•</span>
          <span>Распознавание нот</span>
          <span className="hidden sm:inline">•</span>
          <span>Мгновенный фидбек</span>
        </div>
      </div>
    </footer>
  );
}
