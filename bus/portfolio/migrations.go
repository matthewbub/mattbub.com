package portfolio

import (
	"database/sql"
	"fmt"
)

func runPortfolioMigrations(db *sql.DB) error {
	// Create page_views table if it doesn't exist
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS page_views (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp DATETIME NOT NULL,
		path TEXT NOT NULL,
		user_agent TEXT,
		referrer TEXT
	);

	CREATE TABLE IF NOT EXISTS contact_form_submissions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp DATETIME NOT NULL,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		subject TEXT,
		message TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS error_logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp DATETIME NOT NULL,
		message TEXT NOT NULL
	);
	`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create tables: %v", err)
	}

	// Create index on timestamp
	createIndexSQL := `CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);`
	_, err = db.Exec(createIndexSQL)
	if err != nil {
		return fmt.Errorf("failed to create index on page_views: %v", err)
	}

	return nil
}
