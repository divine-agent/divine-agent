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

type UsageQuery struct {
	StartTime int64        `query:"start_time"`
	EndTime   *int64       `query:"end_time"`
	GroupBy   *GroupingKey `query:"group_by"`
}

type GroupingKey string

const (
	// GroupByDate groups by date, default
	GroupByDate GroupingKey = "date"
	// GroupByModel groups by model
	GroupByModel GroupingKey = "model"
)

type UsageResult struct {
	InputTokens  uint64 `json:"input_tokens"`
	OutputTokens uint64 `json:"output_tokens"`
	TotalTokens  uint64 `json:"total_tokens"`

	// Model exists only if GroupBy is set to model
	Model *string `json:"model"`
	// Date exists only if GroupBy is empty or set to date
	Date *int64 `json:"date"`
}
