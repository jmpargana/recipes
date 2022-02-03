package main

type Err struct {
	Err        error  `json:"-"`
	StatusCode int    `json:"-"`
	Status     string `json:"status"`
	Code       int    `json:"code,omitempty"`
	Error      string `json:"error,omitempty"`
}

/*
	App Codes:
		- 10000 -> DB
		- 20000 -> Input (decoding, query, path params, etc.)
		- 30000 -> Output (unmarshalling, etc.)
*/

var Errors = map[string]*Err{
	"db_failure": {
		Err:        nil,
		StatusCode: 400,
		Status:     "db_failure",
		Code:       10400,
		Error:      "Something failed with db fetching tags",
	},
	"recipe_decode": {
		Err:        nil,
		StatusCode: 400,
		Status:     "recipe_decode",
		Code:       20400,
		Error:      "Could not decode recipe object",
	},
	"recipe_match": {
		Err:        nil,
		StatusCode: 400,
		Status:     "recipe_match",
		Code:       10401,
		Error:      "Failed matching recipes in db",
	},
	"missing_title": {
		Err:        nil,
		StatusCode: 400,
		Status:     "missing_title",
		Code:       20401,
		Error:      "Missing title in recipe",
	},
	"missing_method": {
		Err:        nil,
		StatusCode: 400,
		Status:     "missing_method",
		Code:       20402,
		Error:      "Missing method in recipe",
	},
	"missing_time": {
		Err:        nil,
		StatusCode: 400,
		Status:     "missing_time",
		Code:       20403,
		Error:      "Missing time in recipe",
	},
	"missing_tags": {
		Err:        nil,
		StatusCode: 400,
		Status:     "missing_tags",
		Code:       20404,
		Error:      "Missing tags in recipe",
	},
	"duplicate_tags": {
		Err:        nil,
		StatusCode: 400,
		Status:     "duplicated_tags",
		Code:       20405,
		Error:      "Duplicated tags for recipe",
	},
	"invalid_limit": {
		Err:        nil,
		StatusCode: 400,
		Status:     "invalid_limit",
		Code:       20406,
		Error:      "Invalid limit in query parameter",
	},
	"invalid_offset": {
		Err:        nil,
		StatusCode: 400,
		Status:     "invalid_offset",
		Code:       20406,
		Error:      "Invalid offset in query parameter",
	},
	"invalid_tags": {
		Err:        nil,
		StatusCode: 400,
		Status:     "invalid_tags",
		Code:       20406,
		Error:      "Invalid tags in query parameter",
	},
	"query_recipes": {
		Err:        nil,
		StatusCode: 400,
		Status:     "query_recipes",
		Code:       10406,
		Error:      "Failed querying recipes",
	},
	"unmarshall_recipe": {
		Err:        nil,
		StatusCode: 400,
		Status:     "unmarshall_recipe",
		Code:       30401,
		Error:      "Failed unmarshalling recipe",
	},
	"unmarshall_tags": {
		Err:        nil,
		StatusCode: 400,
		Status:     "unmarshall_tags",
		Code:       20406,
		Error:      "Failed unmarshalling tags",
	},
	"recipe_not_found": {
		Err:        nil,
		StatusCode: 400,
		Status:     "recipe_not_found",
		Code:       10406,
		Error:      "No recipe found in db for given id",
	},
}
