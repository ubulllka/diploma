package handlers

import (
	"auth-service/pkg/middleware"
	"auth-service/pkg/models"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	UserID uint
	Role   string
	LabID  uint
	jwt.RegisteredClaims
}

type Result struct {
	Token  string `json:"token"`
	Uid    string `json:"uid"`
	Role   string `json:"role"`
	LabID  string `json:"lab"`
	Status string `json:"status"`
}

func (h *Handler) Register(c *gin.Context) {

	var input struct {
		LabID      uint64 `json:"lab_id"`
		LastName   string `json:"last_name" binding:"required"`
		FirstName  string `json:"first_name" binding:"required"`
		MiddleName string `json:"middle_name"`
		Email      string `json:"email" binding:"required"`
		Password   string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := models.User{
		LabID:        input.LabID,
		LastName:     input.LastName,
		FirstName:    input.FirstName,
		MiddleName:   input.MiddleName,
		Email:        input.Email,
		PasswordHash: string(hashed),
		Role:         models.Employee,
		Status:       models.Banned,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token, err := middleware.GetJWTToken(user, h.Secret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := Result{
		Token:  token,
		Role:   string(user.Role),
		Uid:    strconv.FormatUint(user.ID, 10),
		LabID:  strconv.FormatUint(user.LabID, 10),
		Status: string(user.Status),
	}
	c.JSON(http.StatusCreated, result)

}

func (h *Handler) Login(c *gin.Context) {
	var input struct {
		Email    string
		Password string
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, err := middleware.GetJWTToken(user, h.Secret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	result := Result{
		Token:  token,
		Role:   string(user.Role),
		Uid:    strconv.FormatUint(user.ID, 10),
		LabID:  strconv.FormatUint(user.LabID, 10),
		Status: string(user.Status),
	}

	c.JSON(http.StatusOK, result)

}

func (h *Handler) CreateSuperAdmin(c *gin.Context) {
	password := "1111"

	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := models.User{
		LabID:        1,
		LastName:     "ubulka",
		FirstName:    "ubullka",
		MiddleName:   "ubulllka",
		Email:        "ubulllka@gmail.com",
		PasswordHash: string(hashed),
		Role:         models.SuperAdmin,
		Status:       models.Active,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token, err := middleware.GetJWTToken(user, h.Secret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := Result{
		Token:  token,
		Role:   string(user.Role),
		Uid:    strconv.FormatUint(user.ID, 10),
		LabID:  strconv.FormatUint(user.LabID, 10),
		Status: string(user.Status),
	}
	c.JSON(http.StatusCreated, result)
}

func (h *Handler) MyData(c *gin.Context) {
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

	tokenRaw, ok := c.Get("token")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	token := tokenRaw.(string)

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !strings.EqualFold(role, string(user.Role)) || labID != user.LabID {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "wrong data"})
		return
	}

	result := Result{
		Token:  token,
		Role:   string(user.Role),
		Uid:    strconv.FormatUint(user.ID, 10),
		LabID:  strconv.FormatUint(user.LabID, 10),
		Status: string(user.Status),
	}

	c.JSON(http.StatusOK, result)

}

// GET /internal/user-status?user_id=123
func (h *Handler) CheckUserStatus(c *gin.Context) {
	userIDStr := c.Query("user_id")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id"})
		return
	}

	var user models.User
	if err := h.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": user.Status,
	})
}
