import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const lanes = [
  {
    category: "Wedding / Celebration",
    title: "Wedding Constellation",
    desc: "Warmth, choreography, guest energy, family storytelling, and premium social-event anchoring.",
    langMix: "Hindi + English + Punjabi",
    mood: "emotion + energy",
  },
  {
    category: "Corporate / Brand",
    title: "Brand Command",
    desc: "Polished authority, sharp pacing, brand-safe delivery, and premium event protocol for launches and formal stages.",
    langMix: "English + Hindi",
    mood: "precision + confidence",
  },
  {
    category: "Conference / Summit",
    title: "Summit Flow",
    desc: "Structured transitions, panel moderation rhythm, strong speaker framing, and elegant audience control.",
    langMix: "English + Hindi",
    mood: "clarity + authority",
  },
  {
    category: "Destination / Premium Custom",
    title: "Signature Experience",
    desc: "High-touch stage design, custom scripting, destination logistics, and a luxury-first event atmosphere.",
    langMix: "Custom mix",
    mood: "luxury + spectacle",
  },
];

export default function EventLanesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="event-lanes" className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">Event Lanes</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          The right mood should be <em className="text-primary not-italic">one click away.</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-sm">
          Choose the room first. The booking form will follow that choice instead of making clients explain everything from zero.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {lanes.map((lane) => (
            <div key={lane.title} className="border border-border bg-card p-8 hover:border-primary/40 transition-colors duration-300">
              <p className="text-primary/60 text-xs tracking-widest uppercase mb-2">{lane.category}</p>
              <h3 className="font-heading text-xl text-foreground mb-3">{lane.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{lane.desc}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="text-foreground text-xs"><span className="text-primary/70">Lang:</span> {lane.langMix}</span>
                <span className="text-foreground text-xs"><span className="text-primary/70">Mood:</span> {lane.mood}</span>
              </div>
              <a
                href="#booking"
                className="inline-block px-5 py-2.5 border border-primary text-primary text-xs tracking-widest uppercase font-heading hover:bg-primary/10 transition-colors"
              >
                Use this booking lane
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
