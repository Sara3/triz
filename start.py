#!/usr/bin/env python3
"""
Startup script for the Patent Analytics Hub application.
This script starts both the Django backend and React frontend.
"""

import os
import subprocess
import sys
import platform
import threading
import time
import webbrowser
import signal

def is_command_available(command):
    """Check if a command is available in the system."""
    try:
        subprocess.run(
            [command, "--version"], 
            stdout=subprocess.DEVNULL, 
            stderr=subprocess.DEVNULL, 
            check=False
        )
        return True
    except FileNotFoundError:
        return False

def get_python_command():
    """Get the appropriate Python command for the current system."""
    if platform.system() == "Windows":
        # Check if python or python3 is available
        if is_command_available("python"):
            return "python"
        else:
            return "python3"
    else:
        # On Unix-like systems, prefer python3
        if is_command_available("python3"):
            return "python3"
        else:
            return "python"

def get_node_command():
    """Get the appropriate Node command for the current system."""
    return "node"

def find_npm_executable():
    """Find the npm executable path."""
    # Common npm locations on different platforms
    possible_locations = []
    
    if platform.system() == "Windows":
        # Check common installation locations on Windows
        program_files = [
            os.environ.get("PROGRAMFILES", "C:\\Program Files"),
            os.environ.get("PROGRAMFILES(X86)", "C:\\Program Files (x86)"),
            os.path.join(os.environ.get("APPDATA", ""), "npm"),
            os.path.join(os.environ.get("APPDATA", ""), "nvm"),
            os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs")
        ]
        
        for pf in program_files:
            possible_locations.extend([
                os.path.join(pf, "nodejs", "npm.cmd"),
                os.path.join(pf, "nodejs", "npm"),
                os.path.join(pf, "nodejs", "node_modules", "npm", "bin", "npm-cli.js"),
                os.path.join(pf, "Node.js", "npm.cmd"),
                os.path.join(pf, "Node.js", "npm")
            ])
            
        # Check NVM installation
        nvm_dir = os.environ.get("NVM_HOME", os.path.join(os.environ.get("APPDATA", ""), "nvm"))
        if os.path.exists(nvm_dir):
            for item in os.listdir(nvm_dir):
                if os.path.isdir(os.path.join(nvm_dir, item)) and item.startswith("v"):
                    possible_locations.append(os.path.join(nvm_dir, item, "npm.cmd"))
                    possible_locations.append(os.path.join(nvm_dir, item, "npm"))
    else:
        # Unix-like systems
        possible_locations = [
            "/usr/local/bin/npm",
            "/usr/bin/npm",
            os.path.expanduser("~/.nvm/current/bin/npm")
        ]
    
    # Check PATH directories
    for path_dir in os.environ.get("PATH", "").split(os.pathsep):
        if path_dir:
            npm_path = os.path.join(path_dir, "npm.cmd" if platform.system() == "Windows" else "npm")
            possible_locations.append(npm_path)
            npm_path = os.path.join(path_dir, "npm.bat" if platform.system() == "Windows" else "npm")
            possible_locations.append(npm_path)
            npm_path = os.path.join(path_dir, "npm" if platform.system() == "Windows" else "npm")
            possible_locations.append(npm_path)
    
    # Check if any of the possible locations exist
    for location in possible_locations:
        if os.path.exists(location):
            return location
    
    return None

def run_npm_command(cmd_args, cwd=None, shell=True):
    """Run an npm command with the full path to npm."""
    npm_path = find_npm_executable()
    if not npm_path:
        raise FileNotFoundError("npm not found in the system")
    
    full_cmd = [npm_path] + cmd_args
    return subprocess.run(full_cmd, check=True, cwd=cwd, shell=shell)

