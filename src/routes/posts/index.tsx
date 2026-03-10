import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { loadAllPosts } from "../../utils/postsLoader";
import { formatPostedRelative } from "../../utils/dateFormat";

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
          <h1 className="zz-blogHubTitle">Latest blog posts</h1>
          <p className="zz-blogHubDeck">
            Writing on software engineering, product development, and workflow.
          </p>
        </header>

        <section className="zz-blogHubList" aria-label="All posts">
          {posts.map((post) => (
            <article key={post.id} className="zz-blogHubCard">
              <div className="zz-blogHubCardMeta">
                {formatPostedRelative(post.date || new Date().toISOString())}
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
