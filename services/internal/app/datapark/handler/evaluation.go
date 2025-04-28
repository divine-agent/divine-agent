package handler

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
)

func CreateScores(c *fiber.Ctx) error {
	type CreateScoresReq struct {
		SpanID  string                  `json:"span_id"`
		TraceID uuid.UUID               `json:"trace_id"`
		Data    []model.EvaluationScore `json:"data"`
	}
	var createScoresReq CreateScoresReq
	if err := c.BodyParser(&createScoresReq); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your request body", "data": nil})
	}

	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	// store evaluation results in mongodb
	client := database.MG
	ctx := context.Background()
	collection := client.Database("evaluation").Collection("evaluation-results")

	doc := bson.M{
		"span_id": createScoresReq.SpanID,
		"user_id": userID.String(),
		"data":    createScoresReq.Data,
	}
	_, err = collection.InsertOne(ctx, doc)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to store evaluation results", "data": nil})
	}

	// store scores in clickhouse
	conn := *database.CH
	ctx = context.Background()
	err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS scores (
			span_id String,
			trace_id UUID,
			user_id UUID,
			name LowCardinality(String),
			score Float32,
			representative_reasoning String,
			created DateTime DEFAULT now()
		) ENGINE = MergeTree()
		PARTITION BY toYYYYMM(created)
		ORDER BY (span_id, name)
		PRIMARY KEY (span_id, name)
	`)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create scores table", "data": nil})
	}

	batch, err := conn.PrepareBatch(ctx, "INSERT INTO scores")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to prepare batch", "data": nil})
	}
	for _, score := range createScoresReq.Data {
		if err := batch.Append(
			createScoresReq.SpanID,
			createScoresReq.TraceID,
			userID,
			score.Name,
			score.Score,
			score.RepresentativeReasoning,
			time.Now(),
		); err != nil {
			fmt.Println(err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to append batch", "data": nil})
		}
	}
	if err := batch.Send(); err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to send batch", "data": nil})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Stored evaluation scores", "data": nil})
}
