---
title: "Converting an XML Sitemap to JSON in Go"
description: "A guide to converting an XML sitemap to JSON using Go."
pubDate: "March 8 2024"
---

I wanted to document the process of converting an XML file from a sitemap to a JSON format in Golang. Specifically, trying to type an incoming XML request statically has its quirks, looks kind of funny, and is liable to cause me to forget.

**Why Go?** I've found Golang is particularly useful when it comes to parsing XML. You can get really far with the `"encoding/xml"` , `"net/http"` and `"encoding/json"` builtin libraries Go has to offer, which is nice in comparison to alternatives I explored (Python and TypeScript/JavaScript)

### Visualizing the Architecture

I don't learn well from random bits of code, so let's just code this whole thing.

```
my-app
├── main.go
├── library
│    └── FetchSitemapData.go
```

In the `FetchSitemapData.go` file, we might see a simple HTTP request with some basic logging.

```go
package library

import (
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
)

// URL represents a single URL entry in the sitemap.
type URL struct {
	Location     string `xml:"loc"`
	LastModified string `xml:"lastmod"`
}

// URLSet represents the top-level structure of the sitemap file.
type URLSet struct {
	URLs []URL `xml:"url"`
}

// FetchSitemapData fetches and parses the sitemap data from the specified URL.
func FetchSitemapData(url string) (URLSet, error) {
	var data URLSet

	resp, err := http.Get(url)
	if err != nil {
		return data, fmt.Errorf("failed to fetch URL: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return data, fmt.Errorf("failed to read response body: %v", err)
	}

	if err := xml.Unmarshal(body, &data); err != nil {
		return data, fmt.Errorf("failed to parse XML: %v", err)
	}

	return data, nil
}

```

And then, in the `main.go` file, a minimal setup might look like this:

```go
package main

import (
	"encoding/json"
	"fmt"
	"os"

	"your.package.name/library"
)

func main() {
	data, err := library.FetchSitemapData("https://www.example.com/sitemap.xml")
	if err != nil {
        fmt.Printf("Oops, something went wrong: %v\n", err)
	}

	fmt.Println(string(data))
	return
}
```

This extracts the XML as specified; all is well. The challenge with this setup is that the data isn't being parsed beyond the XML extraction, so we end up with a nasty `data` object that doesn't read very well.

We'll implement the `encoding/json` package to convert the data to JSON, update the structs, and marshal the data into JSON. These changes in practice look as follows

```go
package library

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
)

// URL represents a single URL entry in the sitemap.
type URL struct {
	Location     string `xml:"loc" json:"location"`
	LastModified string `xml:"lastmod" json:"lastModified"`
}

// URLSet represents the top-level structure of the sitemap file.
type URLSet struct {
	URLs []URL `xml:"url" json:"urls"`
}

// FetchSitemapData fetches and parses the sitemap data from the specified URL.
func FetchSitemapData(url string) ([]byte, error) {
	var data URLSet

	resp, err := http.Get(url)
	if err != nil {
		return data, fmt.Errorf("failed to fetch URL: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return data, fmt.Errorf("failed to read response body: %v", err)
	}

	if err := xml.Unmarshal(body, &data); err != nil {
		return data, fmt.Errorf("failed to parse XML: %v", err)
	}

	// Convert the data to JSON format
	jsonData, err := json.MarshalIndent(data, "", "  ")
    if err != nil {
        return nil, fmt.Errorf("failed to convert data to JSON: %v", err)
    }

    return jsonData, nil
}

```

To recap the changes, we're parsing the XML into the `data` variable, then we marshal `data` into JSON using the `json.MarshalIndent` for pretty printing. We've also modified the return type from `URLSet` to `[]byte`

This is awesome. The struct tags specific to XML and JSON make data binding feel almost magically straightforward.

Here's an example of what the JSON output might look like with these considerations.

```json
{
  "urls": [
    {
      "location": "https://www.example.com/some-article-1",
      "lastModified": "2023-01-01T22:04:00-06:00"
    },
    {
      "location": "https://www.example.com/some-article-2",
      "lastModified": "2023-01-01T21:50:00-06:00"
    }
    // More URLs...
  ]
}
```

Hope this helps pave the way or jog your memory. Cheers 🍻
