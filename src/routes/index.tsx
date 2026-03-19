import { startTransition, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";
import { loadAllPosts } from "../utils/postsLoader";
import { formatPostedRelative } from "../utils/dateFormat";

type Photo = {
  src: string;
  alt: string;
  date: string;
};

const photos: Photo[] = [
  {
    src: "/photos/egagement_photoshoot.png",
    alt: "A photo from my engagement photoshoot. There's more a https://yulissaandmatthew.com",
    date: "2026-03-18",
  },
  {
    src: "/photos/epic_selfie.jpg",
    alt: 'I call this my "epic selfie". Captured while on a hike in Highland, CA.',
    date: "2026-03-18",
  },
  {
    src: "/photos/fav_selfie.jpg",
    alt: "Desert X 2025 - We encountered a swarm of bee's shortly after taking this photo!",
    date: "2026-03-18",
  },
];

const PROJECTS_PER_PAGE = 4;
const MEDIA_PER_PAGE = 6;
const POSTS_PER_PAGE = 4;

type Project = {
  title: string;
  url: string;
  description: string;
  category: string;
  year: string;
  external?: boolean;
};

const projects: Project[] = [
  // 2025-2026
  {
    title: "Married Next",
    url: "https://marriednext.com",
    description:
      "Create and deploy your wedding website in minutes. Customize the theme, modify locale aware labels. Manage your guest list and collect reservations. Invite collaborators to help manage the website. Includes a free subdomain, but guests can bring own domain too.",
    category: "Product",
    year: "2025-2026",
  },
  {
    title: "Yulissa & Matthew's Wedding",
    url: "https://yulissaandmatthew.com",
    description:
      "Mine and my fiancées wedding site used to collect RSVPs from our guests. The first live implementation of marriednext.com. The first theme was dogfooded with my fiancée as the first client.",
    category: "Client",
    year: "2025-2026",
    external: true,
  },
  // 2026
  {
    title: "site-manifest",
    url: "/docs/site-manifest",
    description:
      "TypeScript package for defining editable site content with a single schema-backed contract. I'm using this as the contract between the site label editor for marriednext.com Uses JSON Schema  the contract between what AI generates and what users can edit",
    category: "Open Source",
    year: "2026",
  },
  {
    title: "mask-email",
    url: "https://github.com/matthewbub/mask-email",
    description:
      "Util to mask emails.",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  {
    title: "start-local",
    url: "https://github.com/matthewbub/start-local",
    description:
      "Runs a forwarded dev command and automatically infers a port from the current folder name when it ends with ___<port>.",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  {
    title: "sbrain",
    url: "https://github.com/matthewbub/sbrain",
    description:
      "DB & API for sbrain — a little AI assistant that documents your code journey as you go about it.",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  {
    title: "sbrain-SKILL",
    url: "https://github.com/matthewbub/sbrain-SKILL",
    description:
      "SKILL for sbrain — a little AI assistant that documents your code journey as you go about it.",
    category: "Skill",
    year: "2026",
    external: true,
  },
  {
    title: "screenshotter",
    url: "https://github.com/matthewbub/screenshotter",
    description:
      "Capture full page screenshots from the terminal (for marketing).",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  {
    title: "cc",
    url: "https://github.com/matthewbub/cc",
    description:
      "Commit using conventional commits.",
    category: "Skill",
    year: "2026",
    external: true,
  },
  {
    title: "gh-secrets-from-env",
    url: "https://github.com/ieportals/gh-secrets-from-env",
    description:
      "Script that copies your .env keys into GitHub Actions so you don't have to do it all one by one.",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  {
    title: "porkbun-provider",
    url: "https://github.com/ieportals/porkbun-provider",
    description:
      "SDK for working with the Porkbun API.",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  {
    title: "vercel-domains-provider",
    url: "https://github.com/ieportals/vercel-domains-provider",
    description:
      "SDK for working with domains and subdomains via the Vercel Domains API.",
    category: "Open Source",
    year: "2026",
    external: true,
  },
  // 2025
  {
    title: "wussup.chat",
    url: "https://github.com/matthewbub/wussup.chat",
    description:
      "An AI provider agnostic chatbot. I wrote the sync layer between the server and client.",
    category: "Experiment",
    year: "2025",
    external: true,
  },
  {
    title: "auth-api",
    url: "https://github.com/matthewbub/auth-api",
    description:
      "JWT auth system.",
    category: "Experiment",
    year: "2025",
    external: true,
  },
  {
    title: "asset_generator",
    url: "https://github.com/matthewbub/asset_generator",
    description:
      "Generate AI images via CLI with the OpenAI API.",
    category: "Open Source",
    year: "2025",
    external: true,
  },
  {
    title: "snaketitles",
    url: "https://github.com/matthewbub/snaketitles",
    description:
      "Snake case + title case = snaketitles.",
    category: "Open Source",
    year: "2025",
    external: true,
  },
  {
    title: "Redux Presentation",
    url: "https://redux-presentation-zeta.vercel.app",
    description:
      "An interactive slide deck about React Redux. Slides vibe coded with v0, presentation vibed with my brain.",
    category: "Presentation",
    year: "2025",
    external: true,
  },
  // 2024
  {
    title: "dotfiles",
    url: "https://github.com/matthewbub/dotfiles",
    description:
      "My personal dotfiles. Neovim config, shell setup, and the rest of the tools I use day to day.",
    category: "Open Source",
    year: "2024",
    external: true,
  },
  {
    title: "css4life",
    url: "https://github.com/matthewbub/css4life",
    description:
      "Convert PostCSS to CSS via CLI.",
    category: "Open Source",
    year: "2024",
    external: true,
  },
  {
    title: "dot-properties-ast",
    url: "https://github.com/matthewbub/dot-properties-ast",
    description:
      "Convert .properties files to an abstract syntax tree (AST).",
    category: "Open Source",
    year: "2024",
    external: true,
  },
  {
    title: "pomo",
    url: "https://github.com/matthewbub/pomo",
    description:
      "A pomodoro timer.",
    category: "Experiment",
    year: "2024",
    external: true,
  },
  // 2023
  {
    title: "PoS-Visualizer",
    url: "https://github.com/matthewbub/PoS-Visualizer",
    description:
      "Parts of Speech (PoS) visualization tool.",
    category: "Experiment",
    year: "2023",
    external: true,
  },
  {
    title: "golang-dir-watcher-prototype",
    url: "https://github.com/matthewbub/golang-dir-watcher-prototype",
    description:
      "A directory watcher prototype written in Go.",
    category: "Experiment",
    year: "2023",
    external: true,
  },
  // 2022
  {
    title: "calendar-widgets",
    url: "https://github.com/matthewbub/calendar-widgets",
    description:
      "Craft beautifully robust date components in React.",
    category: "Experiment",
    year: "2022",
    external: true,
  },
  {
    title: "coding-resource-finder",
    url: "https://github.com/Ngoakor12/coding-resource-finder",
    description:
      "An easier way to find coding related topics and projects on the ACN syllabus.",
    category: "Contributor",
    year: "2022",
    external: true,
  },
  {
    title: "trumple",
    url: "https://github.com/jamesurobertson/trumple",
    description:
      "React clone of Wordle.",
    category: "Contributor",
    year: "2022",
    external: true,
  },
  // 2021
  {
    title: "reddit-slackbot",
    url: "https://github.com/matthewbub/reddit-slackbot",
    description:
      "Reddit integrated into Slack as a message bot.",
    category: "Experiment",
    year: "2021",
    external: true,
  },
  {
    title: "Publish a Scoped Package to npm Using TypeScript",
    url: "https://javascript.plainenglish.io/publish-a-scoped-package-to-npm-using-typescript-b36f2f7475c9",
    description:
      "A guide on publishing scoped TypeScript packages to npm.",
    category: "Publication",
    year: "2021",
    external: true,
  },
  {
    title: "fetch-dogs",
    url: "https://matthewbub.github.io/fetch-dogs/",
    description:
      "Browse and search for dogs. A simple pet discovery tool.",
    category: "Experiment",
    year: "2021",
    external: true,
  },
  {
    title: "video-player-manipulation",
    url: "https://github.com/matthewbub/video-player-manipulation",
    description:
      "Interactive comments tied to the HTML5 video API.",
    category: "Experiment",
    year: "2021",
    external: true,
  },
  {
    title: "execute-once",
    url: "https://github.com/matthewbub/execute-once",
    description:
      "Deploy scoped packages to npm.",
    category: "Open Source",
    year: "2021",
    external: true,
  },
  // 2020
  {
    title: "fake-things",
    url: "https://github.com/matthewbub/fake-things",
    description:
      "A fake data node module for templating. Generate thousands of random strings, objects, and images.",
    category: "Experiment",
    year: "2020",
    external: true,
  },
  {
    title: "lg-coffee",
    url: "https://github.com/matthewbub/lg-coffee",
    description:
      "An interface for Stripe Products. The quickest way to bootstrap an e-commerce application without hosting fees.",
    category: "Experiment",
    year: "2020",
    external: true,
  },
  {
    title: "express-example",
    url: "https://github.com/matthewbub/express-example",
    description:
      "Easy-to-read Express server example.",
    category: "Open Source",
    year: "2020",
    external: true,
  },
  {
    title: "conventional-commit-helper",
    url: "https://github.com/matthewbub/conventional-commit-helper",
    description:
      "Shell script to assist with conventional commits.",
    category: "Open Source",
    year: "2020",
    external: true,
  },
  {
    title: "learnflexbox",
    url: "https://github.com/matthewbub/learnflexbox",
    description:
      "An interactive visualization of flexbox with grab-and-go code bits.",
    category: "Experiment",
    year: "2020",
    external: true,
  },
];

type MediaItem = {
  name: string;
  blurb: string;
  url: string;
  type: "podcast" | "youtube" | "newsletter";
};

const media: MediaItem[] = [
  {
    name: "Syntax.fm",
    blurb: "Web dev, tooling, and frontend deep dives.",
    url: "https://syntax.fm",
    type: "podcast",
  },
  {
    name: "Mostly Technical",
    blurb: "Ian and Aaron on the tech that actually matters.",
    url: "https://mostlytechnical.com",
    type: "podcast",
  },
  {
    name: "How About Tomorrow?",
    blurb: "Forward-looking conversations on tech and culture.",
    url: "https://www.youtube.com/@tomorrowfm",
    type: "podcast",
  },
  {
    name: "Theo - t3.gg",
    blurb: "Never miss a live stream. Opinionated takes on the JS ecosystem.",
    url: "https://www.youtube.com/@t3dotgg",
    type: "youtube",
  },
  {
    name: "ThePrimeagen & friends",
    blurb: "Performance, Vim, and entertaining dev commentary.",
    url: "https://www.youtube.com/@ThePrimeTimeagen",
    type: "youtube",
  },
  {
    name: "Ben Davis",
    blurb: "Behind-the-scenes creator and tech business insights.",
    url: "https://www.youtube.com/@bmdavis419",
    type: "youtube",
  },
  {
    name: "Aaron Francis",
    blurb: "Databases, Laravel, and building in public.",
    url: "https://www.youtube.com/@aarondfrancis",
    type: "youtube",
  },
  {
    name: "AI Explained",
    blurb: "Clear breakdowns of the latest AI research and models.",
    url: "https://www.youtube.com/@aiexplained-official",
    type: "youtube",
  },
  {
    name: "Boot.dev",
    blurb: "Backend dev education and CS fundamentals.",
    url: "https://www.youtube.com/@bootdotdev",
    type: "youtube",
  },
  {
    name: "Changelog",
    blurb: "Open source and the software development world.",
    url: "https://www.youtube.com/@Changelog",
    type: "youtube",
  },
  {
    name: "Coding Garden",
    blurb: "Live coding sessions and chill dev vibes.",
    url: "https://www.youtube.com/@CodingGarden",
    type: "youtube",
  },
  {
    name: "Cult Repo",
    blurb: "Curated open source projects and dev tools.",
    url: "https://www.youtube.com/@cultrepo",
    type: "youtube",
  },
  {
    name: "devaslife",
    blurb: "Aesthetic dev setups and indie app building.",
    url: "https://www.youtube.com/@devaslife",
    type: "youtube",
  },
  {
    name: "Linq",
    blurb: "Tech industry insights and developer culture.",
    url: "https://www.youtube.com/@thelinqapp",
    type: "youtube",
  },
  {
    name: "Linus Tech Tips",
    blurb: "Hardware reviews, builds, and tech news.",
    url: "https://www.youtube.com/@LinusTechTips",
    type: "youtube",
  },
  {
    name: "Low Level",
    blurb: "Systems programming and low-level tech deep dives.",
    url: "https://www.youtube.com/@LowLevelTV",
    type: "youtube",
  },
  {
    name: "Terminal Shop",
    blurb: "SSH-powered coffee. Yes, really.",
    url: "https://www.youtube.com/@TerminalDotShop",
    type: "youtube",
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
  const [selected, setSelected] = useState<Photo | null>(null);
  const allCategories = Array.from(
    new Set(projects.map((p) => p.category)),
  );
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(allCategories),
  );
  const [workPage, setWorkPage] = useState(0);
  const [mediaPage, setMediaPage] = useState(0);
  const [postPage, setPostPage] = useState(0);

  const filteredProjects = projects.filter((p) =>
    activeCategories.has(p.category),
  );
  const totalWorkPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const totalMediaPages = Math.ceil(media.length / MEDIA_PER_PAGE);
  const totalPostPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visibleProjects = filteredProjects.slice(
    workPage * PROJECTS_PER_PAGE,
    (workPage + 1) * PROJECTS_PER_PAGE,
  );

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size === 1) return prev;
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
    startTransition(() => setWorkPage(0));
  };
  const visibleMedia = media.slice(
    mediaPage * MEDIA_PER_PAGE,
    (mediaPage + 1) * MEDIA_PER_PAGE,
  );
  const visiblePosts = posts.slice(
    postPage * POSTS_PER_PAGE,
    (postPage + 1) * POSTS_PER_PAGE,
  );

  return (
    <>
      <Header />
      <main id="front" className="zz-homePaper">
        {/* Hero */}
        <section className="zz-homeHero" aria-labelledby="home-headline">
          <h1 id="home-headline" className="zz-homeHeadline">
            Carefully curating food for LLMs
          </h1>
          <p className="zz-homeDeck">
            Software Engineer in HealthCare since 2021, currently at mPulse.
            Having way too much fun building for people who use the web.
          </p>
          <div className="zz-homeHeroActions">
            <a href="https://x.com/matthew_bub" className="zz-homePrimaryLink">
              Follow on X
            </a>
          </div>
        </section>

        {/* Photos */}
        <section className="zz-homeSection">
          {photos.length > 0 && (
            <div className="zz-photosGrid">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  className="zz-photosCell"
                  onClick={() => setSelected(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="zz-photosThumb"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Work */}
        <section className="zz-homeSection" aria-labelledby="career-head">
          <header className="zz-homeSectionHeader">
            <h2 id="career-head" className="zz-homeSectionTitle">
              Work
            </h2>
          </header>

          <ul className="zz-workList">
            <li className="zz-workItem">
              <div className="zz-workHeader">
                <span className="zz-workName">mPulse</span>
                <span className="zz-workYear">2023–2026</span>
              </div>
              <ul className="zz-roleList">
                <li className="zz-roleItem">Software Engineer <span className="zz-roleDetail">Web portals</span></li>
              </ul>
            </li>
            <li className="zz-workItem">
              <div className="zz-workHeader">
                <span className="zz-workName">Health Trio</span>
                <span className="zz-workYear">2021–2023</span>
              </div>
              <ul className="zz-roleList">
                <li className="zz-roleItem">Software Engineer <span className="zz-roleDetail">Web portals</span></li>
              </ul>
            </li>
            <li className="zz-workItem">
              <div className="zz-workHeader">
                <span className="zz-workName">Trilogy</span>
                <span className="zz-workYear">2019–2021</span>
              </div>
              <ul className="zz-roleList">
                <li className="zz-roleItem">Code Tutor <span className="zz-roleDetail">1:1 Recurring Zoom Calls</span></li>
                <li className="zz-roleItem">Teaching Assistant <span className="zz-roleDetail">UCLA</span></li>
                <li className="zz-roleItem">Assignment Grader <span className="zz-roleDetail">All of Trilogy</span></li>
              </ul>
            </li>
            <li className="zz-workItem zz-workFadeOut">
              <div className="zz-workHeader">
                <span className="zz-workName">ShipMonk</span>
                <span className="zz-workYear">2017–2019</span>
              </div>
              <ul className="zz-roleList">
                <li className="zz-roleItem">Warehouse Operations Manager</li>
                <li className="zz-roleItem">Forklift Manager</li>
                <li className="zz-roleItem">Forklift Lead</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* External Involvements & Projects */}
        <section className="zz-homeSection" aria-labelledby="work-head">
          <header className="zz-homeSectionHeader">
            <h2 id="work-head" className="zz-homeSectionTitle">
              External Involvements & Projects
            </h2>
          </header>

          <div className="zz-filterChips" role="group" aria-label="Filter by category">
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`zz-filterChip${activeCategories.has(cat) ? " is-active" : ""}`}
                onClick={() => toggleCategory(cat)}
                aria-pressed={activeCategories.has(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <ul className="zz-workList" key={`${workPage}-${[...activeCategories].join()}`}>
            {visibleProjects.map((project) => {
              const linkProps = project.external
                ? { target: "_blank", rel: "noopener noreferrer external" }
                : {};

              return (
                <li key={project.title} className="zz-workItem">
                  <a href={project.url} className="zz-workLink" {...linkProps}>
                    <span className="zz-workHeader">
                      <span className="zz-workName">{project.title}</span>
                      <span className="zz-workMeta">
                        <span className="zz-workCategory">
                          {project.category}
                        </span>
                        <span className="zz-workYear">{project.year}</span>
                      </span>
                    </span>
                    <span className="zz-workDesc">{project.description}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {totalWorkPages > 1 && (
            <nav className="zz-paginationDots" aria-label="Project pages">
              {Array.from({ length: totalWorkPages }, (_, i) => (
                <button
                  key={i}
                  className={`zz-paginationDot${i === workPage ? " is-active" : ""}`}
                  onClick={() => {
                    startTransition(() => setWorkPage(i));
                  }}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === workPage ? "true" : undefined}
                />
              ))}
            </nav>
          )}
        </section>

        {/* Posts */}
        <section className="zz-homeSection" aria-labelledby="posts-head">
          <header className="zz-homeSectionHeader">
            <h2 id="posts-head" className="zz-homeSectionTitle">
              Latest Articles & Musings
            </h2>
          </header>

          <ul className="zz-workList" key={postPage}>
            {visiblePosts.map((post) => (
              <li key={post.id} className="zz-workItem">
                <a href={`/posts/${post.slug}`} className="zz-workLink no-ext">
                  <span className="zz-workHeader">
                    <span className="zz-workName">{post.title}</span>
                    <span className="zz-workMeta">
                      <span className="zz-workCategory">
                        {formatPostedRelative(post.date || new Date().toISOString())}
                      </span>
                      {post.readTime && (
                        <span className="zz-workYear">{post.readTime}</span>
                      )}
                    </span>
                  </span>
                  {post.deck && (
                    <span className="zz-workDesc">{post.deck}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {totalPostPages > 1 && (
            <nav className="zz-paginationDots" aria-label="Post pages">
              {Array.from({ length: totalPostPages }, (_, i) => (
                <button
                  key={i}
                  className={`zz-paginationDot${i === postPage ? " is-active" : ""}`}
                  onClick={() => {
                    startTransition(() => setPostPage(i));
                  }}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === postPage ? "true" : undefined}
                />
              ))}
            </nav>
          )}

          <a href="/posts" className="zz-homePostsCta">
            Browse all posts
          </a>
        </section>

        {/* YouTube / Podcasts I Watch */}
        <section className="zz-homeSection" aria-labelledby="media-head">
          <header className="zz-homeSectionHeader">
            <h2 id="media-head" className="zz-homeSectionTitle">
              YouTube / Podcasts I Watch
            </h2>
            <p className="zz-homeSectionDeck">
              Folks often ask how I keep my finger on the pulse. Fair to say I
              spend more time on YouTube Premium than the average person, but
              these are some of the primary sources I use to consume tech
              content.
            </p>
          </header>

          <ul className="zz-mediaGrid" key={mediaPage}>
            {visibleMedia.map((item) => (
              <li key={item.name} className="zz-mediaCard">
                <a
                  href={item.url}
                  className="zz-mediaLink"
                  target="_blank"
                  rel="noopener noreferrer external"
                >
                  <span className="zz-mediaTop">
                    <span className="zz-mediaName">{item.name}</span>
                    <span className="zz-mediaType">{item.type}</span>
                  </span>
                  <span className="zz-mediaBlurb">{item.blurb}</span>
                </a>
              </li>
            ))}
          </ul>

          {totalMediaPages > 1 && (
            <nav className="zz-paginationDots" aria-label="Media pages">
              {Array.from({ length: totalMediaPages }, (_, i) => (
                <button
                  key={i}
                  className={`zz-paginationDot${i === mediaPage ? " is-active" : ""}`}
                  onClick={() => {
                    startTransition(() => setMediaPage(i));
                  }}
                  aria-label={`Page ${i + 1}`}
                  aria-current={i === mediaPage ? "true" : undefined}
                />
              ))}
            </nav>
          )}
        </section>

        {selected && (
          <div className="zz-photosOverlay" onClick={() => setSelected(null)}>
            <div
              className="zz-photosModal"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.alt}
                className="zz-photosModalImg"
              />
              <div className="zz-photosModalInfo">
                <p className="zz-photosModalAlt">{selected.alt}</p>
                <p className="zz-photosModalDate">{selected.date}</p>
              </div>
              <button
                className="zz-photosClose"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
