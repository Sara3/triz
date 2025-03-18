#!/usr/bin/env python
"""
Script to start both the backend API and frontend application.
"""

import os
import subprocess
import sys
import platform
import threading
import time
import webbrowser
import signal

def get_python_cmd():
    """Get the appropriate Python command for the current platform"""
    if platform.system() == "Windows":
        return "python"
    else:
        return "python3"

def get_node_cmd():
    """Get the appropriate Node.js command for the current platform"""
    return "npm"

def run_backend():
    """Start the backend Flask server"""
    print("Starting backend server...")
    backend_dir = os.path.join(os.getcwd(), "backend")
    os.chdir(backend_dir)
    python_cmd = get_python_cmd()
    
    # Check if requirements are installed
    try:
        result = subprocess.run([python_cmd, "-c", "import flask, flask_cors"], 
                                capture_output=True, text=True)
        if result.returncode != 0:
            print("Installing backend dependencies...")
            subprocess.run([python_cmd, "-m", "pip", "install", "-r", "requirements.txt"])
    except Exception as e:
        print(f"Error checking backend dependencies: {e}")
    
    # Start backend
    backend_process = subprocess.Popen([python_cmd, "app.py"])
    print("Backend server started!")
    return backend_process

def run_frontend():
    """Start the frontend development server"""
    print("Starting frontend server...")
    frontend_dir = os.path.join(os.getcwd(), "patent-analytics-hub")
    os.chdir(frontend_dir)
    node_cmd = get_node_cmd()
    
    # Check if node modules are installed
    if not os.path.exists("node_modules"):
        print("Installing frontend dependencies...")
        subprocess.run([node_cmd, "install"])
    
    # Start frontend
    if platform.system() == "Windows":
        frontend_process = subprocess.Popen([node_cmd, "run", "dev"])
    else:
        frontend_process = subprocess.Popen([node_cmd, "run", "dev", "--", "--host"])
    
    print("Frontend server started!")
    return frontend_process

def handle_exit(sig, frame):
    print("\nReceived termination signal. Shutting down servers...")
    # The cleanup will be handled in the main function's finally block
    sys.exit(0)

def main():
    """Main function to run both servers"""
    # Store the original directory
    original_dir = os.getcwd()
    
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)
    
    backend_process = None
    frontend_process = None
    
    try:
        # Check if we're in the correct directory structure
        if not os.path.exists("backend") or not os.path.exists("patent-analytics-hub"):
            print("Error: Cannot find backend or patent-analytics-hub directories.")
            print(f"Current directory: {original_dir}")
            print("Make sure you're running this script from the project root directory.")
            return 1
        
        # Start the backend
        backend_process = run_backend()
        
        # Return to the original directory
        os.chdir(original_dir)
        
        # Wait for the backend to start
        print("Waiting for backend to initialize...")
        time.sleep(3)
        
        # Start the frontend
        frontend_process = run_frontend()
        
        # Open the application in the default browser
        threading.Timer(5, lambda: webbrowser.open("http://localhost:5173")).start()
        
        print("\n=== Patent Analytics Hub ===")
        print("Frontend: http://localhost:5173")
        print("Backend API: http://localhost:5000/api")
        print("\nPress Ctrl+C to stop both servers.")
        
        # Wait for the processes to finish or for the user to interrupt
        while True:
            if backend_process.poll() is not None:
                print("Backend server stopped unexpectedly.")
                break
            if frontend_process.poll() is not None:
                print("Frontend server stopped unexpectedly.")
                break
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nStopping servers...")
    except Exception as e:
        print(f"Error: {e}")
        return 1
    finally:
        # Clean up and return to the original directory
        os.chdir(original_dir)
        
        # Try to terminate all processes
        try:
            if backend_process and backend_process.poll() is None:
                if platform.system() == "Windows":
                    backend_process.terminate()
                else:
                    backend_process.kill()
                print("Backend server stopped.")
                
            if frontend_process and frontend_process.poll() is None:
                if platform.system() == "Windows":
                    frontend_process.terminate()
                else:
                    frontend_process.kill()
                print("Frontend server stopped.")
        except Exception as e:
            print(f"Error stopping servers: {e}")
        
        print("All servers stopped.")
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 