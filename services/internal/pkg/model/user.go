package model

import "gorm.io/gorm"

// User struct
type User struct {
	gorm.Model
	Username string `gorm:"uniqueIndex;not null;size:50;" validate:"required,min=3,max=50" json:"username"`
	Email    string `gorm:"uniqueIndex;not null;size:255;" validate:"required,email" json:"email"`
	Password string `gorm:"not null;" validate:"required,min=6,max=50" json:"password"`
	Name     string `json:"name"`

	// Has Many
	APIKeys []APIKey `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"api_keys"`
}
