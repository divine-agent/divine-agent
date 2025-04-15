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

	// Session
	session := api.Group("/session")
	session.Get("/", jwtware, handler.GetSessions)
	session.Post("/", jwtware, handler.CreateSession)
	session.Get("/:id/traces", jwtware, handler.GetTraces)
	session.Post("/:id/traces", jwtware, handler.UpsertTrace)

	// Trace
	trace := api.Group("/trace")
	trace.Get("/", jwtware, handler.GetAllTraces)
	// Span
	trace.Get("/:id/spans", jwtware, handler.GetSpans)
	trace.Post("/:id/spans", jwtware, handler.CreateSpans)

	// Metric
	metric := api.Group("/metric")
	metric.Post("/", jwtware, handler.CreateMetrics)

	// Usage
	usage := api.Group("/usage")
	usage.Get("/completions", jwtware, handler.GetCompletionUsage)

	// OpenAI Input / Output
	v1 := api.Group("/v1")
	// Chat Completions
	// Input
	v1.Post("/chat/completions/input", jwtware, handler.CreateChatCompletionInput)
	v1.Get("/chat/completions/:id/input", jwtware, handler.GetChatCompletionInput)
	// Output
	v1.Post("/chat/completions", jwtware, handler.CreateChatCompletion)
	v1.Get("/chat/completions/:id", jwtware, handler.GetChatCompletion)
}
