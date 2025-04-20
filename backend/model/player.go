package model

import (
	"gorm.io/gorm"
)

// Player 定义玩家模型，对应数据库中的 Player 表
type Player struct {
	gorm.Model
	Name string `gorm:"column:name;type:varchar(50);not null"`
}
