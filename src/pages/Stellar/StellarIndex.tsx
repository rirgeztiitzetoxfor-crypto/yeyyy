import React, { useEffect, useState, useRef } from "react";
import { useSiteMedia, type SiteMedia } from "@/hooks/useSiteMedia";
import RadhaaLogo from "@/components/RadhaaLogo";
import SocialChannelsBar from "@/components/SocialChannelsBar";
import MotionVideoBackground from "@/components/MotionVideoBackground";
import ParticleBackground from "@/components/ParticleBackground";
import TiltCard from "@/components/TiltCard";
import BrandMarquee from "@/components/BrandMarquee";
import LuxuryLeadGenerator from "@/components/LuxuryLeadGenerator";
import { resolveSlotMedia } from "@/lib/siteSlots";
import {
  Briefcase,
  Heart,
  Play,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Award,
  Users,
  Calendar,
  Star,
  CheckCircle,
  Globe,
  Film,
  Instagram,
  Youtube,
} from "lucide-react";
import "./Stellar.css";

interface ShowcaseItem {
  id: string;
  url: string;
  title: string;
  category: "corporate" | "weddings" | "reels";
  type: "image" | "video";
  badge?: string;
  aspectRatio?: string;
  duration?: string;
}

export default function StellarIndex() {
  const { media, settings } = useSiteMedia();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption: string; type: "image" | "video" } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "corporate" | "weddings" | "reels">("all");

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  // Dynamic Hero Billboard Slot
  const heroSlot = resolveSlotMedia("hero_billboard", media);
  const aboutPortrait = resolveSlotMedia("about_portrait", media);

  // Unified, Non-Repetitive Curated Showcase
  // Every asset appears exactly ONCE.
  const showcaseItems: ShowcaseItem[] = [
    {
      id: "corp-1",
      url: resolveSlotMedia("corp_rail_1", media).url || "/images/img_14.jpg",
      title: resolveSlotMedia("corp_rail_1", media).title || "National Leadership Tech Summit 2026",
      category: "corporate",
      type: resolveSlotMedia("corp_rail_1", media).type,
      badge: "Tech Summit",
      aspectRatio: resolveSlotMedia("corp_rail_1", media).aspect_ratio || "16/9",
      duration: "0:45 min",
    },
    {
      id: "wed-1",
      url: resolveSlotMedia("wed_rail_1", media).url || "/images/img_28.jpg",
      title: resolveSlotMedia("wed_rail_1", media).title || "Electric Sangeet Night MC & Dance Cues",
      category: "weddings",
      type: resolveSlotMedia("wed_rail_1", media).type,
      badge: "Royal Sangeet",
      aspectRatio: resolveSlotMedia("wed_rail_1", media).aspect_ratio || "4/5",
      duration: "1:15 min",
    },
    {
      id: "corp-2",
      url: resolveSlotMedia("corp_rail_2", media).url || "/images/img_06.jpg",
      title: resolveSlotMedia("corp_rail_2", media).title || "Brand Launch & Keynote Reveal Gala",
      category: "corporate",
      type: resolveSlotMedia("corp_rail_2", media).type,
      badge: "Brand Launch",
      aspectRatio: resolveSlotMedia("corp_rail_2", media).aspect_ratio || "16/9",
      duration: "0:30 min",
    },
    {
      id: "wed-2",
      url: resolveSlotMedia("wed_rail_2", media).url || "/images/img_01.jpg",
      title: resolveSlotMedia("wed_rail_2", media).title || "Royal Varmala Direction & Sacred Entrance",
      category: "weddings",
      type: resolveSlotMedia("wed_rail_2", media).type,
      badge: "Varmala Story",
      aspectRatio: resolveSlotMedia("wed_rail_2", media).aspect_ratio || "4/5",
    },
    {
      id: "reel-1",
      url: resolveSlotMedia("games_rail_1", media).url || "/images/img_33.jpg",
      title: resolveSlotMedia("games_rail_1", media).title || "Signature Couple Roast & Shoe Game",
      category: "reels",
      type: resolveSlotMedia("games_rail_1", media).type,
      badge: "Crowd Magic",
      aspectRatio: "9/16",
      duration: "Reel",
    },
    {
      id: "corp-3",
      url: resolveSlotMedia("corp_rail_3", media).url || "/images/img_11.jpg",
      title: resolveSlotMedia("corp_rail_3", media).title || "Annual Fortune 500 Awards Gala",
      category: "corporate",
      type: resolveSlotMedia("corp_rail_3", media).type,
      badge: "Black Tie",
      aspectRatio: resolveSlotMedia("corp_rail_3", media).aspect_ratio || "16/9",
    },
    {
      id: "wed-3",
      url: resolveSlotMedia("wed_rail_4", media).url || "/images/img_32.jpg",
      title: resolveSlotMedia("wed_rail_4", media).title || "Haldi & Mehendi Afternoon Fiesta",
      category: "weddings",
      type: resolveSlotMedia("wed_rail_4", media).type,
      badge: "Phoolon Ki Holi",
      aspectRatio: resolveSlotMedia("wed_rail_4", media).aspect_ratio || "4/5",
    },
    {
      id: "reel-2",
      url: resolveSlotMedia("wed_rail_3", media).url || "/images/img_25.jpg",
      title: resolveSlotMedia("wed_rail_3", media).title || "Sangeet Dance Battles & DJ Coordination",
      category: "reels",
      type: resolveSlotMedia("wed_rail_3", media).type,
      badge: "Dance Battle",
      aspectRatio: "9/16",
      duration: "Reel",
    },
  ];

  // Filter items
  const filteredShowcase = showcaseItems.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let stopCursor = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateRing = () => {
      if (stopCursor) return;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRef.current && cursorRingRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorRingRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", onMouseMove);
    animateRing();

    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      stopCursor = true;
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const cleanWhatsAppNumber = (settings.whatsapp_number || "919876543210").replace(/[^0-9]/g, "");

  return (
    <div className="stellar-wrapper relative overflow-hidden bg-[#0A0A0A] text-white">
      {/* Background Ambience */}
      <MotionVideoBackground variant="fullscreen" overlayOpacity={0.72} accentColor="gold" />
      <ParticleBackground />

      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="lightbox active" onClick={() => setLightboxItem(null)}>
          <div className="lightbox-close" onClick={() => setLightboxItem(null)}>
            ✕
          </div>
          <div className="max-w-4xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            {lightboxItem.type === "video" ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
                <iframe
                  src={lightboxItem.url}
                  title={lightboxItem.caption}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.caption}
                className="max-h-[85vh] max-w-full mx-auto rounded-xl shadow-2xl object-contain"
              />
            )}
            <p className="text-center text-sm text-[#C9A84C] mt-3 font-medium tracking-wide">
              {lightboxItem.caption}
            </p>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href="#showcase" onClick={() => setIsMenuOpen(false)}>Showcase</a>
        <a href="/corporate" onClick={() => setIsMenuOpen(false)}>Corporate</a>
        <a href="/weddings" onClick={() => setIsMenuOpen(false)}>Weddings & Sangeet</a>
        <a href="#about" onClick={() => setIsMenuOpen(false)}>About Radhaa</a>
        <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Reviews</a>
        <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-[#C9A84C] font-bold">Book Now</a>
        <a href="/admin" onClick={() => setIsMenuOpen(false)} className="text-xs text-neutral-400">Admin Portal</a>
      </div>

      {/* Navigation */}
      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <a href="/" className="no-underline">
          <RadhaaLogo variant="navbar" />
        </a>
        <ul className="nav-links">
          <li><a href="#showcase">Showcase</a></li>
          <li><a href="/corporate" className="hover:text-[#C9A84C] transition-colors">Corporate</a></li>
          <li><a href="/weddings" className="hover:text-[#CC2936] transition-colors">Weddings</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#booking" className="nav-cta">Book Now</a></li>
        </ul>
        <div
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span /><span /><span />
        </div>
      </nav>

      {/* CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Premier Anchor · Corporate Emcee · Luxury Sangeet Host</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Elevating India's <br />
            <span className="text-gold-gradient">Finest Stages</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            From Fortune 500 leadership summits to royal destination sangeets. Radhaa Dudeja brings commanding bilingual authority, effortless warmth, and electrifying crowd presence.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToBooking}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A84C]/20 flex items-center gap-2"
            >
              <span>Book Radhaa</span> <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=Hi%20Radhaa,%20I%20would%20like%20to%20inquire%20about%20your%20availability%20for%20an%20event.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-xl bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-all shadow-md flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              WhatsApp Direct
            </a>

            <button
              onClick={() =>
                setLightboxItem({
                  url: heroSlot.url || "https://www.youtube.com/embed/dQw4w9WgXcQ",
                  caption: heroSlot.title || "The Radhaa Dudeja Showreel",
                  type: heroSlot.type || "video",
                })
              }
              className="px-6 py-4 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Watch Showreel
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A84C]">500+</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Stages Commanded</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">8+</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Years Mastery</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A84C]">3</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Languages Fluent</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">5.0 ★</div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Google Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY VENUES & BRANDS MARQUEE */}
      <BrandMarquee />

      {/* TWO CORE SPECIALIZATIONS */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-mono">
            Specialized Hosting Disciplines
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-2">
            Tailored Stagecraft for Every Room
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Corporate Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#C9A84C]/30 bg-gradient-to-br from-neutral-900 to-[#121008] p-8 hover:border-[#C9A84C] transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-white font-bold group-hover:text-[#C9A84C] transition-colors">
                Corporate Summits & Awards
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                Poised CXO moderations, Fortune 500 keynote delivery, teleprompter mastery, and strict protocol management. Zero dead air, total authority.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10">
              <a
                href="/corporate"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A84C] hover:underline uppercase tracking-wider"
              >
                Explore Corporate Portal <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Weddings Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-[#CC2936]/40 bg-gradient-to-br from-neutral-900 to-[#1C0A0D] p-8 hover:border-[#CC2936] transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#CC2936]/20 border border-[#CC2936]/40 flex items-center justify-center text-[#F06292] mb-4">
                <Heart className="w-6 h-6 fill-[#CC2936] text-[#CC2936]" />
              </div>
              <h3 className="text-2xl font-serif text-white font-bold group-hover:text-[#F06292] transition-colors">
                Luxury Weddings & Sangeet
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
                High-voltage dance performance transitions, emotional bridal entrance storytelling, and signature couple roasts that get every generation laughing and dancing.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10">
              <a
                href="/weddings"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#F06292] hover:underline uppercase tracking-wider"
              >
                Explore Weddings Portal <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED STAGE SHOWCASE (ZERO REPETITION) */}
      <section id="showcase" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A84C] mb-1">
              <Film className="w-3.5 h-3.5" />
              <span>Curated Media Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-white font-bold">
              Moments from the Stage
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md">
              Highlights from national summits, royal sangeets, and interactive crowd engagement.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-white/10 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "all" ? "bg-[#C9A84C] text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("corporate")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "corporate" ? "bg-[#C9A84C] text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Corporate
            </button>
            <button
              onClick={() => setActiveFilter("weddings")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "weddings" ? "bg-[#CC2936] text-white font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Weddings
            </button>
            <button
              onClick={() => setActiveFilter("reels")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === "reels" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
            >
              Reels
            </button>
          </div>
        </div>

        {/* Clean Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredShowcase.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setLightboxItem({
                  url: item.url,
                  caption: item.title,
                  type: item.type,
                })
              }
              className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-[#C9A84C]/50 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div
                className={`relative overflow-hidden w-full bg-black ${
                  item.aspectRatio === "9/16" ? "aspect-[9/16]" : item.aspectRatio === "4/5" ? "aspect-[4/5]" : "aspect-[16/9]"
                }`}
              >
                {item.type === "video" ? (
                  <iframe
                    src={item.url}
                    title={item.title}
                    className="w-full h-full pointer-events-none"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 group-hover:opacity-90 transition-opacity" />

                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#C9A84C] border border-[#C9A84C]/30">
                    {item.badge}
                  </span>
                )}

                {/* Play / Inspect Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {item.duration && (
                  <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded">
                    {item.duration}
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <h4 className="text-xs font-medium text-white line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT RADHAA */}
      <section id="about" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#C9A84C]/30 shadow-2xl relative">
              <img
                src={aboutPortrait.url || "/images/img_13.jpg"}
                alt={aboutPortrait.title || "Radhaa Dudeja on Stage"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>

          <div className="space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-mono">
              The Voice Behind The Energy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold">
              Rooted in the Hills, Commanding Stages Across India
            </h2>
            <div className="h-0.5 w-16 bg-[#C9A84C]" />

            <p className="text-sm text-neutral-300 leading-relaxed">
              Radhaa Dudeja brings effortless magnetism, sharp wit, and deep emotional resonance to every gathering. Born in Ramnagar near the forests of Jim Corbett, her career spans over 500+ high-stakes events — from Fortune 500 summits to royal destination weddings.
            </p>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Her philosophy is simple: <em>engage the intellect, ignite the celebration</em>. Whether managing a live teleprompter during a brand launch or uniting 600 wedding guests on the dance floor, Radhaa makes every event unforgettable.
            </p>

            <div className="flex gap-2 flex-wrap pt-2">
              <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300">
                🇮🇳 Hindi
              </span>
              <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300">
                🌍 English
              </span>
              <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300">
                🎉 Punjabi
              </span>
            </div>

            <div className="pt-4 flex gap-4">
              <button onClick={scrollToBooking} className="btn-primary">
                Book Radhaa
              </button>
              <a
                href={settings.youtube_url || "https://www.youtube.com/@anchorrd8794"}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost flex items-center gap-1.5"
              >
                <Youtube className="w-4 h-4 text-red-400" /> Watch YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED REVIEWS & SOCIAL PROOF */}
      <section id="reviews" className="py-20 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-bold">
            Google Verified 5.0 Star Rating
          </h2>
          <p className="text-xs text-neutral-400 mt-2">
            Read verified feedback from corporate directors and wedding families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
              "Radhaa held our Fortune 500 summit audience completely captivated. Her bilingual delivery between technical sessions was flawless."
            </p>
            <div>
              <div className="text-xs font-bold text-white">Priya Sharma</div>
              <div className="text-[11px] text-[#C9A84C]">HR Director · Tech Leadership Summit, Delhi</div>
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
              "She didn't just host our Sangeet, she made our entire family feel at home. Even our strictest grandparents were laughing on stage!"
            </p>
            <div>
              <div className="text-xs font-bold text-white">Ananya & Rohan Mehta</div>
              <div className="text-[11px] text-[#F06292]">Destination Wedding Couple · Jim Corbett</div>
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
              "When our stage AV encountered a 30-minute glitch, Radhaa kept 700 delegates entertained with spontaneous crowd games. Total lifesaver."
            </p>
            <div>
              <div className="text-xs font-bold text-white">Vikram Negi</div>
              <div className="text-[11px] text-[#C9A84C]">Event Director · Brand Activation Summit</div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE LEAD GENERATION TOOL & BOOKING DESK */}
      <section id="booking" className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5">
        <LuxuryLeadGenerator
          whatsappNumber={settings.whatsapp_number}
          defaultVertical="corporate"
        />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <RadhaaLogo variant="navbar" showSubtitle={false} />
            <p className="text-xs text-neutral-500 mt-1 max-w-sm">
              The Radhaa Dudeja Experience · Premier Anchor & Corporate Emcee
            </p>
          </div>

          {/* Social Channels dynamically linked to Admin IDs */}
          <div className="flex items-center gap-4 text-neutral-400">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {settings.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-400 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            )}
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#25D366] transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            {settings.google_business_url && (
              <a
                href={settings.google_business_url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors"
                title="Google 5.0★"
              >
                <Star className="w-5 h-5" />
              </a>
            )}
            <a
              href="/admin"
              className="text-xs text-neutral-600 hover:text-[#C9A84C] transition-colors ml-4"
            >
              Admin
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-neutral-600">
          © {new Date().getFullYear()} Radhaa Dudeja. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp Action */}
      <a
        href={`https://wa.me/${cleanWhatsAppNumber}?text=Hi%20Radhaa,%20I%20am%20inquiring%20about%20booking%20you%20for%20an%20event.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full bg-[#25D366] text-black shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 font-bold text-xs"
      >
        <MessageCircle className="w-5 h-5 fill-black" />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
