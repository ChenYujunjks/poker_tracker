package model

import (
	"gorm.io/gorm"
)

// GameRecord 定义游戏记录模型，对应数据库中的 GameRecord 表
type GameRecord struct {
	gorm.Model
	SessionID uint     `gorm:"column:session_id;not null"`
	PlayerID  uint     `gorm:"column:player_id;not null"`
	BuyIn     *float64 `gorm:"column:buy_in;type:decimal(10,2)"`
	CashOut   *float64 `gorm:"column:cash_out;type:decimal(10,2)"`
	Paid      *bool    `gorm:"column:paid"` // 设为指针类型，可判断有无设置
	UserID    uint     `gorm:"column:user_id;not null"`
	//外键
	User    User    `gorm:"foreignKey:UserID"`
	Session Session `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE"`
	Player  Player  `gorm:"foreignKey:PlayerID;constraint:OnDelete:RESTRICT"`
}
