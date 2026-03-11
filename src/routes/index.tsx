import { startTransition, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Header from "../components/header";
import Footer from "../components/footer";
import { loadAllPosts } from "../utils/postsLoader";
import { formatPostedRelative } from "../utils/dateFormat";

const PROJECTS_PER_PAGE = 4;
const POSTS_PER_PAGE = 4;

type Project = {
  title: string;
  url: string;
  category: string;
  year: string;
  external?: boolean;
};

const projects: Project[] = [
  {
    title: "mattbub.com",
    url: "https://mattbub.com",
    category: "Product",
    year: "2026",
    external: true,
  },
  {
    title: "Yulissa & Matthew's Wedding",
    url: "https://yulissaandmatthew.com",
    category: "Client",
    year: "2025",
    external: true,
  },
  {
    title: "sbrain-SKILL",
    url: "https://github.com/matthewbub/sbrain-SKILL",
    category: "Open Source",
    year: "2025",
    external: true,
  },
  {
    title: "Chartbrew",
    url: "https://github.com/chartbrew/chartbrew",
    category: "Open Source",
    year: "2023",
    external: true,
  },
  {
    title: "sanern.com",
    url: "https://sanern.com",
    category: "Client",
    year: "2024",
    external: true,
  },
  {
    title: "undrstnd-labs",
    url: "https://github.com/undrstnd-labs",
    category: "Open Source",
    year: "2024",
    external: true,
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
  const [workPage, setWorkPage] = useState(0);
  const [postPage, setPostPage] = useState(0);
  const totalWorkPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const totalPostPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const visibleProjects = projects.slice(
    workPage * PROJECTS_PER_PAGE,
    (workPage + 1) * PROJECTS_PER_PAGE,
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
            Software engineer building web products with speed and clarity.
          </h1>
          <p className="zz-homeDeck">
            I ship thoughtful products that balance product feel with production
            stability. Currently building in public and sharing what I learn.
          </p>
          <div className="zz-homeHeroActions">
            <a href="https://x.com/matthew_bub" className="zz-homePrimaryLink">
              Follow on X
            </a>
            <a href="mailto:6matbub@gmail.com" className="zz-homeSecondaryLink">
              Get in touch
            </a>
          </div>
        </section>

        {/* Work */}
        <section className="zz-homeSection" aria-labelledby="work-head">
          <header className="zz-homeSectionHeader">
            <h2 id="work-head" className="zz-homeSectionTitle">
              Work
            </h2>
          </header>

          <ul className="zz-workList" key={workPage}>
            {visibleProjects.map((project) => {
              const linkProps = project.external
                ? { target: "_blank", rel: "noopener noreferrer external" }
                : {};

              return (
                <li key={project.title} className="zz-workItem">
                  <a
                    href={project.url}
                    className="zz-workLink"
                    {...linkProps}
                  >
                    <span className="zz-workName">{project.title}</span>
                    <span className="zz-workMeta">
                      <span className="zz-workCategory">{project.category}</span>
                      <span className="zz-workYear">{project.year}</span>
                    </span>
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
              Latest
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
                <p className="zz-homePostDeck">{post.author}</p>
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
      </main>
      <Footer />
    </>
  );
}
