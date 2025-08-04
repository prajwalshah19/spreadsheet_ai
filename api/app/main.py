import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import health, generate, reiterate

app = FastAPI(title="AI → Spreadsheet API", version="0.1.0")

WEB_ORIGIN = os.getenv("WEB_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[WEB_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(generate.router)
app.include_router(reiterate.router)

# For quick container health checks
@app.get("/")
def root():
    return {"ok": True, "service": "api"} 