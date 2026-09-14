import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Index from './pages/Index';
import ShadowRoom from './components/ShadowRoom';

export default function App() {
  const [showShadowPrompt, setShowShadowPrompt] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shadowKey, setShadowKey] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey && e.key.toLowerCase() === 's') setShowShadowPrompt(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unlockShadowRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (shadowKey === 'ATMOSPHERE_2026') {
      setIsAdmin(true);
      setShowShadowPrompt(false);
      setShadowKey('');
    } else {
      setShadowKey('');
    }
  };

  if (isAdmin) {
    return <ShadowRoom onExit={() => setIsAdmin(false)} />;
  }

  return (
    <>
      <Index />
      
      {/* Hidden Master Key Prompt */}
      {showShadowPrompt && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
          <form onSubmit={unlockShadowRoom} className="p-10 border border-[#C9A84C]/30 bg-[#0A0A0A] text-center shadow-2xl">
            <Lock className="w-6 h-6 text-[#C9A84C] mx-auto mb-6" />
            <input 
              type="password" autoFocus value={shadowKey} onChange={(e) => setShadowKey(e.target.value)} 
              placeholder="ENTER MASTER KEY" 
              className="bg-transparent border-b border-[#C9A84C]/50 text-[#C9A84C] px-4 py-3 text-center tracking-widest outline-none mb-8 uppercase text-xs w-64 focus:border-[#C9A84C] transition-colors" 
            />
            <button type="submit" className="w-full bg-[#C9A84C] text-[#030303] uppercase tracking-[0.2em] text-xs py-4 font-bold hover:bg-[#F5F0E8] transition-colors">
              Access Intelligence
            </button>
            <button type="button" onClick={() => setShowShadowPrompt(false)} className="mt-6 text-[10px] uppercase tracking-widest text-white/40 hover:text-white">Cancel</button>
          </form>
        </div>
      )}
    </>
  );
}