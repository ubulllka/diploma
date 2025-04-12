package handlers

import (
	"github.com/gin-gonic/gin"
	"inventory-service/pkg/models"
	"net/http"
	"time"
)

// CREATE
func (h *Handler) CreateMeasurement(c *gin.Context) {

	var input models.Measurement
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found in context"})
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
func (h *Handler) GetMeasurements(c *gin.Context) {
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var measurements []models.Measurement
	if err := h.DB.Where("lab_id = ?", labID).Find(&measurements).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, measurements)

}

// READ (Single)
func (h *Handler) GetMeasurement(c *gin.Context) {

	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var m models.Measurement
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&m).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, m)

}

// UPDATE
func (h *Handler) UpdateMeasurement(c *gin.Context) {

	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var m models.Measurement
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&m).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var input models.Measurement
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	m.Name = input.Name
	m.ShortName = input.ShortName
	m.UpdatedAt = time.Now()

	if err := h.DB.Save(&m).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, m)

}

// DELETE (мягкое удаление через GORM)
func (h *Handler) DeleteMeasurement(c *gin.Context) {

	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var m models.Measurement
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&m).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	if err := h.DB.Delete(&m).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})

}
