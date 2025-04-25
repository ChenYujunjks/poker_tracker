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

// DeletePlayer 删除指定玩家（只能删除属于当前用户的）
func DeletePlayer(c *gin.Context) {
	// 获取当前用户的 ID
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

	// 获取要删除的玩家 ID（从路由参数）
	playerID := c.Param("id")

	// 在数据库中查找该玩家，确保归属当前用户
	var player model.Player
	if err := db.DB.Where("id = ? AND user_id = ?", playerID, userID).First(&player).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "未找到该玩家或无权限删除"})
		return
	}

	if err := db.DB.Delete(&player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除玩家失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "玩家删除成功"})
}

// UpdatePlayer 修改指定玩家的名称（只能操作自己的）
func UpdatePlayer(c *gin.Context) {
	// 获取当前登录用户 ID
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

	// 获取玩家 ID
	playerID := c.Param("id")

	// 请求体
	var req struct {
		Name string `json:"name" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误"})
		return
	}

	// 查找属于当前用户的目标 Player
	var player model.Player
	if err := db.DB.Where("id = ? AND user_id = ?", playerID, userID).First(&player).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "未找到该玩家或无权限修改"})
		return
	}

	// 修改名称并保存
	player.Name = req.Name
	if err := db.DB.Save(&player).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新玩家失败"})
		return
	}

	c.JSON(http.StatusOK, PlayerResponse{
		ID:   player.ID,
		Name: player.Name,
	})
}
