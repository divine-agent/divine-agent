package handler

import (
	"context"
	"fmt"
	"time"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/auth"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/database"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func GetCompletionUsage(c *fiber.Ctx) error {
	var usageQuery model.UsageQuery
	// Parse query parameters
	if err := c.QueryParser(&usageQuery); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid query parameters",
			"data":    nil,
		})
	}

	// Parse user_id from JWT token
	token := c.Locals("user").(*jwt.Token)
	userID, err := auth.ParseUserId(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid user ID",
			"data":    nil,
		})
	}

	// Construct the base SQL query for filtering by user_id and date range
	conn := *database.CH
	ctx := context.Background()

	// Default condition for the query
	query := `SELECT `

	// Add GROUP BY condition based on `usageQuery.GroupBy`
	if usageQuery.GroupBy != nil && *usageQuery.GroupBy == model.GroupByModel {
		query += `model, `
	} else {
		// Default to group by date
		query += `toDate(created) AS date, `
	}

	// Add the aggregation columns
	query += `
		SUM(input_tokens) AS input_tokens,
		SUM(output_tokens) AS output_tokens,
		SUM(total_tokens) AS total_tokens
		FROM usages
		WHERE user_id = $1
		AND created >= toDateTime($2)
	`

	// Add the end date condition if provided
	if usageQuery.EndTime != nil {
		query += `AND created <= toDateTime($3) `
	}

	// Apply grouping
	if usageQuery.GroupBy != nil && *usageQuery.GroupBy == model.GroupByModel {
		query += `GROUP BY model`
	} else {
		// Default to group by date
		query += `GROUP BY date`
	}

	// Execute the query with the provided parameters
	rows, err := conn.Query(ctx, query, userID, usageQuery.StartTime, usageQuery.EndTime)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": "Failed to fetch usage data",
			"data":    nil,
		})
	}
	defer rows.Close()

	// Prepare results
	var results []model.UsageResult
	for rows.Next() {
		var result model.UsageResult
		var date time.Time
		var _model string

		// Scan row into variables based on GroupByModel or GroupByDate
		if usageQuery.GroupBy != nil && *usageQuery.GroupBy == model.GroupByModel {
			// Group by model
			if err := rows.Scan(&_model, &result.InputTokens, &result.OutputTokens, &result.TotalTokens); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"status":  "error",
					"message": "Error reading query result",
					"data":    nil,
				})
			}
			result.Model = &_model
		} else {
			// Group by date
			if err := rows.Scan(&date, &result.InputTokens, &result.OutputTokens, &result.TotalTokens); err != nil {
				fmt.Println(err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"status":  "error",
					"message": "Error reading query result",
					"data":    nil,
				})
			}
			unix := date.Unix()
			result.Date = &unix
		}

		results = append(results, result)
	}

	// Return the results
	return c.JSON(fiber.Map{
		"status": "success",
		"data":   results,
	})
}
