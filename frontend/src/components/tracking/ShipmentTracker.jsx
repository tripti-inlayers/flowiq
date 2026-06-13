// src/components/tracking/ShipmentTracker.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Full shipment tracking panel.
// Props:
//   booking   — booking row  { id, status, booked_kg, agreed_rate, truck_id, load_id }
//   load      — load row     { from_city, to_city, pickup_date, weight_kg }
//   truck     — truck row    { driver_name, from_city, to_city, travel_date, capacity_kg }
//   onClose   — () => void
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useCallback } from "react";
import { getWaypoints, getRouteDistanceKm } from "../../utils/waypointRoutes";

// Average truck speed in km/h for ETA
const AVG_SPEED_KMH = 55;

// Status → display config
const STATUS_META = {
  requested:  { label: "Awaiting Confirmation", color: "text-amber-400",  bg: "bg-amber-400/10",  dot: "bg-amber-400"  },
  accepted:   { label: "Confirmed — Not Departed", color: "text-blue-400", bg: "bg-blue-400/10",  dot: "bg-blue-400"  },
  in_transit: { label: "In Transit",             color: "text-orange-400", bg: "bg-orange-400/10", dot: "bg-orange-400" },
  delivered:  { label: "Delivered",              color: "text-green-400",  bg: "bg-green-400/10",  dot: "bg-green-400"  },
};

function etaString(waypointIdx, waypoints, totalKm) {
  const remaining = waypoints.length - 1 - waypointIdx;
  if (remaining <= 0) return "Arrived";
  const kmPerLeg    = totalKm / (waypoints.length - 1);
  const remainingKm = kmPerLeg * remaining;
  const hours       = remainingKm / AVG_SPEED_KMH;
  if (hours < 1)  return `~${Math.round(hours * 60)} mins`;
  if (hours < 24) return `~${hours.toFixed(1)} hrs`;
  return `~${(hours / 24).toFixed(1)} days`;
}

