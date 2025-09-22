import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useId } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

type ContactPayload = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export default function Contact() {
  const mutation = useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to send message.");
      }
      return res.json();
    },
  });

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const statusId = useId();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: ContactPayload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <>
      <Header />

      {/* Newspaper layout */}
      <main className="zz-paper">
        {/* Lead area: Contact form */}
        <article className="zz-leadStory" aria-labelledby="contact-headline">
          <div className="zz-kicker">Get in touch</div>
          <h1 id="contact-headline" className="zz-headline">
            Contact Mat
          </h1>
          <div className="zz-byline">
            Prefer email?{" "}
            <a href="mailto:6matbub@gmail.com" className="no-ext zz-link">
              6matbub@gmail.com
            </a>
          </div>
          <p className="zz-deck">
            Send a note about projects, collaboration, or anything interesting.
            I read everything and typically reply within 1–2 business days.
          </p>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            aria-describedby={statusId}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 16px",
              borderTop: "1px solid var(--rule)",
              paddingTop: 12,
              marginTop: 8,
            }}
          >
            <div style={{ gridColumn: "1 / 2" }}>
              <label
                htmlFor={nameId}
                className="zz-kicker"
                style={{ display: "block", marginBottom: 6 }}
              >
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                id={nameId}
                name="name"
                required
                type="text"
                inputMode="text"
                autoComplete="name"
                placeholder="Enter your name"
                maxLength={100}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "2 / 3" }}>
              <label
                htmlFor={emailId}
                className="zz-kicker"
                style={{ display: "block", marginBottom: 6 }}
              >
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id={emailId}
                name="email"
                required
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Enter your email"
                maxLength={100}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / 3" }}>
              <label
                htmlFor={subjectId}
                className="zz-kicker"
                style={{ display: "block", marginBottom: 6 }}
              >
                Subject
              </label>
              <input
                id={subjectId}
                name="subject"
                type="text"
                placeholder="Project idea, quick question, etc."
                maxLength={200}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / 3" }}>
              <label
                htmlFor={messageId}
                className="zz-kicker"
                style={{ display: "block", marginBottom: 6 }}
              >
                Message <span aria-hidden="true">*</span>
              </label>
              <textarea
                id={messageId}
                name="message"
                required
                rows={8}
                placeholder="Share details, links, timelines—whatever helps."
                maxLength={2000}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.5,
                }}
              />
              <div className="zz-byline" style={{ marginTop: 6 }}>
                I won’t share your info. Fields marked with * are required.
              </div>
            </div>

            <div
              style={{
                gridColumn: "1 / 3",
                display: "flex",
                gap: 10,
                alignItems: "center",
                borderTop: "1px solid var(--rule)",
                paddingTop: 10,
                marginTop: 4,
              }}
            >
              <button
                type="submit"
                disabled={mutation.isPending}
                style={buttonStyle}
              >
                {mutation.isPending ? "Sending…" : "Send message"}
              </button>
              <div
                id={statusId}
                role="status"
                aria-live="polite"
                className="zz-byline"
                style={{ minHeight: 18 }}
              >
                {mutation.isSuccess && "Thanks — your message was sent."}
                {mutation.isError && (
                  <span style={{ color: "crimson" }}>
                    {(mutation.error as Error)?.message ||
                      "Something went wrong. Please try again."}
                  </span>
                )}
              </div>
            </div>
          </form>

          <div className="zz-columns" style={{ marginTop: 16 }}>
            <p>
              I’m especially interested in focused web products, performance
              work, and pragmatic tooling. Short briefs or rough ideas welcome.
            </p>
            <p>
              If you prefer async email, include any constraints (timeline,
              budget range, stack) to speed things up.
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="zz-sidebar" aria-label="Contact sidebar">
          <section className="zz-sidebarSection">
            <div className="zz-sectionHead">Direct</div>
            <p className="zz-tease">
              <a href="mailto:6matbub@gmail.com" className="no-ext zz-link">
                Email
              </a>{" "}
              — Best way to reach me.
            </p>
            <p className="zz-tease">
              <a
                href="https://github.com/matthewbub"
                target="_blank"
                rel="noopener noreferrer external"
              >
                GitHub
              </a>{" "}
              — Projects and notes.
            </p>
          </section>
          <section className="zz-sidebarSection">
            <div className="zz-sectionHead">Response window</div>
            <p className="zz-tease">
              I aim to reply within 1–2 business days. If urgent, mention your
              deadline.
            </p>
          </section>
          <section className="zz-sidebarSection">
            <div className="zz-sectionHead">What helps</div>
            <div className="zz-tease">
              <h3 className="zz-teaseHeading">Context</h3>
              <div className="zz-teaseMeta">
                Links, goals, constraints, and timelines are useful.
              </div>
            </div>
            <div className="zz-tease">
              <h3 className="zz-teaseHeading">Scope</h3>
              <div className="zz-teaseMeta">
                Features, outcomes, and any must‑have integrations.
              </div>
            </div>
          </section>
        </aside>
      </main>

      <Footer />
    </>
  );
}
const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "var(--bg)",
  color: "var(--ink)",
  border: "1px solid var(--border)",
  borderRadius: 4,
  padding: "10px 12px",
  font: '15px/1.5 "Libertinus Serif", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  outline: "none",
};

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
} as const;
