package model

import (
	"time"

	"github.com/google/uuid"
)

type Usage struct {
	Model        string `json:"model"`
	InputTokens  uint64 `json:"input_tokens"`
	OutputTokens uint64 `json:"output_tokens"`
	TotalTokens  uint64 `json:"total_tokens"`

	SpanID  string    `json:"span_id"`
	UserID  uuid.UUID `json:"user_id"`
	TraceID uuid.UUID `json:"trace_id"`

	Created time.Time `json:"created"`
}
