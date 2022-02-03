package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

const (
	INSERT_RECIPE     = "INSERT INTO recipes (title, method, time, tags) VALUES ($1, $2, $3, $4) RETURNING id"
	INSERT_TAG = `INSERT INTO tags (name) VALUES ($1) RETURNING id;`
	GET_TAG_ID = `SELECT id FROM tags WHERE name = $1`
	INSERT_RECIPE_TAG = "INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)"
	SELECT_RECIPES_BY_TAGS = `
		SELECT id,title,method,time,tags 
		FROM recipes AS r 
		INNER JOIN recipe_tags AS rt ON r.id = rt.recipe_id 
		WHERE tag_id IN `
	SELECT_RECIPES = "SELECT id,title,method,time,tags FROM recipes"
	SELECT_RECIPE_BY_ID = "SELECT id,title,method,time,tags FROM recipes WHERE id = $1"
)

func (s *Server) postRecipe(w http.ResponseWriter, r *http.Request) *Err {
	var recipe Recipe
	if err := json.NewDecoder(r.Body).Decode(&recipe); err != nil {
		return newErr("recipe_decode", err)
	}
	// TODO: Validate body
	if err := validateBody(&recipe); err != nil {
		return err
	}
	saveRecipeAndTagsInDB(&recipe, s.db)
	w.WriteHeader(200)
	return nil
}

func (s *Server) getRecipes(w http.ResponseWriter, r *http.Request) *Err {
	filters, err := parseFiltersFromQuery(r.URL.Query())
	if err != nil {
		return err
	}

	recipes, err := getRecipesFromDB(s.db, filters)
	if err != nil {
		return err
	}

	w.WriteHeader(200)
	b, _ := json.Marshal(recipes)
	w.Write(b)
	return nil
}

func (s *Server) getRecipeByID(w http.ResponseWriter, r *http.Request) *Err {
	recipeID, _ := strconv.Atoi(fmt.Sprintf("%v", r.Context().Value("recipeID")))
	var recipe Recipe
	var tags string
	if err := s.db.QueryRow(SELECT_RECIPE_BY_ID, recipeID).
		Scan(&recipe.ID, &recipe.Title, &recipe.Method, &recipe.Time, &tags); err != nil {
		return newErr("recipe_not_found", err)
	}
	if err := json.Unmarshal([]byte(tags), &recipe.Tags); err != nil {
		return newErr("unmarshall_tags", err)
	}

	w.WriteHeader(200)
	b, _ := json.Marshal(recipe)
	w.Write(b)
	return nil
}


func RecipeCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		recipeID := chi.URLParam(r, "recipeID")
		ctx := context.WithValue(r.Context(), "recipeID", recipeID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}