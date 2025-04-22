package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GameRecordInput struct {
	SessionID uint     `json:"session_id" binding:"required"`
	PlayerID  uint     `json:"player_id" binding:"required"`
	BuyIn     *float64 `json:"buy_in"`
	CashOut   *float64 `json:"cash_out"`
	Paid      *bool    `json:"paid"`
}

func UpsertGameRecord(c *gin.Context) {
	var input GameRecordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的输入"})
		return
	}

	var record model.GameRecord
	err := db.DB.Where("session_id = ? AND player_id = ?", input.SessionID, input.PlayerID).First(&record).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "查询失败"})
		return
	}

	if err == gorm.ErrRecordNotFound {
		// 创建新记录
		newRecord := model.GameRecord{
			SessionID: input.SessionID,
			PlayerID:  input.PlayerID,
			BuyIn:     input.BuyIn,
			CashOut:   input.CashOut,
			Paid:      input.Paid,
		}
		if err := db.DB.Create(&newRecord).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "创建失败"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "新记录已创建"})
		return
	}

	// 更新已有字段（只更新用户传入的）
	if input.BuyIn != nil {
		record.BuyIn = input.BuyIn
	}
	if input.CashOut != nil {
		record.CashOut = input.CashOut
	}
	if input.Paid != nil {
		record.Paid = input.Paid
	}

	if err := db.DB.Save(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "记录已更新"})
}
