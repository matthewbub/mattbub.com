import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { useMemo } from "react";
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
        <main className="zz-blogPostPaper">
          <article className="zz-blogPostLead">
            <h1>Post not found</h1>
            <p>The requested blog post could not be found.</p>
            <a href="/blog" className="zz-blogPostButton zz--backButton">
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
      <main className="zz-blogPostPaper">
        <article className="zz-blogPostLead" aria-labelledby="post-headline">
          <div className="zz-blogPostKicker">{post.tags?.[0] || "Blog"}</div>
          <h1 id="post-headline" className="zz-blogPostHeadline">
            {post.title}
          </h1>
          <div className="zz-blogPostByline">
            {formatDate(post.date!)} · {post.readTime}
          </div>
          <p className="zz-blogPostDeck">{post.deck}</p>

          {/* Markdown content */}
          <section
            className="zz-markdownContent zz--blogPost"
            style={{
              borderTop: "1px solid var(--border)",
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
                p: (props) => <p className="zz-paragraph" {...props} />,
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

        <aside className="zz-blogPostSidebar" aria-label="Sidebar">
          <section className="zz-blogPostSidebarSection">
            <div className="zz-blogPostSectionHead">Related</div>
            <div className="zz-blogPostTease">
              <h3 className="zz-blogPostTeaseHeading">
                <a href="/blog" className="no-ext zz-link">
                  ← Back to all posts
                </a>
              </h3>
              <div className="zz-blogPostMeta">Browse more articles</div>
            </div>
          </section>
        </aside>
      </main>
      <Footer />
    </>
  );
}
