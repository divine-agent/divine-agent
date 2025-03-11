package main

import (
	"context"
	"flag"
	"fmt"
	"log"

	"github.com/bytedance/sonic"
	"github.com/gofiber/fiber/v2"

	"github.com/Kaikaikaifang/divine-agent/services/internal/app/datapark/router"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
)

var (
	port = flag.Int("port", 3001, "The server port")
)

func main() {
	// Setup fiber app
	app := fiber.New(fiber.Config{
		Prefork:       true,
		CaseSensitive: true,
		StrictRouting: true,
		ServerHeader:  "Divine Agent",
		AppName:       "Divi Datapark Service",
		JSONEncoder:   sonic.Marshal,
		JSONDecoder:   sonic.Unmarshal,
	})
	// app.Use(cors.New())
	router.SetupRoutes(app)

	// Connect to database
	if err := database.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to postgres: %v", err)
	}
	if err := database.ConnectClickhouse(); err != nil {
		log.Fatalf("Failed to connect to clickhouse: %v", err)
	}
	if err := database.ConnectMongoDB(); err != nil {
		log.Fatalf("Failed to connect to mongodb: %v", err)
	}

	// Listen to port
	if err := app.Listen(fmt.Sprintf(":%d", *port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

	// Close database connection
	defer database.MG.Disconnect(context.Background())
}
