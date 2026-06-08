// src/components/restock/ChatInput.jsx
import { useState } from 'react';
export default function ChatInput({ onSend }) {
const [val, setVal] = useState('');
const send = () => { if (val.trim()) { onSend(val.trim()); setVal(''); } };
return (
<div className='flex gap-2'>
<input className='flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm
focus:outline-none focus:ring-2 focus:ring-teal-500'
placeholder='e.g. Atta 10kg — sold 3 today'
value={val} onChange={e => setVal(e.target.value)}
onKeyDown={e => e.key === 'Enter' && send()} />
<button onClick={send}
className='bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold
hover:bg-teal-700'>Send</button>
</div>
);
}