CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME NOT NULL,
    path TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    referrer TEXT NOT NULL
);

CREATE INDEX idx_page_views_timestamp ON page_views(timestamp);