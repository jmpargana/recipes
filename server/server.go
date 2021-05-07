package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/gofiber/fiber/v2"
    "github.com/go-playground/validator"
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


type ErrorResponse struct {
    FailedField string
    Tag         string
    Value       string
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

type Ingridient struct {
        Name   string       `validate:"required"`
        Amount string       `validate:"required"`
}

type Recipe struct {
    Title       string      `validate:"required"`
    Tags        []string    `validate:"required"`
    Method      string      `validate:"required"`
    Time        int         `validate:"required"`
	Ingridients []*Ingridient `validate:"required,dive,required"`
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

type Tag struct {
    Tag string `bson:"tags"`
}

func allTags(c *fiber.Ctx) error {
    cursor, err := mg.Db.Collection("recipes").Aggregate(c.Context(), bson.A{
        bson.D{{ "$unwind", "$tags" }},
    } )
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

    tags := make([]string, len(check))
    for tag := range check {
        tags = append(tags, tag)
    }
    
    return c.JSON(tags)
}

func main() {
	if err := Connect(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()

	router := app.Group("/api")
	router.Post("/", addRecipe)
	router.Get("/", matchTags)
    router.Get("/tags", allTags)

	log.Fatal(app.Listen(":3000"))
}
