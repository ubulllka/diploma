package models

import (
	"gorm.io/gorm"
	"time"
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

type User struct {
	ID           uint64         `gorm:"primaryKey" json:"id"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	LastName     string         `gorm:"not null" json:"last_name"`
	FirstName    string         `gorm:"not null" json:"first_name"`
	MiddleName   string         `gorm:"not null" json:"middle_name"`
	PasswordHash string         `gorm:"not null" json:"password_hash"`
	Role         Role           `gorm:"type:role" json:"role"`
	Status       Status         `gorm:"type:status" json:"status"`
	LabID        uint64         `gorm:"not null" json:"lab_id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
