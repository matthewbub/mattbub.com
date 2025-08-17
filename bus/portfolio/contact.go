package portfolio

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type ContactPayload struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func ContactHandler(w http.ResponseWriter, req *http.Request) {
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

	getPortfolioDb().Exec(
		`INSERT INTO contact_form_submissions (timestamp, name, email, subject, message) VALUES (datetime('now'), ?, ?, ?, ?)`,
		payload.Name, payload.Email, payload.Subject, payload.Message,
	)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "Collected contact form submission"}`)
}
