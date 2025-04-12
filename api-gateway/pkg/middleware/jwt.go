package middleware

import (
	"encoding/json"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func JWTMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "no token"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		userID := uint64(claims["user_id"].(float64))

		if !isUserActive(userID) {
			c.JSON(http.StatusForbidden, gin.H{"error": "user is banned"})
			c.Abort()
			return
		}

		labID := uint64(claims["lab_id"].(float64))

		c.Set("user_id", userID)
		c.Set("role", claims["role"].(string))
		c.Set("status", claims["status"].(string))
		c.Set("lab_id", labID)

		c.Next()
	}
}

func JWTMiddlewareBanned(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "no token"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		userID := uint64(claims["user_id"].(float64))

		labID := uint64(claims["lab_id"].(float64))

		c.Set("user_id", userID)
		c.Set("role", claims["role"].(string))
		c.Set("status", claims["status"].(string))
		c.Set("lab_id", labID)

		c.Next()
	}
}

func isUserActive(userID uint64) bool {
	url := fmt.Sprintf("http://auth-service:8081/internal/user-status?user_id=%d", userID)

	resp, err := http.Get(url)
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false
	}

	var res struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return false
	}

	return res.Status == "active"
}
