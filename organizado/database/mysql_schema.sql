-- MySQL Database Schema for BOSS SHOPP E-commerce

-- Create database
CREATE DATABASE IF NOT EXISTS boss_shopp;



-- Users table (custom user model)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser TINYINT(1) NOT NULL DEFAULT 0,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    date_joined DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME NOT NULL,
    INDEX idx_slug (slug)
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    image VARCHAR(100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_created_at (created_at)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- User groups table (many-to-many relationship)
CREATE TABLE user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_group (user_id, group_id)
);

-- User user_permissions table (many-to-many relationship)
CREATE TABLE user_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_permission (user_id, permission_id)
);

-- Auth tables (simplified versions - in a real Django app, these would be created by Django)
CREATE TABLE auth_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE auth_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INT NOT NULL,
    codename VARCHAR(100) NOT NULL
);

CREATE TABLE auth_group_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_permission (group_id, permission_id)
);

-- Django session table (for session management)
CREATE TABLE django_session (
    session_key VARCHAR(40) NOT NULL PRIMARY KEY,
    session_data LONGTEXT NOT NULL,
    expire_date DATETIME NOT NULL,
    INDEX idx_expire_date (expire_date)
);

-- Django content types table
CREATE TABLE django_content_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_content_type (app_label, model)
);

-- Django migrations table
CREATE TABLE django_migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied DATETIME NOT NULL
);

-- Auth tokens table (for token-based authentication)
CREATE TABLE authtoken_token (
    key VARCHAR(40) NOT NULL PRIMARY KEY,
    created DATETIME NOT NULL,
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name, slug, description, created_at) VALUES
('Moda', 'moda', 'Roupas e acessórios de moda', NOW()),
('Eletrônicos', 'eletronicos', 'Dispositivos eletrônicos e gadgets', NOW()),
('Casa', 'casa', 'Produtos para o lar', NOW()),
('Games', 'games', 'Jogos e acessórios para gamers', NOW()),
('Esportes', 'esportes', 'Equipamentos esportivos', NOW()),
('Infantil', 'infantil', 'Produtos para bebês e crianças', NOW());

-- Insert sample products
INSERT INTO products (name, description, price, category_id, created_at, updated_at) VALUES
-- Moda category
('Camiseta Básica', 'Camiseta de algodão 100%', 39.90, 1, NOW(), NOW()),
('Calça Jeans', 'Calça jeans masculina', 89.90, 1, NOW(), NOW()),
('Tênis Esportivo', 'Tênis para corrida', 169.90, 1, NOW(), NOW()),
('Boné Estiloso', 'Boné com proteção UV', 34.90, 1, NOW(), NOW()),

-- Eletrônicos category
('Smartphone Premium', 'Smartphone com câmera de 108MP', 1760.00, 2, NOW(), NOW()),
('Notebook Ultrafino', 'Notebook com processador i7', 2975.00, 2, NOW(), NOW()),
('Fone Bluetooth Sem Fio', 'Fone com cancelamento de ruído', 224.90, 2, NOW(), NOW()),
('Smart TV 55"', 'TV 4K com HDR', 1750.00, 2, NOW(), NOW()),

-- Casa category
('Sofá Confortável', 'Sofá de 3 lugares', 1020.00, 3, NOW(), NOW()),
('Cama Queen Size', 'Cama com headboard', 899.90, 3, NOW(), NOW()),
('Jogo de Talheres', 'Talheres em aço inoxidável', 159.90, 3, NOW(), NOW()),
('Kit de Lâmpadas LED', 'Lâmpadas LED econômicas', 97.40, 3, NOW(), NOW()),

-- Games category
('Console de Videogame', 'Console de última geração', 2250.00, 4, NOW(), NOW()),
('Jogo de Tabuleiro', 'Jogo estratégico para toda família', 89.90, 4, NOW(), NOW()),
('Fone Gamer', 'Fone com som surround 7.1', 299.90, 4, NOW(), NOW()),
('Teclado Mecânico', 'Teclado RGB com switches blue', 319.90, 4, NOW(), NOW()),

-- Esportes category
('Conjunto de Halteres', 'Halteres ajustáveis de 5 a 25kg', 254.90, 5, NOW(), NOW()),
('Tênis para Corrida', 'Tênis com amortecimento especial', 199.90, 5, NOW(), NOW()),
('Bola de Futebol', 'Bola oficial com certificação', 74.90, 5, NOW(), NOW()),
('Bicicleta Mountain Bike', 'Bicicleta para trilhas', 1299.90, 5, NOW(), NOW()),

-- Infantil category
('Camiseta Infantil', 'Camiseta 100% algodão', 33.90, 6, NOW(), NOW()),
('Meias Coloridas', 'Pacote com 5 pares de meias', 19.90, 6, NOW(), NOW()),
('Sapatilha Infantil', 'Sapatilha para festas', 47.90, 6, NOW(), NOW()),
('Carrinho de Controle Remoto', 'Carrinho com controle remoto', 89.90, 6, NOW(), NOW());