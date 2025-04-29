package handler

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/Kaikaikaifang/divine-agent/services/pb"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"google.golang.org/protobuf/encoding/protojson"
	"gorm.io/gorm/clause"
)

func checkSessionExist(userID uuid.UUID, sessionID uuid.UUID) error {
	// check if session exists and belongs to user
	// if not, return error
	var session model.Session
	db := database.DB
	return db.Where(&model.Session{ID: sessionID, UserID: userID}).Find(&session).Error
}

func GetAllTraces(c *fiber.Ctx) error {
	db := database.DB
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	var sessions []model.Session
	if err := db.Where(&model.Session{UserID: userID}).Order("created_at DESC").Find(&sessions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get sessions", "data": nil})
	}
	var traces []model.Trace
	for _, session := range sessions {
		var sessionTraces []model.Trace
		if err := db.Where(&model.Trace{SessionID: session.ID}).Order("start_time DESC").Find(&sessionTraces).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get traces", "data": nil})
		}
		traces = append(traces, sessionTraces...)
	}
	return c.JSON(fiber.Map{"status": "success", "message": "Get all traces", "data": traces})
}

func GetTraces(c *fiber.Ctx) error {
	db := database.DB

	// session id
	sessionID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid session ID", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}
	// check if session exists and belongs to user
	if err := checkSessionExist(userID, sessionID); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No session found with ID", "data": nil})
	}

	var traces []model.Trace
	if err := db.Where(&model.Trace{SessionID: sessionID}).Order("start_time DESC").Find(&traces).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to get traces", "data": nil})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Get all traces", "data": traces})
}

func UpsertTrace(c *fiber.Ctx) error {
	db := database.DB

	// session id
	sessionID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid session ID", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}
	if err := checkSessionExist(userID, sessionID); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No session found with ID", "data": nil})
	}

	var traces []model.Trace
	if err := c.BodyParser(&traces); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON((fiber.Map{"status": "error", "message": "Review your request body", "errors": err.Error()}))
	}
	// set session id for each trace
	for i := range traces {
		traces[i].SessionID = sessionID
	}

	err = db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		DoUpdates: clause.AssignmentColumns([]string{"end_time"}),
	}).Create(&traces).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create trace", "data": nil})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Upserted traces", "data": traces})
}

func GetSpans(c *fiber.Ctx) error {
	db := database.DB
	conn := *database.CH
	traceID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid trace ID", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	// check if trace exists and belongs to user
	// if not, return error
	// trace -> session -> user
	var trace model.Trace
	if err := db.Where(&model.Trace{ID: traceID}).Find(&trace).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No trace found with ID", "data": nil})
	}
	if err := checkSessionExist(userID, trace.SessionID); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No session found with ID", "data": nil})
	}

	// query spans with trace id from clickhouse
	var spans []model.Span
	rows, err := conn.Query(context.Background(), `
		SELECT
		    span_id,
		    trace_id,
		    parent_span_id,
		    name,
		    kind,
		    start_time,
		    argMax(end_time, update_time) AS end_time,
		    argMax(duration, update_time) AS duration,
		    argMax(metadata, update_time) AS metadata
		FROM spans
		WHERE trace_id = ?
		GROUP BY span_id, trace_id, parent_span_id, name, kind, start_time
	`, traceID)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to query spans", "data": nil})
	}
	defer rows.Close()
	for rows.Next() {
		var (
			span     model.Span
			ID       []byte
			parentID []byte
			duration *float64
			endTime  *time.Time
		)
		if err := rows.Scan(&ID, &span.TraceID, &parentID, &span.Name, &span.Kind, &span.StartTime, &endTime, &duration, &span.Metadata); err != nil {
			fmt.Println(err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to scan spans", "data": nil})
		}

		// convert ID to hex string
		span.ID = hex.EncodeToString(ID)
		// if parentID is not nil, convert to hex string
		if !bytes.Equal(parentID, make([]byte, len(parentID))) {
			span.ParentID = hex.EncodeToString(parentID)
		}
		// convert duration to milliseconds
		if duration != nil {
			_duration := *duration / 1e6
			span.Duration = &(_duration)
		}
		// convert end_time to nullTime
		if endTime != nil {
			span.EndTime = sql.NullTime{
				Valid: true,
				Time:  *endTime,
			}
		}
		spans = append(spans, span)
	}

	return c.JSON(fiber.Map{"status": "success", "message": "Get all spans", "data": spans})
}

func CreateSpans(c *fiber.Ctx) error {
	body := c.Body()
	var spans pb.ScopeSpans
	if err := protojson.Unmarshal(body, &spans); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid request body", "data": nil})
	}

	db := database.DB
	conn := *database.CH
	traceId, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid trace ID", "data": nil})
	}
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID", "data": nil})
	}

	// check if trace exists and belongs to user
	// if not, return error
	// trace -> session -> user
	var trace model.Trace
	if err := db.Where(&model.Trace{ID: traceId}).Find(&trace).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No trace found with ID", "data": nil})
	}
	if err := checkSessionExist(userID, trace.SessionID); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "No session found with ID", "data": nil})
	}

	ctx := context.Background()
	err = conn.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS spans (
		    span_id FixedString(8),
		    trace_id UUID,
		    parent_span_id FixedString(8),
		    name VARCHAR(255),
		    kind Enum8('SPAN_KIND_FUNCTION'=0, 'SPAN_KIND_LLM'=1, 'SPAN_KIND_EVALUATION'=2),
		    start_time DateTime64(9),
		    end_time Nullable(DateTime64(9)),
		    duration Nullable(Float64),
		    metadata Map(String, String),
			update_time DateTime DEFAULT now()
	    ) ENGINE = ReplacingMergeTree(update_time)
		PARTITION BY toYYYYMM(start_time)
		ORDER BY (trace_id, span_id, start_time)
		PRIMARY KEY (trace_id, span_id);
	`)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to create table", "data": nil})
	}

	batch, err := conn.PrepareBatch(ctx, "INSERT INTO spans")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to prepare batch", "data": nil})
	}
	for _, span := range spans.Spans {
		var (
			endTime  any
			duration any
		)
		if span.EndTimeUnixNano != 0 {
			endTime = unixNanoToTime(span.EndTimeUnixNano)
			duration = span.EndTimeUnixNano - span.StartTimeUnixNano
		} else {
			endTime = nil
			duration = nil
		}

		err := batch.Append(
			span.SpanId,
			traceId,
			span.ParentSpanId,
			span.Name,
			span.Kind,
			unixNanoToTime(span.StartTimeUnixNano),
			endTime,
			duration,
			keyValueToMap(span.Metadata),
			time.Now(),
		)
		if err != nil {
			fmt.Println(err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to append", "data": nil})
		}
	}
	if err = batch.Send(); err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "error", "message": "Failed to execute", "data": nil})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "Created spans", "data": nil})
}

// unixNanoToTime converts a UnixNano timestamp to a time.Time object
func unixNanoToTime(nanoTimestamp uint64) time.Time {
	// decompose the timestamp into seconds and nanoseconds
	sec := int64(nanoTimestamp / 1e9)
	nsec := int64(nanoTimestamp % 1e9)

	// convert to UTC time
	return time.Unix(sec, nsec).UTC()
}

// keyValueToMap converts a slice of KeyValue objects to a map
func keyValueToMap(kvs []*pb.KeyValue) map[string]string {
	m := make(map[string]string)
	for _, kv := range kvs {
		m[kv.Key] = kv.Value.String()
	}
	return m
}
