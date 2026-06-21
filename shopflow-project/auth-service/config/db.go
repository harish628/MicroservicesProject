package config

import (
	"fmt"
	"log"
	"os"

	"auth-service/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// DB is the global database connection
// Think of this like the "open filing cabinet" that everyone in the office can use
var DB *gorm.DB

// ConnectDatabase opens the connection to MySQL
// It reads credentials from the .env file and connects
func ConnectDatabase() {
	// Build the connection string
	// Format: username:password@tcp(host:port)/database?options
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	// Open the connection
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// AutoMigrate: GORM will create the tables automatically if they don't exist
	// Think of this as: "if the drawer doesn't exist in the filing cabinet, create it"
	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	DB = db
	log.Println("✅ Database connected and migrated successfully")
}
