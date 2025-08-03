package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func incrementPageView(path, userAgent, referrer string) error {
	_, err := db.Exec(
		`INSERT INTO page_views (timestamp, path, user_agent, referrer) VALUES (datetime('now'), ?, ?, ?)`,
		path, userAgent, referrer,
	)
	if err != nil {
		return err
	}

	return nil
}

func getPageViewCount() (int, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM page_views").Scan(&count)
	return count, err
}

func home(w http.ResponseWriter, req *http.Request) {
	cookie, err := req.Cookie("session_view")

	if err != nil || cookie.Value == "" {
		path := req.URL.Path
		if path == "/" {
			path = "home"
		}

		// No cookie = new session, count the view
		if err := incrementPageView(path, req.UserAgent(), req.Referer()); err != nil {
			log.Printf("Failed to increment page view: %v", err)
		}

		// Set cookie with 5min TTL
		http.SetCookie(w, &http.Cookie{
			Name:     "session_view",
			Value:    "1",
			MaxAge:   300, // 5 minutes
			HttpOnly: true,
			Path:     "/",
		})
	}

	html, err := os.ReadFile("./web/dist/index.html")
	if err != nil {
		log.Printf("Error reading index.html: %v", err)
		return
	}

	log.Printf("%s", string(html))
}

func statsHandler(w http.ResponseWriter, _ *http.Request) {
	count, err := getPageViewCount()
	if err != nil {
		log.Printf("Error getting page view count: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"page_views": %d}`, count)
}

// this variable gets set at buildtime
// search `-X main.GitCommit=${GIT_COMMIT}` in codebase to learn more
var GitCommit string

func versionHandler(w http.ResponseWriter, req *http.Request) {
	version := GitCommit
	if len(version) > 7 {
		version = version[:7]
	}

	if version == "" {
		version = "unknown"
	}

	w.Header().Set("Content-Type", "text/plain")
	log.Printf("%s", version)
}

func initDb() {
	var err error

	db, err = sql.Open("sqlite3", "./data/app.db")
	if err != nil {
		log.Println("Error opening database:", err)
		os.Exit(1)
	}

	if err := db.Ping(); err != nil {
		log.Println("Error pinging database:", err)
		os.Exit(1)
	}

	// run migrations
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{})
	if err != nil {
		log.Println("Error creating driver:", err)
		os.Exit(1)
	}
	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"sqlite3",
		driver,
	)
	if err != nil {
		log.Println("Error creating migrator:", err)
		os.Exit(1)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Println("Error running migrations:", err)
		os.Exit(1)
	}

	log.Println("Database initialized")
}

func main() {
	if err := os.MkdirAll("./data", 0755); err != nil {
		log.Println("Error creating data directory:", err)
		os.Exit(1)
	}

	initDb()

	http.HandleFunc("/", home)
	http.HandleFunc("/version.txt", versionHandler)

	http.HandleFunc("/api/stats", statsHandler)

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("web/dist/assets"))))
	log.Println("listening on port 8090")
	http.ListenAndServe(":8090", nil)
}
