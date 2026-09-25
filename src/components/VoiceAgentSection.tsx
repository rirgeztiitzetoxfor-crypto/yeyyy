import { useState, useRef } from "react";
import { Volume2, X, Play, Square } from "lucide-react";
import { requestVoicePreview } from "@/lib/voicePreview";

const INTRO_TEXT = "Namaste! I am Radhaa Dudeja. Welcome to my digital portfolio and interactive experience. From corporate galas to luxury sangeets, let my voice guide the energy of your next event. Feel free to explore my event lanes, check out my media cuts in the resource matrix, and secure your dates directly.";

export default function VoiceAgentSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleVoice = async () => {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    if (!audioRef.current) {
      setLoading(true);
      try {
        const url = await requestVoicePreview(INTRO_TEXT);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setPlaying(false);
        await audio.play();
        setPlaying(true);
      } catch (e) {
        console.error("Voice synthesis failed", e);
        alert("Failed to synthesize voice. Ensure ELEVENLABS_API_KEY is active.");
      } finally {
        setLoading(false);
      }
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="fixed right-0 top-[60%] -translate-y-1/2 z-[60] flex items-center shadow-2xl">
      {/* Tab toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#C9A84C] text-black py-6 px-3 rounded-l-md shadow-2xl flex flex-col items-center gap-2 hover:bg-white transition-colors"
      >
        <Volume2 className="h-5 w-5" />
        <span className="text-[10px] tracking-widest uppercase font-bold" style={{ writingMode: 'vertical-rl' }}>
          Listen to Intro
        </span>
      </button>

      {/* Flyout panel */}
      {isOpen && (
        <div className="bg-[#0A0A0A] border-l border-y border-[#C9A84C]/50 shadow-2xl p-6 w-80 animate-in slide-in-from-right-10 duration-300 relative">
          <div className="flex justify-between items-start mb-6 border-b border-[#C9A84C]/20 pb-4">
            <h4 className="text-[#C9A84C] tracking-[0.2em] font-bold uppercase text-xs flex items-center gap-2">
              <Volume2 className="w-4 h-4"/> AI Voice Agent
            </h4>
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <img 
            src="https://stellular-blancmange-2a0822.netlify.app/radha/photos/WhatsApp%20Image%202026-03-12%20at%2022.00.46.jpeg" 
            alt="Radhaa Preview" 
            className="w-full h-32 object-cover mb-4 border border-[#C9A84C]/30 grayscale opacity-80"
          />

          <p className="text-xs text-white/80 mb-6 leading-relaxed font-serif italic border-l block pl-4 border-[#C9A84C]">
            "{INTRO_TEXT}"
          </p>
          
          <button 
            onClick={toggleVoice}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#C9A84C] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? <span className="animate-pulse">Synthesizing Audio...</span> : playing ? <><Square className="h-3 w-3" /> Stop Experience</> : <><Play className="h-3 w-3" /> Play Scraped Audio</>}
          </button>
        </div>
      )}
    </div>
  );
}
