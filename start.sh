#!/bin/bash
# Patent Analytics Hub Starter Script for Unix-like systems
# This script starts both the backend and frontend servers

# Exit on error
set -e

echo "=== Starting Patent Analytics Hub ==="

# Check requirements
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    
    if [ -n "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        echo "Stopping backend server..."
        kill $BACKEND_PID
    fi
    
    if [ -n "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "Stopping frontend server..."
        kill $FRONTEND_PID
    fi
    
    echo "All servers stopped."
    exit 0
}

# Set up trap to clean up processes on exit
trap cleanup EXIT INT TERM

# Start backend server
echo "Starting backend server..."
cd backend

# Activate virtual environment if it exists
if [ -f "venv/bin/activate" ]; then
    echo "Using virtual environment: venv/bin/activate"
    source venv/bin/activate
fi

# Start Django server
python3 manage.py runserver &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Servers are starting in the background"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/api"
echo "Swagger docs: http://localhost:8000/api/swagger/"
echo ""
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait 