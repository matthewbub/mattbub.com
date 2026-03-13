import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { loadAllDocs } from "../../utils/docsLoader";
import "../../styles.css";

export const Route = createFileRoute("/docs/")({
  loader: () => ({ docs: loadAllDocs() }),
  component: DocsIndex,
});

export default function DocsIndex() {
  const { docs } = Route.useLoaderData();

  return (
    <>
      <Header />
      <main className="zz-docsPaper">
        <header className="zz-docsHubHeader">
          <p className="zz-docsKicker">Open Source</p>
          <h1 className="zz-docsHubTitle">Documentation</h1>
          <p className="zz-docsHubDeck">
            Technical references for projects I've built and contributed to.
            Everything here is open source.
          </p>
        </header>

        <div className="zz-docsGrid">
          {docs.map((doc) => (
            <a
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="zz-docsCard"
            >
              <div className="zz-docsCardInner">
                <div className="zz-docsCardHead">
                  <h2 className="zz-docsCardTitle">{doc.title}</h2>
                  {doc.version && (
                    <span className="zz-docsCardVersion">v{doc.version}</span>
                  )}
                </div>
                <p className="zz-docsCardDesc">{doc.description}</p>
                <div className="zz-docsCardFoot">
                  <span className="zz-docsCardSections">
                    {doc.headings.filter((h) => h.level === 2).length} sections
                  </span>
                  <span className="zz-docsCardArrow">&rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
