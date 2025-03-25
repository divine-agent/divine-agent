package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// APIKey struct
type APIKey struct {
	gorm.Model `json:"-"`

	ID uuid.UUID `gorm:"primaryKey;not null;type:uuid;default:gen_random_uuid();" json:"id,omitempty"`
	// Digest is the hashed API key
	Digest string `gorm:"uniqueIndex;not null;" json:"digest,omitempty"`
	// APIKey is the masked API key
	APIKey string `gorm:"not null;" json:"api_key"`
	// Name is the name of the API key
	Name *string `json:"name,omitempty"`

	// Foreign Keys
	UserID uuid.UUID `gorm:"not null;type:uuid;" json:"user_id"`

	// CreatedAt
	CreatedAt time.Time `json:"created_at"`
}
