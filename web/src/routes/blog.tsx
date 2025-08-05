import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";

export const Route = createFileRoute("/blog")({
  component: Blog,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  deck?: string;
  date: string; // ISO string
  tags?: string[];
  readTime?: string; // e.g., "5 min"
};

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Zed's Intuitive IDE is Reshaping Coding",
    slug: "zeds-intuitive-ide-is-reshaping-coding",
    deck: "Exploring how Zed's approach to editor design focuses on simplicity and performance over feature bloat.",
    date: "2024-12-15T00:00:00Z",
    tags: ["Tools", "IDE", "Performance"],
    readTime: "4 min",
  },
  {
    id: "2",
    title: "Hand Rolling Drop-Zone Components in React",
    slug: "hand-rolling-drop-zone-components-in-react",
    deck: "A step-by-step guide to building custom drag-and-drop file upload components without third-party libraries.",
    date: "2024-12-10T00:00:00Z",
    tags: ["React", "JavaScript", "UI/UX"],
    readTime: "8 min",
  },
  {
    id: "3",
    title: "How I Made My Blog's Content Feel More Immediate",
    slug: "how-i-made-my-blogs-content-feel-more-immediate",
    deck: "Techniques for reducing perceived load times and creating more engaging content experiences.",
    date: "2024-12-05T00:00:00Z",
    tags: ["Performance", "UI/UX", "Web"],
    readTime: "6 min",
  },
  {
    id: "4",
    title: "Vim Motions: A Generalist's Guide",
    slug: "vim-motions-a-generalists-guide",
    deck: "Essential Vim movements and commands for developers who want efficiency without the steep learning curve.",
    date: "2024-11-28T00:00:00Z",
    tags: ["Tools", "Productivity", "Vim"],
    readTime: "7 min",
  },
  {
    id: "5",
    title: "Connect to PostgreSQL with Golang",
    slug: "connect-to-postgresql-with-golang",
    deck: "Setting up database connections, handling migrations, and implementing common patterns in Go applications.",
    date: "2024-11-20T00:00:00Z",
    tags: ["Go", "Database", "PostgreSQL"],
    readTime: "5 min",
  },
  {
    id: "6",
    title: "TailwindCSS Is Good For Us",
    slug: "tailwindcss-is-good-for-us",
    deck: "Why utility-first CSS frameworks lead to more maintainable and scalable styling approaches.",
    date: "2024-11-15T00:00:00Z",
    tags: ["CSS", "TailwindCSS", "Web"],
    readTime: "4 min",
  },
  {
    id: "7",
    title: "Biome: A Next-Gen Code Formatter and Linter",
    slug: "biome-a-next-gen-code-formatter-and-linter",
    deck: "Exploring Biome as a faster, unified alternative to ESLint and Prettier for JavaScript projects.",
    date: "2024-11-08T00:00:00Z",
    tags: ["Tools", "JavaScript", "DevOps"],
    readTime: "5 min",
  },
  {
    id: "8",
    title: "Serving Static Content with Go and Gin",
    slug: "serving-static-content-with-go-and-gin",
    deck: "How to efficiently serve static files and assets in Go web applications using the Gin framework.",
    date: "2024-10-30T00:00:00Z",
    tags: ["Go", "Gin", "Web"],
    readTime: "4 min",
  },
];

export default function Blog() {
  const posts = mockPosts;

  return (
    <>
      <Header />

      <main className="paper">
        {/* Lead: Blog index */}
        <article className="lead" aria-labelledby="blog-headline">
          <div className="kicker">Blog</div>
          <h1 id="blog-headline" className="headline">
            Posts and notes
          </h1>
          <div className="byline">
            Thoughts on engineering, performance, and pragmatic product work.
          </div>
          <p className="deck">
            Essays and shorter notes. New items appear at the top. RSS soon.
          </p>

          <div
            className="index"
            aria-label="Blog posts"
            style={{ borderTop: "1px solid var(--rule)", paddingTop: 10 }}
          >
            {posts.length === 0 && (
              <article>
                <h3>No posts yet</h3>
                <p className="byline">Check back soon.</p>
              </article>
            )}

            {posts.map((p) => (
              <article key={p.id}>
                <h3>
                  <a href={`/blog/${p.slug}`} className="no-ext">
                    {p.title}
                  </a>
                </h3>
                {p.deck && <p>{p.deck}</p>}
                <div className="meta" style={{ marginTop: 6 }}>
                  {formatDate(p.date)}
                  {p.readTime ? ` · Read time ~${p.readTime}` : null}
                  {p.tags && p.tags.length > 0 ? (
                    <>
                      {" · "}
                      <span className="byline">{p.tags.join(" · ")}</span>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {/* Optional: pagination area */}
          <div
            className="byline"
            style={{
              borderTop: "1px solid var(--rule)",
              paddingTop: 10,
              marginTop: 10,
              display: "flex",
              gap: 12,
            }}
          >
            <a href="/blog?page=2" className="no-ext">
              Older posts →
            </a>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="sidebar" aria-label="Sidebar">
          <section>
            <div className="section-head">Latest</div>
            <div className="tease">
              <h3>
                <a href="/blog/compact-ui" className="no-ext">
                  Designing compact UIs without bloat
                </a>
              </h3>
              <div className="meta">Jul 2025 · UI/UX · Read time ~5 min</div>
            </div>
            <div className="tease">
              <h3>
                <a href="/blog/dockerizing-go" className="no-ext">
                  Dockerizing small Go services
                </a>
              </h3>
              <div className="meta">Jun 2025 · DevOps</div>
            </div>
            <div className="tease">
              <h3>
                <a href="/blog/postgres-notes" className="no-ext">
                  PostgreSQL notes: simple patterns
                </a>
              </h3>
              <div className="meta">May 2025 · Database</div>
            </div>
          </section>

          <section>
            <div className="section-head">Topics</div>
            <p className="tease">
              <a href="/blog/tag/ui-ux" className="no-ext">
                UI/UX
              </a>{" "}
              — Interaction and layout.
            </p>
            <p className="tease">
              <a href="/blog/tag/devops" className="no-ext">
                DevOps
              </a>{" "}
              — Docker, CI, ops notes.
            </p>
            <p className="tease">
              <a href="/blog/tag/database" className="no-ext">
                Database
              </a>{" "}
              — Postgres and patterns.
            </p>
          </section>

          <section>
            <div className="section-head">Contact</div>
            <p className="tease">
              Prefer a form?{" "}
              <a href="/contact" className="no-ext">
                Get in touch
              </a>{" "}
              — goes to my database — or send an email.
            </p>
          </section>
        </aside>
      </main>

      <footer>
        <div>
          © <span id="y" /> Matt
        </div>
        <div>hand rolled</div>
      </footer>
    </>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}
