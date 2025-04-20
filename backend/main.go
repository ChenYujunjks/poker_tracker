package main

import (
	"net/http"
	c "poker-tracker/controllers"
	"poker-tracker/db"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

func main() {
	// 建立数据库连接并执行迁移
	database := db.ConnectDatabase()
	db.Migrate(database)

	router := gin.Default()

	// 加载 HTML 模板
	router.LoadHTMLGlob("templates/*")

	// 渲染首页
	router.GET("/", func(c *gin.Context) {
		var players []model.Player
		if err := db.DB.Find(&players).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.HTML(http.StatusOK, "index.html", gin.H{"players": players})
	})

	// API 路由
	router.GET("/api/players", c.GetPlayers)
	router.POST("/api/gamerecord", c.CreateGameRecord)

	// 添加玩家 API
	router.POST("/api/players", func(c *gin.Context) {
		var player model.Player
		if err := c.ShouldBindJSON(&player); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := db.DB.Create(&player).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, player)
	})

	router.Run(":8080")
}
