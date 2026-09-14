import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const blocks = [
  {
    tag: "Entrance",
    title: "The room changes when she does.",
    desc: "Not louder. Just more alive, more composed, and more beautifully in control.",
    image: null,
  },
  {
    tag: "Warmth",
    title: "Luxury without stiffness.",
    desc: "She can feel expensive, intimate, energetic, and human at the same time.",
    image: null,
  },
  {
    tag: "Booking",
    title: "Seamless scheduling, elevated experience.",
    desc: "Book your session with a concierge who understands the art of anticipation.",
    image: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49.jpeg",
  },
];

export default function EntranceWarmthConversion() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid md:grid-cols-3 gap-8">
          {blocks.map((b) => (
            <div key={b.tag} className="border border-border bg-card p-8">
              <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">{b.tag}</p>
              <h3 className="font-heading text-xl text-foreground mb-3">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{b.desc}</p>
              {b.image && (
                <img src={b.image} alt={b.tag} className="w-full aspect-video object-cover border border-border" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
