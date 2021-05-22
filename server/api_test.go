package main

import (
	"github.com/gofiber/fiber/v2"
)

var mock = &RepoMock{}

func factory() *fiber.App {
    return Setup(mock)
}


// 	- Load Recipes By Tags:
// 		- Include Private Recipes for UserId
//
// 	- Create Recipe
// 		- Unauthorized
// 		- Invalid Recipes
// 		- Working
// 		- Only Allow When Logged In
// 		- Save UserId
//
// 	- Login
//
//
// 	- Register
// 		- No JWT Can be Provided
// 		- No Repeating Usernames
