package main

import "github.com/go-playground/validator"

func validateRecipe(r Recipe) []*ErrorResponse {
	var errors []*ErrorResponse
	validate := validator.New()
	err := validate.Struct(r)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	if len(r.Tags) < 1 {
		errors = append(errors, &ErrorResponse{FailedField: "Recipe.Tags", Value: "Need at least one Tag"})
	}
	if len(r.Ingridients) < 1 {
		errors = append(errors, &ErrorResponse{FailedField: "Recipe.Ingridients", Value: "Need at least one Ingridient"})
	}
	return errors
}
