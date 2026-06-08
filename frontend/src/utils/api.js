// src/utils/api.js
const BASE = "http://127.0.0.1:8000"; // change to Render URL when deploying
export const api = {
// Trucks
postTruck: (data) => fetch(`${BASE}/trucks/`, { method:'POST',
headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r=>r.json()),
getTrucks: () => fetch(`${BASE}/trucks/`).then(r=>r.json()),
// Loads
postLoad: (data) => fetch(`${BASE}/loads/`, { method:'POST',
headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r=>r.json()),
// Matches
getMatches: (from, to, kg) =>
fetch(`${BASE}/matches/?from_city=${from}&to_city=${to}&weight_kg=${kg}`).then(r=>r.json()),
// Sales
logSale: (data) => fetch(`${BASE}/sales/`, { method:'POST',
headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }).then(r=>r.json()),
// Alerts
getAlerts: (storeId) => fetch(`${BASE}/alerts/${storeId}`).then(r=>r.json()),
};