package controllers

import (
	"log"
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"
	"time"

	"github.com/gin-gonic/gin"
)

// SessionResponse 定义响应体
type SessionResponse struct {
	ID   uint      `json:"id"`
	Date time.Time `json:"date"`
}

// GetSessions 获取当前用户的所有 Session
func GetSessions(c *gin.Context) {
	// 获取 userID
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

	// 查询当前用户的所有 session
	var sessions []model.Session
	if err := db.DB.Where("user_id = ?", userID).Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取会话失败"})
		return
	}

	// 构造返回格式
	var response []SessionResponse
	for _, s := range sessions {
		response = append(response, SessionResponse{
			ID:   s.ID,
			Date: s.Date,
		})
	}
	log.Printf("返回会话列表: %v", response)
	c.JSON(http.StatusOK, response)
}
