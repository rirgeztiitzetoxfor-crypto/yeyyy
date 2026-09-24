import React, { useState, useEffect } from "react";
import { Play, Calendar, ChevronRight, ChevronLeft, Volume2, Sparkles, Star } from "lucide-react";
import GoogleReviewsBadge from "./GoogleReviewsBadge";

export interface BillboardMedia {
  id: string;
  title: string;
  tagline: string;
  category: "Corporate Summit" | "Luxury Sangeet" | "Brand Launch" | "Award Gala";
  mediaUrl: string;
  type: "video" | "image";
  matchRate: string;
  year: string;
  badges: string[];
}

const DEFAULT_BILLBOARD_ITEMS: BillboardMedia[] = [
  {
    id: "reel-1",
    title: "Annual Tech Leadership Summit",
    tagline: "Bilingual fireside moderations, high-voltage keynotes, and Fortune 500 executive stagecraft.",
    category: "Corporate Summit",
    mediaUrl: "images/img_14.jpg",
    type: "image",
    matchRate: "99% Match",
    year: "2026",
    badges: ["#1 In Corporate", "TEDx-Style", "Bilingual"],
  },
  {
    id: "reel-2",
    title: "Grand Royal Sangeet & Varmala",
    tagline: "Electrifying dance performance cues, couple roast battles, and emotional family bonding that keeps guests dancing till 3 AM.",
    category: "Luxury Sangeet",
    mediaUrl: "images/img_28.jpg",
    type: "image",
    matchRate: "98% Match",
    year: "2026",
    badges: ["Crowd Favorite", "High Voltage", "Family Loved"],
  },
  {
    id: "reel-3",
    title: "National Brand Reveal & Gala",
    tagline: "Dramatic countdowns, lighting coordination, and international media showcase delivery.",
    category: "Brand Launch",
    mediaUrl: "images/img_17.jpg",
    type: "image",
    matchRate: "99% Match",
    year: "2026",
    badges: ["Black Tie", "Pan-India", "Executive"],
  },
];

interface NetflixBillboardProps {
  customMedia?: Array<{ url: string; title: string; type: "image" | "video" }>;
  onPlayTrailer: (item: { url: string; title: string; type: "image" | "video" }) => void;
  onBookClick: () => void;
}

export default function NetflixBillboard({
  customMedia = [],
  onPlayTrailer,
  onBookClick,
}: NetflixBillboardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Merge default showcase with any custom hero media from Admin
  const items: BillboardMedia[] = [
    ...customMedia.map((c, i) => ({
      id: `custom-${i}`,
      title: c.title || "Custom Featured Spotlight",
      tagline: "Curated directly via Admin Google Drive & Media Manager.",
      category: "Corporate Summit" as const,
      mediaUrl: c.url,
      type: c.type,
      matchRate: "100% Match",
      year: "2026",
      badges: ["Admin Spotlight", "Live Now"],
    })),
    ...DEFAULT_BILLBOARD_ITEMS,
  ];

  // Auto-cycle billboard media every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[currentIndex] || items[0];

  return (
    <div className="relative w-full min-h-[82vh] lg:min-h-[90vh] flex items-center justify-start overflow-hidden bg-black text-white pt-20 pb-16">
      {/* Background Media Layer with continuous transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{ transition: "opacity 1.2s ease, transform 6s ease-out" }}
          >
            {item.type === "video" ? (
              <iframe
                src={item.mediaUrl}
                title={item.title}
                className="w-full h-full object-cover pointer-events-none scale-125"
                allow="autoplay; muted"
              />
            ) : (
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover object-top opacity-55"
              />
            )}
          </div>
        ))}

        {/* Netflix-Style Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent z-10 w-full lg:w-[65%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/60 z-10" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 w-full">
        <div className="max-w-2xl space-y-4">
          {/* Top Series / Live Badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded bg-[#CC2936] text-white font-bold text-[10px] tracking-widest uppercase shadow-md">
              LIVE STAGE
            </span>
            <span className="text-[#C9A84C] font-mono text-xs tracking-widest uppercase font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> The Radhaa Dudeja Experience
            </span>
          </div>

          {/* Main Hero Name */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            Radha <span className="text-[#C9A84C]">Dudeja</span>
          </h1>

          {/* Subtitle / Category metadata */}
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold flex-wrap">
            <span className="text-[#46d369]">{current.matchRate}</span>
            <span className="text-[#888]">{current.year}</span>
            <span className="px-1.5 py-0.5 border border-white/20 rounded text-[10px] font-mono text-white/80">
              500+ SHOWS
            </span>
            <span className="text-[#A0A0A0]">Hindi · English · Punjabi</span>
          </div>

          {/* Currently playing spotlight item description */}
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#C9A84C] font-semibold">
              Now Playing: {current.category}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              {current.tagline}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              onClick={() => onPlayTrailer({ url: current.mediaUrl, title: current.title, type: current.type })}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#E2C775] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#C9A84C]/20"
            >
              <Play className="w-4 h-4 fill-black" /> Watch Media Cut
            </button>

            <button
              onClick={onBookClick}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md"
            >
              <Calendar className="w-4 h-4 text-[#C9A84C]" /> Reserve Dates
            </button>

            <GoogleReviewsBadge variant="compact" />
          </div>
        </div>

        {/* Carousel Slide Indicators & Controls (Bottom Right) */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-12 lg:right-12 flex items-center gap-4 z-20">
          <div className="flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-[#C9A84C]" : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
              className="w-8 h-8 rounded-full bg-black/60 border border-white/20 hover:border-[#C9A84C] text-white flex items-center justify-center transition-all"
              title="Previous reel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="w-8 h-8 rounded-full bg-black/60 border border-white/20 hover:border-[#C9A84C] text-white flex items-center justify-center transition-all"
              title="Next reel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
