package models

import (
	"gorm.io/gorm"
	"time"
)

type Status string

const (
	Open   Status = "open"
	Closed Status = "closed"
	Finish Status = "finish"
)

type Resource struct {
	ID uint64 `gorm:"primaryKey" json:"id"`

	Name        string    `gorm:"not null" json:"name"`
	ProductDate time.Time `gorm:"not null" json:"product_date"`
	ExpireDate  time.Time `gorm:"not null" json:"expire_date"`
	Quantity    float64   `gorm:"not null" json:"quantity"`
	Description string    `gorm:"not null type:text" json:"description"`
	Status      Status    `gorm:"type:status" json:"status"`

	CategoryId  uint64 `gorm:"not null" json:"category_id"`
	SubstanceId uint64 `gorm:"not null" json:"substance_id"`

	LabID     uint64         `gorm:"not null" json:"lab_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
