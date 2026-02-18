import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/second-brain")({
  component: SecondBrainLayout,
});

function SecondBrainLayout() {
  return <Outlet />;
}
