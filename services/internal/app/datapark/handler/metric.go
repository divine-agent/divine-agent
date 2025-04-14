package handler

import (
	"github.com/gofiber/fiber/v2"
)

func CreateMetrics(c *fiber.Ctx) error {
	return c.SendString("CreateMetrics")
}
