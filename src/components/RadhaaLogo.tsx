import React from "react";

interface RadhaaLogoProps {
  variant?: "navbar" | "hero" | "footer" | "icon";
  className?: string;
  showSubtitle?: boolean;
}

export default function RadhaaLogo({
  variant = "navbar",
  className = "",
  showSubtitle = true,
}: RadhaaLogoProps) {
  if (variant === "icon") {
    return (
      <div className={`relative inline-block ${className}`}>
        <img
          src="/logo.png"
          alt="Radhaa Dudeja Logo"
          className="w-10 h-10 rounded-full object-cover shadow-lg border border-[#C9A84C]/40 hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 rounded-full bg-[#C9A84C]/10 blur-sm pointer-events-none" />
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={`flex flex-col items-center text-center group ${className}`}>
        <div className="relative mb-3">
          <img
            src="/logo.png"
            alt="Radhaa Dudeja Luxury Crest"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl border-2 border-[#C9A84C]/60 group-hover:scale-105 transition-all duration-300 ring-4 ring-[#C9A84C]/20"
          />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#C9A84C]/40 to-[#CC2936]/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
        <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F9E4B7] via-[#E2C775] to-[#C9A84C] drop-shadow-sm">
          RADHAA DUDEJA
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#C9A84C] mt-1">
            Premier Anchor & Corporate Emcee
          </span>
        )}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <div className="relative flex-shrink-0">
          <img
            src="/logo.png"
            alt="Radhaa Dudeja Logo"
            className="w-12 h-12 rounded-full object-cover border border-[#C9A84C]/50 shadow-md"
          />
          <div className="absolute inset-0 rounded-full bg-[#C9A84C]/15 blur-xs pointer-events-none" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-lg font-bold tracking-wide text-white">
            RADHAA <span className="text-[#C9A84C]">DUDEJA</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#888] font-medium">
            Premier Anchor & Corporate Emcee
          </span>
        </div>
      </div>
    );
  }

  // Default: "navbar"
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <div className="relative flex-shrink-0">
        <img
          src="/logo.png"
          alt="Radhaa Dudeja Logo"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#C9A84C]/60 shadow-md group-hover:scale-105 transition-transform duration-200 ring-2 ring-[#C9A84C]/20"
        />
        <div className="absolute inset-0 rounded-full bg-[#C9A84C]/10 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-serif text-base sm:text-lg font-bold tracking-wide text-white group-hover:text-[#E2C775] transition-colors">
          RADHAA <span className="text-[#C9A84C]">DUDEJA</span>
        </span>
        {showSubtitle && (
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-[#C9A84C] font-semibold">
            Premier Emcee
          </span>
        )}
      </div>
    </div>
  );
}

export { RadhaaLogo };
