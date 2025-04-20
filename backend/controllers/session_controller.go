package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

// GetSessions 获取所有会话
func GetSessions(c *gin.Context) {
	var sessions []model.Session
	if err := db.DB.Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取会话失败"})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

// GetSessionsByDate 按日期范围获取会话
func GetSessionsByDate(c *gin.Context) {
	start := c.Query("start")
	end := c.Query("end")
	if start == "" || end == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "需要提供开始和结束日期"})
		return
	}

	var sessions []model.Session
	if err := db.DB.Where("date BETWEEN ? AND ?", start, end).Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取会话失败"})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

// GetSessionDetails 获取单个会话详情
func GetSessionDetails(c *gin.Context) {
	id := c.Param("id")
	var session model.Session
	if err := db.DB.First(&session, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "会话未找到"})
		return
	}

	type Result struct {
		PlayerName string  `json:"player_name"`
		BuyIn      float64 `json:"buy_in"`
		CashOut    float64 `json:"cash_out"`
		Paid       bool    `json:"paid"`
	}
	var results []Result
	if err := db.DB.Table("game_records").
		Select("players.name as player_name, game_records.buy_in, game_records.cash_out, game_records.paid").
		Joins("join players on players.id = game_records.player_id").
		Where("game_records.session_id = ?", id).
		Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取会话详情失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session": session,
		"records": results,
	})
}
