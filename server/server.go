package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jmoiron/sqlx"
  "net/http"
  "strings"
  "fmt"
)

type Server struct {
	db *sqlx.DB
}

func (s *Server) Setup() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)

	for _, route := range s.Routes() {
		r.Method(route.method, route.path, ErrorHandler(route.fn))
	}
	r.Route("/recipes/{recipeID}", func(r chi.Router) {
		r.Use(RecipeCtx)
		r.Method("GET", "/", ErrorHandler(s.getRecipeByID))
	})

  // root, _ := filepath.Abs("../client/public")
  // fs := http.StripPrefix("/static/", http.FileServer(http.Dir(root)))
  FileServer(r, "/", http.Dir("public"))
  // fs := http.FileServer(http.Dir("public"))
  // r.Handle("/", http.StripPrefix("/static/*", http.StripPrefix("/static/", fs)))

	return r
}

// FileServer conveniently sets up a http.FileServer handler to serve
// static files from a http.FileSystem.
func FileServer(r chi.Router, path string, root http.FileSystem) {
  fmt.Println("Reached here!!!")
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
    fmt.Printf("got here with %v\n", fs)
		fs.ServeHTTP(w, r)
	})
}
