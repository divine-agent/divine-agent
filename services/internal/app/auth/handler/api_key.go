package handler

import (
	"fmt"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// CreateAPIKey create a new api key
func CreateAPIKey(c *fiber.Ctx) error {
	type NewAPIKey struct {
		Key string `json:"key"`
	}

	db := database.DB
	apiKey := new(model.APIKey)
	token := c.Locals("user").(*jwt.Token)
	apiKey.UserID = uint(token.Claims.(jwt.MapClaims)["user_id"].(float64))

	// generate api key with uuid
	key := uuid.New().String()
	key = fmt.Sprintf("divi-%s", key)

	// db store hashed api key
	hashedKey, err := hashPassword(key)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to create api key", "data": nil})
	}
	apiKey.Key = hashedKey

	// db store api key
	if err := db.Create(&apiKey).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to create api key", "data": nil})
	}

	newAPIKey := NewAPIKey{Key: key}
	return c.JSON(fiber.Map{"status": "success", "message": "Created api key", "data": newAPIKey})
}

// GetAPIKey get api key
func GetAPIKey(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "success", "message": "Get api key", "data": nil})
}

// DeleteAPIKey delete api key
func DeleteAPIKey(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "success", "message": "Deleted api key", "data": nil})
}
