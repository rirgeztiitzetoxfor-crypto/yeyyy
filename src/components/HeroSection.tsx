import { useSiteMedia } from "@/hooks/useSiteMedia";

const stats = [
  { value: "500+", label: "Events Hosted" },
  { value: "3", label: "Languages" },
  { value: "8+", label: "Years Experience" },
  { value: "PAN", label: "India Travel" },
];

const chips = [
  { label: "Portfolio", href: "#gallery" },
  { label: "Reel", href: "#videos" },
  { label: "Media Kit", href: "#media-kit" },
  { label: "PDF Kit", href: "/media-kit.pdf", download: true },
  { label: "Book Now", href: "#booking", primary: true },
];

const FALLBACK_HERO = "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.46.jpeg";

export default function HeroSection() {
  const { getMediaUrl } = useSiteMedia();
  const heroBg = getMediaUrl("hero_bg", FALLBACK_HERO);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Top utility bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 border-b border-border/30 bg-background/60 backdrop-blur-sm">
        <span className="text-muted-foreground text-xs tracking-widest hidden md:block">
          📸 Visual Godhood &nbsp;&nbsp;🎬 Cinematic Empress
        </span>
        <div className="flex items-center gap-4 ml-auto">
          <a href="tel:+918192901515" className="text-muted-foreground hover:text-primary text-xs tracking-wider transition-colors">
            📞 +91 81929 01515
          </a>
          <a
            href="https://wa.me/918192901515?text=Hi%20Radha%2C%20I%20want%20to%20check%20availability%20for%20an%20event."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            WhatsApp Booking
          </a>
        </div>
      </div>

      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      <div className="relative z-10 max-w-4xl mx-auto pt-16">
        <p className="text-primary tracking-[0.4em] text-xs md:text-sm mb-4 uppercase">
          Anchor &nbsp;·&nbsp; Emcee &nbsp;·&nbsp; Host
        </p>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider mb-4">
          <span className="text-gold-gradient">Radhaa</span>
          <span className="text-foreground ml-3">Dudeja</span>
        </h1>

        <p
          className="text-primary/80 text-xl md:text-2xl lg:text-3xl mb-6 italic"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          for rooms that deserve romance, rhythm, and command
        </p>

        <blockquote className="text-foreground/60 text-lg md:text-xl mb-8 font-body">
          "Let's create a moment worth remembering"
        </blockquote>

        <p className="text-muted-foreground text-xs tracking-widest mb-10">
          Hindi • English • Punjabi&nbsp;&nbsp;·&nbsp;&nbsp;Across India + destination events&nbsp;&nbsp;·&nbsp;&nbsp;Premium booking concierge live
        </p>

        {/* Action chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {chips.map((chip) => (
            <a
              key={chip.label}
              href={chip.href}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase transition-colors font-heading ${
                chip.primary
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {chip.label}
            </a>
          ))}
        </div>
        
        {/* One-page summary button for fast forwarding */}
        <a href="#event-lanes" className="inline-block bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase font-heading hover:bg-primary/90 transition-colors duration-300 transform hover:-translate-y-1">
          Event Lanes at a Glance
        </a>
        
        {/* Payment barcode */}
        <div className="mt-6 flex items-center justify-center">
          <img src="https://via.placeholder.com/250x80/000/fff?text=PAYMENT+BARCODE" alt="Payment barcode" className="opacity-80" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl md:text-4xl text-primary mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-xs tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 animate-bounce">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">Scroll</p>
          <div className="w-px h-8 bg-primary/30 mx-auto mt-2" />
        </div>
      </div>
    </section>
  );
}
