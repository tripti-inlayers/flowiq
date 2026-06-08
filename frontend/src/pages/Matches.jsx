// src/pages/Matches.jsx
import { useState } from 'react';
import { api } from '../utils/api';
import TruckCard from '../components/freight/TruckCard';
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
<div className='flex gap-3 mb-6'>
<input placeholder='From City' className='border rounded-lg px-3 py-2 flex-1'
value={from} onChange={e => setFrom(e.target.value)} />
<input placeholder='To City' className='border rounded-lg px-3 py-2 flex-1'
value={to} onChange={e => setTo(e.target.value)} />
<input placeholder='Weight (kg)' type='number' className='border rounded-lg px-3 py-2 w-32'
value={kg} onChange={e => setKg(e.target.value)} />
<button onClick={search}
className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700'>
Search
</button>
</div>
{loading && <p className='text-gray-500'>Finding matches...</p>}
{trucks.map((t, i) => <TruckCard key={i} truck={t} />)}
{!loading && trucks.length === 0 && <p className='text-gray-400 mt-8 text-center'>No matches
found yet.</p>}
</div>
);
}