import React from "react";
import { Sparkles, Building2, Crown } from "lucide-react";

interface BrandItem {
  name: string;
  category: "enterprise" | "palace";
  city?: string;
}

const BRAND_ROSTER: BrandItem[] = [
  { name: "Google Cloud", category: "enterprise" },
  { name: "Taj Lake Palace", category: "palace", city: "Udaipur" },
  { name: "Tata Motors", category: "enterprise" },
  { name: "Umaid Bhawan Palace", category: "palace", city: "Jodhpur" },
  { name: "Microsoft AI Summit", category: "enterprise" },
  { name: "The Leela Palace", category: "palace", city: "New Delhi" },
  { name: "Infosys Leadership", category: "enterprise" },
  { name: "ITC Grand Bharat", category: "palace", city: "Gurugram" },
  { name: "Deloitte India", category: "enterprise" },
  { name: "Rambagh Palace", category: "palace", city: "Jaipur" },
  { name: "Aditya Birla Group", category: "enterprise" },
  { name: "JW Marriott Walnut Grove", category: "palace", city: "Mussoorie" },
  { name: "Forbes India", category: "enterprise" },
  { name: "W Goa", category: "palace", city: "Vagator" },
];

export default function BrandMarquee() {
  return (
    <section className="relative py-8 bg-black/80 border-y border-[#C9A84C]/20 overflow-hidden backdrop-blur-md">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
        <span className="text-[11px] font-mono tracking-widest text-[#C9A84C] uppercase font-semibold">
          Trusted by Fortune 500 Enterprises & India's Premier Heritage Palaces
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
      </div>

      {/* Infinite scrolling ribbon */}
      <div className="flex w-max space-x-8 animate-marquee select-none items-center">
        {[...BRAND_ROSTER, ...BRAND_ROSTER].map((brand, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#C9A84C]/40 hover:bg-white/[0.06] transition-all group shrink-0"
          >
            {brand.category === "palace" ? (
              <Crown className="w-3.5 h-3.5 text-[#E2C775] opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Building2 className="w-3.5 h-3.5 text-[#C9A84C] opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
            <span className="text-xs font-serif tracking-wider text-neutral-300 group-hover:text-white transition-colors">
              {brand.name}
            </span>
            {brand.city && (
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                · {brand.city}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
