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

## Troubleshooting

### Node.js/npm Issues
If you encounter errors when running `python start.py` related to npm:
1. Ensure Node.js and npm are installed and in your PATH
2. Verify installation by running `npm --version` in your terminal
3. If not installed, download from [nodejs.org](https://nodejs.org/)

### Docker Issues
If Docker doesn't start:
1. Verify Docker Desktop is running
2. Check Docker Compose is installed with `docker-compose --version`
3. Ensure ports 8000 and 5173 are available

## Components

- **Backend**: Django REST API for patent management and TRIZ analysis
- **Frontend**: React web application for user interface

## Project Structure

```
capstone_v2/
├── backend/          # Django backend
├── frontend/         # React frontend
├── docker-compose.yml
└── start scripts
```
