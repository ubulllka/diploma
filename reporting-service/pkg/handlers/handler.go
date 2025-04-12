package handlers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"reporting-service/pkg/models"
)

type Handler struct {
	DB *gorm.DB
}

func NewHandler(db *gorm.DB) *Handler {
	return &Handler{DB: db}
}

func getUserID(c *gin.Context) (uint64, bool) {
	userIDValue, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}
	userID, ok := userIDValue.(uint64)
	return userID, ok
}

func isValidTakingStatus(s models.Status) bool {
	return s == models.Take || s == models.Pass
}
