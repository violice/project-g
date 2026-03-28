import { createFileRoute, Link } from "@tanstack/react-router";
import { SongSelector, Player, Visualizer } from "@/features/learn";
import { NoteChecker } from "@/features/note-checker";

export const Route = createFileRoute("/learn")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 px-4 pb-8 pt-14">
      <Link
        to="/"
        className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
      >
        <span>&#8592;</span>
        <span>На главную</span>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Music Player Demo</h1>
      <p className="text-center mb-8 text-slate-500">
        Guitar synthesizer using Karplus-Strong algorithm
      </p>

      <SongSelector />
      <Player />
      <NoteChecker />
      <Visualizer />
    </main>
  );
}
