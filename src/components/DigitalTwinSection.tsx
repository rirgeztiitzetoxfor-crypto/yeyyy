import { useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteMedia } from "@/hooks/useSiteMedia";

const FALLBACK_AVATAR = "https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.46.jpeg";

const GREETINGS = [
  {
    lang: "Hindi",
    text: "Namaste! Main Radha Dudeja ki Digital Twin hoon. Chaliye main aapko is website ke important hisson tak guide karti hoon.",
    label: "🇮🇳 Hindi",
  },
  {
    lang: "English",
    text: "Hello! I am Radha's Digital Twin. I can guide you to her booking sections, media kits, or the shadow matrix.",
    label: "🇬🇧 English",
  },
  {
    lang: "Punjabi",
    text: "Sat Sri Akal! Main Radha di AI Twin haan. Aao main tuhanu website ghuma ke dikhawan.",
    label: "🇮🇳 Punjabi",
  },
];

export default function DigitalTwinSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [playing, setPlaying] = useState(false);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [activeGreeting, setActiveGreeting] = useState(0);
  const [voicePlayed, setVoicePlayed] = useState(false);
  const { getMediaUrl } = useSiteMedia();
  const avatarUrl = getMediaUrl("twin_avatar", FALLBACK_AVATAR);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playVoice = async (index: number) => {
    if (loadingVoice) return;
    setActiveGreeting(index);
    setLoadingVoice(true);

    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: GREETINGS[index].text }),
        }
      );

      if (!response.ok) throw new Error("Voice synthesis failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => setVoicePlayed(true);
      await audio.play();
    } catch (err) {
      console.error("Voice playback error:", err);
    } finally {
      setLoadingVoice(false);
    }
  };

  return (
    <section id="digital-twin" className="py-24 px-6 bg-secondary/20">
      <div
        ref={ref}
        className={`container mx-auto max-w-5xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-primary tracking-[0.3em] text-xs uppercase text-center mb-2">
          Voice of the Gods + Digital Twin
        </p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-4">
          Hear Radha — in{" "}
          <em className="text-primary not-italic">three languages.</em>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          AI-powered voice synthesis lets you experience Radha's warmth before she arrives.
          Click a language below to hear her greet you — powered by ElevenLabs multilingual voice technology.
        </p>

        {/* Voice greeting cards */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {GREETINGS.map((g, i) => (
              <button
                key={g.lang}
                onClick={() => playVoice(i)}
                disabled={loadingVoice}
                className={`group relative px-6 py-8 border text-left transition-all duration-300 ${
                  activeGreeting === i && loadingVoice
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary hover:bg-primary/5"
                }`}
              >
                <p className="text-2xl mb-3">{g.label.split(" ")[0]}</p>
                <p className="text-foreground font-heading text-sm tracking-wide mb-2">
                  {g.lang}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                  "{g.text}"
                </p>
                {/* Play indicator */}
                <div className="absolute top-4 right-4">
                  {activeGreeting === i && loadingVoice ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" fill="hsl(var(--primary))" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Avatar preview card */}
          <div className="relative aspect-video bg-card border border-border overflow-hidden group">
            {!playing ? (
              <>
                <img
                  src={avatarUrl}
                  alt="Radha Dudeja — Digital Twin Preview"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <button
                    onClick={() => setPlaying(true)}
                    className="w-20 h-20 border-2 border-primary rounded-full flex items-center justify-center mb-4 hover:bg-primary/10 transition-all duration-300 group-hover:scale-110"
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="hsl(var(--primary))">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                  <p className="text-foreground font-heading text-sm tracking-widest uppercase">
                    Preview Digital Twin
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    AI-powered avatar experience
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-background">
                <div className="relative mb-6">
                  <img
                    src={avatarUrl}
                    alt="AI Radha speaking"
                    className="w-40 h-40 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                </div>
                <p className="text-foreground font-heading text-lg mb-2">
                  "Let me guide you."
                </p>
                <p className="text-muted-foreground text-sm max-w-md text-center mb-6">
                  I am Radha's AI Clone. Where would you like to explore next?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setPlaying(false)}
                    className="px-5 py-2.5 border border-border text-foreground text-xs tracking-widest uppercase font-heading hover:border-primary transition-colors"
                  >
                    Close Preview
                  </button>
                  <a href="#event-lanes" className="px-5 py-2.5 bg-primary/20 text-primary text-xs tracking-widest uppercase font-bold hover:bg-primary/40 transition-colors">
                    Explore Event Lanes
                  </a>
                  <a href="#booking" className="px-5 py-2.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase font-heading hover:bg-primary/90 transition-colors">
                    Book Radha Live
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { icon: "🎙️", label: "3 Languages", desc: "Hindi, English, Punjabi" },
              { icon: "🌐", label: "50+ Languages", desc: "Avatar capability" },
              { icon: "⚡", label: "Real-time", desc: "ElevenLabs powered" },
              { icon: "🔒", label: "Identity-safe", desc: "Brand-protected" },
            ].map((f) => (
              <div key={f.label} className="px-4 py-3 border border-border bg-card text-center">
                <p className="text-lg mb-1">{f.icon}</p>
                <p className="text-foreground text-xs font-heading tracking-wide">{f.label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-muted-foreground text-xs text-center mt-8 tracking-wide">
          Powered by ElevenLabs + HeyGen + D-ID — Part of Radha's GOD LEVEL 2 AI Ecosystem
        </p>
      </div>
    </section>
  );
}
