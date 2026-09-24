import React, { useState, useMemo } from "react";
import { Play, Sparkles, Film, Heart, Briefcase, Filter, ExternalLink, Flame, Trophy, Users, Music, Gamepad2, Calendar } from "lucide-react";
import TiltCard from "./TiltCard";
import type { SiteMedia } from "@/hooks/useSiteMedia";

export interface VaultVideoItem {
  id: string;
  title: string;
  subgroup: "sangeet" | "haldi" | "group_games" | "varmala" | "summits" | "awards" | "offsites" | "brand_launch" | string;
  vertical: "corporate" | "weddings_sangeet";
  thumbnail: string;
  videoUrl: string;
  duration: string;
  badge?: string;
  tagline: string;
}

// Curated Master Presets for both Verticals
const DEFAULT_WEDDING_VIDEOS: VaultVideoItem[] = [
  {
    id: "wed-sangeet-1",
    title: "Electric Sangeet Night MC & Bride-Groom Dance Cues",
    subgroup: "sangeet",
    vertical: "weddings_sangeet",
    thumbnail: "/images/img_28.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:45",
    badge: "Trending Reel",
    tagline: "High-voltage stage choreography coordination, crowd hype, and DJ synchronization.",
  },
  {
    id: "wed-haldi-1",
    title: "Haldi & Mehendi Fiesta — Punjabi Dhol & Phoolon Ki Holi",
    subgroup: "haldi",
    vertical: "weddings_sangeet",
    thumbnail: "/images/img_32.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "0:58",
    badge: "Crowd Favorite",
    tagline: "Sun-soaked afternoon music coordination and impromptu family dance-offs.",
  },
  {
    id: "wed-games-1",
    title: "Signature Family Games: The Couple Roast & Shoe Game",
    subgroup: "group_games",
    vertical: "weddings_sangeet",
    thumbnail: "/images/img_33.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:10",
    badge: "Viral Game",
    tagline: "Hilarious interactive Q&A testing couple chemistry with both families roaring in laughter.",
  },
  {
    id: "wed-games-2",
    title: "Grandparents' Antakshari & Table Relay Battle",
    subgroup: "group_games",
    vertical: "weddings_sangeet",
    thumbnail: "/images/img_25.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:35",
    badge: "Pure Nostalgia",
    tagline: "Bridging 3 generations on the microphone with retro Hindi melodies and singing showdowns.",
  },
  {
    id: "wed-varmala-1",
    title: "Royal Varmala Direction & Sacred Entrance Narration",
    subgroup: "varmala",
    vertical: "weddings_sangeet",
    thumbnail: "/images/img_01.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:15",
    badge: "Cinematic",
    tagline: "Poetic Hindi shlokas and emotional narration as the bride and groom exchange garlands.",
  },
  {
    id: "wed-sangeet-2",
    title: "Larkiwale vs. Ladkewale Sangeet Face-Off Battle",
    subgroup: "sangeet",
    vertical: "weddings_sangeet",
    thumbnail: "/images/img_24.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:05",
    badge: "High Energy",
    tagline: "Competitive dance battle between bride and groom sides judged by audience applause.",
  },
];

