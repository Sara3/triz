# Patent Analytics Hub

A patent analysis tool using TRIZ methodology to extract technical contradictions and suggest innovative solutions.

## Quick Start

### Using Docker (Recommended)

#### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose installed

#### Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd capstone_v2
   ```

2. Start the application
   ```bash
   docker-compose up
   ```

3. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api/

4. Stop the application
   ```bash
   docker-compose down
   ```

### Manual Setup

If you prefer not to use Docker:

#### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm (must be in your PATH)

#### Windows (PowerShell)
```powershell
.\start.ps1
```

#### macOS/Linux
```bash
./start.sh
```

#### Python (Cross-platform)
```bash
python start.py
```

### Detailed Manual Installation (Windows PowerShell)

For Windows users who prefer to install and run the application manually, follow these step-by-step instructions:

#### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a Python virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```
   .\venv\Scripts\Activate
   ```

4. Install required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Apply database migrations:
   ```
   python manage.py migrate
   ```

6. Start the Django development server:
   ```
   python manage.py runserver
   ```
   
   The backend will be available at http://localhost:8000/api/

#### Frontend Setup

1. Open a new PowerShell window and navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   
   The frontend will be available at http://localhost:5173/

#### Note for PowerShell Users

In PowerShell, you cannot chain commands with `&&` as you would in bash. Instead, run each command separately or use the semicolon `;` to separate commands:

```
cd backend; .\venv\Scripts\Activate; python manage.py runserver
```

## Troubleshooting

### Node.js/npm Issues
If you encounter errors when running `python start.py` related to npm:
1. Ensure Node.js and npm are installed and in your PATH
2. Verify installation by running `npm --version` in your terminal
3. If not installed, download from [nodejs.org](https://nodejs.org/)

### PowerShell Command Chain Issues
If you see errors like `The token '&&' is not a valid statement separator in this version`:
- Use semicolons instead of `&&` to chain commands in PowerShell: `command1; command2`
- Run each command separately

### Docker Issues
If Docker doesn't start:
1. Verify Docker Desktop is running
2. Check Docker Compose is installed with `docker-compose --version`
3. Ensure ports 8000 and 5173 are available

### Django Server Issues
If you encounter errors with the Django server:
1. Check that your virtual environment is activated
2. Ensure all migrations have been applied with `python manage.py migrate`
3. Verify that port 8000 is not already in use

### React Development Server Issues
If you encounter errors with the frontend:
1. Check that all dependencies are installed with `npm install`
2. Clear npm cache with `npm cache clean --force` if needed
3. Verify that port 5173 is not already in use

## Components

- **Backend**: Django REST API for patent management and TRIZ analysis
- **Frontend**: React web application for user interface

### Key Components

#### AnalysisViewer Component

The `AnalysisViewer` component provides a detailed interface for reviewing and editing TRIZ contradictions extracted from patents:

- **Features**:
  - View detailed TRIZ contradictions with improving and worsening parameters
  - Edit contradictions and principles interactively
  - Add new contradictions and principles
  - Review and approve analysis results
  - View detailed information about suggested TRIZ principles

- **Usage**:
  ```jsx
  <AnalysisViewer
    analysis={analysisData}
    patent={patentData}
    onReviewComplete={() => console.log('Analysis reviewed')}
  />
  ```

- **Location**: `frontend/src/components/AnalysisViewer.tsx`

## Project Structure

```
capstone_v2/
├── backend/          # Django backend
├── frontend/         # React frontend
├── docker-compose.yml
└── start scripts
```
