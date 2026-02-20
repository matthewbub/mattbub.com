---
title: "Serving Static Content with Go and Gin"
description: "A straightforward guide to serving static content using Go and the Gin web framework."
pubDate: "March 19 2024"
tags: ["go", "gin", "web", "static-files", "server", "http", "backend"]
author: "Matthew Bub"
---

To build a web app you've got to be able to serve static content somehow. This article aims to do just that with HTML, CSS and JavaScript.

## Setting Up the Environment

The only required package needed for the scope of this article is:

- github.com/gin-gonic/gin - An HTTP Web Framework-

## Installing Dependencies

If you aren't already using Gin, you'll need to install the package as a dependency to the project.

```shell
go get github.com/gin-gonic/gin
```

## Preparing HTML Templates

Now we could create a `templates/` directory and stick some HTML in there.

```shell
mkdir templates
touch templates/index.html
echo "<h1>{{.message}}</h1>" >> templates/index.html
```

### Configuring the Server in Go

Let's say we're going to set the server up in the `main.go` file. To utilize the templating aspect of Go and Gin, we can load the HTML glob at runtime using the [`LoadHTMLGlob`](https://gin-gonic.com/docs/examples/html-rendering/) method.

```go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	// Set the location of the templates
	r.LoadHTMLGlob("templates/*")

	// Define a route to serve the HTML file
	r.GET("/", func(c *gin.Context) {
		// Render the HTML file
		c.HTML(200, "index.html", gin.H{
			"message": "Hello, World!",
		})
	})

	r.Run()
}
```

## Running the Application

Now we're in a position where we can run the app, and see if things are working as expected.

```shell
go run main.go
```

## Serving CSS and JavaScript

Now we can go a step further and setup CSS and JS content delivery as well. Create a new directory titled `static` and organize your files within accordingly.

## Organizing Static Files

```shell
example-app
├── main.go
├── templates
│   └── index.html
└── static
    ├── css
    │   └── style.css
    └── js
        └── script.js
```

## Updating the Server Configuration

In the `main.go` file, we can add an additional method - [`.Static`](https://gin-gonic.com/docs/examples/serving-static-files/) right below the `.LoadHTMLGlob` method to load a glob of static assets. Optionally, we could use the `.StaticFile` method to serve files on an individual basis.

```go
// Set the location of the templates
router.LoadHTMLGlob("templates/*")
 // Serve all files under the "./static" directory at the "/static" path
router.Static("/static", "./static")
```

## Modifying HTML for Static Assets

Finally, we can update the HTML file in the `templates/` directory to load this assets.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{.message}}</title>
    <link rel="stylesheet" href="/static/css/style.css" />
  </head>
  <body>
    <h1>Hello, Gin!</h1>
    <script src="/static/js/script.js"></script>
  </body>
</html>
```

## Restarting the Server

Since we've modified the server's code again, we'll need to restart server, same as before - yada yada

```shell
go run main.go
```

Cheers
