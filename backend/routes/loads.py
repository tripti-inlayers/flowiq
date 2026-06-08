from fastapi import APIRouter
from pydantic import BaseModel
from db.connection import supabase

router = APIRouter()

class LoadIn(BaseModel):
    business_name: str
    from_city: str
    to_city: str
    pickup_date: str
    weight_kg: int

@router.post('/')
def post_load(load: LoadIn):
    result = supabase.table('loads').insert(load.dict()).execute()
    return {'success': True, 'data': result.data}

@router.get('/')
def get_loads():
    result = supabase.table('loads').select('*').execute()
    return result.data