from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Optional
from db.connection import supabase

router = APIRouter()

class BookingIn(BaseModel):
    truck_id: str
    load_id: Optional[str] = None
    store_id: Optional[str] = None
    booked_kg: float
    agreed_rate: float
 
@router.post("/")
def create_booking(booking: BookingIn):
    truck = supabase.table("trucks") \
        .select("id, available_kg, driver_name") \
        .eq("id", booking.truck_id) \
        .single().execute()
 
    if not truck.data:
        raise HTTPException(status_code=404, detail="Truck not found")
 
    if truck.data["available_kg"] < booking.booked_kg:
        raise HTTPException(
            status_code=400,
            detail=f"Truck only has {truck.data['available_kg']}kg available"
        )
 
    new_booking = {
        "truck_id": booking.truck_id,
        "load_id": booking.load_id,
        "store_id": booking.store_id,
        "status": "requested",
        "booked_kg": booking.booked_kg,
        "agreed_rate": booking.agreed_rate,
    }
    res = supabase.table("bookings").insert(new_booking).execute()
    return {"success": True, "booking": res.data[0]}

@router.get("/")
def get_all_bookings(status: Optional[str] = None):
    query = supabase.table("bookings") \
        .select("*, trucks(driver_name, from_city, to_city), "
                "kirana_stores(store_name, city), "
                "loads(business_name)") \
        .order("booked_at", desc=True)
 
    if status:
        query = query.eq("status", status)
 
    res = query.execute()
    return res.data
 
@router.get("/store/{store_id}")
def get_bookings_by_store(store_id: str):
    res = supabase.table("bookings") \
        .select("*, trucks(driver_name, from_city, to_city, trust_score)") \
        .eq("store_id", store_id) \
        .order("booked_at", desc=True) \
        .execute()
    return res.data

VALID_TRANSITIONS = {
    "requested":  ["accepted", "cancelled"],
    "accepted":   ["in_transit", "cancelled"],
    "in_transit": ["delivered", "cancelled"],
    "delivered":  [],
    "cancelled":  [],
}
 
class StatusUpdate(BaseModel):
    status: str

@router.patch("/{booking_id}")
def update_booking_status(booking_id: str, update: StatusUpdate):
    current = supabase.table("bookings") \
        .select("status").eq("id", booking_id).single().execute()
 
    if not current.data:
        raise HTTPException(status_code=404, detail="Booking not found")
 
    current_status = current.data["status"]
    allowed = VALID_TRANSITIONS.get(current_status, [])
 
    if update.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot transition from '{current_status}' to '{update.status
}'"
        )
 
    update_data = {"status": update.status}
    if update.status == "delivered":
        from datetime import datetime
        update_data["delivered_at"] = datetime.utcnow().isoformat()
 
    res = supabase.table("bookings") \
        .update(update_data).eq("id", booking_id).execute()
    
    if update.status == "accepted":
        booking = supabase.table("bookings") \
            .select("truck_id, booked_kg") \
            .eq("id", booking_id).single().execute()
    
        truck = supabase.table("trucks") \
            .select("available_kg") \
            .eq("id", booking.data["truck_id"]).single().execute()
    
        new_available = truck.data["available_kg"] - booking.data["booked_kg"]
        supabase.table("trucks") \
            .update({"available_kg": int(max(0, new_available))}) \
            .eq("id", booking.data["truck_id"]) \
            .execute()
    
    return res.data[0]