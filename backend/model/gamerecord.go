package model

import (
	"gorm.io/gorm"
)

// GameRecord 定义游戏记录模型，对应数据库中的 GameRecord 表
type GameRecord struct {
	gorm.Model
	SessionID uint    `gorm:"column:session_id;not null"`
	PlayerID  uint    `gorm:"column:player_id;not null"`
	BuyIn     float64 `gorm:"column:buy_in;type:decimal(10,2);not null"`
	CashOut   float64 `gorm:"column:cash_out;type:decimal(10,2);not null"`
	Paid      bool    `gorm:"column:paid;default:false"`
	// 外键关联
	Session Session `gorm:"foreignKey:SessionID;references:ID"`
	Player  Player  `gorm:"foreignKey:PlayerID;references:ID"`
}
