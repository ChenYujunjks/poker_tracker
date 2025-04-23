// controllers/player_controller.go
package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

// GetPlayers 获取当前用户的所有玩家
func GetPlayers(c *gin.Context) {
	// 从上下文获取 userID
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}

	// 类型断言为 uint
	userID, ok := userIDInterface.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID类型错误"})
		return
	}

	// 查询该用户的所有玩家
	var players []model.Player
	if err := db.DB.Where("user_id = ?", userID).Find(&players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取玩家失败"})
		return
	}

	c.JSON(http.StatusOK, players)
}

// CreatePlayer 创建新玩家并绑定当前用户
func CreatePlayer(c *gin.Context) {
	// 请求体结构
	var req struct {
		Name string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求数据"})
		return
	}

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

	// 创建新玩家
	player := model.Player{
		Name:   req.Name,
		UserID: userID,
	}

	if err := db.DB.Create(&player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建玩家失败"})
		return
	}

	c.JSON(http.StatusCreated, player)
}
