const fs = require('fs');
const path = require('path');

console.log('=== BOSS SHOPP Setup Verification ===\n');

// Check if required files exist
const requiredFiles = [
  'server.js',
  'setup_database.sql',
  'test_db_connection.js',
  'initialize_mysql.ps1',
  'launch_mysql_workbench.bat',
  'run_server.bat',
  'README_MYSQL_SETUP.md',
  'MANUAL_MYSQL_SETUP.md'
];

console.log('Checking required files...');
let allFilesExist = true;

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} - Found`);
  } else {
    console.log(`✗ ${file} - Missing`);
    allFilesExist = false;
  }
}

console.log('');

// Check Node.js dependencies
console.log('Checking Node.js dependencies...');
try {
  const mysql2 = require('mysql2');
  console.log('✓ mysql2 - Installed');
} catch (err) {
  console.log('✗ mysql2 - Not installed');
}

try {
  const bcrypt = require('bcryptjs');
  console.log('✓ bcryptjs - Installed');
} catch (err) {
  console.log('✗ bcryptjs - Not installed');
}

try {
  const jwt = require('jsonwebtoken');
  console.log('✓ jsonwebtoken - Installed');
} catch (err) {
  console.log('✗ jsonwebtoken - Not installed');
}

console.log('');

// Check if MySQL service is running
console.log('Checking MySQL service status...');
const { execSync } = require('child_process');

try {
  const serviceStatus = execSync('Get-Service -Name "MySQL80"', { shell: 'powershell.exe', stdio: 'pipe' });
  const statusOutput = serviceStatus.toString();
  
  if (statusOutput.includes('Running')) {
    console.log('✓ MySQL80 service - Running');
  } else {
    console.log('✗ MySQL80 service - Not running');
  }
} catch (err) {
  console.log('✗ MySQL80 service - Not found or error checking status');
}

console.log('');

// Check if MySQL is listening on port 3307
console.log('Checking MySQL port...');
try {
  const portCheck = execSync('netstat -an | findstr :3307', { shell: 'powershell.exe', stdio: 'pipe' });
  const portOutput = portCheck.toString();
  
  if (portOutput.includes('LISTENING')) {
    console.log('✓ MySQL listening on port 3307');
  } else {
    console.log('✗ MySQL not listening on port 3307');
  }
} catch (err) {
  console.log('✗ Error checking MySQL port');
}

console.log('');

// Final status
if (allFilesExist) {
  console.log('✓ All required files are present');
} else {
  console.log('✗ Some required files are missing');
}

console.log('');
console.log('=== Setup Verification Complete ===');
console.log('');
console.log('Next steps:');
console.log('1. Run the database setup using one of these methods:');
console.log('   - Automated: Double-click initialize_mysql.ps1');
console.log('   - Manual: Follow instructions in MANUAL_MYSQL_SETUP.md');
console.log('');
console.log('2. Test the database connection:');
console.log('   node test_db_connection.js');
console.log('');
console.log('3. Start the server:');
console.log('   node server.js');