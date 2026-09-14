export default function QuoteSection() {
  return (
    <section className="py-20 px-6 border-y border-border bg-secondary/10">
      <div className="container mx-auto max-w-3xl text-center">
        <p className="text-primary tracking-widest text-sm mb-6">✦ ✦ ✦</p>
        <blockquote className="font-heading text-2xl md:text-3xl text-foreground italic mb-6">
          "Let's create a moment worth remembering."
        </blockquote>
        <p className="text-primary tracking-widest text-sm mb-8">✦ ✦ ✦</p>
        <p className="text-muted-foreground text-sm">
          — <strong className="text-foreground">Radha Dudeja</strong> &nbsp;·&nbsp; Anchor · Emcee · Host
        </p>
        <a
          href="#booking"
          className="inline-block mt-8 px-8 py-3 bg-primary text-primary-foreground font-heading text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
        >
          Book Your Event
        </a>
      </div>
    </section>
  );
}
