import { Shield, FileText, Film } from 'lucide-react';
import { useSiteMedia } from "@/hooks/useSiteMedia";

interface ShadowRoomProps {
  onExit: () => void;
}

export default function ShadowRoom({ onExit }: ShadowRoomProps) {
  const { getMediaUrl, media } = useSiteMedia();

  const getSlot = (id: string, fb: string = "#") => getMediaUrl(id, fb);
  const findMedia = (id: string) => media.find(m => m.slot_id === id);

  const packs = [
    { title: "Corporate Gala & Summit", pdf: "pdf_corporate", video: "media_corporate" },
    { title: "Sangeet & Luxury Weddings", pdf: "pdf_sangeet", video: "media_sangeet" },
    { title: "Host / Emcee Kit", pdf: "pdf_emcee", video: "media_emcee" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#030303] text-[#F5F0E8] p-8 md:p-16 font-sans animate-in fade-in duration-700">
      <header className="flex justify-between items-center border-b border-[#C9A84C]/20 pb-6 mb-12">
        <div className="flex items-center gap-4">
          <Shield className="w-6 h-6 text-[#C9A84C]" />
          <h1 className="text-xl tracking-[0.2em] font-light uppercase text-[#C9A84C]">Resource Matrix</h1>
        </div>
        <button onClick={onExit} className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors">
          Return to Public Space
        </button>
      </header>
      
      <p className="max-w-xl text-white/70 tracking-wide text-sm leading-relaxed mb-12">
        Access Radha's curated, event-specific packages. These PDF narratives and high-fidelity media cuts are designed specifically for planners, brands, and engaged couples to review.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {packs.map(pack => (
          <div key={pack.title} className="bg-[#0A0A0A] border border-white/5 p-8 group hover:border-[#C9A84C]/50 transition-colors shadow-2xl">
            <h2 className="text-sm md:text-md tracking-[0.1em] uppercase text-[#C9A84C] mb-8 border-b border-white/10 pb-4">
              {pack.title}
            </h2>
            
            <div className="space-y-4">
              <a 
                href={getSlot(pack.pdf)} 
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-black border border-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-black transition-colors group/btn"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#C9A84C] group-hover/btn:text-black transition-colors" />
                  <span className="text-[11px] tracking-widest uppercase font-bold">Download PDF Package</span>
                </div>
                {!findMedia(pack.pdf) && <span className="text-[10px] opacity-50">(Unavailable)</span>}
              </a>

              <a 
                href={getSlot(pack.video)} 
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-black border border-[#C9A84C]/20 hover:bg-[#C9A84C] hover:text-black transition-colors group/btn"
              >
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5 text-[#C9A84C] group-hover/btn:text-black transition-colors" />
                  <span className="text-[11px] tracking-widest uppercase font-bold">Watch Media Cut</span>
                </div>
                {!findMedia(pack.video) && <span className="text-[10px] opacity-50">(Unavailable)</span>}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
