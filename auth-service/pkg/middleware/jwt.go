package middleware

import (
	"auth-service/pkg/models"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func GetDataFromHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "no token"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		userIDStr := c.GetHeader("X-User-ID")
		role := c.GetHeader("X-Role")
		labIDStr := c.GetHeader("X-Lab-ID")

		if userIDStr == "" || role == "" || labIDStr == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing required headers"})
			c.Abort()
			return
		}

		userID, err := strconv.ParseUint(userIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id"})
			c.Abort()
			return
		}

		labID, err := strconv.ParseUint(labIDStr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid lab_id"})
			c.Abort()
			return
		}

		// Кладём в контекст
		c.Set("token", tokenStr)
		c.Set("user_id", userID)
		c.Set("role", role)
		c.Set("lab_id", labID)

		c.Next()
	}
}

func GetJWTToken(user models.User, secret string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"status":  user.Status,
		"lab_id":  user.LabID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})
	tokenString, err := token.SignedString([]byte(secret))
	return tokenString, err
}
