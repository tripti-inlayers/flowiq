// src/pages/Bookings.jsx
import React, { useState, useEffect } from 'react';
import ShipmentTracker from "../components/tracking/ShipmentTracker";
// Import your API utility if preferred, or use fetch directly as per the guide guidelines
// import { getBookings, updateBookingStatus } from '../utils/api'; 
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 17: Official Tailwind status colors from the guide reference
  const STATUS_COLORS = {
    requested: "bg-amber-100 text-amber-800 border border-amber-200",
    accepted: "bg-blue-100 text-blue-800 border border-blue-200",
    in_transit: "bg-purple-100 text-purple-800 border border-purple-200",
    delivered: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-red-100 text-red-800 border border-red-200",
  };

  // Step 17: Defined lifecycle state rules
  const NEXT_STATUS = {
    requested: "accepted",
    accepted: "in_transit",
    in_transit: "delivered",
  };

  // Fetch all bookings on component mount
  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Fallback directly to fetch if your api.js isn't imported globally
      const res = await fetch(`${API_BASE}/bookings`);
      if (!res.ok) throw new Error("Failed to fetch system bookings pipeline data");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Step 17: State lifecycle progression handler
  const advanceStatus = async (bookingId, currentStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;

    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`,{
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (res.ok) {
        // Refresh the dataset inline upon a successful pipeline transition update
        fetchBookings();
      } else {
        alert("Status update failed. Verify backend validation constraints.");
      }
    } catch (err) {
      console.error("Error updating booking transition status workflow:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              📋 Transparent Bookings Tracking
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Audit linehaul distribution records, manage workflow lifecycles, and check capacity allocations.
            </p>
          </div>
          <button 
            onClick={fetchBookings}
            className="text-xs bg-white border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            🔄 Refresh Pipeline
          </button>
        </div>

        {/* Loading and Error Handling views */}
        {loading && (
          <div className="text-center py-12 text-slate-500 text-sm font-medium animate-pulse">
            Loading active cargo booking contracts...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm font-medium">
            ⚠️ <strong>Error loading bookings data pool:</strong> {error}
          </div>
        )}

        {/* Core Bookings Table Block */}
        {!loading && !error && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4">Store / Destination</th>
                    <th className="p-4">Assigned Fleet Driver</th>
                    <th className="p-4 text-right">Payload Weight</th>
                    <th className="p-4 text-right">Agreed Linehaul Rate</th>
                    <th className="p-4 text-center">Lifecycle Status</th>
                    <th className="p-4 text-right">Pipeline Management Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-8 text-slate-400 text-sm font-medium">
                        No logistical bookings recorded in database pipelines yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Store Details Object via DB Foreign Key Relationship Join */}
                        <td className="p-4">
                          <div className="font-bold text-slate-800">
                            {booking.kirana_stores?.store_name || 'Direct Freight Load'}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {booking.kirana_stores?.city ? `${booking.kirana_stores.city}, IN` : 'Linehaul Transit'}
                          </div>
                        </td>

                        {/* Truck Details Object via DB Foreign Key Relationship Join */}
                        <td className="p-4 text-slate-700">
                          <div className="font-semibold text-slate-800">
                            🚛 {booking.trucks?.driver_name || 'Awaiting Allocation'}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Route: {booking.trucks?.from_city || 'N/A'} → {booking.trucks?.to_city || 'N/A'}
                          </div>
                        </td>

                        {/* Weight allocation */}
                        <td className="p-4 text-right font-mono font-medium text-slate-700">
                          {booking.booked_kg?.toLocaleString()} kg
                        </td>

                        {/* Financial Rate settlement valuation */}
                        <td className="p-4 text-right font-mono font-bold text-emerald-700">
                          ₹{booking.agreed_rate}/kg
                        </td>

                        {/* Operational State Status Indicator Tag */}
                        <td className="p-4 text-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm ${STATUS_COLORS[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                            {booking.status}
                          </span>
                        </td>

                        {/* Action buttons allowing manual testing transitions */}
  
                        <td className="p-4 text-right">
                          {booking.status !== "delivered" && booking.status !== "cancelled" ? (
                            <>
                              {booking.status === "in_transit" && (
                              <button
                                onClick={() => setSelectedBooking(booking)}
                                className="mr-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-3.5 rounded-lg transition-colors"
                              >
                                Track
                              </button>
                            )}

                              <button
                                onClick={() => advanceStatus(booking.id, booking.status)}
                                className="text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white py-1.5 px-3.5 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                              >
                                Mark {NEXT_STATUS[booking.status]}
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 italic pr-2">
                              Transaction Concluded
                            </span>
                          )}
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedBooking && (
        <ShipmentTracker
          booking={selectedBooking}
          load={selectedBooking.loads}
          truck={selectedBooking.trucks}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}