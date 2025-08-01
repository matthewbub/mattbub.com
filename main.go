package main

import (
	"fmt"
	"net/http"
	"os"
)

func home(w http.ResponseWriter, req *http.Request) {
	html, err := os.ReadFile("./web/dist/index.html")
	if err != nil {
		fmt.Fprintf(w, "Error reading index.html: %v", err)
		return
	}

	fmt.Fprintf(w, "%s", string(html))
}

func main() {
	http.HandleFunc("/", home)
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("web/dist/assets"))))

	fmt.Println("listening on port 8090")
	http.ListenAndServe(":8090", nil)
}
