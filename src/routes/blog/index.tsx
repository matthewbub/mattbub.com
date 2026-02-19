import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { loadAllBlogPosts } from "../../utils/blogLoader";

export const Route = createFileRoute("/blog/")({
  component: Blog,
});

export default function Blog() {
  const posts = loadAllBlogPosts();

  return (
    <>
      <Header />
      <main className="zz-blogHubPaper">
        <header className="zz-blogHubHeader">
          <div className="zz-blogHubKicker">Archive</div>
          <h1 className="zz-blogHubTitle">
            Writing on engineering, product, and creative process
          </h1>
          <p className="zz-blogHubDeck">
            Notes from building software quickly, fixing messy systems, and
            figuring things out in public.
          </p>
        </header>

        <section className="zz-blogHubList" aria-label="All blog posts">
          {posts.map((post) => (
            <article key={post.id} className="zz-blogHubCard">
              <div className="zz-blogHubCardMeta">
                {formatDate(post.date || new Date().toISOString())}
                {post.readTime && (
                  <>
                    <span className="zz-homePostDivider"> · </span>
                    {post.readTime}
                  </>
                )}
              </div>
              <h2 className="zz-blogHubCardTitle">
                <a href={`/blog/${post.slug}`} className="no-ext">
                  {post.title}
                </a>
              </h2>
              {post.deck && (
                <p className="zz-blogHubCardDeck">{post.deck}</p>
              )}
            </article>
          ))}
        </section>
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
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
