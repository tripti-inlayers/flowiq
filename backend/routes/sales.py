from fastapi import APIRouter
from pydantic import BaseModel
from db.connection import supabase

router = APIRouter()

class SaleIn(BaseModel):
    store_id: str
    item: str
    units_sold: int
    sale_date: str  # YYYY-MM-DD

@router.post('/')
def log_sale(sale: SaleIn):
    result = supabase.table('sales_log').insert(sale.dict()).execute()
    return {'success': True, 'data': result.data}

@router.get('/{store_id}')
def get_sales(store_id: str):
    result = supabase.table('sales_log') \
        .select('*') \
        .eq('store_id', store_id) \
        .order('sale_date', desc=True) \
        .execute()
    return result.data