def start_backend(python_cmd):
    """Start the Django backend server."""
    print("Starting Django backend...")
    
    # Change to the backend directory
    os.chdir(os.path.join(os.getcwd(), "backend"))
    
    # Check if virtual environment exists and activate it
    venv_path = "venv"
    venv_activate_path = os.path.join(venv_path, "Scripts" if platform.system() == "Windows" else "bin", "activate")
    
    if not os.path.exists(venv_path):
        print("Creating virtual environment...")
        subprocess.run([python_cmd, "-m", "venv", venv_path], check=True)
    
    # Activate virtual environment and install dependencies
    activate_cmd = f"source {venv_activate_path}" if platform.system() != "Windows" else f"{venv_activate_path}"
    
    # Install dependencies with pip
    pip_cmd = os.path.join(venv_path, "Scripts" if platform.system() == "Windows" else "bin", "pip")
    subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], check=True)
    
    # Apply migrations and load initial data if needed
    python_venv_cmd = os.path.join(venv_path, "Scripts" if platform.system() == "Windows" else "bin", "python")
    
    # Check if migrations are needed
    subprocess.run([python_venv_cmd, "manage.py", "migrate"], check=True)
    
    # Check if TRIZ data needs to be loaded
    if os.path.exists("create_triz_data.py"):
        subprocess.run([python_venv_cmd, "create_triz_data.py"], check=True)
    
    # Start Django server
    django_process = subprocess.Popen(
        [python_venv_cmd, "manage.py", "runserver"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1
    )
    
    # Go back to the root directory
    os.chdir("..")
    
    return django_process

def start_frontend():
    """Start the React frontend server."""
    print("Starting React frontend...")
    
    # Check if npm is installed
    npm_path = find_npm_executable()
    if not npm_path:
        print("Error: npm is not installed or not in PATH. Please install Node.js and npm.")
        print("Download Node.js from: https://nodejs.org/")
        return None
    
    print(f"Using npm from: {npm_path}")
    
    # Change to the frontend directory
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    os.chdir(frontend_dir)
    
    # Install dependencies if needed
    if not os.path.exists("node_modules"):
        print("Installing frontend dependencies...")
        try:
            run_npm_command(["install"], cwd=frontend_dir)
        except subprocess.CalledProcessError:
            print("Error installing frontend dependencies. Please check npm and Node.js installation.")
            os.chdir("..")
            return None
    
    # Start the Vite dev server
    try:
        if platform.system() == "Windows":
            npm_process = subprocess.Popen(
                [npm_path, "run", "dev"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1,
                shell=True
            )
        else:
            npm_process = subprocess.Popen(
                [npm_path, "run", "dev"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
        
        # Go back to the root directory
        os.chdir("..")
        
        return npm_process
    except Exception as e:
        print(f"Error starting frontend server: {str(e)}")
        os.chdir("..")
        return None

def start_with_docker():
    """Start the application using Docker Compose."""
    print("Starting with Docker Compose...")
    
    # Check if docker-compose.yml exists
    if not os.path.exists("docker-compose.yml"):
        print("Error: docker-compose.yml not found.")
        return False
        
    # Start the application with Docker Compose
    try:
        subprocess.run(["docker-compose", "up", "--build"], check=True)
        return True
    except subprocess.CalledProcessError:
        print("Error starting with Docker Compose.")
        return False

def main():
    """Main function to start the application."""
    # Check if Docker is available
    has_docker = is_command_available("docker")
    has_docker_compose = is_command_available("docker-compose")
    
    # If both Docker and Docker Compose are available, ask if user wants to use Docker
    if has_docker and has_docker_compose:
        choice = input("Docker detected. Do you want to use Docker to run the application? (y/n): ").lower()
        if choice == 'y' or choice == 'yes':
            if start_with_docker():
                return
            print("Falling back to manual startup...")
    
    # Get appropriate commands for the current system
    python_cmd = get_python_command()
    
    # Store processes for cleanup
    processes = []
    
    # Define signal handler for clean termination
    def signal_handler(sig, frame):
        print("\nShutting down servers...")
        for process in processes:
            process.terminate()
        sys.exit(0)
    
    # Set up signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Start backend server
    backend_process = start_backend(python_cmd)
    processes.append(backend_process)
    
    # Wait for backend to start
    print("Waiting for backend to start...")
    time.sleep(3)
    
    # Start frontend server
    frontend_process = start_frontend()
    if frontend_process:
        processes.append(frontend_process)
    else:
        print("Failed to start frontend. Stopping all processes...")
        backend_process.terminate()
        sys.exit(1)
    
    # Wait for frontend to start
    print("Waiting for frontend to start...")
    time.sleep(5)
    
    # Open browser
    webbrowser.open("http://localhost:5173")
    
    print("\nBoth servers are running!")
    print("Frontend: http://localhost:5173")
    print("Backend API: http://localhost:8000/api/")
    print("API Documentation: http://localhost:8000/api/swagger/")
    print("\nPress Ctrl+C to stop all servers.")
    
    # Keep the script running and monitor output
    while True:
        try:
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("Backend server stopped unexpectedly.")
                break
                
            if frontend_process and frontend_process.poll() is not None:
                print("Frontend server stopped unexpectedly.")
                break
                
            # Print backend output
            backend_line = backend_process.stdout.readline()
            if backend_line:
                print(f"[Backend] {backend_line}", end="")
                
            # Print frontend output
            if frontend_process:
                frontend_line = frontend_process.stdout.readline()
                if frontend_line:
                    print(f"[Frontend] {frontend_line}", end="")
                
            time.sleep(0.1)
            
        except KeyboardInterrupt:
            signal_handler(None, None)
            break

if __name__ == "__main__":
    main() 