import {
  createElement,
  useState,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getDoc, loadAllDocs } from "../../utils/docsLoader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../styles.css";

export const Route = createFileRoute("/docs/$project")({
  loader: ({ params }) => ({
    doc: getDoc(params.project),
    allDocs: loadAllDocs(),
  }),
  component: DocProject,
});

function useActiveHeading(headingIds: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    if (!headingIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    for (const id of headingIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headingIds]);

  return active;
}

function HeadingRenderer({
  level,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level: 2 | 3 }) {
  const text = extractText(children);
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return createElement(`h${level}`, { id, ...props }, children);
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

export default function DocProject() {
  const { doc, allDocs } = Route.useLoaderData();
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const headingIds = doc ? doc.headings.map((h) => h.id) : [];
  const activeId = useActiveHeading(headingIds);

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  if (!doc) {
    return (
      <>
        <Header />
        <main className="zz-docsPaper">
          <div className="zz-blogPostNotFound">
            <h1>Project not found</h1>
            <p>The requested documentation could not be found.</p>
            <a href="/docs" className="zz-homeSecondaryLink">
              Back to docs
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
      <main className="zz-docsDetailPaper">
        <div className="zz-docsLayout">
          {/* Sidebar */}
          <aside className="zz-docsSidebar" ref={sidebarRef}>
            <div className="zz-docsSidebarInner">
              <a href="/docs" className="zz-docsBackLink">
                All docs
              </a>

              <nav className="zz-docsSidebarNav">
                <div className="zz-docsSidebarTitle">{doc.title}</div>
                <ul className="zz-docsTocList">
                  {doc.headings.map((h) => (
                    <li key={h.id}>
                      <button
                        className={`zz-docsTocItem${h.level === 3 ? " is-sub" : ""}${activeId === h.id ? " is-active" : ""}`}
                        onClick={() => scrollToHeading(h.id)}
                      >
                        {h.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {allDocs.length > 1 && (
                <div className="zz-docsSidebarOther">
                  <div className="zz-docsSidebarLabel">Other docs</div>
                  {allDocs
                    .filter((d) => d.slug !== doc.slug)
                    .map((d) => (
                      <a
                        key={d.slug}
                        href={`/docs/${d.slug}`}
                        className="zz-docsSidebarLink"
                      >
                        {d.title}
                      </a>
                    ))}
                </div>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="zz-docsContent" ref={contentRef}>
            <header className="zz-docsDetailHeader">
              <div className="zz-docsDetailMeta">
                {doc.version && (
                  <span className="zz-docsDetailVersion">v{doc.version}</span>
                )}
                {doc.repo && (
                  <a
                    href={doc.repo}
                    className="zz-docsDetailRepo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
              <h1 className="zz-docsDetailTitle">{doc.title}</h1>
              <p className="zz-docsDetailDesc">{doc.description}</p>
            </header>

            <div className="zz-docsBody">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: (props) => <HeadingRenderer level={2} {...props} />,
                  h3: (props) => <HeadingRenderer level={3} {...props} />,
                }}
              >
                {doc.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
