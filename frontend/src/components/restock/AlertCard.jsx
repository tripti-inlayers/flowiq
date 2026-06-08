// src/components/restock/AlertCard.jsx

import TruckCard from '../freight/TruckCard';

export default function AlertCard({ alert }) {
  const urgency =
    alert.days_left <= 2
      ? 'bg-red-50 border-red-300'
      : 'bg-amber-50 border-amber-300';

  const badge =
    alert.days_left <= 2
      ? 'bg-red-600'
      : 'bg-amber-500';

  return (
    <div className={`border rounded-xl p-4 mb-4 ${urgency}`}>
      <div className='flex justify-between items-center mb-1'>
        <p className='font-bold text-gray-800 text-base'>
          {alert.item}
        </p>

        <span
          className={`${badge} text-white text-xs px-2 py-1 rounded-full font-bold`}
        >
          {alert.days_left} days left
        </span>
      </div>

      <p className='text-sm text-gray-600'>
        Current stock: {alert.current_stock} units
      </p>

      <p className='text-sm text-gray-600'>
        Suggested reorder: {alert.suggested_reorder_qty} units
      </p>

      {alert.festival_note && (
        <p className='text-xs text-amber-700 mt-1 font-medium'>
          {alert.festival_note}
        </p>
      )}

      {alert.freight_suggestion && (
        <div className='mt-3'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
            Freight Match Found
          </p>

          <TruckCard truck={alert.freight_suggestion} />
        </div>
      )}
    </div>
  );
}