# Player Journey Analytics Architecture

## Overview

Player Journey Analytics is a lightweight full-stack analytics application for visualizing player movement and event patterns across maps and matches. The architecture was intentionally kept simple: a React frontend for interactive visualization, a FastAPI backend for data shaping and API delivery, and a file-based analytics dataset loaded directly into memory for fast read access.

This setup was chosen to optimize for:

- fast iteration during development
- low operational complexity
- simple deployment on free-tier infrastructure
- strong responsiveness for read-heavy visual analytics

## High-Level Architecture

The system is split into two runtime layers:

1. Frontend
   Built with React and Vite in `frontend/`. It handles map rendering, timeline playback, filters, heatmap mode, and match-level event visualization.

2. Backend
   Built with FastAPI in `backend/`. It loads parquet data with Polars, transforms world coordinates into minimap coordinates, and exposes lightweight read APIs for maps, matches, match events, and global heatmap data.

At runtime, the frontend calls the backend over HTTP:

- `GET /api/maps`
- `GET /api/matches?map_id=...`
- `GET /api/match/:match_id`
- `GET /api/global`

## Frontend Design

The frontend is a single-page app optimized for visual exploration rather than heavy client-side business logic.

Why this approach:

- React makes state-driven UI straightforward for filters, playback, and view switching.
- Vite keeps local development fast and deployment simple.
- Most transformation logic stays on the backend, so the client remains focused on rendering and interaction.

The frontend uses a production API base URL via `VITE_API_BASE_URL`, which allows local development to point to localhost while production points to the deployed backend.

## Backend Design

The backend loads all parquet files once at startup, transforms them once, and then serves read-only API responses from memory.

Why this approach:

- The app is analytics-heavy and mostly read-only.
- Preloading the dataset avoids repeated file scans and repeated transformation work per request.
- Polars is a strong fit for columnar analytics workloads and is fast enough for this MVP without adding a database.
- FastAPI provides minimal overhead and clean route structure for a small API surface.

The backend pipeline is:

1. Read parquet files from disk
2. Concatenate into one dataframe
3. Transform and normalize the data
4. Convert world coordinates to minimap coordinates
5. Serve filtered slices through simple API endpoints

This design favors fast API responses over minimal startup time, which is a good tradeoff for this app because users spend most of their time exploring already-loaded data.

## Data Layer

There is no external database in the current architecture. The parquet files act as the source of truth.

Why this approach:

- it removes infrastructure overhead for an MVP
- the dataset is static enough to be loaded at startup
- parquet plus Polars gives good analytical performance with low complexity

Tradeoff:

- startup is heavier than a database-backed API
- memory usage grows with dataset size
- this will need to evolve if the dataset becomes much larger or frequently updated

## Deployment Architecture

The live application is deployed as two Vercel projects:

- frontend: `player-journey-analytics-web.vercel.app`
- backend API: `player-journey-analytics.vercel.app`

Why this split was used:

- the frontend is a clean static Vite deployment and fits Vercel very well
- the backend includes Python analytics dependencies and data-loading behavior that are heavier
- separating the frontend and backend is the most reliable free-tier setup for this project

The backend enables CORS for localhost and the deployed Vercel frontend domains so the browser can call the API safely in both local and production environments.

## Why This Architecture Worked Well

This architecture matched the product well because the app is:

- interaction-heavy on the frontend
- read-heavy on the backend
- based on pre-existing analytics files
- small enough to avoid premature database and microservice complexity

In short, we chose a simple monorepo-style full-stack architecture with a static frontend and a thin analytics API because it delivered the fastest path to a working, deployable visualization product while keeping the codebase understandable and easy to iterate on.

## Future Evolution

If the product grows, the next likely architectural steps would be:

- move dataset storage and query logic into a dedicated database or analytics store
- add caching or pre-aggregated tiles for larger heatmap workloads
- separate backend ingestion from backend serving
- add authentication and user-specific workspaces if multi-user access is needed

For the current scope, though, the existing architecture is intentionally pragmatic and appropriate.
