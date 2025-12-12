# Initialize MySQL Database for BOSS SHOPP

Write-Host "Initializing MySQL Database for BOSS SHOPP..." -ForegroundColor Green
Write-Host ""

# Check if MySQL service is running
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService -eq $null) {
    Write-Host "MySQL service not found!" -ForegroundColor Red
    exit 1
}

if ($mysqlService.Status -ne "Running") {
    Write-Host "Starting MySQL service..." -ForegroundColor Yellow
    Start-Service -Name "MySQL80"
    Start-Sleep -Seconds 5
}

# Check if MySQL is listening on port 3307
$portCheck = netstat -an | Select-String ":3307"
if ($portCheck -eq $null) {
    Write-Host "MySQL is not listening on port 3307. Please check MySQL configuration." -ForegroundColor Red
    exit 1
}

Write-Host "MySQL service is running on port 3307" -ForegroundColor Green
Write-Host ""

# Try to connect and create database
Write-Host "Creating boss_shopp database..." -ForegroundColor Yellow

# Create a temporary SQL file
$sqlContent = @"
CREATE DATABASE IF NOT EXISTS boss_shopp;
USE boss_shopp;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

SHOW DATABASES LIKE 'boss_shopp';
"@

$tempSqlFile = "$env:TEMP\init_boss_shopp.sql"
$sqlContent | Out-File -FilePath $tempSqlFile -Encoding UTF8

# Try to execute the SQL file
try {
    # Try with default root user (no password)
    $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -P 3307 -h localhost --execute="SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Connected to MySQL without password" -ForegroundColor Green
        $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -P 3307 -h localhost --execute="SOURCE $tempSqlFile;"
    } else {
        # Try with root password
        $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -P 3307 -h localhost --execute="SELECT 1;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Connected to MySQL with password 'root'" -ForegroundColor Green
            $result = & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -P 3307 -h localhost --execute="SOURCE $tempSqlFile;"
        } else {
            Write-Host "Could not connect to MySQL. Please check your MySQL installation and credentials." -ForegroundColor Red
            Write-Host "You may need to:" -ForegroundColor Yellow
            Write-Host "1. Use MySQL Workbench to connect and set a password for root user" -ForegroundColor Yellow
            Write-Host "2. Or reset the MySQL root password" -ForegroundColor Yellow
            exit 1
        }
    }
    
    Write-Host "Database initialization completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error initializing database: $_" -ForegroundColor Red
} finally {
    # Clean up temporary file
    if (Test-Path $tempSqlFile) {
        Remove-Item $tempSqlFile -Force
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'node test_db_connection.js' to test the connection" -ForegroundColor Cyan
Write-Host "2. Run 'node server.js' to start the application" -ForegroundColor Cyan