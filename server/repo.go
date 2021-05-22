package main

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

type DBWrapper struct {
	mg MongoInstance
}

func (w DBWrapper) FindTags(c *fiber.Ctx) ([]string, error) {
	cursor, err := w.mg.Db.Collection("recipes").Aggregate(c.Context(), bson.A{
		bson.D{{"$unwind", "$tags"}},
	})

	if err != nil {
		return nil, err
	}

	check := make(map[string]struct{})

	for cursor.Next(c.Context()) {
		var obj TagWrapper
		if err := cursor.Decode(&obj); err != nil {
			return nil, err
		}
		check[obj.Tag] = struct{}{}
	}
	cursor.Close(c.Context())

	tags := make([]string, 0, len(check))
	for tag := range check {
		tags = append(tags, tag)
	}

	return tags, nil
}

func (w DBWrapper) FindByTags(c *fiber.Ctx, t []string) ([]*Recipe, error) {
	q := bson.D{{"tags", bson.D{{
		"$all", t,
	}}}}

	cursor, err := w.mg.Db.Collection("recipes").Find(c.Context(), q)
	if err != nil {
		return nil, err
	}

	var recipes []*Recipe

	if err := cursor.All(c.Context(), &recipes); err != nil {
		return nil, err
	}

	return recipes, nil
}

func (w DBWrapper) Add(c *fiber.Ctx, r *Recipe) error {
	collection := w.mg.Db.Collection("recipes")
	if _, err := collection.InsertOne(c.Context(), r); err != nil {
		return err
	}
	return nil
}
