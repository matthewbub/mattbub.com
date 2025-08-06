import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { useMemo } from "react";
import { getBlogPost } from "../../utils/blogLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../blog.css";
import "../../blog-post.css";
import Footer from "../../components/footer";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getBlogPost(params.slug),
  component: BlogPost,
});

export default function BlogPost() {
  const { slug } = Route.useParams();
  const post = useMemo(() => getBlogPost(slug), [slug]);

  console.log(post);
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
        <main className="paper">
          <article className="lead">
            <h1>Post not found</h1>
            <p>The requested blog post could not be found.</p>
            <a href="/blog" className="zz-button zz--backButton">
              ← Back to blog
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
      <main className="paper">
        <article className="lead" aria-labelledby="post-headline">
          <div className="kicker">{post.tags?.[0] || "Blog"}</div>
          <h1 id="post-headline" className="headline">
            {post.title}
          </h1>
          <div className="byline">
            {formatDate(post.date!)} · {post.readTime}
          </div>
          <p className="deck">{post.deck}</p>

          {/* Markdown content */}
          <section
            className="zz-markdownContent zz--blogPost"
            style={{
              borderTop: "1px solid var(--rule)",
              paddingTop: 20,
              marginTop: 16,
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: (props) => (
                  <h1 className="zz-heading zz--primaryHeading" {...props} />
                ),
                h2: (props) => (
                  <h2 className="zz-heading zz--secondaryHeading" {...props} />
                ),
                h3: (props) => (
                  <h3 className="zz-heading zz--tertiaryHeading" {...props} />
                ),
                p: (props) => (
                  <p className="zz-paragraph zz--bodyText" {...props} />
                ),
                ul: (props) => (
                  <ul className="zz-list zz--unorderedList" {...props} />
                ),
                ol: (props) => (
                  <ol className="zz-list zz--orderedList" {...props} />
                ),
                li: (props) => (
                  <li className="zz-listItem zz--bulletPoint" {...props} />
                ),
                code: (props) => (
                  <code className="zz-code zz--inlineCode" {...props} />
                ),
                pre: (props) => (
                  <pre
                    className="zz-codeBlock zz--syntaxHighlight"
                    {...props}
                  />
                ),
                blockquote: (props) => (
                  <blockquote className="zz-quote zz--blockQuote" {...props} />
                ),
                a: (props) => (
                  <a className="zz-link zz--externalLink" {...props} />
                ),
                strong: (props) => (
                  <strong className="zz-text zz--boldText" {...props} />
                ),
                em: (props) => (
                  <em className="zz-text zz--italicText" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </section>
        </article>

        <aside className="sidebar" aria-label="Sidebar">
          <section>
            <div className="section-head">Related</div>
            <div className="tease">
              <h3>
                <a href="/blog" className="no-ext">
                  ← Back to all posts
                </a>
              </h3>
              <div className="meta">Browse more articles</div>
            </div>
          </section>
        </aside>
      </main>
      <Footer />
    </>
  );
}
