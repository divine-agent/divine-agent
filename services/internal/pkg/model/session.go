package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Session struct
type Session struct {
	gorm.Model `json:"-"`

	ID   uuid.UUID `gorm:"primaryKey;not null;type:uuid;" json:"id,omitempty"`
	Name *string   `json:"name,omitempty"`

	UserID uuid.UUID `gorm:"not null;type:uuid;" json:"user_id"`
	Traces []Trace   `gorm:"foreignKey:SessionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"traces,omitempty"`

	// CreatedAt
	CreatedAt time.Time `json:"created_at"`
}
