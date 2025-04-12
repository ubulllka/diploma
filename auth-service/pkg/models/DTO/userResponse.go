package DTO

import "auth-service/pkg/models"

type UserResponse struct {
	ID         uint64        `json:"id"`
	Email      string        `json:"email"`
	LastName   string        `json:"last_name"`
	FirstName  string        `json:"first_name"`
	MiddleName string        `json:"middle_name"`
	Role       models.Role   `json:"role"`
	Status     models.Status `json:"status"`
	LabID      uint64        `json:"lab_id"`
}
