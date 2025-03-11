package auth

import (
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/config"
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

// Protected protect routes
func Protected() fiber.Handler {
	encodedPublicKey := config.Config("ACCESS_TOKEN_PUBLIC_KEY")
	publicKey, err := ParsePublicKey(encodedPublicKey)
	if err != nil {
		panic(err)
	}
	return jwtware.New(jwtware.Config{
		SigningKey:   jwtware.SigningKey{Key: publicKey, JWTAlg: jwtware.RS256},
		ErrorHandler: jwtError,
	})
}

func jwtError(c *fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).
			JSON(fiber.Map{"status": "error", "message": "Missing or malformed JWT", "data": nil})
	}
	return c.Status(fiber.StatusUnauthorized).
		JSON(fiber.Map{"status": "error", "message": "Invalid or expired JWT", "data": nil})
}
