package handlers

import (
	"github.com/gin-gonic/gin"
	"inventory-service/pkg/models"
	"net/http"
	"time"
)

// CREATE
func (h *Handler) CreateResource(c *gin.Context) {
	var input models.ResourceDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем labID из контекста
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	// Преобразуем DTO в модель Resource
	resource, err := models.ToResource(input, labID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format"})
		return
	}

	// Сохраняем ресурс в базе данных
	if err := h.DB.Create(&resource).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Преобразуем модель Resource обратно в ResourceDTO для ответа
	resourceDTO := resource.ToDTO()

	c.JSON(http.StatusCreated, resourceDTO)
}

// READ (List with filters)
func (h *Handler) GetResources(c *gin.Context) {
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var resources []models.Resource
	query := h.DB.Where("lab_id = ?", labID)

	// Применяем фильтры для поиска
	if name := c.Query("name"); name != "" {
		query = query.Where("name ILIKE ?", "%"+name+"%")
	}

	if category := c.Query("category_id"); category != "" {
		query = query.Where("category_id = ?", category)
	}

	if substance := c.Query("substance_id"); substance != "" {
		query = query.Where("substance_id = ?", substance)
	}

	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Find(&resources).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Преобразуем все ресурсы в DTO
	resourceDTOs := make([]models.ResourceDTO, len(resources))
	for i, r := range resources {
		resourceDTOs[i] = *r.ToDTO()
	}

	c.JSON(http.StatusOK, resourceDTOs)
}

// READ (Single)
func (h *Handler) GetResource(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var r models.Resource
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&r).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	// Преобразуем модель Resource в DTO для ответа
	resourceDTO := *r.ToDTO()

	c.JSON(http.StatusOK, resourceDTO)
}

// UPDATE
func (h *Handler) UpdateResource(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var input models.ResourceDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Преобразуем DTO в модель Resource
	resource, err := models.ToResource(input, labID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format"})
		return
	}

	var existingResource models.Resource
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&existingResource).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	// Обновляем существующий ресурс
	existingResource.Name = resource.Name
	existingResource.ProductDate = resource.ProductDate
	existingResource.ExpireDate = resource.ExpireDate
	existingResource.Quantity = resource.Quantity
	existingResource.Description = resource.Description
	existingResource.CategoryId = resource.CategoryId
	existingResource.SubstanceId = resource.SubstanceId
	existingResource.Status = resource.Status
	existingResource.UpdatedAt = time.Now()

	if err := h.DB.Save(&existingResource).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Преобразуем обновленный ресурс обратно в DTO для ответа
	resourceDTO := *existingResource.ToDTO()

	c.JSON(http.StatusOK, resourceDTO)
}

// DELETE (мягкое удаление)
func (h *Handler) DeleteResource(c *gin.Context) {
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	var r models.Resource
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&r).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	if err := h.DB.Delete(&r).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}

// UPDATE (subtract from Quantity)
func (h *Handler) SubtractFromResourceQuantity(c *gin.Context) {
	// Получаем id ресурса из параметров запроса
	id := c.Param("id")
	labID, ok := getLabID(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "lab_id not found"})
		return
	}

	// Получаем массив чисел из тела запроса
	var quantities []float64
	if err := c.ShouldBindJSON(&quantities); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Находим ресурс по id и lab_id
	var resource models.Resource
	if err := h.DB.Where("id = ? AND lab_id = ?", id, labID).First(&resource).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
		return
	}

	// Вычисляем сумму всех чисел, которые нужно вычесть
	totalToSubtract := 0.0
	for _, qty := range quantities {
		totalToSubtract += qty
	}

	// Вычитаем сумму из Quantity ресурса
	resource.Quantity -= totalToSubtract

	// Если итоговое количество меньше 0, устанавливаем в 0
	if resource.Quantity < 0 {
		resource.Quantity = 0
	}

	resource.Status = models.Open
	// Если Quantity стало 0, меняем статус на finish
	if resource.Quantity == 0 {
		resource.Status = models.Finish
	}

	// Обновляем ресурс в базе данных
	resource.UpdatedAt = time.Now()
	if err := h.DB.Save(&resource).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Преобразуем обновлённый ресурс в DTO для ответа
	resourceDTO := *resource.ToDTO()

	c.JSON(http.StatusOK, resourceDTO)
}
