package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// Hello handle api status
func Hello(c *fiber.Ctx) error {
	token := c.Locals("user").(*jwt.Token)
	username := token.Claims.(jwt.MapClaims)["username"].(string)
	return c.JSON(fiber.Map{"status": "success", "message": fmt.Sprintf("Hello, %s!", username), "data": nil})
}
