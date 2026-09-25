import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const moods = [
  {
    id: "celebration",
    tab: "Celebration Spark",
    tagline: "For sangeets, receptions, and moments that need brightness, charm, and movement.",
    greeting: "Hello, if this is a wedding or celebration, this is the Radhaa who makes the room feel glowing, graceful, and fully alive.",
    looks: "Editorial and expensive",
    sounds: "Warm, clear, trusted",
    leads: "Straight into booking",
    image: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.46.jpeg",
  },
  {
    id: "ivory",
    tab: "Soft Ivory Grace",
    tagline: "For elegant family rooms, intimate luxury events, and softer romantic mood.",
    greeting: "Hello, if this is an intimate gathering or elegant affair, this is the Radhaa who brings warmth, poise, and quiet luxury to every moment.",
    looks: "Soft and refined",
    sounds: "Gentle, poised, intimate",
    leads: "Into curated experience",
    image: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49%20(1).jpeg",
  },
  {
    id: "editorial",
    tab: "Editorial Sunlight",
    tagline: "For polished brand-facing moments, premium portraits, and fashion-forward first impressions.",
    greeting: "Hello, if this is a brand or editorial stage, this is the Radhaa who commands the frame with cinematic presence and sharp authority.",
    looks: "Fashion-forward and bold",
    sounds: "Polished, confident, magnetic",
    leads: "Into brand collaboration",
    image: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49%20(2).jpeg",
  },
];

const floatingTags = [
  "warm command", "alive elegance", "luxury energy",
  "multilingual confidence", "romantic rhythm", "stage wit",
];

export default function FirstHelloSection() {
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  const mood = moods[active];

  return (
    <section id="first-hello" className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">First Hello</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          Let the first ten seconds feel like Radhaa already <em className="text-primary not-italic">entered the room.</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          This is where image, voice, mood, and booking stop feeling like separate pieces. A planner should see her,
          hear her, choose the tone, and know exactly where to go next.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {moods.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 text-xs tracking-widest uppercase font-heading transition-all duration-300 ${
                active === i
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {m.tab}
            </button>
          ))}
        </div>

        {/* Active mood content */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="font-heading text-2xl text-foreground mb-2">{mood.tab}</h3>
            <p className="text-muted-foreground text-sm mb-6 italic">{mood.tagline}</p>

            <p className="text-primary/70 text-xs tracking-widest uppercase mb-2">How she greets them</p>
            <p className="text-foreground/80 text-sm leading-relaxed mb-8">{mood.greeting}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-1">Looks</p>
                <p className="text-foreground text-sm font-medium">{mood.looks}</p>
              </div>
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-1">Sounds</p>
                <p className="text-foreground text-sm font-medium">{mood.sounds}</p>
              </div>
              <div>
                <p className="text-primary text-xs tracking-widest uppercase mb-1">Leads</p>
                <p className="text-foreground text-sm font-medium">{mood.leads}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#booking" className="px-5 py-2.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase font-heading hover:bg-primary/90 transition-colors">
                Book this mood
              </a>
              <a href="#videos" className="px-5 py-2.5 border border-border text-foreground text-xs tracking-widest uppercase font-heading hover:border-primary hover:text-primary transition-colors">
                Open reel and kit
              </a>
            </div>
          </div>

          <div className="relative">
            <img
              src={mood.image}
              alt={mood.tab}
              className="w-full aspect-[3/4] object-cover border border-border"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4">
              <p className="text-foreground text-sm font-medium">Radhaa Dudeja</p>
              <p className="text-muted-foreground text-xs">Anchor RDJ</p>
            </div>
          </div>
        </div>

        {/* Floating tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {floatingTags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 border border-border text-muted-foreground text-xs tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
