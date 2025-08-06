import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import { useMemo } from "react";
import { getBlogPost } from "../../utils/blogLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../blog.css";
import "../../blog-post.css";

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
    </>
  );
}


/* Markdown Content Styling - zz- prefixed atomic classes */
.zz-markdownContent {
  min-width: 0;
}

/* Headings */
.zz-heading {
  font-family:
    "DM Sans",
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Helvetica,
    Arial,
    "Apple Color Emoji",
    "Segoe UI Emoji";
  color: var(--ink);
}

/* Match blog header/article scales */
.zz--primaryHeading {
  font-size: 28px;
  margin: 24px 0 12px 0;
}

.zz--secondaryHeading {
  font-size: 20px;
  margin: 24px 0 8px;
}

.zz--tertiaryHeading {
  font-size: 16px;
  margin: 18px 0 6px;
}

/* Text elements */
.zz-paragraph {
  margin: 10px 0;
  line-height: 1.65;
  color: var(--ink);
}

.zz--bodyText {
  /* inherits from zz-paragraph */
}

.zz-text {
  /* base text styling */
  color: var(--ink);
}

.zz--boldText {
  font-weight: 600;
}

.zz--italicText {
  font-style: italic;
}

/* Lists */
.zz-list {
  padding-left: 20px;
  margin: 10px 0;
  color: var(--ink);
}

.zz--unorderedList {
  /* inherits from zz-list */
  list-style: disc;
}

.zz--orderedList {
  /* inherits from zz-list */
  list-style: decimal;
}

.zz-listItem,
.zz--bulletPoint {
  margin: 6px 0;
}

/* Code styling (light, to match inline code and overall style) */
.zz-code,
.zz-codeBlock {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
    "Courier New", monospace;
  font-size: 13px;
  color: var(--ink);
}

.zz--inlineCode {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 1px 4px;
}

/* Light code block to replace dark style */
.zz--syntaxHighlight {
  background: #f8fafc;
  color: var(--ink);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  overflow: auto;
  margin: 12px 0;
}

.zz--syntaxHighlight > code {
  color: inherit;
  background: none;
  border: none;
  padding: 0;
}

/* Optional soft token colors for light bg (kept subtle) */
.t-kw {
  color: #1d4ed8;
}
.t-fn {
  color: #065f46;
}
.t-ty {
  color: #92400e;
}
.t-str {
  color: #0657a6;
}
.t-cmt {
  color: #6b7280;
}
.t-num {
  color: #b45309;
}

/* Quotes (match .callout light style) */
.zz-quote,
.zz--blockQuote {
  border-left: 3px solid #cbd5e1;
  padding: 8px 12px;
  margin: 12px 0;
  background: #f8fafc;
  font-style: italic;
  color: var(--ink);
}

/* Links (match global link behavior) */
.zz-link,
.zz--externalLink {
  color: var(--link);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--underline);
  transition:
    color 120ms ease,
    text-decoration-color 120ms ease;
}

.zz-link:hover,
.zz-link:focus,
.zz--externalLink:hover,
.zz--externalLink:focus {
  color: var(--link-hover);
  text-decoration-color: currentColor;
  outline: none;
}

/* Layout positioning */
.zz--blogPost {
  /* allow content to fit the same rhythm as article */
  min-width: 0;
}


---
description:
globs:
  - web/src/**/*.css
  - web/src/**/*.tsx
alwaysApply: true
---

@index.css @index.tsx I want this screen to use my style class names which require things to be extremely unique.

- Colors and fonts are variablized
- All CSS classes should be prefixed with zz-
- All classes use camel case after the intial prefix
- Classes should be generic. Atomic design
- Classes with zz-- are alignment values specific to the element and alignment on page
- Classes with zz- are defining characterisitcs
- I would rather classes be unique, so that if I ever need to change one elemnts value, i don't wreck the whole app. An execption to this is when mapping through content.
- I HATE cards, never use cards in design

Example
<a class="zz-button zz--contactFormButton">...

.zz-button {
/_ ..styles that make it look pretty by default _/
}

.zz-button:hover {
/_ hover state _/
}

.zz-contactFormButton {
align-self: end;
}
