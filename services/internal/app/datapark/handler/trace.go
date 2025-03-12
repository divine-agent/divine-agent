package handler

import (
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func GetTraces(c *fiber.Ctx) error {
	db := database.DB

	// session id
	sessionId := c.Params("id")
	token := c.Locals("user").(*jwt.Token)
	uid := uint(token.Claims.(jwt.MapClaims)["user_id"].(float64))
	// check if session exists and belongs to user
	// if not, return error
	var session model.Session
	if err := db.Where(&model.Session{ID: sessionId, UserID: uid}).Find(&session).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No session found with ID", "data": nil})
	}

	var traces []model.Trace
	if err := db.Where(&model.Trace{SessionID: sessionId}).Find(&traces).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get traces", "data": nil})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Get all traces", "data": traces})
}

func CreateTrace(c *fiber.Ctx) error {
	db := database.DB

	// session id
	sessionId := c.Params("id")
	token := c.Locals("user").(*jwt.Token)
	uid := uint(token.Claims.(jwt.MapClaims)["user_id"].(float64))
	// check if session exists and belongs to user
	// if not, return error
	var session model.Session
	if err := db.Where(&model.Session{ID: sessionId, UserID: uid}).Find(&session).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No session found with ID", "data": nil})
	}

	var trace model.Trace
	if err := c.BodyParser(&trace); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON((fiber.Map{"status": "error", "message": "Review your request body", "errors": err.Error()}))
	}
	trace.SessionID = sessionId
	if err := db.Create(&trace).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create trace", "data": nil})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Created trace", "data": trace})
}

func GetSpans(c *fiber.Ctx) error {
	return c.SendString("GetSpans")
}

func CreateSpans(c *fiber.Ctx) error {
	return c.SendString("CreateSpans")
}
