import { IndexList } from "@/components/index-list";
import { BlogPosts } from "@/components/posts";
import Link from "next/link";

export default function Page() {
  return (
    <section>
      <h1 className="mb-0 text-2xl font-semibold tracking-tighter">
        Nice Divs
      </h1>
      <div className="flex flex-row">
        <div className="bg-red-500 w-2 h-3"></div>
        <div className="bg-blue-500 w-3 h-3"></div>
        <div className="bg-green-500 w-4 h-3"></div>
        <div className="bg-yellow-500 w-5 h-3"></div>
      </div>

      <div className="mt-8 space-y-4">
        <p>
          Helping you write nicer divs.{" "}
          <span className="text-neutral-500">
            This is a prototype project I&apos;m working on to get a better
            understanding of developing for the browser and all of the fun stuff
            that comes with it.
          </span>
        </p>
        <p>
          The goal is to create an bookmarkable experience. I&apos;d love to
          hear your feedback at{" "}
          <Link
            href="https://x.com/matthew_bub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            https://x.com/matthew_bub
          </Link>
        </p>
      </div>

      <div className="w-full h-1 border-dashed border-b border-neutral-200 dark:border-neutral-800 mt-4" />
      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tighter mb-0">
          Chapters
        </h2>
        <p className="mb-4">
          Presented in the order i started them. Subject to reordering.
        </p>

        <IndexList
          items={[
            {
              slug: "time-complexity",
              title: "Time Complexity",
            },
            {
              slug: "recursion",
              title: "Recursion",
            },
            {
              slug: "algorithms/bubble-sort",
              title: "Bubble Sort",
            },
            {
              slug: "algorithms/merge-sort",
              title: "Merge Sort",
            },
          ]}
          basePath="/nicedivs"
          showDate={false}
          sortByDate={false}
        />
      </div>
    </section>
  );
}
