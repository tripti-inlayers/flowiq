from fastapi import APIRouter
from db.connection import supabase

router = APIRouter()

@router.get('/')
def get_matches(from_city: str, to_city: str, weight_kg: int = 0):
    # Fetch all trucks going the right direction
    result = supabase.table('trucks') \
        .select('*') \
        .eq('from_city', from_city) \
        .eq('to_city', to_city) \
        .execute()
    trucks = result.data

    # Filter by available space
    matched = [t for t in trucks if t['available_kg'] >= weight_kg]

    # Sort by trust_score descending
    matched.sort(key=lambda t: t['trust_score'], reverse=True)

    # Add fair rate range (simple formula: Rs 1.2 per km per tonne)
    # Calculate estimated shipment cost using rate/kg from database
    for truck in matched:
        truck['estimated_cost_min'] = truck['rate_min'] * weight_kg
        truck['estimated_cost_max'] = truck['rate_max'] * weight_kg

    return matched