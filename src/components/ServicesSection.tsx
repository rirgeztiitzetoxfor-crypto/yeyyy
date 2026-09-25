import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteMedia } from "@/hooks/useSiteMedia";

const FALLBACK_SERVICES = [
  { key: "service_corporate", src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_06.jpg" },
  { key: "service_wedding", src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_01.jpg" },
  { key: "service_cultural", src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_08.jpg" },
  { key: "service_interactive", src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_13.jpg" },
];

const services = [
  {
    emoji: "💼",
    tag: "Corporate",
    title: "Corporate Events & Summits",
    description: "Conferences, product launches, award nights, and team-building retreats — delivered with polished grace and lively energy.",
    slotId: "service_corporate",
    pdfSlot: "pdf_corporate",
    videoSlot: "media_corporate",
  },
  {
    emoji: "💍",
    tag: "Celebrations",
    title: "Weddings & Sangeets",
    description: "From intimate mehendi ceremonies to grand reception nights — Radhaa becomes the heartbeat of your celebration.",
    slotId: "service_wedding",
    pdfSlot: "pdf_sangeet",
    videoSlot: "media_sangeet",
  },
  {
    emoji: "🎭",
    tag: "Cultural",
    title: "Cultural & Festive Events",
    description: "Holi, New Year, community nights, public ceremonies — Radhaa's bilingual energy unites diverse audiences.",
    slotId: "service_cultural",
    pdfSlot: null,
    videoSlot: null,
  },
  {
    emoji: "🎲",
    tag: "Interactive",
    title: "Team-Building & Games",
    description: "Interactive hosting for corporate offsites, fun games, workshops, and employee engagement sessions.",
    slotId: "service_interactive",
    pdfSlot: "pdf_emcee",
    videoSlot: "media_emcee",
  },
];

export default function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { getMediaUrl } = useSiteMedia();

  const getFallback = (slotId: string) =>
    FALLBACK_SERVICES.find((f) => f.key === slotId)?.src || "";

  return (
    <section id="services" className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">What Radhaa Hosts</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-16">
          Versatile across every <em className="text-primary not-italic">stage & setting</em>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-500 flex flex-col"
            >
              <div className="absolute inset-0">
                <img
                  src={getMediaUrl(s.slotId, getFallback(s.slotId))}
                  alt={s.title}
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/90 to-card/60" />
              </div>
              <div className="relative p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                  <span className="text-xs tracking-widest uppercase text-primary/70 mb-2 block">{s.tag}</span>
                  <h3 className="font-heading text-xl text-foreground mb-3">
                    <span className="mr-2">{s.emoji}</span>{s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{s.description}</p>
                </div>
                
                {s.pdfSlot && s.videoSlot && (
                  <div className="flex gap-2 mt-auto border-t border-border pt-4">
                    <a 
                      href={getMediaUrl(s.pdfSlot, "#")} 
                      target="_blank" rel="noopener noreferrer" 
                      className="flex-1 text-center py-2 bg-primary/10 text-primary text-[10px] tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/20"
                    >
                      Download PDF Kit
                    </a>
                    <a 
                      href={getMediaUrl(s.videoSlot, "#")} 
                      target="_blank" rel="noopener noreferrer" 
                      className="flex-1 text-center py-2 bg-primary/10 text-primary text-[10px] tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/20"
                    >
                      Media Cut Preview
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
