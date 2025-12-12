# Manual MySQL Database Setup for BOSS SHOPP

Since we're having trouble with automated setup, here's a step-by-step guide to manually set up your MySQL database using MySQL Workbench.

## Step 1: Launch MySQL Workbench

1. Double-click on `launch_mysql_workbench.bat` in the frontend directory
2. Or manually launch MySQL Workbench from your Start Menu

## Step 2: Create a New Connection

1. In MySQL Workbench, click the "+" icon next to "MySQL Connections"
2. Fill in the connection details:
   - Connection Name: `BOSS_SHOPP`
   - Hostname: `localhost`
   - Port: `3307`
   - Username: `root`
   - Password: Leave empty for now (click "Store in Keychain" later if needed)

## Step 3: Connect to MySQL Server

1. Click "OK" to save the connection
2. Double-click on the new "BOSS_SHOPP" connection
3. If prompted for a password, leave it empty and click "OK"

## Step 4: Create the Database

1. Once connected, you'll see an SQL editor window
2. Copy and paste the following SQL commands:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS boss_shopp;

-- Use the database
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
```

3. Click the lightning bolt icon (Execute) to run the SQL commands

## Step 5: Insert Sample Products

After creating the tables, insert the sample products by running this SQL:

```sql
-- Insert sample products
INSERT INTO products (name, description, price, category) VALUES
  -- Moda category
  ('Camiseta Básica', 'Camiseta de algodão 100%', 39.90, 'moda'),
  ('Calça Jeans', 'Calça jeans masculina', 89.90, 'moda'),
  ('Tênis Esportivo', 'Tênis para corrida', 169.90, 'moda'),
  ('Boné Estiloso', 'Boné com proteção UV', 34.90, 'moda'),
  
  -- Eletrônicos category
  ('Smartphone Premium', 'Smartphone com câmera de 108MP', 1760.00, 'eletronicos'),
  ('Notebook Ultrafino', 'Notebook com processador i7', 2975.00, 'eletronicos'),
  ('Fone Bluetooth Sem Fio', 'Fone com cancelamento de ruído', 224.90, 'eletronicos'),
  ('Smart TV 55"', 'TV 4K com HDR', 1750.00, 'eletronicos'),
  
  -- Casa category
  ('Sofá Confortável', 'Sofá de 3 lugares', 1020.00, 'casa'),
  ('Cama Queen Size', 'Cama com headboard', 899.90, 'casa'),
  ('Jogo de Talheres', 'Talheres em aço inoxidável', 159.90, 'casa'),
  ('Kit de Lâmpadas LED', 'Lâmpadas LED econômicas', 97.40, 'casa'),
  
  -- Games category
  ('Console de Videogame', 'Console de última geração', 2250.00, 'games'),
  ('Jogo de Tabuleiro', 'Jogo estratégico para toda família', 89.90, 'games'),
  ('Fone Gamer', 'Fone com som surround 7.1', 299.90, 'games'),
  ('Teclado Mecânico', 'Teclado RGB com switches blue', 319.90, 'games'),
  
  -- Esportes category
  ('Conjunto de Halteres', 'Halteres ajustáveis de 5 a 25kg', 254.90, 'esportes'),
  ('Tênis para Corrida', 'Tênis com amortecimento especial', 199.90, 'esportes'),
  ('Bola de Futebol', 'Bola oficial com certificação', 74.90, 'esportes'),
  ('Bicicleta Mountain Bike', 'Bicicleta para trilhas', 1299.90, 'esportes'),
  
  -- Infantil category
  ('Camiseta Infantil', 'Camiseta 100% algodão', 33.90, 'infantil'),
  ('Meias Coloridas', 'Pacote com 5 pares de meias', 19.90, 'infantil'),
  ('Sapatilha Infantil', 'Sapatilha para festas', 47.90, 'infantil'),
  ('Carrinho de Controle Remoto', 'Carrinho com controle remoto', 89.90, 'infantil');
```

## Step 6: Test the Connection

1. Run the test script to verify the connection:

```
node test_db_connection.js
```

2. If successful, start the server:

```
node server.js
```

## Troubleshooting

### If you can't connect without a password:

1. Try connecting with password "root"
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