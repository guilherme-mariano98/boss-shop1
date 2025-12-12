import os
import sys
import subprocess

def main():
    # Change to the backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Set the Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'boss_shopp.settings')
    
    # Check if virtual environment is activated
    if not os.environ.get('VIRTUAL_ENV'):
        print("Warning: Virtual environment not detected. Please activate your virtual environment.")
    
    # Install requirements if not already installed
    try:
        import django
        import rest_framework
        import corsheaders
    except ImportError:
        print("Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Run Django migrations
    print("Running migrations...")
    subprocess.check_call([sys.executable, "manage.py", "makemigrations"])
    subprocess.check_call([sys.executable, "manage.py", "migrate"])
    
    # Create superuser if it doesn't exist
    print("Creating superuser if it doesn't exist...")
    try:
        # Set up Django
        import django
        from django.conf import settings
        django.setup()
        
        # We need to import this after django.setup()
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Check if superuser exists
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
            print("Superuser 'admin' created with password 'admin123'")
        else:
            print("Superuser already exists")
    except Exception as e:
        print(f"Could not create superuser: {e}")
    
    # Populate initial data
    print("Populating initial data...")
    try:
        subprocess.check_call([sys.executable, "populate_data.py"])
    except Exception as e:
        print(f"Could not populate data: {e}")
    
    # Run the server
    print("Starting Django development server...")
    print("Access the admin panel at: http://0.0.0.0:8000/admin/")
    print("Access the API at: http://0.0.0.0:8000/api/")
    subprocess.check_call([sys.executable, "manage.py", "runserver", "0.0.0.0:8000"])

if __name__ == '__main__':
    main()