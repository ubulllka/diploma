package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"reporting-service/pkg/models"
)

// Вспомогательная функция для парсинга uint64 из параметра URL
func parseUintParam(c *gin.Context, name string) (uint64, bool) {
	val := c.Param(name)
	id, err := strconv.ParseUint(val, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid " + name})
		return 0, false
	}
	return id, true
}

// CreateUsage создаёт новый usage, привязанный к taking_id
func (h *Handler) CreateUsage(c *gin.Context) {
	takingID, ok := parseUintParam(c, "id") // changed from "taking_id" to "id" to match route
	if !ok {
		return
	}

	var input models.Usage
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.TakingId = takingID
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()
	input.IssueTime = time.Now()

	if err := h.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// GetUsages возвращает все usages по taking_id
func (h *Handler) GetUsages(c *gin.Context) {
	takingID, ok := parseUintParam(c, "id") // match route param
	if !ok {
		return
	}

	var usages []models.Usage
	if err := h.DB.Where("taking_id = ?", takingID).Find(&usages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, usages)
}

// GetUsage возвращает один usage по usage_id и taking_id
func (h *Handler) GetUsage(c *gin.Context) {
	takingID, ok := parseUintParam(c, "id")
	if !ok {
		return
	}
	usageID, ok := parseUintParam(c, "usage_id")
	if !ok {
		return
	}

	var usage models.Usage
	if err := h.DB.Where("id = ? AND taking_id = ?", usageID, takingID).First(&usage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "usage not found"})
		return
	}

	c.JSON(http.StatusOK, usage)
}

// UpdateUsage обновляет usage
func (h *Handler) UpdateUsage(c *gin.Context) {
	takingID, ok := parseUintParam(c, "id")
	if !ok {
		return
	}
	usageID, ok := parseUintParam(c, "usage_id")
	if !ok {
		return
	}

	var usage models.Usage
	if err := h.DB.Where("id = ? AND taking_id = ?", usageID, takingID).First(&usage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "usage not found"})
		return
	}

	var input models.Usage
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usage.Quantity = input.Quantity
	usage.IssueTime = time.Now()
	usage.UpdatedAt = time.Now()

	if err := h.DB.Save(&usage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, usage)
}

// DeleteUsage удаляет usage
func (h *Handler) DeleteUsage(c *gin.Context) {
	takingID, ok := parseUintParam(c, "id")
	if !ok {
		return
	}
	usageID, ok := parseUintParam(c, "usage_id")
	if !ok {
		return
	}

	var usage models.Usage
	if err := h.DB.Where("id = ? AND taking_id = ?", usageID, takingID).First(&usage).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "usage not found"})
		return
	}

	if err := h.DB.Delete(&usage).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "usage deleted"})
}
