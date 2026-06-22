// src/pages/TruckPost.jsx
import { useState } from 'react';
import { api } from '../utils/api';

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Ludhiana",
  "Indore", "Nagpur", "Patna", "Raipur", "Bhopal", "Bilaspur"
];

export default function TruckPost() {
  const [form, setForm] = useState({
    driver_name: '',
    from_city: '',
    to_city: '',
    travel_date: '',
    capacity_kg: '',
    available_kg: '',
    pooling_available: false
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    await api.postTruck({
      ...form,
      capacity_kg: Number(form.capacity_kg),
      available_kg: Number(form.available_kg),
      pooling_available: Boolean(form.pooling_available)
    });
    setSuccess(true);
    setForm({ driver_name: '', from_city: '', to_city: '', travel_date: '', capacity_kg: '', available_kg: '', pooling_available: false });
  };

  return (
    // 🔧 CHANGE 1: Full page wrapper with relative so absolute bg is scoped
    <div className="relative min-h-screen font-sans">

      {/* 🔧 CHANGE 2: Background — truck loading dock, blurred + darkened */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1664910349870-def6b8402912?fm=jpg&q=60&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.45)',
          transform: 'scale(1.05)',
        }}
      />

      {/* 🔧 CHANGE 3: Content above bg */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-12 px-4 pb-12">

        {/* 🔧 CHANGE 4: Page heading outside the card, white text over bg */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
            🚛 Post Your Truck Route
          </h1>
          <p className="text-sm text-white/60 mt-1">
            List your route, capacity, and pooling availability for shippers to find you.
          </p>
        </div>

        {/* 🔧 CHANGE 5: Form card fully opaque white — no glass, full readability */}
        <div className='w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl'>

          {success && (
            <div className='bg-green-100 text-green-800 p-3 rounded-xl mb-4 font-medium border border-green-200'>
              ✅ Route log posted to distribution network successfully!
            </div>
          )}

          <div className='space-y-4 mb-6'>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Driver Name</label>
              <input
                type='text'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={form.driver_name}
                onChange={e => setForm({ ...form, driver_name: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>From City</label>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={form.from_city}
                onChange={e => setForm({ ...form, from_city: e.target.value })}
              >
                <option value="">Select Origin Hub</option>
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>To City</label>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={form.to_city}
                onChange={e => setForm({ ...form, to_city: e.target.value })}
              >
                <option value="">Select Destination Hub</option>
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Travel Date</label>
              <input
                type='date'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={form.travel_date}
                onChange={e => setForm({ ...form, travel_date: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Total Capacity (kg)</label>
                <input
                  type='number'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={form.capacity_kg}
                  onChange={e => setForm({ ...form, capacity_kg: e.target.value })}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Available Space (kg)</label>
                <input
                  type='number'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={form.available_kg}
                  onChange={e => setForm({ ...form, available_kg: e.target.value })}
                />
              </div>
            </div>

            <div className='flex items-center gap-3 pt-2 bg-blue-50 border border-blue-100 rounded-xl p-3'>
              <input
                type='checkbox'
                id='pooling_available'
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                checked={form.pooling_available}
                onChange={e => setForm({ ...form, pooling_available: e.target.checked })}
              />
              <label htmlFor='pooling_available' className='text-sm font-semibold text-slate-700 cursor-pointer select-none'>
                Allow Partial Load Capacity Pooling
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm'
          >
            Post Route
          </button>
        </div>
      </div>
    </div>
  );
}