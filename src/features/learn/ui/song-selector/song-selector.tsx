import { songs } from "@/shared/data";
import { useSongIndex, learnActions } from "../../model/learn-store";

export function SongSelector() {
  const currentSongIndex = useSongIndex();

  const handleSelect = (index: number) => {
    learnActions.setSongIndex(index);
  };

  return (
    <section className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Select a Song</h2>
      <div className="flex flex-col gap-3">
        {songs.map((song, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            className={`text-left p-4 rounded-lg border transition-all ${
              index === currentSongIndex
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <h3 className="font-semibold text-slate-800">{song.name}</h3>
            <p className="text-sm text-slate-500">{song.description}</p>
            <span className="inline-block mt-2 px-2 py-1 rounded text-xs bg-slate-100 text-slate-500">
              {song.bpm} BPM
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
