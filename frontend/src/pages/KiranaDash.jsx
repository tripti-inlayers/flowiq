// src/pages/KiranaDash.jsx

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import AlertCard from '../components/restock/AlertCard';
import ChatInput from '../components/restock/ChatInput';

export default function KiranaDash() {
  const [alerts, setAlerts] = useState([]);

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Welcome! Log your daily sales below. Example: Atta 10kg — sold 3 today",
    },
  ]);

  useEffect(() => {
    api.getAlerts('k1').then(setAlerts);
  }, []);

  const handleSend = async (text) => {
    setMessages((m) => [...m, { from: 'user', text }]);

    // Parse simple format: 'item — sold N'
    const match = text.match(/(.+)\s*[-—]\s*sold\s*(\d+)/i);

    if (match) {
      const [, item, units] = match;

      await api.logSale({
        store_id: 'k1',
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

      const updated = await api.getAlerts('k1');
      setAlerts(updated);
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

  return (
    <div>
      <h1 className='text-2xl font-bold text-teal-700 mb-4'>
        Kirana Dashboard
      </h1>

      {/* Chat Section */}
      <div className='bg-gray-50 rounded-xl p-4 mb-6'>
        <h2 className='font-semibold text-gray-700 mb-3'>
          Log Today&apos;s Sales
        </h2>

        <div className='space-y-2 mb-3 max-h-48 overflow-y-auto'>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <span
                className={`px-3 py-2 rounded-2xl text-sm max-w-xs ${
                  m.from === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border text-gray-700'
                }`}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>

        <ChatInput onSend={handleSend} />
      </div>

      {/* Alerts Section */}
      <h2 className='font-semibold text-gray-700 mb-3'>
        Stockout Alerts
      </h2>

      {alerts.length === 0 && (
        <p className='text-gray-400'>
          No alerts right now.
        </p>
      )}

      {alerts.map((alert, i) => (
        <AlertCard key={i} alert={alert} />
      ))}
    </div>
  );
}