import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import { loadAllBlogPosts } from "../utils/blogLoader";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Home,
});
export default function Home() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });
  console.log(data);
  const posts = loadAllBlogPosts();
  const projects = [
    {
      title: "Yulissa and Matthew's Wedding",
      url: "https://yulissaandmatthew.com",
      description:
        "A wedding website for Yulissa and Matthew with a custom registry and RSVP system.",
      stack: "Next.js · Tailwind CSS",
      year: "2025",
    },
    // {
    //   title: "Static Blog Engine",
    //   url: "https://github.com/matthewbub/mattbub.com",
    //   description:
    //     "Markdown-first publishing with hand-rolled routing, fast builds, and pragmatic DX.",
    //   stack: "React · TanStack Router · Vite",
    //   year: "2025",
    // },
    // {
    //   title: "Go Micro API",
    //   url: "https://github.com/matthewbub/go-micro-api",
    //   description:
    //     "Golang service template focused on small surface area, observability, and easy deployment.",
    //   stack: "Go · Chi · Docker",
    //   year: "2024",
    // },
    // {
    //   title: "Content Tools",
    //   url: "https://github.com/matthewbub/content-tools",
    //   description:
    //     "CLI helpers that turn notes into publishable artifacts with predictable structure.",
    //   stack: "Node · TypeScript",
    //   year: "2023",
    // },
    // {
    //   title: "Drop‑Zone",
    //   url: "https://github.com/matthewbub/react-drop-zone",
    //   description:
    //     "A small drag-and-drop utility focused on accessibility and frictionless uploads.",
    //   stack: "React · TS",
    //   year: "2023",
    // },
    // {
    //   title: "Gravatar Helper",
    //   url: "https://github.com/matthewbub/next-gravatar",
    //   description:
    //     "Micro utility to generate consistent avatar URLs with caching in mind.",
    //   stack: "Next.js · TS",
    //   year: "2022",
    // },
  ];
  return (
    <>
      <Header />
      <main id="front" className="zz-paper">
        <section className="zz-leadStory">
          <div className="zz-kicker">Work</div>
          <h1 className="zz-headline">Web Design and Development</h1>
          <p className="zz-deck">
            I move fast and build beautiful things. Check out my work, or{" "}
            <a href="/contact">hmu</a> for custom work.
          </p>

          <section aria-labelledby="projects-head">
            <h2 id="projects-head" className="zz-sectionHead zz-sansFont">
              Selected Projects
            </h2>
            <div className="zz-index">
              {projects.map((p) => (
                <article key={p.title} className="zz-indexArticle">
                  <h3 className="zz-indexHeading">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer external"
                    >
                      {p.title}
                    </a>
                  </h3>
                  <p className="zz-indexParagraph">{p.description}</p>
                  <div className="zz-meta">
                    {p.stack} · {p.year}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
        <Sidebar posts={posts} />
      </main>
      <Footer />
    </>
  );
}
