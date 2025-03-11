package handler

import (
	"context"
	"fmt"
	"time"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// Hello handle api status
func Hello(c *fiber.Ctx) error {
	token := c.Locals("user").(*jwt.Token)
	username := token.Claims.(jwt.MapClaims)["username"].(string)

	if err := testInsert(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to connect to MongoDB", "data": nil})
	}
	if err := testBatchInsert(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to batch insert", "data": nil})
	}
	return c.JSON(fiber.Map{"status": "success", "message": fmt.Sprintf("Hello, %s!", username), "data": nil})
}

func testInsert() error {
	client := database.MG
	ctx := context.Background()
	collection := client.Database("testing").Collection("numbers")
	defer collection.Database().Drop(ctx)
	_, err := collection.InsertOne(ctx, bson.D{{"name", "pi"}, {"value", 3.14159}})
	return err
}

func testBatchInsert() error {
	var err error
	conn := *database.CH

	ctx := context.Background()
	defer func() {
		conn.Exec(ctx, "DROP TABLE example")
	}()
	conn.Exec(context.Background(), "DROP TABLE IF EXISTS example")
	err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS example (
			  Col1 UInt8
			, Col2 String
			, Col3 FixedString(3)
			, Col4 UUID
			, Col5 Map(String, UInt8)
			, Col6 Array(String)
			, Col7 Tuple(String, UInt8, Array(Map(String, String)))
			, Col8 DateTime
		) Engine = Memory
	`)
	if err != nil {
		return err
	}

	batch, err := conn.PrepareBatch(ctx, "INSERT INTO example")
	if err != nil {
		return err
	}
	for i := 0; i < 1000; i++ {
		err := batch.Append(
			uint8(42),
			"ClickHouse",
			"Inc",
			uuid.New(),
			map[string]uint8{"key": 1},             // Map(String, UInt8)
			[]string{"Q", "W", "E", "R", "T", "Y"}, // Array(String)
			[]any{ // Tuple(String, UInt8, Array(Map(String, String)))
				"String Value", uint8(5), []map[string]string{
					{"key": "value"},
					{"key": "value"},
					{"key": "value"},
				},
			},
			time.Now(),
		)
		if err != nil {
			return err
		}
	}
	return batch.Send()
}
