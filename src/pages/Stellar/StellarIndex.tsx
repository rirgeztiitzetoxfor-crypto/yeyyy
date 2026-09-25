import React, { useEffect, useState, useRef } from "react";
import { useSiteMedia, type SiteMedia } from "@/hooks/useSiteMedia";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useBlog } from "@/hooks/useBlog";
import GoogleReviewsBadge from "@/components/GoogleReviewsBadge";
import GoogleQRCustomCard from "@/components/GoogleQRCustomCard";
import RadhaaLogo from "@/components/RadhaaLogo";
import SocialChannelsBar from "@/components/SocialChannelsBar";
import MotionVideoBackground from "@/components/MotionVideoBackground";
import ParticleBackground from "@/components/ParticleBackground";
import TiltCard from "@/components/TiltCard";
import NetflixBillboard from "@/components/NetflixBillboard";
import NetflixMediaRail, { type MediaRailItem } from "@/components/NetflixMediaRail";
import MasterVideoVault from "@/components/MasterVideoVault";
import GoogleCalendarBooking from "@/components/GoogleCalendarBooking";
import BrandMarquee from "@/components/BrandMarquee";
import RfpDeckGenerator from "@/components/RfpDeckGenerator";
import StagePriceEstimator from "@/components/StagePriceEstimator";
import confetti from "canvas-confetti";
import { resolveSlotMedia } from "@/lib/siteSlots";
import {
  Briefcase,
  Heart,
  Play,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  FileText,
  Sparkles,
  Award,
  Users,
  Music,
  Gamepad2,
  Calendar,
  ShieldCheck,
  Star,
  CheckCircle,
  Volume2,
} from "lucide-react";
import "./Stellar.css";

const baseCorporateRail: MediaRailItem[] = [
  { img: "images/img_14.jpg", caption: "National Leadership Tech Summit 2026", vertical: "corporate", type: "image", badge: "Trending" },
  { img: "images/img_06.jpg", caption: "Brand Launch & Keynote Reveal Gala", vertical: "corporate", type: "image", badge: "High Impact" },
  { img: "images/img_11.jpg", caption: "Annual Fortune 500 Awards Gala", vertical: "corporate", type: "image", badge: "Black Tie" },
  { img: "images/img_20.jpg", caption: "Executive Leadership Fireside Moderation", vertical: "corporate", type: "image", badge: "Exclusive" },
  { img: "images/img_13.jpg", caption: "Corporate Stagecraft & Executive Pacing", vertical: "corporate", type: "image" },
  { img: "images/img_22.jpg", caption: "International Delegations Gala Evening", vertical: "corporate", type: "image" },
];

const baseWeddingsRail: MediaRailItem[] = [
  { img: "images/img_28.jpg", caption: "Electric Sangeet Night MC & Dance Cues", vertical: "weddings_sangeet", type: "image", badge: "Crowd Favorite" },
  { img: "images/img_01.jpg", caption: "Royal Varmala Direction & Sacred Entrance", vertical: "weddings_sangeet", type: "image", badge: "Royalty" },
  { img: "images/img_25.jpg", caption: "Sangeet Dance Battles & DJ Coordination", vertical: "weddings_sangeet", type: "image", badge: "High Energy" },
  { img: "images/img_32.jpg", caption: "Haldi & Mehendi Afternoon Fiesta", vertical: "weddings_sangeet", type: "image", badge: "Festive" },
  { img: "images/img_33.jpg", caption: "Signature Family Games & Crowd Engagement", vertical: "weddings_sangeet", type: "image" },
  { img: "images/img_17.jpg", caption: "Destination Wedding Reception Gala", vertical: "weddings_sangeet", type: "image" },
];

const familyGamesRail: MediaRailItem[] = [
  { img: "images/img_33.jpg", caption: "The Couple Roast & Shoe Game", vertical: "weddings_sangeet", type: "image", badge: "Hilarious" },
  { img: "images/img_25.jpg", caption: "Grandparents' Antakshari Melodies", vertical: "weddings_sangeet", type: "image", badge: "Emotional" },
  { img: "images/img_28.jpg", caption: "Larkiwale vs. Ladkewale Dance Off", vertical: "weddings_sangeet", type: "image", badge: "Dance Battle" },
  { img: "images/img_11.jpg", caption: "Table Relay & Rapid Trivia Rush", vertical: "weddings_sangeet", type: "image", badge: "Interactive" },
];

