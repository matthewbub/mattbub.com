import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { loadAllPosts } from "../../utils/postsLoader";

export const Route = createFileRoute("/posts/")({
  component: Posts,
});

export default function Posts() {
  const posts = loadAllPosts();

  return (
    <>
      <Header />
      <main className="zz-blogHubPaper">
        <header className="zz-blogHubHeader">
          <div className="zz-blogHubKicker">Archive</div>
          <h1 className="zz-blogHubTitle">Latest posts across Blog + Marvin</h1>
          <p className="zz-blogHubDeck">
            Combined writing feed from human-authored blog notes and
            second-brain AI entries.
          </p>
        </header>

        <section className="zz-blogHubList" aria-label="All posts">
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
                <a href={`/posts/${post.slug}`} className="no-ext">
                  {post.title}
                </a>
              </h2>
              {post.deck && <p className="zz-blogHubCardDeck">{post.deck}</p>}
              <p className="zz-blogHubCardDeck">{post.author}</p>
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
