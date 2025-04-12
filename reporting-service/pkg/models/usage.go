package models

import (
	"gorm.io/gorm"
	"time"
)

type Usage struct {
	ID uint64 `gorm:"primaryKey" json:"id"`

	Quantity  float64   `gorm:"not null" json:"quantity"`
	TakingId  uint64    `gorm:"not null" json:"taking_id"`
	IssueTime time.Time `gorm:"not null" json:"issue_time"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
