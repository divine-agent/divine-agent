package model

import "gorm.io/gorm"

// APIKey struct
type APIKey struct {
	gorm.Model
	// Digest is the hashed API key
	Digest string `gorm:"uniqueIndex;not null;" json:"digest,omitempty"`
	// Mask is the masked API key
	Mask string `gorm:"not null;" json:"mask"`

	// Foreign Keys
	UserID uint `gorm:"not null;" json:"user_id"`
}
