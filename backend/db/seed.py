import os
import sys

# Ensure Python can find the db module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.connection import supabase

def seed_database():
    print("🚀 Starting database seeding...")

    # 1. Clear any existing data to avoid duplicates (Optional but safe for testing)
    print("🧹 Cleaning existing data...")
    supabase.table('sales_log').delete().neq('store_id', '').execute()
    supabase.table('inventory').delete().neq('store_id', '').execute()
    supabase.table('trucks').delete().neq('driver_name', '').execute()

    # 2. Seed Trucks
    print("🚚 Inserting trucks data...")
    trucks_data = [
        {"driver_name": "Suresh Yadav", "from_city": "Mumbai", "to_city": "Nagpur", "travel_date": "2025-01-20", "capacity_kg": 5000, "available_kg": 2000, "trust_score": 4.8, "completed_trips": 124},
        {"driver_name": "Ravi Kumar", "from_city": "Pune", "to_city": "Nagpur", "travel_date": "2025-01-21", "capacity_kg": 3000, "available_kg": 1500, "trust_score": 4.5, "completed_trips": 6},
        {"driver_name": "Amit Singh", "from_city": "Mumbai", "to_city": "Nagpur", "travel_date": "2025-01-22", "capacity_kg": 8000, "available_kg": 3000, "trust_score": 4.2, "completed_trips": 203}
    ]
    supabase.table('trucks').insert(trucks_data).execute()

    # 3. Seed Inventory
    print("📦 Inserting inventory data...")
    inventory_data = [
        {"store_id": "k1", "item": "Atta 10kg", "current_stock": 12},
        {"store_id": "k1", "item": "Rice 5kg", "current_stock": 8},
        {"store_id": "k1", "item": "Toor Dal 1kg", "current_stock": 5},
        {"store_id": "k1", "item": "Sunflower Oil 1L", "current_stock": 15}
    ]
    supabase.table('inventory').insert(inventory_data).execute()

    # 4. Seed Sales Log
    print("📊 Inserting sales log history...")
    sales_data = [
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 2, "sale_date": "2025-01-13"},
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 3, "sale_date": "2025-01-14"},
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 2, "sale_date": "2025-01-15"},
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 3, "sale_date": "2025-01-16"},
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 2, "sale_date": "2025-01-17"},
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 4, "sale_date": "2025-01-18"},
        {"store_id": "k1", "item": "Atta 10kg", "units_sold": 3, "sale_date": "2025-01-19"}
    ]
    supabase.table('sales_log').insert(sales_data).execute()

    print("✅ Database successfully seeded with realistic demo content!")

if __name__ == "__main__":
    seed_database()