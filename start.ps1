# Patent Analytics Hub Starter Script for Windows
# This script starts both the backend and frontend servers

# Stop on first error
$ErrorActionPreference = "Stop"

Write-Host "=== Starting Patent Analytics Hub ==="

# Function to check if the command exists
function Test-Command {
    param($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try {
        if (Get-Command $command) { return $true }
    } catch {
        return $false
    } finally {
        $ErrorActionPreference = $oldPreference
    }
}

# Check requirements
if (-not (Test-Command python)) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command npm)) {
    Write-Host "Error: npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Start backend server in a new window
Write-Host "Starting backend server..." -ForegroundColor Cyan
$backendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if (Test-Path venv\Scripts\activate) { .\venv\Scripts\activate }; python manage.py runserver" -PassThru

# Start frontend server in a new window
Write-Host "Starting frontend server..." -ForegroundColor Cyan
$frontendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -PassThru

Write-Host "`nServers are starting in separate windows" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:5173"
Write-Host "Backend API will be available at: http://localhost:8000/api"
Write-Host "Swagger docs will be available at: http://localhost:8000/api/swagger/"
Write-Host "`nPress Ctrl+C to stop both servers."

# Wait for user to press Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if either process has exited
        if ($backendWindow.HasExited) {
            Write-Host "Backend server has stopped." -ForegroundColor Yellow
            break
        }
        
        if ($frontendWindow.HasExited) {
            Write-Host "Frontend server has stopped." -ForegroundColor Yellow
            break
        }
    }
} finally {
    # Clean up when user presses Ctrl+C
    if (-not $backendWindow.HasExited) {
        Write-Host "Stopping backend server..." -ForegroundColor Cyan
        Stop-Process -Id $backendWindow.Id -Force
    }
    
    if (-not $frontendWindow.HasExited) {
        Write-Host "Stopping frontend server..." -ForegroundColor Cyan
        Stop-Process -Id $frontendWindow.Id -Force
    }
    
    Write-Host "All servers stopped." -ForegroundColor Green
} 