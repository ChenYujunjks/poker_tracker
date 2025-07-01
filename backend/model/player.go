package model

import (
	"gorm.io/gorm"
)

// Player 定义玩家模型，对应数据库中的 Player 表
type Player struct {
	gorm.Model
	Name   string `gorm:"column:name;type:varchar(50);not null"`
	UserID uint   `gorm:"column:user_id;not null"`
	//foreign key relationship with User
	User User `gorm:"foreignKey:UserID"`

	//反向引用
	GameRecords []GameRecord `gorm:"foreignKey:PlayerID"`
}
