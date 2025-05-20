package database

import (
	"context"
)

func executeSQL(query string) error {
	conn := *CH
	ctx := context.Background()
	return conn.Exec(ctx, query)
}

func CreateCHTables() error {
	sqls := []string{
		scoreTableSQL,
		usageTableSQL,
		spanTableSQL,
	}

	for _, sql := range sqls {
		if err := executeSQL(sql); err != nil {
			return err
		}
	}
	return nil
}

var scoreTableSQL = `
	CREATE TABLE IF NOT EXISTS scores (
		span_id FixedString(8),
		trace_id UUID,
		user_id UUID,
		name LowCardinality(String),
		score Float32,
		representative_reasoning String,
		created DateTime DEFAULT now()
	) ENGINE = MergeTree()
	PARTITION BY toYYYYMM(created)
	ORDER BY (trace_id, span_id, name)
	PRIMARY KEY (trace_id, span_id, name)
`

var usageTableSQL = `
	CREATE TABLE IF NOT EXISTS usages (
		span_id String,
		trace_id UUID,
		user_id UUID,
		model String,
		input_tokens UInt64,
		output_tokens UInt64,
		total_tokens UInt64,
		created DateTime DEFAULT now()
	) ENGINE = MergeTree()
	PARTITION BY toYYYYMM(created)
	ORDER BY (user_id, created, model)
	PRIMARY KEY (user_id, created, model)
`

var spanTableSQL = `
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
`
