import http.server
import socketserver
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

PORT = 8080
local_ip = get_local_ip()

print(f"Starting test server on {local_ip}:{PORT}")
print(f"Access from this machine: http://localhost:{PORT}")
print(f"Access from other machines: http://{local_ip}:{PORT}")

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Server running at http://0.0.0.0:{PORT}/")
    httpd.serve_forever()