import os
import sys
import subprocess

def main():
    # Change to the backend directory
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
    os.chdir(backend_dir)
    
    print("Starting BOSS SHOPP Backend...")
    print("Backend API will be available at: http://127.0.0.1:8000/api/")
    print("Admin panel will be available at: http://127.0.0.1:8000/admin/")
    print("Press Ctrl+C to stop the server")
    
    # Run Django development server
    try:
        subprocess.run([sys.executable, "manage.py", "runserver"], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except subprocess.CalledProcessError as e:
        print(f"Error running server: {e}")

if __name__ == '__main__':
    main()