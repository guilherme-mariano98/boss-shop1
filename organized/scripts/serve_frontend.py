import os
import sys
import subprocess
import socket

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

def main():
    # Change to the frontend directory
    frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')
    os.chdir(frontend_dir)
    
    local_ip = get_local_ip()
    
    print("Serving BOSS SHOPP Frontend...")
    print(f"Local access: http://localhost:8000/")
    print(f"Network access: http://{local_ip}:8000/")
    print("Press Ctrl+C to stop the server")
    
    # Use Python's built-in HTTP server, binding to all interfaces to allow external access
    try:
        subprocess.run([sys.executable, "-m", "http.server", "8000", "--bind", "0.0.0.0"], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except subprocess.CalledProcessError as e:
        print(f"Error running server: {e}")

if __name__ == '__main__':
    main()