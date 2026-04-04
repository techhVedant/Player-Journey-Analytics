# Player Journey Analytics

Interactive analytics app for exploring player movement, loot, kills, deaths, and storm events on game maps.

Live app: `https://player-journey-analytics-web.vercel.app/`

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Data processing: Polars
- Data source: local parquet files
- Deployment: Vercel

## Project Structure

- `frontend/` - React app and UI
- `backend/` - FastAPI API and data loading logic
- `architecture.md` - one-page technical architecture note
- `Insights.md` - product and gameplay insights

## How It Works

The frontend shows maps, filters, dots, and heatmaps.

The backend loads parquet files from `backend/data`, transforms coordinates into minimap positions, and serves the data through simple API endpoints.

## Local Setup

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

Use your existing virtual environment or create one inside `backend/`.

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
```

### 3. Start the backend

```bash
cd backend
venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 4. Start the frontend

```bash
cd frontend
npm run dev -- --host 127.0.0.1
```

## Local URLs

- Frontend: `http://127.0.0.1:5173/`
- Backend: `http://127.0.0.1:8000/`

If port `5173` is already in use, Vite will move to the next available port.

## Environment Variables

### Frontend

Used in production:

```env
VITE_API_BASE_URL=https://player-journey-analytics.vercel.app/api
```

Behavior:

- in local development, the app defaults to `http://127.0.0.1:8000`
- in production, it uses `VITE_API_BASE_URL` if provided

### Backend

No custom `.env` file is required right now.

The backend expects the dataset to exist at:

`backend/data`

## API Endpoints

- `GET /maps` - list available maps
- `GET /matches?map_id=...` - list matches for a map
- `GET /match/{match_id}` - get match event data
- `GET /global` - get global heatmap data

When deployed, these are served under `/api`.

## Build Commands

Frontend production build:

```bash
cd frontend
npm run build
```

## Deployment

This app is deployed as two Vercel projects:

- frontend app
- backend API

Why:

- the frontend is a clean static Vite app
- the backend is heavier because it loads Python analytics dependencies and parquet data
- splitting them is the most reliable free deployment setup for this project

## Notes

- Hidden files and minimap assets are skipped during backend data loading
- The backend keeps transformed data in memory after startup for faster reads
- CORS is enabled for localhost and the deployed Vercel frontend
