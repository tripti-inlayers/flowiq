// src/pages/Home.jsx
import React from 'react';

export default function Home() {
  const stats = [
    { label: 'Active Kirana Outlets', value: '10 / 10', color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Live Fleet Trucks', value: '24 Operational', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Restocks', value: '7 Critical Alerts', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Booking Rate', value: '94.2%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const navigationHubs = [
    {
      title: '🏪 Kirana Command Center',
      description: 'Monitor hyper-local inventory runout risks, view active festival demand spikes, and instantly request linehaul freight matching.',
      link: '/kirana',
      buttonText: 'Open Dashboard',
      borderColor: 'hover:border-teal-400',
    },
    {
      title: '🚚 Freight Intelligence & Matching',
      description: 'Search available truck capacities, analyze deep cargo manifests, and post live trucks or consumer loads into the system.',
      link: '/matches',
      buttonText: 'Find Matches',
      borderColor: 'hover:border-blue-400',
    },
    {
      title: '📋 Transparent Bookings Tracking',
      description: 'Audit transactional workflow states from "requested" to "accepted" and track cargo distribution lines end-to-end.',
      link: '/bookings',
      buttonText: 'Track Bookings',
      borderColor: 'hover:border-indigo-400',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* 🔧 Hero — image background only here, rest of page stays clean white/slate */}
      <div className="relative py-16 px-6 shadow-md overflow-hidden">

        {/* 🔧 Background image scoped only to the hero */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            filter: 'blur(1.5px) brightness(0.35)',
            transform: 'scale(1.05)',
          }}
        />

        {/* 🔧 Subtle dark overlay for extra text contrast on top of the image */}
        <div className="absolute inset-0 z-0 bg-slate-900/40" />

        {/* Hero content sits above the image */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-3">
            <span className="text-sm bg-teal-500/20 text-teal-300 px-3 py-1 rounded-md border border-teal-500/30 font-mono font-bold tracking-widest">
              FLOWIQ ENGINE
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white drop-shadow-lg">
            Next-Gen Kirana Logistics Platform
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            Automating FMCG distribution pipelines by pairing micro-demand alerts with real-time freight capacities instantly.
          </p>
        </div>
      </div>

      {/* Rest of page — untouched, clean slate-50 background as before */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

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
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {hub.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {hub.description}
                  </p>
                </div>
                <a href={hub.link} className="w-full text-center text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-xl transition-colors shadow-sm">
                  {hub.buttonText}
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}