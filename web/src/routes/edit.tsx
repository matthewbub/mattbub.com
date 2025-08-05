import React, { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/edit")({
  component: Edit,
});

/**
 * Basic CMS (static) with React state
 * - Left: list of posts (filter + select)
 * - Right: editor for the selected post (title, slug, status, date, content)
 * - No backend; all in-memory
 * - Minimal UI, no cards, sans-serif headings
 */
export default function Edit() {
  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "Designing compact UIs without bloat",
      slug: "compact-ui-without-bloat",
      status: "draft",
      date: "2025-07-01",
      tags: ["ui", "design"],
      content:
        "Minimal doesn’t mean sparse—focus on rhythm, spacing, and clear hierarchy.",
    },
    {
      id: "2",
      title: "Dockerizing small Go services",
      slug: "dockerizing-small-go-services",
      status: "draft",
      date: "2025-06-10",
      tags: ["go", "docker", "devops"],
      content:
        "Use multi-stage builds and distroless base images for small containers.",
    },
  ]);

  const [activeId, setActiveId] = useState("1");
  const [q, setQ] = useState("");

  const active = useMemo(
    () => posts.find((p) => p.id === activeId) || null,
    [posts, activeId]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) =>
      [p.title, p.slug, p.status, p.date, (p.tags || []).join(" "), p.content]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [posts, q]);

  function updateActive(patch) {
    setPosts((arr) =>
      arr.map((p) => (p.id === activeId ? { ...p, ...patch } : p))
    );
  }

  function addPost() {
    const id = String(Date.now());
    const today = new Date().toISOString().slice(0, 10);
    const draft = {
      id,
      title: "Untitled Post",
      slug: "untitled-post",
      status: "draft",
      date: today,
      tags: [],
      content: "",
    };
    setPosts((arr) => [draft, ...arr]);
    setActiveId(id);
  }

  function removeActive() {
    setPosts((arr) => arr.filter((p) => p.id !== activeId));
    // Pick another post after deletion
    setActiveId((prev) => {
      const next = filtered.find((p) => p.id !== prev)?.id;
      return next || "";
    });
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #ffffff;
          --ink: #111827;
          --muted: #6b7280;
          --border: #e5e7eb;
          --link: #1d4ed8;
          --ring: rgba(29,78,216,0.12);
        }

        html, body, #root { height: 100%; }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--ink);
          font: 15px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        h1, h2, h3, h4, h5 {
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          margin: 0;
        }

        /* Layout: sidebar + editor */
        .wrap {
          max-width: 1100px;
          margin: 24px auto;
          padding: 0 16px;
        }
        .header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .header h1 { font-size: 22px; }
        .muted { color: var(--muted); font-size: 12.5px; }

        .layout {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        @media (max-width: 840px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar list */
        .sidebar {
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .bar-top {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid var(--border);
        }
        .search {
          flex: 1;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 7px 10px;
          font: inherit;
        }
        .btn {
          appearance: none;
          border: 1px solid var(--border);
          background: #111827;
          color: #fff;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }
        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 60vh;
          overflow: auto;
        }
        .row {
          padding: 10px;
          border-bottom: 1px solid var(--border);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
          cursor: pointer;
        }
        .row[aria-current="true"] {
          background: #f9fafb;
        }
        .row h3 { font-size: 14px; }
        .row .meta { color: var(--muted); font-size: 12px; }

        /* Editor */
        .editor {
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
        }
        .editor-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        .editor-body {
          display: grid;
          gap: 12px;
          padding-top: 12px;
        }
        label {
          display: grid;
          gap: 6px;
          font-size: 13px;
        }
        input[type="text"],
        input[type="date"],
        textarea,
        select {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px 10px;
          font: inherit;
          background: #fff;
          transition: border-color 120ms ease, box-shadow 120ms ease;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #cbd5e1;
          box-shadow: 0 0 0 3px var(--ring);
          outline: none;
        }
        textarea { min-height: 180px; resize: vertical; }

        .row-actions {
          display: flex;
          gap: 8px;
        }
        .btn.secondary {
          background: #fff;
          color: #111827;
        }
      `}</style>

      <main className="wrap">
        <div className="header">
          <h1>Basic CMS</h1>
          <div className="muted">View all posts · Edit one · In-memory</div>
        </div>

        <div className="layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="bar-top">
              <input
                className="search"
                type="search"
                placeholder="Filter posts…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Filter posts"
              />
              <button className="btn" onClick={addPost}>
                New
              </button>
            </div>
            <ul className="list" role="listbox" aria-label="Posts">
              {filtered.map((p) => (
                <li
                  key={p.id}
                  className="row"
                  onClick={() => setActiveId(p.id)}
                  aria-current={activeId === p.id}
                >
                  <div>
                    <h3>{p.title || "Untitled Post"}</h3>
                    <div className="meta">
                      {p.status} · {p.date} · /blog/{p.slug}
                    </div>
                  </div>
                  <div className="row-actions">
                    {/* quick actions if you want later */}
                  </div>
                </li>
              ))}
              {!filtered.length && (
                <li className="row" aria-current="false">
                  <div>
                    <h3>No posts found</h3>
                    <div className="meta">Try a different filter.</div>
                  </div>
                </li>
              )}
            </ul>
          </aside>

          {/* Editor */}
          <section className="editor" aria-label="Editor">
            {!active ? (
              <div className="muted">Select a post to edit.</div>
            ) : (
              <>
                <div className="editor-head">
                  <h2>Edit post</h2>
                  <div className="row-actions">
                    <button className="btn secondary" onClick={removeActive}>
                      Delete
                    </button>
                  </div>
                </div>

                <div className="editor-body">
                  <label>
                    Title
                    <input
                      type="text"
                      value={active.title}
                      onChange={(e) => updateActive({ title: e.target.value })}
                    />
                  </label>

                  <label>
                    Slug
                    <input
                      type="text"
                      value={active.slug}
                      onChange={(e) =>
                        updateActive({ slug: sanitizeSlug(e.target.value) })
                      }
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={active.status}
                      onChange={(e) => updateActive({ status: e.target.value })}
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                      <option value="archived">archived</option>
                    </select>
                  </label>

                  <label>
                    Date
                    <input
                      type="date"
                      value={active.date}
                      onChange={(e) => updateActive({ date: e.target.value })}
                    />
                  </label>

                  <label>
                    Content (Markdown)
                    <textarea
                      value={active.content}
                      onChange={(e) =>
                        updateActive({ content: e.target.value })
                      }
                      placeholder="Write your post content here…"
                    />
                  </label>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

/* Helpers */
function sanitizeSlug(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
