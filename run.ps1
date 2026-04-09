# ./run.ps1
Write-Host "Starting TelecomMonitor solution..." -ForegroundColor Cyan

# Start API
Write-Host "Starting API..." -ForegroundColor Yellow
$api = Start-Process powershell -ArgumentList "dotnet run --project ./TelecomMonitor.Api" -PassThru

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList "npm run dev --prefix ./telecom-monitor-frontend" -PassThru

# Start Simulator
Write-Host "Starting Simulator..." -ForegroundColor Yellow
$sim = Start-Process powershell -ArgumentList "dotnet run --project ./TelecomMonitor.Simulator" -PassThru

Write-Host "`nAll services started." -ForegroundColor Green
Write-Host "API PID: $($api.Id)"
Write-Host "Frontend PID: $($frontend.Id)"
Write-Host "Simulator PID: $($sim.Id)"

Write-Host "`nPress ENTER to stop everything..."
Read-Host

# Stop processes
Write-Host "Stopping processes..." -ForegroundColor Red
Stop-Process -Id $api.Id -Force
Stop-Process -Id $frontend.Id -Force
Stop-Process -Id $sim.Id -Force

Write-Host "All processes stopped." -ForegroundColor Green
