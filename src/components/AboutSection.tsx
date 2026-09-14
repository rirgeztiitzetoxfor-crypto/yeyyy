import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteMedia } from "@/hooks/useSiteMedia";

const FALLBACK_ABOUT_1 = "https://stellar-duckanoo-7d8373.netlify.app/images/img_14.jpg";
const FALLBACK_ABOUT_2 = "https://stellar-duckanoo-7d8373.netlify.app/images/img_28.jpg";

const languages = [
  { flag: "🇮🇳", name: "Hindi" },
  { flag: "🌍", name: "English" },
  { flag: "🎉", name: "Punjabi" },
];

const stats = [
  { value: "500+", label: "Events Hosted" },
  { value: "8+", label: "Years Experience" },
  { value: "3", label: "Languages Fluent" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { getMediaUrl } = useSiteMedia();

  return (
    <section id="about" className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="grid grid-cols-2 gap-4">
            <img
              src={getMediaUrl("about_photo_1", FALLBACK_ABOUT_1)}
              alt="Radha Dudeja on stage"
              className="w-full aspect-[3/4] object-cover"
              loading="lazy"
            />
            <img
              src={getMediaUrl("about_photo_2", FALLBACK_ABOUT_2)}
              alt="Radha Dudeja close-up"
              className="w-full aspect-[3/4] object-cover mt-8"
              loading="lazy"
            />
          </div>

          <div>
            <p className="text-primary tracking-[0.3em] text-xs uppercase mb-2">
              The Anchor Behind the Magic
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-6">
              From the foothills of <em className="text-primary not-italic">Uttarakhand</em> to centre stage across India
            </h2>
            <blockquote className="text-primary/80 italic text-lg border-l-2 border-primary pl-4 mb-6">
              "I don't just host an event, I ignite an experience."
            </blockquote>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Radha Dudeja enters every stage with the energy of a live wire and the poise of a seasoned speaker.
              Growing up in Ramnagar near the lush forests of Jim Corbett, she was always the one who could charm
              a room — and today, that natural magnetism has blossomed into a career that spans Fortune 500
              conferences, destination weddings, and cultural festivals across India.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Her TEDx-style philosophy is beautifully simple: <em className="text-foreground">engage the mind, ignite the heart</em>,
              and the audience will remember your message. Every event she hosts becomes a living, breathing
              story — thoughtfully crafted, spontaneously delivered.
            </p>

            <div className="flex gap-4 mb-8">
              {languages.map((lang) => (
                <span key={lang.name} className="px-4 py-2 border border-border text-sm text-foreground">
                  {lang.flag} {lang.name}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <a href="#booking" className="px-6 py-3 bg-primary text-primary-foreground font-heading text-xs tracking-widest uppercase">
                Book Radha
              </a>
              <a href="https://www.youtube.com/@anchorrd8794" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-primary text-primary font-heading text-xs tracking-widest uppercase hover:bg-primary/10 transition-colors">
                Watch Showreel
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl text-primary mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-xs tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
