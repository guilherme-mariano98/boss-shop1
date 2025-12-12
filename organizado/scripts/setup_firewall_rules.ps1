# BOSS SHOPP Firewall Setup Script
# This script adds the necessary firewall rules to allow network access

Write-Host "Setting up firewall rules for BOSS SHOPP..." -ForegroundColor Green

try {
    # Remove any existing rules with the same names
    Get-NetFirewallRule -DisplayName "BOSS SHOPP Django Server" -ErrorAction SilentlyContinue | Remove-NetFirewallRule
    Get-NetFirewallRule -DisplayName "BOSS SHOPP API Server" -ErrorAction SilentlyContinue | Remove-NetFirewallRule
    
    # Add rule for Django server (port 8000)
    New-NetFirewallRule -DisplayName "BOSS SHOPP Django Server" `
                       -Direction Inbound `
                       -Protocol TCP `
                       -LocalPort 8000 `
                       -Action Allow `
                       -Profile Any
    
    Write-Host "Added firewall rule for Django server (port 8000)" -ForegroundColor Yellow
    
    # Add rule for API server (port 8001)
    New-NetFirewallRule -DisplayName "BOSS SHOPP API Server" `
                       -Direction Inbound `
                       -Protocol TCP `
                       -LocalPort 8001 `
                       -Action Allow `
                       -Profile Any
    
    Write-Host "Added firewall rule for API server (port 8001)" -ForegroundColor Yellow
    
    Write-Host "Firewall rules added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You should now be able to access the application from other computers:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://10.160.216.59:8000" -ForegroundColor Cyan
    Write-Host "  API: http://10.160.216.59:8001" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host "Error setting up firewall rules: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to run this script as an administrator." -ForegroundColor Yellow
    Write-Host "Right-click on PowerShell and select 'Run as administrator', then run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}