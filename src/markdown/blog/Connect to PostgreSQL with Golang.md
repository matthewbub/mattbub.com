---
title: "Connect to PostgreSQL with Golang"
description: "A guide on establishing and managing PostgreSQL database connections using Go, including best practices and implementation details."
pubDate: March 14 2024
tags: ["go", "postgresql", "database", "sql", "dotenv", "connection", "backend"]
---

The goal is simple: create a secure PostgreSQL connection in Golang that will allow you to continue with your mission.

## Required Packages

The two packages we're going to need for this are:

- github.com/lib/pq - Postgres driver for the `database/sql` package
- github.com/joho/godotenv - Used to load environment variables from `.env` files

## Installing Dependencies

Let's go ahead and install the dependencies and dive straight into the code.

```shell
go get github.com/lib/pq
go get github.com/joho/godotenv
```

## Obtaining Database Credentials

Obtain your PostgreSQL database connection credentials. There are many cloud providers you can look into, such as [Railway](https://railway.app/), or you could opt for a local PostgreSQL instance if you prefer.

## Creating the .env File

We'll need to create a `.env` file at the root of our project. This file is where we can store sensitive information about the project. It typically includes sensitive information such as API Keys and database credentials.

**Note:** This file should be excluded from version control software and kept locally on the machine where the software is running.

```shell
PG_USER=# Your PostgreSQL Username
PG_DBNAME=# Your PostgreSQL Database Instance
PG_PASSWORD=# Your PostgreSQL Password
PG_HOST=# Your PostgreSQL Host
PG_PORT=# Your PostgreSQL Post
PG_SSLMODE=disable
```

## Building the Connection String

Now, we can load the environment variables and build the PostgreSQL connection string. I prefer to keep this logic in an isolated file because I'll likely need it in various places.

Here's the foundation for an `/utils/database.go` file.

```go
package utils

import (
	"github.com/joho/godotenv"

	"fmt"
	"os"
)

func buildConnectionString() (string, error) {
	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		return "", err
	}

	PG_USER := os.Getenv("PG_USER")
	PG_DBNAME := os.Getenv("PG_DBNAME")
	PG_PASSWORD := os.Getenv("PG_PASSWORD")
	PG_HOST := os.Getenv("PG_HOST")
	PG_PORT := os.Getenv("PG_PORT")
	PG_SSLMODE := os.Getenv("PG_SSLMODE")

	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=%s port=%s sslmode=%s", PG_USER, PG_DBNAME, PG_PASSWORD, PG_HOST, PG_PORT, PG_SSLMODE)

	return connStr, nil
}
```

We went into depth on [how to use environment variables in Go](https://www.matthewbub.com/articles/a-step-by-step-guide-to-environment-variables-in-go) if you're curious and want a more fundamental understanding.

## Establishing the Database Connection

Now, we're good to establish the database connection. Import the `"database/sql"`
`"github.com/lib/pq"` packages. The PostgreSQL driver we installed can be referenced as a blank import because we need to ensure the driver exists for the `database/sql` package.

Building on top of what we've started above:

```go
package utils

import (
	"database/sql"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"

	"fmt"
	"os"
)

func buildConnectionString() (string, error) {
  // ... Details omitted
}

// Database opens a new database connection
func Database() (*sql.DB, error) {
	// Build the connection string
	connStr, err := buildConnectionString()
	if err != nil {
		return nil, err
	}

	// Open a database connection
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		// Close the database connection if Ping fails
		db.Close()
		return nil, err
	}

	return db, nil
}
```

## Testing the Connection

That's not so bad. Now we can test the connection from the `main.go`

```go
package main

import (
	"log"
	"net/http"

	"your-workspace/utils"
	_ "github.com/lib/pq"
)

func main() {
	db, err := utils.Database()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	// Ensure the database connection is closed when the main function exits
	defer db.Close()


	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	} else {
		log.Println("Successfully connected and pinged the database.")
	}

	// Continue with the rest of your application...
}
```

All we need to do from here is confirm that the database connection has been established.

```shell
go run main.go

# 2024/03/12 20:24:34 Successfully connected and pinged the database.
```

And with that, we've successfully established a connection to the PostgreSQL database. Cheers.
