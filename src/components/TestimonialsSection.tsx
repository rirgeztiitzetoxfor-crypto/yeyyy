import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    quote: "Radhaa was the life of our corporate gala — our employees are still talking about her! Her bilingual hosting kept everyone engaged and the energy she brought was electric.",
    name: "Priya Sharma",
    role: "HR Director, Fortune 500 Company · Delhi",
  },
  {
    quote: "She didn't just host our sangeet, she became part of our family! Her impromptu games had even our most reserved relatives dancing. We couldn't imagine our wedding without her.",
    name: "Ananya & Rohan Mehta",
    role: "Wedding Couple · Jim Corbett Destination Wedding",
  },
  {
    quote: "Radhaa handled a last-minute change in our conference schedule with such grace and humor that the audience didn't even notice. True professional — highly recommended for any summit!",
    name: "Vikram Negi",
    role: "Event Director · Uttarakhand Tourism Festival",
  },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">Client Love</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-16">
          What <em className="text-primary not-italic">clients say</em> about Radhaa
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 border border-border bg-card hover:border-primary/30 transition-colors duration-300">
              <div className="text-primary text-4xl font-heading mb-4">"</div>
              <div className="text-primary text-xs tracking-widest mb-4">★★★★★</div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <p className="text-foreground text-sm font-medium">{t.name}</p>
              <p className="text-muted-foreground text-xs mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
