# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/06e563a6-4423-4f38-899e-afc32d8a6bdb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/06e563a6-4423-4f38-899e-afc32d8a6bdb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/06e563a6-4423-4f38-899e-afc32d8a6bdb) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

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
   cd patent-analytics-hub
   npm install
   npm run dev
   ```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

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
