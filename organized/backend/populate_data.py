import os
import django

# Set up Django environment
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'boss_shopp.settings')
django.setup()

from api.models import Category, Product

def populate_categories():
    categories_data = [
        {'name': 'Moda', 'slug': 'moda', 'description': 'Roupas e acessórios'},
        {'name': 'Eletrônicos', 'slug': 'eletronicos', 'description': 'Dispositivos eletrônicos'},
        {'name': 'Casa', 'slug': 'casa', 'description': 'Produtos para o lar'},
        {'name': 'Games', 'slug': 'games', 'description': 'Jogos e acessórios'},
        {'name': 'Esportes', 'slug': 'esportes', 'description': 'Equipamentos esportivos'},
        {'name': 'Infantil', 'slug': 'infantil', 'description': 'Produtos para crianças'},
    ]
    
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"Created category: {category.name}")
        else:
            print(f"Category already exists: {category.name}")

def populate_products():
    # Get categories
    moda = Category.objects.get(slug='moda')
    eletronicos = Category.objects.get(slug='eletronicos')
    casa = Category.objects.get(slug='casa')
    games = Category.objects.get(slug='games')
    esportes = Category.objects.get(slug='esportes')
    infantil = Category.objects.get(slug='infantil')
    
    products_data = [
        # Moda
        {'name': 'Camiseta Básica', 'description': 'Camiseta de algodão 100%', 'price': 39.90, 'category': moda},
        {'name': 'Calça Jeans', 'description': 'Calça jeans masculina', 'price': 89.90, 'category': moda},
        {'name': 'Tênis Esportivo', 'description': 'Tênis para corrida', 'price': 169.90, 'category': moda},
        {'name': 'Boné Estiloso', 'description': 'Boné com proteção UV', 'price': 34.90, 'category': moda},
        
        # Eletrônicos
        {'name': 'Smartphone Premium', 'description': 'Smartphone com câmera de 108MP', 'price': 1760.00, 'category': eletronicos},
        {'name': 'Notebook Ultrafino', 'description': 'Notebook com processador i7', 'price': 2975.00, 'category': eletronicos},
        {'name': 'Fone Bluetooth Sem Fio', 'description': 'Fone com cancelamento de ruído', 'price': 224.90, 'category': eletronicos},
        {'name': 'Smart TV 55"', 'description': 'TV 4K com HDR', 'price': 1750.00, 'category': eletronicos},
        
        # Casa
        {'name': 'Sofá Confortável', 'description': 'Sofá de 3 lugares', 'price': 1020.00, 'category': casa},
        {'name': 'Cama Queen Size', 'description': 'Cama com headboard', 'price': 899.90, 'category': casa},
        {'name': 'Jogo de Talheres', 'description': 'Talheres em aço inoxidável', 'price': 159.90, 'category': casa},
        {'name': 'Kit de Lâmpadas LED', 'description': 'Lâmpadas LED econômicas', 'price': 97.40, 'category': casa},
        
        # Games
        {'name': 'Console de Videogame', 'description': 'Console de última geração', 'price': 2250.00, 'category': games},
        {'name': 'Jogo de Tabuleiro', 'description': 'Jogo estratégico para toda família', 'price': 89.90, 'category': games},
        {'name': 'Fone Gamer', 'description': 'Fone com som surround 7.1', 'price': 299.90, 'category': games},
        {'name': 'Teclado Mecânico', 'description': 'Teclado RGB com switches blue', 'price': 319.90, 'category': games},
        
        # Esportes
        {'name': 'Conjunto de Halteres', 'description': 'Halteres ajustáveis de 5 a 25kg', 'price': 254.90, 'category': esportes},
        {'name': 'Tênis para Corrida', 'description': 'Tênis com amortecimento especial', 'price': 199.90, 'category': esportes},
        {'name': 'Bola de Futebol', 'description': 'Bola oficial com certificação', 'price': 74.90, 'category': esportes},
        {'name': 'Bicicleta Mountain Bike', 'description': 'Bicicleta para trilhas', 'price': 1299.90, 'category': esportes},
        
        # Infantil
        {'name': 'Camiseta Infantil', 'description': 'Camiseta 100% algodão', 'price': 33.90, 'category': infantil},
        {'name': 'Meias Coloridas', 'description': 'Pacote com 5 pares de meias', 'price': 19.90, 'category': infantil},
        {'name': 'Sapatilha Infantil', 'description': 'Sapatilha para festas', 'price': 47.90, 'category': infantil},
        {'name': 'Carrinho de Controle Remoto', 'description': 'Carrinho com controle remoto', 'price': 89.90, 'category': infantil},
    ]
    
    for prod_data in products_data:
        product, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults=prod_data
        )
        if created:
            print(f"Created product: {product.name}")
        else:
            print(f"Product already exists: {product.name}")

if __name__ == '__main__':
    print("Populating categories...")
    populate_categories()
    
    print("\nPopulating products...")
    populate_products()
    
    print("\nData population completed!")