package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("无法加载 .env 文件:", err)
	}
}

var (
	DBUser     = os.Getenv("DB_USER")
	DBPassword = os.Getenv("DB_PASSWORD")
	DBHost     = os.Getenv("DB_HOST")
	DBPort     = os.Getenv("DB_PORT")
	DBName     = os.Getenv("DB_NAME")

	JwtKey = os.Getenv("JWT_SECRET")
)
