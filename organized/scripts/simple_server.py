import socket

# Create a simple socket server
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Bind to all interfaces on port 9001
server_socket.bind(('0.0.0.0', 9001))
server_socket.listen(5)

print("Simple server listening on port 9001")
print("Try accessing from another computer at: http://10.160.216.59:9001")

try:
    while True:
        client_socket, address = server_socket.accept()
        print(f"Connection from {address}")
        
        # Send a simple HTTP response
        response = """HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n
        <html>
        <body>
        <h1>BOSS SHOPP Test Server</h1>
        <p>If you can see this message, network access is working!</p>
        </body>
        </html>
        """
        
        client_socket.send(response.encode())
        client_socket.close()
        
except KeyboardInterrupt:
    print("\nServer stopped")
finally:
    server_socket.close()