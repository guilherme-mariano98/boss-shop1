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

// Test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database successfully!');
    
    // Test query
    const [rows] = await db.execute("SELECT 1 + 1 AS solution");
    console.log('Test query result:', rows[0]);
    
    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MySQL database:', err.message);
    console.log('Please make sure MySQL is running and the database configuration is correct.');
    process.exit(1);
  }
}

testConnection();