package handler

import (
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func GetSessions(c *fiber.Ctx) error {
	token := c.Locals("user").(*jwt.Token)
	uid := uint(token.Claims.(jwt.MapClaims)["user_id"].(float64))

	var sessions []model.Session
	if err := database.DB.Where("user_id = ?", uid).Find(&sessions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get sessions", "data": nil})
	}
	return c.JSON(fiber.Map{"status": "success", "message": "Get all sessions", "data": sessions})
}

func CreateSession(c *fiber.Ctx) error {
	var session model.Session
	if err := c.BodyParser(&session); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON((fiber.Map{"status": "error", "message": "Review your request body", "errors": err.Error()}))
	}

	token := c.Locals("user").(*jwt.Token)
	session.UserID = uint(token.Claims.(jwt.MapClaims)["user_id"].(float64))

	if err := database.DB.Create(&session).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create session", "data": nil})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Created session", "data": session})
}
