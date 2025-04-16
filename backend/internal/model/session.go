package model

import "time"

// Session 代表一局牌的信息
type Session struct {
	SessionID   uint      `gorm:"primaryKey;autoIncrement" json:"session_id"`
	Date        time.Time `gorm:"not null" json:"date"`
	Description string    `json:"description"`
}
