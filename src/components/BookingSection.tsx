import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteMedia } from "@/hooks/useSiteMedia";

const eventLanes = [
  { value: "wedding", label: "Wedding / Celebration", title: "Wedding Constellation", mood: "emotion + energy" },
  { value: "corporate", label: "Corporate / Brand", title: "Brand Command", mood: "precision + confidence" },
  { value: "summit", label: "Conference / Summit", title: "Summit Flow", mood: "clarity + authority" },
];

const briefPoints = [
  "Event date, city, and venue type",
  "Audience size, vibe, and preferred language mix",
  "Run sheet, key moments, and hosting style needed",
  "Brand, family, or organizer contact details",
];

export default function BookingSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { getMediaUrl } = useSiteMedia();
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitted(true);
  };

  return (
    <section id="booking" className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Fast brief header */}
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">Fast Brief</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          Let the first hello already feel like a <em className="text-primary not-italic">booking.</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 text-sm">
          A premium booking lane for weddings, corporate events, conferences, destination celebrations, and custom stage experiences.
          If the date matters, send the essentials here and the real conversation starts with context instead of back-and-forth.
        </p>

        {/* Event lane pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {eventLanes.map((l) => (
            <div key={l.value} className="px-5 py-3 border border-border bg-card text-center">
              <p className="text-primary/60 text-xs tracking-widest uppercase">{l.label}</p>
              <p className="text-foreground text-sm font-heading mt-1">{l.title}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{l.mood}</p>
            </div>
          ))}
        </div>

        {/* What to send */}
        <div className="max-w-xl mx-auto mb-12">
          <p className="text-primary/60 text-xs tracking-widest uppercase text-center mb-3">What to send</p>
          <ul className="space-y-1">
            {briefPoints.map((p, i) => (
              <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                <span className="text-primary">•</span> {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Form section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-heading text-xl text-foreground text-center mb-2">Direct event brief</h3>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Share the real date, city, and vibe. This goes into the live intake lane and can move straight into WhatsApp follow-up.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center border border-primary/30 bg-card p-12">
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-heading text-xl text-foreground mb-2">Brief Received!</h3>
                <p className="text-muted-foreground text-sm mb-4">Priority response within one working day for complete briefs.</p>
                <a
                  href="https://wa.me/918192901515?text=Hi%20Radha%2C%20I%20just%20sent%20an%20event%20brief%20through%20your%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground font-heading text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  Continue on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <input type="text" placeholder="Your name" required className="w-full px-4 py-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              <input type="tel" placeholder="Phone / WhatsApp" required className="w-full px-4 py-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              <input type="text" placeholder="Event city" className="w-full px-4 py-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              <input type="date" placeholder="Event date" className="w-full px-4 py-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />

              <select className="w-full px-4 py-3 bg-card border border-border text-foreground text-sm focus:border-primary focus:outline-none transition-colors">
                <option value="">Event style</option>
                <option value="wedding">Wedding / Celebration</option>
                <option value="corporate">Corporate / Brand</option>
                <option value="summit">Conference / Summit</option>
                <option value="custom">Destination / Premium Custom</option>
              </select>

              <textarea placeholder="What should the room feel like?" rows={4} className="w-full px-4 py-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none" />

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 accent-[hsl(var(--primary))]"
                />
                <span className="text-muted-foreground text-xs leading-relaxed">
                  I want Radhaa or her team to contact me about this event brief.
                </span>
              </label>

              <p className="text-muted-foreground text-xs text-center">
                Priority response within one working day for complete briefs. For instant conversation, you can also continue on{" "}
                <a
                  href="https://wa.me/918192901515?text=Hi%20Radha%2C%20I%20want%20to%20check%20availability%20for%20an%20event."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>.
              </p>

              <button
                type="submit"
                disabled={!consent}
                className="w-full py-4 bg-primary text-primary-foreground font-heading text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send event brief
              </button>
            </form>
          )}

          {/* Paytm Code */}
          <div className="mt-12 text-center bg-card p-8 border border-border shadow-xl">
            <h3 className="font-heading text-xl text-foreground mb-2 text-[#C9A84C]">Secure Your Date</h3>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-6 border-b border-border pb-4">Scan to pay booking advance via Paytm</p>
            <div className="bg-white p-4 inline-block rounded-lg mx-auto">
              <img src={getMediaUrl("paytm_qr", "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=paytm-placeholder")} alt="Paytm QR" className="w-48 h-48" />
            </div>
            <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] mt-6">Updated via Admin Intelligence</p>
          </div>
        </div>
      </div>
    </section>
  );
}
