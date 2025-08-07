import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { loadAllBlogPosts } from "../../utils/blogLoader";
import Footer from "../../components/footer";

export const Route = createFileRoute("/blog/")({
  component: Blog,
});

export default function Blog() {
  const posts = loadAllBlogPosts();

  return (
    <>
      <Header />

      <main className="zz-blogPaper">
        {/* Lead: Blog index */}
        <article className="zz-blogLead" aria-labelledby="blog-headline">
          <div className="zz-blogKicker">Blog</div>
          <h1 id="blog-headline" className="zz-blogHeadline">
            Posts and notes
          </h1>
          <div className="zz-blogByline">
            Thoughts on engineering, performance, and pragmatic product work.
          </div>
          <p className="zz-blogDeck">
            Essays and shorter notes. New items appear at the top. RSS soon.
          </p>

          <div
            className="zz-blogIndex"
            aria-label="Blog posts"
            style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}
          >
            {posts.length === 0 && (
              <article>
                <h3>No posts yet</h3>
                <p className="zz-blogByline">Check back soon.</p>
              </article>
            )}

            {posts.map((p) => (
              <article key={p.id} className="zz-blogIndexArticle">
                <h3 className="zz-blogIndexHeading">
                  <a href={`/blog/${p.slug}`} className="no-ext">
                    {p.title}
                  </a>
                </h3>
                {p.deck && <p>{p.deck}</p>}
                <div className="zz-blogMeta" style={{ marginTop: 6 }}>
                  {formatDate(p.date || new Date().toISOString())}
                  {p.readTime ? ` · Read time ~${p.readTime}` : null}
                  {p.tags && p.tags.length > 0 ? (
                    <>
                      {" · "}
                      <span className="zz-blogByline">
                        {p.tags.join(" · ")}
                      </span>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {/* <div className="zz-blogPagination">
            <a href="/blog?page=2" className="no-ext">
              Older posts →
            </a>
          </div> */}
        </article>

        {/* Sidebar */}
        <aside className="zz-blogSidebar" aria-label="Sidebar">
          <section className="zz-blogSidebarSection">
            <div className="zz-blogSectionHead">Latest</div>
            <div className="zz-blogTease">
              <h3 className="zz-blogTeaseHeading">
                <a href="/blog/compact-ui" className="no-ext">
                  Designing compact UIs without bloat
                </a>
              </h3>
              <div className="zz-blogMeta">
                Jul 2025 · UI/UX · Read time ~5 min
              </div>
            </div>
            <div className="zz-blogTease">
              <h3 className="zz-blogTeaseHeading">
                <a href="/blog/dockerizing-go" className="no-ext">
                  Dockerizing small Go services
                </a>
              </h3>
              <div className="zz-blogMeta">Jun 2025 · DevOps</div>
            </div>
            <div className="zz-blogTease">
              <h3 className="zz-blogTeaseHeading">
                <a href="/blog/postgres-notes" className="no-ext">
                  PostgreSQL notes: simple patterns
                </a>
              </h3>
              <div className="zz-blogMeta">May 2025 · Database</div>
            </div>
          </section>

          {/* <section className="zz-blogSidebarSection">
            <div className="zz-blogSectionHead">Topics</div>
            <p className="zz-blogTease">
              <a href="/blog/tag/ui-ux" className="no-ext">
                UI/UX
              </a>{" "}
              — Interaction and layout.
            </p>
            <p className="zz-blogTease">
              <a href="/blog/tag/devops" className="no-ext">
                DevOps
              </a>{" "}
              — Docker, CI, ops notes.
            </p>
            <p className="zz-blogTease">
              <a href="/blog/tag/database" className="no-ext">
                Database
              </a>{" "}
              — Postgres and patterns.
            </p>
          </section> */}

          <section className="zz-blogSidebarSection">
            <div className="zz-blogSectionHead">Contact</div>
            <p className="zz-blogTease">
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
