package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	_ "modernc.org/sqlite"
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

	html, err := os.ReadFile("./dist/index.html")
	if err != nil {
		log.Printf("Error reading index.html: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	w.Write(html)
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

// func maliciousContent(message string) bool {
// 	// check for malicious content

// 	// check for spam
// 	// TODO: implement
// 	return false
// }

type ContactPayload struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func contactHandler(w http.ResponseWriter, req *http.Request) {
	body, err := io.ReadAll(req.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var payload ContactPayload
	if err := json.Unmarshal(body, &payload); err != nil {
		log.Printf("Error unmarshalling request body: %v", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// Validate field lengths to prevent abuse and ensure reasonable message sizes
	if len(payload.Name) > 100 || len(payload.Email) > 100 || len(payload.Subject) > 200 || len(payload.Message) > 2000 {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// if maliciousContent(payload.Message) {
	// 	http.Error(w, "Bad Request", http.StatusBadRequest)
	// 	return
	// }

	db.Exec(
		`INSERT INTO contact_form_submissions (timestamp, name, email, subject, message) VALUES (datetime('now'), ?, ?, ?, ?)`,
		payload.Name, payload.Email, payload.Subject, payload.Message,
	)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "Collected contact form submission"}`)
}

func healthHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "OK"}`)
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
	fmt.Fprintf(w, "%s", version)
}

func initDb() {
	var err error

	db, err = sql.Open("sqlite", "./data/app.db")
	if err != nil {
		log.Println("Error opening database:", err)
		os.Exit(1)
	}

	if err := db.Ping(); err != nil {
		log.Println("Error pinging database:", err)
		os.Exit(1)
	}

	// Run simple migration
	if err := runMigrations(); err != nil {
		log.Println("Error running migrations:", err)
		os.Exit(1)
	}

	log.Println("Database initialized")
}

func runMigrations() error {
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
	`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create page_views table: %v", err)
	}

	// Create index on timestamp
	createIndexSQL := `CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);`
	_, err = db.Exec(createIndexSQL)
	if err != nil {
		return fmt.Errorf("failed to create index on page_views: %v", err)
	}

	return nil
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
	http.HandleFunc("/api/contact", contactHandler)
	http.HandleFunc("/api/health", healthHandler)

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("web/dist/assets"))))
	log.Println("listening on port 8090")
	http.ListenAndServe(":8090", nil)
}
