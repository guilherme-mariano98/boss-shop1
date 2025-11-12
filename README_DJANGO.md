# BOSS SHOPP Django Backend

This is the Django backend for the BOSS SHOPP e-commerce site.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Setup Instructions

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Install required packages**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the setup script**:
   ```bash
   python run_server.py
   ```

   This script will:
   - Run Django migrations
   - Create a superuser (admin/admin123)
   - Populate the database with initial data
   - Start the development server

## Manual Setup (Alternative)

If you prefer to set up manually:

1. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Create a superuser**:
   ```bash
   python manage.py createsuperuser
   ```

3. **Populate initial data**:
   ```bash
   python populate_data.py
   ```

4. **Run the development server**:
   ```bash
   python manage.py runserver
   ```

## Access Points

- **Admin Panel**: http://127.0.0.1:8000/admin/
- **API Endpoints**: http://127.0.0.1:8000/api/

## API Endpoints

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `GET /api/categories/` - List all categories
- `GET /api/products/` - List all products (with optional `?category=slug` filter)
- `GET /api/products/{id}/` - Get product details
- `GET /api/orders/` - List user orders (requires authentication)
- `POST /api/orders/` - Create new order (requires authentication)
- `GET /api/orders/{id}/` - Get order details (requires authentication)
- `GET /api/profile/` - Get user profile (requires authentication)
- `PUT /api/profile/` - Update user profile (requires authentication)

## Default Admin Credentials

- **Username**: admin
- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

```
boss_shopp/
├── api/                 # Main API application
│   ├── models.py        # Database models
│   ├── serializers.py   # Data serializers
│   ├── views.py         # API views
│   ├── urls.py          # API URL routing
│   └── admin.py         # Admin panel configuration
├── boss_shopp/          # Django project settings
│   ├── settings.py      # Project settings
│   ├── urls.py          # Main URL routing
│   └── wsgi.py          # WSGI configuration
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
├── populate_data.py     # Script to populate initial data
└── run_server.py        # Convenience script to run the server
```