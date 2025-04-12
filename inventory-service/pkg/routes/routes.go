package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"inventory-service/pkg/handlers"
	"inventory-service/pkg/middleware"
)

func SetupRoutes(db *gorm.DB) *gin.Engine {
	h := handlers.NewHandler(db)
	headersData := middleware.GetDataFromHeaders()

	r := gin.Default()

	inv := r.Group("/inventory")
	inv.Use(headersData)

	resources := inv.Group("/resources")
	{
		resources.POST("", h.CreateResource)
		resources.GET("", h.GetResources)
		resources.GET("/:id", h.GetResource)
		resources.PUT("/:id", h.UpdateResource)
		resources.PUT("/:id/sub", h.SubtractFromResourceQuantity)
		resources.DELETE("/:id", h.DeleteResource)
	}

	measure := inv.Group("/measurements")
	{
		measure.GET("", h.GetMeasurements)
		measure.GET("/:id", h.GetMeasurement)
		measure.POST("", h.CreateMeasurement)
		measure.PUT("/:id", h.UpdateMeasurement)
		measure.DELETE("/:id", h.DeleteMeasurement)
	}

	substances := inv.Group("/substances")
	{
		substances.POST("", h.CreateSubstance)
		substances.GET("", h.GetSubstances)
		substances.GET("/:id", h.GetSubstance)
		substances.PUT("/:id", h.UpdateSubstance)
		substances.DELETE("/:id", h.DeleteSubstance)
	}

	categories := inv.Group("/categories")
	{
		categories.POST("", h.CreateCategory)
		categories.GET("", h.GetCategories)
		categories.GET("/:id", h.GetCategory)
		categories.PUT("/:id", h.UpdateCategory)
		categories.DELETE("/:id", h.DeleteCategory)
	}

	return r
}
