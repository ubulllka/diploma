package handlers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

// Получение LabID из контекста
func getLabID(c *gin.Context) (uint64, bool) {
	labIDValue, exists := c.Get("lab_id")
	if !exists {
		return 0, false
	}
	labID, ok := labIDValue.(uint64)
	return labID, ok
}
