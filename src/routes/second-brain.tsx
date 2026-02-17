import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";

export const Route = createFileRoute("/second-brain")({
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
  return (
    <>
      <Header />
      <main className="zz-secondBrainPaper">
        <article className="zz-secondBrainNote" aria-labelledby="second-brain-title">
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

          <section className="zz-secondBrainSection" aria-label="Operating rules">
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
      </main>
      <Footer />
    </>
  );
}
