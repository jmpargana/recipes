package main

import (
	"time"

	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func (s *Service) login(c *fiber.Ctx) error {
	user := new(User)

	// Fetch from db
	if err := c.BodyParser(user); err != nil {
		return c.Status(500).SendString(err.Error())
	}

	if errors := validateUser(*user); errors != nil {
		return c.Status(400).JSON(errors)
	}

	storeUser, err := s.repo.FindUser(c, user.Email)
	if err != nil {
		return c.Status(401).SendString("User not registered.")
	}

	if !checkPass(user.Password, storeUser.Password) {
		return c.SendStatus(401)
	}

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = user.Email
	claims["_id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(JWT_SECRET))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"token": t})
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
