package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"reporting-service/pkg/handlers"
	"reporting-service/pkg/middleware"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {

	h := handlers.NewHandler(db)
	headersData := middleware.GetDataFromHeaders()

	r := gin.Default()

	r.Use(headersData)

	takings := r.Group("/takings")
	{
		takings.POST("", h.CreateTaking)
		takings.GET("", h.GetTakings)
		takings.GET("/:id", h.GetTaking)
		takings.PUT("/:id", h.UpdateTaking)
		takings.DELETE("/:id", h.DeleteTaking)

		takings.GET("/:id/usages", h.GetUsages)
		takings.POST("/:id/usages", h.CreateUsage)
		takings.GET("/:id/usages/:usage_id", h.GetUsage)
		takings.PUT("/:id/usages/:usage_id", h.UpdateUsage)
		takings.DELETE("/:id/usages/:usage_id", h.DeleteUsage)
	}

	return r
}
