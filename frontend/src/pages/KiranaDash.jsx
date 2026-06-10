// src/pages/KiranaDash.jsx

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import AlertCard from '../components/restock/AlertCard';
import ChatInput from '../components/restock/ChatInput';

export default function KiranaDash() {
  // State management for Phase 4 dynamic endpoints
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Welcome! Log your daily sales below. Example: Atta 10kg — sold 3 today",
    },
  ]);

  // 1. Fetch all available stores on mount (Step 13)
  useEffect(() => {
    api.getStores()
      .then((data) => {
        setStores(data || []);
        if (data && data.length > 0) {
          setSelectedStore(data[0]); // Default to the first store in the system
        }
      })
      .catch((err) => console.error("Error fetching stores list:", err));
  }, []);

  // 2. Sync alerts and sales auditing history when the selected store changes (Step 13 & 14)
  useEffect(() => {
    if (!selectedStore) return;

    api.getAlerts(selectedStore.id)
      .then(setAlerts)
      .catch((err) => console.error("Error loading alerts:", err));

    api.getSalesHistory(selectedStore.id)
      .then(setSalesHistory)
      .catch((err) => console.error("Error loading sales history:", err));
  }, [selectedStore]);

  // 3. Process chat message and log sale dynamically (Step 14)
  const handleSend = async (text) => {
    if (!selectedStore) {
      alert("Please select an active store first.");
      return;
    }

    setMessages((m) => [...m, { from: 'user', text }]);

    const match = text.match(/(.+)\s*[-—]\s*sold\s*(\d+)/i);

    if (match) {
      const [, item, units] = match;

      try {
        // Point to the database UUID of the actively selected store
        await api.logSale({
          store_id: selectedStore.id,
          item: item.trim(),
          units_sold: Number(units),
          sale_date: new Date().toISOString().split('T')[0],
        });

        setMessages((m) => [
          ...m,
          {
            from: 'bot',
            text: `✓ Logged: ${units} units of ${item.trim()} sold today.`,
          },
        ]);

        // Refresh alerts and auditing history instantly
        const updatedAlerts = await api.getAlerts(selectedStore.id);
        setAlerts(updatedAlerts);

        const updatedSales = await api.getSalesHistory(selectedStore.id);
        setSalesHistory(updatedSales);
      } catch (err) {
        console.error("Failed to process transaction:", err);
        setMessages((m) => [...m, { from: 'bot', text: '❌ Error updating transaction history.' }]);
      }
    } else {
      setMessages((m) => [
        ...m,
        {
          from: 'bot',
          text: 'Format: Item name — sold N (e.g. Atta 10kg — sold 3)',
        },
      ]);
    }
  };

  // 4. Automated Logistics Matching Engine (Step 16)
  const handleRequestTruck = async (alertItem) => {
    try {
      // Find matching active trucks departing from this store's city
      const trucks = await api.getTrucksByCity(selectedStore.city);
      const needed_kg = alertItem.suggested_reorder_qty || 100;

      // Filter by remaining physical capacity and prioritize highest trust score
      const bestMatch = trucks
        .filter((t) => t.available_kg >= needed_kg)
        .sort((a, b) => b.trust_score - a.trust_score)[0];

      if (!bestMatch) {
        alert(`No available trucks with ${needed_kg}kg capacity departing from ${selectedStore.city} currently.`);
        return;
      }

      // Submit POST payload to create backend booking entry
      await api.createBooking({
        truck_id: bestMatch.id,
        store_id: selectedStore.id,
        booked_kg: needed_kg,
        agreed_rate: Math.round((bestMatch.rate_min + bestMatch.rate_max) / 2),
      });

      alert(`Logistics matched! Booking request generated for ${bestMatch.driver_name}.`);
      
      // Re-fetch store warnings to update pipeline calculations
      const updatedAlerts = await api.getAlerts(selectedStore.id);
      setAlerts(updatedAlerts);
    } catch (error) {
      console.error("Booking dispatch pipeline failed:", error);
      alert("Failed to confirm booking request transaction.");
    }
  };

  // Extract alerts flag containing regional festival notes (Step 20)
  const festivalAlerts = alerts.filter((a) => a.festival_note);

  return (
    <div className='p-6 max-w-7xl mx-auto font-sans'>
      {/* Header & Store Dropdown Selection Wrapper */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-teal-700'>
            Kirana Command Center
          </h1>
          <p className='text-sm text-gray-500'>Monitor hyper-local inventory shifts and automate supply routes.</p>
        </div>
        
        <div className='mt-4 md:mt-0'>
          <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1'>Select Active Store Profile</label>
          <select 
            className='border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700'
            value={selectedStore?.id || ''}
            onChange={(e) => setSelectedStore(stores.find(s => s.id === e.target.value))}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.store_name} — {s.city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 20: Dynamic Festival Demand Surge System Banner */}
      {festivalAlerts.length > 0 && (
        <div className='bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm'>
          <span className='text-xl'>🎉</span>
          <div>
            <p className='font-bold text-amber-800'>Regional Festival Surge Warning</p>
            <p className='text-sm text-amber-700 mt-0.5'>
              {festivalAlerts.length} high-velocity items are flagged for rapid depletion. Secure freight lines early.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Structure Layout Split */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Side: Sales Chat Box & Alerts Grid */}
        <div className='lg:col-span-2 space-y-6'>
          
          {/* Conversational Sales Logging Workspace */}
          <div className='bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm'>
            <h2 className='font-semibold text-gray-700 mb-3'>
              Quick Log: {selectedStore?.store_name || 'Loading execution schema...'}
            </h2>

            <div className='space-y-2 mb-3 h-48 overflow-y-auto bg-white p-3 rounded-lg border border-gray-100 shadow-inner'>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <span
                    className={`px-3 py-2 rounded-2xl text-sm max-w-xs shadow-sm ${
                      m.from === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-gray-100 border text-gray-700 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            <ChatInput onSend={handleSend} />
          </div>

          {/* Pipeline Warnings Grid Workspace */}
          <div>
            <h2 className='font-semibold text-gray-700 mb-3 flex items-center gap-2'>
              🚨 Active Stockout Risk Alerts
            </h2>

            {alerts.length === 0 ? (
              <div className='border border-dashed border-gray-200 text-center py-12 rounded-xl text-gray-400 text-sm bg-white'>
                All item pipeline streams are well provisioned.
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {alerts.map((alert, i) => (
                  <AlertCard 
                    key={i} 
                    alert={alert} 
                    onRequestTruck={() => handleRequestTruck(alert)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sales Ledger Auditing History Table Sidebar */}
        <div className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-fit'>
          <h2 className='font-semibold text-gray-700 mb-3'>📈 Recent Transactions</h2>
          {salesHistory.length === 0 ? (
            <p className='text-sm text-gray-400 text-center py-8 border border-dashed border-gray-100 rounded-lg bg-gray-50'>
              No items logged for this branch.
            </p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-xs text-left border-collapse'>
                <thead>
                  <tr className='bg-gray-50 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider'>
                    <th className='p-2'>Commodity</th>
                    <th className='p-2 text-right'>Units</th>
                    <th className='p-2 text-right'>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.slice(0, 6).map((sale, idx) => (
                    <tr key={idx} className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
                      <td className='p-2 font-medium text-gray-700'>{sale.item}</td>
                      <td className='p-2 text-right font-bold text-gray-900'>{sale.units_sold}</td>
                      <td className='p-2 text-right text-gray-400'>
                        {new Date(sale.sale_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}