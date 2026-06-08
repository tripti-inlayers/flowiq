// src/pages/TruckPost.jsx
import { useState } from 'react';
import { api } from '../utils/api';
export default function TruckPost() {
const [form, setForm] = useState({ driver_name:'', from_city:'', to_city:'',
travel_date:'', capacity_kg:'', available_kg:'' });
const [success, setSuccess] = useState(false);
const handleSubmit = async () => {
await api.postTruck({ ...form, capacity_kg: Number(form.capacity_kg),
available_kg: Number(form.available_kg) });
setSuccess(true);
};
const fields = [
{ key:'driver_name', label:'Driver Name', type:'text' },
{ key:'from_city', label:'From City', type:'text' },
{ key:'to_city', label:'To City', type:'text' },
{ key:'travel_date', label:'Travel Date', type:'date' },
{ key:'capacity_kg', label:'Total Capacity (kg)', type:'number' },
{ key:'available_kg',label:'Available Space (kg)',type:'number' },
];
return (
<div className='max-w-lg mx-auto'>
<h1 className='text-2xl font-bold text-blue-700 mb-6'>Post Your Truck Route</h1>
{success && <div className='bg-green-100 text-green-800 p-3 rounded mb-4 font-medium'>
Route posted successfully!</div>}
{fields.map(f => (
<div key={f.key} className='mb-4'>
<label className='block text-sm font-medium text-gray-700 mb-1'>{f.label}</label>
<input type={f.type}
className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2
focus:ring-blue-500'
value={form[f.key]}
onChange={e => setForm({...form, [f.key]: e.target.value})} />
</div>
))}
<button onClick={handleSubmit}
className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700'>
Post Route
</button>
</div>
);
}