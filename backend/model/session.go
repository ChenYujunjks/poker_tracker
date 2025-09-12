package model

import (
	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	Date   string `gorm:"column:date;type:date;not null"`
	UserID uint   `gorm:"column:user_id;not null"`
	//foreign Key
	User User `gorm:"foreignKey:UserID"`

	//反向引用
	GameRecords []GameRecord `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE"`
}
