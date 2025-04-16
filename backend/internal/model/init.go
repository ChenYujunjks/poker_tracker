type Session struct {
	ID          int       `gorm:"primaryKey"`
	Date        time.Time `gorm:"not null"`
	Description string
}

type Player struct {
	ID   int    `gorm:"primaryKey"`
	Name string `gorm:"not null;size:50"`
}

type GameRecord struct {
	ID        int     `gorm:"primaryKey"`
	SessionID int     `gorm:"not null"`
	PlayerID  int     `gorm:"not null"`
	BuyIn     float64 `gorm:"not null"`
	CashOut   float64 `gorm:"not null"`
	Paid      bool    `gorm:"default:false"`
	// 如有需要，可增加关联关系（Preload）：
	Session Session `gorm:"foreignKey:SessionID"`
	Player  Player  `gorm:"foreignKey:PlayerID"`
}
