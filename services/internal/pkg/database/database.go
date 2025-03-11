package database

import (
	"github.com/ClickHouse/clickhouse-go/v2"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"gorm.io/gorm"
)

var (
	// DB gorm connector
	DB *gorm.DB
	// CH clickhouse connector
	CH *clickhouse.Conn
	// MG mongo connector
	MG *mongo.Client
)
