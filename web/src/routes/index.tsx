import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/header";
import { loadAllBlogPosts } from "../utils/blogLoader";
import Footer from "../components/footer";

export const Route = createFileRoute("/")({
  component: Home,
});
export default function Home() {
  const { data } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetch("/api/stats").then((res) => res.json()),
  });
  const posts = loadAllBlogPosts();

  console.log(data);
  return (
    <>
      {/* Masthead */}
      <Header />
      {/* Newspaper layout */}
      <main id="front" className="zz-paper">
        {/* Lead story */}
        <article className="zz-leadStory" aria-labelledby="lead-headline">
          <div className="zz-kicker zz-sansFont">Profile</div>
          <h1 id="lead-headline" className="zz-headline">
            Hey, I'm Matt — software engineer building for the web
          </h1>
          <div className="zz-byline zz-sansFont">
            Full‑stack engineer, specializing in Go + TypeScript, Docker, and
            cloud infrastructure
          </div>
          <p className="zz-deck">
            Currently at mPulse (formerly HealthTrio LLC.), developing and
            maintaining web portal services for healthcare systems used by
            millions of patients.
          </p>
          <div className="zz-columns">
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
          <p className="zz-meta">
            Based online · Open to interesting problems ·{" "}
            <a href="mailto:6matbub@gmail.com" className="no-ext">
              Email me
            </a>
          </p>
          {/* Indexes like a front page */}
          <section
            id="projects"
            className="zz-index"
            aria-label="Projects index"
          >
            <article className="zz-indexArticle">
              <h3 className="zz-indexHeading">
                Portfolio Platform
                <span
                  className="zz-kicker zz-sansFont"
                  style={{ marginLeft: 6 }}
                >
                  in progress
                </span>
              </h3>
              <p className="zz-indexParagraph">
                Go backend, Dockerized runtime, and a markdown based blog.{" "}
                <a
                  href="https://github.com/matthewbub/mattbub.com"
                  target="_blank"
                  rel="noopener noreferrer external"
                >
                  Repo
                </a>
              </p>
            </article>
            <article className="zz-indexArticle">
              <h3 className="zz-indexHeading">New Project</h3>
              <p className="zz-indexParagraph">
                Placeholder for the next experiment.{" "}
                <a href="#contact">Say hi</a> if you'd like to collaborate.
              </p>
            </article>
          </section>
        </article>
        <aside className="zz-sidebar" aria-label="Sidebar">
          <section id="blog" className="zz-sidebarSection">
            <div className="zz-sectionHead zz-sansFont">Latest</div>
            {posts.slice(0, 3).map((post) => (
              <div className="zz-tease">
                <h3 className="zz-teaseHeading">
                  <a href={`/blog/${post.slug}`} className="no-ext">
                    {post.title}
                  </a>
                </h3>
                <div className="zz-teaseMeta">
                  {new Date(post.date!).toLocaleDateString()} · {post.readTime}
                </div>
              </div>
            ))}
          </section>

          {/* Quick links */}
          <section className="zz-sidebarSection">
            <div className="zz-sectionHead zz-sansFont">Elsewhere</div>
            <p className="zz-tease">
              <a
                href="https://github.com/matthewbub"
                target="_blank"
                rel="noopener noreferrer external"
              >
                GitHub
              </a>
              — Projects, notes, and experiments.
            </p>
            <p className="zz-tease">
              <a
                href="https://www.x.com/matthewbub"
                target="_blank"
                rel="noopener noreferrer external"
              >
                Twitter
              </a>
              — Random thoughts.
            </p>
            <p className="zz-tease">
              <a href="mailto:6matbub@gmail.com" className="no-ext">
                Email
              </a>{" "}
              — Best way to reach me.
            </p>
          </section>
          {/* Contact snippet */}
          <section id="contact" className="zz-sidebarSection">
            <div className="zz-sectionHead zz-sansFont">Contact</div>
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
      <Footer />
    </>
  );
}
