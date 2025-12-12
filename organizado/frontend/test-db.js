const mysql = require('mysql2');

// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  port: 3307, // MySQL is running on port 3307
  user: 'root',
  password: 'root',
  database: 'boss_shopp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection
const connection = mysql.createConnection(dbConfig);

// Test database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    console.error('Database configuration:', JSON.stringify(dbConfig, null, 2));
    return;
  }
  console.log('Connected to MySQL database successfully!');
  
  // Test a simple query
  connection.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      console.error('Error executing query:', error.message);
      return;
    }
    console.log('Query result:', results[0].solution);
    connection.end();
  });
});