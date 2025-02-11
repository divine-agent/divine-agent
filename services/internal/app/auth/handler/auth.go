package handler

import (
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"log"
	"net/mail"
	"time"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/config"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"

	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// CheckPasswordHash compare password with hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	log.Println(hash, "haaaash")
	return err == nil
}

func getUserByEmail(e string) (*model.User, error) {
	db := database.DB
	var user model.User
	if err := db.Where(&model.User{Email: e}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func getUserByUsername(u string) (*model.User, error) {
	db := database.DB
	var user model.User
	if err := db.Where(&model.User{Username: u}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func valid(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

// createTokenByRS256 create token by RS256 algorithm
func createTokenByRS256(claims jwt.MapClaims) (t string, err error) {
	token := jwt.New(jwt.SigningMethodRS256)
	token.Claims = claims

	encodedPrivateKey := config.Config("ACCESS_TOKEN_PRIVATE_KEY")
	privateKey, err := auth.ParsePrivateKey(encodedPrivateKey)
	if err != nil {
		return "", err
	}

	t, err = token.SignedString(privateKey)
	if err != nil {
		return "", err
	}

	return t, nil
}

// Login get user and password
func Login(c *fiber.Ctx) error {
	type LoginInput struct {
		Identity string `json:"identity"`
		Password string `json:"password"`
	}
	type UserData struct {
		ID       uint   `json:"id"`
		Username string `json:"username"`
		// Email    string `json:"email"`
		Password string `json:"password"`
	}
	input := new(LoginInput)
	var ud UserData

	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error on login request", "errors": err.Error()})
	}

	identity := input.Identity
	pass := input.Password
	userModel, err := new(model.User), *new(error)

	if valid(identity) {
		userModel, err = getUserByEmail(identity)
	} else {
		userModel, err = getUserByUsername(identity)
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Internal Server Error", "data": err})
	} else if userModel == nil {
		CheckPasswordHash(pass, "")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid identity or password", "data": err})
	} else {
		ud = UserData{
			ID:       userModel.ID,
			Username: userModel.Username,
			// Email:    userModel.Email,
			Password: userModel.Password,
		}
	}

	if !CheckPasswordHash(pass, ud.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid identity or password", "data": nil})
	}

	claims := jwt.MapClaims{
		"username": ud.Username,
		"user_id":  ud.ID,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	t, err := createTokenByRS256(claims)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Success login", "data": t})
}

// LoginWithAPIKey login with api key
func LoginWithAPIKey(c *fiber.Ctx) error {
	type LoginInput struct {
		APIKey string `json:"api_key"`
	}
	input := new(LoginInput)
	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Error on login request", "errors": err.Error()})
	}

	db := database.DB
	var apiKey model.APIKey
	// find user by api key's digest
	d := sha256.Sum256([]byte(input.APIKey))
	digest := base64.StdEncoding.EncodeToString(d[:])
	if err := db.Where("digest=?", digest).First(&apiKey).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid api key", "data": nil})
	}

	var ud model.User
	db.First(&ud, apiKey.UserID)
	claims := jwt.MapClaims{
		"username": ud.Username,
		"user_id":  ud.ID,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	}
	t, err := createTokenByRS256(claims)
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Success login with api key", "data": t})
}
