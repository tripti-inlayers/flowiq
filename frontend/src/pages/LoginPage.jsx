// frontend/src/pages/LoginPage.jsx
// CHANGES FROM PREVIOUS VERSION:
//   1. Removed unused imports: useNavigate, Link
//   2. Fixed Hook violation: destructure `register` at component top level
//      (was illegally called inside handleSubmit async function)

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRoleRedirect } from "../hooks/useRoleRedirect";

const DEMO_ACCOUNTS = [
  { role: "Kirana Owner", email: "ravi@flowiq.in",   hint: "Store owner" },
  { role: "Driver",       email: "suresh@flowiq.in", hint: "Truck driver" },
  { role: "Shipper",      email: "priya@flowiq.in",  hint: "Distributor" },
  { role: "Admin",        email: "admin@flowiq.in",  hint: "Full access" },
];

export default function LoginPage() {
  // ✅ All hooks called unconditionally at the top level — Rules of Hooks satisfied
  const { login, register } = useAuth();   // <-- register destructured HERE, not inside handleSubmit
  const { redirectByRole }  = useRoleRedirect();

  const [mode,     setMode]     = useState("login");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [role,     setRole]     = useState("kirana_owner");
  const [error,    setError]    = useState("");
  const [busy,     setBusy]     = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        const user = await login(email, password);
        redirectByRole(user.role);
      } else {
        // ✅ Uses `register` from component scope — no hook call here
        const user = await register({ name, email, password, role });
        redirectByRole(user.role);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  function fillDemo(acc) {
    setEmail(acc.email);
    setPassword("FlowIQ@2024");
    setMode("login");
    setError("");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0a0f1e",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>

      {/* ── Left panel — brand / visual ─────────────────── */}
      <div style={{
        flex: "0 0 52%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0a0f1e 0%, #0e1630 60%, #111d3a 100%)",
      }}>

        {/* Route-line signature element */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }}
          viewBox="0 0 600 700" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-50 350 Q 150 100 300 350 Q 450 600 650 350" stroke="#f97316" strokeWidth="1.5" fill="none"/>
          <path d="M-50 250 Q 200 50  300 250 Q 400 450 650 250" stroke="#f97316" strokeWidth="1" fill="none"/>
          <path d="M-50 450 Q 100 200 300 450 Q 500 700 650 450" stroke="#f97316" strokeWidth="1" fill="none"/>
          <circle cx="80"  cy="350" r="6" fill="#f97316" opacity="0.8"/>
          <circle cx="300" cy="350" r="8" fill="#f97316"/>
          <circle cx="520" cy="350" r="6" fill="#f97316" opacity="0.8"/>
          {[120,200,280,360,440].map(x => (
            <line key={x} x1={x} y1="346" x2={x} y2="354" stroke="#f97316" strokeWidth="1.5" opacity="0.5"/>
          ))}
        </svg>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px" }}>
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              </svg>
            </div>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>FlowIQ</span>
          </div>

          <h1 style={{
            color: "#fff",
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            marginBottom: 20,
          }}>
            Move smarter.<br />
            <span style={{ color: "#f97316" }}>Deliver faster.</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, maxWidth: 380, marginBottom: 48 }}>
            India's logistics intelligence platform connecting kirana stores,
            truck drivers, and distributors on a single network.
          </p>

          <div style={{ display: "flex", gap: 36 }}>
            {[
              { n: "2,400+",  l: "Active trucks"  },
              { n: "18,000+", l: "Kirana stores"  },
              { n: "99.2%",   l: "On-time rate"   },
            ].map(s => (
              <div key={s.n}>
                <div style={{ color: "#f97316", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>{s.n}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ───────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "48px 56px",
        background: "#0f172a",
        overflowY: "auto",
      }}>

        {/* Mode toggle */}
        <div style={{
          display: "flex",
          background: "#1e293b",
          borderRadius: 10,
          padding: 4,
          marginBottom: 36,
          maxWidth: 380,
        }}>
          {["login", "register"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "9px 0",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                transition: "all 0.2s",
                background: mode === m ? "#f97316" : "transparent",
                color: mode === m ? "#fff" : "#64748b",
              }}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <h2 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.5px" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
          {mode === "login"
            ? "Sign in to access your FlowIQ dashboard"
            : "Join the FlowIQ logistics network"}
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: 380 }}>

          {mode === "register" && (
            <FormField label="Full name">
              <Input
                type="text" value={name} placeholder="e.g. Ravi Kumar"
                onChange={e => setName(e.target.value)} required
              />
            </FormField>
          )}

          {mode === "register" && (
            <FormField label="I am a…">
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={selectStyle}
              >
                <option value="kirana_owner">Kirana Store Owner</option>
                <option value="driver">Truck Driver</option>
                <option value="shipper">Shipper / Distributor</option>
              </select>
            </FormField>
          )}

          <FormField label="Email address">
            <Input
              type="email" value={email} placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)} required
            />
          </FormField>

          <FormField label="Password">
            <div style={{ position: "relative" }}>
              <Input
                type={showPwd ? "text" : "password"}
                value={password}
                placeholder={mode === "register" ? "Min 8 characters" : ""}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0,
                }}
                tabIndex={-1}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
          </FormField>

          {error && (
            <div style={{
              background: "#450a0a", border: "1px solid #7f1d1d",
              borderRadius: 8, padding: "10px 14px",
              color: "#fca5a5", fontSize: 13, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            style={{
              width: "100%",
              padding: "13px 0",
              background: busy ? "#7c3a16" : "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: busy ? "not-allowed" : "pointer",
              letterSpacing: "0.3px",
              transition: "opacity 0.2s",
            }}
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ maxWidth: 380, marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: "#1e293b" }}/>
            <span style={{ color: "#475569", fontSize: 12 }}>Demo accounts — password: FlowIQ@2024</span>
            <div style={{ flex: 1, height: 1, background: "#1e293b" }}/>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  padding: "10px 12px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#f97316"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#334155"}
              >
                <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>{acc.role}</div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{acc.hint}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Internal sub-components ───────────────────────────────
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ style = {}, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "11px 14px",
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 9,
        color: "#f1f5f9",
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = "#f97316"}
      onBlur={e  => e.target.style.borderColor = "#334155"}
    />
  );
}

const selectStyle = {
  width: "100%",
  padding: "11px 14px",
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: 9,
  color: "#f1f5f9",
  fontSize: 14,
  outline: "none",
  cursor: "pointer",
};
