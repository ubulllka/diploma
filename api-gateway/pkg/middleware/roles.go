package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Role string

const (
	SuperAdmin Role = "superadmin"
	Admin      Role = "admin"
	Manager    Role = "manager"
	Employee   Role = "employee"
)

type Status string

const (
	Active Status = "active"
	Banned Status = "banned"
)

func RequireRoles(roles ...Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		userStatus := c.GetString("status")
		if userStatus != string(Active) {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		}
		userRole := c.GetString("role")
		for _, role := range roles {
			if userRole == string(role) {
				c.Next()
				return
			}
		}
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		c.Abort()
	}
}