const DEFAULT_CORPORATE_VIDEOS: VaultVideoItem[] = [
  {
    id: "corp-summit-1",
    title: "National Tech Leadership Summit 2026 Keynote Opening",
    subgroup: "summits",
    vertical: "corporate",
    thumbnail: "/images/img_14.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:30",
    badge: "Keynote Emcee",
    tagline: "Bilingual fireside chat moderation and dignitary speaker introductions for 800+ executives.",
  },
  {
    id: "corp-awards-1",
    title: "Fortune 500 Annual Leadership & Excellence Awards Gala",
    subgroup: "awards",
    vertical: "corporate",
    thumbnail: "/images/img_11.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:50",
    badge: "Black Tie",
    tagline: "Pacing 40 trophy categories with high glamour, poise, and zero dead time.",
  },
  {
    id: "corp-offsites-1",
    title: "Executive Offsite Interactive Icebreakers & Team Building",
    subgroup: "offsites",
    vertical: "corporate",
    thumbnail: "/images/img_13.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:20",
    badge: "Energizer",
    tagline: "High-engagement corporate games breaking cross-department silos in a relaxed luxury resort setting.",
  },
  {
    id: "corp-launch-1",
    title: "National Product Reveal & Dramatic Countdown Showcase",
    subgroup: "brand_launch",
    vertical: "corporate",
    thumbnail: "/images/img_20.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "1:40",
    badge: "Reveal Moment",
    tagline: "Dramatic AV cues, audience countdown hype, and spotlight management.",
  },
  {
    id: "corp-summit-2",
    title: "Global Industry Leaders Panel & Fireside Moderation",
    subgroup: "summits",
    vertical: "corporate",
    thumbnail: "/images/img_06.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:15",
    badge: "Executive Panel",
    tagline: "Sharp, insightful questions steering C-suite panelists and international delegates.",
  },
];

interface MasterVideoVaultProps {
  dynamicMedia?: SiteMedia[];
  onPlayVideo: (item: { url: string; caption: string }) => void;
  onBookClick?: () => void;
}

