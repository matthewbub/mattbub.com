import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";

export const Route = createFileRoute("/")({
  component: Home,
});
export default function Home() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });

  console.log(data);
  return (
    <>
      {/* Masthead */}
      <Header />
      {/* Newspaper layout */}
      <main id="front" className="paper">
        {/* Lead story */}
        <article className="lead" aria-labelledby="lead-headline">
          <div className="kicker">Profile</div>
          <h1 id="lead-headline" className="headline">
            Hey, I'm Matt — software engineer building big web apps
          </h1>
          <div className="byline">
            Full‑stack engineer, specializing in Go + TypeScript, Docker, and
            cloud infrastructure
          </div>
          <p className="deck">
            Currently at mPulse (formerly HealthTrio LLC.), developing and
            maintaining web portal services for healthcare systems used by
            millions of patients.
          </p>
          <div className="columns">
            <p>
              My focus is pragmatic engineering: clear boundaries, simple data
              flows, and predictable deployments. I prefer minimal tooling with
              strong defaults. The result is software that feels fast and gets
              out of your way.
            </p>
            <p>
              I work across the stack: Go services, TypeScript/React interfaces,
              PostgreSQL, and a bias toward Dockerized runtimes behind Nginx and
              Cloudflare. Accessibility and performance are non‑negotiable.
            </p>
            <p>
              You'll find me iterating on small details: latency budgets, tidy
              schemas, and production‑ready observability. I enjoy working with
              good folks to build great software.
            </p>
          </div>
          <p className="meta">
            Based online · Open to interesting problems ·
            <a href="mailto:6matbub@gmail.com" className="no-ext">
              Email me
            </a>
          </p>
          {/* Indexes like a front page */}
          <section id="projects" className="index" aria-label="Projects index">
            <article>
              <h3>
                Portfolio Platform
                <span className="kicker" style={{ marginLeft: 6 }}>
                  in progress
                </span>
              </h3>
              <p>
                Go backend, Dockerized runtime, and a lightweight CMS for posts
                and case studies.
                <a
                  href="https://github.com/yourname/portfolio"
                  target="_blank"
                  rel="noopener noreferrer external"
                >
                  Repo
                </a>
              </p>
            </article>
            <article>
              <h3>Health Portal Modules</h3>
              <p>
                Patient engagement features: appointments, messaging, documents.
                <span className="byline">
                  TypeScript · React · Node · HIPAA
                </span>
              </p>
            </article>
            <article>
              <h3>New Project</h3>
              <p>
                Placeholder for the next experiment.{" "}
                <a href="#contact">Say hi</a>
                if you'd like to collaborate.
              </p>
            </article>
            <article>
              <h3>Another Project</h3>
              <p>Short one‑liner describing the idea and tech focus.</p>
            </article>
          </section>
          <section
            id="experience"
            className="index"
            aria-label="Experience index"
          >
            <article>
              <h3>mPulse (formerly HealthTrio LLC.)</h3>
              <p>2021 — Present · Full‑stack portal services at scale.</p>
            </article>
          </section>
        </article>
        {/* Sidebar columns */}
        <aside className="sidebar" aria-label="Sidebar">
          {/* Latest blog teasers */}
          <section id="blog">
            <div className="section-head">Latest</div>
            <div className="tease">
              <h3>
                <a href="/blog/compact-ui" className="no-ext">
                  Designing compact UIs without bloat
                </a>
              </h3>
              <div className="meta">Jul 2025 · UI/UX · Read time ~5 min</div>
            </div>
            <div className="tease">
              <h3>
                <a href="/blog/dockerizing-go" className="no-ext">
                  Dockerizing small Go services
                </a>
              </h3>
              <div className="meta">Jun 2025 · DevOps</div>
            </div>
            <div className="tease">
              <h3>
                <a href="/blog/postgres-notes" className="no-ext">
                  PostgreSQL notes: simple patterns
                </a>
              </h3>
              <div className="meta">May 2025 · Database</div>
            </div>
          </section>
          {/* Quick links */}
          <section>
            <div className="section-head">Elsewhere</div>
            <p className="tease">
              <a
                href="https://github.com/yourname"
                target="_blank"
                rel="noopener noreferrer external"
              >
                GitHub
              </a>
              — Projects, notes, and experiments.
            </p>
            <p className="tease">
              <a
                href="https://www.uopeople.edu/"
                target="_blank"
                rel="noopener noreferrer external"
              >
                University of the People
              </a>
              — CS studies in progress.
            </p>
            <p className="tease">
              <a href="mailto:6matbub@gmail.com" className="no-ext">
                Email
              </a>{" "}
              — Best way to reach me.
            </p>
          </section>
          {/* Contact snippet */}
          <section id="contact">
            <div className="section-head">Contact</div>
            <p>
              Prefer a form? Use{" "}
              <a href="/contact" className="no-ext">
                the contact section
              </a>{" "}
              — goes to my database — or send an email.
            </p>
          </section>
        </aside>
      </main>
      <footer>
        <div>
          © <span id="y" /> Matt
        </div>
        <div>hand rolled </div>
      </footer>
    </>
  );
}


