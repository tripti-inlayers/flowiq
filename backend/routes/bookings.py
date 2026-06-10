from fastapi import APIRouter, Body
from db.connection import supabase

router = APIRouter()

@router.get("/")
def get_bookings():
    result = supabase.table("bookings") \
        .select("*") \
        .execute()

    return result.data

@router.get("/store/{store_id}")
def get_store_bookings(store_id: str):
    result = supabase.table("bookings") \
        .select("*") \
        .eq("store_id", store_id) \
        .execute()

    return result.data

@router.post("/")
def create_booking(booking: dict = Body(...)):
    result = supabase.table("bookings") \
        .insert(booking) \
        .execute()

    return result.data

@router.patch("/{booking_id}")
def update_booking(booking_id: str, data: dict = Body(...)):
    result = (
        supabase.table("bookings")
        .update(data)
        .eq("id", booking_id)
        .execute()
    )

    return result.data