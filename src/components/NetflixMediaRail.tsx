import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Maximize2, Sparkles } from "lucide-react";
import TiltCard from "./TiltCard";

export interface MediaRailItem {
  id?: string;
  img: string;
  caption: string;
  vertical?: "corporate" | "weddings_sangeet";
  type: "image" | "video";
  badge?: string;
  duration?: string;
}

interface NetflixMediaRailProps {
  title: string;
  subtitle?: string;
  tag?: string;
  tagColor?: string;
  items: MediaRailItem[];
  onItemSelect: (item: MediaRailItem) => void;
}

export default function NetflixMediaRail({
  title,
  subtitle,
  tag,
  tagColor = "#C9A84C",
  items,
  onItemSelect,
}: NetflixMediaRailProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const amount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="netflix-rail-container py-4 relative group/rail">
      {/* Rail Title Header */}
      <div className="px-6 sm:px-12 flex items-end justify-between mb-3">
        <div>
          {tag && (
            <div
              className="text-[11px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5"
              style={{ color: tagColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: tagColor }} />
              {tag}
            </div>
          )}
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#888] font-sans mt-0.5 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#C9A84C] hover:text-black text-white/80 border border-white/10 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#C9A84C] hover:text-black text-white/80 border border-white/10 flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-6 sm:px-12 py-3 scrollbar-none scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id || `${item.caption}-${idx}`}
            className="flex-shrink-0 w-64 sm:w-72 md:w-80 snap-start cursor-pointer group/card"
            onClick={() => onItemSelect(item)}
          >
            <TiltCard maxTilt={5} className="h-full">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#161616] border border-white/10 group-hover/card:border-[#C9A84C]/80 group-hover/card:shadow-2xl group-hover/card:shadow-[#C9A84C]/20 transition-all duration-300">
                {/* Media Image Thumbnail */}
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-108"
                  loading="lazy"
                />

                {/* Ambient dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono font-bold text-white/90 border border-white/15">
                      {item.type === "video" ? "VIDEO" : "HD PHOTO"}
                    </span>
                    {item.badge && (
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white shadow-md uppercase"
                        style={{ backgroundColor: tagColor || "#C9A84C" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {item.duration && (
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white/80">
                      {item.duration}
                    </span>
                  )}
                </div>

                {/* Center Hover Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C] text-black flex items-center justify-center shadow-xl transform scale-75 group-hover/card:scale-100 transition-transform duration-200">
                    {item.type === "video" ? (
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    ) : (
                      <Maximize2 className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 flex flex-col justify-end">
                  <h4 className="font-serif text-sm font-bold text-white line-clamp-1 group-hover/card:text-[#E2C775] transition-colors">
                    {item.caption}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-[#A0A0A0] mt-1 font-mono">
                    <span className="uppercase tracking-wider">
                      {item.vertical === "corporate" ? "Corporate Event" : "Wedding / Sangeet"}
                    </span>
                    <span className="text-[#C9A84C] font-semibold">View</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </div>
  );
}

export { NetflixMediaRail };

