#!/usr/bin/env python3
"""
API Server for BOSS SHOPP Admin Panel
Connects to SQLite database and provides REST endpoints
"""

import sys
import os
import json
import logging
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sqlite3
from sqlite_database_manager import SQLiteBossShoppDatabase

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_local_ip():
    """Get the local IP address of the machine"""
    try:
        # Connect to a remote server to determine local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

# Adicionar o diretório atual ao path para importar módulos
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

class APIRequestHandler(BaseHTTPRequestHandler):
    """Handler para requisições HTTP da API"""
    
    def __init__(self, *args, **kwargs):
        # Inicializar banco de dados
        self.db = SQLiteBossShoppDatabase()
        super().__init__(*args, **kwargs)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def send_json_response(self, data, status_code=200):
        """Enviar resposta JSON"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def send_error_response(self, message, status_code=400):
        """Enviar resposta de erro"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_response = {'error': message}
        self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Conectar ao banco de dados
        if not self.db.connect():
            self.send_error_response('Falha ao conectar ao banco de dados', 500)
            return
        
        try:
            if path == '/api/stats':
                self.handle_stats_request()
            elif path == '/api/users':
                self.handle_users_request()
            elif path == '/api/products':
                self.handle_products_request()
            elif path == '/api/categories':
                self.handle_categories_request()
            elif path == '/api/orders':
                self.handle_orders_request()
            else:
                self.send_error_response('Endpoint não encontrado', 404)
        finally:
            self.db.disconnect()
    
    def handle_stats_request(self):
        """Handle statistics request"""
        stats = self.db.get_dashboard_stats()
        self.send_json_response(stats)
    
    def handle_users_request(self):
        """Handle users request"""
        # Obter parâmetros da query
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        limit = int(query_params.get('limit', [100])[0])
        
        users = self.db.get_all_users(limit)
        self.send_json_response(users)
    
    def handle_products_request(self):
        """Handle products request"""
        # Obter parâmetros da query
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        limit = int(query_params.get('limit', [100])[0])
        
        products = self.db.get_all_products(limit)
        self.send_json_response(products)
    
    def handle_categories_request(self):
        """Handle categories request"""
        categories = self.db.get_all_categories()
        self.send_json_response(categories)
    
    def handle_orders_request(self):
        """Handle orders request"""
        # Obter parâmetros da query
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)
        limit = int(query_params.get('limit', [100])[0])
        
        orders = self.db.get_all_orders(limit)
        self.send_json_response(orders)
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Conectar ao banco de dados
        if not self.db.connect():
            self.send_error_response('Falha ao conectar ao banco de dados', 500)
            return
        
        try:
            # Ler dados do corpo da requisição
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            if path == '/api/login':
                self.handle_login_request(data)
            else:
                self.send_error_response('Endpoint não encontrado', 404)
        except json.JSONDecodeError:
            self.send_error_response('Dados JSON inválidos', 400)
        except Exception as e:
            logger.error(f"Erro ao processar requisição POST: {e}")
            self.send_error_response('Erro interno do servidor', 500)
        finally:
            self.db.disconnect()
    
    def handle_login_request(self, data):
        """Handle login request"""
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            self.send_error_response('Email e senha são obrigatórios', 400)
            return
        
        user = self.db.authenticate_user(email, password)
        if user:
            # Verificar se é admin
            if user.get('is_admin', 0) != 1:
                self.send_error_response('Acesso negado. Apenas administradores podem acessar.', 403)
                return
            
            response = {
                'success': True,
                'user': user,
                'message': 'Login realizado com sucesso'
            }
            self.send_json_response(response)
        else:
            self.send_error_response('Credenciais inválidas', 401)

def main():
    """Função principal para iniciar o servidor"""
    server_address = ('0.0.0.0', 8001)
    httpd = HTTPServer(server_address, APIRequestHandler)
    
    local_ip = get_local_ip()
    
    logger.info("==================================================")
    logger.info("BOSS SHOPP API SERVER")
    logger.info("==================================================")
    logger.info(f"Servidor iniciado em http://0.0.0.0:8001")
    logger.info("Endpoints disponíveis:")
    logger.info(f"  - http://{local_ip}:8001/api/stats")
    logger.info(f"  - http://{local_ip}:8001/api/users")
    logger.info(f"  - http://{local_ip}:8001/api/products")
    logger.info(f"  - http://{local_ip}:8001/api/categories")
    logger.info(f"  - http://{local_ip}:8001/api/orders")
    logger.info(f"  - http://{local_ip}:8001/api/login")
    logger.info("Pressione Ctrl+C para parar o servidor")
    logger.info("==================================================")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Servidor interrompido pelo usuário")
        httpd.server_close()

if __name__ == '__main__':
    main()