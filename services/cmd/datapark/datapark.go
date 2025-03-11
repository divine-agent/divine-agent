package main

import (
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

	database.ConnectDB()

	router.SetupRoutes(app)
	if err := app.Listen(fmt.Sprintf(":%d", *port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
