package main

import (
	"inventory-service/pkg/config"
	"inventory-service/pkg/db"
	"inventory-service/pkg/routes"

	"log"
)

func main() {
	conf := config.GetConfDB()
	database := db.InitDB(conf)
	router := routes.SetupRoutes(database)
	if err := router.Run(":8082"); err != nil {
		log.Fatal(err)
		return
	}
	log.Println("Inventory Service running on :8082")
}
