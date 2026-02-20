import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getPost } from "../../utils/postsLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles.css";

export const Route = createFileRoute("/posts/$slug")({
  loader: ({ params }) => getPost(params.slug),
  component: Post,
});

export default function Post() {
  const post = Route.useLoaderData();

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="zz-blogPostPaper">
          <div className="zz-blogPostNotFound">
            <h1>Post not found</h1>
            <p>The requested post could not be found.</p>
            <a href="/posts" className="zz-homeSecondaryLink">
              Back to posts
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="zz-blogPostPaper">
        <article>
          <header className="zz-blogPostHeader">
            <a href="/posts" className="zz-blogPostBackLink">
              Back to posts
            </a>
            {post.tags && post.tags.length > 0 && (
              <div className="zz-blogPostKicker">{post.tags[0]}</div>
            )}
            <h1 className="zz-blogPostHeadline">{post.title}</h1>
            <div className="zz-blogPostByline">
              {formatDate(post.date!)}
              {post.readTime && (
                <>
                  <span className="zz-homePostDivider"> · </span>
                  {post.readTime}
                </>
              )}
              <span className="zz-homePostDivider"> · </span>
              {post.author}
            </div>
            {post.deck && <p className="zz-blogPostDeck">{post.deck}</p>}
          </header>

          <div className="zz-blogPostContent">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
