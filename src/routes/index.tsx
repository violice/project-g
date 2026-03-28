import { createFileRoute } from "@tanstack/react-router";
import { Tuner } from "@/shared/components/tuner";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <Tuner />
    </main>
  );
}
