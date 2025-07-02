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

// CreateSession 创建新的 poker session（绑定当前用户）
func CreateSession(c *gin.Context) {
	var req struct {
		Date string `json:"date" binding:"required"` // 格式："2025-04-24"
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误，必须包含 date"})
		return
	}

	// 将字符串解析为 time.Time（日期格式必须为 YYYY-MM-DD）
	sessionDate, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "日期格式错误，应为 YYYY-MM-DD"})
		return
	}

	// ✅ 添加日期不能超过今天的校验
	today := time.Now().Truncate(24 * time.Hour)
	if sessionDate.After(today) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "不能创建未来日期的 session"})
		return
	}

	// 获取当前用户 ID
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
		Date: session.Date,
	})
}

// DeleteSession 删除指定 Session（只能删除属于自己的）
func DeleteSession(c *gin.Context) {
	// 1. 取当前登录用户 ID
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

	// 3. 查找并验证归属
	var session model.Session
	if err := db.DB.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "未找到该 Session 或无权限删除"})
		return
	}

	// 4. 删除（硬删除触发数据库级联删除）
	if err := db.DB.Unscoped().Delete(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除 Session 失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Session 删除成功"})
}

// UpdateSession 修改指定 Session 的日期（只能操作属于自己的）
func UpdateSession(c *gin.Context) {
	// 1. 取当前登录用户 ID
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

	// 2. 获取路径参数里的 Session ID
	sessionID := c.Param("id")

	// 3. 解析请求体中的新日期
	var req struct {
		Date string `json:"date" binding:"required"` // 必填，格式 YYYY-MM-DD
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

	// 4. 查找目标 Session（确保归属当前用户）
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
		Date: session.Date,
	})
}
