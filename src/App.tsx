import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Index from "./pages/Index";
import GodLevelIndex from "./pages/GodLevel/Index";
import StellarIndex from "./pages/Stellar/StellarIndex";
import CorporatePage from "./pages/Corporate/CorporatePage";
import WeddingsPage from "./pages/Weddings/WeddingsPage";
import BlogIndex from "./pages/Blog/BlogIndex";
import NotFound from "./pages/NotFound.tsx";
import ShadowRoom from './components/ShadowRoom';
import Admin from "./pages/Admin.tsx";
import LiveVisualContentEditor from "./components/LiveVisualContentEditor";
import AudioAtmosphereBar from "./components/AudioAtmosphereBar";

const queryClient = new QueryClient();

function GlobalAtmosphereControls() {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  return (
    <>
      <LiveVisualContentEditor />
      <AudioAtmosphereBar />
    </>
  );
}

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StellarIndex />} />
            <Route path="/corporate" element={<CorporatePage />} />
            <Route path="/weddings" element={<WeddingsPage />} />
            <Route path="/weddings-sangeet" element={<WeddingsPage />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogIndex />} />
            <Route path="/god-level" element={<GodLevelIndex />} />
            <Route path="/old-index" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <GlobalAtmosphereControls />
        </BrowserRouter>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}
