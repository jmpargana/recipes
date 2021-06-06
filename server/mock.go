package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type RepoMock struct {
	recipes     []*Recipe
	users       []*User
	userCounter int
}

// Repeat implemented logic to test
func (r RepoMock) FindTags(c *fiber.Ctx) ([]string, error) {
	check := map[string]struct{}{}
	for _, recipe := range r.recipes {
		for _, tag := range recipe.Tags {
			check[string(tag)] = struct{}{}
		}
	}

	tags := make([]string, 0, len(check))
	for tag := range check {
		tags = append(tags, tag)
	}
	return tags, nil
}

func (r RepoMock) FindByTags(c *fiber.Ctx, t []string) ([]*Recipe, error) {
	var recipes []*Recipe
	for _, recipe := range r.recipes {
		if matchTags(recipe.Tags, t) {
			recipes = append(recipes, recipe)
		}
	}
	return recipes, nil
}

func contains(ss []string, s string) bool {
	for _, a := range ss {
		if a == s {
			return true
		}
	}
	return false
}

func matchTags(recipe, tags []string) bool {
	for _, tag := range tags {
		if !contains(recipe, tag) {
			return false
		}
	}
	return true
}

func (r RepoMock) Add(c *fiber.Ctx, recipe *Recipe) error {
	r.recipes = append(r.recipes, recipe)
	return nil
}

func (r RepoMock) Register(c *fiber.Ctx, user *User) error {
	r.userCounter += 1
	r.users = append(r.users, &User{Email: user.Email, Password: user.Password, ID: fmt.Sprint(r.userCounter)})
	return nil
}
