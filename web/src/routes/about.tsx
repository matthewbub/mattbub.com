import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});
export default function About() {
  return (
    <div className="app">
      <h1>About</h1>
    </div>
  );
}
