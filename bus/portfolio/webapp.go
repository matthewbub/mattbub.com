package portfolio

import (
	"log"
	"net/http"
	"os"
)

func WebappHandler(w http.ResponseWriter, req *http.Request) {
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
