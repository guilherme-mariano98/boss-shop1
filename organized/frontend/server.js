const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8000;
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

// Create SQLite database connection
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  try {
    // Create users table with enhanced customer information
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      country TEXT DEFAULT 'Brasil',
      date_of_birth TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table created/verified');
      }
    });

    // Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating products table:', err.message);
      } else {
        console.log('Products table created/verified');
        // Check if products table is empty and insert sample products
        db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
          if (!err && row && row.count === 0) {
            insertSampleProducts();
          }
        });
      }
    });

    // Create orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT,
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating orders table:', err.message);
      } else {
        console.log('Orders table created/verified');
      }
    });

    // Create order_items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`, (err) => {
      if (err) {
        console.error('Error creating order_items table:', err.message);
      } else {
        console.log('Order_items table created/verified');
      }
    });
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
}

// Insert sample products
function insertSampleProducts() {
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

  const stmt = db.prepare("INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)");
  
  products.forEach(product => {
    stmt.run(product.name, product.description, product.price, product.category, function(err) {
      if (err) {
        console.error('Error inserting product:', err.message);
      }
    });
  });
  
  stmt.finalize();
  console.log('Sample products inserted');
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
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing password' });
        }
        
        // Insert new user
        const stmt = db.prepare("INSERT INTO users (name, email, password, phone, address, city, state, zip_code, country, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        stmt.run([name, email, hashedPassword, phone, address, city, state, zipCode, country, dateOfBirth], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }
          
          // Generate token
          const token = jwt.sign({ id: this.lastID, name, email }, SECRET_KEY);
          
          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, name, email }
          });
          
          stmt.finalize();
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (err || !isValidPassword) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY);
        
        res.json({
          message: 'Login successful',
          token,
          user: { id: user.id, name: user.name, email: user.email }
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const category = req.query.category;
    
    let query = "SELECT * FROM products";
    let params = [];
    
    if (category) {
      query += " WHERE category = ?";
      params = [category];
    }
    
    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const id = req.params.id;
    
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get user profile (protected route)
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    db.get("SELECT id, name, email, phone, address, city, state, zip_code, country, date_of_birth, created_at FROM users WHERE id = ?", [req.user.id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile (protected route)
app.put('/api/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, address, city, state, zipCode, country, dateOfBirth } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const stmt = db.prepare("UPDATE users SET name = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?, country = ?, date_of_birth = ? WHERE id = ?");
    stmt.run([name, phone, address, city, state, zipCode, country, dateOfBirth, req.user.id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return updated user data
      db.get("SELECT id, name, email, phone, address, city, state, zip_code, country, date_of_birth, created_at FROM users WHERE id = ?", [req.user.id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (!row) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(row);
      });
      
      stmt.finalize();
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create order (protected route)
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
  
  if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Insert order
  const stmt = db.prepare("INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)");
  stmt.run([req.user.id, totalAmount, shippingAddress, paymentMethod], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error creating order' });
    }
    
    const orderId = this.lastID;
    
    // Insert order items
    const itemStmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    let itemCount = 0;
    
    items.forEach(item => {
      itemStmt.run([orderId, item.productId, item.quantity, item.price], function(err) {
        if (err) {
          console.error('Error inserting order item:', err.message);
        }
        itemCount++;
        if (itemCount === items.length) {
          res.status(201).json({
            message: 'Order created successfully',
            orderId
          });
          itemStmt.finalize();
        }
      });
    });
    
    stmt.finalize();
  });
});

// Get user orders (protected route)
app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [req.user.id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    });
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
const localIP = getLocalIP();
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('BOSS SHOPP - Frontend Server');
  console.log('========================================');
  console.log(`Server is running on all network interfaces`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://${localIP}:${PORT}`);
  console.log('========================================');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
      process.exit(1);
    } else {
      console.log('Database connection closed');
      process.exit(0);
    }
  });
});