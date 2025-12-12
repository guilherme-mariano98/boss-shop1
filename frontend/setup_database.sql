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

-- Show tables
SHOW TABLES;