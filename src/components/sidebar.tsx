import type { BlogPost } from "../utils/blogLoader";

export default function Sidebar({ posts }: { posts: BlogPost[] }) {
  return (
    <aside className="zz-sidebar" aria-label="Sidebar">
      <section id="blog" className="zz-sidebarSection">
        <div className="zz-sectionHead">Latest posts</div>
        {posts.slice(0, 3).map((post) => (
          <div className="zz-tease">
            <h3 className="zz-teaseHeading">
              <a href={`/blog/${post.slug}`} className="no-ext">
                {post.title}
              </a>
            </h3>
            <div className="zz-teaseMeta">
              {new Date(post.date!).toLocaleDateString()} · {post.readTime}
            </div>
          </div>
        ))}
      </section>

      {/* Quick links */}
      <section className="zz-sidebarSection">
        <div className="zz-sectionHead">Elsewhere</div>
        <p className="zz-tease">
          <a
            href="https://github.com/matthewbub"
            target="_blank"
            rel="noopener noreferrer external"
            className="zz-link"
          >
            GitHub
          </a>
          — Projects, notes, and experiments.
        </p>
        <p className="zz-tease">
          <a
            href="https://www.x.com/matthew_bub"
            target="_blank"
            rel="noopener noreferrer external"
            className="zz-link"
          >
            Twitter
          </a>
          — Random thoughts.
        </p>
        <p className="zz-tease">
          <a href="mailto:6matbub@gmail.com" className="no-ext zz-link">
            Email
          </a>{" "}
          — Best way to reach me.
        </p>
      </section>
      {/* Contact snippet */}
      <section id="contact" className="zz-sidebarSection">
        <div className="zz-sectionHead">Contact</div>
        <p>
          Prefer a form? Use{" "}
          <a href="/contact" className="no-ext zz-link">
            the contact section
          </a>{" "}
          — goes to my database — or send an email.
        </p>
      </section>
    </aside>
  );
}
