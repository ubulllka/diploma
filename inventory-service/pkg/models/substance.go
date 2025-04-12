package models

import (
	"gorm.io/gorm"
	"time"
)

type Substance struct {
	ID uint64 `gorm:"primaryKey" json:"id"`

	Name          string `gorm:"not null" json:"name"`
	Formula       string `gorm:"not null" json:"formula"`
	MeasurementId uint64 `gorm:"not null" json:"measurement_id"`

	LabID     uint64         `gorm:"not null" json:"lab_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
