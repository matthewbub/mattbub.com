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
	fmt.Fprint(w, version)
}

func main() {
	http.HandleFunc("/", home)
	http.HandleFunc("/version.txt", versionHandler)

	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("web/dist/assets"))))
	fmt.Println("listening on port 8090")
	http.ListenAndServe(":8090", nil)
}
