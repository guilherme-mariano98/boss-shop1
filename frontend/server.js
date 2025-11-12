const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'boss_shopp_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

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

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Get a connection from the pool
const db = pool.promise();

// Test database connection
db.getConnection()
  .then(() => {
    console.log('Connected to MySQL database');
    initializeDatabase();
  })
  .catch(err => {
    console.error('Error connecting to MySQL database:', err.message);
    console.error('Database configuration:', JSON.stringify(dbConfig, null, 2));
    console.log('Please make sure MySQL is running and the database configuration is correct.');
    console.log('');
    console.log('Troubleshooting tips:');
    console.log('1. Check if MySQL service is running (Get-Service -Name "MySQL80")');
    console.log('2. Verify MySQL is listening on port 3307 (netstat -an | findstr :3307)');
    console.log('3. Check MySQL root user credentials');
    console.log('4. Refer to MANUAL_MYSQL_SETUP.md for manual setup instructions');
  });

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create users table with enhanced customer information
    await db.execute(`
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
      )
    `);
    console.log('Users table created/verified');

    // Create products table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Products table created/verified');

    // Create orders table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        shipping_address TEXT,
        payment_method VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Orders table created/verified');

    // Create order_items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    console.log('Order_items table created/verified');

    // Check if products table is empty and insert sample products
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM products");
    if (rows[0].count === 0) {
      insertSampleProducts();
    }
  } catch (err) {
    console.error('Error initializing database:', err.message);
    console.error('Stack trace:', err.stack);
    console.log('');
    console.log('Please check your MySQL setup and refer to MANUAL_MYSQL_SETUP.md for manual setup instructions');
  }
}

// Insert sample products
async function insertSampleProducts() {
  const products = [
    // Moda category
    { name: 'Camiseta Básica', description: 'Camiseta de algodão 100%', price: 39.90, category: 'moda' },
    { name: 'Calça Jeans', description: 'Calça jeans masculina', price: 89.90, category: 'moda' },
    { name: 'Tênis Esportivo', description: 'Tênis para corrida', price: 169.90, category: 'moda' },
    { name: 'Boné Estiloso', description: 'Boné com proteção UV', price: 34.90, category: 'moda' },
    
    // Eletrônicos category
    { name: 'Smartphone Premium', description: 'Smartphone com câmera de 108MP', price: 1760.00, category: 'eletronicos' },
    { name: 'Notebook Ultrafino', description: 'Notebook com processador i7', price: 2975.00, category: 'eletronicos' },
    { name: 'Fone Bluetooth Sem Fio', description: 'Fone com cancelamento de ruído', price: 224.90, category: 'eletronicos' },
    { name: 'Smart TV 55"', description: 'TV 4K com HDR', price: 1750.00, category: 'eletronicos' },
    
    // Casa category
    { name: 'Sofá Confortável', description: 'Sofá de 3 lugares', price: 1020.00, category: 'casa' },
    { name: 'Cama Queen Size', description: 'Cama com headboard', price: 899.90, category: 'casa' },
    { name: 'Jogo de Talheres', description: 'Talheres em aço inoxidável', price: 159.90, category: 'casa' },
    { name: 'Kit de Lâmpadas LED', description: 'Lâmpadas LED econômicas', price: 97.40, category: 'casa' },
    
    // Games category
    { name: 'Console de Videogame', description: 'Console de última geração', price: 2250.00, category: 'games' },
    { name: 'Jogo de Tabuleiro', description: 'Jogo estratégico para toda família', price: 89.90, category: 'games' },
    { name: 'Fone Gamer', description: 'Fone com som surround 7.1', price: 299.90, category: 'games' },
    { name: 'Teclado Mecânico', description: 'Teclado RGB com switches blue', price: 319.90, category: 'games' },
    
    // Esportes category
    { name: 'Conjunto de Halteres', description: 'Halteres ajustáveis de 5 a 25kg', price: 254.90, category: 'esportes' },
    { name: 'Tênis para Corrida', description: 'Tênis com amortecimento especial', price: 199.90, category: 'esportes' },
    { name: 'Bola de Futebol', description: 'Bola oficial com certificação', price: 74.90, category: 'esportes' },
    { name: 'Bicicleta Mountain Bike', description: 'Bicicleta para trilhas', price: 1299.90, category: 'esportes' },
    
    // Infantil category
    { name: 'Camiseta Infantil', description: 'Camiseta 100% algodão', price: 33.90, category: 'infantil' },
    { name: 'Meias Coloridas', description: 'Pacote com 5 pares de meias', price: 19.90, category: 'infantil' },
    { name: 'Sapatilha Infantil', description: 'Sapatilha para festas', price: 47.90, category: 'infantil' },
    { name: 'Carrinho de Controle Remoto', description: 'Carrinho com controle remoto', price: 89.90, category: 'infantil' }
  ];

  try {
    for (const product of products) {
      await db.execute(
        "INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)",
        [product.name, product.description, product.price, product.category]
      );
    }
    console.log('Sample products inserted');
  } catch (err) {
    console.error('Error inserting sample products:', err.message);
    console.error('Stack trace:', err.stack);
  }
}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, zipCode, country, dateOfBirth } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    
    if (rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, phone, address, city, state, zip_code, country, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [name, email, hashedPassword, phone, address, city, state, zipCode, country, dateOfBirth]
    );
    
    // Generate token
    const token = jwt.sign({ id: result.insertId, name, email }, SECRET_KEY);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = rows[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY);
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category;
    
    let query = "SELECT * FROM products";
    let params = [];
    
    if (category) {
      query += " WHERE category = ?";
      params = [category];
    }
    
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get user profile (protected route)
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, name, email, phone, address, city, state, zip_code, country, date_of_birth, created_at FROM users WHERE id = ?", 
            [req.user.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update user profile (protected route)
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { name, phone, address, city, state, zipCode, country, dateOfBirth } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        
        const [result] = await db.execute(
            "UPDATE users SET name = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?, country = ?, date_of_birth = ? WHERE id = ?", 
            [name, phone, address, city, state, zipCode, country, dateOfBirth, req.user.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return updated user data
        const [rows] = await db.execute(
            "SELECT id, name, email, phone, address, city, state, zip_code, country, date_of_birth, created_at FROM users WHERE id = ?", 
            [req.user.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create order (protected route)
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
  
  if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert order
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)",
      [req.user.id, totalAmount, shippingAddress, paymentMethod]
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.productId, item.quantity, item.price]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  } finally {
    connection.release();
  }
});

// Get user orders (protected route)
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT o.*, 
              GROUP_CONCAT(
                JSON_OBJECT(
                  'productId', oi.product_id, 
                  'quantity', oi.quantity, 
                  'price', oi.price
                )
              ) as items
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       GROUP BY o.id 
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    
    // Parse items JSON
    const orders = rows.map(order => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }));
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BOSS SHOPP API is running' });
});

// Serve frontend files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  console.log(`Server is running on all network interfaces`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://${localIP}:${PORT}`);
  console.log(`API endpoints available at http://${localIP}:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.end()
    .then(() => {
      console.log('Database connection closed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing database connection:', err);
      process.exit(1);
    });
});
