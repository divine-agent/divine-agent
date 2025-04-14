package handler

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/openai/openai-go"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func CreateChatCompletion(c *fiber.Ctx) error {
	type ChatCompletionReq struct {
		SpanID  string                `json:"span_id"`
		TraceID uuid.UUID             `json:"trace_id"`
		Data    openai.ChatCompletion `json:"data"`
	}
	var chatCompletionReq ChatCompletionReq
	if err := c.BodyParser(&chatCompletionReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your request body", "data": nil})
	}

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
		"span_id": chatCompletionReq.SpanID,
		"user_id": userID.String(),
		"data":    chatCompletionReq.Data,
	}
	_, err = collection.InsertOne(ctx, doc)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to store chat completion", "data": nil})
	}

	// store usage in clickhouse
	conn := *database.CH
	ctx = context.Background()
	err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS usages (
			span_id String,
			trace_id UUID,
			user_id UUID,
			model String,
			input_tokens UInt64,
			output_tokens UInt64,
			total_tokens UInt64,
			created DateTime DEFAULT now()
		) ENGINE = MergeTree()
		PARTITION BY toYYYYMMDD(created)
		ORDER BY (user_id, trace_id, span_id, created, model)
		PRIMARY KEY (user_id, trace_id, span_id);
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create table", "data": nil})
	}

	// Insert data into the table
	usage := model.Usage{
		Model:        chatCompletionReq.Data.Model,
		InputTokens:  uint64(chatCompletionReq.Data.Usage.PromptTokens),
		OutputTokens: uint64(chatCompletionReq.Data.Usage.CompletionTokens),
		TotalTokens:  uint64(chatCompletionReq.Data.Usage.TotalTokens),
		SpanID:       chatCompletionReq.SpanID,
		TraceID:      chatCompletionReq.TraceID,
		UserID:       userID,
		Created:      time.Unix(chatCompletionReq.Data.Created, 0),
	}
	err = conn.Exec(ctx, `
		INSERT INTO usages (trace_id, span_id, user_id, model, input_tokens, output_tokens, total_tokens, created)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, usage.TraceID, usage.SpanID, usage.UserID, usage.Model, usage.InputTokens, usage.OutputTokens, usage.TotalTokens, usage.Created)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to store usage", "data": nil})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Stored chat completion", "data": nil})
}

func GetChatCompletion(c *fiber.Ctx) error {
	id := c.Params("id")
	// parse user_id
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}
	// get chat completions from mongodb
	client := database.MG
	ctx := context.Background()
	collection := client.Database("openai").Collection("chat-completions")

	type ChatCompletionDoc struct {
		Data openai.ChatCompletion `bson:"data"`
	}
	chatCompletion := &ChatCompletionDoc{}
	// query chat completions
	err = collection.FindOne(ctx, bson.M{"span_id": id, "user_id": userID.String()}).Decode(chatCompletion)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "Chat completion not found", "data": nil})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to query chat completion", "data": nil})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Get chat completion", "data": chatCompletion.Data})
}

func CreateChatCompletionInput(c *fiber.Ctx) error {
	type ChatCompletionInputReq struct {
		SpanID string          `json:"span_id"`
		Data   model.ChatInput `json:"data"`
	}
	var chatCompletionInputReq ChatCompletionInputReq
	if err := c.BodyParser(&chatCompletionInputReq); err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your request body", "data": nil})
	}

	// parse user_id
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	// store chat completion input in mongodb
	client := database.MG
	ctx := context.Background()
	collection := client.Database("openai").Collection("chat-completion-inputs")
	doc := bson.M{
		"user_id": userID.String(),
		"span_id": chatCompletionInputReq.SpanID,
		"data":    chatCompletionInputReq.Data,
	}
	_, err = collection.InsertOne(ctx, doc)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to store chat completion input", "data": nil})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Stored chat completion input", "data": nil})
}

func GetChatCompletionInput(c *fiber.Ctx) error {
	id := c.Params("id")
	// parse user_id
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}
	// get chat completion input from mongodb
	client := database.MG
	ctx := context.Background()
	collection := client.Database("openai").Collection("chat-completion-inputs")

	type ChatCompletionInputDoc struct {
		Data model.ChatInput `bson:"data"`
	}
	chatCompletionInput := &ChatCompletionInputDoc{}
	// query chat completion input
	err = collection.FindOne(ctx, bson.M{"span_id": id, "user_id": userID.String()}).Decode(chatCompletionInput)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "Chat completion input not found", "data": nil})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to query chat completion input", "data": nil})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "Get chat completion input", "data": chatCompletionInput.Data})
}
