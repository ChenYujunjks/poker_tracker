package model

// GameRecord 记录每局中每个玩家的数据
type GameRecord struct {
	RecordID  uint    `gorm:"primaryKey;autoIncrement" json:"record_id"`
	SessionID uint    `gorm:"not null" json:"session_id"`
	PlayerID  uint    `gorm:"not null" json:"player_id"`
	BuyIn     float64 `gorm:"not null" json:"buy_in"`
	CashOut   float64 `gorm:"not null" json:"cash_out"`
	Paid      bool    `gorm:"default:false" json:"paid"`
}
