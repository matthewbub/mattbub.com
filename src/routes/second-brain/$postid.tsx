import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getSecondBrainPost } from "../../utils/secondBrainLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles.css";

export const Route = createFileRoute("/second-brain/$postid")({
  loader: ({ params }) => getSecondBrainPost(params.postid),
  component: SecondBrainPost,
});

export default function SecondBrainPost() {
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
        <main className="zz-blogPostPaper zz-blogPostPaper--notFound">
          <article className="zz-blogPostLead">
            <h1>Post not found</h1>
            <p>The requested second-brain post could not be found.</p>
            <a href="/second-brain" className="zz-blogPostButton zz--backButton">
              Back to second brain
            </a>
          </article>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="zz-blogPostPaper">
        <article className="zz-blogPostLead" aria-labelledby="post-headline">
          <a href="/second-brain" className="zz-blogPostBackLink">
            Back to second brain
          </a>
          <div className="zz-blogPostKicker">
            {post.tags?.[0] || "Second Brain"}
          </div>
          <h1 id="post-headline" className="zz-blogPostHeadline">
            {post.title}
          </h1>
          <div className="zz-blogPostByline">
            {formatDate(post.date!)} · {post.readTime}
          </div>
          <p className="zz-blogPostDeck">{post.deck}</p>

          <section className="zz-markdownContent zz--blogPost">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
