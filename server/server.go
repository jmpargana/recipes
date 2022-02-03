package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jmoiron/sqlx"
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
	return r
}