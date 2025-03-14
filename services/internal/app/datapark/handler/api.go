package handler

import (
	"context"
	"fmt"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// Hello handle api status
func Hello(c *fiber.Ctx) error {
	token := c.Locals("user").(*jwt.Token)
	username := token.Claims.(jwt.MapClaims)["username"].(string)

	if err := testInsert(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to connect to MongoDB", "data": nil})
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
