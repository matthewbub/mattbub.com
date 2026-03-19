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
  {
    title: "site-manifest",
    url: "/docs/site-manifest",
    description:
      "TypeScript package for defining editable site content with a single schema-backed contract. I'm using this as the contract between the site label editor for marriednext.com Uses JSON Schema  the contract between what AI generates and what users can edit",
    category: "Open Source",
    year: "2026",
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
  const [workPage, setWorkPage] = useState(0);
  const [mediaPage, setMediaPage] = useState(0);
  const [postPage, setPostPage] = useState(0);
  const totalWorkPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const totalMediaPages = Math.ceil(media.length / MEDIA_PER_PAGE);
  const totalPostPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visibleProjects = projects.slice(
    workPage * PROJECTS_PER_PAGE,
    (workPage + 1) * PROJECTS_PER_PAGE,
  );
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
            <li className="zz-workItem">
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

          <ul className="zz-workList" key={workPage}>
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

          <div className="zz-homePostList" key={postPage}>
            {visiblePosts.map((post) => (
              <article key={post.id} className="zz-homePostCard">
                <div className="zz-homePostMeta">
                  {formatPostedRelative(post.date || new Date().toISOString())}
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
              </article>
            ))}
          </div>

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
