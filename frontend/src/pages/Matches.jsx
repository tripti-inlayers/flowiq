// src/pages/Matches.jsx
import { useState } from 'react';
import { api } from '../utils/api';
import TruckCard from '../components/freight/TruckCard';

const INDIAN_CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Ludhiana",
  "Indore", "Nagpur", "Patna", "Raipur", "Bhopal", "Bilaspur"
];

function ExpandableTruckRow({ truck }) {
  const [manifest, setManifest] = useState(null);
  const [showManifest, setShowManifest] = useState(false);
  const [loadingManifest, setLoadingManifest] = useState(false);

  const toggleManifest = async () => {
    if (showManifest) {
      setShowManifest(false);
      return;
    }
    setLoadingManifest(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_BASE}/trucks/${truck.id}/manifest`);
      
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
    // 🔧 Cards stay fully opaque white — readable against any background
    <div className='border border-slate-200 rounded-xl p-2 mb-4 bg-white shadow-md hover:border-blue-300 transition-all'>
      <TruckCard truck={truck} />

      <div className='px-4 pb-3 pt-1 flex justify-end border-t border-gray-100 mt-2'>
        <button
          onClick={toggleManifest}
          className='text-xs text-blue-600 font-semibold hover:text-blue-800 underline focus:outline-none'
        >
          {loadingManifest ? "Loading Payload..." : showManifest ? "❌ Hide Cargo Manifest" : "📦 View Cargo Manifest"}
        </button>
      </div>

      {showManifest && (
        <div className='mx-4 mb-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm'>
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
    // 🔧 CHANGE 1: Outer wrapper is position:relative so the fixed bg stays behind
    <div className="relative min-h-screen font-sans">

      {/* 🔧 CHANGE 2: Background — highway/trucking image, blurred + darkened */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.5)',
          transform: 'scale(1.05)',
        }}
      />

      {/* 🔧 CHANGE 3: All content sits above bg via z-10, with generous padding */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto">

        {/* 🔧 CHANGE 4: Page heading on a solid dark pill — pops against the bg */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">
            🚛 Find a Truck
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            Search freight matches by route and weight across India.
          </p>
        </div>

        {/* 🔧 CHANGE 5: Search bar on a solid white card — inputs fully readable */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6 border border-slate-100">
          <div className='flex flex-col sm:flex-row gap-3'>
            <select
              className='border border-slate-200 rounded-lg px-3 py-2 flex-1 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={from}
              onChange={e => setFrom(e.target.value)}
            >
              <option value="">Select From City</option>
              {INDIAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              className='border border-slate-200 rounded-lg px-3 py-2 flex-1 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              className='border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
        </div>

        {/* Loading state */}
        {loading && (
          <p className='text-white/70 text-sm animate-pulse text-center py-4'>
            Finding freight matches...
          </p>
        )}

        {/* 🔧 Truck cards remain fully opaque — no glass, no transparency */}
        <div className="space-y-1">
          {trucks.map((t, i) => (
            <ExpandableTruckRow key={t.id || i} truck={t} />
          ))}
        </div>

        {!loading && trucks.length === 0 && (
          <p className='text-white/50 mt-8 text-center text-sm'>
            No matching freight operations found for this lane routing.
          </p>
        )}

      </div>
    </div>
  );
}