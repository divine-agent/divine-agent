package model

import "gorm.io/gorm"

// APIKey struct
type APIKey struct {
	gorm.Model `json:"-"`
	ID         uint `gorm:"primaryKey;autoIncrement;not null;" json:"id,omitempty"`
	// Digest is the hashed API key
	Digest string `gorm:"uniqueIndex;not null;" json:"digest,omitempty"`
	// APIKey is the masked API key
	APIKey string `gorm:"not null;" json:"api_key"`

	// Foreign Keys
	UserID uint `gorm:"not null;" json:"user_id"`
}
