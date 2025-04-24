// controllers/player_controller.go
package controllers

import (
	"log"
	"net/http"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

// 定义响应结构体（可放在函数内部或文件顶部）
type PlayerResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// GetPlayers 获取当前用户的所有玩家
func GetPlayers(c *gin.Context) {
	// 从上下文获取 userID
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

	// 查询该用户的所有玩家
	var players []model.Player
	if err := db.DB.Where("user_id = ?", userID).Find(&players).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取玩家失败"})
		return
	}

	// 构造精简响应
	var response []PlayerResponse
	for _, p := range players {
		response = append(response, PlayerResponse{
			ID:   p.ID,
			Name: p.Name,
		})
	}
	log.Printf("返回玩家列表: %v", response)
	c.JSON(http.StatusOK, response)

}

// CreatePlayer 创建新玩家并绑定当前用户
func CreatePlayer(c *gin.Context) {
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

	player := model.Player{
		Name:   req.Name,
		UserID: userID,
	}

	if err := db.DB.Create(&player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建玩家失败"})
		return
	}
	c.JSON(http.StatusCreated, PlayerResponse{
		ID:   player.ID,
		Name: player.Name,
	})
}
