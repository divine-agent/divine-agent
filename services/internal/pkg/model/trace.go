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
	ID uuid.UUID `gorm:"primaryKey;not null;type:uuid;default:gen_random_uuid()" json:"id,omitempty"`
	// Name is the name of the trace
	Name *string `json:"name,omitempty"`
	// StartTime is the start time of the trace in Unix Nano
	StartTime time.Time `json:"start_time"`
	// EndTime is the end time of the trace in Unix Nano
	EndTime sql.NullTime `json:"end_time,omitempty"`

	// Session ID
	SessionID uuid.UUID `gorm:"not null;type:uuid;" json:"session_id,omitempty"`
}

// Span struct
type Span struct {
	// SpanID is a fixed-length string of 8 bytes
	ID string `json:"id"`
	// TraceID is a UUID4 string
	TraceID uuid.UUID `json:"trace_id"`
	// ParentID is a fixed-length string of 8 bytes
	ParentID string `json:"parent_id"`
	// Name is the name of the span
	Name string `json:"name"`
	// StartTime is the start time of the span in Unix Nano
	StartTime time.Time `json:"start_time"`
	// EndTime is the end time of the span in Unix Nano
	EndTime time.Time `json:"end_time"`
	// Duration is the duration of the span in milliseconds
	Duration float64 `json:"duration"`
	// Kind is the kind of the span
	Kind string `json:"kind"`
	// Metadata is a map of key-value pairs
	Metadata map[string]string `json:"metadata,omitempty"`
}
