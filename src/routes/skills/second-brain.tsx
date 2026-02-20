import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";

const SECOND_BRAIN_SKILL_URL =
  "https://raw.githubusercontent.com/matthewbub/sbrain-SKILL/refs/heads/main/SKILL.md";

export const Route = createFileRoute("/skills/second-brain")({
  loader: async () => {
    const content = await fetch(SECOND_BRAIN_SKILL_URL)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch SKILL.md (${response.status})`);
        }
        return response.text();
      })
      .catch(() => null);

    return { content };
  },
  component: SecondBrainSkillPage,
});

function SecondBrainSkillPage() {
  const { content } = Route.useLoaderData();

  return (
    <>
      <Header />
      <main className="zz-paper zz-homePaper">
        <section className="zz-homeSection" aria-labelledby="skill-head">
          <header className="zz-homeSectionHeader">
            <h1 id="skill-head" className="zz-homeSectionTitle">
              Second Brain SKILL.md
            </h1>
          </header>

          {content ? (
            <pre className="zz-skillCodeBlock">
              <code>{content}</code>
            </pre>
          ) : (
            <p className="zz-secondBrainSkillError">
              Could not load the raw SKILL file right now.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

