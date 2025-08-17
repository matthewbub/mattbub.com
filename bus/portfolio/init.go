package portfolio

import (
	"database/sql"
	"log"
	"os"
)

var db *sql.DB

func Init() {
	var err error

	db, err = sql.Open("sqlite", "./data/app.db")
	if err != nil {
		log.Println("Error opening database:", err)
		os.Exit(1)
	}

	// ping the database to ensure it's connected
	if err := db.Ping(); err != nil {
		log.Println("Error pinging database:", err)
		os.Exit(1)
	}

	// run migrations
	if err := runPortfolioMigrations(db); err != nil {
		log.Println("Error running migrations:", err)
		os.Exit(1)
	}

	// expose singleton
	setPortfolioDb(db)

	log.Println("Database initialized")
}
