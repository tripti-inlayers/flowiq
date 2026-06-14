# backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import trucks, loads, matches, sales, alerts, stores, bookings
from auth import router as auth_router
app = FastAPI(title='FlowIQ API')
# CORS — allows your React frontend (localhost:5173) to talk to this backend

FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
  
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules

app.include_router(trucks.router, prefix="/trucks", tags=["Trucks"])
app.include_router(loads.router, prefix="/loads", tags=["Loads"])
app.include_router(matches.router, prefix="/matches", tags=["Matches"])
app.include_router(sales.router, prefix="/sales", tags=["Sales"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(stores.router, prefix="/stores", tags=["Stores"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])

@app.get('/')
def root():
    return {'message': 'FlowIQ API is running'}