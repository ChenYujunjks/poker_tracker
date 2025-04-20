package controllers

import (
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

// CreateGameRecord 创建游戏记录
func CreateGameRecord(c *gin.Context) {
	var record model.GameRecord
	if err := c.ShouldBindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的输入"})
		return
	}

	if err := db.DB.Create(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建游戏记录失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "游戏记录创建成功"})
}
