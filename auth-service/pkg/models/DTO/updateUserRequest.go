package DTO

type UpdateUserRequest struct {
	Email      string `json:"email" binding:"required,email"`
	LastName   string `json:"last_name" binding:"required"`
	FirstName  string `json:"first_name" binding:"required"`
	MiddleName string `json:"middle_name" binding:"required"`
	LabID      uint64 `json:"lab_id" binding:"required"`
}
