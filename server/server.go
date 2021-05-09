package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	if err := Connect(); err != nil {
		log.Fatal(err)
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	router := app.Group("/api")
	router.Post("/", addRecipe)
	router.Get("/", matchTags)
	router.Get("/tags", allTags)
	router.Post("/login", login)

	log.Fatal(app.Listen(":3000"))
}
