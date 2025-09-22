package portfolio

import (
	"database/sql"
	"fmt"
	"log"
)

func runPortfolioMigrations(db *sql.DB) error {
	// Create page_views table if it doesn't exist
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS page_views (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		timestamp DATETIME NOT NULL,
		path TEXT NOT NULL,
		user_agent TEXT,
		referrer TEXT,
		ip_address TEXT,
		accept_language TEXT,
		request_method TEXT
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

	// Add new columns to existing page_views table if they don't exist
	addColumnsSQL := `
	ALTER TABLE page_views ADD COLUMN ip_address TEXT;
	ALTER TABLE page_views ADD COLUMN accept_language TEXT;
	ALTER TABLE page_views ADD COLUMN request_method TEXT;
	`
	_, err = db.Exec(addColumnsSQL)
	if err != nil {
		// Ignore errors if columns already exist
		log.Printf("Note: Some columns may already exist: %v", err)
	}

	// Create index on timestamp
	createIndexSQL := `CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);`
	_, err = db.Exec(createIndexSQL)
	if err != nil {
		return fmt.Errorf("failed to create index on page_views: %v", err)
	}

	return nil
}
