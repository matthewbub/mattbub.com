package portfolio

import (
	"fmt"
	"log"
	"net/http"
)

func StatsHandler(w http.ResponseWriter, _ *http.Request) {
	count, err := getPageViewCount()
	if err != nil {
		log.Printf("Error getting page view count: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"page_views": %d}`, count)
}
