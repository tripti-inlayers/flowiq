// src/utils/api.js
const BASE = "http://127.0.0.1:8000"; // change to Render URL when deploying

export const api = {
  // ==========================================
  // PRESERVED ORIGINAL ROUTES (Trucks & Loads)
  // ==========================================
  postTruck: (data) => fetch(`${BASE}/trucks/`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),

  getTrucks: () => fetch(`${BASE}/trucks/`).then(r => r.json()),

  postLoad: (data) => fetch(`${BASE}/loads/`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(data) 
  }).then(r => r.json()),

  getMatches: (from, to, kg) =>
    fetch(`${BASE}/matches/?from_city=${from}&to_city=${to}&weight_kg=${kg}`).then(r => r.json()),


  // ==========================================
  // PHASE 2: CORE KIRANA & INVENTORY ROUTES
  // ==========================================
  
  // Step 5: Fetch list of all 10 kirana stores
  getStores: () => fetch(`${BASE}/stores`).then(r => r.json()),

  // Step 6: Fetch low-stock alert data items for a store
  getAlerts: (storeId) => fetch(`${BASE}/stores/${storeId}/inventory`).then(r => r.json()),

  // Step 14: Fetch recent transaction history for the auditing table
  getSalesHistory: (storeId) => fetch(`${BASE}/stores/${storeId}/sales`).then(r => r.json()),

  // Step 7: Log a new sale (Maps data into path variables + Pydantic schema body)
  logSale: (data) => {
    const { store_id, item, units_sold } = data;
    return fetch(`${BASE}/stores/${store_id}/sales`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ item, units_sold }) 
    }).then(r => r.json());
  },


  // ==========================================
  // PHASE 3: TRANSPARENT BOOKING SYSTEM ROUTES
  // ==========================================

  // Step 9: Create a new transactional booking link
  createBooking: (bookingData) => fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  }).then(r => r.json()),

  // Step 10: Fetch all global system bookings (filterable by status)
  getAllBookings: (status = '') => {
    const url = status ? `${BASE}/bookings?status=${status}` : `${BASE}/bookings`;
    return fetch(url).then(r => r.json());
  },

  // Step 10: Fetch active bookings mapped directly to an outlet
  getBookingsByStore: (storeId) => fetch(`${BASE}/bookings/store/${storeId}`).then(r => r.json()),

  // Step 11: Progress transactional workflow states
  updateBookingStatus: (bookingId, status) => fetch(`${BASE}/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json()),


  // ==========================================
  // PHASE 5: CARGO MANIFESTS & LOGISTICS MATCHING
  // ==========================================

  // Step 16: Match active linehaul freight by city origin
  getTrucksByCity: (city) => fetch(`${BASE}/trucks?from_city=${encodeURIComponent(city)}`).then(r => r.json()),

  // Step 18: Fetch on-board items cargo breakdown lists
  getTruckManifest: (truckId) => fetch(`${BASE}/trucks/${truckId}/manifest`).then(r => r.json()),
};