// src/utils/waypointRoutes.js
// ─────────────────────────────────────────────────────────────────────────────
// Waypoint route registry for FlowIQ shipment tracker.
// Keys are "FROM|TO" (uppercase, trimmed). Values are the full stop array
// including source and destination.
//
// HOW TO ADD A NEW ROUTE:
//   "CITYNAME|CITYNAME": ["City", "Stop1", "Stop2", "Destination"],
// ─────────────────────────────────────────────────────────────────────────────

const ROUTES = {
  // ── Chhattisgarh / Central ────────────────────────────────────────────────
  "RAIPUR|NAGPUR":    ["Raipur", "Durg", "Rajnandgaon", "Bhandara", "Nagpur"],
  "RAIPUR|BHOPAL":   ["Raipur", "Bilaspur", "Shahdol", "Jabalpur", "Sagar", "Bhopal"],
  "RAIPUR|MUMBAI":   ["Raipur", "Nagpur", "Wardha", "Yavatmal", "Nanded", "Aurangabad", "Mumbai"],
  "RAIPUR|INDORE":   ["Raipur", "Durg", "Rajnandgaon", "Seoni", "Jabalpur", "Bhopal", "Indore"],

  // ── North India ───────────────────────────────────────────────────────────
  "DELHI|JAIPUR":    ["Delhi", "Gurugram", "Rewari", "Neemrana", "Shahjahanpur", "Jaipur"],
  "DELHI|MUMBAI":    ["Delhi", "Mathura", "Agra", "Gwalior", "Bhopal", "Nagpur", "Pune", "Mumbai"],
  "DELHI|LUCKNOW":   ["Delhi", "Ghaziabad", "Hapur", "Moradabad", "Bareilly", "Shahjahanpur", "Lucknow"],
  "DELHI|CHANDIGARH":["Delhi", "Sonipat", "Panipat", "Kurukshetra", "Ambala", "Chandigarh"],
  "DELHI|AGRA":      ["Delhi", "Faridabad", "Mathura", "Agra"],

  // ── West India ────────────────────────────────────────────────────────────
  "INDORE|MUMBAI":   ["Indore", "Dhule", "Nashik", "Bhiwandi", "Mumbai"],
  "PUNE|MUMBAI":     ["Pune", "Lonavala", "Khopoli", "Panvel", "Mumbai"],
  "PUNE|HYDERABAD":  ["Pune", "Solapur", "Bidar", "Gulbarga", "Hyderabad"],
  "AHMEDABAD|SURAT": ["Ahmedabad", "Anand", "Vadodara", "Bharuch", "Surat"],
  "AHMEDABAD|MUMBAI":["Ahmedabad", "Vadodara", "Surat", "Vapi", "Virar", "Mumbai"],

  // ── South India ───────────────────────────────────────────────────────────
  "CHENNAI|BENGALURU":  ["Chennai", "Vellore", "Krishnagiri", "Hosur", "Bengaluru"],
  "CHENNAI|HYDERABAD":  ["Chennai", "Nellore", "Ongole", "Vijayawada", "Hyderabad"],
  "BENGALURU|HYDERABAD":["Bengaluru", "Tumkur", "Chitradurga", "Ballari", "Kurnool", "Hyderabad"],
  "BENGALURU|MUMBAI":   ["Bengaluru", "Hubli", "Kolhapur", "Sangli", "Pune", "Mumbai"],
  "HYDERABAD|MUMBAI":   ["Hyderabad", "Bidar", "Gulbarga", "Solapur", "Pune", "Mumbai"],

  // ── East India ────────────────────────────────────────────────────────────
  "LUCKNOW|KANPUR":   ["Lucknow", "Unnao", "Kanpur"],
  "LUCKNOW|VARANASI": ["Lucknow", "Sultanpur", "Jaunpur", "Varanasi"],
  "PATNA|KOLKATA":    ["Patna", "Burdwan", "Durgapur", "Kolkata"],

  // ── Misc ──────────────────────────────────────────────────────────────────
  "JAIPUR|AHMEDABAD": ["Jaipur", "Ajmer", "Beawar", "Pali", "Jodhpur", "Barmer", "Ahmedabad"],
  "NAGPUR|HYDERABAD": ["Nagpur", "Adilabad", "Nizamabad", "Hyderabad"],
  "NAGPUR|MUMBAI":    ["Nagpur", "Wardha", "Amravati", "Aurangabad", "Pune", "Mumbai"],
};

/**
 * Get waypoints for a route. Returns a full array including source & destination.
 * Falls back to a 3-stop generic route if the pair isn't in the registry.
 */
export function getWaypoints(fromCity, toCity) {
  const key    = `${fromCity.trim().toUpperCase()}|${toCity.trim().toUpperCase()}`;
  const revKey = `${toCity.trim().toUpperCase()}|${fromCity.trim().toUpperCase()}`;

  if (ROUTES[key])    return ROUTES[key];
  if (ROUTES[revKey]) return [...ROUTES[revKey]].reverse(); // reverse if only reverse defined

  // Generic fallback — show at least source & destination
  return [fromCity, `${fromCity} Outskirts`, "Highway Junction", `${toCity} Bypass`, toCity];
}

/** Rough km estimates per leg — used for ETA calculation */
const APPROX_DISTANCES = {
  "RAIPUR|NAGPUR":     300,
  "RAIPUR|BHOPAL":     480,
  "DELHI|JAIPUR":      280,
  "DELHI|MUMBAI":     1400,
  "INDORE|MUMBAI":     590,
  "PUNE|HYDERABAD":    560,
  "CHENNAI|BENGALURU": 350,
  "AHMEDABAD|SURAT":   265,
  "LUCKNOW|KANPUR":     80,
  "PUNE|MUMBAI":       150,
};

/** Returns estimated total km for a route (defaults to 400 km) */
export function getRouteDistanceKm(fromCity, toCity) {
  const key    = `${fromCity.trim().toUpperCase()}|${toCity.trim().toUpperCase()}`;
  const revKey = `${toCity.trim().toUpperCase()}|${fromCity.trim().toUpperCase()}`;
  return APPROX_DISTANCES[key] || APPROX_DISTANCES[revKey] || 400;
}
