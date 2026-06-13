import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
const { user, logout } = useAuth();
const location = useLocation();
const navigate = useNavigate();

// Hide navbar on login page
if (location.pathname === '/login') return null;

const handleLogout = async () => {
await logout();
navigate('/login');
};

const role = user?.role;

return ( <nav className='bg-blue-700 text-white px-6 py-3 flex gap-6 items-center shadow-sm'> <span className='font-bold text-lg mr-4 tracking-tight'>
FlowIQ </span>

  {/* Admin */}
  {role === 'admin' && (
    <>
      <Link to='/'>Home</Link>
      <Link to='/post-truck'>Post Truck</Link>
      <Link to='/post-load'>Post Load</Link>
      <Link to='/matches'>Find Matches</Link>
      <Link to='/kirana'>Kirana Dashboard</Link>
      <Link to='/bookings'>Bookings</Link>
    </>
  )}

  {/* Shipper */}
  {role === 'shipper' && (
    <>
      <Link to='/post-load'>Post Load</Link>
      <Link to='/matches'>Find Matches</Link>
      <Link to='/bookings'>Bookings</Link>
    </>
  )}

  {/* Driver */}
  {role === 'driver' && (
    <>
      <Link to='/post-truck'>Post Truck</Link>
      <Link to='/bookings'>Bookings</Link>
    </>
  )}

  {/* Kirana Owner */}
  {role === 'kirana_owner' && (
    <>
      <Link to='/kirana'>Kirana Dashboard</Link>
      <Link to='/bookings'>Bookings</Link>
    </>
  )}

  <button
    onClick={handleLogout}
    className='ml-auto bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-semibold'
  >
    Logout
  </button>
</nav>

);
}
