package handlers

import (
	"auth-service/pkg/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Список всех лабораторий
func (h *Handler) ListLabs(c *gin.Context) {
	var labs []models.Laboratory
	if err := h.DB.Find(&labs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, labs)
}

// Создание новой лаборатории
func (h *Handler) CreateLab(c *gin.Context) {
	var input models.Laboratory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Устанавливаем время создания и обновления
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	if err := h.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

// Получение лаборатории по ID
func (h *Handler) GetLabByID(c *gin.Context) {
	id := c.Param("id")
	var lab models.Laboratory

	if err := h.DB.First(&lab, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Laboratory not found"})
		return
	}
	c.JSON(http.StatusOK, lab)
}

func (h *Handler) GetMyLab(c *gin.Context) {
	// Получаем user_id из контекста
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found in context"})
		return
	}

	userID, ok := userIDValue.(uint64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user_id type"})
		return
	}

	// Получаем пользователя
	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// Получаем лабораторию, в которой состоит пользователь
	var lab models.Laboratory
	if err := h.DB.First(&lab, user.LabID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "laboratory not found"})
		return
	}

	c.JSON(http.StatusOK, lab)
}

// Обновление лаборатории по ID
func (h *Handler) UpdateLab(c *gin.Context) {
	id := c.Param("id")
	var input models.Laboratory

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var lab models.Laboratory
	if err := h.DB.First(&lab, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Laboratory not found"})
		return
	}

	// Обновляем время обновления
	lab.Name = input.Name
	lab.Description = input.Description
	lab.UpdatedAt = time.Now()

	if err := h.DB.Save(&lab).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, lab)
}

// Удаление лаборатории по ID (soft delete)
func (h *Handler) DeleteLab(c *gin.Context) {
	id := c.Param("id")
	var lab models.Laboratory

	if err := h.DB.First(&lab, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Laboratory not found"})
		return
	}

	// Мягкое удаление лаборатории
	if err := h.DB.Delete(&lab).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Laboratory deleted successfully"})
}
