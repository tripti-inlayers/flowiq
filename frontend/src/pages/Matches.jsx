// src/pages/Matches.jsx
import { useState } from 'react';
import { api } from '../utils/api';
import TruckCard from '../components/freight/TruckCard';

// Step 19: Official hardcoded Indian cities array specification
const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", 
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Ludhiana", 
  "Indore", "Nagpur", "Patna", "Raipur", "Bhopal", "Bilaspur"
];

// Inline Wrapper Component to manage expandable manifests per truck card safely
function ExpandableTruckRow({ truck }) {
  const [manifest, setManifest] = useState(null);
  const [showManifest, setShowManifest] = useState(false);
  const [loadingManifest, setLoadingManifest] = useState(false);

  // Step 18: Operational Manifest Fetch Execution Pipeline
  const toggleManifest = async () => {
    if (showManifest) {
      setShowManifest(false);
      return;
    }

    setLoadingManifest(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/trucks/${truck.id}/manifest`);
      if (!res.ok) throw new Error("Manifest not found");
      const data = await res.json();
      setManifest(data);
      setShowManifest(true);
    } catch (err) {
      console.error("Error retrieving cargo details:", err);
    } finally {
      setLoadingManifest(false);
    }
  };

  return (
    <div className='border border-slate-200 rounded-xl p-2 mb-4 bg-white shadow-sm hover:border-blue-300 transition-all'>
      {/* Preserves your original standalone component structure */}
      <TruckCard truck={truck} />
      
      {/* Step 18: Expandable Tray Toggle Bar */}
      <div className='px-4 pb-3 pt-1 flex justify-end border-t border-gray-100 mt-2'>
        <button
          onClick={toggleManifest}
          className='text-xs text-blue-600 font-semibold hover:text-blue-800 underline focus:outline-none'
        >
          {loadingManifest ? "Loading Payload..." : showManifest ? "❌ Hide Cargo Manifest" : "📦 View Cargo Manifest"}
        </button>
      </div>

      {/* Step 18: Detailed manifest tray breakdown */}
      {showManifest && (
        <div className='mx-4 mb-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm animate-fadeIn'>
          <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>
            On-Board Logistics Ledger Manifest:
          </p>
          {manifest && manifest.length > 0 ? (
            <div className='space-y-1.5'>
              {manifest.map((item, idx) => (
                <div key={idx} className='flex justify-between text-xs py-1 border-b border-slate-100 last:border-0 text-gray-700'>
                  <span className='font-medium text-gray-900'>
                    {item.item_name} 
                    <span className='text-[10px] bg-slate-200 px-1.5 py-0.5 rounded ml-1 text-gray-600 uppercase font-mono'>
                      {item.category}
                    </span>
                  </span>
                  <span className='font-mono text-gray-600'>
                    {item.available_qty_kg?.toLocaleString()} kg @ ₹{item.price_per_kg}/kg
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-xs text-gray-400 italic text-center py-1'>
              No items currently loaded on this asset manifest.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Matches() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [kg, setKg] = useState('');
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const results = await api.getMatches(from, to, Number(kg));
    setTrucks(results);
    setLoading(false);
  };

  return (
    <div>
      <h1 className='text-2xl font-bold text-blue-700 mb-6'>Find a Truck</h1>
      
      {/* Search Filtering Action Form */}
      <div className='flex flex-col sm:flex-row gap-3 mb-6'>
        {/* Step 19: Replaced 'From City' text input with hardcoded dropdown selection */}
        <select 
          className='border rounded-lg px-3 py-2 flex-1 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={from} 
          onChange={e => setFrom(e.target.value)}
        >
          <option value="">Select From City</option>
          {INDIAN_CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Step 19: Replaced 'To City' text input with hardcoded dropdown selection */}
        <select 
          className='border rounded-lg px-3 py-2 flex-1 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={to} 
          onChange={e => setTo(e.target.value)}
        >
          <option value="">Select To City</option>
          {INDIAN_CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input 
          placeholder='Weight (kg)' 
          type='number' 
          className='border rounded-lg px-3 py-2 w-full sm:w-32'
          value={kg} 
          onChange={e => setKg(e.target.value)} 
        />
        
        <button 
          onClick={search}
          className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm'
        >
          Search
        </button>
      </div>

      {loading && <p className='text-gray-500 text-sm animate-pulse'>Finding freight matches...</p>}

      {/* Render results with our expandable features attached */}
      <div className="space-y-1">
        {trucks.map((t, i) => (
          <ExpandableTruckRow key={t.id || i} truck={t} />
        ))}
      </div>

      {!loading && trucks.length === 0 && (
        <p className='text-gray-400 mt-8 text-center text-sm'>
          No matching freight operations found for this lane routing.
        </p>
      )}
    </div>
  );
}