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
	ID   uint   `json:"id"`
	Date string `json:"date"` // ✅ 用字符串 YYYY-MM-DD
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
			Date: s.Date.Format("2006-01-02"), // ✅ 强制输出 YYYY-MM-DD
		})
	}
	log.Printf("返回会话列表: %v", response)
	c.JSON(http.StatusOK, response)
}

// CreateSession 创建新的 poker session
func CreateSession(c *gin.Context) {
	var req struct {
		Date string `json:"date" binding:"required"` // 格式："2025-04-24"
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误，必须包含 date"})
		return
	}

	sessionDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "日期格式错误，应为 YYYY-MM-DD"})
		return
	}

	today := time.Now().Truncate(24 * time.Hour)
	if sessionDate.After(today) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不能创建未来日期的 session"})
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

	session := model.Session{
		Date:   sessionDate,
		UserID: userID,
	}

	if err := db.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建 Session 失败"})
		return
	}

	c.JSON(http.StatusCreated, SessionResponse{
		ID:   session.ID,
		Date: session.Date.Format("2006-01-02"), // ✅ 返回字符串
	})
}

// DeleteSession 删除指定 Session
func DeleteSession(c *gin.Context) {
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

	sessionID := c.Param("id")

	var session model.Session
	if err := db.DB.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "未找到该 Session 或无权限删除"})
		return
	}

	if err := db.DB.Unscoped().Delete(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除 Session 失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Session 删除成功"})
}

// UpdateSession 修改指定 Session 的日期
func UpdateSession(c *gin.Context) {
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

	sessionID := c.Param("id")

	var req struct {
		Date string `json:"date" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误"})
		return
	}
	newDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "日期格式错误，应为 YYYY-MM-DD"})
		return
	}

	var session model.Session
	if err := db.DB.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "未找到该 Session 或无权限修改"})
		return
	}

	session.Date = newDate
	if err := db.DB.Save(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新 Session 失败"})
		return
	}

	c.JSON(http.StatusOK, SessionResponse{
		ID:   session.ID,
		Date: session.Date.Format("2006-01-02"), // ✅ 返回字符串
	})
}