export default function ShipmentTracker({ booking, load, truck, onClose }) {

  const fromCity =
  load?.from_city ||
  truck?.from_city ||
  "Origin";

  const toCity =
  load?.to_city ||
  truck?.to_city ||
  "Destination";

  const waypoints = useMemo(() => getWaypoints(fromCity, toCity), [fromCity, toCity]);
  const totalKm   = useMemo(() => getRouteDistanceKm(fromCity, toCity), [fromCity, toCity]);

  // If booking is delivered, start at end; if in_transit start at 1; else 0
  const initIdx = booking.status === "delivered"
    ? waypoints.length - 1
    : booking.status === "in_transit" ? 1 : 0;

  const [currentIdx,     setCurrentIdx]     = useState(initIdx);
  const [notifications,  setNotifications]  = useState(() => {
    if (booking.status === "in_transit") {
      return [{ id: 1, msg: `🚀 Departed from ${waypoints[0]}`, time: "Just now" }];
    }
    if (booking.status === "delivered") {
      return [{ id: 1, msg: `🎉 Delivered at ${waypoints[waypoints.length - 1]}`, time: "Just now" }];
    }
    return [];
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(notifications.length);

  const pushNotif = useCallback((msg) => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setNotifications(prev => [{ id: Date.now(), msg, time }, ...prev]);
    setNotifCount(c => c + 1);
  }, []);

  const simulateUpdate = () => {
    if (currentIdx >= waypoints.length - 1) return;
    const nextIdx  = currentIdx + 1;
    const prevCity = waypoints[currentIdx];
    const nextCity = waypoints[nextIdx];
    setCurrentIdx(nextIdx);
    pushNotif(`📍 Departed ${prevCity}`);
    setTimeout(() => {
      pushNotif(
        nextIdx === waypoints.length - 1
          ? `🎉 Delivered at ${nextCity}!`
          : `📍 Reached ${nextCity}`
      );
    }, 600);
  };

  const progressPct =
  booking.status === "delivered"
    ? 100
    : waypoints.length > 1
      ? Math.round((currentIdx / (waypoints.length - 1)) * 100)
      : 0;

  const isDelivered = currentIdx >= waypoints.length - 1;
  const statusMeta  = STATUS_META[booking.status] || STATUS_META.requested;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-start p-5 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-bold text-lg">🚛 Shipment Tracker</span>
              {/* Live pulse — only when in_transit and not yet delivered */}
              {booking.status === "in_transit" && !isDelivered && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping inline-block" />
                  LIVE
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              Booking #{booking.id} · {fromCity} → {toCity}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              onClick={() => { setNotifOpen(o => !o); setNotifCount(0); }}
              className="relative text-slate-400 hover:text-white transition-colors"
            >
              <span className="text-xl">🔔</span>
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xl font-light transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Notification Dropdown ───────────────────────────────────────── */}
        {notifOpen && (
          <div className="mx-5 mt-4 bg-slate-800 border border-slate-600 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-600 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Notifications
            </div>
            {notifications.length == 0 ? (
              <p className="text-slate-500 text-xs px-4 py-3">No updates yet.</p>
            ) : (
              <ul className="divide-y divide-slate-700 max-h-40 overflow-y-auto">
                {notifications.map(n => (
                  <li key={n.id} className="flex justify-between items-center px-4 py-2.5">
                    <span className="text-sm text-slate-200">{n.msg}</span>
                    <span className="text-[11px] text-slate-500 ml-4 flex-shrink-0">{n.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="p-5 space-y-5">

          {/* ── Status Banner ───────────────────────────────────────────── */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700 ${statusMeta.bg}`}>
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusMeta.dot} ${booking.status === "in_transit" ? "animate-pulse" : ""}`} />
            <div>
              <p className={`text-sm font-bold ${statusMeta.color}`}>{statusMeta.label}</p>
              <p className="text-xs text-slate-400">
                {isDelivered
                  ? `Delivered to ${toCity}`
                  : `Currently at ${waypoints[currentIdx]} · ETA ${etaString(currentIdx, waypoints, totalKm)}`}
              </p>
            </div>
          </div>

          {/* ── Truck + Load Info ───────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide font-bold mb-1">Driver</p>
              <p className="text-white text-sm font-semibold">{truck?.driver_name || "—"}</p>
              <p className="text-slate-400 text-xs mt-0.5">
                {truck?.from_city} → {truck?.to_city}
              </p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 border border-slate-700">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide font-bold mb-1">Cargo</p>
              <p className="text-white text-sm font-semibold">{booking.booked_kg?.toLocaleString()} kg</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Rate: ₹{booking.agreed_rate}/kg · ₹{(booking.booked_kg * booking.agreed_rate).toLocaleString()} total
              </p>
            </div>
          </div>

          {/* ── Progress Bar ────────────────────────────────────────────── */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
              <span>{fromCity}</span>
              <span className="text-orange-400 font-bold">{progressPct}% complete</span>
              <span>{toCity}</span>
            </div>
            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-in-out"
                
                style={{
                  width: `${progressPct}%`,
                  background:
                    booking.status === "delivered"
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : booking.status === "accepted"
                      ? "linear-gradient(90deg, #3b82f6, #06b6d4)"
                      : "linear-gradient(90deg, #3b82f6, #f97316)",
                }}

              />
            </div>
            <div className="text-right text-[11px] text-slate-500 mt-1">
              ~{Math.round(totalKm * (1 - progressPct / 100))} km remaining · ETA {etaString(currentIdx, waypoints, totalKm)}
            </div>
          </div>

          {/* ── Waypoint Timeline ────────────────────────────────────────── */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide font-bold mb-4">Route Timeline</p>
            <div className="space-y-0">
              {waypoints.map((city, idx) => {
                const done    = idx < currentIdx;
                const current = idx === currentIdx;
                const future  = idx > currentIdx;

                return (
                  <div key={idx} className="flex gap-3">
                    {/* Left: dot + connector */}
                    <div className="flex flex-col items-center">
                      {/* Dot */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 transition-all duration-500
                        ${done    ? "bg-green-500 text-white"                                              : ""}
                        ${current ? "bg-orange-500 text-white ring-4 ring-orange-500/30 scale-110 shadow-lg": ""}
                        ${future  ? "bg-slate-700 text-slate-500 border border-slate-600"                  : ""}
                      `}>
                        {done    ? "✓"  : ""}
                        {current ? "🚛" : ""}
                        {future  ? idx + 1 : ""}
                      </div>
                      {/* Connector line */}
                      {idx < waypoints.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[24px] my-1 transition-all duration-500
                          ${idx < currentIdx ? "bg-green-500" : "bg-slate-700"}
                        `} />
                      )}
                    </div>

                    {/* Right: city label */}
                    <div className="pb-5 pt-1">
                      <p className={`text-sm font-semibold transition-colors duration-300
                        ${done    ? "text-green-400" : ""}
                        ${current ? "text-orange-400" : ""}
                        ${future  ? "text-slate-500"  : ""}
                      `}>
                        {city}
                      </p>
                      <p className="text-[11px] text-slate-600">
                        {done    ? "Passed"      : ""}
                        {current ? "📍 Currently here" : ""}
                        {future  && idx === waypoints.length - 1 ? "Final destination" : ""}
                        {future  && idx !== waypoints.length - 1 ? "Upcoming"     : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Simulate Button ─────────────────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            {!isDelivered ? (
              <button
                onClick={simulateUpdate}
                disabled={booking.status === "requested"}
                className={`flex-1 text-sm font-bold py-3 rounded-xl transition-all shadow-sm
                  ${booking.status === "requested"
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white active:scale-95"
                  }
                `}
              >
                {booking.status === "requested"
                  ? "⏳ Awaiting Confirmation"
                  : "📡 Receive Driver Update"}
              </button>
            ) : (
              <div className="flex-1 text-sm font-bold py-3 rounded-xl bg-green-500/20 text-green-400 text-center border border-green-500/30">
                🎉 Shipment Delivered Successfully
              </div>
            )}

            <button
              onClick={onClose}
              className="text-sm font-bold px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
