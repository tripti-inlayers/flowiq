from fastapi import APIRouter
from db.connection import supabase
from datetime import date

router = APIRouter()

FESTIVAL_SURGES = {
    'Diwali': {'date': '2025-10-20', 'factor': 2.5, 'items': ['Atta 10kg', 'Rice 5kg']},
    'Navratri': {'date': '2025-10-02', 'factor': 1.8, 'items': ['Dahi', 'Sabudana']},
}

def days_until(date_str: str) -> int:
    target = date.fromisoformat(date_str)
    return (target - date.today()).days

@router.get('/{store_id}')
def get_alerts(store_id: str):
    inv = supabase.table('inventory').select('*').eq('store_id', store_id).execute().data
    sales = supabase.table('sales_log').select('*').eq('store_id', store_id).execute().data
    alerts = []

    for item_row in inv:
        item = item_row['item']
        stock = item_row['current_stock']
        
        item_sales = [s['units_sold'] for s in sales if s['item'] == item]
        avg_daily = sum(item_sales) / len(item_sales) if item_sales else 1
        
        surge_factor, festival_note = 1.0, ''
        for fest_name, fest_data in FESTIVAL_SURGES.items():
            d = days_until(fest_data['date'])
            if 0 < d <= 14 and item in fest_data['items']:
                surge_factor = fest_data['factor']
                festival_note = f'{fest_name} in {d} days — demand surge expected'
        
        effective_rate = avg_daily * surge_factor
        days_left = int(stock / effective_rate) if effective_rate > 0 else 999
        
        if days_left <= 5:
            freight = supabase.table('trucks').select('*') \
                .eq('to_city', 'Nagpur').order('trust_score', desc=True) \
                .limit(1).execute().data
                
            alerts.append({
                'item': item, 
                'current_stock': stock,
                'days_left': days_left,
                'suggested_reorder_qty': int(effective_rate * 14),
                'festival_note': festival_note,
                'freight_suggestion': freight[0] if freight else None 
            })
            
    return alerts