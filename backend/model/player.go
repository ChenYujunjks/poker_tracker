package model

// Player 代表玩家基本信息
type Player struct {
	PlayerID uint   `gorm:"primaryKey;autoIncrement" json:"player_id"`
	Name     string `gorm:"size:50;not null" json:"name"`
}
