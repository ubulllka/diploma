package handlers

import (
	"github.com/gin-gonic/gin"
	"inventory-service/pkg/models"
	"net/http"
	"time"
)

// CREATE
func (h *Handler) CreateCategory(c *gin.Context) {
	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	input.LabID = labID
	input.CreatedAt = time.Now()
	input.UpdatedAt = time.Now()

	if err := h.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// READ (List)
func (h *Handler) GetCategories(c *gin.Context) {
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var categories []models.Category
	if err := h.DB.Where("lab_id = ?", labID).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// READ (Single)
func (h *Handler) GetCategory(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var category models.Category
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// UPDATE
func (h *Handler) UpdateCategory(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var category models.Category
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category.Name = input.Name
	category.Description = input.Description
	category.UpdatedAt = time.Now()

	if err := h.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

// DELETE (мягкое удаление)
func (h *Handler) DeleteCategory(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var category models.Category
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	if err := h.DB.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
