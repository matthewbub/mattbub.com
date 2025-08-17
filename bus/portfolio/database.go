package portfolio

import (
	"database/sql"
	"log"
	"sync"
)

var instance *sql.DB
var once sync.Once

func setPortfolioDb(db *sql.DB) {
	once.Do(func() {
		instance = db
	})
}

func getPortfolioDb() *sql.DB {
	return instance
}

func LogError(message string) {
	db := getPortfolioDb()
	if db == nil {
		log.Println(message)
		return
	}
	_, err := db.Exec(`INSERT INTO error_logs (timestamp, message) VALUES (datetime('now'), ?)`, message)
	if err != nil {
		log.Println(message)
		log.Println(err)
	}
}
