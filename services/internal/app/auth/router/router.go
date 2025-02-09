package router

import (
	"github.com/Kaikaikaifang/divine-agent/services/internal/app/auth/handler"
	"github.com/Kaikaikaifang/divine-agent/services/internal/app/auth/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// SetupRoutes setup router api
func SetupRoutes(app *fiber.App) {
	// Middleware
	jwtware := middleware.Protected()

	// API
	api := app.Group("/api", logger.New())
	api.Get("/", handler.Hello)

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := api.Group("/user")
	user.Get("/:id", handler.GetUser)
	user.Post("/", handler.CreateUser)
	user.Patch("/:id", jwtware, handler.UpdateUser)
	user.Delete("/:id", jwtware, handler.DeleteUser)
}
