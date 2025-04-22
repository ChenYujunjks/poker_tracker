package main

import (
	"net/http"

	c "poker-tracker/controllers"
	"poker-tracker/db"
	"poker-tracker/middleware"
	"poker-tracker/model"

	"github.com/gin-gonic/gin"
)

func main() {
	database := db.ConnectDatabase()
	db.Migrate(database)

	router := gin.Default()

	router.LoadHTMLGlob("templates/*")

	// 首页（不建议用于前后端分离项目，但可保留）
	router.GET("/", func(c *gin.Context) {
		var players []model.Player
		if err := db.DB.Find(&players).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.HTML(http.StatusOK, "index.html", gin.H{"players": players})
	})

	// 用户认证路由（不需中间件保护）
	router.POST("/api/register", c.Register)
	router.POST("/api/login", c.Login)

	// 鉴权后的 API 组（需要 JWT token）
	auth := router.Group("/api")
	auth.Use(middleware.JWTAuthMiddleware())
	{
		auth.GET("/me", c.GetMe)

		auth.GET("/players", c.GetPlayers)
		//auth.POST("/gamerecord", c.CreateGameRecord)

		auth.POST("/players", func(c *gin.Context) {
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
	}

	router.Run(":8080")
}
