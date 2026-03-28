import { createFileRoute, Link } from "@tanstack/react-router";
import { Tuner } from "@/widgets/tuner";

export const Route = createFileRoute("/tuner")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 px-4 pb-8 pt-14">
      <div className="max-w-lg mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
        >
          <span>←</span>
          <span>На главную</span>
        </Link>

        <Tuner />
      </div>
    </main>
  );
}
