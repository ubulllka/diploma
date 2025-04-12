package config

import (
	"log"
	"os"
)

func GetJwtSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("jwt environment variable is required")
	}

	return secret
}
