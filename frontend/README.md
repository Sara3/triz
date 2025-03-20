# Patent Analytics Hub - Frontend

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Development](#development)
  - [Running the Application](#running-the-application)
  - [Building for Production](#building-for-production)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Test Structure](#test-structure)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Windows PowerShell Notes](#windows-powershell-notes)

## Overview

The Patent Analytics Hub frontend is a modern React application designed to help users analyze patents using TRIZ methodology. This application provides a comprehensive interface for managing, analyzing, and exploring patents and their technical contradictions.

## Features

- **Patent Management**: Upload, view, and organize patents
- **TRIZ Analysis**: Identify and analyze technical contradictions in patents
- **Contradiction Matrix**: Interactive TRIZ contradiction matrix
- **Analytics Dashboard**: View insights across your patent portfolio
- **Responsive Design**: Optimized for desktop and mobile devices

## Technologies

- **React 18**
- **TypeScript 5**
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Shadcn UI** for pre-built accessible components
- **React Query** for data fetching
- **React Router** for navigation
- **Cypress** for end-to-end testing

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm v7+ or pnpm or yarn

### Installation

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>
cd capstone_v2/frontend

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Adjust the URL if your backend is running on a different host or port.

## Development

### Running the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

## Testing

### Running Tests

```bash
# Run tests in headless mode
npm run cypress:run

# Open Cypress Test Runner UI
npm run cypress:open
```

### Test Structure

Tests are organized in the `cypress/e2e` directory:

- `triz-principles.cy.ts`: Tests for TRIZ principles display
- `backend-integration.cy.ts`: Tests for backend API connectivity

## Project Structure

```
frontend/
├── cypress/                # End-to-end tests
│   ├── e2e/                # Test specifications
│   └── support/            # Test utilities and helpers
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/             # UI components (from shadcn/ui)
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and API services
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── utils.ts        # General utilities
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── search/         # Search pages
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── .env                    # Environment variables
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## API Integration

The application integrates with the backend API through services defined in `src/lib/api.ts`. Key endpoints include:

### TRIZ Data
- `/triz/principles/` - Get all TRIZ principles
- `/triz/parameters/` - Get engineering parameters
- `/triz/matrix/` - Get the contradiction matrix

### Patent Management
- `/patents/` - List and search patents
- `/patents/{id}/` - Get patent details
- `/patents/{id}/analyses/` - Get analyses for a patent

### Patent Analysis
- `/analyze-patent/` - Submit a patent for TRIZ analysis
- `/analyses/` - List all analyses
- `/analyses/{id}/` - Get detailed analysis results

## Troubleshooting

### Common Issues

1. **API Connection Problems**
   - Verify the backend server is running
   - Check that the `VITE_API_BASE_URL` in `.env` is correct
   - Look for CORS errors in the browser console (Network tab)
   - Try accessing the API directly in the browser to confirm it's responding

2. **Build Errors**
   - Make sure all dependencies are installed: `npm install`
   - Clear the node_modules folder and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run tsc`

3. **UI Display Issues**
   - Clear your browser cache and reload
   - Check for CSS conflicts in the browser dev tools
   - Verify that Tailwind is configured correctly

4. **Testing Problems**
   - Make sure the application is running before starting Cypress tests
   - Check Cypress screenshots for visual errors: `cypress/screenshots`
   - Review test videos for interaction issues: `cypress/videos`

## Windows PowerShell Notes

When using Windows PowerShell, command chaining with `&&` is not supported. Instead, run commands sequentially:

```powershell
# Instead of:
cd frontend && npm run dev

# Use separate commands:
cd frontend
npm run dev
```

Alternatively, you can use PowerShell's semicolon operator for command chaining:

```powershell
cd frontend; npm run dev
```
