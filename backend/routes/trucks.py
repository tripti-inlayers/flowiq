# backend/routes/trucks.py
from fastapi import APIRouter
from pydantic import BaseModel
from db.connection import supabase
from datetime import date
router = APIRouter()
class TruckIn(BaseModel):
    driver_name: str
    from_city: str
    to_city: str
    travel_date: str  # format: YYYY-MM-DD
    capacity_kg: int
    available_kg: int
    trust_score: float = 4.0
    completed_trips:int = 0
@router.post('/')
def post_truck(truck: TruckIn):
    result = supabase.table('trucks').insert(truck.dict()).execute()
    return {'success': True, 'data': result.data}
@router.get('/')
def get_trucks():
    result = supabase.table('trucks').select('*').execute()
    return result.data