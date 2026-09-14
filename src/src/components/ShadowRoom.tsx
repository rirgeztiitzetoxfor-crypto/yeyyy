import { Shield, Activity, MessageSquare, Eye } from 'lucide-react';

interface ShadowRoomProps {
  onExit: () => void;
}

export default function ShadowRoom({ onExit }: ShadowRoomProps) {
  return (
    <div className="min-h-screen bg-[#030303] text-[#F5F0E8] p-8 font-sans animate-in fade-in duration-700">
      <header className="flex justify-between items-center border-b border-[#C9A84C]/20 pb-6 mb-12">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-[#C9A84C]" />
          <h1 className="text-xl tracking-[0.2em] font-light uppercase text-[#C9A84C]">The Shadow Room</h1>
        </div>
        <button onClick={onExit} className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors">
          Return to Public Space
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h2 className="text-sm tracking-widest uppercase text-[#C9A84C] mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4"/> Neural Drafter
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border-l-2 border-[#C9A84C]">
              <p className="font-bold text-sm">Tata Motors Gala</p>
              <p className="text-xs text-white/50 mb-4">Intent: High | Date: Dec 14</p>
              <div className="p-4 bg-black/50 text-sm text-white/80 font-serif leading-relaxed italic border border-white/5">
                "Dear Sanjay, Radha is currently available on December 14th to anchor the Tata Motors Gala. To ensure the atmosphere is perfectly curated, my management team will be in touch regarding the retainer..."
              </div>
              <div className="mt-4 flex gap-2">
                <button className="text-[10px] tracking-widest uppercase px-3 py-2 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-colors">Warmer</button>
                <button className="text-[10px] tracking-widest uppercase px-3 py-2 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-colors">Firmer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-6">
          <h2 className="text-sm tracking-widest uppercase text-[#C9A84C] mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4"/> Live Intent Matrix
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs p-4 bg-white/5 border border-white/5">
              <span className="flex items-center gap-3"><Eye className="w-4 h-4 text-[#C9A84C]"/> Vogue India IP</span> 
              <span className="text-[#C9A84C] font-bold tracking-widest">HOVERING (42s)</span>
            </div>
            <div className="flex justify-between items-center text-xs p-4 bg-white/5 border border-white/5">
              <span className="flex items-center gap-3"><Eye className="w-4 h-4 text-white/40"/> Anonymous Guest</span> 
              <span className="text-white/40 tracking-widest">GREEN ROOM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}