package routes

import (
	"auth-service/pkg/handlers"
	"auth-service/pkg/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(db *gorm.DB, secret string) *gin.Engine {
	h := handlers.NewHandler(db, secret)
	headersData := middleware.GetDataFromHeaders()

	r := gin.Default()

	internal := r.Group("/internal")
	{
		internal.GET("/user-status", h.CheckUserStatus)
	}

	r.POST("/register", h.Register)
	r.POST("/login", h.Login)

	r.GET("/createsuperadmin", h.CreateSuperAdmin)

	r.GET("/labs", h.ListLabs)         // Список лабораторий
	r.POST("/labs", h.CreateLab)       // Создание лаборатории
	r.GET("/labs/:id", h.GetLabByID)   // Получение лаборатории по ID
	r.PUT("/labs/:id", h.UpdateLab)    // Обновление лаборатории
	r.DELETE("/labs/:id", h.DeleteLab) // Удаление лаборатории

	auth := r.Group("/")
	auth.Use(headersData)
	{
		auth.GET("/my", h.MyData)
		auth.GET("/me", h.GetInfo)
		auth.POST("/me", h.UpdateSelf)
		auth.GET("/me/lab", h.GetMyLab)
		auth.GET("/users", h.GetUsersByLab)
		auth.POST("/users/:id/status", h.UpdateUserStatus)
		auth.POST("/users/:id/role", h.UpdateUserRole)
	}
	return r
}
