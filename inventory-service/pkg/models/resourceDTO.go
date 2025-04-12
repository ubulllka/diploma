package models

import "time"

type ResourceDTO struct {
	ID          uint64  `json:"id"`
	Name        string  `json:"name"`
	ProductDate string  `json:"product_date"` // Форматированная строка
	ExpireDate  string  `json:"expire_date"`  // Форматированная строка
	Quantity    float64 `json:"quantity"`
	Description string  `json:"description"`
	Status      Status  `json:"status"`
	CategoryId  uint64  `json:"category_id"`
	SubstanceId uint64  `json:"substance_id"`
	LabID       uint64  `json:"lab_id"`
	CreatedAt   string  `json:"created_at"` // Форматированная строка
	UpdatedAt   string  `json:"updated_at"` // Форматированная строка
	DeletedAt   string  `json:"deleted_at"` // Форматированная строка, если нужно
}

// Функция для преобразования Resource в ResourceDTO
func (r *Resource) ToDTO() *ResourceDTO {
	const dateFormat = "2006-01-02"

	return &ResourceDTO{
		ID:          r.ID,
		Name:        r.Name,
		ProductDate: r.ProductDate.Format(dateFormat),
		ExpireDate:  r.ExpireDate.Format(dateFormat),
		Quantity:    r.Quantity,
		Description: r.Description,
		Status:      r.Status,
		CategoryId:  r.CategoryId,
		SubstanceId: r.SubstanceId,
		LabID:       r.LabID,
		CreatedAt:   r.CreatedAt.Format(dateFormat),
		UpdatedAt:   r.UpdatedAt.Format(dateFormat),
		DeletedAt:   r.DeletedAt.Time.Format(dateFormat), // Если DeletedAt не пустой
	}
}

func ToResource(input ResourceDTO, labID uint64) (Resource, error) {
	var productDate, expireDate time.Time
	var err error

	// Преобразуем строки в time.Time, если даты указаны
	if input.ProductDate != "" {
		productDate, err = time.Parse("2006-01-02", input.ProductDate)
		if err != nil {
			return Resource{}, err
		}
	}

	if input.ExpireDate != "" {
		expireDate, err = time.Parse("2006-01-02", input.ExpireDate)
		if err != nil {
			return Resource{}, err
		}
	}

	// Создаем и возвращаем модель Resource
	resource := Resource{
		Name:        input.Name,
		ProductDate: productDate,
		ExpireDate:  expireDate,
		Quantity:    input.Quantity,
		Description: input.Description,
		Status:      input.Status,
		CategoryId:  input.CategoryId,
		SubstanceId: input.SubstanceId,
		LabID:       labID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	return resource, nil
}
