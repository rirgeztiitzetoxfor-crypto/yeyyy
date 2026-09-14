import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const socials = [
  { label: "Instagram", handle: "@radha_dudeja_", url: "https://www.instagram.com/radha_dudeja_/" },
  { label: "Facebook", handle: "radha.dudeja.2025", url: "https://www.facebook.com/radha.dudeja.2025" },
  { label: "Facebook", handle: "Radha Dudeja", url: "https://www.facebook.com/profile.php?id=100091785037914" },
  { label: "StarClinch", handle: "Anchor Radha Dudeja", url: "https://starclinch.com/book-anchor-online/l--dehradun" },
];

export default function InlineMediaKit() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="media-kit" className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">
          📸 Visual Godhood &nbsp;&nbsp;🎬 Cinematic Empress
        </p>
        <p className="text-primary/60 tracking-[0.2em] text-xs uppercase text-center mb-2">
          Media kit, inside the main page
        </p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          Everything someone should feel <em className="text-primary not-italic">before they call.</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-sm">
          This is the forwardable layer brought into the main surface, so the site no longer feels split into separate worlds.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Trilingual anchor for weddings, corporate events, public ceremonies, and curated stage experiences.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Warm stage command, graceful improvisation, and clear event storytelling.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Available for premium private events, brand activations, conferences, and destination celebrations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-1">Languages</p>
                <p className="text-foreground text-sm">Hindi • English • Punjabi</p>
              </div>
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-1">Base</p>
                <p className="text-foreground text-sm">India</p>
              </div>
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-1">Travel</p>
                <p className="text-foreground text-sm">PAN India + International</p>
              </div>
            </div>

            {/* Share surface */}
            <div>
              <p className="text-primary/60 tracking-[0.2em] text-xs uppercase mb-4">Share surface</p>
              <p className="text-muted-foreground text-sm mb-4">One link should still feel rich when forwarded.</p>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-border hover:border-primary/40 transition-colors"
                  >
                    <p className="text-foreground text-sm font-medium">{s.label}</p>
                    <p className="text-muted-foreground text-xs">{s.handle}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/918192901515?text=Hi%20Radha%2C%20I%20want%20to%20check%20availability%20for%20an%20event."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase font-heading hover:bg-primary/90 transition-colors"
              >
                Send on WhatsApp
              </a>
              <a
                href="tel:+918192901515"
                className="px-5 py-2.5 border border-border text-foreground text-xs tracking-widest uppercase font-heading hover:border-primary hover:text-primary transition-colors"
              >
                Call now
              </a>
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49.jpeg"
              alt="Radha Dudeja editorial"
              className="w-full aspect-[3/4] object-cover border border-border"
              loading="lazy"
            />
            <img
              src="https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.50.jpeg"
              alt="Radha Dudeja portrait"
              className="w-full aspect-[3/4] object-cover border border-border mt-8"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
