// src/components/shared/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className='bg-blue-700 text-white px-6 py-3 flex gap-6 items-center shadow-sm'>
      <span className='font-bold text-lg mr-4 tracking-tight'>FlowIQ</span>
      <Link to='/' className='hover:text-blue-200 transition-colors font-medium text-sm'>Home</Link>
      <Link to='/post-truck' className='hover:text-blue-200 transition-colors font-medium text-sm'>Post Truck</Link>
      <Link to='/post-load' className='hover:text-blue-200 transition-colors font-medium text-sm'>Post Load</Link>
      <Link to='/matches' className='hover:text-blue-200 transition-colors font-medium text-sm'>Find Matches</Link>
      <Link to='/kirana' className='hover:text-blue-200 transition-colors font-medium text-sm'>Kirana Dashboard</Link>
      
      {/* Phase 5 Step 17: Exposed lifecycle bookings contract link */}
      <Link to='/bookings' className='hover:text-blue-200 transition-colors font-medium text-sm border-l border-blue-500 pl-4 ml-2'>
        Bookings
      </Link>
    </nav>
  );
}