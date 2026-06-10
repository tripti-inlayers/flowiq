from fastapi import APIRouter, Body
from db.connection import supabase

router = APIRouter()

@router.get("/")
def get_stores():
    result = supabase.table("kirana_stores") \
        .select("*") \
        .execute()

    return result.data

@router.get("/{store_id}")
def get_store(store_id: str):
    result = supabase.table("kirana_stores") \
        .select("*") \
        .eq("id", store_id) \
        .execute()

    return result.data

@router.get("/{store_id}/inventory")
def get_inventory(store_id: str):
    result = supabase.table("inventory") \
        .select("*") \
        .eq("store_id", store_id) \
        .execute()

    return result.data

@router.get("/{store_id}/sales")
def get_sales(store_id: str):
    result = supabase.table("sales_log") \
        .select("*") \
        .eq("store_id", store_id) \
        .execute()

    return result.data

@router.post("/{store_id}/sales")
def log_sale(store_id: str, sale: dict = Body(...)):
    sale["store_id"] = store_id

    result = supabase.table("sales_log") \
        .insert(sale) \
        .execute()

    return result.data

@router.get("/{store_id}/alerts")
def get_store_alerts(store_id: str):
    result = (
        supabase.table("inventory")
        .select("*")
        .eq("store_id", store_id)
        .lte("days_left", 2)
        .order("days_left")
        .execute()
    )

    return result.data