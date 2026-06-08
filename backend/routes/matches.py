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
    for truck in matched:
        base_rate = weight_kg * 1.2 * 800  # 800km avg for demo
        truck['rate_min'] = int(base_rate * 0.9)
        truck['rate_max'] = int(base_rate * 1.1)
        truck['pooling_available'] = truck['available_kg'] > weight_kg * 2

    return matched