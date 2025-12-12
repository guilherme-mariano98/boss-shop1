const mysql = require('mysql2');

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'boss_shopp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Get a connection from the pool
const db = pool.promise();

// Test database connection and customer data storage
async function testCustomerData() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database successfully!');
    
    // Test query to check users table structure
    const [rows] = await db.execute("DESCRIBE users");
    console.log('\nUsers table structure:');
    console.log('Field\t\t\tType\t\t\tNull\tKey\tDefault\t\tExtra');
    console.log('-----\t\t\t----\t\t\t----\t---\t-------\t\t-----');
    rows.forEach(row => {
      console.log(`${row.Field}\t\t\t${row.Type}\t\t${row.Null}\t${row.Key}\t${row.Default || ''}\t\t${row.Extra}`);
    });
    
    // Check if there are any users in the database
    const [userRows] = await db.execute("SELECT * FROM users LIMIT 5");
    console.log('\nSample users data:');
    if (userRows.length > 0) {
      userRows.forEach(user => {
        console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
        console.log(`  Phone: ${user.phone || 'N/A'}`);
        console.log(`  Address: ${user.address || 'N/A'}`);
        console.log(`  City: ${user.city || 'N/A'}, State: ${user.state || 'N/A'}`);
        console.log(`  ZIP: ${user.zip_code || 'N/A'}, Country: ${user.country || 'N/A'}`);
        console.log(`  Date of Birth: ${user.date_of_birth || 'N/A'}`);
        console.log(`  Created: ${user.created_at}, Updated: ${user.updated_at || 'N/A'}`);
        console.log('---');
      });
    } else {
      console.log('No users found in the database.');
    }
    
    connection.release();
    console.log('\nCustomer data verification completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MySQL database:', err.message);
    console.log('Please make sure MySQL is running and the database configuration is correct.');
    process.exit(1);
  }
}

testCustomerData();