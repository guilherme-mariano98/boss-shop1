# PowerShell script to add firewall rules for BOSS SHOPP servers
Write-Host "Adding firewall rules for BOSS SHOPP servers..."

# Add rule for Django server (port 8000)
New-NetFirewallRule -DisplayName "BOSS SHOPP Django Server" -Direction Inbound -Protocol TCP -LocalPort 8000 -Action Allow
Write-Host "Added rule for Django server (port 8000)"

# Add rule for API server (port 8001)
New-NetFirewallRule -DisplayName "BOSS SHOPP API Server" -Direction Inbound -Protocol TCP -LocalPort 8001 -Action Allow
Write-Host "Added rule for API server (port 8001)"

# Add rule for test server (port 8080)
New-NetFirewallRule -DisplayName "BOSS SHOPP Test Server" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
Write-Host "Added rule for test server (port 8080)"

Write-Host "Firewall rules added successfully!"
Write-Host "You can now access the servers from other computers on the network."