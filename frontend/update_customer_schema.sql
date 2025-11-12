-- Update script for enhanced customer data schema
-- This script adds new columns to the existing users table

USE boss_shopp;

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20) AFTER password,
ADD COLUMN address TEXT AFTER phone,
ADD COLUMN city VARCHAR(100) AFTER address,
ADD COLUMN state VARCHAR(100) AFTER city,
ADD COLUMN zip_code VARCHAR(20) AFTER state,
ADD COLUMN country VARCHAR(100) DEFAULT 'Brasil' AFTER zip_code,
ADD COLUMN date_of_birth DATE AFTER country,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Verify the updated schema
DESCRIBE users;

-- Show a sample of the data to confirm the update
SELECT id, name, email, phone, city, state, country, created_at, updated_at 
FROM users 
LIMIT 5;