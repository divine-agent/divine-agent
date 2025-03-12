package model

import "gorm.io/gorm"

// Session struct
type Session struct {
	gorm.Model `json:"-"`

	// ID is a UUID4 string
	ID   string  `gorm:"primaryKey;not null;size:36;" json:"id,omitempty"`
	Name *string `json:"name,omitempty"`

	UserID uint    `gorm:"not null;" json:"user_id,omitempty"`
	Traces []Trace `gorm:"foreignKey:SessionID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"traces,omitempty"`
}
