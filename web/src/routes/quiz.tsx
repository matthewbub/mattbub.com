import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quiz")({
  component: Quiz,
});

import Header from "../components/header";
import { useMemo } from "react";

type QuizQuestion = {
  id: string;
  prompt: string;
  choices: { id: string; label: string }[];
  correctId?: string;
  explanation?: string;
};

type SurveyQuestion = {
  id: string;
  prompt: string;
  type: "single" | "multi";
  options: { id: string; label: string }[];
};

export default function Quiz() {
  const post = useMemo(() => getMockPost(), []);

  function toggleSurveyAnswer(qid: string, optId: string, multi: boolean) {
    setSurveyAnswers((prev) => {
      const current = prev[qid] ?? [];
      if (!multi) return { ...prev, [qid]: [optId] };
      const exists = current.includes(optId);
      const next = exists
        ? current.filter((x) => x !== optId)
        : [...current, optId];
      return { ...prev, [qid]: next };
    });
  }

  function setSurveySingle(qid: string, optId: string) {
    setSurveyAnswers((prev) => ({ ...prev, [qid]: [optId] }));
  }

  function setQuizAnswer(qid: string, choiceId: string) {
    setQuizAnswers((prev) => ({ ...prev, [qid]: choiceId }));
  }

  function handleSubmitAll() {
    // Optionally POST to your backend:
    // await fetch("/api/engagement", { method: "POST", body: JSON.stringify({ slug, surveyAnswers, quizAnswers }) })
    setSubmitted(true);
  }

  return (
    <>
      <Header />
      <main className="paper">
        <article className="lead" aria-labelledby="post-headline">
          <div className="kicker">{post.kicker}</div>
          <h1 id="post-headline" className="headline">
            {post.title}
          </h1>
          <div className="byline">
            {post.date} · {post.category} · {post.readTime}
          </div>
          <p className="deck">{post.deck}</p>

          {/* Single-column body: normal <p> flow, no .columns */}
          <section
            aria-label="Article content"
            style={{
              display: "grid",
              gap: 12,
              borderTop: "1px solid var(--rule)",
              paddingTop: 10,
              marginTop: 8,
            }}
          >
            {post.paragraphs.slice(0, 3).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {/* Inline Survey 1 */}
          <SurveyBlock
            title="Quick pulse"
            description="How do you usually approach UI layout on new projects?"
          >
            <SurveySingle
              q={{
                id: "layout-approach",
                prompt: "Pick the option that matches you best.",
                type: "single",
                options: [
                  {
                    id: "utility",
                    label: "Utility‑first CSS (e.g., Tailwind)",
                  },
                  {
                    id: "chakra",
                    label: "Component libraries (Chakra/MUI/Radix)",
                  },
                  { id: "css-mod", label: "CSS Modules or vanilla-extract" },
                  { id: "vanilla", label: "Vanilla CSS with small helpers" },
                ],
              }}
              answer={surveyAnswers["layout-approach"]?.[0]}
              onChange={(optId) => setSurveySingle("layout-approach", optId)}
            />
          </SurveyBlock>

          <section
            aria-label="Article content"
            style={{ display: "grid", gap: 12, marginTop: 12 }}
          >
            {post.paragraphs.slice(3, 7).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {/* Inline Quiz 1 */}
          <QuizBlock
            title="Knowledge check"
            description="A short quiz to test your grasp of compact UI strategies."
            questions={[
              {
                id: "q1",
                prompt:
                  "Which change most reduces perceived scroll length without hurting readability?",
                choices: [
                  { id: "a", label: "Decrease font size across the board" },
                  {
                    id: "b",
                    label: "Tighten vertical rhythm and trim extra margins",
                  },
                  { id: "c", label: "Use lighter text color everywhere" },
                  { id: "d", label: "Disable line-height scaling" },
                ],
                correctId: "b",
                explanation:
                  "Reducing unnecessary spacing preserves legibility while improving information density.",
              },
              {
                id: "q2",
                prompt:
                  "In a two-column article layout, which technique best prevents layout shift?",
                choices: [
                  {
                    id: "a",
                    label: "Avoid setting widths; rely on content only",
                  },
                  {
                    id: "b",
                    label: "Use min-width on children to preserve size",
                  },
                  {
                    id: "c",
                    label:
                      "Set explicit column-gap and ensure media has max-width: 100%",
                  },
                  { id: "d", label: "Use position: absolute for all media" },
                ],
                correctId: "c",
                explanation:
                  "Explicit gaps and responsive media sizing keep columns steady across breakpoints.",
              },
            ]}
            answers={quizAnswers}
            onAnswer={setQuizAnswer}
          />

          <section
            aria-label="Article content"
            style={{ display: "grid", gap: 12, marginTop: 12 }}
          >
            {post.paragraphs.slice(7, 11).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {/* Inline Survey 2 (multi-select) */}
          <SurveyBlock
            title="Your stack"
            description="Select all the tools you regularly use for performance work."
          >
            <SurveyMulti
              q={{
                id: "perf-tools",
                prompt: "Choose all that apply.",
                type: "multi",
                options: [
                  { id: "lighthouse", label: "Lighthouse" },
                  { id: "web-vitals", label: "Web Vitals (CLS, LCP, INP)" },
                  { id: "profiles", label: "CPU/Memory profiling" },
                  { id: "rtt", label: "Network throttling & RTT budgets" },
                  { id: "perf-budgets", label: "Bundle/perf budgets in CI" },
                ],
              }}
              answers={surveyAnswers["perf-tools"] ?? []}
              onToggle={(optId) =>
                toggleSurveyAnswer("perf-tools", optId, true)
              }
            />
          </SurveyBlock>

          <section
            aria-label="Article content"
            style={{ display: "grid", gap: 12, marginTop: 12 }}
          >
            {post.paragraphs.slice(11).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {/* Submit engagement data */}
          <div
            className="byline"
            style={{
              borderTop: "1px solid var(--rule)",
              paddingTop: 10,
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleSubmitAll}
              style={buttonStyle}
              aria-live="polite"
            >
              {submitted ? "Thanks — response recorded" : "Submit responses"}
            </button>
            <span className="byline">
              Anonymous by default. Wire to /api/engagement to store results.
            </span>
          </div>
        </article>

        <aside className="sidebar" aria-label="Sidebar">
          <section>
            <div className="section-head">Related</div>
            <div className="tease">
              <h3>
                <a href="/blog/compact-ui" className="no-ext">
                  Designing compact UIs without bloat
                </a>
              </h3>
              <div className="meta">Jul 2025 · UI/UX · ~5 min</div>
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
          <section>
            <div className="section-head">About</div>
            <p className="tease">
              I write about pragmatic engineering and clean interfaces.{" "}
              <a href="/contact" className="no-ext">
                Say hi
              </a>{" "}
              with ideas or feedback.
            </p>
          </section>
        </aside>
      </main>

      <footer>
        <div>
          © <span id="y" /> Matt
        </div>
        <div>hand rolled</div>
      </footer>
    </>
  );
}
/* ---------- Components ---------- */

function SurveyBlock(props: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={props.title}
      style={{
        borderTop: "2px solid var(--rule)",
        marginTop: 12,
        paddingTop: 10,
      }}
    >
      <div className="kicker">{props.title}</div>
      {props.description ? (
        <div className="byline" style={{ marginBottom: 6 }}>
          {props.description}
        </div>
      ) : null}
      {props.children}
    </section>
  );
}

function QuizBlock(props: {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onAnswer: (qid: string, choice: string) => void;
}) {
  return (
    <section
      aria-label={props.title}
      style={{
        borderTop: "2px solid var(--rule)",
        marginTop: 12,
        paddingTop: 10,
      }}
    >
      <div className="kicker">{props.title}</div>
      {props.description ? (
        <div className="byline" style={{ marginBottom: 6 }}>
          {props.description}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
        }}
      >
        {props.questions.map((q) => (
          <fieldset
            key={q.id}
            style={{
              margin: 0,
              padding: 10,
              border: "1px solid var(--rule)",
              borderRadius: 6,
            }}
          >
            <legend className="section-head" style={{ marginBottom: 6 }}>
              {q.prompt}
            </legend>
            <div style={{ display: "grid", gap: 6 }}>
              {q.choices.map((c) => {
                const checked = props.answers[q.id] === c.id;
                const correct = q.correctId && c.id === q.correctId;
                const wrong = q.correctId && checked && c.id !== q.correctId;
                return (
                  <label
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 8px",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      background: checked
                        ? "rgba(29, 78, 216, 0.06)"
                        : "var(--bg)",
                      color: "var(--ink)",
                    }}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={c.id}
                      checked={checked}
                      onChange={() => props.onAnswer(q.id, c.id)}
                    />
                    <span>{c.label}</span>
                    {checked && q.correctId ? (
                      <span
                        className="byline"
                        style={{
                          marginLeft: "auto",
                          color: correct ? "green" : "crimson",
                        }}
                      >
                        {correct ? "Correct" : "Try again"}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
            {props.answers[q.id] && q.explanation ? (
              <div className="byline" style={{ marginTop: 6 }}>
                {q.explanation}
              </div>
            ) : null}
          </fieldset>
        ))}
      </div>
    </section>
  );
}

function SurveySingle(props: {
  q: SurveyQuestion;
  answer?: string;
  onChange: (optId: string) => void;
}) {
  const { q, answer } = props;
  return (
    <fieldset
      style={{
        margin: 0,
        padding: 10,
        border: "1px solid var(--rule)",
        borderRadius: 6,
      }}
    >
      <legend className="section-head" style={{ marginBottom: 6 }}>
        {q.prompt}
      </legend>
      <div style={{ display: "grid", gap: 6 }}>
        {q.options.map((opt) => (
          <label
            key={opt.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background:
                answer === opt.id ? "rgba(29, 78, 216, 0.06)" : "var(--bg)",
            }}
          >
            <input
              type="radio"
              name={q.id}
              value={opt.id}
              checked={answer === opt.id}
              onChange={() => props.onChange(opt.id)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SurveyMulti(props: {
  q: SurveyQuestion;
  answers: string[];
  onToggle: (optId: string) => void;
}) {
  const { q, answers } = props;
  return (
    <fieldset
      style={{
        margin: 0,
        padding: 10,
        border: "1px solid var(--rule)",
        borderRadius: 6,
      }}
    >
      <legend className="section-head" style={{ marginBottom: 6 }}>
        {q.prompt}
      </legend>
      <div style={{ display: "grid", gap: 6 }}>
        {q.options.map((opt) => {
          const checked = answers.includes(opt.id);
          return (
            <label
              key={opt.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: checked ? "rgba(29, 78, 216, 0.06)" : "var(--bg)",
              }}
            >
              <input
                type="checkbox"
                name={`${q.id}-${opt.id}`}
                value={opt.id}
                checked={checked}
                onChange={() => props.onToggle(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const buttonStyle: React.CSSProperties = {
  appearance: "none",
  background: "var(--ink)",
  color: "var(--bg)",
  border: "2px solid var(--ink)",
  borderRadius: 4,
  fontFamily:
    '"DM Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.02em",
  padding: "10px 14px",
  cursor: "pointer",
  transition: "background 120ms ease, color 120ms ease",
};

/* ---------- Mock content ---------- */

function getMockPost(slug?: string) {
  const common = {
    category: "UI/UX",
    readTime: "~6 min",
    kicker: "Notes",
  };
  if (slug === "compact-ui") {
    return {
      ...common,
      title: "Designing compact UIs without bloat",
      date: "Jul 2025",
      deck: "Practical steps to tighten layouts, reduce waste, and keep interfaces clear and fast.",
      paragraphs: sampleParagraphs(),
    };
  }
  return {
    ...common,
    title: "Pragmatic patterns for readable, dense layouts",
    date: "Jul 2025",
    deck: "How to keep content first, lower friction, and make information-dense pages feel effortless.",
    paragraphs: sampleParagraphs(),
  };
}

function sampleParagraphs(): string[] {
  return [
    "There’s a difference between compact and cramped. Good density reduces cognitive overhead and the time between intent and completion.",
    "Start with a clear rhythm. If your line-height and spacing are consistent, you can safely introduce density where it matters most.",
    "Whitespace is a tool, not a tax. Use it to guide the eye and form visual groupings—not to pad everything equally.",
    "Mild contrast changes can do more than you expect. Secondary information should look secondary without becoming invisible.",
    "The fastest layouts rarely surprise the reader. Familiar patterns direct attention, reduce errors, and improve speed.",
    "When in doubt, remove an adornment instead of adding one. Few components deserve shadows, gradients, or animation.",
    "Multi-column layouts can be great for scannability. Avoid orphan lines, keep your column gap honest, and respect the baseline.",
    "Typography leads the way. Choose a typeface that renders crisply at small sizes and keep mark-up semantic for accessibility.",
    "Navigation should be small, clear, and predictable. Overly loud navigation steals attention from content.",
    "Measure, then optimize. Pay attention to actual reading behavior, not just lab metrics. Fine tune the places where eyes linger.",
    "Keep iteration cheap. The best density often comes from many small improvements rather than a single big change.",
    "Resist accidental complexity. Templates with fewer unique decisions are easier to maintain and easier to read.",
  ];
}
