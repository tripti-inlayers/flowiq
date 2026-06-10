export default function TruckCard({ truck }) {
  const stars =
    '★'.repeat(Math.round(truck.trust_score)) +
    '☆'.repeat(5 - Math.round(truck.trust_score));

  return (
    <div className='border border-gray-200 rounded-xl p-4 mb-3 bg-white shadow-sm'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='font-bold text-gray-800 text-lg'>
            {truck.driver_name}
          </p>

          <p className='text-gray-500 text-sm'>
            {truck.from_city} → {truck.to_city}
          </p>

          <p className='text-gray-500 text-sm'>
            Date: {truck.travel_date}
          </p>
        </div>

        <div className='text-right'>
          <p className='text-yellow-500 text-lg'>{stars}</p>

          <p className='text-xs text-gray-400'>
            {truck.completed_trips} trips
          </p>
        </div>
      </div>

      <div className='flex gap-4 mt-3 text-sm'>
        <span className='bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium'>
          {truck.available_kg} kg available
        </span>

        {truck.estimated_cost_min && (
          <span className='bg-green-50 text-green-700 px-2 py-1 rounded font-medium'>
            ₹{truck.estimated_cost_min}–₹{truck.estimated_cost_max}
          </span>
          )}

        {truck.pooling_available && (
          <span className='bg-amber-50 text-amber-700 px-2 py-1 rounded font-medium'>
            Partial load available
          </span>
        )}
      </div>

      <button className='mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700'>
        Request this truck
      </button>
    </div>
  );
}