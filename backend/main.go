package main

import (
	"net/http"
	c "poker-tracker/controllers"
	"poker-tracker/db"
	"poker-tracker/middleware"
	"poker-tracker/model"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database := db.ConnectDatabase()
	db.Migrate(database)

	router := gin.Default()

	router.LoadHTMLGlob("templates/*")

	// 配置 CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                   // 允许 Next.js 前端域名
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // 允许的 HTTP 方法
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // 允许的请求头
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,           // 如果需要支持 cookie 或认证
		MaxAge:           12 * time.Hour, // 预检请求缓存时间
	}))

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

		auth.POST("/players", c.CreatePlayer)
		auth.DELETE("/players/:id", c.DeletePlayer)
		auth.PUT("/players/:id", c.UpdatePlayer)

		//auth.POST("/gamerecord", c.CreateGameRecord)
	}

	router.Run(":8080")
}
