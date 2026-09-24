import React, { useEffect, useState, useRef } from "react";
import { useSiteMedia } from "@/hooks/useSiteMedia";
import RadhaaLogo from "@/components/RadhaaLogo";
import TiltCard from "@/components/TiltCard";
import ParticleBackground from "@/components/ParticleBackground";
import NetflixBillboard, { type BillboardMedia } from "@/components/NetflixBillboard";
import NetflixMediaRail, { type MediaRailItem } from "@/components/NetflixMediaRail";
import MasterVideoVault from "@/components/MasterVideoVault";
import GoogleQRCustomCard from "@/components/GoogleQRCustomCard";
import SocialChannelsBar from "@/components/SocialChannelsBar";
import confetti from "canvas-confetti";
import {
  Heart,
  Music,
  Gamepad2,
  Sparkles,
  MessageCircle,
  Briefcase,
  Star,
  CheckCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";
import "@/pages/Stellar/Stellar.css";

const weddingBillboardReels: BillboardMedia[] = [
  {
    id: "wed-reel-1",
    title: "Grand Royal Sangeet & Couple Roast Battles",
    tagline: "Electrifying dance performance cues, couple roast battles, and emotional family bonding that keeps guests dancing till 3 AM.",
    category: "Luxury Sangeet",
    mediaUrl: "/images/img_28.jpg",
    type: "image",
    matchRate: "99% Match",
    year: "2026",
    badges: ["#1 In Weddings", "High Voltage", "Family Loved"],
  },
  {
    id: "wed-reel-2",
    title: "Haldi & Mehendi Fiesta — Phoolon Ki Holi",
    tagline: "Sun-soaked afternoon energy, Punjabi dhol coordination, impromptu dance challenges, and vibrant interactive entertainment.",
    category: "Luxury Sangeet",
    mediaUrl: "/images/img_32.jpg",
    type: "image",
    matchRate: "98% Match",
    year: "2026",
    badges: ["Festive Vibe", "Phoolon Ki Holi", "Pure Joy"],
  },
  {
    id: "wed-reel-3",
    title: "Royal Varmala Direction & Sacred Entrance Narration",
    tagline: "Poetic Hindi and English narration, customized bride-groom entrance themes, and sacred traditional warmth delivered with cinematic poise.",
    category: "Luxury Sangeet",
    mediaUrl: "/images/img_01.jpg",
    type: "image",
    matchRate: "99% Match",
    year: "2026",
    badges: ["Royalty", "Emotional", "Cinematic"],
  },
];

const weddingsSangeetRail: MediaRailItem[] = [
  { img: "/images/img_28.jpg", caption: "Electric Sangeet Night MC & Dance Cues", vertical: "weddings_sangeet", type: "image", badge: "Crowd Favorite" },
  { img: "/images/img_01.jpg", caption: "Royal Varmala Direction & Sacred Entrance", vertical: "weddings_sangeet", type: "image", badge: "Royalty" },
  { img: "/images/img_25.jpg", caption: "Sangeet Dance Battles & DJ Coordination", vertical: "weddings_sangeet", type: "image", badge: "High Energy" },
  { img: "/images/img_32.jpg", caption: "Haldi & Mehendi Afternoon Fiesta", vertical: "weddings_sangeet", type: "image", badge: "Festive" },
  { img: "/images/img_33.jpg", caption: "Signature Family Games & Crowd Engagement", vertical: "weddings_sangeet", type: "image" },
  { img: "/images/img_17.jpg", caption: "Destination Wedding Reception Gala", vertical: "weddings_sangeet", type: "image" },
];

const familyGamesRail: MediaRailItem[] = [
  { img: "/images/img_33.jpg", caption: "The Couple Roast & Shoe Game", vertical: "weddings_sangeet", type: "image", badge: "Hilarious" },
  { img: "/images/img_25.jpg", caption: "Grandparents' Antakshari Melodies", vertical: "weddings_sangeet", type: "image", badge: "Emotional" },
  { img: "/images/img_28.jpg", caption: "Larkiwale vs. Ladkewale Dance Off", vertical: "weddings_sangeet", type: "image", badge: "Dance Battle" },
  { img: "/images/img_11.jpg", caption: "Table Relay & Rapid Trivia Rush", vertical: "weddings_sangeet", type: "image", badge: "Interactive" },
];

export default function WeddingsPage() {
  const { media, settings } = useSiteMedia();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption: string; type: "image" | "video" } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState("💍 Check Wedding Dates Availability");

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("🎉 Dates Received! Radhaa will personally reach out on WhatsApp within 12 hours.");
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#CC2936", "#C9A84C", "#ffffff", "#F06292"],
    });
    setTimeout(() => {
      setFormStatus("💍 Check Wedding Dates Availability");
      (e.target as HTMLFormElement).reset();
    }, 4500);
  };

  const weddingOnlyMedia = media.filter((m) => m.vertical === "weddings_sangeet" || m.category === "weddings_sangeet");

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

      {/* DEDICATED WEDDINGS TOP BANNER */}
      <div className="bg-[#1C0A0D] border-b border-[#CC2936]/40 px-4 py-2 text-center text-xs flex items-center justify-center gap-3">
        <span className="text-[#F06292] font-semibold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 fill-[#CC2936] text-[#CC2936]" /> Luxury Weddings, Sangeet & Family Celebrations Portal
        </span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <a
          href="/corporate"
          className="text-white/80 hover:text-white underline decoration-[#C9A84C] text-[11px] flex items-center gap-1"
        >
          <Briefcase className="w-3 h-3 text-[#C9A84C]" /> Looking for Corporate Summits? Switch to Corporate Portal →
        </a>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href="#billboard" onClick={() => setIsMenuOpen(false)}>Sangeet Reel</a>
        <a href="#sangeet" onClick={() => setIsMenuOpen(false)}>Luxury Sangeet</a>
        <a href="#games" onClick={() => setIsMenuOpen(false)}>Signature Family Games</a>
        <a href="#vault" onClick={() => setIsMenuOpen(false)}>Wedding Video Vault</a>
        <a href="/blog" onClick={() => setIsMenuOpen(false)} className="text-[#F06292]">Blog & Insights</a>
        <a href="#reviews" onClick={() => setIsMenuOpen(false)}>Couples' Reviews</a>
        <a href="#booking" onClick={() => setIsMenuOpen(false)}>Reserve Dates</a>
        <a href="/corporate" onClick={() => setIsMenuOpen(false)} className="text-[#C9A84C]">Switch to Corporate Portal</a>
      </div>

      {/* WEDDING NAVIGATION */}
      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <a href="/" className="no-underline">
          <RadhaaLogo variant="navbar" />
        </a>
        <ul className="nav-links">
          <li><a href="#billboard">Live Reel</a></li>
          <li><a href="#sangeet">Sangeet</a></li>
          <li><a href="#games">Family Games</a></li>
          <li><a href="#vault">Video Vault</a></li>
          <li><a href="/blog" className="text-[#F06292]">Blog</a></li>
          <li><a href="#reviews">Google Reviews</a></li>
          <li><a href="#booking" className="nav-cta" style={{ background: "#CC2936" }}>Reserve Dates</a></li>
          <li>
            <a
              href="/corporate"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#C9A84C] hover:text-black text-xs border border-white/20 transition-all flex items-center gap-1.5 text-white/90"
            >
              <Briefcase className="w-3 h-3 text-[#C9A84C]" /> Corporate
            </a>
          </li>
        </ul>
        <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* NETFLIX WEDDING BILLBOARD */}
      <section id="billboard">
        <NetflixBillboard
          onPlayTrailer={(item) => setLightboxItem({ url: item.url, caption: item.title, type: item.type })}
          onBookClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
        />
      </section>

      {/* WEDDING MEDIA RAILS */}
      <div id="sangeet" className="relative z-20 -mt-10 pb-8 space-y-4">
        <NetflixMediaRail
          title="Top Picks: Luxury Sangeet & Destination Weddings"
          subtitle="Electric dance transitions, couple roast battles, and royal varmala narration"
          tag="Vertical 02 · Weddings & Celebrations"
          tagColor="#CC2936"
          items={weddingsSangeetRail}
          onItemSelect={(item) => setLightboxItem({ url: item.img, caption: item.caption, type: item.type })}
        />

        <div id="games">
          <NetflixMediaRail
            title="Crowd Favorites: Signature Family Games & Icebreakers"
            subtitle="Interactive entertainment getting every generation laughing and dancing together"
            tag="Interactive Highlight"
            tagColor="#F06292"
            items={familyGamesRail}
            onItemSelect={(item) => setLightboxItem({ url: item.img, caption: item.caption, type: item.type })}
          />
        </div>
      </div>

      {/* MASTER WEDDING VIDEO VAULT */}
      <div id="vault">
        <MasterVideoVault
          dynamicMedia={weddingOnlyMedia}
          onPlayVideo={(item) => setLightboxItem({ url: item.url, caption: item.caption, type: "video" })}
          onBookClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
        />
      </div>

      {/* 3D GOOGLE REVIEWS CARD */}
      <section id="reviews" className="py-20 max-w-6xl mx-auto px-4">
        <div className="section-label">Real Wedding Couples</div>
        <h2 className="section-title">
          Google Verified <em>5.0 Star Experiences</em>
        </h2>
        <div className="mt-8 mb-12">
          <GoogleQRCustomCard />
        </div>

        <div className="testimonials-grid">
          <TiltCard maxTilt={8}>
            <div className="testimonial-card h-full">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">
                "She didn't just host our Sangeet in Jim Corbett, she became like an elder sister to both families! Her roast games had even our strictest grandparents on the dance floor laughing until tears came out."
              </div>
              <div className="testimonial-author">Ananya & Rohan Mehta</div>
              <div className="testimonial-role">Destination Wedding Couple · Jim Corbett Resort</div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8}>
            <div className="testimonial-card h-full">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">
                "Radhaa's Varmala direction brought everyone to tears of joy. The poetic narration, the musical build-up, and the energy she gave during our Haldi fiesta was simply extraordinary."
              </div>
              <div className="testimonial-author">Simran & Kabir Chadha</div>
              <div className="testimonial-role">Royal Palace Wedding · Jaipur</div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={8}>
            <div className="testimonial-card h-full">
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">
                "Finding an anchor who can keep 600 wedding guests attentive and dancing until 3:30 AM without awkward pauses is rare. Radhaa is in a league of her own!"
              </div>
              <div className="testimonial-author">Meera Kapoor</div>
              <div className="testimonial-role">Bride's Sister & Wedding Lead · Delhi NCR</div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* WEDDING BOOKING FORM */}
      <section id="booking" className="py-20 border-t border-white/5 bg-[#120D0E]">
        <div className="booking-grid max-w-6xl mx-auto px-4">
          <div className="booking-info">
            <div className="section-label" style={{ color: "#CC2936" }}>Reserve Wedding Dates</div>
            <h2 className="section-title">
              Let's Make Your Sangeet & <em>Wedding Legendary</em>
            </h2>
            <div className="gold-line" />
            <p className="booking-desc">
              Customized couple questions, grandparents' tribute cues, bridal entrance narration, and zero-awkwardness crowd control that creates memories for a lifetime.
            </p>

            <div className="booking-contact-list">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-label">Destination Weddings Across India & Worldwide</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <div className="contact-label">Direct WhatsApp: +91 98765 43210</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-label">Email: weddings@radhaadudeja.com</div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 flex-wrap">
              <a
                href={`https://wa.me/${(settings.whatsapp_number || "919876543210").replace(/[^0-9]/g, "")}?text=Hi%20Radhaa,%20we%20are%20planning%20our%20Wedding%20and%20would%20love%20to%20check%20your%20availability%20for%20our%20functions.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                Direct Chat with Radhaa on WhatsApp
              </a>
            </div>
          </div>

          <div className="booking-form-wrap" style={{ borderColor: "rgba(204,41,54,0.3)" }}>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Bride & Groom Names</label>
                <input type="text" className="form-input" placeholder="e.g. Ananya & Rohan" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Contact Person Phone / WhatsApp</label>
                  <input type="tel" className="form-input" placeholder="+91 98765 43210" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="youremail@gmail.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Functions Needed</label>
                  <select className="form-select" required>
                    <option value="Sangeet & Games">Sangeet Night & Family Games</option>
                    <option value="Complete Wedding">Full 2-3 Day Wedding (Haldi, Sangeet, Varmala)</option>
                    <option value="Haldi & Mehendi">Haldi & Mehendi Afternoon Fiesta</option>
                    <option value="Varmala & Reception">Varmala & Reception Gala</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Destination / City</label>
                  <input type="text" className="form-input" placeholder="e.g. Jim Corbett / Udaipur / Goa" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Guest Count & Dates</label>
                <input type="text" className="form-input" placeholder="e.g. 400 Guests · Nov 2026" />
              </div>

              <button type="submit" className="form-submit" style={{ background: "linear-gradient(to right, #CC2936, #E53935)", color: "#fff" }}>
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
              The Radhaa Dudeja Experience: Premier Anchor for Luxury Sangeets, Royal Varmala, and High-Energy Family Celebrations.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Portals & Journal</div>
            <ul className="footer-links">
              <li><a href="/weddings">Weddings & Sangeet Portal</a></li>
              <li><a href="/corporate">Corporate Summits Portal</a></li>
              <li><a href="/blog" className="text-[#F06292] font-semibold">Blog & Event Playbooks</a></li>
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
