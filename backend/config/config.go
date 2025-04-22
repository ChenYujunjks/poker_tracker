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

// 用函数返回环境变量，避免初始化顺序问题
func DBUser() string     { return os.Getenv("DB_USER") }
func DBPassword() string { return os.Getenv("DB_PASSWORD") }
func DBHost() string     { return os.Getenv("DB_HOST") }
func DBPort() string     { return os.Getenv("DB_PORT") }
func DBName() string     { return os.Getenv("DB_NAME") }
func JwtKey() string     { return os.Getenv("JWT_SECRET") }
