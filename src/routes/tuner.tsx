import { createFileRoute } from "@tanstack/react-router";
import { Tuner } from "@/shared/components";

export const Route = createFileRoute("/tuner")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Tuner />
    </div>
  );
}
