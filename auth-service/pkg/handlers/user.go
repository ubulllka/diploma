package handlers

import (
	"auth-service/pkg/models"
	"auth-service/pkg/models/DTO"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetInfo(c *gin.Context) {

	userIDRaw, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found"})
		return
	}

	userID := userIDRaw.(uint64)

	roleRaw, ok := c.Get("role")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "role not found"})
		return
	}

	role := roleRaw.(string)

	labID, ok := c.Get("lab_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !strings.EqualFold(string(role), string(user.Role)) || labID != user.LabID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "wrong data"})
		return
	}

	userResponse := DTO.UserResponse{
		ID:         user.ID,
		LastName:   user.LastName,
		FirstName:  user.FirstName,
		MiddleName: user.MiddleName,
		Email:      user.Email,
		LabID:      user.LabID,
		Status:     user.Status,
		Role:       user.Role,
	}

	c.JSON(http.StatusOK, userResponse)
}

func (h *Handler) UpdateSelf(c *gin.Context) {
	userIDRaw, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_id not found"})
		return
	}

	userID := userIDRaw.(uint64)

	var req DTO.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// Обновление полей
	user.Email = req.Email
	user.LastName = req.LastName
	user.FirstName = req.FirstName
	user.MiddleName = req.MiddleName
	if user.LabID != req.LabID {
		user.Status = models.Banned
	}
	user.LabID = req.LabID
	user.UpdatedAt = time.Now()

	if err := h.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user updated successfully"})
}

func (h *Handler) GetUsersByLab(c *gin.Context) {
	labIDRaw, ok := c.Get("lab_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	labID := labIDRaw.(uint64)

	var users []models.User
	if err := h.DB.Where("lab_id = ?", labID).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response []DTO.UserResponse
	for _, user := range users {
		response = append(response, DTO.UserResponse{
			ID:         user.ID,
			LastName:   user.LastName,
			FirstName:  user.FirstName,
			MiddleName: user.MiddleName,
			Email:      user.Email,
			LabID:      user.LabID,
			Status:     user.Status,
			Role:       user.Role,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (h *Handler) UpdateUserStatus(c *gin.Context) {
	labIDRaw, ok := c.Get("lab_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	labID := labIDRaw.(uint64)

	userID := c.Param("id")
	userIDUint, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var body struct {
		Status models.Status `json:"status"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if body.Status != models.Active && body.Status != models.Banned {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		return
	}

	var user models.User
	if err := h.DB.First(&user, userIDUint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if user.LabID != labID {
		c.JSON(http.StatusForbidden, gin.H{"error": "user not in your lab"})
		return
	}

	user.Status = body.Status
	user.UpdatedAt = time.Now()
	if err := h.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "status updated"})
}

func (h *Handler) UpdateUserRole(c *gin.Context) {
	labIDRaw, ok := c.Get("lab_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	labID := labIDRaw.(uint64)

	userID := c.Param("id")
	userIDUint, err := strconv.ParseUint(userID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var body struct {
		Role models.Role `json:"role"`
	}
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if body.Role == models.SuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "cannot assign SuperAdmin role"})
		return
	}

	validRoles := []models.Role{models.Admin, models.Manager, models.Employee}
	isValid := false
	for _, r := range validRoles {
		if r == body.Role {
			isValid = true
			break
		}
	}

	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid role"})
		return
	}

	var user models.User
	if err := h.DB.First(&user, userIDUint).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if user.LabID != labID {
		c.JSON(http.StatusForbidden, gin.H{"error": "user not in your lab"})
		return
	}

	user.Role = body.Role
	user.UpdatedAt = time.Now()
	if err := h.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "role updated"})
}
