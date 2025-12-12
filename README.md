# LabeManager - Project Documentation

This project is organized as a monorepo containing both the Frontend and Backend applications.

## Project Structure

```
Projeto-principal/
├── labemanager-frontend/   # React Application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Application Pages
│   │   ├── api/            # API Integration
│   │   └── context/        # State Management (Auth)
│   └── package.json        # Frontend Dependencies & Scripts
│
└── labemanager-backend/    # Node.js Application (Express)
    ├── src/
    │   ├── config/         # Database Configuration
    │   ├── controllers/    # Request Logic (MVC Controller)
    │   ├── models/         # Database Operations (MVC Model)
    │   └── routes/         # API Routes (MVC View/Route)
    ├── data/               # SQLite Database File
    └── server.js           # Entry Point
```

## 🚀 Deployment Guide (GitHub Pages)

The **Frontend** is configured to be deployed to GitHub Pages.
The **Backend** cannot run on GitHub Pages and must be hosted specifically on a backend service (like Render, Railway, or a VPS).

### 1. Preparation
1. Open `labemanager-frontend/package.json`.
2. Update the `"homepage"` field with your GitHub URL:
   ```json
   "homepage": "https://YOUR_USER.github.io/YOUR_REPO_NAME"
   ```

### 2. Deploying the Frontend
Run the following command in the `labemanager-frontend` terminal:
```bash
npm run deploy
```
This will build the project and upload it to the `gh-pages` branch.

### 3. Running Locally
- **Backend:** `cd labemanager-backend` and run `npm start` (Runs on port 9090)
- **Frontend:** `cd labemanager-frontend` and run `npm run dev`

## Database
The SQLite database is located at `labemanager-backend/data/database.sqlite`.
The backend is configured to automatically connect to this file.
