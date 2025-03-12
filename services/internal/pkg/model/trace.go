package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Trace struct
type Trace struct {
	gorm.Model `json:"-"`
	// ID is a UUID4 string
	ID uuid.UUID `gorm:"primaryKey;not null;size:36;" json:"id,omitempty"`

	// StartTime is the start time of the trace in Unix Nano
	StartTime time.Time `json:"start_time"`
	// EndTime is the end time of the trace in Unix Nano
	EndTime sql.NullTime `json:"end_time,omitempty"`

	// Session ID
	SessionID uuid.UUID `gorm:"not null;size:36;" json:"session_id,omitempty"`
}
