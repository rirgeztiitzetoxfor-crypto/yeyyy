import React from "react";
import { Star, ExternalLink, CheckCircle } from "lucide-react";
import { useSiteMedia } from "@/hooks/useSiteMedia";

interface GoogleReviewsBadgeProps {
  className?: string;
  variant?: "compact" | "full";
}

export default function GoogleReviewsBadge({
  className = "",
  variant = "full",
}: GoogleReviewsBadgeProps) {
  const { settings } = useSiteMedia();

  const gmbUrl = settings.google_business_url || "https://search.google.com/local/writereview?placeid=ChIJlYrZi9s_CjkR-NmXydNGO-Q";
  const rating = settings.google_rating || "5.0";
  const reviewsCount = settings.google_reviews_count || "150+";

  if (variant === "compact") {
    return (
      <a
        href={gmbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 bg-[#121212]/90 border border-[#C9A84C]/40 hover:border-[#C9A84C] px-3.5 py-1.5 rounded-full text-xs transition-all hover:scale-105 shadow-lg group ${className}`}
      >
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="font-semibold text-white tracking-wide">{rating}</span>
        <div className="flex text-[#FFD700] text-[11px]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
          ))}
        </div>
        <span className="text-[#A0A0A0] text-[11px]">({reviewsCount} Google Reviews)</span>
        <ExternalLink className="w-3 h-3 text-[#C9A84C] group-hover:translate-x-0.5 transition-transform" />
      </a>
    );
  }

  return (
    <div
      className={`p-6 bg-gradient-to-br from-[#161616] to-[#0A0A0A] border border-[#C9A84C]/30 rounded-2xl shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-semibold text-base tracking-wide">
                Google Verified Rating
              </h4>
              <span className="flex items-center gap-1 text-[11px] text-[#4CD964] font-medium bg-[#4CD964]/10 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> 100% Recommended
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-white tracking-tight">{rating}</span>
              <div className="flex text-[#FFD700]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                ))}
              </div>
              <span className="text-sm text-[#A0A0A0]">
                Based on {reviewsCount} client experiences
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href={gmbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg"
          >
            Review Radhaa on Google
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
