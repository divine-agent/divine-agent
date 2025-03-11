package database

import (
	"github.com/ClickHouse/clickhouse-go/v2"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"gorm.io/gorm"
)

// DB gorm connector
var (
	DB *gorm.DB
	CH *clickhouse.Conn
	MG *mongo.Client
)
