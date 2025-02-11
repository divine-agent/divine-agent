package model

import "gorm.io/gorm"

// APIKey struct
type APIKey struct {
	gorm.Model
	// Key is the hashed API key
	Key string `gorm:"uniqueIndex;not null;" validate:"required" json:"key"`

	// Foreign Keys
	UserID uint `gorm:"not null;" json:"user_id"`
}
