import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { getBlogPost } from "../../utils/blogLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles.css";
import Footer from "../../components/footer";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getBlogPost(params.slug),
  component: BlogPost,
});

export default function BlogPost() {
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
            <p>The requested blog post could not be found.</p>
            <a href="/blog" className="zz-homeSecondaryLink">
              Back to archive
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
            <a href="/blog" className="zz-blogPostBackLink">
              Back to archive
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
