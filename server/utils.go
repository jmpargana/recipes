package main

import (
	"github.com/go-playground/validator"
	"golang.org/x/crypto/bcrypt"
)

// TODO: abstract main validation to reuse with recipe
func validateUser(u User) []*ErrorResponse {
	var errors []*ErrorResponse
	validate := validator.New()
	err := validate.Struct(u)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}

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

func checkPass(pass, hashedPass string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPass), []byte(pass))
	return err == nil
}
