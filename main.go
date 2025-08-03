package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

func home(w http.ResponseWriter, req *http.Request) {
	html, err := os.ReadFile("./web/dist/index.html")
	if err != nil {
		log.Printf("Error reading index.html: %v", err)
		return
	}

	log.Printf("%s", string(html))
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

	db, err := sql.Open("sqlite3", "./data/app.db")
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

	if err := m.Up(); err != nil {
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

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("web/dist/assets"))))
	log.Println("listening on port 8090")
	http.ListenAndServe(":8090", nil)
}
