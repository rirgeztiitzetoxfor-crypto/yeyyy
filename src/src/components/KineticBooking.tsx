import { useState, useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function KineticBooking() {
  const [isBooked, setIsBooked] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.TouchEvent | React.MouseEvent) => {
    if (isBooked || !sliderRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    if (!('touches' in e) && e.buttons !== 1) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    setDragProgress(percentage);
    if (percentage > 95) { 
      setIsBooked(true); 
      setDragProgress(100); 
    }
  };

  const resetDrag = () => { if (!isBooked) setDragProgress(0); };

  return (
    <div className="w-full max-w-md mx-auto relative group">
      <div 
        ref={sliderRef} 
        onMouseMove={handleDrag} onTouchMove={handleDrag} 
        onMouseLeave={resetDrag} onMouseUp={resetDrag} onTouchEnd={resetDrag}
        className={`h-16 w-full border relative flex items-center overflow-hidden transition-colors duration-500 shadow-2xl ${isBooked ? 'bg-[#C9A84C]/10 border-[#C9A84C]' : 'bg-white/5 border-[#C9A84C]/30 hover:border-[#C9A84C]/60'}`}
      >
        <div className="absolute top-0 left-0 h-full bg-[#C9A84C]/20 transition-all duration-75" style={{ width: `${dragProgress}%` }} />
        <div 
          className="absolute h-full bg-[#C9A84C] flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-75 shadow-[0_0_20px_rgba(201,168,76,0.5)]"
          style={{ width: '64px', left: `calc(${dragProgress}% - ${dragProgress === 100 ? 64 : (dragProgress * 0.64)}px)` }}
        >
          {isBooked ? <CheckCircle className="w-6 h-6 text-[#030303]" /> : <ArrowRight className="w-6 h-6 text-[#030303]" />}
        </div>
        <span className="w-full text-center text-xs tracking-[0.3em] uppercase font-bold z-0 pointer-events-none transition-opacity duration-300" style={{ color: isBooked ? '#C9A84C' : 'rgba(245,240,232,0.4)' }}>
          {isBooked ? 'Protocol Initiated' : 'Drag to Secure Date'}
        </span>
      </div>
    </div>
  );
}