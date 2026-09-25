import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteMedia } from "@/hooks/useSiteMedia";

const DEFAULT_VIDEOS = [
  {
    slotId: "video_showreel",
    urlSlotId: "video_showreel_url",
    label: "🔥 Channel Highlight",
    title: "Anchor Radha Dudeja — Full Channel Showreel",
    fallbackUrl: "https://www.youtube.com/@anchorrd8794",
  },
  {
    slotId: "video_corporate",
    urlSlotId: "video_corporate_url",
    label: "💼 Corporate",
    title: "Conference & Summit Hosting",
    fallbackUrl: "https://www.youtube.com/@anchorrd8794",
  },
  {
    slotId: "video_weddings",
    urlSlotId: "video_weddings_url",
    label: "💍 Weddings",
    title: "Sangeet & Reception Highlights",
    fallbackUrl: "https://www.youtube.com/@anchorrd8794",
  },
];

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId = u.searchParams.get("v");
    if (!videoId && u.hostname === "youtu.be") {
      videoId = u.pathname.slice(1);
    }
    if (!videoId && u.pathname.includes("/embed/")) {
      videoId = u.pathname.split("/embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

export default function VideoSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { getMediaUrl } = useSiteMedia();

  return (
    <section id="videos" className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">Watch Radha in Action</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          From the <em className="text-primary not-italic">showreel</em> & channel
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-sm">
          Words describe talent. Videos prove it. Watch Radha host, engage, and electrify audiences across India's most memorable events.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {DEFAULT_VIDEOS.map((v, i) => {
            const youtubeUrl = getMediaUrl(v.urlSlotId, v.fallbackUrl);
            const uploadedVideo = getMediaUrl(v.slotId, "");
            const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

            return (
              <div key={i} className="border border-border bg-card overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                  {uploadedVideo ? (
                    <video
                      src={uploadedVideo}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={v.title}
                    />
                  ) : (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center p-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-primary text-2xl">▶</span>
                      </div>
                      <p className="text-foreground text-sm">Watch on YouTube</p>
                    </a>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-primary tracking-widest">{v.label}</span>
                  <p className="text-foreground text-sm mt-1">{v.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.youtube.com/@anchorrd8794"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-primary text-primary font-heading text-xs tracking-widest uppercase hover:bg-primary/10 transition-colors"
          >
            ▶ Subscribe on YouTube
          </a>
          <p className="text-muted-foreground text-xs mt-2">@anchorrd8794 · 1300+ Videos</p>
        </div>
      </div>
    </section>
  );
}
