package main

import (
	"fmt"
	"log"
  "os"

	"github.com/jmoiron/sqlx"
)

func mustGetenv(k string) string {
	v := os.Getenv(k)
	if v == "" {
		log.Fatalf("Warning: %s environment variable not set.\n", k)
	}
	return v
}

var (
        dbUser                 = mustGetenv("DB_USER")                  // e.g. 'my-db-user'
        dbPwd                  = mustGetenv("DB_PASS")                  // e.g. 'my-db-password'
        instanceConnectionName = mustGetenv("INSTANCE_CONNECTION_NAME") // e.g. 'project:region:instance'
        dbName                 = mustGetenv("DB_NAME")                  // e.g. 'my-database'
)



func SetupDB() *sqlx.DB {
  socketDir, isSet := os.LookupEnv("DB_SOCKET_DIR")
  if !isSet {
          socketDir = "/cloudsql"
  }

  dbURI := fmt.Sprintf("%s:%s@unix(/%s/%s)/%s?parseTime=true", dbUser, dbPwd, socketDir, instanceConnectionName, dbName)


	// dsn := fmt.Sprintf("host=")
	// connStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
	// 	os.Getenv("PQ_USER"),
	// 	os.Getenv("PQ_PASS"),
	// 	os.Getenv("PQ_HOST"),
    // "5432",
	// 	os.Getenv("PQ_DB"),
// )

	db, err := sqlx.Connect("postgres",dbURI)
	if err != nil {
		log.Fatalln(err)
	}
	db.MustExec(schema)
	return db
}
