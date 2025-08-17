package portfolio

import (
	"fmt"
	"net/http"
)

// this variable gets set at buildtime
// search `-X main.GitCommit` in codebase to learn more
var GitCommit string

func VersionHandler(w http.ResponseWriter, req *http.Request) {
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
