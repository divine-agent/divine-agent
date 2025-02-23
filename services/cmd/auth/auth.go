package main

import (
	"log"

	"github.com/Kaikaikaifang/divine-agent/services/internal/app/auth/router"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New(fiber.Config{
		Prefork:       true,
		CaseSensitive: true,
		StrictRouting: true,
		ServerHeader:  "Fiber",
		AppName:       "Divi Auth Service",
	})
	// app.Use(cors.New())

	database.ConnectDB()

	router.SetupRoutes(app)
	log.Fatal(app.Listen(":3000"))
}
