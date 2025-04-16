package db

import (
	"log"

	"poker-tracker/internal/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// DB 全局数据库对象，可以在各模块复用
var DB *gorm.DB

// ConnectDatabase 建立数据库连接
func ConnectDatabase() *gorm.DB {
	// 请根据实际情况修改 dsn 参数（用户名、密码、地址、数据库名等）
	dsn := "user:password@tcp(127.0.0.1:3306)/poker_db?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("数据库连接失败：", err)
	}
	return DB
}

// Migrate 进行数据库自动迁移
func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(&model.Session{}, &model.Player{}, &model.GameRecord{})
	if err != nil {
		log.Fatal("数据库迁移失败：", err)
	}
}
