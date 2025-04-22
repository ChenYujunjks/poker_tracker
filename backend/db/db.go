package db

import (
	"fmt"
	"log"
	"poker-tracker/config"
	"poker-tracker/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() *gorm.DB {
	// 构建 DSN
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.DBUser(), config.DBPassword(), config.DBHost(), config.DBPort(), config.DBName())

	var err error
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