export default function StellarIndex() {
  const { media, settings, getMediaUrl } = useSiteMedia();
  const { copy } = useSiteContent();
  const { blogs } = useBlog();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption: string; type: "image" | "video" } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [formStatus, setFormStatus] = useState("✨  Send Inquiry  ✨");
  const [selectedFormat, setSelectedFormat] = useState<"Corporate Summits & Awards" | "Luxury Weddings & Sangeet">("Corporate Summits & Awards");

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  // Dynamic Hero Billboard Slot
  const heroSlot = resolveSlotMedia("hero_billboard", media);

  // Dynamic items from Admin Google Drive / Supabase / Laptop
  const customHeroItems = [
    ...(heroSlot.isCustom
      ? [{ url: heroSlot.url, title: heroSlot.title, type: heroSlot.type }]
      : []),
    ...media
      .filter(
        (m) =>
          (m.category === "hero" || m.category === "videos") &&
          m.slot_id !== "hero_billboard"
      )
      .map((m) => ({
        url: m.media_url,
        title: m.alt_text,
        type: (m.media_type === "video" ? "video" : "image") as "image" | "video",
      })),
  ];

  // Master Corporate Slots (corp_rail_1 to corp_rail_6)
  const corporateSlotIds = [
    "corp_rail_1",
    "corp_rail_2",
    "corp_rail_3",
    "corp_rail_4",
    "corp_rail_5",
    "corp_rail_6",
  ];

  const dynamicCorporate: MediaRailItem[] = [
    ...media
      .filter(
        (m) =>
          (m.vertical === "corporate" || m.category === "corporate") &&
          !corporateSlotIds.includes(m.slot_id)
      )
      .map((m) => ({
        id: m.id || m.slot_id,
        img: m.media_url,
        caption: m.alt_text,
        vertical: "corporate" as const,
        type: (m.media_type === "video" ? "video" : "image") as "image" | "video",
        badge: m.badge || "Featured Cut",
      })),
    ...corporateSlotIds.map((slotId) => {
      const res = resolveSlotMedia(slotId, media);
      return {
        id: slotId,
        img: res.url,
        caption: res.title,
        vertical: "corporate" as const,
        type: res.type,
        badge: res.badge,
        clip_start: res.clip_start,
        clip_end: res.clip_end,
        aspect_ratio: res.aspect_ratio,
        focal_point: res.focal_point,
        fit_mode: res.fit_mode,
      };
    }),
  ];

  // Master Wedding Slots (wed_rail_1 to wed_rail_6)
  const weddingSlotIds = [
    "wed_rail_1",
    "wed_rail_2",
    "wed_rail_3",
    "wed_rail_4",
    "wed_rail_5",
    "wed_rail_6",
  ];

  const dynamicWeddings: MediaRailItem[] = [
    ...media
      .filter(
        (m) =>
          (m.vertical === "weddings_sangeet" || m.category === "weddings_sangeet") &&
          !weddingSlotIds.includes(m.slot_id)
      )
      .map((m) => ({
        id: m.id || m.slot_id,
        img: m.media_url,
        caption: m.alt_text,
        vertical: "weddings_sangeet" as const,
        type: (m.media_type === "video" ? "video" : "image") as "image" | "video",
        badge: m.badge || "Featured Cut",
        clip_start: m.clip_start,
        clip_end: m.clip_end,
        aspect_ratio: m.aspect_ratio,
        focal_point: m.focal_point,
        fit_mode: m.fit_mode,
      })),
    ...weddingSlotIds.map((slotId) => {
      const res = resolveSlotMedia(slotId, media);
      return {
        id: slotId,
        img: res.url,
        caption: res.title,
        vertical: "weddings_sangeet" as const,
        type: res.type,
        badge: res.badge,
        clip_start: res.clip_start,
        clip_end: res.clip_end,
        aspect_ratio: res.aspect_ratio,
        focal_point: res.focal_point,
        fit_mode: res.fit_mode,
      };
    }),
  ];

  // Master Family Games Slots (games_rail_1 to games_rail_4)
  const dynamicFamilyGames: MediaRailItem[] = [
    "games_rail_1",
    "games_rail_2",
    "games_rail_3",
    "games_rail_4",
  ].map((slotId) => {
    const res = resolveSlotMedia(slotId, media);
    return {
      id: slotId,
      img: res.url,
      caption: res.title,
      vertical: "weddings_sangeet" as const,
      type: res.type,
      badge: res.badge,
      clip_start: res.clip_start,
      clip_end: res.clip_end,
      aspect_ratio: res.aspect_ratio,
      focal_point: res.focal_point,
      fit_mode: res.fit_mode,
    };
  });

  const aboutPortrait = resolveSlotMedia("about_portrait", media);

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
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      stopCursor = true;
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("🎉 Inquiry Sent! Radhaa will respond within 24 hours.");

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#C9A84C", "#E2C775", "#ffffff", "#CC2936"],
    });

    setTimeout(() => {
      setFormStatus("✨  Send Inquiry  ✨");
      (e.target as HTMLFormElement).reset();
    }, 4500);
  };

  const scrollToBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="stellar-wrapper relative overflow-hidden bg-[#0A0A0A] text-white">
      {/* Continuous Ambient Looping Motion Video & Dynamic Stage Spotlight Sweep */}
      <MotionVideoBackground variant="fullscreen" overlayOpacity={0.68} accentColor="gold" />

      {/* 3D Gold Particle Constellation */}
      <ParticleBackground />

      {/* CUSTOM CURSOR */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* LIGHTBOX */}
      {lightboxItem && (
        <div
          className="lightbox active"
          onClick={() => setLightboxItem(null)}
        >
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

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href="#billboard" onClick={() => setIsMenuOpen(false)}>Home</a>
        <a href="#master-vault" onClick={() => setIsMenuOpen(false)} className="text-[#C9A84C] font-semibold">Video Vault (Reels)</a>
        <a href="/corporate" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#C9A84C]">Corporate Portal</a>
        <a href="/weddings" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-[#CC2936]">Weddings & Sangeet Portal</a>
        <a href="#about" onClick={() => setIsMenuOpen(false)}>About Radhaa</a>
        <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Google Reviews</a>
        <a href="#booking" onClick={() => setIsMenuOpen(false)}>Book Me</a>
        <a href="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm text-[#C9A84C]">Admin Portal</a>
      </div>

      {/* NAVIGATION */}
      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <a href="#billboard" className="no-underline">
          <RadhaaLogo variant="navbar" />
        </a>
        <ul className="nav-links">
          <li><a href="#billboard">Live Reel</a></li>
          <li><a href="#master-vault" className="text-[#C9A84C]">Video Vault</a></li>
          <li><a href="/corporate" className="hover:text-[#C9A84C] transition-colors">Corporate</a></li>
          <li><a href="/weddings" className="hover:text-[#CC2936] transition-colors">Weddings</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#reviews">Google Reviews</a></li>
          <li><a href="#booking" className="nav-cta">Book Now</a></li>
        </ul>
        <div
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span /><span /><span />
        </div>
      </nav>

      {/* NETFLIX-STYLE HERO BILLBOARD (CONTINUOUSLY CHANGING & PLAYING MEDIA) */}
      <section id="billboard">
        <NetflixBillboard
          customMedia={customHeroItems}
          onPlayTrailer={(item) =>
            setLightboxItem({ url: item.url, caption: item.title, type: item.type })
          }
          onBookClick={scrollToBooking}
        />
      </section>

      {/* DUAL-VERTICAL GATEWAY: CHOOSE YOUR DEDICATED EXPERIENCE */}
      <section className="relative z-30 max-w-7xl mx-auto px-6 sm:px-12 -mt-14 mb-10">
        <div className="bg-black/85 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1 rounded-full">
              Two Dedicated Portals · Zero Confusion
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-white mt-3">
              Select Your Tailored Experience
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2">
              Corporate clients and wedding families get dedicated spaces with tailored reels, master video vault, and booking workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Corporate Portal Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#C9A84C]/30 bg-gradient-to-br from-neutral-900 to-[#121008] p-6 sm:p-8 hover:border-[#C9A84C] transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A84C]/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C]">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2.5 py-1 rounded-full uppercase">
                    Corporate Conclaves
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-bold group-hover:text-[#C9A84C] transition-colors">
                  Corporate Summits & Awards
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2">
                  Tailored for CXOs, Fortune 500 summits, leadership conclaves, and high-glamour award galas. Flawless protocol, bilingual delivery, and zero dead air.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {["Tech Summits", "Annual Galas", "Award Ceremonies", "Executive Firesides"].map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href="/corporate"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#E2C775] transition-all shadow-lg shadow-[#C9A84C]/20"
                >
                  Enter Dedicated Corporate Portal <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Wedding & Sangeet Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-[#CC2936]/40 bg-gradient-to-br from-neutral-900 to-[#1C0A0D] p-6 sm:p-8 hover:border-[#CC2936] transition-all duration-300 hover:shadow-2xl hover:shadow-[#CC2936]/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#CC2936]/20 border border-[#CC2936]/40 flex items-center justify-center text-[#F06292]">
                    <Heart className="w-6 h-6 fill-[#CC2936] text-[#CC2936]" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-[#F06292] bg-[#CC2936]/10 border border-[#CC2936]/30 px-2.5 py-1 rounded-full uppercase">
                    Luxury Celebrations
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-bold group-hover:text-[#F06292] transition-colors">
                  Weddings, Sangeet & Games
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 mt-2">
                  Tailored for brides, grooms & families. High-voltage Sangeet MCing, signature family games, crowd roasts, and emotional Royal Varmala storytelling.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {["Sangeet Battles", "Family Games", "Haldi Fiesta", "Royal Varmala"].map((tag) => (
                    <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href="/weddings"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#CC2936] to-[#b01e2b] text-white font-semibold text-sm hover:from-[#e0313f] hover:to-[#CC2936] transition-all shadow-lg shadow-[#CC2936]/30"
                >
                  Enter Dedicated Weddings Portal <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY ENTERPRISE & PALACES BRAND MARQUEE */}
      <BrandMarquee />

      {/* NETFLIX-STYLE HORIZONTAL MEDIA RAILS */}
      <div className="relative z-20 pb-8 space-y-4">
        {/* Rail 1: Corporate Summits & Galas */}
        <NetflixMediaRail
          title="Trending: Corporate Summits & Annual Galas"
          subtitle="Fortune 500 conferences, keynotes, and executive stagecraft"
          tag="Corporate Conclaves"
          tagColor="#C9A84C"
          items={dynamicCorporate}
          onItemSelect={(item) =>
            setLightboxItem({ url: item.img, caption: item.caption, type: item.type })
          }
        />

        {/* Rail 2: Weddings, Sangeet & Royal Celebrations */}
        <NetflixMediaRail
          title="Top Picks: Luxury Sangeet & Destination Weddings"
          subtitle="Electric dance transitions, royal varmala direction, and family storytelling"
          tag="Luxury Celebrations"
          tagColor="#CC2936"
          items={dynamicWeddings}
          onItemSelect={(item) =>
            setLightboxItem({ url: item.img, caption: item.caption, type: item.type })
          }
        />

        {/* Rail 3: Signature Family Games & Icebreakers */}
        <NetflixMediaRail
          title="Crowd Favorites: Signature Family Games & Icebreakers"
          subtitle="Interactive entertainment getting every generation laughing and dancing"
          tag="Interactive Highlight"
          tagColor="#F06292"
          items={dynamicFamilyGames}
          onItemSelect={(item) =>
            setLightboxItem({ url: item.img, caption: item.caption, type: item.type })
          }
        />
      </div>

      {/* MASTER VIDEO VAULT (ALL WEDDING & CORPORATE SUB-GROUPS) */}
      <MasterVideoVault
        dynamicMedia={media}
        onPlayVideo={(item) =>
          setLightboxItem({ url: item.url, caption: item.caption, type: "video" })
        }
        onBookClick={scrollToBooking}
      />

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="about-visual reveal-left relative">
            <div className="about-gold-accent" />
            <div className="about-frame" />
            <img src={aboutPortrait.url} alt={aboutPortrait.title} className="about-img-main rounded-2xl" />
            <img src="/images/img_28.jpg" alt="Radhaa Dudeja close-up" className="about-img-accent rounded-xl shadow-2xl" />
          </div>

          <div className="about-text reveal-right space-y-4">
            <div className="section-label">The Voice Behind The Energy</div>
            <h2 className="section-title">
              From the foothills of <em>Uttarakhand</em> to centre stage across India
            </h2>
            <div className="gold-line" />
            <div className="about-quote">"I don't just host an event, I ignite an experience."</div>
            <p className="about-body">
              Radhaa Dudeja brings the energy of a live wire and the poised elegance of a seasoned speaker to every stage. 
              Rooted in Ramnagar near the forests of Jim Corbett, her natural magnetism has blossomed into an illustrious career spanning Fortune 500 conferences, luxury destination weddings, and international cultural summits.
            </p>
            <p className="about-body">
              Her philosophy is simple: <em>engage the mind, ignite the heart</em>. Whether moderating senior executive panels or getting 500 wedding guests on their feet for family games, Radhaa makes every event feel spontaneous, personal, and unforgettable.
            </p>

            <div className="about-langs flex gap-2 flex-wrap pt-2">
              <div className="lang-tag">🇮🇳 Hindi</div>
              <div className="lang-tag">🌍 English</div>
              <div className="lang-tag">🎉 Punjabi</div>
            </div>

            <div className="flex gap-4 flex-wrap pt-4">
              <a href="#booking" className="btn-primary">Book Radhaa</a>
              <a href={settings.youtube_url || "https://www.youtube.com/@anchorrd8794"} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Watch Showreel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip my-12">
        <div className="stat-item reveal reveal-delay-1">
          <div className="stat-num">500<span style={{ fontSize: "2rem" }}>+</span></div>
          <div className="stat-label">Events Hosted</div>
        </div>
        <div className="stat-item reveal reveal-delay-2">
          <div className="stat-num">8<span style={{ fontSize: "2rem" }}>+</span></div>
          <div className="stat-label">Years of Mastery</div>
        </div>
        <div className="stat-item reveal reveal-delay-3">
          <div className="stat-num">3</div>
          <div className="stat-label">Languages Fluent</div>
        </div>
        <div className="stat-item reveal reveal-delay-4">
          <div className="stat-num">100<span style={{ fontSize: "2rem" }}>%</span></div>
          <div className="stat-label">Client Satisfaction</div>
        </div>
      </div>

      {/* FEATURED STAGE INSIGHTS & INDUSTRY ARTICLES */}
      <section id="insights" className="py-20 border-t border-b border-white/5 relative bg-gradient-to-b from-[#0A0A0A] via-[#111111] to-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="section-label reveal">Knowledge & Stagecraft</div>
              <h2 className="section-title reveal reveal-delay-1">
                Featured Stage Insights & <em>Industry Articles</em>
              </h2>
              <p className="text-xs text-[#888] max-w-xl mt-2 reveal reveal-delay-2">
                Curated playbooks on luxury sangeet pacing, executive stagecraft, crowd psychology, and high-stakes conference moderation by Radhaa Dudeja.
              </p>
            </div>
            <a
              href="/blog"
              className="reveal px-5 py-2.5 rounded-full border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 shadow-lg"
            >
              Explore All Articles <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post, idx) => (
              <TiltCard key={post.id} maxTilt={6} className={`reveal reveal-delay-${idx + 1}`}>
                <div className="group h-full rounded-2xl overflow-hidden bg-neutral-900/90 border border-white/10 hover:border-[#C9A84C]/50 transition-all flex flex-col justify-between p-4 shadow-xl">
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-black">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[#C9A84C] border border-[#C9A84C]/30">
                        {post.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A0A0A0] flex items-center justify-between mb-2">
                      <span>{post.published_date}</span>
                      <span>{post.read_time}</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#C9A84C] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] text-neutral-300 bg-white/5 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-[#C9A84C] hover:underline flex items-center gap-1"
                    >
                      Read Playbook →
                    </a>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* DEDICATED PORTALS SEPARATION BANNER */}
          <div className="mt-16 p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#17130A] via-black to-[#1A0A0E] relative overflow-hidden reveal">
            <MotionVideoBackground variant="card" overlayOpacity={0.75} accentColor="gold" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C9A84C] block mb-1">
                  100% Dedicated & Separated Portals
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Corporate Conclaves & Luxury Celebrations
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-xl">
                  Each portal is uniquely customized with tailored showreels, verified client testimonials, and dedicated booking desks.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/corporate"
                  className="px-5 py-2.5 rounded-xl bg-[#C9A84C] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#E2C775] transition-all flex items-center gap-2 shadow-lg"
                >
                  <Briefcase className="w-4 h-4" /> Corporate Portal
                </a>
                <a
                  href="/weddings"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#CC2936] to-[#b01e2b] text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Heart className="w-4 h-4" /> Weddings Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS & 3D HOLOGRAPHIC QR CARD */}
      <section id="reviews" className="py-20 border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="section-label reveal">Client Trust & Reputation</div>
          <h2 className="section-title reveal reveal-delay-1">
            Google Verified <em>5.0 Star Rating</em>
          </h2>
          <p className="text-xs text-[#888] max-w-lg mt-2 mb-10 reveal reveal-delay-2">
            Directly from Google Business Profile — read verified reviews from corporate HR heads and destination wedding couples.
          </p>

          {/* 3D Holographic Google QR Card */}
          <div className="mb-14 reveal reveal-delay-2">
            <GoogleQRCustomCard />
          </div>

          {/* 3D Tilt Testimonial Cards */}
          <div className="testimonials-grid">
            <TiltCard maxTilt={8} className="reveal reveal-delay-1">
              <div className="testimonial-card h-full">
                <div className="quote-mark">"</div>
                <div className="testimonial-stars">★★★★★</div>
                <div className="testimonial-text">
                  "Radhaa was the life of our corporate annual gala — our executives and international delegates were blown away! Her bilingual delivery kept everyone locked in."
                </div>
                <div className="testimonial-author">Priya Sharma</div>
                <div className="testimonial-role">HR Director · Fortune 500 Tech Summit, Delhi</div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={8} className="reveal reveal-delay-2">
              <div className="testimonial-card h-full">
                <div className="quote-mark">"</div>
                <div className="testimonial-stars">★★★★★</div>
                <div className="testimonial-text">
                  "She didn't just host our sangeet, she became like our elder sister! Her family interactive games had even our strictest grandparents on the dance floor laughing."
                </div>
                <div className="testimonial-author">Ananya & Rohan Mehta</div>
                <div className="testimonial-role">Destination Wedding Couple · Jim Corbett</div>
              </div>
            </TiltCard>

            <TiltCard maxTilt={8} className="reveal reveal-delay-3">
              <div className="testimonial-card h-full">
                <div className="quote-mark">"</div>
                <div className="testimonial-stars">★★★★★</div>
                <div className="testimonial-text">
                  "We had a sudden 45-minute AV glitch backstage during the awards. Radhaa held the crowd with spontaneous improv, trivia, and humor without missing a beat. Truly exceptional!"
                </div>
                <div className="testimonial-author">Vikram Negi</div>
                <div className="testimonial-role">Event Director · Brand Activation Summit</div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA CHANNELS HUB */}
      <section id="social" className="py-16 bg-[#0E0E0E]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="section-label reveal" style={{ justifyContent: "center" }}>
            Connect With Radhaa Dudeja
          </div>
          <h2 className="section-title reveal reveal-delay-1" style={{ textAlign: "center" }}>
            Follow the <em>Live Journey</em>
          </h2>
          <p className="text-center text-xs text-[#888] max-w-lg mx-auto mb-10 reveal reveal-delay-2">
            Stay tuned for daily event reels, behind-the-scenes vlogs, and client stories across platforms.
          </p>

          <SocialChannelsBar variant="section" className="reveal" />
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="py-20 relative">
        {/* Instant RFP Pitch Deck Generator Banner */}
        <div className="max-w-6xl mx-auto px-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-[#181818] to-neutral-900 border border-[#C9A84C]/40 shadow-xl reveal">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono tracking-widest text-[#C9A84C] uppercase font-semibold">
              Instant Agency & Executive Planning Dossier
            </span>
            <h4 className="text-base sm:text-lg font-serif text-white font-medium">
              Need a Customized Pitch Deck & Technical Rider for Your Client Board?
            </h4>
            <p className="text-xs text-neutral-400">
              Generates a tailored executive PDF proposal with bios, showreel QRs, and hospitality specs in 10 seconds.
            </p>
          </div>
          <RfpDeckGenerator initialEventType={selectedFormat} />
        </div>

        {/* Stage Scope & Pricing Estimator */}
        <div className="max-w-6xl mx-auto px-4 mb-10 reveal">
          <StagePriceEstimator defaultCategory={selectedFormat === "Corporate Summits & Awards" ? "corporate" : "weddings"} />
        </div>

        {/* Real-Time Google Calendar Availability & One-Click Sync */}
        <div className="max-w-6xl mx-auto px-4 mb-12 reveal">
          <GoogleCalendarBooking
            format={selectedFormat}
            accentColor={selectedFormat === "Corporate Summits & Awards" ? "gold" : "crimson"}
            onDateSelected={(dateStr) => {
              const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
              if (dateInput) dateInput.value = dateStr;
            }}
          />
        </div>

        <div className="booking-grid max-w-6xl mx-auto px-4">
          <div className="booking-info">
            <div className="section-label reveal">Reserve Your Dates</div>
            <h2 className="section-title reveal reveal-delay-1">
              Ready to create something <em>unforgettable?</em>
            </h2>
            <div className="gold-line" />
            <p className="booking-desc reveal reveal-delay-2">
              Whether you are organizing a high-profile corporate summit or an intimate family celebration, Radhaa Dudeja brings customized preparation and electric stage presence.
            </p>

            <div className="booking-contact-list">
              <div className="contact-item reveal">
                <div className="contact-icon">📍</div>
                <div className="contact-label">Available Across India & Worldwide</div>
              </div>
              <div className="contact-item reveal reveal-delay-1">
                <div className="contact-icon">💬</div>
                <div className="contact-label">Direct WhatsApp: +91 98765 43210</div>
              </div>
              <div className="contact-item reveal reveal-delay-2">
                <div className="contact-icon">✉️</div>
                <div className="contact-label">Email: bookings@radhaadudeja.com</div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href={`https://wa.me/${(settings.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}?text=Hi%20Radhaa,%20I%20am%20inquiring%20about%20booking%20you%20for%20a%20${encodeURIComponent(selectedFormat)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                Quick Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="booking-form-wrap reveal reveal-delay-2">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                  Select Experience Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("Corporate Summits & Awards")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all ${
                      selectedFormat === "Corporate Summits & Awards"
                        ? "bg-[#C9A84C] text-black border-[#C9A84C]"
                        : "bg-white/5 text-white/70 border-white/10"
                    }`}
                  >
                    🏢 Corporate
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat("Luxury Weddings & Sangeet")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all ${
                      selectedFormat === "Luxury Weddings & Sangeet"
                        ? "bg-[#CC2936] text-white border-[#CC2936]"
                        : "bg-white/5 text-white/70 border-white/10"
                    }`}
                  >
                    💍 Weddings & Sangeet
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Priya Sharma" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp</label>
                  <input type="tel" className="form-input" placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input type="date" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">City / Destination</label>
                  <input type="text" className="form-input" placeholder="e.g. Delhi / Goa / Jaipur" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event Notes & Details</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder={`Tell Radhaa about your event, expected guest count, or themes...`}
                />
              </div>

              <button type="submit" className="form-submit">
                {formStatus}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Radhaa Dudeja</div>
            <p className="footer-tagline">
              The Radhaa Dudeja Experience: Premier Anchor & Corporate Emcee for High-Stakes Summits, Luxury Sangeets, and Signature Celebrations.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Portals & Experiences</div>
            <ul className="footer-links">
              <li><a href="/corporate">Corporate Summits</a></li>
              <li><a href="/corporate">Tech & Annual Galas</a></li>
              <li><a href="/weddings">Luxury Weddings & Sangeet</a></li>
              <li><a href="/weddings#games">Signature Family Games</a></li>
              <li><a href="/blog">Stage Insights & Blog</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Channels</div>
            <ul className="footer-links">
              <li><a href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram (@radha_dudeja_)</a></li>
              <li><a href={settings.youtube_url} target="_blank" rel="noreferrer">YouTube (@anchorrd8794)</a></li>
              <li><a href={settings.facebook_url} target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href={settings.google_business_url} target="_blank" rel="noreferrer">Google 5.0★ Reviews</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Admin</div>
            <ul className="footer-links">
              <li><a href="/admin">Admin Portal</a></li>
              <li><a href="/admin">Google Drive Uploader</a></li>
              <li><a href="#booking">Book Now</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} The Radhaa Dudeja Experience. All rights reserved.</p>
        </div>
      </footer>

      {/* FLOATING SOCIAL & WHATSAPP ACTION BAR */}
      <SocialChannelsBar variant="floating" />
    </div>
  );
}

