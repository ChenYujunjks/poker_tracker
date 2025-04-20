package model

import (
	"gorm.io/gorm"
)

// User 定义用户模型，对应数据库中的 User 表
type User struct {
	gorm.Model
	Username string `gorm:"column:username;type:varchar(50);unique;not null"`
	Password string `gorm:"column:password;type:varchar(255);not null"`
}
