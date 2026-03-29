import { Music, Clock, Check } from "lucide-react";
import { songs } from "@/shared/data";
import { useSongIndex, learnActions } from "../model/learn-store";

const difficultyLabel = (complexity: number) => {
  if (complexity <= 1)
    return { text: "Легко", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (complexity === 2)
    return { text: "Средне", color: "bg-amber-100 text-amber-700 border-amber-200" };
  return { text: "Сложно", color: "bg-rose-100 text-rose-700 border-rose-200" };
};

export function SongSelector() {
  const currentSongIndex = useSongIndex();

  const handleSelect = (index: number) => {
    learnActions.setSongIndex(index);
  };

  return (
    <section className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Выберите песню</h2>
          <p className="text-xs sm:text-sm text-slate-500">Выберите композицию для обучения</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {songs.map((song, index) => {
          const diff = difficultyLabel(song.composition?.complexity ?? 3);
          const isSelected = index === currentSongIndex;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`text-left p-3 sm:p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2 sm:gap-4 group ${
                isSelected
                  ? "border-blue-400 bg-blue-50 shadow-lg shadow-blue-500/10"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg"
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "bg-blue-500 shadow-lg shadow-blue-500/25"
                    : "bg-gradient-to-br from-blue-400 to-indigo-500"
                }`}
              >
                <Music className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-sm sm:text-lg truncate mb-0.5 sm:mb-1">
                  {song.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 truncate mb-2 sm:mb-3">
                  {song.description}
                </p>

                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    <Clock className="w-3 h-3" />
                    {song.bpm}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold border ${diff.color}`}
                  >
                    {diff.text}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
