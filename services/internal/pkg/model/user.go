package model

import "gorm.io/gorm"

// User struct
type User struct {
	gorm.Model `json:"-"`
	ID         uint   `gorm:"primaryKey;autoIncrement;not null;" json:"id,omitempty"`
	Username   string `gorm:"uniqueIndex;not null;size:50;" validate:"required,min=3,max=50" json:"username"`
	Email      string `gorm:"uniqueIndex;not null;size:255;" validate:"required,email" json:"email"`
	Password   string `gorm:"not null;" validate:"required,min=6,max=50" json:"password,omitempty"`
	Name       string `json:"name,omitempty"`

	// Has Many
	APIKeys []APIKey `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"api_keys,omitempty"`
}
