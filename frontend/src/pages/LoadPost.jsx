// src/pages/LoadPost.jsx
import { useState } from 'react';
import { api } from '../utils/api';

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Ludhiana",
  "Indore", "Nagpur", "Patna", "Raipur", "Bhopal", "Bilaspur"
];

export default function LoadPost() {
  const [form, setForm] = useState({
    business_name: '',
    from_city: '',
    to_city: '',
    pickup_date: '',
    weight_kg: '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    await api.postLoad({
      ...form,
      weight_kg: Number(form.weight_kg),
    });
    setSuccess(true);
    setForm({ business_name: '', from_city: '', to_city: '', pickup_date: '', weight_kg: '' });
  };

  return (
    // 🔧 CHANGE 1: Full page wrapper, scopes the absolute background
    <div className="relative min-h-screen font-sans">

      {/* 🔧 CHANGE 2: Cargo/boxes background — blurred and darkened */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.4)',
          transform: 'scale(1.05)',
        }}
      />

      {/* 🔧 CHANGE 3: Content above background */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-12 px-4 pb-12">

        {/* 🔧 CHANGE 4: Heading floats over the bg in white */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg tracking-tight">
            📦 Post a Load
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Tell us what you need to ship — we'll match you with the right truck.
          </p>
        </div>

        {/* 🔧 CHANGE 5: Form card fully opaque — no glass, full readability */}
        <div className='w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl'>

          {success && (
            <div className='bg-green-100 text-green-800 p-3 rounded-xl mb-4 font-medium border border-green-200'>
              ✅ Load posted successfully!
            </div>
          )}

          <div className='space-y-4 mb-6'>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Business Name</label>
              <input
                type='text'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>From City</label>
                <select
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={form.from_city}
                  onChange={(e) => setForm({ ...form, from_city: e.target.value })}
                >
                  <option value="">Origin Hub</option>
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>To City</label>
                <select
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={form.to_city}
                  onChange={(e) => setForm({ ...form, to_city: e.target.value })}
                >
                  <option value="">Destination Hub</option>
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Pickup Date</label>
                <input
                  type='date'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={form.pickup_date}
                  onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Weight (kg)</label>
                <input
                  type='number'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                  value={form.weight_kg}
                  onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                />
              </div>
            </div>

          </div>

          <button
            onClick={handleSubmit}
            className='w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm'
          >
            Post Load
          </button>
        </div>
      </div>
    </div>
  );
}