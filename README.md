# BOSS SHOPP E-commerce Project

This is a complete e-commerce solution with a frontend built with HTML/CSS/JavaScript and a backend built with Django.

## Project Structure

```
PI2/
├── backend/                 # Django backend
│   ├── boss_shopp/          # Django project settings
│   ├── api/                 # API application
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   ├── populate_data.py     # Script to populate initial data
│   └── run_server.py        # Convenience script to run the server
├── frontend/                # Frontend HTML/CSS/JS files
│   ├── *.html               # HTML pages
│   ├── *.css                # Stylesheets
│   ├── *.js                 # JavaScript files
│   └── boss-shop-logo.png   # Logo image
├── run_backend.py           # Script to run the Django backend
├── serve_frontend.py        # Script to serve the frontend
└── README.md                # This file
```

## Setup Instructions

### Backend (Django)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install required packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser**:
   ```bash
   python manage.py createsuperuser
   ```
   Or use the default credentials:
   - Username: admin
   - Email: admin@example.com
   - Password: admin123

6. **Populate initial data**:
   ```bash
   python populate_data.py
   ```

7. **Start the development server**:
   ```bash
   python manage.py runserver
   ```

### Frontend

The frontend files are in the `frontend` directory and can be served by any web server or directly opened in a browser.

## Execution Instructions

You can run the backend and frontend separately:

### Running the Backend
```bash
cd backend
python manage.py runserver
```

### Serving the Frontend
```bash
cd frontend
python -m http.server 8080
```

Alternatively, you can use the provided scripts:
- `python run_backend.py` (from the root directory)
- `python serve_frontend.py` (from the root directory)

## Access Points

- **Frontend**: http://localhost:8080/ (when serving frontend)
- **Backend API**: http://127.0.0.1:8000/api/
- **Admin Panel**: http://127.0.0.1:8000/admin/

## Default Admin Credentials

- **Username**: admin
- **Email**: admin@example.com
- **Password**: admin123

## Development

### Backend Development

1. Navigate to the `backend` directory
2. Activate your virtual environment
3. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Development

1. Navigate to the `frontend` directory
2. Open `index.html` in a browser or serve with a local server

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