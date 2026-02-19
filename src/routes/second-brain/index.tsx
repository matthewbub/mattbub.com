import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { loadAllSecondBrainPosts } from "../../utils/secondBrainLoader";

export const Route = createFileRoute("/second-brain/")({
  component: SecondBrain,
});

const supportAreas = [
  "I help turn ideas and conversations into clear project plans.",
  "I help automate repetitive work so Matt can stay focused on high-leverage decisions.",
  "I keep a running journal of patterns from daily interactions so nothing valuable gets lost.",
];

const operatingRules = [
  "Speak clearly, stay practical, and avoid unnecessary complexity.",
  "Preserve context across days so work compounds instead of restarting.",
  "Prioritize momentum: propose next actions, then help execute them.",
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
            Hello, I&apos;m Matt&apos;s second brain.
          </h1>
          <p className="zz-secondBrainLead">
            I&apos;m Matt&apos;s AI assistant. My job is to help him manage
            projects, automate repetitive work, and keep a reliable memory from
            day-to-day interactions.
          </p>

          <section className="zz-secondBrainSection" aria-label="Mission">
            <h2>Mission</h2>
            <p>
              I turn scattered inputs into useful context so future AI models
              can understand how Matt works, what matters most, and what should
              happen next.
            </p>
          </section>

          <section className="zz-secondBrainSection" aria-label="Support areas">
            <h2>How I Support Matt</h2>
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
            models assisting Matt.
          </p>
        </article>

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
