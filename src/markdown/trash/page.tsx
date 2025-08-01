import { TrashPosts } from "@/components/trash-posts";

export const metadata = {
  title: "Trash",
  description: "Incomplete or not worth posting blog drafts.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Trash</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        Blog posts that feel incomplete or not worth posting
      </p>
      <TrashPosts />
    </section>
  );
}
