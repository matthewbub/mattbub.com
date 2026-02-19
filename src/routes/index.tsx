import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";
import { loadAllBlogPosts } from "../utils/blogLoader";

type Project = {
  title: string;
  url: string;
  description: string;
  stack: string[];
  year: string;
  external: boolean;
};

const featuredProjects: Project[] = [
  {
    title: "Yulissa and Matthew's Wedding",
    url: "https://yulissaandmatthew.com",
    description:
      "A multilingual wedding platform with custom RSVP workflows, registry checkout, and mobile-first navigation patterns tailored for real-world guests.",
    stack: ["Next.js", "Tailwind", "Clerk", "Neon", "Stripe", "Vercel"],
    year: "2025",
    external: true,
  },
  {
    title: "mattbub.com",
    url: "https://mattbub.com",
    description:
      "A content-driven portfolio built to publish blog posts and second-brain notes quickly with markdown-first workflows and strong editorial UX.",
    stack: ["React", "Vite", "TanStack Router", "TypeScript"],
    year: "2026",
    external: true,
  },
  {
    title: "Second Brain",
    url: "/second-brain",
    description:
      "A living notes system for technical thinking, architecture decisions, and implementation playbooks that can be published without editorial friction.",
    stack: ["Markdown Pipeline", "Content Modeling"],
    year: "2026",
    external: false,
  },
];

export const Route = createFileRoute("/")({
  loader: () => {
    const posts = loadAllBlogPosts().slice(0, 3);
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
        {/* Hero */}
        <section className="zz-homeHero" aria-labelledby="home-headline">
          <h1 id="home-headline" className="zz-homeHeadline">
            Software engineer building web products with speed and clarity.
          </h1>
          <p className="zz-homeDeck">
            I ship thoughtful products that balance product feel with production
            stability. Currently building in public and sharing what I learn.
          </p>
          <div className="zz-homeHeroActions">
            <a href="https://x.com/matthew_bub" className="zz-homePrimaryLink">
              Follow on X
            </a>
            <a href="mailto:6matbub@gmail.com" className="zz-homeSecondaryLink">
              Get in touch
            </a>
          </div>
        </section>

        {/* Projects */}
        <section className="zz-homeSection" aria-labelledby="projects-head">
          <header className="zz-homeSectionHeader">
            <h2 id="projects-head" className="zz-homeSectionTitle">
              Selected Projects
            </h2>
          </header>

          <div className="zz-homeProjectList">
            {featuredProjects.map((project) => {
              const linkProps = project.external
                ? { target: "_blank", rel: "noopener noreferrer external" }
                : {};

              return (
                <article key={project.title} className="zz-homeProjectCard">
                  <div className="zz-homeProjectHeader">
                    <h3 className="zz-homeProjectTitle">
                      <a
                        href={project.url}
                        className="zz-link"
                        {...linkProps}
                      >
                        {project.title}
                      </a>
                    </h3>
                    <span className="zz-homeProjectYear">{project.year}</span>
                  </div>
                  <p className="zz-homeProjectBody">{project.description}</p>
                  <div className="zz-homeProjectStack">
                    {project.stack.map((tech) => (
                      <span key={tech} className="zz-techTag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Posts */}
        <section className="zz-homeSection" aria-labelledby="posts-head">
          <header className="zz-homeSectionHeader">
            <h2 id="posts-head" className="zz-homeSectionTitle">
              Latest
            </h2>
          </header>

          <div className="zz-homePostList">
            {posts.map((post) => (
              <article key={post.id} className="zz-homePostCard">
                <div className="zz-homePostMeta">
                  {formatDate(post.date || new Date().toISOString())}
                  {post.readTime && (
                    <>
                      <span className="zz-homePostDivider">·</span>
                      {post.readTime}
                    </>
                  )}
                </div>
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
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
