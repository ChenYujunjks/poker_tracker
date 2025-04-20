package db

import (
	"fmt"
	"log"
	"os"
	"poker-tracker/model"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() *gorm.DB {
	// 加载 .env 文件
	err := godotenv.Load()
	if err != nil {
		log.Fatal("无法加载 .env 文件:", err)
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// 构建 DSN
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPassword, dbHost, dbPort, dbName)

	// 连接数据库
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}
	return DB
}

// Migrate 进行数据库自动迁移
func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(&model.User{}, &model.Session{}, &model.Player{}, &model.GameRecord{})
	if err != nil {
		log.Fatal("数据库迁移失败：", err)
	}
}
