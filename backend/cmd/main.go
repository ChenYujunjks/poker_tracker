package main

import (
	"poker-tracker/internal/db"
	"poker-tracker/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	// 建立数据库连接并执行迁移
	database := db.ConnectDatabase()
	db.Migrate(database)

	// 初始化 Gin 路由
	router := gin.Default()

	// 示例路由配置
	router.GET("/api/players", handler.GetPlayers)
	router.POST("/api/gamerecord", handler.CreateGameRecord)

	// 可添加更多路由，例如查询单个玩家在特定时间段的净盈利等

	// 监听端口
	router.Run(":8080")
}
