package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config 获取环境变量的值，若为空则尝试从 .env 文件中读取
func Config(key string) string {
	value := os.Getenv(key)
	if value == "" { // 如果环境变量为空，则尝试从 .env 读取
		err := godotenv.Load(".env")
		if err != nil {
			log.Printf("No env variable found for key: %s\n", key)
			return "" // 返回空值，避免错误
		}
		value = os.Getenv(key) // 再次尝试获取
	}
	return value
}
