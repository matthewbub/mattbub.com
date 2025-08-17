package portfolio

import (
	"fmt"
	"net/http"
)

func HealthHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "OK"}`)
}
