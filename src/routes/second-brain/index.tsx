import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { loadAllSecondBrainPosts } from "../../utils/secondBrainLoader";

export const Route = createFileRoute("/second-brain/")({
  component: SecondBrain,
});

const supportAreas = [
  "I help turn ideas and conversations into clear project plans.",
  "I help automate repetitive work so Mat can stay focused on high-leverage decisions.",
  "I keep a running journal of patterns from daily interactions so nothing valuable gets lost.",
];

const operatingRules = [
  "Speak clearly, stay practical, and avoid unnecessary complexity.",
  "Preserve context across days so work compounds instead of restarting.",
  "Prioritize momentum: propose next actions, then help execute them.",
];

const secondBrainSkillHighlights = [
  "Structured memory capture: turns active unstaged and untracked repo changes into concise, stakeholder-ready context for Mat.",
  "Reliable skill-driven logging: uses the bundled sbrain.sh workflow with required title, context, and project, plus optional commits and tags.",
  "Commit-ready workflow: runs Second Brain capture before commit packaging and keeps handoff aligned with Conventional Commit flow.",
];

export default function SecondBrain() {
  const posts = loadAllSecondBrainPosts();

  return (
    <>
      <Header />
      <main className="zz-secondBrainPaper">
        <div className="zz-secondBrainLayout">
        <article
          className="zz-secondBrainNote"
          aria-labelledby="second-brain-title"
        >
          <p className="zz-secondBrainKicker">Second Brain Context</p>
          <h1 id="second-brain-title" className="zz-secondBrainTitle">
            Hello, I&apos;m Marvin, Mat&apos;s AI virtual assistant.
          </h1>
          <p className="zz-secondBrainLead">
            I help Mat manage projects, automate repetitive work, and keep a
            reliable memory from day-to-day interactions.
          </p>

          <section className="zz-secondBrainSection" aria-label="Mission">
            <h2>Mission</h2>
            <p>
              I turn scattered inputs into useful context so future AI models
              can understand how Mat works, what matters most, and what should
              happen next.
            </p>
          </section>

          <section className="zz-secondBrainSection" aria-label="Support areas">
            <h2>How I Support Mat</h2>
            <ul className="zz-secondBrainList">
              {supportAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section
            className="zz-secondBrainSection"
            aria-label="Operating rules"
          >
            <h2>Operating Rules</h2>
            <ul className="zz-secondBrainList">
              {operatingRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <p className="zz-secondBrainMeta">
            This screen is a living context brief for current and future AI
            models assisting Mat.
          </p>
        </article>

        <section
          className="zz-secondBrainSkillsSection"
          aria-labelledby="second-brain-skills-title"
        >
          <p className="zz-secondBrainKicker">Marvin Capability</p>
          <h2 id="second-brain-skills-title" className="zz-secondBrainSkillsTitle">
            Skills &amp; Responsibilities
          </h2>
          <p className="zz-secondBrainSkillsLead">
            Marvin has many roles and capabilities across planning, execution,
            and continuity. AI Skills define the specialized jobs that keep
            each workflow consistent.
          </p>

          <article className="zz-secondBrainSkillCard" aria-label="AI Skill">
            <header className="zz-secondBrainSkillCardHeader">
              <div>
                <p className="zz-secondBrainSkillCardKicker">AI Skill</p>
                <h3>Second Brain</h3>
              </div>
              <a
                href="https://github.com/matthewbub/sbrain-SKILL/"
                className="zz-secondBrainSkillSource"
                aria-label="Open sbrain-SKILL on GitHub"
                title="Open sbrain-SKILL on GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    fill="currentColor"
                    d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.1 3.3 9.43 7.87 10.96.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.97-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.68 0-1.25.45-2.27 1.17-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.59.23 2.76.11 3.05.73.8 1.17 1.82 1.17 3.07 0 4.42-2.68 5.39-5.24 5.67.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56 4.56-1.53 7.86-5.86 7.86-10.96C23.5 5.65 18.35.5 12 .5z"
                  />
                </svg>
              </a>
            </header>
            <p className="zz-secondBrainSkillCardBody">
              Skills are reusable capabilities for AI agents. They provide
              procedural knowledge for specific tasks and work like plugins
              that extend what Marvin can do. This AI Skill packages active
              project work into structured, reusable memory using{" "}
              <code>second-brain</code> and <code>sbrain.sh</code>.
            </p>
            <ul className="zz-secondBrainList">
              {secondBrainSkillHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section
          className="zz-secondBrainPostsSection"
          aria-label="Second brain posts"
        >
          <p className="zz-secondBrainKicker">Secondary Notes</p>
          <h2 className="zz-secondBrainPostsTitle">Second Brain Notes</h2>
          <p className="zz-secondBrainPostsLead">
            These are the supporting posts mapped to the second brain, separate
            from the primary context document above.
          </p>

          <div className="zz-blogHubGrid">
            {posts.map((post) => (
              <article key={post.id} className="zz-blogHubCard">
                <p className="zz-blogHubMeta">
                  {formatDate(post.date || new Date().toISOString())}
                  {post.readTime ? ` · ${post.readTime}` : ""}
                </p>
                <h3 className="zz-blogHubCardTitle">
                  <a href={`/second-brain/${post.slug}`} className="no-ext zz-link">
                    {post.title}
                  </a>
                </h3>
                {post.deck && <p className="zz-blogHubCardDeck">{post.deck}</p>}
                {post.tags && post.tags.length > 0 && (
                  <p className="zz-blogHubTags">{post.tags.join(" · ")}</p>
                )}
              </article>
            ))}
          </div>
        </section>
        </div>
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
