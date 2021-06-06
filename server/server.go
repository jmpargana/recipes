package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	jwtware "github.com/gofiber/jwt/v2"
)

func main() {
	dbName := os.Getenv("MONGO_DB")
	mongoURI := os.Getenv("MONGO_URI")
	mg, err := Connect(dbName, mongoURI)
	if err != nil {
		log.Fatal(err)
	}

	app := Setup(&DBWrapper{mg: *mg})

	log.Fatal(app.Listen(":3000"))
}

// Pass MongoDB Instance as interface
func Setup(repo Repo) *fiber.App {
	app := fiber.New()

	// Serve static SPA
	app.Static("/", "build")

	app.Use(cors.New(cors.Config{
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Create handler with repo
	service := Service{repo: repo}

	router := app.Group("/api")
	router.Get("/", service.matchTags)
	router.Get("/tags", service.allTags)
	router.Post("/users", service.register)
	router.Post("/users/login", service.login)

	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte(JWT_SECRET),
	}))

	router.Post("/", service.addRecipe)

	return app
}
