package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

// GetPlayers 获取所有玩家
func GetPlayers(c *gin.Context) {
	var players []model.Player
	if err := db.DB.Find(&players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取玩家失败"})
		return
	}
	c.JSON(http.StatusOK, players)
}
