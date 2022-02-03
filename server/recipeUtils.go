package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strconv"
	"strings"

	"github.com/jmoiron/sqlx"
)

type Filters struct {
	limit  int
	offset int
	tags   []int
}

func parseFromQuery(values url.Values, base int, key string) (int, error) {
	keyInQuery := values.Get(key)
	if keyInQuery != "" {
		return strconv.Atoi(keyInQuery)
	}
	return base, nil
}

func parseTagsFromQuery(values url.Values) (tags []int, err error) {
	tagsInQuery := values.Get("tags")
	tagsAsStr := strings.Split(tagsInQuery, ",")
	if tagsAsStr[0] == ""  {
		return []int{}, nil
	}
	for _, tag := range tagsAsStr {
		parsed, err := strconv.Atoi(tag)
		if err != nil {
			return nil, err
		}
		tags = append(tags, parsed)
	}
	return tags, nil
}

func parseFiltersFromQuery(values url.Values) (*Filters, *Err) {
	// TODO: read limit and offset from env
	limit, err := parseFromQuery(values, 100, "limit")
	if err != nil {
		return nil, newErr("invalid_limit", err)
	}
	offset, err := parseFromQuery(values, 0, "offset")
	if err != nil {
		return nil, newErr("invalid_offset", err)
	}
	tags, err := parseTagsFromQuery(values)
	if err != nil {
		return nil, newErr("invalid_tags", err)
	}

	return &Filters{
		limit,
		offset,
		tags,
	}, nil
}

func preprocessSelectStmt(filters *Filters) string {
	if len(filters.tags) == 0 {
		return fmt.Sprintf("%s LIMIT %d OFFSET %d", SELECT_RECIPES, filters.limit, filters.offset)
	}

	tagsAsStr := []string{}

	for _, it := range filters.tags {
		tagsAsStr = append(tagsAsStr, strconv.Itoa(it))
	}

	return fmt.Sprintf(
		"%s (%s) GROUP BY id LIMIT %d OFFSET %d",
		SELECT_RECIPES_BY_TAGS,
		strings.Join(tagsAsStr, ","),
		filters.limit,
		filters.offset,
	)
}


func validateBody(recipe *Recipe) *Err {
	// anything missing
	if len(recipe.Title) == 0 {
		return newErr("missing_title", errors.New("missing title"))
	}
	if len(recipe.Method) == 0 {
		return newErr("missing_method", errors.New("missing method"))
	}
	if recipe.Time <= 0 {
		return newErr("missing_time", errors.New("missing time"))
	}
	if len(recipe.Tags) == 0 {
		return newErr("missing_tags", errors.New("missing tags"))
	}

	if anyDuplicateTag(recipe.Tags) {
		return newErr("duplicate_tags", errors.New("duplicate tags"))
	}

	return nil
}

func anyDuplicateTag(tags []Tag) bool {
	duplicates := make(map[string]struct{})
	for _, t := range tags {
		duplicates[t.Name] = struct{}{}
	}
	return len(duplicates) != len(tags)
}

func saveRecipeAndTagsInDB(recipe *Recipe, db *sqlx.DB) {
	recipeID := insertRecipe(db, recipe)
	insertTagsFor(db, recipeID, recipe.Tags)
}

func insertRecipe(db *sqlx.DB, recipe *Recipe) (recipeID int) {
	tx := db.MustBegin()
	b, _ := json.Marshal(recipe.Tags)
	tx.QueryRow(INSERT_RECIPE, recipe.Title, recipe.Method, recipe.Time, string(b)).Scan(&recipeID)
	tx.Commit()
	return
}

func insertTagsFor(db *sqlx.DB, recipeID int, tags []Tag) {
	for _, t := range tags {
		tagID := insertTag(db, t)
		insertRecipeTagAssociation(db, recipeID, tagID)
	}
}

func insertRecipeTagAssociation(db *sqlx.DB, recipeID, tagID int) {
		tx := db.MustBegin()
		tx.MustExec(INSERT_RECIPE_TAG, recipeID, tagID)
		tx.Commit()
}

func insertTag(db *sqlx.DB, t Tag) (tagID int) {
		tx := db.MustBegin()
		tag := strings.ToLower(t.Name)

		// TODO: INSERT ON CONFLICT should work here as well...
		tx.QueryRow(GET_TAG_ID, tag).Scan(&tagID)

		if (tagID == 0) {
			tx.QueryRow(INSERT_TAG, tag).Scan(&tagID)
		}
		tx.Commit()
		return
}


func getRecipesFromDB(db *sqlx.DB, filters *Filters) (recipes []Recipe, err *Err) {
	rows, errr := db.Queryx(preprocessSelectStmt(filters)) 
	if errr != nil {
		return nil, newErr("query_recipes", errr)
	}
	for rows.Next() {
		recipe, err := scanRecipe(rows)
		if err != nil {
			return nil, err
		}
		recipes = append(recipes, recipe)
	}
	return
}

func scanRecipe(rows *sqlx.Rows) (recipe Recipe, erro *Err) {
		var tagAsString string
		err := rows.Scan(&recipe.ID, &recipe.Title, &recipe.Method, &recipe.Time, &tagAsString)
		if err != nil {
			return recipe, newErr("unmarshall_recipe", err)
		}
		err = json.Unmarshal([]byte(tagAsString), &recipe.Tags)
		if err != nil {
			return recipe, newErr("unmarshall_tags", err)
		}
		return
}