:root {
  --bg: #ffffff;
  --ink: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --link: #1d4ed8;
  --link-hover: #0f3bbd;
  --underline: rgba(29, 78, 216, 0.25);
  --maxw: 1080px;
  --gutter: 18px;
  --rule: #e5e7eb;
}

html,
body {
  height: 100%;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font:
    15px/1.65 "Libertinus Serif",
    ui-serif,
    Georgia,
    Cambria,
    "Times New Roman",
    Times,
    serif;
}

/* Headings – sans per your preference */
h1,
h2,
h3,
h4,
h5,
h6,
.brand,
nav a,
.kicker,
.byline,
.section-head {
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
}

/* Global links with hover state + external marker */
a {
  color: var(--link);
  text-decoration: underline;
  text-underline-offset: 2px;
  text-decoration-color: var(--underline);
  transition:
    color 120ms ease,
    text-decoration-color 120ms ease;
}
a:hover,
a:focus {
  color: var(--link-hover);
  text-decoration-color: currentColor;
  outline: none;
}
a[target="_blank"]:not(.no-ext)::after,
a[rel~="external"]:not(.no-ext)::after,
a.external::after {
  content: "↗";
  display: inline-block;
  margin-left: 4px;
  font-size: 0.9em;
  transform: translateY(-1px);
  color: currentColor;
}

/* Top masthead */
.masthead {
  border-bottom: 2px solid var(--rule);
  margin: 0 auto;
  max-width: var(--maxw);
  padding: 16px var(--gutter) 10px;
}
.masthead .topline {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  color: var(--muted);
  font-size: 12px;
}
.brand {
  font-weight: 800;
  letter-spacing: 0.02em;
  font-size: 28px;
  color: var(--ink);
  text-decoration: none;
}
nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
nav a {
  color: var(--ink);
  text-decoration: none;
  font-size: 13px;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
}
nav a[aria-current="page"],
nav a:hover {
  border-bottom-color: var(--ink);
}

/* Newspaper layout grid */
.paper {
  margin: 0 auto;
  max-width: var(--maxw);
  padding: 16px var(--gutter) 48px;
  display: grid;
  grid-template-columns: 2fr 1fr; /* lead + sidebar */
  gap: 24px;
}

/* Lead story block (hero) */
.lead {
  border-right: 1px solid var(--rule);
  padding-right: 24px;
}
.kicker {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 11px;
  color: var(--muted);
}
.headline {
  font-size: clamp(24px, 4vw, 36px);
  line-height: 1.15;
  margin: 6px 0 6px;
}
.byline {
  font-size: 12.5px;
  color: var(--muted);
  margin-bottom: 8px;
}
.deck {
  font-size: 16px;
  margin: 8px 0 12px;
}
.lead .meta {
  color: var(--muted);
  font-size: 12.5px;
  border-top: 1px solid var(--rule);
  padding-top: 8px;
}

/* Multi-column text like a newspaper */
.columns {
  column-count: 2;
  column-gap: 24px;
}
@media (max-width: 880px) {
  .paper {
    grid-template-columns: 1fr;
  }
  .lead {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 16px;
    margin-bottom: 8px;
  }
  .columns {
    column-count: 1;
  }
}

/* Sidebar "sections" styled like small columns */
.sidebar section + section {
  border-top: 1px solid var(--rule);
  margin-top: 14px;
  padding-top: 14px;
}
.section-head {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 6px;
}
.tease {
  margin: 0 0 10px;
  padding: 0 0 10px;
  border-bottom: 1px solid var(--rule);
}
.tease:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}
.tease h3 {
  font-size: 14.5px;
  margin: 0 0 4px;
}
.tease .meta {
  color: var(--muted);
  font-size: 12px;
}

/* Index lists (projects/experience) in two columns like article lists */
.index {
  margin: 22px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
}
.index article {
  border-top: 1px solid var(--rule);
  padding-top: 10px;
}
.index h3 {
  font-size: 14.5px;
  margin: 0 0 4px;
}
.index p {
  margin: 0;
}
@media (max-width: 680px) {
  .index {
    grid-template-columns: 1fr;
  }
}

/* Footer */
footer {
  border-top: 2px solid var(--rule);
  margin: 24px auto 0;
  max-width: var(--maxw);
  padding: 12px var(--gutter) 32px;
  color: var(--muted);
  font-size: 12.5px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
