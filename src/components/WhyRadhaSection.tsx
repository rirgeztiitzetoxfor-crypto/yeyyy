import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  { num: "01", icon: "⚡", title: "High Energy & Enthusiasm", desc: "Radha has a knack for instantly lighting up any venue. Her voice is assertive yet friendly, commanding attention from the first word without ever needing to shout." },
  { num: "02", icon: "❤️", title: "Audience Connection", desc: "Her genuine warmth helps her bond with audiences of all sizes. Guests frequently remark that they feel like they've known her for years after just one event." },
  { num: "03", icon: "🎭", title: "Spontaneity & Grace", desc: "Schedule change? Chief guest running late? AV glitch? Radhaa's improv skills and quick wit keep the audience entertained no matter what happens backstage." },
  { num: "04", icon: "🌐", title: "Multilingual Fluency", desc: "Fluent in Hindi, English, and Punjabi. She might welcome delegates in polished English, then charm locals with a Punjabi proverb — inclusivity in every syllable." },
  { num: "05", icon: "💎", title: "Elegance & Professionalism", desc: "From formal gowns for corporate galas to vibrant outfits for cultural events — Radha embodies professional glamour, punctuality, and thorough preparation." },
  { num: "06", icon: "🎤", title: "TEDx-Style Philosophy", desc: "She approaches every stage with a speaker's mindset: meticulous preparation, an improviser's flexibility, and a deep desire to move hearts — not just fill schedules." },
];

export default function WhyRadhaSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">Why Radha?</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          Stage presence that <em className="text-primary not-italic">sets her apart</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-sm leading-relaxed">
          Radha is frequently praised as an "articulate and engaging anchor" who brings a unique blend of
          professionalism and charisma. From spontaneous crowd management to heartfelt storytelling,
          she adapts to every audience with precision and warmth.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.num} className="p-6 border border-border hover:border-primary/40 transition-colors duration-300 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-heading text-2xl text-primary/30">{r.num}</span>
                <span className="text-xl">{r.icon}</span>
              </div>
              <h3 className="font-heading text-lg text-foreground mb-3">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
