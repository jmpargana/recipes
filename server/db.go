package main

import (
	"log"

	"github.com/jmoiron/sqlx"
)

func SetupDB() *sqlx.DB {
	db, err := sqlx.Connect("postgres", "user=user password=pass sslmode=disable dbname=postgres")
	if err != nil {
		log.Fatalln(err)
	}
	db.MustExec(schema)
	return db
}
