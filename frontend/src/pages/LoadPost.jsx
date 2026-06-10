// src/pages/LoadPost.jsx
import { useState } from 'react';
import { api } from '../utils/api';

// Step 19: Official hardcoded Indian cities array validation pool
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
    // Keeps your exact backend pipeline submission format
    await api.postLoad({
      ...form,
      weight_kg: Number(form.weight_kg),
    });

    setSuccess(true);
    // Optional: Resets forms to default blank values after a clean database insert
    setForm({ business_name: '', from_city: '', to_city: '', pickup_date: '', weight_kg: '' });
  };

  return (
    <div className='max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
      <h1 className='text-2xl font-bold text-green-700 mb-6'>
        Post a Load
      </h1>

      {success && (
        <div className='bg-green-100 text-green-800 p-3 rounded-xl mb-4 font-medium border border-green-200'>
          Load posted successfully!
        </div>
      )}

      <div className='space-y-4 mb-6'>
        {/* Business Name Input Row */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Business Name</label>
          <input
            type='text'
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
          />
        </div>

        {/* Step 19: Origin City Select Dropdown Component */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>From City</label>
          <select
            className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500'
            value={form.from_city}
            onChange={(e) => setForm({ ...form, from_city: e.target.value })}
          >
            <option value="">Select Origin Hub</option>
            {INDIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Step 19: Destination City Select Dropdown Component */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>To City</label>
          <select
            className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500'
            value={form.to_city}
            onChange={(e) => setForm({ ...form, to_city: e.target.value })}
          >
            <option value="">Select Destination Hub</option>
            {INDIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Pickup Date Input Row */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Pickup Date</label>
          <input
            type='date'
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
            value={form.pickup_date}
            onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
          />
        </div>

        {/* Weight Cargo Input Row */}
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

      <button
        onClick={handleSubmit}
        className='w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-sm'
      >
        Post Load
      </button>
    </div>
  );
}