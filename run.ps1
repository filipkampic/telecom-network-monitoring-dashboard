# ./run.ps1
Start-Process powershell -ArgumentList "dotnet run --project TelecomMonitor.Api"
Start-Process powershell -ArgumentList "npm run dev --prefix telecom-dashboard"
