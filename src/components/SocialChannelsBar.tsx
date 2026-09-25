import React from "react";
import { Youtube, Instagram, Facebook, MessageCircle, ExternalLink, Star } from "lucide-react";
import { useSiteMedia } from "@/hooks/useSiteMedia";

interface SocialChannelsBarProps {
  variant?: "floating" | "section" | "minimal";
  className?: string;
}

export default function SocialChannelsBar({
  variant = "section",
  className = "",
}: SocialChannelsBarProps) {
  const { settings } = useSiteMedia();

  const channels = [
    {
      name: "Instagram",
      handle: "@radha_dudeja_",
      label: "Reels & Behind the Scenes",
      url: settings.instagram_url || "https://www.instagram.com/radha_dudeja_/",
      icon: Instagram,
      color: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
      btnText: "Follow on IG",
    },
    {
      name: "YouTube",
      handle: "@anchorrd8794",
      label: "Showreels & Live Energy",
      url: settings.youtube_url || "https://www.youtube.com/@anchorrd8794",
      icon: Youtube,
      color: "from-[#FF0000] to-[#CC0000]",
      btnText: "Subscribe",
    },
    {
      name: "Facebook",
      handle: "Radhaa Dudeja",
      label: "Community & Event Photos",
      url: settings.facebook_url || "https://www.facebook.com/profile.php?id=100091785037914",
      icon: Facebook,
      color: "from-[#1877F2] to-[#0D65D9]",
      btnText: "Connect",
    },
    {
      name: "Google Reviews",
      handle: "5.0 ★ Rating",
      label: "Verified Event Reviews",
      url: settings.google_business_url || "https://search.google.com/local/writereview?placeid=ChIJ-RadhaDudeja",
      icon: Star,
      color: "from-[#4285F4] via-[#34A853] to-[#FBBC05]",
      btnText: "Read Reviews",
    },
  ];

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#0E0E0E]/95 backdrop-blur-md border border-[#C9A84C]/40 p-2 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] ${className}`}>
        {channels.map((ch) => {
          const Icon = ch.icon;
          return (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${ch.name}: ${ch.handle}`}
              className="p-2.5 rounded-full text-white/80 hover:text-[#C9A84C] hover:bg-white/5 transition-all hover:scale-110"
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
        <div className="w-[1px] h-5 bg-white/20 mx-1" />
        <a
          href={`https://wa.me/${(settings.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}?text=Hi%20Radha,%20I%20would%20like%20to%20inquire%20about%20booking%20you%20for%20an%20event.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-black font-semibold text-xs hover:bg-[#20ba59] transition-all shadow-md"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-black" />
          <span>WhatsApp</span>
        </a>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {channels.map((ch) => {
        const Icon = ch.icon;
        return (
          <a
            key={ch.name}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#141414]/90 border border-white/10 hover:border-[#C9A84C]/60 hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-1 shadow-xl overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${ch.color} opacity-10 rounded-full blur-xl group-hover:opacity-25 transition-opacity`} />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-white group-hover:text-[#C9A84C] group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm tracking-wide group-hover:text-[#C9A84C] transition-colors">
                    {ch.name}
                  </h4>
                  <p className="text-[#C9A84C] text-xs font-mono font-medium">
                    {ch.handle}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-[#8A8A8A]">{ch.label}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 group-hover:text-[#C9A84C] transition-colors">
                {ch.btnText} →
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
