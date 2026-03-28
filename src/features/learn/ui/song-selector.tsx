import { songs } from "@/shared/data";
import { useSongIndex, learnActions } from "../model/learn-store";

const difficultyLabel = (complexity: number) => {
  if (complexity <= 1) return { text: "Легко", color: "bg-green-100 text-green-700" };
  if (complexity === 2) return { text: "Средне", color: "bg-yellow-100 text-yellow-700" };
  return { text: "Сложно", color: "bg-red-100 text-red-700" };
};

export function SongSelector() {
  const currentSongIndex = useSongIndex();

  const handleSelect = (index: number) => {
    learnActions.setSongIndex(index);
  };

  return (
    <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Выберите песню</h2>
      <div className="flex flex-col gap-3">
        {songs.map((song, index) => {
          const diff = difficultyLabel(song.composition?.complexity ?? 3);
          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                index === currentSongIndex
                  ? "border-blue-400 bg-blue-50 ring-2 ring-blue-200"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 truncate">{song.name}</h3>
                <p className="text-sm text-slate-500 truncate">{song.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {song.bpm} BPM
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${diff.color}`}
                  >
                    {diff.text}
                  </span>
                </div>
              </div>
              {index === currentSongIndex && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
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
