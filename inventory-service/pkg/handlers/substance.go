package handlers

import (
	"github.com/gin-gonic/gin"
	"inventory-service/pkg/models"
	"net/http"
	"time"
)

// CREATE
func (h *Handler) CreateSubstance(c *gin.Context) {
	var input models.Substance
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
func (h *Handler) GetSubstances(c *gin.Context) {
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var substances []models.Substance
	if err := h.DB.Where("lab_id = ?", labID).Find(&substances).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, substances)
}

// READ (Single)
func (h *Handler) GetSubstance(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var s models.Substance
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&s).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	c.JSON(http.StatusOK, s)
}

// UPDATE
func (h *Handler) UpdateSubstance(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var s models.Substance
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&s).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var input models.Substance
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	s.Name = input.Name
	s.Formula = input.Formula
	s.MeasurementId = input.MeasurementId
	s.UpdatedAt = time.Now()

	if err := h.DB.Save(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, s)
}

// DELETE (мягкое удаление)
func (h *Handler) DeleteSubstance(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var s models.Substance
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&s).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	if err := h.DB.Delete(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
