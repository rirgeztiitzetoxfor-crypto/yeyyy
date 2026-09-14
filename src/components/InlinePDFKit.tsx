import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const highlights = [
  "High-energy stage presence with assertive yet approachable delivery.",
  "Authentic audience connection through warmth, humor, and storytelling.",
  "Strong improvisation and graceful handling of live-event surprises.",
  "Trilingual fluency in Hindi, English, and Punjabi.",
];

const briefChecks = [
  { check: "Event date, city, and venue type", note: "Enough detail to move from interest into a proper event conversation." },
  { check: "Audience size, vibe, and preferred language mix", note: "Enough detail to move from interest into a proper event conversation." },
  { check: "Run sheet, key moments, and hosting style needed", note: "Enough detail to move from interest into a proper event conversation." },
  { check: "Brand, family, or organizer contact details", note: "Enough detail to move from interest into a proper event conversation." },
];

const compactLanes = [
  { category: "Wedding / Celebration", title: "Wedding Constellation", desc: "Warmth, choreography, guest energy, family storytelling, and premium social-event anchoring." },
  { category: "Corporate / Brand", title: "Brand Command", desc: "Polished authority, sharp pacing, brand-safe delivery, and premium event protocol for launches and formal stages." },
  { category: "Conference / Summit", title: "Summit Flow", desc: "Structured transitions, panel moderation rhythm, strong speaker framing, and elegant audience control." },
  { category: "Destination / Premium Custom", title: "Signature Experience", desc: "High-touch stage design, custom scripting, destination logistics, and a luxury-first event atmosphere." },
];

export default function InlinePDFKit() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="pdf-kit" className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">📸 Visual Godhood</p>
        <p className="text-primary/60 tracking-[0.2em] text-xs uppercase text-center mb-2">PDF kit, without leaving the page</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-16">
          A one-page-ready summary for <em className="text-primary not-italic">fast forwarding.</em>
        </h2>

        {/* Highlights */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-3 p-4 border border-border bg-card">
              <span className="text-primary text-lg">✦</span>
              <p className="text-foreground text-sm">{h}</p>
            </div>
          ))}
        </div>

        {/* Brief checklist */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {briefChecks.map((b, i) => (
            <div key={i} className="p-4 border border-border bg-card">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary font-heading text-sm">✓</span>
                <p className="text-foreground text-sm font-medium">{b.check}</p>
              </div>
              <p className="text-muted-foreground text-xs pl-5">{b.note}</p>
            </div>
          ))}
        </div>

        {/* Compact lanes */}
        <p className="text-primary/60 tracking-[0.2em] text-xs uppercase text-center mb-2">Event lanes in one glance</p>
        <h3 className="font-heading text-xl text-foreground text-center mb-8">
          Different rooms. Different Radha <em className="text-primary not-italic">electricity.</em>
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {compactLanes.map((l) => (
            <div key={l.title} className="p-5 border border-border bg-card">
              <p className="text-primary/60 text-xs tracking-widest uppercase mb-1">{l.category}</p>
              <h4 className="font-heading text-sm text-foreground mb-2">{l.title}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">{l.desc}</p>
            </div>
          ))}
        </div>

        {/* Direct details */}
        <div className="text-center border-t border-border pt-8">
          <p className="text-primary/60 tracking-[0.2em] text-xs uppercase mb-4">Direct details</p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="tel:+918192901515" className="text-foreground text-sm hover:text-primary transition-colors">
              +91 81929 01515
            </a>
            <a
              href="https://wa.me/918192901515?text=Hi%20Radha%2C%20I%20want%20to%20check%20availability%20for%20an%20event."
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground text-sm hover:text-primary transition-colors"
            >
              WhatsApp booking lane
            </a>
          </div>
          <p className="text-muted-foreground text-xs mb-6">Available across India and internationally by arrangement.</p>
          <a
            href="#booking"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-heading text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            Book from this page
          </a>
        </div>
      </div>
    </section>
  );
}
