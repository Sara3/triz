#demo
https://www.loom.com/share/c1b212f82bac472fad5a9fdde88b4872?sid=00b2a523-9c95-4015-8585-39096c97d2fa

# Patent Analytics Hub


A comprehensive tool for patent analysis using TRIZ methodology, allowing users to upload, manage, and analyze patents with innovative problem-solving techniques.

## Project Structure

This project consists of two main components:

- **Frontend** (`/frontend`): A React-based web application built with TypeScript, Vite, and Tailwind CSS.
- **Backend** (`/backend`): A Flask-based RESTful API for processing and analyzing patent data.

## Environment Setup

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
FLASK_ENV=development
DEBUG=True
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///data/patents.db
```

Make sure to replace `your_secret_key_here` with a secure random string.

## Quick Start

The easiest way to run the full application is using the provided start script:

```bash
# From the project root directory
python start_app.py
#should should work but It needs debugging. intead just cd in the files 
```

This script will:
1. Start the backend Flask server
2. Start the frontend development server
3. Open the application in your default browser
4. Handle proper shutdown of both servers when you press Ctrl+C

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Manual Setup

If you prefer to start each component individually:

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Testing

### API Testing

```bash
cd backend
pip install requests
python test_triz_api.py
```

## Features

- **TRIZ Methodology Integration**: Browse and apply the 40 TRIZ principles for innovative problem-solving
- **Patent Management**: Upload, view, and organize patent documents
- **Analysis Tools**: Analyze patents using TRIZ contradiction matrix and engineering parameters
- **Visualization**: Visual representation of patent analyses and relationships

## Core Technologies

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query

### Backend
- Python
- Flask
- Flask-CORS
- SQLite (for development)

## Additional Documentation

- For frontend details, see: [Frontend README](frontend/README.md)
- For backend details, see: [Backend README](backend/README.md)

## License

MIT License 
