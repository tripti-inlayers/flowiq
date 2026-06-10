// src/pages/TruckPost.jsx
import { useState } from 'react';
import { api } from '../utils/api';

// Step 19: Official hardcoded Indian cities array validation pool
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
    pooling_available: false // Step 19: Added for mixed-payload capacity pooling tracking
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    // Parsing submission types to explicitly align with database constraints
    await api.postTruck({ 
      ...form, 
      capacity_kg: Number(form.capacity_kg),
      available_kg: Number(form.available_kg),
      pooling_available: Boolean(form.pooling_available)
    });
    setSuccess(true);
    
    // Optional: Reset form to baseline inputs after a successful database submission
    setForm({ driver_name: '', from_city: '', to_city: '', travel_date: '', capacity_kg: '', available_kg: '', pooling_available: false });
  };

  return (
    <div className='max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm'>
      <h1 className='text-2xl font-bold text-blue-700 mb-6'>Post Your Truck Route</h1>
      
      {success && (
        <div className='bg-green-100 text-green-800 p-3 rounded-xl mb-4 font-medium border border-green-200'>
          Route log posted to distribution network successfully!
        </div>
      )}

      <div className='space-y-4 mb-6'>
        {/* Driver Name Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Driver Name</label>
          <input 
            type='text'
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={form.driver_name}
            onChange={e => setForm({...form, driver_name: e.target.value})} 
          />
        </div>

        {/* Step 19: Origin City Dropdown Selection */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>From City</label>
          <select 
            className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={form.from_city}
            onChange={e => setForm({...form, from_city: e.target.value})}
          >
            <option value="">Select Origin Hub</option>
            {INDIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Step 19: Destination City Dropdown Selection */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>To City</label>
          <select 
            className='w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={form.to_city}
            onChange={e => setForm({...form, to_city: e.target.value})}
          >
            <option value="">Select Destination Hub</option>
            {INDIAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Travel Date Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Travel Date</label>
          <input 
            type='date'
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={form.travel_date}
            onChange={e => setForm({...form, travel_date: e.target.value})} 
          />
        </div>

        {/* Total Capacity Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Total Capacity (kg)</label>
          <input 
            type='number'
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={form.capacity_kg}
            onChange={e => setForm({...form, capacity_kg: e.target.value})} 
          />
        </div>

        {/* Available Space Input */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Available Space (kg)</label>
          <input 
            type='number'
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={form.available_kg}
            onChange={e => setForm({...form, available_kg: e.target.value})} 
          />
        </div>

        {/* Step 19: Capacity Pooling Checkbox Toggle */}
        <div className='flex items-center gap-3 pt-2 bg-slate-50 border border-slate-100 rounded-xl p-3'>
          <input 
            type='checkbox'
            id='pooling_available'
            className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
            checked={form.pooling_available}
            onChange={e => setForm({...form, pooling_available: e.target.checked})} 
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
  );
}