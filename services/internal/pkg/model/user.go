package model

import (
	"database/sql"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User struct
type User struct {
	gorm.Model `json:"-"`

	ID       uuid.UUID `gorm:"primaryKey;not null;type:uuid;default:gen_random_uuid()" json:"id,omitempty"`
	Username string    `gorm:"uniqueIndex:idx_username_active;not null;size:50;" validate:"required,min=3,max=50" json:"username"`
	Email    string    `gorm:"uniqueIndex:idx_email_active;not null;size:255;" validate:"required,email" json:"email"`
	Password string    `gorm:"not null;" validate:"required,min=6,max=50" json:"password,omitempty"`
	Name     *string   `json:"name,omitempty"`

	APIKeys  []APIKey  `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"api_keys,omitempty"`
	Sessions []Session `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"sessions,omitempty"`

	// Allow to create a new user with the same username or email after the user is deleted
	DeletedAt sql.NullTime `gorm:"uniqueIndex:idx_username_active;uniqueIndex:idx_email_active;" json:"deleted_at,omitempty"`
}
