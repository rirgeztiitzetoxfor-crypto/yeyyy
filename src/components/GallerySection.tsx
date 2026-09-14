import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteMedia } from "@/hooks/useSiteMedia";

const FALLBACK_PHOTOS = [
  { src: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.46.jpeg", caption: "Celebration Spark" },
  { src: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49.jpeg", caption: "Stage Presence" },
  { src: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49%20(1).jpeg", caption: "Soft Ivory Grace" },
  { src: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.49%20(2).jpeg", caption: "Editorial Sunlight" },
  { src: "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.50.jpeg", caption: "Portrait" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_17.jpg", caption: "Hotel Entrance – Red Evening Gown" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_11.jpg", caption: "Restaurant – Black Sparkle Dress" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_28.jpg", caption: "Outdoor Ceremony – Pink Top" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_22.jpg", caption: "Hotel Lobby – Black Lace Gown" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_01.jpg", caption: "Event Hosting – Floral White Dress" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_14.jpg", caption: "Wedding Stage – Pastel Blue Gown" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_25.jpg", caption: "Sangeet Ceremony – Night Event" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_32.jpg", caption: "Haldi Function – Green Velvet" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_13.jpg", caption: "Hotel Lobby – Maroon Dress" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_33.jpg", caption: "Wedding Stage – Pink Co-ord" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_20.jpg", caption: "Hotel – Maroon Evening Gown" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_23.jpg", caption: "Safari Resort – Purple Top" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_24.jpg", caption: "Sangeet Night – Dark Red" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_29.jpg", caption: "Sangeet Night – Red Sparkle" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_31.jpg", caption: "Wedding Stage – Red Polka Dot" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_08.jpg", caption: "Temple Event – Floral White" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_06.jpg", caption: "Salon – Pink Sequin Top" },
  { src: "https://stellar-duckanoo-7d8373.netlify.app/images/img_04.jpg", caption: "Hotel Room – Black Mini Dress" },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation();
  const { getMediaUrl, getMediaByCategory, getMediaAlt } = useSiteMedia();

  // Build photos array: use CMS gallery images if available, otherwise fallbacks
  const cmsGallery = getMediaByCategory("gallery");

  const photos = cmsGallery.length > 0
    ? cmsGallery.map((m) => ({ src: m.media_url, caption: m.alt_text || m.slot_id.replace(/_/g, " ") }))
    : FALLBACK_PHOTOS.map((p, i) => ({
        src: getMediaUrl(`gallery_${i + 1}`, p.src),
        caption: getMediaAlt(`gallery_${i + 1}`, p.caption),
      }));

  return (
    <section id="gallery" className="py-24 px-6">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">Proof Strip</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          The energy should still feel <em className="text-primary not-italic">elegant up close.</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-sm">
          Special doesn't mean complicated. It means the room feels held, the event feels expensive, and the audience remembers the energy.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer border border-border hover:border-primary/40 transition-colors"
              onClick={() => setLightbox(i)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="text-foreground text-xs">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/radha_dudeja_/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-primary text-primary font-heading text-xs tracking-widest uppercase hover:bg-primary/10 transition-colors"
          >
            📸 View More on Instagram
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/95 lightbox-overlay flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(lightbox > 0 ? lightbox - 1 : photos.length - 1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground text-3xl hover:text-primary z-10"
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].caption}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <p className="text-center text-foreground text-sm mt-4">{photos[lightbox].caption}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(lightbox < photos.length - 1 ? lightbox + 1 : 0); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground text-3xl hover:text-primary z-10"
            aria-label="Next"
          >
            ›
          </button>
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-foreground text-2xl hover:text-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
