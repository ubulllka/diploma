package db

import (
	"auth-service/pkg/config"
	"auth-service/pkg/models"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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
                CREATE TYPE status AS ENUM ('active', 'banned');
            END IF;
        END
        $$;
    `).Error; err != nil {
		log.Fatalf("failed to create type 'status': %v", err)
	}

	if err := db.Exec(`
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
                CREATE TYPE role AS ENUM ('superadmin', 'admin', 'manager', 'employee');
            END IF;
        END
        $$;
    `).Error; err != nil {
		log.Fatalf("failed to create type 'role': %v", err)
	}

	db.AutoMigrate(&models.User{}, &models.Laboratory{})

	return db
}
