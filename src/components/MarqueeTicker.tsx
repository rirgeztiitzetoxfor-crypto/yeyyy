const items = [
  "Destination-Ready Host",
  "Live Event Warmth",
  "Editorial Showreel Energy",
  "Luxury Wedding Anchor",
  "Brand-Stage Command",
  "Trilingual MC",
  "Summit Moderator",
  "Award Ceremonies",
];

export default function MarqueeTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border py-4 bg-secondary/30">
      <div className="animate-marquee flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="mx-6 text-sm tracking-widest uppercase text-muted-foreground">
            {item} <span className="text-primary ml-6">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
