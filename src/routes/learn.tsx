import { createFileRoute } from "@tanstack/react-router";
import { LearnPage } from "@/features/learn/ui/learn-page";

export const Route = createFileRoute("/learn")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LearnPage />;
}
