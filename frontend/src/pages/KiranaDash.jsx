// src/pages/KiranaDash.jsx
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import AlertCard from '../components/restock/AlertCard';
import ChatInput from '../components/restock/ChatInput';

export default function KiranaDash() {
  // State management for dynamic enterprise supply endpoints
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

  // 1. Fetch all available store hubs on component mount (Step 13)
  useEffect(() => {
    api.getStores()
      .then((data) => {
        setStores(data || []);
        if (data && data.length > 0) {
          setSelectedStore(data[0]); // Baseline fallback to the first operational profile
        }
      })
      .catch((err) => console.error("Error fetching stores list:", err));
  }, []);

  // 2. Sync risk indicators and historical logging streams on hub adjustment (Step 13 & 14)
  useEffect(() => {
    if (!selectedStore) return;

    api.getAlerts(selectedStore.id)
      .then(setAlerts)
      .catch((err) => console.error("Error loading alerts:", err));

    api.getSalesHistory(selectedStore.id)
      .then(setSalesHistory)
      .catch((err) => console.error("Error loading sales history:", err));
  }, [selectedStore]);

  // 3. Process natural language query strings to commit local transaction parameters (Step 14)
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

        // Immediate post-transaction polling sync loop
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

  // 4. Operational Optimization Automated Matching Pipeline Engine (Step 16)
  const handleRequestTruck = async (alertItem) => {
    try {
      const trucks = await api.getTrucksByCity(selectedStore.city);
      const needed_kg = alertItem.suggested_reorder_qty || 100;

      // Filter based on active available space, prioritizing driver quality trust telemetry
      const bestMatch = trucks
        .filter((t) => t.available_kg >= needed_kg)
        .sort((a, b) => b.trust_score - a.trust_score)[0];

      if (!bestMatch) {
        alert(`No available trucks with ${needed_kg}kg capacity departing from ${selectedStore.city} currently.`);
        return;
      }

      await api.createBooking({
        truck_id: bestMatch.id,
        store_id: selectedStore.id,
        booked_kg: needed_kg,
        agreed_rate: Math.round((bestMatch.rate_min + bestMatch.rate_max) / 2),
      });

      alert(`Logistics matched! Booking request generated for ${bestMatch.driver_name}.`);
      
      const updatedAlerts = await api.getAlerts(selectedStore.id);
      setAlerts(updatedAlerts);
    } catch (error) {
      console.error("Booking dispatch pipeline failed:", error);
      alert("Failed to confirm booking request transaction.");
    }
  };

  // Step 20 Metrics Calculation: Grouping risk parameters for multi-tiered priority indicators
  const festivalAlerts = alerts.filter((a) => a.festival_note);
  const uniqueFestivals = [...new Set(alerts.map(a => a.festival_note).filter(Boolean))];

  const criticalCount = alerts.filter(a => (a.days_until_stockout || 0) <= 2).length;
  const warningCount = alerts.filter(a => (a.days_until_stockout || 0) > 2 && (a.days_until_stockout || 0) <= 5).length;
  const standardCount = alerts.filter(a => (a.days_until_stockout || 0) > 5).length;

  return (
    <div className='p-6 max-w-7xl mx-auto font-sans bg-slate-50 min-h-screen'>
      {/* Header Profile Dashboard Switcher Control Block */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-6 bg-white p-4 rounded-xl shadow-sm'>
        <div>
          <h1 className='text-2xl font-black text-teal-700 tracking-tight'>
            Kirana Command Center
          </h1>
          <p className='text-xs text-gray-500 font-medium mt-0.5'>Monitor hyper-local inventory shifts and automate supply routes.</p>
        </div>
        
        <div className='mt-4 md:mt-0'>
          <label className='block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1'>Select Active Store Profile</label>
          <select 
            className='border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 cursor-pointer'
            value={selectedStore?.id || ''}
            onChange={(e) => setSelectedStore(stores.find(s => s.id === e.target.value))}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.store_name} — {s.city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 20: Advanced Dynamic High-Velocity Festival Demand Banner */}
      {festivalAlerts.length > 0 && (
        <div className='bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-sm animate-fadeIn'>
          <div className='flex items-start gap-4'>
            <div className='bg-amber-100 p-2.5 rounded-xl text-2xl shadow-inner'>🎉</div>
            <div>
              <p className='font-extrabold text-amber-950 text-base'>
                High-Velocity Demand Warning: {uniqueFestivals.join(', ') || 'Festival Surge'}
              </p>
              <p className='text-xs text-amber-800 font-medium mt-0.5 max-w-2xl'>
                {festivalAlerts.length} regional product lines have been flagged for accelerated exhaustion cycles due to seasonal buying anomalies. Lock down routing space before freight rates scale.
              </p>
            </div>
          </div>
          <div className='hidden md:block bg-amber-600 text-white font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider'>
            Surge Mode Active
          </div>
        </div>
      )}

      {/* Main Grid Splitting Columns */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Side Container: Logging Terminals and Threat Threshold Lists */}
        <div className='lg:col-span-2 space-y-6'>
          
          {/* Conversational Sales Entry Feed Dashboard Block */}
          <div className='bg-white rounded-2xl p-5 border border-slate-200 shadow-sm'>
            <h2 className='font-bold text-sm uppercase tracking-wider text-slate-500 mb-3'>
              Terminal Log Feed: <span className='text-slate-800 font-extrabold'>{selectedStore?.store_name || 'Awaiting Authorization'}</span>
            </h2>

            <div className='space-y-2 mb-4 h-48 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner'>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <span
                    className={`px-3.5 py-2 rounded-2xl text-xs max-w-xs font-medium shadow-sm transition-all ${
                      m.from === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            <ChatInput onSend={handleSend} />
          </div>

          {/* Pipeline Asset Constraints and Multi-Tiered Urgency Metrics Mapping Area */}
          <div>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3'>
              <h2 className='font-bold text-slate-800 text-base flex items-center gap-2'>
                <span>🚨</span> Real-Time Stockout Risk Audit
              </h2>
              
              {/* Step 20: Explicit Color-Coded Risk Matrix Overview Indicators */}
              {alerts.length > 0 && (
                <div className='flex gap-2 font-mono text-[10px] font-bold'>
                  <span className='bg-rose-100 text-rose-700 px-2 py-1 rounded border border-rose-200'>CRITICAL ({criticalCount})</span>
                  <span className='bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200'>WARNING ({warningCount})</span>
                  <span className='bg-emerald-100 text-emerald-700 px-2 py-1 rounded border border-emerald-200'>STABLE ({standardCount})</span>
                </div>
              )}
            </div>

            {alerts.length === 0 ? (
              <div className='border border-dashed border-slate-200 text-center py-16 rounded-2xl text-slate-400 text-xs font-medium bg-white shadow-sm'>
                All warehouse pipeline distribution pathways currently hold sustainable depth.
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

        {/* Right Sidebar Component: High-Fidelity Logistics Ledger Registry Audit Table */}
        <div className='bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit text-slate-800'>
          <h2 className='font-bold text-sm uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5'>
            <span>📈</span> Audit Ledger Feed
          </h2>
          {salesHistory.length === 0 ? (
            <p className='text-xs text-slate-400 text-center py-10 border border-dashed border-slate-100 rounded-xl bg-slate-50 font-medium'>
              No transaction histories committed to this cluster segment.
            </p>
          ) : (
            <div className='overflow-x-auto rounded-xl border border-slate-100 shadow-inner'>
              <table className='w-full text-[11px] text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50 text-slate-400 font-bold border-b border-slate-200 uppercase tracking-widest text-[9px]'>
                    <th className='p-3'>Commodity</th>
                    <th className='p-3 text-right'>Units</th>
                    <th className='p-3 text-right'>Stamp</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.slice(0, 7).map((sale, idx) => (
                    <tr key={idx} className='border-b border-slate-50 hover:bg-slate-50/80 transition-colors last:border-0 font-medium'>
                      <td className='p-3 font-semibold text-slate-700'>{sale.item}</td>
                      <td className='p-3 text-right font-bold text-slate-900'>{sale.units_sold}</td>
                      <td className='p-3 text-right text-slate-400 font-mono text-[10px]'>
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