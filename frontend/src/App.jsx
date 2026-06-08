import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Home from './pages/Home';
import TruckPost from './pages/TruckPost';
import LoadPost from './pages/LoadPost';
import Matches from './pages/Matches';
import KiranaDash from './pages/KiranaDash';
export default function App() {
return (
<BrowserRouter>
<Navbar />
<div className='max-w-4xl mx-auto px-4 py-6'>
<Routes>
<Route path='/' element={<Home />} />
<Route path='/post-truck' element={<TruckPost />} />
<Route path='/post-load' element={<LoadPost />} />
<Route path='/matches' element={<Matches />} />
<Route path='/kirana' element={<KiranaDash />} />
</Routes>
</div>
</BrowserRouter>
);
}
