package main

import (
	"fmt"
	"log"

	"github.com/jmoiron/sqlx"
)

func SetupDB() *sqlx.DB {


	// dsn := fmt.Sprintf("host=")
	connStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
		"user",
		"pass",
		"db",
		"5432",
		"postgres",
)

	db, err := sqlx.Connect("postgres",connStr)
	if err != nil {
		log.Fatalln(err)
	}
	db.MustExec(schema)
	return db
}
