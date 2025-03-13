package database

import (
	"context"
	"fmt"
	"net/url"
	"strconv"

	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/config"
	"github.com/Kaikaikaifang/divine-agent/services/internal/pkg/model"

	"github.com/ClickHouse/clickhouse-go/v2"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"go.mongodb.org/mongo-driver/v2/mongo/readpref"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ConnectDB connect to db with gorm
func ConnectDB() error {
	p := config.Config("POSTGRES_PORT")
	port, err := strconv.ParseUint(p, 10, 32)
	if err != nil {
		return err
	}

	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.Config("POSTGRES_HOST"),
		port,
		config.Config("POSTGRES_USER"),
		config.Config("POSTGRES_PASSWORD"),
		config.Config("POSTGRES_DB"),
	)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}
	return DB.AutoMigrate(&model.User{}, &model.APIKey{}, &model.Session{}, &model.Trace{})
}

// ConnectClickhouse connect to clickhouse
func ConnectClickhouse() error {
	conn, err := clickhouse.Open(&clickhouse.Options{
		Addr: []string{fmt.Sprintf("%s:%s", config.Config("CLICKHOUSE_HOST"), config.Config("CLICKHOUSE_PORT"))},
		Auth: clickhouse.Auth{
			Database: config.Config("CLICKHOUSE_DB"),
			Username: config.Config("CLICKHOUSE_USER"),
			Password: config.Config("CLICKHOUSE_PASSWORD"),
		},
	})
	if err != nil {
		return err
	}
	CH = &conn
	return conn.Ping(context.Background())
}

func ConnectMongoDB() error {
	var err error
	uri := fmt.Sprintf("mongodb://%s:%s@%s:%s",
		config.Config("MONGO_USER"),
		url.QueryEscape(config.Config("MONGO_PASSWORD")),
		config.Config("MONGO_HOST"),
		config.Config("MONGO_PORT"),
	)
	MG, err = mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}
	return MG.Ping(context.Background(), readpref.Primary())
}
