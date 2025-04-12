package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
)

func ProxyToAuthService(c *gin.Context) {
	proxyRequest(c, "http://auth-service:8081")
}

func ProxyToInventoryService(c *gin.Context) {
	proxyRequest(c, "http://inventory-service:8082")
}

func ProxyToReportingService(c *gin.Context) {
	proxyRequest(c, "http://reporting-service:8083")
}

func proxyRequest(c *gin.Context, target string) {
	client := &http.Client{}
	// Берем query параметры из текущего запроса и добавляем их к целевому URL
	targetURL := target + c.Request.URL.Path

	// Если в запросе есть query параметры, они также добавляются к целевому URL
	if c.Request.URL.RawQuery != "" {
		targetURL = fmt.Sprintf("%s?%s", targetURL, c.Request.URL.RawQuery)
	}

	log.Println("start req", c.Request.Method, targetURL)

	req, err := http.NewRequest(c.Request.Method, targetURL, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		log.Println("failed to create request:", err)
		return
	}

	// Клонируем заголовки
	req.Header = c.Request.Header.Clone()

	// Пробрасываем пользовательские данные в заголовках
	if userID, ok := c.Get("user_id"); ok {
		req.Header.Set("X-User-ID", toString(userID))
	}
	if role, ok := c.Get("role"); ok {
		req.Header.Set("X-Role", toString(role))
	}
	if labID, ok := c.Get("lab_id"); ok {
		req.Header.Set("X-Lab-ID", toString(labID))
	}

	// Выполняем запрос
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		log.Println("request failed:", err)
		return
	}
	defer resp.Body.Close()

	// Чтение ответа
	body, _ := io.ReadAll(resp.Body)
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

// Преобразуем interface{} в строку
func toString(val interface{}) string {
	switch v := val.(type) {
	case string:
		return v
	case uint64:
		return fmt.Sprintf("%d", v)
	default:
		return ""
	}
}
