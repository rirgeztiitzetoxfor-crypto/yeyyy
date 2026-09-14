import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const pillars = [
  {
    title: "First Glance",
    subtitle: "She should look rare before she even speaks.",
    desc: "Status and beauty are processed faster than logic. The first images decide whether the viewer treats her as premium or replaceable.",
  },
  {
    title: "First Motion",
    subtitle: "A reel should make the room feel possible.",
    desc: "Motion creates belief. A strong reel makes audiences feel her timing, confidence, and atmosphere instead of merely reading about them.",
  },
  {
    title: "First Voice",
    subtitle: "Trust should arrive through warmth, not explanation.",
    desc: "Voice is intimacy. A polished greeting creates trust faster than text because it feels like direct human presence.",
  },
  {
    title: "First Reply",
    subtitle: "Booking should feel guided, not chased.",
    desc: "Clients feel cared for when responses are fast, contextual, and emotionally right. Delays and generic replies destroy perceived value.",
  },
];

export default function EditorialPhilosophy() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">How the front door should win</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-16">
          Every component needs to move <em className="text-primary not-italic">one human feeling.</em>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="p-8 border border-border bg-card hover:border-primary/30 transition-colors duration-300">
              <h3 className="font-heading text-lg text-primary mb-2">{p.title}</h3>
              <p className="text-foreground text-sm font-medium mb-3">{p.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
