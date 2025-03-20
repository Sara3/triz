# Patent Analytics Hub - Backend API

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Database Setup](#database-setup)
  - [Migrations](#migrations)
  - [Seeding TRIZ Data](#seeding-triz-data)
- [Development](#development)
  - [Running the Server](#running-the-server)
  - [Creating an Admin User](#creating-an-admin-user)
- [API Documentation](#api-documentation)
  - [Core Endpoints](#core-endpoints)
  - [Detailed API Reference](#detailed-api-reference)
- [Project Structure](#project-structure)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Test Coverage](#test-coverage)
- [Integration with Frontend](#integration-with-frontend)
- [Troubleshooting](#troubleshooting)
- [Windows Command Notes](#windows-command-notes)

## Overview

Patent Analytics Hub Backend provides a robust API for patent analysis using TRIZ methodology. It enables users to upload, analyze, and extract technical contradictions from patent documents, leveraging the TRIZ inventive principles to suggest solutions.

## Features

- **Patent Management**: CRUD operations for patents
- **TRIZ Analysis**: Extract technical contradictions from patents
- **TRIZ Knowledge Base**: Comprehensive database of TRIZ principles, parameters, and contradiction matrix
- **Authentication**: Secure API access with token-based authentication
- **Swagger Documentation**: Interactive API documentation

## Tech Stack

- **Python 3.8+**
- **Django 4.2+**
- **Django REST Framework** for API endpoints
- **SQLite** (development) / **PostgreSQL** (production)
- **Swagger/OpenAPI** for API documentation
- **Poetry** (optional) for dependency management

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment tool (venv, virtualenv, or conda)

### Installation

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd capstone_v2/backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the backend directory with the following content:

```
DEBUG=True
SECRET_KEY=your-secure-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

For production environments, update these settings accordingly:

```
DEBUG=False
SECRET_KEY=your-secure-production-key
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgres://user:password@localhost:5432/patent_analytics
```

## Database Setup

### Migrations

Apply database migrations to set up the required tables:

```bash
python manage.py migrate
```

### Seeding TRIZ Data

Populate the database with TRIZ principles, parameters, and contradiction matrix data:

```bash
python create_triz_data.py
```

## Development

### Running the Server

```bash
# Start the development server
python manage.py runserver

# Specify a different port if needed
python manage.py runserver 8080
```

The API will be accessible at http://localhost:8000/api/

### Creating an Admin User

Create a superuser to access the Django admin interface:

```bash
python manage.py createsuperuser
```

Then access the admin interface at http://localhost:8000/admin/

## API Documentation

### Core Endpoints

#### Patents
- `GET /api/patents/` - List patents
- `POST /api/patents/` - Create a new patent
- `GET /api/patents/{id}/` - Retrieve patent details
- `PUT /api/patents/{id}/` - Update a patent
- `DELETE /api/patents/{id}/` - Delete a patent
- `GET /api/patents/{id}/citations/` - List citations for a patent

#### TRIZ
- `GET /api/triz/principles/` - List all TRIZ principles
- `GET /api/triz/principles/{id}/` - Get details for a specific principle
- `GET /api/triz/parameters/` - List all engineering parameters
- `GET /api/triz/matrix/` - Get the full contradiction matrix
- `GET /api/triz/matrix/get_principles/` - Get principles for specific parameters

#### Analysis
- `POST /api/analyze-patent/` - Submit a patent for analysis
- `GET /api/analyses/` - List all analyses
- `GET /api/analyses/{id}/` - Get details for a specific analysis

#### Utility
- `GET /api/health/` - Health check endpoint

### Detailed API Reference

Interactive API documentation is available at:
- Swagger UI: http://localhost:8000/api/swagger/
- ReDoc: http://localhost:8000/api/redoc/

## Project Structure

```
backend/
├── api/                  # Main API app
│   ├── migrations/       # Database migrations
│   ├── models.py         # Data models
│   ├── serializers.py    # API serializers
│   ├── urls.py           # API URL routing
│   └── views.py          # API view logic
├── patent_api/           # Django project settings
│   ├── settings.py       # Django configuration
│   ├── urls.py           # Main URL routing
│   └── wsgi.py           # WSGI configuration
├── patent_analytics/     # Analytics functionality
│   ├── extraction.py     # Contradiction extraction logic
│   └── matrix.py         # TRIZ matrix operations
├── services/             # Business logic services
│   ├── patent_service.py # Patent management service
│   └── analysis_service.py # Analysis service
├── automated_analysis/   # Automated patent analysis
│   ├── analyzer.py       # Patent text analysis
│   └── nlp_utils.py      # NLP utilities
├── utils/                # Utility functions
│   ├── text_processing.py # Text processing utilities
│   └── file_handling.py  # File handling utilities
├── data/                 # Data files
│   ├── triz_principles.json # TRIZ principles data
│   └── contradiction_matrix.json # Matrix data
├── manage.py             # Django command-line utility
├── create_triz_data.py   # Script to seed TRIZ data
└── requirements.txt      # Project dependencies
```

## Testing

### Running Tests

```bash
# Run all tests
python manage.py test

# Run tests for a specific app
python manage.py test api

# Run tests with coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Coverage

Generate a detailed HTML coverage report:

```bash
coverage html
# Then open htmlcov/index.html in your browser
```

## Integration with Frontend

This backend API is designed to work with the React frontend in the `frontend` directory. CORS is configured to allow requests from the frontend development server.

To run the complete application:

1. Start the backend server:
   ```bash
   cd backend
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   python manage.py runserver
   ```

2. In a separate terminal, start the frontend server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **Database Migration Problems**
   - Reset migrations: `python manage.py migrate api zero` then `python manage.py migrate`
   - Delete the db.sqlite3 file and run migrations again
   - Check for model changes that aren't reflected in migrations

2. **API Connection Issues**
   - Verify CORS settings in `settings.py`
   - Check that the server is running on the expected port
   - Ensure API endpoints match what the frontend expects

3. **Data Loading Problems**
   - Run `python create_triz_data.py` to populate TRIZ data
   - Check data file formats in the `data/` directory
   - Verify database connections and permissions

4. **Import Errors**
   - Verify all dependencies are installed: `pip install -r requirements.txt`
   - Check for conflicting package versions
   - Make sure the virtual environment is activated

## Windows Command Notes

When using Windows Command Prompt or PowerShell, use these commands:

```powershell
# Activate virtual environment
venv\Scripts\activate

# Run server
python manage.py runserver
```

For PowerShell, you can chain commands with a semicolon:

```powershell
venv\Scripts\activate; python manage.py runserver
``` 