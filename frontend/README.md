# Patent Analytics Hub - Frontend

## Project Overview

This is the frontend application for the Patent Analytics Hub, a comprehensive tool for patent analysis using TRIZ methodology. The application allows users to upload, manage, and analyze patents with innovative problem-solving techniques.

## Technologies Used

- React 
- TypeScript
- Vite
- shadcn/ui
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at http://localhost:5173

## Connecting to the Backend

This frontend application is designed to work with the Flask backend API located in the `/backend` directory. All API communication is handled through the services defined in `src/lib/api.ts`.

### Configuration

The API base URL is configured in the `.env` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

You can modify this setting if your backend is running on a different host or port.

### Running the Full Application

#### Option 1: Using the Start Script (Recommended)

The easiest way to run both frontend and backend is using the provided start script:

```bash
# From the project root directory
python start_app.py
```

This script will:
1. Start the backend Flask server
2. Start the frontend development server
3. Open the application in your default browser
4. Handle proper shutdown of both servers when you press Ctrl+C

#### Option 2: Manual Startup

If you prefer to start each service manually:

1. Start the backend server:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### API Structure

The application connects to the following backend endpoints:

#### TRIZ Data
- `/api/triz/principles` - Get all TRIZ principles
- `/api/triz/parameters` - Get engineering parameters
- `/api/triz/matrix` - Get the contradiction matrix

#### Patent Management
- `/api/patents` - List/search patents
- `/api/patents/:id` - Get patent details
- `/api/patents/:id/file` - Download patent file
- `/api/patents/:id/analyses` - Get analyses for a patent
- `/api/patents/:id/citations` - Get patent citations

#### Patent Analysis
- `/api/analyze-patent` - Analyze a patent using TRIZ
- `/api/analyses` - List all analyses
- `/api/analyses/:id` - Get analysis details

### Testing the API Connection

You can test the API connection using the provided test script:

```bash
cd backend
pip install requests
python test_triz_api.py
```

This will verify that all required API endpoints are working correctly.

project link at lovable[https://lovable.dev/projects/06e563a6-4423-4f38-899e-afc32d8a6bdb]
