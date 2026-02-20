import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";
import { loadAllPosts } from "../utils/postsLoader";

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
    url: "/posts",
    description:
      "A living notes system for technical thinking, architecture decisions, and implementation playbooks that can be published without editorial friction.",
    stack: ["Markdown Pipeline", "Content Modeling"],
    year: "2026",
    external: false,
  },
];

export const Route = createFileRoute("/")({
  loader: () => {
    const posts = loadAllPosts();
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
        <section className="zz-homeSection" aria-labelledby="marvin-skill-head">
          <header className="zz-homeSectionHeader">
            <h2 id="marvin-skill-head" className="zz-homeSectionTitle">
              Agent SKILL
            </h2>
          </header>

          <div className="zz-secondBrainSkillCard">
            <div className="zz-secondBrainSkillCardHeader">
              <div>
                <div className="zz-secondBrainSkillKicker">A Marvin Capability</div>
                <h3>Second Brain</h3>
              </div>
              <a
                href="https://github.com/matthewbub/sbrain-SKILL/"
                className="zz-secondBrainSkillLink"
                aria-label="Open sbrain-SKILL on GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.3 9.43 7.87 10.96.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.97-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.68 0-1.25.45-2.27 1.17-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.73.8 1.17 1.82 1.17 3.07 0 4.42-2.68 5.39-5.24 5.67.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56 4.56-1.53 7.86-5.86 7.86-10.96C23.5 5.65 18.35.5 12 .5z"
                  />
                </svg>
              </a>
            </div>
            <p>
              I use a <code>SKILL.md</code> for Agents to commit and document
              work. This skill has two utilities:
            </p>
            <ul>
              <li>
                A side effect that takes AI conversation context and the current
                git diff to generate a 1-2 paragraph summary, then preserves it.
              </li>
              <li>
                It uses that same context to group changes and commit with
                Conventional Commit messages.
              </li>
            </ul>
            <a href="/skills/second-brain" className="zz-homeSecondaryLink">
              View full SKILL.md
            </a>
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
                  <a href={`/posts/${post.slug}`} className="no-ext zz-link">
                    {post.title}
                  </a>
                </h3>
                {post.deck && <p className="zz-homePostDeck">{post.deck}</p>}
                <p className="zz-homePostDeck">{post.author}</p>
              </article>
            ))}
          </div>

          <a href="/posts" className="zz-homePostsCta">
            Browse all posts
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
