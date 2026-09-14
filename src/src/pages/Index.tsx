import { useState, useEffect } from 'react';
import KineticBooking from '../components/KineticBooking';

export default function Index() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#010101] text-[#F5F0E8] font-sans relative overflow-hidden">
      {/* The Ambient Light Engine */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{ background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201,168,76,0.06), transparent 40%)` }} 
      />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-32 space-y-40">
        <section className="text-center pt-20 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.4em] uppercase mb-6 font-semibold">India's Premier Anchor</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-wide mb-8" style={{ fontFamily: '"Cormorant Garamond", serif' }}>The Art of Atmosphere</h1>
          <p className="text-white/50 font-light max-w-lg mx-auto leading-relaxed text-lg">Good evening. The stage is set. Every element of your event curated to absolute perfection.</p>
        </section>

        <section className="text-center pb-32">
          <h2 className="text-3xl font-serif mb-12 text-[#F5F0E8]">Secure the Room</h2>
          <KineticBooking />
        </section>
      </main>
    </div>
  );
}