package handler

import (
	"strconv"
	"sync"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func validToken(t *jwt.Token, id string) bool {
	n, err := strconv.Atoi(id)
	if err != nil {
		return false
	}

	claims := t.Claims.(jwt.MapClaims)
	uid := int(claims["user_id"].(float64))

	return uid == n
}

func validUser(id string, p string) bool {
	db := database.DB
	var user model.User
	db.First(&user, id)
	if user.Username == "" {
		return false
	}
	if !CheckPasswordHash(p, user.Password) {
		return false
	}
	return true
}

// GetUser get a user
func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.DB
	var user model.User
	db.Omit("password").Find(&user, id)
	if user.Username == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No user found with ID", "data": nil})
	}
	return c.JSON(fiber.Map{"status": "success", "message": "User found", "data": user})
}

// CreateUser new user
func CreateUser(c *fiber.Ctx) error {
	db := database.DB
	var user model.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your input", "errors": err.Error()})
	}

	validate := validator.New()
	if err := validate.Struct(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid request body", "errors": err.Error()})
	}

	// check if username or email already exists
	var (
		checkUsername model.User
		checkEmail    model.User
		wg            sync.WaitGroup
		usernameExist bool
		emailExist    bool
	)
	// neet to wait 2 goroutines
	wg.Add(2)
	// check username
	go func() {
		defer wg.Done()
		db.Where("username = ?", user.Username).First(&checkUsername)
		usernameExist = checkUsername.Username != ""
	}()
	// check email
	go func() {
		defer wg.Done()
		db.Where("email = ?", user.Email).First(&checkEmail)
		emailExist = checkEmail.Email != ""
	}()
	wg.Wait()
	if usernameExist || emailExist {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"status": "error", "message": "Username or email is already exists", "data": nil})
	}

	hash, err := hashPassword(user.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Couldn't hash password", "errors": err.Error()})
	}

	user.Password = hash
	if err := db.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Couldn't create user", "errors": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Created user", "data": user})
}

// UpdateUser update user
func UpdateUser(c *fiber.Ctx) error {
	type UpdateUserInput struct {
		Name string `json:"name"`
	}
	var uui UpdateUserInput
	if err := c.BodyParser(&uui); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your input", "errors": err.Error()})
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	// Ensure the token is belongs to the user
	if !validToken(token, id) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid token id", "data": nil})
	}

	db := database.DB
	var user model.User

	db.Omit("password").First(&user, id)
	user.Name = &uui.Name
	db.Save(&user)

	return c.JSON(fiber.Map{"status": "success", "message": "User successfully updated", "data": user})
}

// DeleteUser delete user
func DeleteUser(c *fiber.Ctx) error {
	type PasswordInput struct {
		Password string `json:"password"`
	}
	var pi PasswordInput
	if err := c.BodyParser(&pi); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Review your input", "errors": err.Error()})
	}
	id := c.Params("id")
	token := c.Locals("user").(*jwt.Token)

	if !validToken(token, id) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid user id", "data": nil})
	}

	if !validUser(id, pi.Password) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "error", "message": "Not valid user", "data": nil})
	}

	db := database.DB

	db.Delete(&model.User{}, id)
	return c.JSON(fiber.Map{"status": "success", "message": "User successfully deleted", "data": nil})
}
