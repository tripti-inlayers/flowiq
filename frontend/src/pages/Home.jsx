
// src/pages/Home.jsx
import React from 'react';
// import { getBookings, updateBookingStatus } from '../utils/api';

export default function Home() {
  // Mock metrics to give the app an instant "live enterprise" feel for demos
  const stats = [
    { label: 'Active Kirana Outlets', value: '10 / 10', color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Live Fleet Trucks', value: '24 Operational', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Restocks', value: '7 Critical Alerts', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Booking Rate', value: '94.2%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  // Navigation cards mapping your Phase 4 & 5 architecture
  const navigationHubs = [
    {
      title: '🏪 Kirana Command Center',
      description: 'Monitor hyper-local inventory runout risks, view active festival demand spikes, and instantly request linehaul freight matching.',
      link: '/kirana', // Adjust these paths to match your React Router setup if needed
      buttonText: 'Open Dashboard',
      borderColor: 'hover:border-teal-400',
      // tag: 'Phase 4'
    },
    {
      title: '🚚 Freight Intelligence & Matching',
      description: 'Search available truck capacities, analyze deep cargo manifests, and post live trucks or consumer loads into the system.',
      link: '/matches',
      buttonText: 'Find Matches',
      borderColor: 'hover:border-blue-400',
      // tag: 'Phase 5'
    },
    {
      title: '📋 Transparent Bookings Tracking',
      description: 'Audit transactional workflow states from "requested" to "accepted" and track cargo distribution lines end-to-end.',
      link: '/matches',
      buttonText: 'Track Bookings',
      borderColor: 'hover:border-indigo-400',
      // tag: 'Phase 5'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl bg-teal-500/20 text-teal-400 px-3 py-1 rounded-md border border-teal-500/30 font-mono font-bold text-sm tracking-widest">
              FLOWIQ ENGINE
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Next-Gen Kirana Logistics Platform
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300 leading-relaxed">
            Automating FMCG distribution pipelines by pairing micro-demand alerts with real-time freight capacities instantly.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Real-time System Metrics Row */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            System Infrastructure Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500 tracking-tight">{stat.label}</span>
                <span className={`text-xl font-bold mt-2 ${stat.color} ${stat.bg} px-2.5 py-1 rounded-lg w-fit text-sm`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Navigation Portal Hubs */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Application Portal Gateways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {navigationHubs.map((hub, i) => (
              <div 
                key={i} 
                className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md ${hub.borderColor} border-t-4 border-t-slate-700/20`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {hub.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {hub.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {hub.description}
                  </p>
                </div>

                {/* Using clean standard links - change to <Link to={...}> if using react-router-dom */}
                <a 
                  href={hub.link}
                  className="w-full text-center text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  {hub.buttonText} →
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
