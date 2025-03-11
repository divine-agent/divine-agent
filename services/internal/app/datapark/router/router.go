package router

import (
	"github.com/Kaikaikaifang/divine-agent/services/internal/app/datapark/handler"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// SetupRoutes setup router api
func SetupRoutes(app *fiber.App) {
	// Middleware
	jwtware := auth.Protected()

	// API
	api := app.Group("/api", logger.New())
	api.Get("/", jwtware, handler.Hello)

	// Run / Session

	// Span

	// Metric

	// Input / Output
}
