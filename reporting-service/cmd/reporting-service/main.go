package main

import (
	"log"
	"reporting-service/pkg/config"
	"reporting-service/pkg/db"
	"reporting-service/pkg/routes"
)

func main() {
	conf := config.GetConfDB()
	database := db.InitDB(conf)

	router := routes.SetupRoutes(database)

	if err := router.Run(":8083"); err != nil {
		log.Fatal(err)
		return
	}
	log.Println("Reporting Service running on :8083")
}
