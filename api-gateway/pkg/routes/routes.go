package routes

import (
	"api-gateway/pkg/handlers"
	"api-gateway/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(secret string) *gin.Engine {
	auth := middleware.JWTMiddleware(secret)
	authBanned := middleware.JWTMiddlewareBanned(secret)

	r := gin.Default()
	r.Use(middleware.CORSMiddleware())

	//---------Auth---------

	// Public routes (без авторизации)
	r.POST("/register", handlers.ProxyToAuthService)
	r.POST("/login", handlers.ProxyToAuthService)
	r.GET("/createsuperadmin", handlers.ProxyToAuthService)

	my := r.Group("/my")
	my.Use(authBanned)
	{
		my.GET("", handlers.ProxyToAuthService)
	}

	me := r.Group("/me")
	me.Use(authBanned)
	{
		me.GET("", handlers.ProxyToAuthService)
		me.POST("", handlers.ProxyToAuthService)
	}

	melab := r.Group("/me/lab")
	melab.Use(auth)
	{
		melab.GET("/lab", handlers.ProxyToAuthService)
	}

	// Users - superadmin, admin
	users := r.Group("/users")
	users.Use(auth, middleware.RequireRoles(middleware.Admin, middleware.SuperAdmin))
	{
		users.GET("", handlers.ProxyToAuthService)
		users.POST("/:id/status", handlers.ProxyToAuthService)
		users.POST("/:id/role", handlers.ProxyToAuthService)
	}

	// Labs - только superadmin
	labs := r.Group("/labs")
	labs.Use(auth, middleware.RequireRoles(middleware.SuperAdmin))
	{
		labs.GET("", handlers.ProxyToAuthService)        // Список лабораторий
		labs.POST("", handlers.ProxyToAuthService)       // Создание лаборатории
		labs.GET("/:id", handlers.ProxyToAuthService)    // Получение лаборатории по ID
		labs.PUT("/:id", handlers.ProxyToAuthService)    // Обновление лаборатории
		labs.DELETE("/:id", handlers.ProxyToAuthService) // Удаление лаборатории
	}

	//-----------------------

	//---------Inven---------

	// Inventory - admin, manager
	inv := r.Group("/inventory")
	invEmp := inv
	invEmp.Use(auth, middleware.RequireRoles(middleware.Employee, middleware.Manager, middleware.Admin))
	{
		invEmp.GET("/resources", handlers.ProxyToInventoryService)
		invEmp.GET("/resources/:id", handlers.ProxyToInventoryService)
		invEmp.PUT("/resources/:id/sub", handlers.ProxyToInventoryService)

		invEmp.GET("/measurements", handlers.ProxyToInventoryService)
		invEmp.GET("/measurements/:id", handlers.ProxyToInventoryService)

		invEmp.GET("/substances", handlers.ProxyToInventoryService)
		invEmp.GET("/substances/:id", handlers.ProxyToInventoryService)

		invEmp.GET("/categories", handlers.ProxyToInventoryService)
		invEmp.GET("/categories/:id", handlers.ProxyToInventoryService)

	}
	invManag := inv
	invManag.Use(auth, middleware.RequireRoles(middleware.Manager, middleware.Admin))
	{
		invManag.POST("/resources", handlers.ProxyToInventoryService)
		invManag.PUT("/resources/:id", handlers.ProxyToInventoryService)
		invManag.DELETE("/resources/:id", handlers.ProxyToInventoryService)

		invManag.POST("/measurements", handlers.ProxyToInventoryService)
		invManag.PUT("/measurements/:id", handlers.ProxyToInventoryService)
		invManag.DELETE("/measurements/:id", handlers.ProxyToInventoryService)

		invManag.POST("/substances", handlers.ProxyToInventoryService)
		invManag.PUT("/substances/:id", handlers.ProxyToInventoryService)
		invManag.DELETE("/substances/:id", handlers.ProxyToInventoryService)

		invManag.POST("/categories", handlers.ProxyToInventoryService)
		invManag.PUT("/categories/:id", handlers.ProxyToInventoryService)
		invManag.DELETE("/categories/:id", handlers.ProxyToInventoryService)
	}

	//-----------------------

	//---------Report---------

	takings := r.Group("/takings")
	takings.Use(auth, middleware.RequireRoles(middleware.Employee, middleware.Manager, middleware.Admin))
	{
		takings.POST("", handlers.ProxyToReportingService)
		takings.GET("", handlers.ProxyToReportingService)
		takings.GET("/:id", handlers.ProxyToReportingService)
		takings.PUT("/:id", handlers.ProxyToReportingService)
		takings.DELETE("/:id", handlers.ProxyToReportingService)

		// просто используем тот же:id, чтобы не было конфликта
		takings.GET("/:id/usages", handlers.ProxyToReportingService)
		takings.POST("/:id/usages", handlers.ProxyToReportingService)
		takings.GET("/:id/usages/:usage_id", handlers.ProxyToReportingService)
		takings.PUT("/:id/usages/:usage_id", handlers.ProxyToReportingService)
		takings.DELETE("/:id/usages/:usage_id", handlers.ProxyToReportingService)
	}

	//-----------------------

	return r
}
