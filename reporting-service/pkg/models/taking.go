package models

import (
	"gorm.io/gorm"
	"time"
)

type Status string

const (
	Take Status = "take"
	Pass Status = "pass"
)

type Taking struct {
	ID uint64 `gorm:"primaryKey" json:"id"`

	UserId      uint64 `gorm:"not null" json:"user_id"`
	ResourceId  uint64 `gorm:"not null" json:"resource_id"`
	Description string `gorm:"not null type:text" json:"description"`
	Status      Status `gorm:"type:status" json:"status"`

	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
