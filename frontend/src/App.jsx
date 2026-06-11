// src/App.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './components/shared/Navbar';

import Home from './pages/Home';
import TruckPost from './pages/TruckPost';
import LoadPost from './pages/LoadPost';
import Matches from './pages/Matches';
import KiranaDash from './pages/KiranaDash';
import Bookings from './pages/Bookings';

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/post-truck" element={<TruckPost />} />
          <Route path="/post-load" element={<LoadPost />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/kirana" element={<KiranaDash />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}