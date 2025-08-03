import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Home,
});
export default function Home() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  return (
    <div className="app">
      <p>Page views: {data?.page_views}</p>
      {/* <header>
        <nav className="headerNav">
          <ul className="headerNavList">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header> */}
      <main>
        <h1>Hey I'm Matt</h1>
        <p>
          I'm a software engineer working on web applications. I enjoy working
          on the full stack, learning new skills and working with good folks to
          build great software.
        </p>
        <h2>Career</h2>
        <p>
          I've been with mPulse (formerly HealthTrio LLC.) since 2021. I develop
          and maintain web portal services for healthcare systems that service
          millions of patients using Web technologies.
        </p>
        <h2>School</h2>
        <p>
          I'm currently pursing a degree in Computer Science at the University
          of People in my free time.
        </p>
        <h2>Contact</h2>
        <p>
          You can reach me at{" "}
          <a href="mailto:6matbub@gmail.com">6matbub@gmail.com</a>.
        </p>
      </main>
    </div>
  );
}
