---
title: "A Step by Step Guide to Environment Variables in Go"
description: "A comprehensive guide on working with environment variables in Go programming"
pubDate: March 12 2024
tags:
  ["go", "environment-variables", "configuration", "dotenv", "os", "backend"]
---

To use environment variables in Go, you can utilize the `os` package, which provides a portable way of using operating system functionality. Here's a simple guide on how to do it:

1. **Import the `os` Package**: First, import the `os` package into your Go program.
2. **Read Environment Variables**: Use the `os.Getenv` function to read an environment variable. It returns the value of the environment variable as a string. If the variable is not set, it returns an empty string.

Here's a basic example to demonstrate how to use environment variables in Go:

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // Reading a single environment variable
    myEnvVar := os.Getenv("MY_ENV_VAR")
    fmt.Println("MY_ENV_VAR:", myEnvVar)

    // Setting a default value if the environment variable is not set
    if myEnvVar == "" {
        myEnvVar = "default value"
    }
    fmt.Println("MY_ENV_VAR (after setting default):", myEnvVar)

    // Reading all environment variables
    for _, env := range os.Environ() {
        fmt.Println(env)
    }
}
```

The example above presumes the environment variables are already accessible in your operating system. Follow these steps if you're trying to read from a `.env*` file.

1. **Install the `godotenv` Package**: First, you'll want to install the `godotenv` package. You can do this by running:

```shell
go get github.com/joho/godotenv
```

2. **Create a `.env` file**: Create a file named `.env` in the root of your project and add your environment variables in the format `KEY=value`. For example:

```shell
MY_ENV_VAR=some_value
DATABASE_URL=example_database_url
```

3. **Load `.env` File in Your Go Application**: Use the `godotenv` package to load your `.env` file at the beginning of your program.

Here's an example of how to use `godotenv` in your Go application:

```go
package main

import (
    "fmt"
    "log"
    "os"

    "github.com/joho/godotenv"
)

func main() {
    // Load the .env file in the current directory
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }

    // Reading an environment variable
    myEnvVar := os.Getenv("MY_ENV_VAR")
    fmt.Println("MY_ENV_VAR:", myEnvVar)

	// Reading environment variables
    dbUser := os.Getenv("DB_USER")
    dbPass := os.Getenv("DB_PASS")

    // Concatenating environment variables with additional text
    // to form a database connection string
    dbConnectionString := fmt.Sprintf("user=%s password=%s dbname=mydatabase sslmode=disable", dbUser, dbPass)

    fmt.Println("Database Connection String:", dbConnectionString)
}
```

Remember: Environment variables generally contain sensitive information; be sure to avoid publishing these values.
