package handler

import (
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// CreateAPIKey create a new api key
func CreateAPIKey(c *fiber.Ctx) error {
	type NewAPIKey struct {
		ID        uuid.UUID `json:"id"`
		APIKey    string    `json:"api_key"`
		Name      *string   `json:"name,omitempty"`
		CraetedAt time.Time `json:"created_at"`
	}

	db := database.DB
	var apiKey model.APIKey
	if err := c.BodyParser(&apiKey); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Failed to parse request", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}
	apiKey.UserID = userID

	// generate api key with uuid
	prefix := "divi-"
	key := prefix + uuid.New().String()
	// slice 4 digits from the end
	apiKey.APIKey = fmt.Sprintf("%s...%s", prefix, key[len(key)-4:])

	// db store hashed api key
	digest := sha256.Sum256([]byte(key))
	apiKey.Digest = base64.StdEncoding.EncodeToString(digest[:])

	// db store api key
	if err := db.Create(&apiKey).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create api key", "data": nil})
	}

	newAPIKey := NewAPIKey{ID: apiKey.ID, APIKey: key, Name: apiKey.Name, CraetedAt: apiKey.CreatedAt}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Created api key", "data": newAPIKey})
}

// GetAPIKeys get all api keys
func GetAPIKeys(c *fiber.Ctx) error {
	db := database.DB
	var apiKeys []model.APIKey

	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	// omit digest (hashed api key)
	if err := db.Where(&model.APIKey{UserID: userID}).Omit("Digest").Order("created_at DESC").Find(&apiKeys).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get api keys", "data": nil})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Get all api keys", "data": apiKeys})
}

// DeleteAPIKey delete api key
func RevokeAPIKey(c *fiber.Ctx) error {
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid API KEY ID", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	db := database.DB
	var apiKey model.APIKey

	db.First(&apiKey, id)
	if apiKey.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "Forbidden", "data": nil})
	}

	db.Delete(&apiKey)
	return c.JSON(fiber.Map{"status": "success", "message": "Deleted api key", "data": nil})
}

// UpdateAPIKey update api key
func UpdateAPIKey(c *fiber.Ctx) error {
	type UpdateAPIKeyInput struct {
		Name *string `json:"name"`
	}
	var ui UpdateAPIKeyInput
	if err := c.BodyParser(&ui); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Failed to parse request", "data": nil})
	}
	id, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid API KEY ID", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	db := database.DB
	var apiKey model.APIKey
	db.First(&apiKey, id)
	if apiKey.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "Forbidden", "data": nil})
	}
	db.Model(&apiKey).Updates(ui)

	return c.JSON(fiber.Map{"status": "success", "message": "Updated api key", "data": apiKey})
}
