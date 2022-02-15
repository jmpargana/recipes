package main

import (
	"fmt"
	"log"
  "os"

	"github.com/jmoiron/sqlx"
)

func SetupDB() *sqlx.DB {


	// dsn := fmt.Sprintf("host=")
	connStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
		os.Getenv("PQ_USER"),
		os.Getenv("PQ_PASS"),
		os.Getenv("PQ_HOST"),
    "5432",
		os.Getenv("PQ_DB"),
)

	db, err := sqlx.Connect("postgres",connStr)
	if err != nil {
		log.Fatalln(err)
	}
	db.MustExec(schema)
	return db
}
