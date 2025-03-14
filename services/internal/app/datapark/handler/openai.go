package handler

import (
	"context"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/openai/openai-go"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func CreateChatCompletion(c *fiber.Ctx) error {
	type ChatCompletionReq struct {
		spanID uuid.UUID
		data   openai.ChatCompletion
	}
	var chatCompletionReq ChatCompletionReq
	if err := c.BodyParser(&chatCompletionReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your request body", "data": nil})
	}
	println(chatCompletionReq)

	// parse user_id
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	// store chat completion in mongodb
	client := database.MG
	ctx := context.Background()
	collection := client.Database("openai").Collection("chat-completions")

	doc := bson.M{
		"span_id": chatCompletionReq.spanID,
		"user_id": userID,
		"data":    chatCompletionReq.data,
	}
	_, err = collection.InsertOne(ctx, doc)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to store chat completion", "data": nil})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Stored chat completion", "data": nil})
}

func GetChatCompletions(c *fiber.Ctx) error {
	return c.SendString("GetChatCompletions")
}
