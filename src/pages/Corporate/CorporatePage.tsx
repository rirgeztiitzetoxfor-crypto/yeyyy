import React, { useEffect, useState, useRef } from "react";
import { useSiteMedia } from "@/hooks/useSiteMedia";
import RadhaaLogo from "@/components/RadhaaLogo";
import TiltCard from "@/components/TiltCard";
import ParticleBackground from "@/components/ParticleBackground";
import NetflixBillboard, { type BillboardMedia } from "@/components/NetflixBillboard";
import NetflixMediaRail, { type MediaRailItem } from "@/components/NetflixMediaRail";
import MasterVideoVault from "@/components/MasterVideoVault";
import GoogleCalendarBooking from "@/components/GoogleCalendarBooking";
import BrandMarquee from "@/components/BrandMarquee";
import RfpDeckGenerator from "@/components/RfpDeckGenerator";
import StagePriceEstimator from "@/components/StagePriceEstimator";
import SocialChannelsBar from "@/components/SocialChannelsBar";
import confetti from "canvas-confetti";
import { resolveSlotMedia } from "@/lib/siteSlots";
import {
  Briefcase,
  Trophy,
  Users,
  Flame,
  FileText,
  MessageCircle,
  Sparkles,
  Star,
  CheckCircle,
  ExternalLink,
  Heart,
  ArrowRight,
} from "lucide-react";
import "@/pages/Stellar/Stellar.css";

const corporateBillboardReels: BillboardMedia[] = [
  {
    id: "corp-reel-1",
    title: "Annual Tech Leadership Summit 2026",
    tagline: "Bilingual fireside moderations, high-voltage keynotes, and Fortune 500 executive stagecraft.",
    category: "Corporate Summit",
    mediaUrl: "/images/img_14.jpg",
    type: "image",
    matchRate: "99% Match",
    year: "2026",
    badges: ["#1 In Corporate", "TEDx-Style", "Bilingual"],
  },
  {
    id: "corp-reel-2",
    title: "National Brand Reveal & Product Launch Gala",
    tagline: "Dramatic countdowns, lighting cues, teleprompter mastery, and international media delivery.",
    category: "Brand Launch",
    mediaUrl: "/images/img_17.jpg",
    type: "image",
    matchRate: "98% Match",
    year: "2026",
    badges: ["Black Tie", "Pan-India", "Executive"],
  },
  {
    id: "corp-reel-3",
    title: "Fortune 500 Annual Leadership & Excellence Awards",
    tagline: "High-glamour awards ceremony honoring organizational triumphs with poise and zero dead air.",
    category: "Award Gala",
    mediaUrl: "/images/img_11.jpg",
    type: "image",
    matchRate: "99% Match",
    year: "2026",
    badges: ["C-Suite Audience", "Stagecraft", "High Impact"],
  },
];

const corporateSummitsRail: MediaRailItem[] = [
  { img: "/images/img_14.jpg", caption: "National Leadership Tech Summit 2026", vertical: "corporate", type: "image", badge: "Trending" },
  { img: "/images/img_06.jpg", caption: "Brand Launch & Keynote Reveal Gala", vertical: "corporate", type: "image", badge: "High Impact" },
  { img: "/images/img_11.jpg", caption: "Annual Fortune 500 Awards Gala", vertical: "corporate", type: "image", badge: "Black Tie" },
  { img: "/images/img_20.jpg", caption: "Executive Leadership Fireside Moderation", vertical: "corporate", type: "image", badge: "Exclusive" },
  { img: "/images/img_13.jpg", caption: "Corporate Stagecraft & Executive Pacing", vertical: "corporate", type: "image" },
  { img: "/images/img_22.jpg", caption: "International Delegations Gala Evening", vertical: "corporate", type: "image" },
];

const corporateOffsitesRail: MediaRailItem[] = [
  { img: "/images/img_13.jpg", caption: "Executive Offsite Interactive Icebreakers", vertical: "corporate", type: "image", badge: "Team Building" },
  { img: "/images/img_20.jpg", caption: "C-Suite Leadership Retreat Evenings", vertical: "corporate", type: "image", badge: "Exclusive" },
  { img: "/images/img_06.jpg", caption: "Cross-Department Communication Games", vertical: "corporate", type: "image", badge: "Energizer" },
  { img: "/images/img_14.jpg", caption: "Global Leaders Networking Dinner", vertical: "corporate", type: "image", badge: "Black Tie" },
];

