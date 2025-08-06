import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { loadAllBlogPosts } from "../../utils/blogLoader";
import Footer from "../../components/footer";

export const Route = createFileRoute("/blog/" as any)({
  component: Blog,
});

export default function Blog() {
  const posts = loadAllBlogPosts();

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
                  {formatDate(p.date || new Date().toISOString())}
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

      <Footer />
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
