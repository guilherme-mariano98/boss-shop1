# MySQL Database Setup for BOSS SHOPP

## Prerequisites

1. MySQL Server 8.0 (already installed)
2. MySQL Workbench 8.0 CE (already installed)
3. Node.js and npm (already installed)

## Quick Setup (Automated)

Try running the automated setup script first:

1. Double-click on `initialize_mysql.ps1` 
2. Or run in PowerShell: `.\initialize_mysql.ps1`

If the automated setup fails, follow the manual setup instructions in `MANUAL_MYSQL_SETUP.md`.

## Setup Instructions

### 1. Launch MySQL Workbench

Double-click on `launch_mysql_workbench.bat` or manually launch MySQL Workbench.

### 2. Connect to MySQL Server

In MySQL Workbench:
1. Click on the "+" icon next to "MySQL Connections"
2. Fill in the connection details:
   - Connection Name: BOSS_SHOPP
   - Hostname: localhost
   - Port: 3307
   - Username: root
   - Password: root (try this first, if it doesn't work, leave empty)

### 3. Create Database and Tables

Once connected:
1. Open the `setup_database.sql` file from the frontend directory
2. Execute the entire script by clicking the lightning bolt icon

This will:
- Create the `boss_shopp` database
- Create all required tables (users, products, orders, order_items)
- Insert sample products

### 4. Test Database Connection

Run the test script to verify the connection:

```
node test_db_connection.js
```

### 5. Start the Server

Run the server using:

```
node server.js
```

Or double-click on `start_server.bat`

## Troubleshooting

### If you can't connect with password "root":

1. Try connecting without a password
2. If that doesn't work, you may need to reset the root password:

   In MySQL Workbench (if you can connect):
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
   ```

### If MySQL is not running on port 3307:

Check which port MySQL is running on:
```powershell
netstat -an | findstr LISTENING
```

Look for a line with `:3307` or another port number for MySQL, and update the `server.js` file accordingly.

### If you get "Access denied" errors:

1. Make sure the MySQL service is running:
   ```powershell
   Get-Service -Name "MySQL80"
   ```

2. If it's not running, start it:
   ```powershell
   Start-Service -Name "MySQL80"
   ```