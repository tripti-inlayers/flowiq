// src/components/restock/AlertCard.jsx

import TruckCard from '../freight/TruckCard';

export default function AlertCard({ alert, onRequestTruck }) {
  // Step 20: Upgraded multi-tier urgency color system
  const getUrgencyClasses = (days) => {
    if (days <= 1) return { container: 'bg-red-50 border-red-300', badge: 'bg-red-600' };
    if (days <= 2) return { container: 'bg-orange-50 border-orange-300', badge: 'bg-orange-500' };
    return { container: 'bg-amber-50 border-amber-200', badge: 'bg-amber-500' };
  };

  const colors = getUrgencyClasses(alert.days_left);

  return (
    <div className={`border rounded-xl p-4 mb-4 flex flex-col justify-between shadow-sm ${colors.container}`}>
      <div>
        {/* Card Header: Commodity Name & Days Left Status */}
        <div className='flex justify-between items-center mb-2'>
          <p className='font-bold text-gray-800 text-base tracking-tight'>
            {alert.item}
          </p>

          <span className={`${colors.badge} text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm`}>
            {alert.days_left} days left
          </span>
        </div>

        {/* Inventory On-Hand Specifications */}
        <div className='space-y-0.5 mb-3'>
          <p className='text-sm text-gray-600'>
            Current stock: <span className='font-semibold text-gray-800'>{alert.current_stock} units</span>
          </p>

          <p className='text-sm text-gray-600'>
            Suggested reorder: <span className='font-semibold text-teal-700'>+{alert.suggested_reorder_qty} units</span>
          </p>
        </div>

        {/* Step 20: Conditional Local Festival Surge Note */}
        {alert.festival_note && (
          <div className='bg-amber-100 border border-amber-200 text-amber-900 rounded-lg p-2 mb-3 text-xs font-medium'>
            <strong>⚠️ Demand Surge:</strong> {alert.festival_note}
          </div>
        )}
      </div>

      {/* Step 16: Retained Nested Truck Card Layer with Added Dispatch Action */}
      {alert.freight_suggestion && (
        <div className='mt-2 pt-2 border-t border-gray-200/60'>
          <p className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'>
            Direct Freight Route Match Found
          </p>

          {/* Preserved your original nested child component safely */}
          <div className='mb-3'>
            <TruckCard truck={alert.freight_suggestion} />
          </div>

          {/* The Action Button connecting this card to your backend engine */}
          <button
            onClick={onRequestTruck}
            className='w-full text-xs bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm'
          >
            Request & Book Truck Match
          </button>
        </div>
      )}
    </div>
  );
}