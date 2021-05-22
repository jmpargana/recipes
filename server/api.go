package main

import (
	"github.com/gofiber/fiber/v2"
)

type Service struct {
	repo Repo
}

// Match all recipes that have a given array of tags or ingridient names.
//	Ex: GET /api?tags=asian,soup					(match all soups with tag asian)
//		GET /api?tags=asian?ingridients=broccoli	(match all asian recipes with broccoli)
func (s *Service) matchTags(c *fiber.Ctx) error {
	query := new(TagQuery)
	if err := c.QueryParser(query); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	recipes, err := s.repo.FindByTags(c, query.Tags)
	if err != nil {
		c.Status(500).SendString(err.Error())
	}
	return c.JSON(recipes)
}

func (s *Service) addRecipe(c *fiber.Ctx) error {
	recipe := new(Recipe)

	if err := c.BodyParser(recipe); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	// Validate here
	errors := validateRecipe(*recipe)
	if errors != nil {
		return c.Status(400).JSON(errors)
	}

	if err := s.repo.Add(c, recipe); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.Status(201).JSON(recipe)
}

func (s *Service) allTags(c *fiber.Ctx) error {
	tags, err := s.repo.FindTags(c)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	return c.JSON(tags)
}

func login(c *fiber.Ctx) error {
	// FIXME: implement
	return c.Status(200).SendString("Hello")
}
