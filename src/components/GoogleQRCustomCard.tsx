import React, { useState } from "react";
import { Star, QrCode, ExternalLink, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import TiltCard from "./TiltCard";

interface GoogleQRCustomCardProps {
  className?: string;
}

export default function GoogleQRCustomCard({ className = "" }: GoogleQRCustomCardProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const placeId = "ChIJlYrZi9s_CjkR-NmXydNGO-Q";
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const profileUrl = `https://local.google.com/place?placeid=${placeId}&utm_medium=noren&utm_source=gbp&utm_campaign=2026`;

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <TiltCard maxTilt={6}>
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#161616]/95 via-[#1E1912]/90 to-[#121212]/95 border border-[#C9A84C]/40 shadow-2xl backdrop-blur-xl">
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#CC2936]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left: QR Code & Badge */}
            <div className="flex flex-col items-center text-center">
              <div
                className="group relative cursor-pointer p-4 rounded-2xl bg-white/95 border-2 border-[#C9A84C] shadow-xl hover:scale-105 transition-all duration-300"
                onClick={() => setIsZoomed(true)}
                title="Click to expand Google Review QR Code"
              >
                <img
                  src="/google_qr_code.png"
                  alt="Scan to Review Radhaa Dudeja on Google"
                  className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-lg"
                  onError={(e) => {
                    // Fallback to Google API QR generator if local png fails
                    (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      reviewUrl
                    )}`;
                  }}
                />
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                  <QrCode className="w-4 h-4 text-[#C9A84C]" /> Tap to Enlarge
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#E2C775] font-medium tracking-wide">
                <QrCode className="w-3.5 h-3.5" /> Scan with Phone Camera
              </div>
            </div>

            {/* Right: Verified Profile Information */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2C775] text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#C9A84C]" /> Official Google Business Profile
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                  <span>The Radhaa Dudeja Experience</span>
                  <CheckCircle2 className="w-5 h-5 text-[#4285F4] flex-shrink-0" />
                </h3>
                <p className="text-sm text-[#C9A84C] font-medium mt-0.5">
                  Premier Anchor & Corporate Emcee
                </p>
              </div>

              {/* Rating summary */}
              <div className="flex items-center justify-center md:justify-start gap-3 py-1">
                <span className="text-3xl font-extrabold text-white">5.0</span>
                <div>
                  <div className="flex items-center text-[#FBBC05] text-lg leading-none">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-xs text-white/60">Verified Client Reviews on Google</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-lg">
                Rated 5-stars by Fortune 500 event directors, wedding planners, and corporate leaders across Delhi NCR, Mumbai, Jaipur, and Uttarakhand.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href={reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C9A84C] hover:bg-[#b8953d] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[#C9A84C]/25"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  Write a Google Review
                </a>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs tracking-wider transition-all border border-white/15"
                >
                  View Profile <ExternalLink className="w-3.5 h-3.5 text-[#C9A84C]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Enlarged QR Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative bg-[#1A1A1A] border border-[#C9A84C]/60 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-lg p-2"
            >
              ✕
            </button>
            <h4 className="text-lg font-bold text-white mb-1">Scan to Review</h4>
            <p className="text-xs text-[#C9A84C] mb-6">The Radhaa Dudeja Experience</p>
            <div className="bg-white p-4 rounded-2xl mx-auto w-fit shadow-xl border-2 border-[#C9A84C]">
              <img
                src="/google_qr_code.png"
                alt="Google Review QR Code"
                className="w-56 h-56 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    reviewUrl
                  )}`;
                }}
              />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-[#C9A84C] text-black font-semibold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2"
              >
                Open Direct Review Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsZoomed(false)}
                className="w-full py-2 text-xs text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { GoogleQRCustomCard };

