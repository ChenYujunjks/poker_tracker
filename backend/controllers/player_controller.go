package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetPlayers 获取当前登录用户的所有玩家
func GetPlayers(c *gin.Context) {
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
		return
	}
	userID, _ := strconv.ParseUint(userIDRaw.(string), 10, 64)

	var players []model.Player
	if err := db.DB.Where("user_id = ?", userID).Find(&players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取玩家失败"})
		return
	}

	c.JSON(http.StatusOK, players)
}

// CreatePlayer 为当前用户添加一个玩家
func CreatePlayer(c *gin.Context) {
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未登录"})
		return
	}
	userID, _ := strconv.ParseUint(userIDRaw.(string), 10, 64)

	var player model.Player
	if err := c.ShouldBindJSON(&player); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误"})
		return
	}

	player.UserID = uint(userID) // 绑定当前用户

	if err := db.DB.Create(&player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "添加玩家失败"})
		return
	}

	c.JSON(http.StatusOK, player)
}
