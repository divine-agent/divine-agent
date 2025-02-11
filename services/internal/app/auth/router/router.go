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
	auth.Post("/api_key", handler.LoginWithAPIKey)

	// User
	user := api.Group("/user")
	user.Get("/:id", handler.GetUser)
	user.Post("/", handler.CreateUser)
	user.Patch("/:id", jwtware, handler.UpdateUser)
	user.Delete("/:id", jwtware, handler.DeleteUser)

	// API Key
	apiKey := api.Group("/api_key")
	apiKey.Get("/", jwtware, handler.GetAPIKeys)
	apiKey.Post("/", jwtware, handler.CreateAPIKey)
	apiKey.Delete("/:id", jwtware, handler.RevokeAPIKey)
}
