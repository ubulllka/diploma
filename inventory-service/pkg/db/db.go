package db

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"inventory-service/pkg/config"
	"inventory-service/pkg/models"
	"log"
)

func InitDB(conf *config.ConfDB) *gorm.DB {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		conf.Host, conf.Port, conf.User, conf.Pass, conf.Name)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	if err := db.Exec(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
                CREATE TYPE status AS ENUM ('open', 'closed', 'finish');
            END IF;
        END
        $$;
    `).Error; err != nil {
		log.Fatalf("failed to create type 'status': %v", err)
	}

	db.AutoMigrate(&models.Measurement{}, &models.Substance{}, &models.Category{}, &models.Resource{})

	return db
}
