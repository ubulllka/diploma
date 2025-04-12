package config

import (
	"log"
	"os"
)

type ConfDB struct {
	Host string
	Port string
	User string
	Pass string
	Name string
}

func GetConfDB() *ConfDB {
	host := os.Getenv("DB_HOST")
	if host == "" {
		log.Fatal("host environment variable is required")
	}

	port := os.Getenv("DB_PORT")
	if port == "" {
		log.Fatal("port environment variable is required")
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		log.Fatal("user environment variable is required")
	}

	pass := os.Getenv("DB_PASSWORD")
	if pass == "" {
		log.Fatal("pass environment variable is required")
	}

	name := os.Getenv("DB_NAME")
	if name == "" {
		log.Fatal("name environment variable is required")
	}
	return &ConfDB{
		Host: host,
		Port: port,
		User: user,
		Pass: pass,
		Name: name,
	}
}
