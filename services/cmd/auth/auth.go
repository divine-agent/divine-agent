package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/bytedance/sonic"
	"github.com/gofiber/fiber/v2"

	"github.com/Kaikaikaifang/divine-agent/services/internal/app/auth/router"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
)

var (
	port = flag.Int("port", 3000, "The server port")
)

func main() {
	app := fiber.New(fiber.Config{
		Prefork:       true,
		CaseSensitive: true,
		StrictRouting: true,
		ServerHeader:  "Divine Agent",
		AppName:       "Divi Auth Service",
		JSONEncoder:   sonic.Marshal,
		JSONDecoder:   sonic.Unmarshal,
	})
	// app.Use(cors.New())

	if err := database.ConnectDB(); err != nil {
		log.Fatalf("Failed to connect to postgres: %v", err)
	}

	router.SetupRoutes(app)
	if err := app.Listen(fmt.Sprintf(":%d", *port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
