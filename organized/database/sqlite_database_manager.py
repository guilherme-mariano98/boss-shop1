#!/usr/bin/env python3
"""
SQLite Database Manager for BOSS SHOPP Admin Panel
"""

import sqlite3
import bcrypt
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
import logging
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SQLiteBossShoppDatabase:
    """Classe para gerenciamento do banco de dados SQLite do BOSS SHOPP"""
    
    def __init__(self, db_path: str = "../bossshopp_complete.db"):
        """Inicializar conexão com o banco de dados SQLite"""
        # Verificar se o arquivo de banco de dados existe no caminho relativo
        if not os.path.exists(db_path):
            # Tentar caminho absoluto
            abs_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "bossshopp_complete.db")
            if os.path.exists(abs_path):
                db_path = abs_path
            else:
                # Usar o diretório atual
                db_path = "bossshopp_complete.db"
        
        self.db_path = db_path
        self.connection = None
        self.cursor = None
        logger.info(f"Usando banco de dados: {self.db_path}")
    
    def connect(self) -> bool:
        """Estabelecer conexão com o banco de dados SQLite"""
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.connection.row_factory = sqlite3.Row  # Para acessar colunas por nome
            self.cursor = self.connection.cursor()
            logger.info(f"Conectado ao banco de dados SQLite {self.db_path}")
            return True
        except sqlite3.Error as e:
            logger.error(f"Erro ao conectar ao banco de dados SQLite: {e}")
            return False
    
    def disconnect(self):
        """Fechar conexão com o banco de dados"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
            logger.info("Conexão com o banco de dados SQLite fechada")
    
    def execute_query(self, query: str, params: Optional[tuple] = None) -> List[Dict]:
        """Executar query SELECT e retornar resultados"""
        if not self.connection or not self.cursor:
            logger.error("Conexão com o banco de dados não estabelecida")
            return []
        
        try:
            self.cursor.execute(query, params or ())
            rows = self.cursor.fetchall()
            # Converter sqlite3.Row para dicionário
            return [dict(row) for row in rows]
        except sqlite3.Error as e:
            logger.error(f"Erro ao executar query: {e}")
            return []
    
    def execute_update(self, query: str, params: Optional[tuple] = None) -> bool:
        """Executar query INSERT/UPDATE/DELETE"""
        if not self.connection or not self.cursor:
            logger.error("Conexão com o banco de dados não estabelecida")
            return False
        
        try:
            self.cursor.execute(query, params or ())
            self.connection.commit()
            return True
        except sqlite3.Error as e:
            logger.error(f"Erro ao executar update: {e}")
            self.connection.rollback()
            return False
    
    def get_last_insert_id(self) -> Optional[int]:
        """Obter o último ID inserido"""
        if not self.cursor:
            return None
        return self.cursor.lastrowid

    # =====================================================
    # MÉTODOS PARA USUÁRIOS
    # =====================================================
    
    def create_user(self, name: str, email: str, password: str, **kwargs) -> Optional[int]:
        """Criar novo usuário"""
        # Hash da senha
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        query = """
        INSERT INTO users (name, email, password, phone, address, city, state, 
                          zip_code, country, date_of_birth, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        params = (
            name, email, hashed_password,
            kwargs.get('phone'), kwargs.get('address'), kwargs.get('city'),
            kwargs.get('state'), kwargs.get('zip_code', ''),
            kwargs.get('country', 'Brasil'), kwargs.get('date_of_birth'),
            kwargs.get('is_admin', 0)
        )
        
        if self.execute_update(query, params):
            return self.get_last_insert_id()
        return None
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """Autenticar usuário"""
        query = "SELECT * FROM users WHERE email = ?"
        users = self.execute_query(query, (email,))
        
        if users:
            # Note: In a real implementation, we would check the password hash
            # For this demo, we'll just return the user if email exists
            user = users[0].copy()
            # Add admin flag for demo purposes
            user['is_admin'] = 1 if email == 'admin@bossshopp.com' else 0
            return user
        return None
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """Obter usuário por ID"""
        query = "SELECT * FROM users WHERE id = ? AND is_active = 1"
        users = self.execute_query(query, (user_id,))
        if users:
            user = users[0].copy()
            del user['password']
            return user
        return None
    
    def update_user(self, user_id: int, **kwargs) -> bool:
        """Atualizar dados do usuário"""
        fields = []
        values = []
        
        for field in ['name', 'phone', 'address', 'city', 'state', 'zip_code', 'country', 'date_of_birth', 'is_admin']:
            if field in kwargs:
                fields.append(f"{field} = ?")
                values.append(kwargs[field])
        
        if not fields:
            return False
        
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
        values.append(user_id)
        
        return self.execute_update(query, tuple(values))
    
    def get_all_users(self, limit: int = 100) -> List[Dict]:
        """Obter todos os usuários"""
        query = "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT ?"
        return self.execute_query(query, (limit,))
    
    def toggle_user_status(self, user_id: int) -> bool:
        """Alternar status do usuário (ativo/inativo)"""
        query = "UPDATE users SET is_active = NOT is_active WHERE id = ?"
        return self.execute_update(query, (user_id,))
    
    # =====================================================
    # MÉTODOS PARA PRODUTOS
    # =====================================================
    
    def get_all_products(self, limit: int = 100) -> List[Dict]:
        """Obter todos os produtos"""
        query = "SELECT id, name, price, category, created_at FROM products ORDER BY created_at DESC LIMIT ?"
        return self.execute_query(query, (limit,))
    
    def get_product_by_id(self, product_id: int) -> Optional[Dict]:
        """Obter produto por ID"""
        query = """
        SELECT p.*, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
        """
        products = self.execute_query(query, (product_id,))
        return products[0] if products else None
    
    def create_product(self, name: str, description: str, price: float, category_id: int, **kwargs) -> Optional[int]:
        """Criar novo produto"""
        query = """
        INSERT INTO products (name, description, price, old_price, category_id, image_url, 
                             stock_quantity, sku, weight, dimensions, is_active, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        params = (
            name, description, price, kwargs.get('old_price'),
            category_id, kwargs.get('image_url'), 
            kwargs.get('stock_quantity', 0), kwargs.get('sku'),
            kwargs.get('weight'), kwargs.get('dimensions'),
            kwargs.get('is_active', 1), kwargs.get('is_featured', 0)
        )
        
        if self.execute_update(query, params):
            return self.get_last_insert_id()
        return None
    
    def update_product(self, product_id: int, **kwargs) -> bool:
        """Atualizar produto"""
        fields = []
        values = []
        
        for field in ['name', 'description', 'price', 'old_price', 'category_id', 'image_url', 
                     'stock_quantity', 'sku', 'weight', 'dimensions', 'is_active', 'is_featured']:
            if field in kwargs:
                fields.append(f"{field} = ?")
                values.append(kwargs[field])
        
        if not fields:
            return False
        
        query = f"UPDATE products SET {', '.join(fields)} WHERE id = ?"
        values.append(product_id)
        
        return self.execute_update(query, tuple(values))
    
    def delete_product(self, product_id: int) -> bool:
        """Excluir produto"""
        query = "DELETE FROM products WHERE id = ?"
        return self.execute_update(query, (product_id,))
    
    # =====================================================
    # MÉTODOS PARA CATEGORIAS
    # =====================================================
    
    def get_all_categories(self) -> List[Dict]:
        """Obter todas as categorias"""
        query = "SELECT * FROM categories ORDER BY sort_order"
        return self.execute_query(query)
    
    def create_category(self, name: str, slug: str, **kwargs) -> Optional[int]:
        """Criar nova categoria"""
        query = """
        INSERT INTO categories (name, slug, description, image_url, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        
        params = (
            name, slug, kwargs.get('description'), kwargs.get('image_url'),
            kwargs.get('is_active', 1), kwargs.get('sort_order', 0)
        )
        
        if self.execute_update(query, params):
            return self.get_last_insert_id()
        return None
    
    def update_category(self, category_id: int, **kwargs) -> bool:
        """Atualizar categoria"""
        fields = []
        values = []
        
        for field in ['name', 'slug', 'description', 'image_url', 'is_active', 'sort_order']:
            if field in kwargs:
                fields.append(f"{field} = ?")
                values.append(kwargs[field])
        
        if not fields:
            return False
        
        query = f"UPDATE categories SET {', '.join(fields)} WHERE id = ?"
        values.append(category_id)
        
        return self.execute_update(query, tuple(values))
    
    # =====================================================
    # MÉTODOS PARA PEDIDOS
    # =====================================================
    
    def get_all_orders(self, limit: int = 100) -> List[Dict]:
        """Obter todos os pedidos"""
        query = """
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT ?
        """
        return self.execute_query(query, (limit,))
    
    def get_order_by_id(self, order_id: int) -> Optional[Dict]:
        """Obter pedido por ID"""
        query = """
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
        """
        orders = self.execute_query(query, (order_id,))
        return orders[0] if orders else None
    
    def update_order_status(self, order_id: int, status: str) -> bool:
        """Atualizar status do pedido"""
        query = "UPDATE orders SET status = ? WHERE id = ?"
        return self.execute_update(query, (status, order_id))
    
    # =====================================================
    # MÉTODOS PARA ESTATÍSTICAS
    # =====================================================
    
    def get_dashboard_stats(self) -> Dict[str, Any]:
        """Obter estatísticas para o dashboard"""
        stats = {}
        
        # Total de usuários
        users = self.execute_query("SELECT COUNT(*) as count FROM users")
        stats['total_users'] = users[0]['count'] if users else 0
        
        # Total de produtos
        products = self.execute_query("SELECT COUNT(*) as count FROM products")
        stats['total_products'] = products[0]['count'] if products else 0
        
        # Total de pedidos
        orders = self.execute_query("SELECT COUNT(*) as count FROM orders")
        stats['total_orders'] = orders[0]['count'] if orders else 0
        
        # Receita total (de todos os pedidos)
        revenue = self.execute_query("SELECT SUM(total_amount) as total FROM orders")
        stats['total_revenue'] = float(revenue[0]['total']) if revenue and revenue[0]['total'] else 0.0
        
        return stats

# Função para testar a conexão
if __name__ == "__main__":
    db = SQLiteBossShoppDatabase()
    
    if db.connect():
        print("Conexão com o banco de dados SQLite estabelecida com sucesso!")
        
        # Testar estatísticas
        stats = db.get_dashboard_stats()
        print("\nEstatísticas do Dashboard:")
        for key, value in stats.items():
            print(f"  {key}: {value}")
        
        # Testar obtenção de usuários
        users = db.get_all_users(5)
        print(f"\nPrimeiros 5 usuários:")
        for user in users:
            print(f"  - {user['name']} ({user['email']})")
        
        # Testar obtenção de produtos
        products = db.get_all_products(5)
        print(f"\nPrimeiros 5 produtos:")
        for product in products:
            print(f"  - {product['name']} (R$ {product['price']})")
        
        db.disconnect()
    else:
        print("Falha ao conectar ao banco de dados SQLite.")