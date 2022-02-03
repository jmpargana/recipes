package main

/*
	Features:
		[-] versioning
		[-] Context middleware
		[-] Custom Handler (how I build web services with go: https://pace.dev/blog/2018/05/09/how-I-write-http-services-after-eight-years.html)
			type Server {
					db
					router (AppHandler)
					email
			}
		[X] Custom Error
		[-] Validation logic
		[X] Pagination
		[-] Configs for everything
		[-] Caching
		[-] Scheduler
		[-] Swagger docs
		[-] OAuth

		[-] DB Migration schema
		[-] Remove sqlx
		[-] Remove chi

		[-] DELETE /recipes/{id}
		[-] DELETE /tags/{id}

*/

import (
	"net/http"

	_ "github.com/lib/pq"
)

func main() {
	db := SetupDB()
	srv := &Server{
		db: db,
	}
	r := srv.Setup()
	http.ListenAndServe(":3001", r)
}