export default function CorporatePage() {
  const { media, settings, getMediaUrl } = useSiteMedia();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption: string; type: "image" | "video" } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState("💼 Request Corporate Quote & Availability");

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("🎉 Inquiry Sent! Radhaa's team will share availability within 12 hours.");
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#C9A84C", "#E2C775", "#ffffff"],
    });
    setTimeout(() => {
      setFormStatus("💼 Request Corporate Quote & Availability");
      (e.target as HTMLFormElement).reset();
    }, 4500);
  };

  const corporateOnlyMedia = media.filter((m) => m.vertical === "corporate" || m.category === "corporate");

  // Dynamic Corporate Summits Rail from Master Slots
  const dynamicSummitsRail: MediaRailItem[] = [
    "corp_rail_1",
    "corp_rail_2",
    "corp_rail_3",
    "corp_rail_4",
    "corp_rail_5",
    "corp_rail_6",
  ].map((slotId) => {
    const res = resolveSlotMedia(slotId, media);
    return {
      id: slotId,
      img: res.url,
      caption: res.title,
      vertical: "corporate",
      type: res.type,
      badge: res.badge,
      clip_start: res.clip_start,
      clip_end: res.clip_end,
      aspect_ratio: res.aspect_ratio,
      focal_point: res.focal_point,
      fit_mode: res.fit_mode,
    };
  });

  // Dynamic Corporate Offsites Rail from Master Slots
  const dynamicOffsitesRail: MediaRailItem[] = [
    "corp_offsite_1",
    "corp_offsite_2",
    "corp_offsite_3",
    "corp_offsite_4",
  ].map((slotId) => {
    const res = resolveSlotMedia(slotId, media);
    return {
      id: slotId,
      img: res.url,
      caption: res.title,
      vertical: "corporate",
      type: res.type,
      badge: res.badge,
      clip_start: res.clip_start,
      clip_end: res.clip_end,
      aspect_ratio: res.aspect_ratio,
      focal_point: res.focal_point,
      fit_mode: res.fit_mode,
    };
  });

  return (
    <div className="stellar-wrapper relative overflow-hidden bg-[#0A0A0A] text-white">
      <ParticleBackground />

      {/* LIGHTBOX */}
      {lightboxItem && (
        <div className="lightbox active" onClick={() => setLightboxItem(null)}>
          <div className="lightbox-close" onClick={() => setLightboxItem(null)}>✕</div>
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

      {/* DEDICATED CORPORATE TOP BAR */}
      <div className="bg-[#121008] border-b border-[#C9A84C]/30 px-4 py-2 text-center text-xs flex items-center justify-center gap-3">
        <span className="text-[#C9A84C] font-semibold flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Corporate Summits, Conferences & Galas Portal
        </span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <a
          href="/weddings"
          className="text-white/80 hover:text-white underline decoration-[#CC2936] text-[11px] flex items-center gap-1"
        >
          <Heart className="w-3 h-3 text-[#CC2936]" /> Planning a Wedding instead? Switch to Weddings Portal →
        </a>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href="#billboard" onClick={() => setIsMenuOpen(false)}>Corporate Reel</a>
        <a href="#summits" onClick={() => setIsMenuOpen(false)}>Tech Summits</a>
        <a href="#awards" onClick={() => setIsMenuOpen(false)}>Award Galas</a>
        <a href="#vault" onClick={() => setIsMenuOpen(false)}>Corporate Video Vault</a>
        <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Corporate Reviews</a>
        <a href="#booking" onClick={() => setIsMenuOpen(false)}>Book Corporate Emcee</a>
        <a href="/weddings" onClick={() => setIsMenuOpen(false)} className="text-[#CC2936]">Switch to Weddings Portal</a>
      </div>

      {/* CORPORATE NAVIGATION */}
      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <a href="/" className="no-underline">
          <RadhaaLogo variant="navbar" />
        </a>
        <ul className="nav-links">
          <li><a href="#billboard">Live Reel</a></li>
          <li><a href="#summits">Summits</a></li>
          <li><a href="#vault">Video Vault</a></li>
          <li><a href="#reviews">Testimonials</a></li>
          <li><a href="#booking" className="nav-cta">Book Emcee</a></li>
          <li>
            <a
              href="/weddings"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#CC2936] hover:text-white text-xs border border-white/20 transition-all flex items-center gap-1.5 text-white/90"
            >
              <Heart className="w-3 h-3 text-[#CC2936]" /> Weddings
            </a>
          </li>
        </ul>
        <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* NETFLIX CORPORATE BILLBOARD */}
      <section id="billboard">
        <NetflixBillboard
          onPlayTrailer={(item) => setLightboxItem({ url: item.url, caption: item.title, type: item.type })}
          onBookClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
        />
      </section>

      {/* LUXURY BRAND MARQUEE */}
      <BrandMarquee />

      {/* CORPORATE MEDIA RAILS */}
      <div id="summits" className="relative z-20 -mt-10 pb-8 space-y-4">
        <NetflixMediaRail
          title="Trending: Tech Summits & Annual Leadership Conferences"
          subtitle="Fortune 500 panel discussions, VIP introductions, and teleprompter precision"
          tag="Corporate Excellence"
          tagColor="#C9A84C"
          items={dynamicSummitsRail}
          onItemSelect={(item) => setLightboxItem({ url: item.img, caption: item.caption, type: item.type })}
        />
        <NetflixMediaRail
          title="Executive Retreats, Team Offsites & Energizers"
          subtitle="High-impact leadership games and evening entertainment breaking cross-department silos"
          tag="Offsite Engagement"
          tagColor="#E2C775"
          items={dynamicOffsitesRail}
          onItemSelect={(item) => setLightboxItem({ url: item.img, caption: item.caption, type: item.type })}
        />
      </div>

      {/* MASTER CORPORATE VIDEO VAULT */}
      <div id="vault">
        <MasterVideoVault
          dynamicMedia={corporateOnlyMedia}
          onPlayVideo={(item) => setLightboxItem({ url: item.url, caption: item.caption, type: "video" })}
          onBookClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>

      {/* STATS STRIP */}
      <div className="stats-strip my-12">
        <div className="stat-item">
          <div className="stat-num">500<span style={{ fontSize: "2rem" }}>+</span></div>
          <div className="stat-label">Conferences & Summits</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">8<span style={{ fontSize: "2rem" }}>+</span></div>
          <div className="stat-label">Years Corporate Stagecraft</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">3</div>
          <div className="stat-label">Bilingual Fluency</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">100<span style={{ fontSize: "2rem" }}>%</span></div>
          <div className="stat-label">Client Retention</div>
        </div>
      </div>

      {/* CORPORATE TESTIMONIALS */}
      <section id="reviews" className="py-20 max-w-6xl mx-auto px-4">
        <div className="section-label">Executive Client Trust</div>
        <h2 className="section-title">
          What Fortune 500 Leaders & <em>Event Directors Say</em>
        </h2>
        <div className="testimonials-grid mt-10">
          <TiltCard maxTilt={8}>
            <div className="testimonial-card h-full">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">
                "Radhaa was the anchor for our National Tech Leadership Summit. Her bilingual articulation and stage command kept over 800 C-suite executives engaged across a rigorous 8-hour agenda without a single second of dead air."
              </div>
              <div className="testimonial-author">Priya Sharma</div>
              <div className="testimonial-role">HR Director · Fortune 500 Tech Summit, Delhi NCR</div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8}>
            <div className="testimonial-card h-full">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">
                "During our annual awards gala, an unexpected backstage teleprompter glitch halted production. Radhaa held the spotlight with spontaneous humor, impromptu trivia, and executive charm. Truly a premier professional!"
              </div>
              <div className="testimonial-author">Vikram Negi</div>
              <div className="testimonial-role">Director of Marketing & Events · Pan-India Brand Gala</div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8}>
            <div className="testimonial-card h-full">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">
                "Her energy on day 2 of our Leadership Retreat in Goa was contagious. Even our most reserved technical leaders were participating in stage games and laughing. She elevated the entire company offsite."
              </div>
              <div className="testimonial-author">Sameer Kulkarni</div>
              <div className="testimonial-role">VP Operations · Global IT Services</div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* CORPORATE BOOKING FORM */}
      <section id="booking" className="py-20 border-t border-white/5 bg-[#0D0D0D] relative">
        {/* Instant Executive RFP Pitch Deck Generator */}
        <div className="max-w-6xl mx-auto px-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-[#181818] to-neutral-900 border border-[#C9A84C]/40 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono tracking-widest text-[#C9A84C] uppercase font-semibold">
              Instant Corporate Dossier & Stage Rider
            </span>
            <h4 className="text-base sm:text-lg font-serif text-white font-medium">
              Present Radhaa Dudeja to Your Company Board or Events Committee
            </h4>
            <p className="text-xs text-neutral-400">
              Generates an executive-ready proposal PDF customized with your company name, keynote specs, and AV rider.
            </p>
          </div>
          <RfpDeckGenerator initialEventType="Corporate Tech Summit" triggerLabel="⚡ Generate Corporate Proposal (PDF)" />
        </div>

        {/* Corporate Stage Scope & Investment Estimator */}
        <div className="max-w-6xl mx-auto px-4 mb-10">
          <StagePriceEstimator defaultCategory="corporate" />
        </div>

        {/* Real-Time Google Calendar Availability & One-Click Sync */}
        <div className="max-w-6xl mx-auto px-4 mb-12">
          <GoogleCalendarBooking
            format="Corporate Summits & Awards"
            accentColor="gold"
          />
        </div>

        <div className="booking-grid max-w-6xl mx-auto px-4">
          <div className="booking-info">
            <div className="section-label">Corporate Booking</div>
            <h2 className="section-title">
              Secure Your Summit & <em>Gala Dates</em>
            </h2>
            <div className="gold-line" />
            <p className="booking-desc">
              Customized script preparation, rehearsal coordination, teleprompter execution, and commanding bilingual delivery for your company's most important stage moments.
            </p>

            <div className="booking-contact-list">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-label">Pan-India & International Summits</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-label">Corporate Inquiries: bookings@radhaadudeja.com</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <div className="contact-label">Direct Corporate Desk: +91 98765 43210</div>
              </div>
            </div>
          </div>

          <div className="booking-form-wrap">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Company / Organization Name</label>
                <input type="text" className="form-input" placeholder="e.g. Google India / Infosys / Tata Motors" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Contact Person Name</label>
                  <input type="text" className="form-input" placeholder="Your Full Name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Corporate Email</label>
                  <input type="email" className="form-input" placeholder="name@company.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Event Format</label>
                  <select className="form-select" required>
                    <option value="Annual Leadership Summit">Tech / Industry Summit</option>
                    <option value="Award Gala">Annual Excellence Awards Gala</option>
                    <option value="Brand Launch">Product / Brand Reveal</option>
                    <option value="Leadership Offsite">Executive Offsite & Team Energizer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">City / Venue Location</label>
                  <input type="text" className="form-input" placeholder="e.g. Delhi NCR / Mumbai / Bengaluru" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Delegation / Attendee Count</label>
                <input type="text" className="form-input" placeholder="e.g. 300 - 500 Attendees" />
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
        <div className="footer-grid max-w-6xl mx-auto px-4">
          <div>
            <div className="mb-4">
              <RadhaaLogo variant="footer" />
            </div>
            <p className="footer-tagline">
              The Radhaa Dudeja Experience: Premier Anchor & Corporate Emcee for High-Stakes Summits, Galas, and Brand Milestones.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Portals</div>
            <ul className="footer-links">
              <li><a href="/corporate">Corporate Summits Portal</a></li>
              <li><a href="/weddings">Weddings & Sangeet Portal</a></li>
              <li><a href="/">Home Gateway</a></li>
              <li><a href="/admin">Admin Portal</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Channels</div>
            <ul className="footer-links">
              <li><a href={settings.instagram_url} target="_blank" rel="noreferrer">Instagram (@radha_dudeja_)</a></li>
              <li><a href={settings.youtube_url} target="_blank" rel="noreferrer">YouTube (@anchorrd8794)</a></li>
              <li><a href={settings.google_business_url} target="_blank" rel="noreferrer">Google Business Profile</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <SocialChannelsBar variant="floating" />
    </div>
  );
}
