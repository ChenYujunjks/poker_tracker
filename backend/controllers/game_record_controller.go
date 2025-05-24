// controllers/gamerecord_controller.go
package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

// GameRecordResponse 定义响应格式
type GameRecordResponse struct {
	ID       uint     `json:"id"`
	PlayerID uint     `json:"player_id"`
	BuyIn    *float64 `json:"buy_in"`
	CashOut  *float64 `json:"cash_out"`
	Paid     *bool    `json:"paid"`
}

// CreateGameRecord 创建游戏记录（仅 BuyIn 必填）
func CreateGameRecord(c *gin.Context) {
	var req struct {
		SessionID uint     `json:"session_id" binding:"required"`
		PlayerID  uint     `json:"player_id" binding:"required"`
		BuyIn     *float64 `json:"buy_in" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误，session_id/player_id/buy_in 为必填"})
		return
	}

	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}
	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID类型错误"})
		return
	}

	record := model.GameRecord{
		SessionID: req.SessionID,
		PlayerID:  req.PlayerID,
		BuyIn:     req.BuyIn,
		UserID:    userID,
	}
	if err := db.DB.Create(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建记录失败"})
		return
	}

	c.JSON(http.StatusCreated, GameRecordResponse{
		ID:       record.ID,
		PlayerID: record.PlayerID,
		BuyIn:    record.BuyIn,
		CashOut:  record.CashOut,
		Paid:     record.Paid,
	})
}

// GetGameRecordsBySession 返回某场 session 的所有记录
func GetGameRecordsBySession(c *gin.Context) {
	sessionID := c.Query("session_id")
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
		return
	}
	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID类型错误"})
		return
	}

	var records []model.GameRecord
	if err := db.DB.Where("session_id = ? AND user_id = ?", sessionID, userID).Find(&records).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取记录失败"})
		return
	}

	var response []GameRecordResponse
	for _, r := range records {
		response = append(response, GameRecordResponse{
			ID:       r.ID,
			PlayerID: r.PlayerID,
			BuyIn:    r.BuyIn,
			CashOut:  r.CashOut,
			Paid:     r.Paid,
		})
	}

	c.JSON(http.StatusOK, response)
}

// UpdateGameRecord 更新游戏记录（cashOut、paid）
func UpdateGameRecord(c *gin.Context) {
	recordID := c.Param("id")
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
		return
	}
	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID类型错误"})
		return
	}

	var req struct {
		CashOut *float64 `json:"cash_out"`
		Paid    *bool    `json:"paid"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求体格式错误"})
		return
	}

	var record model.GameRecord
	if err := db.DB.Where("id = ? AND user_id = ?", recordID, userID).First(&record).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "记录不存在或无权限修改"})
		return
	}

	record.CashOut = req.CashOut
	record.Paid = req.Paid
	if err := db.DB.Save(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新记录失败"})
		return
	}

	c.JSON(http.StatusOK, GameRecordResponse{
		ID:       record.ID,
		PlayerID: record.PlayerID,
		BuyIn:    record.BuyIn,
		CashOut:  record.CashOut,
		Paid:     record.Paid,
	})
}

// DeleteGameRecord 删除记录
func DeleteGameRecord(c *gin.Context) {
	recordID := c.Param("id")
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
		return
	}
	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID类型错误"})
		return
	}

	var record model.GameRecord
	if err := db.DB.Where("id = ? AND user_id = ?", recordID, userID).First(&record).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "记录不存在或无权限删除"})
		return
	}

	if err := db.DB.Delete(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除记录失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "记录删除成功"})
}

