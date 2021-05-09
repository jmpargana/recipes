package main

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

// Match all recipes that have a given array of tags or ingridient names.
//	Ex: GET /api?tags=asian,soup					(match all soups with tag asian)
//		GET /api?tags=asian?ingridients=broccoli	(match all asian recipes with broccoli)
func matchTags(c *fiber.Ctx) error {
	query := new(TagQuery)
	if err := c.QueryParser(query); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	q := bson.D{{"tags", bson.D{{
		"$all", query.Tags,
	}}}}

	cursor, err := mg.Db.Collection("recipes").Find(c.Context(), q)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	var recipes []Recipe = make([]Recipe, 0)

	if err := cursor.All(c.Context(), &recipes); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.JSON(recipes)
}

func addRecipe(c *fiber.Ctx) error {
	recipe := new(Recipe)

	if err := c.BodyParser(recipe); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	// Validate here
	errors := validateRecipe(*recipe)
	if errors != nil {
		return c.Status(400).JSON(errors)
	}

	// Save in db
	collection := mg.Db.Collection("recipes")

	if _, err := collection.InsertOne(c.Context(), recipe); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.Status(201).JSON(recipe)
}

func allTags(c *fiber.Ctx) error {
	cursor, err := mg.Db.Collection("recipes").Aggregate(c.Context(), bson.A{
		bson.D{{"$unwind", "$tags"}},
	})
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	check := make(map[string]struct{})

	for cursor.Next(c.Context()) {
		var obj Tag
		if err := cursor.Decode(&obj); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		check[obj.Tag] = struct{}{}
	}
	cursor.Close(c.Context())

	tags := make([]string, 0, len(check))
	for tag := range check {
		tags = append(tags, tag)
	}

	return c.JSON(tags)
}

func login(c *fiber.Ctx) error {
	// FIXME: implement
	return c.Status(200).SendString("Hello")
}
