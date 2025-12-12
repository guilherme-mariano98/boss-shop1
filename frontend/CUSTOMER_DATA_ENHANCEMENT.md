qu# Customer Data Enhancement for BOSS SHOPP

## Overview

This document explains the enhancements made to store comprehensive customer information in the MySQL database for the BOSS SHOPP application.

## Database Schema Updates

The `users` table has been enhanced to store more detailed customer information:

### New Fields Added

1. **phone** (VARCHAR(20)) - Customer's phone number
2. **address** (TEXT) - Full address including street, number, and complement
3. **city** (VARCHAR(100)) - City name
4. **state** (VARCHAR(100)) - State/Province
5. **zip_code** (VARCHAR(20)) - Postal/ZIP code
6. **country** (VARCHAR(100)) - Country with default value "Brasil"
7. **date_of_birth** (DATE) - Customer's date of birth
8. **updated_at** (TIMESTAMP) - Last update timestamp

### Updated Table Structure

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Brasil',
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Backend API Updates

The Node.js backend has been updated to handle the additional customer information:

### Registration Endpoint (`/api/register`)
- Accepts additional fields: phone, address, city, state, zipCode, country, dateOfBirth
- Stores all provided information in the database during user registration

### Profile Endpoints
- **GET `/api/profile`** - Returns all customer information including the new fields
- **PUT `/api/profile`** - Updates all customer information fields

## Frontend Updates

### Authentication System (`auth.js`)
- Updated registration function to send additional customer information to the backend
- Maintains backward compatibility with existing forms

### Profile Management
1. **Enhanced Profile Page** (`profile.html`)
   - Added fields for CPF, full address, city, state, ZIP code, and country
   - Added a link to the dedicated customer profile management page

2. **Dedicated Customer Profile Page** (`customer-profile.html`)
   - Complete form for managing all customer information
   - Brazilian-specific formatting for phone numbers and ZIP codes
   - State dropdown with all Brazilian states
   - Real-time validation and formatting

## Data Flow

1. **Registration Process**
   - User fills registration form with additional information
   - Frontend sends all data to `/api/register` endpoint
   - Backend stores information in the enhanced `users` table

2. **Profile Management**
   - User accesses profile page to view/update information
   - Frontend fetches data from `/api/profile` endpoint
   - User updates information through form submission
   - Frontend sends updates to `/api/profile` endpoint (PUT)
   - Backend updates information in the database

## Testing

A new test script has been created to verify the enhanced customer data storage:

```
node test_customer_data.js
```

This script:
- Verifies the updated table structure
- Displays sample customer data
- Confirms all new fields are properly stored

## Benefits

1. **Comprehensive Customer Profiles** - Store all relevant customer information
2. **Improved User Experience** - Reduce repeated data entry by storing complete profiles
3. **Better Order Processing** - Pre-filled shipping addresses for faster checkout
4. **Enhanced Analytics** - More detailed customer data for business insights
5. **Compliance** - Store necessary information for legal and tax requirements

## Next Steps

1. Run the database update script to apply schema changes
2. Test the enhanced registration and profile management features
3. Verify data is properly stored and retrieved
4. Update any related documentation

The enhanced customer data storage is now ready for use in the BOSS SHOPP application!