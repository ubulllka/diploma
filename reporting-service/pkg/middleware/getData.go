package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetDataFromHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
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
		c.Set("user_id", userID)
		c.Set("role", role)
		c.Set("lab_id", labID)

		c.Next()
	}
}
