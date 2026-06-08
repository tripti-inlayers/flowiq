# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import trucks, loads, matches, sales, alerts
app = FastAPI(title='FlowIQ API')
# CORS — allows your React frontend (localhost:5173) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-vercel-url.vercel.app"],
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

@app.get('/')
def root():
    return {'message': 'FlowIQ API is running'}