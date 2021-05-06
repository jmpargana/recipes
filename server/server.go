package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/gofiber/fiber/v2"
)

type MongoInstance struct {
	Client *mongo.Client
	Db     *mongo.Database
}

var mg MongoInstance

const dbName = "recipes"
const mongoURI = "mongodb://localhost:27017/" + dbName

func Connect() error {
	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	db := client.Database(dbName)

	if err != nil {
		return err
	}

	mg = MongoInstance{
		Client: client,
		Db:     db,
	}

	return nil
}

type Recipe struct {
	Title       string
	Tags        []string
	Method      string
	Time        int
	Ingridients []struct {
		Name   string
		Amount string
	}
}

func matchTags(c *fiber.Ctx) error {
	// var tags []string
	// if err := c.BodyParser(tags); err != nil {
	// 	return c.Status(500).SendString(err.Error())
	// }

	q := bson.D{{"tags", bson.D{{
		"$all", bson.A{"tag1", "tag2"},
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

	// Save in db
	collection := mg.Db.Collection("recipes")

	if _, err := collection.InsertOne(c.Context(), recipe); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.Status(201).JSON(recipe)
}

func main() {
	if err := Connect(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()

	router := app.Group("/api")
	router.Post("/", addRecipe)
	router.Get("/", matchTags)

	log.Fatal(app.Listen(":3000"))
}