export default function MasterVideoVault({
  dynamicMedia = [],
  onPlayVideo,
  onBookClick,
}: MasterVideoVaultProps) {
  const [selectedVertical, setSelectedVertical] = useState<"weddings_sangeet" | "corporate">("weddings_sangeet");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Merge dynamic uploaded videos from Admin with presets
  const allWeddingVideos = useMemo(() => {
    const dynamic = dynamicMedia
      .filter((m) => (m.vertical === "weddings_sangeet" || m.category === "weddings_sangeet") && m.media_type === "video")
      .map((m) => ({
        id: m.id || m.slot_id,
        title: m.alt_text || "Wedding Highlight Video",
        subgroup: m.subgroup || "sangeet",
        vertical: "weddings_sangeet" as const,
        thumbnail: m.source === "youtube" ? "/images/img_28.jpg" : m.media_url,
        videoUrl: m.media_url,
        duration: m.duration || "1:00",
        badge: m.badge || "Live Clip",
        tagline: "Uploaded via Google Drive / YouTube admin manager.",
      }));
    return [...dynamic, ...DEFAULT_WEDDING_VIDEOS];
  }, [dynamicMedia]);

  const allCorporateVideos = useMemo(() => {
    const dynamic = dynamicMedia
      .filter((m) => (m.vertical === "corporate" || m.category === "corporate") && m.media_type === "video")
      .map((m) => ({
        id: m.id || m.slot_id,
        title: m.alt_text || "Corporate Event Video",
        subgroup: m.subgroup || "summits",
        vertical: "corporate" as const,
        thumbnail: m.source === "youtube" ? "/images/img_14.jpg" : m.media_url,
        videoUrl: m.media_url,
        duration: m.duration || "1:15",
        badge: m.badge || "Executive Clip",
        tagline: "Uploaded via Google Drive / YouTube admin manager.",
      }));
    return [...dynamic, ...DEFAULT_CORPORATE_VIDEOS];
  }, [dynamicMedia]);

  const currentVideos = selectedVertical === "weddings_sangeet" ? allWeddingVideos : allCorporateVideos;

  const weddingFilters = [
    { id: "all", label: "All Wedding Clips", icon: Film },
    { id: "sangeet", label: "💃 Sangeet & Dance Cues", icon: Music },
    { id: "haldi", label: "💛 Haldi & Mehendi", icon: Sparkles },
    { id: "group_games", label: "🎯 Family Games & Activities", icon: Gamepad2 },
    { id: "varmala", label: "💍 Varmala & Entrances", icon: Heart },
  ];

  const corporateFilters = [
    { id: "all", label: "All Corporate Clips", icon: Film },
    { id: "summits", label: "💼 Tech Summits & Keynotes", icon: Briefcase },
    { id: "awards", label: "🏆 Award Galas & Firesides", icon: Trophy },
    { id: "offsites", label: "⚡ Offsites & Icebreakers", icon: Flame },
    { id: "brand_launch", label: "🚀 Brand Reveals & Launches", icon: Users },
  ];

  const currentFilterList = selectedVertical === "weddings_sangeet" ? weddingFilters : corporateFilters;

  const filteredVideos = useMemo(() => {
    if (activeFilter === "all") return currentVideos;
    return currentVideos.filter((v) => v.subgroup.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [currentVideos, activeFilter]);

  return (
    <section id="master-vault" className="py-20 bg-[#0C0C0C] border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E2C775] text-xs font-semibold tracking-wider uppercase mb-3">
            <Film className="w-3.5 h-3.5 text-[#C9A84C]" /> Master Video Collections
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            The Complete <span className="text-[#C9A84C]">Video Vault</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0] mt-3">
            Categorized reels and live stage clips — inspect Sangeet dance cues, Haldi energy, signature family games, keynote moderations, and black-tie awards galas.
          </p>
        </div>

        {/* Master Vertical Selector Switch (Weddings vs Corporate) */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#161616] p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 shadow-2xl">
            <button
              onClick={() => {
                setSelectedVertical("weddings_sangeet");
                setActiveFilter("all");
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                selectedVertical === "weddings_sangeet"
                  ? "bg-gradient-to-r from-[#CC2936] to-[#E53935] text-white shadow-lg shadow-[#CC2936]/25"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Weddings & Sangeet Vault</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">
                {allWeddingVideos.length}
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedVertical("corporate");
                setActiveFilter("all");
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                selectedVertical === "corporate"
                  ? "bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black shadow-lg shadow-[#C9A84C]/25 font-bold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Corporate Events Vault</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 font-mono">
                {allCorporateVideos.length}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Group Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {currentFilterList.map((f) => {
            const Icon = f.icon;
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isSelected
                    ? selectedVertical === "weddings_sangeet"
                      ? "bg-[#CC2936] text-white shadow-md border border-[#CC2936]"
                      : "bg-[#C9A84C] text-black shadow-md border border-[#C9A84C] font-semibold"
                    : "bg-[#181818] text-white/70 hover:text-white hover:bg-[#222] border border-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group/vault-card cursor-pointer"
              onClick={() => onPlayVideo({ url: video.videoUrl, caption: video.title })}
            >
              <TiltCard maxTilt={6} className="h-full">
                <div className="bg-[#141414] rounded-2xl overflow-hidden border border-white/10 group-hover/vault-card:border-[#C9A84C]/80 shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/vault-card:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover/vault-card:opacity-90" />

                    {/* Badge & Duration */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      {video.badge && (
                        <span
                          className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md"
                          style={{
                            backgroundColor: selectedVertical === "weddings_sangeet" ? "#CC2936" : "#C9A84C",
                            color: selectedVertical === "weddings_sangeet" ? "#fff" : "#000",
                          }}
                        >
                          {video.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/20">
                        {video.duration}
                      </span>
                    </div>

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#C9A84C] text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover/vault-card:scale-110 transition-transform duration-200">
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-white group-hover/vault-card:text-[#E2C775] transition-colors line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-[#888] mt-2 line-clamp-2 leading-relaxed">
                        {video.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[#C9A84C] font-medium flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" /> Watch Reel
                      </span>
                      <span className="text-[#666] font-mono text-[10px] uppercase">
                        {video.subgroup.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action strip */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#141414] border border-[#C9A84C]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center flex-shrink-0 text-[#C9A84C]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Have a specific event theme in mind?
              </h4>
              <p className="text-xs text-[#888] mt-0.5">
                Radhaa tailors stage games, bilingual scripting, and roast cues specifically for your family or company.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#booking"
              className="px-6 py-3 rounded-full bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-lg"
            >
              Inquire for This Format
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export { MasterVideoVault };
