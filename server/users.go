package main

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func (s *Service) login(c *fiber.Ctx) error {

	// FIXME: implement
	return c.Status(200).SendString("Hello")
}

func (s *Service) register(c *fiber.Ctx) error {
	user := new(User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	if errors := validateUser(*user); errors != nil {
		return c.Status(400).JSON(errors)
	}

	hashedPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	if err := s.repo.Register(c, &User{Email: user.Email, Password: string(hashedPass)}); err != nil {
		return c.Status(409).SendString("User already registered.")
	}
	return c.SendStatus(201)
}
