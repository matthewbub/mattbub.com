import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";
import { loadAllBlogPosts } from "../utils/blogLoader";

type Project = {
  title: string;
  url: string;
  description: string;
  stack: string;
  year: string;
  label: string;
  external: boolean;
};

const featuredProjects: Project[] = [
  {
    title: "Yulissa and Matthew's Wedding",
    url: "https://yulissaandmatthew.com",
    description:
      "A multilingual wedding platform with custom RSVP workflows, registry checkout, and mobile-first navigation patterns tailored for real-world guests.",
    stack:
      "Next.js · Tailwind CSS · Clerk · Neon · Drizzle · Stripe · Vercel · Cloudflare · Sentry · Posthog",
    year: "2025",
    label: "Product Build",
    external: true,
  },
  {
    title: "mattbub.com",
    url: "https://mattbub.com",
    description:
      "A content-driven portfolio built to publish blog posts and second-brain notes quickly with markdown-first workflows and strong editorial UX.",
    stack: "React · Vite · TanStack Router · TypeScript · Markdown",
    year: "2026",
    label: "Personal Platform",
    external: true,
  },
  {
    title: "Second Brain",
    url: "/second-brain",
    description:
      "A living notes system for technical thinking, architecture decisions, and implementation playbooks that can be published without editorial friction.",
    stack: "Markdown Pipeline · Content Modeling · Frontend Architecture",
    year: "2026",
    label: "Knowledge System",
    external: false,
  },
];

export const Route = createFileRoute("/")({
  loader: () => {
    const posts = loadAllBlogPosts().slice(0, 5);
    return { posts };
  },
  component: Home,
});

export default function Home() {
  const { posts } = Route.useLoaderData();

  return (
    <>
      <Header />
      <main id="front" className="zz-paper zz-homePaper">
        <section className="zz-homeHero" aria-labelledby="home-headline">
          <p className="zz-kicker">Portfolio</p>
          <h1 id="home-headline" className="zz-headline zz-homeHeadline">
            Shipping web products with speed, clarity, and taste.
          </h1>
          <p className="zz-deck zz-homeDeck">
            Software engineer by day, indie hacker by night. I build fast but
            thoughtfully, and I care about product feel as much as production
            stability. Reach me on X{" "}
            <a href="https://x.com/matthew_bub" className="no-ext zz-link">
              @matthew_bub
            </a>{" "}
            or via{" "}
            <a href="mailto:6matbub@gmail.com" className="no-ext zz-link">
              email
            </a>
            .
          </p>
          <div className="zz-homeHeroActions">
            <a href="#projects" className="zz-homePrimaryLink">
              Explore Projects
            </a>
            <a href="/blog" className="zz-homeSecondaryLink">
              Read Latest Posts
            </a>
          </div>
        </section>

        <section className="zz-homeLayout" aria-label="Homepage content">
          <section
            id="projects"
            className="zz-homeProjects"
            aria-labelledby="projects-head"
          >
            <header className="zz-homeSectionHeader">
              <h2 id="projects-head" className="zz-homeSectionTitle">
                Selected Projects
              </h2>
              <p className="zz-homeSectionDeck">
                Built for real users, with product constraints and launch
                pressure in mind.
              </p>
            </header>

            <div className="zz-homeProjectList">
              {featuredProjects.map((project) => {
                const linkProps = project.external
                  ? { target: "_blank", rel: "noopener noreferrer external" }
                  : {};

                return (
                  <article key={project.title} className="zz-homeProjectCard">
                    <p className="zz-homeProjectMeta">
                      {project.label} · {project.year}
                    </p>
                    <h3 className="zz-homeProjectTitle">
                      <a
                        href={project.url}
                        className="zz-link"
                        aria-label={`Open ${project.title}`}
                        {...linkProps}
                      >
                        {project.title}
                      </a>
                    </h3>
                    <p className="zz-homeProjectBody">{project.description}</p>
                    <p className="zz-homeProjectStack">{project.stack}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="zz-homePosts" aria-labelledby="posts-head">
            <header className="zz-homeSectionHeader zz-homePostsHeader">
              <h2 id="posts-head" className="zz-homeSectionTitle">
                Latest Posts
              </h2>
              <p className="zz-homeSectionDeck">
                Fresh writing on engineering, product, and building in public.
              </p>
            </header>

            <div className="zz-homePostList">
              {posts.map((post) => (
                <article key={post.id} className="zz-homePostCard">
                  <p className="zz-homePostMeta">
                    {formatDate(post.date || new Date().toISOString())}
                    {post.readTime ? ` · ${post.readTime}` : ""}
                  </p>
                  <h3 className="zz-homePostTitle">
                    <a href={`/blog/${post.slug}`} className="no-ext zz-link">
                      {post.title}
                    </a>
                  </h3>
                  {post.deck && <p className="zz-homePostDeck">{post.deck}</p>}
                </article>
              ))}
            </div>

            <a href="/blog" className="zz-homePostsCta">
              Browse all writing
            </a>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}
