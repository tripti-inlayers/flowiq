// src/components/shared/Navbar.jsx
import { Link } from 'react-router-dom';
export default function Navbar() {
return (
<nav className='bg-blue-700 text-white px-6 py-3 flex gap-6 items-center'>
<span className='font-bold text-lg mr-4'>FlowIQ</span>
<Link to='/' className='hover:text-blue-200'>Home</Link>
<Link to='/post-truck' className='hover:text-blue-200'>Post Truck</Link>
<Link to='/post-load' className='hover:text-blue-200'>Post Load</Link>
<Link to='/matches' className='hover:text-blue-200'>Find Matches</Link>
<Link to='/kirana' className='hover:text-blue-200'>Kirana Dashboard</Link>
</nav>
);
}
