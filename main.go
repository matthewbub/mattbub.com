package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"matthewbub.com/bus/portfolio"

	_ "modernc.org/sqlite"
)

func main() {
	// Handle panics
	defer func() {
		if r := recover(); r != nil {
			portfolio.LogError("Panic recovered: " + fmt.Sprintf("%v", r))
			os.Exit(1)
		}
	}()

	// Ensure data directory exists
	if err := os.MkdirAll("./data", 0755); err != nil {
		portfolio.LogError("Error creating data directory: " + err.Error())
		os.Exit(1)
	}

	portfolio.Init()

	http.HandleFunc("/", portfolio.WebappHandler)
	http.HandleFunc("/version.txt", portfolio.VersionHandler)
	http.HandleFunc("/api/stats", portfolio.StatsHandler)
	http.HandleFunc("/api/contact", portfolio.ContactHandler)
	http.HandleFunc("/api/health", portfolio.HealthHandler)

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("dist/assets"))))
	http.Handle("/", http.FileServer(http.Dir("dist")))

	log.Printf("Server starting on port 8090 (Git commit: %s)", portfolio.GitCommit)
	if err := http.ListenAndServe(":8090", nil); err != nil {
		portfolio.LogError("Server error: " + err.Error())
		os.Exit(1)
	}
}
