import os
import sys

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


CURRENT_DIR = os.path.dirname(__file__)
BACKEND_DIR = os.path.join(CURRENT_DIR, "backend")
FRONTEND_DIST_DIR = os.path.join(CURRENT_DIR, "frontend", "dist")
FRONTEND_INDEX_FILE = os.path.join(FRONTEND_DIST_DIR, "index.html")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.main import app as backend_app


app = FastAPI()
app.mount("/api", backend_app)

if os.path.isdir(FRONTEND_DIST_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST_DIR, html=True), name="frontend")


@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    if os.path.isfile(FRONTEND_INDEX_FILE):
        return FileResponse(FRONTEND_INDEX_FILE)

    return {"detail": "Frontend build not found"}
