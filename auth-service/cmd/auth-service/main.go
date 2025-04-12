package main

import (
	"auth-service/pkg/config"
	"auth-service/pkg/db"
	"auth-service/pkg/routes"
	"log"
)

func main() {
	conf := config.GetConfDB()
	database := db.InitDB(conf)
	secret := config.GetJwtSecret()
	router := routes.SetupRoutes(database, secret)
	if err := router.Run(":8081"); err != nil {
		log.Fatal(err)
		return
	}
	log.Println("Auth Service running on :8081")
}
