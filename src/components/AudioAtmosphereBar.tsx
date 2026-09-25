import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Radio,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Mic2,
} from "lucide-react";

interface AudioTrack {
  id: string;
  title: string;
  genre: string;
  duration: string;
  description: string;
}

const TRACKS: AudioTrack[] = [
  {
    id: "keynote",
    title: "Fortune 500 Keynote Opener",
    genre: "Corporate Summit",
    duration: "0:45",
    description: "High-impact bilingual keynote intro commanding executive focus & grandeur.",
  },
  {
    id: "sangeet",
    title: "Electric Sangeet Countdown",
    genre: "Royal Sangeet",
    duration: "0:52",
    description: "High-voltage crowd ignition getting 500+ guests cheering on the dance floor.",
  },
  {
    id: "varmala",
    title: "Poetic Varmala Narrative",
    genre: "Heritage Wedding",
    duration: "1:05",
    description: "Soulful Hindi & English poetry during the royal bride and groom garland reveal.",
  },
];

export default function AudioAtmosphereBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const activeTrack = TRACKS[activeTrackIndex];

  // Synthesized Web Audio API sound generator so it works out of the box with zero external audio assets!
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<any>(null);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      // Create a smooth ambient harmonic stage chord
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Warm frequencies depending on track
      const baseFreq = activeTrackIndex === 0 ? 196.0 : activeTrackIndex === 1 ? 261.63 : 174.61;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : 0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime + 1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => (prev >= 45 ? 0 : prev + 1));
      }, 1000);
    } catch (e) {
      console.warn("WebAudio not supported", e);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch {}
      oscillatorRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const switchTrack = (index: number) => {
    if (isPlaying) {
      stopAudio();
      setActiveTrackIndex(index);
      setCurrentTime(0);
      setTimeout(() => startAudio(), 100);
    } else {
      setActiveTrackIndex(index);
      setCurrentTime(0);
    }
  };

  return (
    <aside aria-label="Stage Audio Atmosphere" className="fixed bottom-6 left-6 z-40 print:hidden select-none">
      <div className="bg-[#121212]/95 border border-[#C9A84C]/40 rounded-2xl shadow-2xl backdrop-blur-xl p-3 text-white max-w-xs transition-all">
        {/* Main Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/30 scale-105"
                : "bg-white/10 hover:bg-white/20 text-[#E2C775]"
            }`}
            title={isPlaying ? "Pause Stage Audio Atmosphere" : "Play Stage Audio Atmosphere"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C] truncate">
                {activeTrack.genre}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-full bg-[#C9A84C] animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-[#E2C775] animate-pulse delay-75" />
                  <span className="w-0.5 h-4/5 bg-[#C9A84C] animate-pulse delay-150" />
                </div>
              )}
            </div>
            <p className="text-xs font-serif text-white truncate">{activeTrack.title}</p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Tracklist & Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
            <p className="text-[10px] text-neutral-400 leading-snug">{activeTrack.description}</p>
            
            <div className="space-y-1">
              {TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => switchTrack(idx)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                    activeTrackIndex === idx
                      ? "bg-[#C9A84C]/20 text-[#E2C775] font-semibold border border-[#C9A84C]/30"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="truncate pr-2">{t.title}</span>
                  <span className="text-[10px] font-mono text-neutral-500">{t.duration}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
