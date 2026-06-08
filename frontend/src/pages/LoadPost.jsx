import { useState } from 'react';
import { api } from '../utils/api';

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
  };

  const fields = [
    { key: 'business_name', label: 'Business Name', type: 'text' },
    { key: 'from_city', label: 'From City', type: 'text' },
    { key: 'to_city', label: 'To City', type: 'text' },
    { key: 'pickup_date', label: 'Pickup Date', type: 'date' },
    { key: 'weight_kg', label: 'Weight (kg)', type: 'number' },
  ];

  return (
    <div className='max-w-lg mx-auto'>
      <h1 className='text-2xl font-bold text-green-700 mb-6'>
        Post a Load
      </h1>

      {success && (
        <div className='bg-green-100 text-green-800 p-3 rounded mb-4 font-medium'>
          Load posted successfully!
        </div>
      )}

      {fields.map((f) => (
        <div key={f.key} className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {f.label}
          </label>

          <input
            type={f.type}
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
            value={form[f.key]}
            onChange={(e) =>
              setForm({ ...form, [f.key]: e.target.value })
            }
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className='w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700'
      >
        Post Load
      </button>
    </div>
  );
}