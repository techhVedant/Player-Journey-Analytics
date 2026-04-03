from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import matches

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://player-journey-analytics-web.vercel.app",
        "https://player-journey-analytics.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(matches.router)

from app.routes.matches import df

@app.get("/debug")
def debug():
    try:
        if df is None:
            return {"status": "df is None"}
        return {
            "rows": df.shape[0],
            "columns": df.columns if not df.is_empty() else []
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"status": "Backend is running"}
