# Patent Analytics Hub Backend

Flask API server for patent analysis using TRIZ methodology.

## Quick Start

```sh
# Install Python 3.11 from https://www.python.org/downloads/release/python-3116/
# Then create virtual environment with Python 3.11
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Start server
python app.py
```

## Tech Stack

- Python 3.11 (required)
- Flask + Flask-CORS
- python-dotenv
- Type hints

## Environment

Create `.env`:
```env
PORT=5000
FLASK_ENV=development
```

## API Endpoints

### Patents
- `GET /api/patents` - List patents
- `GET /api/patents/<id>` - Patent details
- `GET /api/patents/<id>/citations` - Patent citations

### Analysis
- `POST /api/analyze-patent` - Analyze patent
- `GET /api/analyses` - List analyses
- `GET /api/analyses/<id>` - Analysis details
- `PUT /api/analyses/<id>` - Update analysis
- `DELETE /api/analyses/<id>` - Delete analysis
- `POST /api/analyses/<id>/approve` - Approve analysis

### TRIZ
- `GET /api/triz/principles` - TRIZ principles
- `GET /api/triz/parameters` - Engineering parameters
- `GET /api/triz/matrix` - Contradiction matrix

## Structure

```
backend/
├── api/              # Routes
├── services/         # Business logic
├── utils/           # Utilities
└── app.py           # Entry point
```

## Development

```sh
# Tests
python -m pytest

# Format
black .
flake8
```

## License

MIT License

## Connecting with the Frontend

This backend API is designed to work with the React frontend located in the `/patent-analytics-hub` directory. The API uses Flask-CORS to enable cross-origin requests from the frontend.

### API Architecture

The backend provides a RESTful API with the following structure:

```
/api
├── health                    # Health check endpoint
├── triz/
│   ├── principles            # TRIZ 40 principles
│   ├── parameters            # Engineering parameters
│   └── matrix                # Contradiction matrix
├── patents/
│   ├── /                     # List or create patents
│   ├── /<id>                 # Patent details
│   ├── /<id>/file            # Patent file download
│   ├── /<id>/analyses        # All analyses for a patent
│   └── /<id>/citations       # Patent citations
└── analyses/
    ├── /                     # List all analyses
    ├── /<id>                 # Get, update, or delete analysis
    └── /<id>/approve         # Approve an analysis
```

### Running the Integrated Application

#### Option 1: Using the Start Script (Recommended)

The easiest way to run both frontend and backend together is using the provided start script:

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
   cd patent-analytics-hub
   npm install
   npm run dev
   ```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

### API Testing

You can test the API endpoints using the provided test script:

```bash
# Install requests if not already installed
pip install requests

# Run the test script
python test_triz_api.py
```

This script tests all major API endpoints and verifies their functionality, including:
- Health check
- TRIZ data endpoints (principles, parameters, matrix)
- Patent listing
- Analysis listing

### Troubleshooting

If you encounter CORS errors when the frontend tries to connect to the backend:

1. Verify that Flask-CORS is installed and properly configured in `app.py`
2. Check that the frontend is using the correct API URL (defined in `.env`)
3. Ensure the backend server is running and accessible at the expected URL
4. Check the browser console for specific error messages 