package main

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoInstance struct {
	Client *mongo.Client
	Db     *mongo.Database
}

type ErrorResponse struct {
	FailedField string
	Tag         string
	Value       string
}

type Recipe struct {
	Title       string        `validate:"required"`
	Tags        []string      `validate:"required"`
	Method      string        `validate:"required"`
	Time        int           `validate:"required"`
	Ingridients []*Ingridient `validate:"required,dive,required"`
}

type TagWrapper struct {
	Tag string `bson:"tags"`
}

type Ingridient struct {
	Name   string `validate:"required"`
	Amount string `validate:"required"`
}

type TagQuery struct {
	Tags        []string     `query:"tags"`
	Ingridients []Ingridient `query:"ingridients"`
}

type User struct {
	ID       string `json:",omitempty" bson:"_id,omitempty"`
	Email    string `json:"email" binding:"required" bson:"email" validate:"required,email,min=6,max=32"`
	Password string `json:"password" binding:"required" bson:"password" validate:"required,min=8,max=32"`
}

type Repo interface {
	FindTags(*fiber.Ctx) ([]string, error)
	FindByTags(*fiber.Ctx, []string) ([]*Recipe, error)
	FindUser(*fiber.Ctx, string) (*User, error)
	Add(*fiber.Ctx, *Recipe) error
	Register(*fiber.Ctx, *User) error
}
