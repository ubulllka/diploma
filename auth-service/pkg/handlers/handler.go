package handlers

import "gorm.io/gorm"

type Handler struct {
	DB     *gorm.DB
	Secret string
}

func NewHandler(db *gorm.DB, secret string) *Handler {
	return &Handler{DB: db, Secret: secret}
}
