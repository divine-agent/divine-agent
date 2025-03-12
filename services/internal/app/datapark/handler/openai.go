package handler

import "github.com/gofiber/fiber/v2"

func CreateChatCompletion(c *fiber.Ctx) error {
	return c.SendString("CreateChatCompletion")
}

func GetChatCompletions(c *fiber.Ctx) error {
	return c.SendString("GetChatCompletions")
}
