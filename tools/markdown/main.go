package main

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/adrg/frontmatter"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/html"
	"github.com/gomarkdown/markdown/parser"
)

// parseFrontMatter now returns both the frontmatter and the markdown content
func parseFrontMatter(fileContents string) (matter struct {
	Title       string `yaml:"title"`
	Description string `yaml:"description"`
	PubDate     string `yaml:"pubDate"`
}, content string) {
	rest, err := frontmatter.Parse(strings.NewReader(fileContents), &matter)
	if err != nil {
		log.Fatalf("failed to parse front matter: %v", err)
	}
	return matter, string(rest)
}

func mdToHTML(md []byte) []byte {
	// create markdown parser with extensions
	extensions := parser.CommonExtensions | parser.AutoHeadingIDs | parser.NoEmptyLineBeforeBlock
	p := parser.NewWithExtensions(extensions)
	doc := p.Parse(md)

	// create HTML renderer with extensions
	htmlFlags := html.CommonFlags | html.HrefTargetBlank
	opts := html.RendererOptions{Flags: htmlFlags}
	renderer := html.NewRenderer(opts)

	return markdown.Render(doc, renderer)
}

func safeFileName(fileName string) string {
	return strings.ReplaceAll(fileName, " ", "-")
}

func makeHtmlTemplate(title string, description string, pubDate string, content string) string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>` + title + `</title>
	<meta name="description" content="` + description + `">
</head>
<body>
	<h1 class="title">` + title + `</h1>
	<p class="description">` + description + `</p>
	<p class="pubDate">` + pubDate + `</p>
	<div class="content">
		` + content + `
	</div>
</body>
</html>`
}

func main() {
	dirPath := "../../src/markdown/blog"
	htmlDir := "../../src/html/blog"

	entries, err := os.ReadDir(dirPath)
	if err != nil {
		log.Fatalf("failed to read directory: %v", err)
		os.Exit(1)
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		// get file path
		filePath := filepath.Join(dirPath, entry.Name())

		// read file contents
		fileContents, err := os.ReadFile(filePath)
		if err != nil {
			log.Printf("failed to read file %s: %v", filePath, err)
			continue
		}

		matter, content := parseFrontMatter(string(fileContents))
		html := mdToHTML([]byte(content))

		htmlFileName := safeFileName(matter.Title) + ".html"
		htmlFilePath := filepath.Join(htmlDir, htmlFileName)
		htmlTemplate := makeHtmlTemplate(matter.Title, matter.Description, matter.PubDate, string(html))
		err = os.WriteFile(htmlFilePath, []byte(htmlTemplate), 0644)
		if err != nil {
			log.Printf("failed to write file %s: %v", htmlFilePath, err)
			continue
		}

	}

	os.Exit(0)
}
