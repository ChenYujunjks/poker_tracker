package service

import (
	"poker-tracker/db"
	"poker-tracker/model"
	"time"

	"gorm.io/gorm"
)

// GetPlayerNetProfit 查询某个玩家在指定时间段内的净盈利
func GetPlayerNetProfit(playerName string, startDate, endDate time.Time) (float64, error) {
	var netProfit float64

	// 利用多表关联查询（JOIN）
	err := db.DB.Model(&model.GameRecord{}).
		Select("SUM(cash_out - buy_in) as net_profit").
		Joins("JOIN players ON players.player_id = game_records.player_id").
		Joins("JOIN sessions ON sessions.session_id = game_records.session_id").
		Where("players.name = ? AND sessions.date BETWEEN ? AND ?", playerName, startDate, endDate).
		Scan(&netProfit).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return 0, err
	}
	return netProfit, nil
}
