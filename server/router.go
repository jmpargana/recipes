package main

import "net/http"

type Route struct {
	method string
	path   string
	fn     RouteFunction
}

type RouteFunction func(http.ResponseWriter, *http.Request) *Err

func (s *Server) Routes() []*Route {
	return []*Route{
		{
			"GET",
			"/tags",
			s.getTags,
		},
		{
			"POST",
			"/recipes",
			s.postRecipe,
		},
		{
			"GET",
			"/recipes",
			s.getRecipes,
		},
	}
}
