/**
 * This script runs the backend Django server and the frontend Vite server
 * for end-to-end testing with Cypress
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import waitOn from 'wait-on';
import treeKill from 'tree-kill';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BACKEND_PORT = 8000;
const FRONTEND_PORT = 5173;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;

// Store process references
let backendProcess = null;
let frontendProcess = null;

/**
 * Start the Django backend server
 */
function startBackend() {
  console.log('Starting Django backend server...');
  
  // Path to the backend directory from the project root
  const backendDir = join(__dirname, '../../../backend');
  
  // Activate virtual environment and start Django
  // Adapt these commands for Windows if needed
  const isWindows = process.platform === 'win32';
  let activateVenv;
  
  if (isWindows) {
    activateVenv = spawn('cmd.exe', ['/c', join(backendDir, 'venv/Scripts/activate.bat'), '&&', 
      'python', 'manage.py', 'runserver', `${BACKEND_PORT}`], 
      { cwd: backendDir, shell: true, stdio: 'inherit' });
  } else {
    activateVenv = spawn('sh', ['-c', `source venv/bin/activate && python manage.py runserver ${BACKEND_PORT}`], 
      { cwd: backendDir, shell: true, stdio: 'inherit' });
  }

  backendProcess = activateVenv;
  
  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
    cleanup();
    process.exit(1);
  });
}

/**
 * Start the frontend Vite development server
 */
function startFrontend() {
  console.log('Starting Vite frontend server...');
  
  // Path to the frontend directory from the project root
  const frontendDir = join(__dirname, '../../');
  
  // Start Vite
  frontendProcess = spawn('npm', ['run', 'dev'], 
    { cwd: frontendDir, shell: true, stdio: 'inherit' });
  
  frontendProcess.on('error', (err) => {
    console.error('Failed to start frontend:', err);
    cleanup();
    process.exit(1);
  });
}

/**
 * Run Cypress end-to-end tests
 */
async function runCypressTests() {
  console.log('Running Cypress tests...');
  
  const frontendDir = join(__dirname, '../../');
  const cypress = spawn('npx', ['cypress', 'run'], 
    { cwd: frontendDir, shell: true, stdio: 'inherit' });
  
  return new Promise((resolve, reject) => {
    cypress.on('exit', (code) => {
      resolve(code);
    });
    
    cypress.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Clean up all processes
 */
function cleanup() {
  console.log('Cleaning up processes...');
  
  if (backendProcess) {
    treeKill(backendProcess.pid);
  }
  
  if (frontendProcess) {
    treeKill(frontendProcess.pid);
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Start servers
    startBackend();
    startFrontend();
    
    // Wait for servers to be available
    console.log('Waiting for servers to start...');
    await waitOn({
      resources: [
        `${BACKEND_URL}/admin/`,
        `${FRONTEND_URL}/`
      ],
      timeout: 60000, // 60 seconds timeout
    });
    
    console.log('Both servers are running!');
    
    // Run Cypress tests
    const exitCode = await runCypressTests();
    
    // Clean up and exit with the same code
    cleanup();
    process.exit(exitCode);
    
  } catch (error) {
    console.error('Error during test execution:', error);
    cleanup();
    process.exit(1);
  }
}

// Handle process exit signals
process.on('SIGINT', () => {
  console.log('Received SIGINT signal');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal');
  cleanup();
  process.exit(0);
});

// Run the main function
main(); 