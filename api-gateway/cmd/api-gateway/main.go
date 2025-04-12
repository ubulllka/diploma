package main

import (
	"api-gateway/pkg/config"
	"api-gateway/pkg/routes"
	"log"
)

func main() {
	secret := config.GetJwtSecret()
	router := routes.SetupRouter(secret)
	if err := router.Run(":8080"); err != nil {
		log.Fatal(err)
		return
	}
	log.Println("API Gateway running on :8080")
}
