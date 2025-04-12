package models

import (
	"gorm.io/gorm"
	"time"
)

type Measurement struct {
	ID uint64 `gorm:"primaryKey" json:"id"`

	Name      string `gorm:"not null" json:"name"`
	ShortName string `gorm:"not null" json:"short_name"`

	LabID     uint64         `gorm:"not null" json:"lab_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
