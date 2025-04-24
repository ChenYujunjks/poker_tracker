package model

import (
	"time"

	"gorm.io/gorm"
)

// Session 定义会话模型，对应数据库中的 Session 表
type Session struct {
	gorm.Model
	Date   time.Time `gorm:"column:date;type:date;not null"`
	UserID uint      `gorm:"column:user_id;not null"`
	//foreign Key
	User User `gorm:"foreignKey:UserID"`
}
