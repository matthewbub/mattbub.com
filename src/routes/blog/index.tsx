import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { loadAllBlogPosts } from "../../utils/blogLoader";
import Footer from "../../components/footer";
import Sidebar from "../../components/sidebar";

export const Route = createFileRoute("/blog/")({
  component: Blog,
});

export default function Blog() {
  const posts = loadAllBlogPosts();

  return (
    <>
      <Header />

      <main className="zz-blogPaper">
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
        </article>
        <Sidebar posts={posts} />
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
