import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";

export const Route = createFileRoute("/")({
  component: Home,
});

export default function Home() {
  const projects = [
    {
      title: "Yulissa and Matthew's Wedding",
      img: "https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOCGU4BfK0vj6I1AQHq32EOlobpw9t8yKmJXBD",
      url: "https://yulissaandmatthew.com",
      description: `A wedding website for Yulissa and Matthew (me) with a custom registry and RSVP system. This thing is super fast. Since 99% of the traffic is on mobile, there's intuitive features such as swiping left / right to navigation the
      app as well as a mobile first design. It has to support multiple languages (Spanish and English).`,
      stack:
        "Next.js · Tailwind CSS · Clerk · Neon · Drizzle · Stripe · Vercel · Cloudflare · Sentry · Posthog",
      year: "2025",
    },
  ];

  return (
    <>
      <Header />
      <main id="front" className="zz-paper">
        <section className="zz-leadStory">
          <div className="zz-kicker">Work</div>
          <h1 className="zz-headline">Developing for the web</h1>
            <p className="zz-deck">
            Software engineer by day, indie hacker by night. I move fast &
            thoughtfully. I can be reached on X{" "}
            <a href="https://x.com/matthew_bub">@matthew_bub</a> or via
            {" "}
            <a href="mailto:6matbub@gmail.com" className="no-ext zz-link">
              email
            </a>{" "}
            for all things.
          </p>

          <section id="projects" aria-labelledby="projects-head">
            <h2
              id="projects-head"
              className="zz-sectionHead zz-sansFont zz-projectsHead"
            >
              Selected Projects
            </h2>
            <div className="zz-index">
              {projects.map((p) => (
                <article key={p.title} className="zz-indexArticle">
                  <div className="zz-indexContent">
                    <p className="zz-indexEyebrow">Featured Build</p>
                    <h3 className="zz-indexHeading">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer external"
                        className="zz-link"
                      >
                        {p.title}
                      </a>
                    </h3>
                    <p className="zz-indexParagraph">{p.description}</p>
                    <div className="zz-indexMetaRow">
                      <span className="zz-indexYear">{p.year}</span>
                      <p className="zz-meta">{p.stack}</p>
                    </div>
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer external"
                    className="zz-indexMedia"
                    aria-label={`Open ${p.title}`}
                  >
                    <img src={p.img} alt={p.title} className="zz-indexImage" />
                  </a>
                </article>
              ))}
            </div>
          </section>

        </section>
      </main>
      <Footer />
    </>
  );
}
