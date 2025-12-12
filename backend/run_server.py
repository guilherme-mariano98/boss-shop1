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
    subprocess.check_call([sys.executable, "manage.py", "migrate", "--noinput"])

    # Collect static files for production
    print("Collecting static files...")
    try:
        subprocess.check_call([sys.executable, "manage.py", "collectstatic", "--noinput"])
    except Exception as e:
        print(f"Could not collect static files: {e}")
    
    # Create superuser via environment variables (optional)
    print("Ensuring superuser via environment variables...")
    try:
        import django
        django.setup()

        from django.contrib.auth import get_user_model
        User = get_user_model()

        su_username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        su_email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        su_password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if su_username and su_email and su_password:
            if not User.objects.filter(username=su_username).exists():
                User.objects.create_superuser(
                    username=su_username,
                    email=su_email,
                    password=su_password,
                )
                print(f"Superuser '{su_username}' created via env vars")
            else:
                print(f"Superuser '{su_username}' already exists")
        else:
            print("Superuser env vars not provided; skipping auto-creation")
    except Exception as e:
        print(f"Could not ensure superuser: {e}")
    
    # Populate initial data
    print("Populating initial data...")
    try:
        subprocess.check_call([sys.executable, "populate_data.py"])
    except Exception as e:
        print(f"Could not populate data: {e}")
    
    # Run the server using dynamic PORT (Render sets $PORT)
    port = os.environ.get("PORT", "8000")
    use_gunicorn = os.environ.get("USE_GUNICORN", "").lower() in ("1", "true", "yes")

    if use_gunicorn:
        print("Starting Django with gunicorn...")
        try:
            subprocess.check_call(["gunicorn", "boss_shopp.wsgi:application", "--bind", f"0.0.0.0:{port}"])
            return
        except Exception as e:
            print(f"Failed to start with gunicorn, falling back to runserver: {e}")

    print("Starting Django development server...")
    print(f"Access the admin panel at: http://0.0.0.0:{port}/admin/")
    print(f"Access the API at: http://0.0.0.0:{port}/api/")
    subprocess.check_call([sys.executable, "manage.py", "runserver", f"0.0.0.0:{port}"])

if __name__ == '__main__':
    main()
