import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Sparkles,
  Mic2,
  Radio,
  Music,
  CheckCircle,
} from "lucide-react";

interface AudioTrack {
  id: string;
  title: string;
  genre: string;
  duration: string;
  description: string;
  speechText?: string;
  synthFrequency?: number;
}

const TRACKS: AudioTrack[] = [
  {
    id: "intro",
    title: "Signature Artist Voice Intro",
    genre: "Bilingual Greeting",
    duration: "0:30",
    description: "Personal stagecraft welcome & artist intro by Radhaa Dudeja.",
    speechText:
      "Namaste! I am Radhaa Dudeja. Welcome to my digital portfolio and live stagecraft experience. From high-stakes Fortune 500 tech summits to royal destination sangeets, my mission is to engage the mind, ignite the heart, and elevate every stage into an unforgettable memory. Secure your dates directly, and let us create magic together.",
  },
  {
    id: "keynote",
    title: "Fortune 500 Keynote Opener",
    genre: "Corporate Summit",
    duration: "0:45",
    description: "High-impact bilingual keynote intro commanding executive focus & grandeur.",
    synthFrequency: 196.0,
  },
  {
    id: "sangeet",
    title: "Electric Sangeet Countdown",
    genre: "Royal Sangeet",
    duration: "0:52",
    description: "High-voltage crowd ignition getting 500+ guests cheering on the dance floor.",
    synthFrequency: 261.63,
  },
  {
    id: "varmala",
    title: "Poetic Varmala Narrative",
    genre: "Heritage Wedding",
    duration: "1:05",
    description: "Soulful Hindi & English poetry during the royal bride and groom garland reveal.",
    synthFrequency: 174.61,
  },
];

export default function HearRadhaScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeTrack = TRACKS[activeTrackIndex];

  // Web Audio Context & Oscillator
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const progressTimerRef = useRef<any>(null);

  // Scroll listener: Only visible when scrolled past hero (200px)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 220) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        // Automatically close modal when scrolling back to the very top
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop all audio & speech
  const stopAllAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  // Play current track
  const startTrack = (track: AudioTrack) => {
    stopAllAudio();
    setIsPlaying(true);

    if (track.speechText && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(track.speechText);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.includes("en-IN") ||
          v.name.includes("India") ||
          v.name.includes("Female") ||
          v.lang.includes("en-GB")
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);

      // Simulate progress
      progressTimerRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 98 ? 98 : prev + 3.3));
      }, 1000);
    } else {
      // Synthesized stage ambient harmonic sound
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(track.synthFrequency || 220, ctx.currentTime);

        gain.gain.setValueAtTime(isMuted ? 0 : 0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;

        progressTimerRef.current = setInterval(() => {
          setProgress((prev) => (prev >= 100 ? 0 : prev + 2.5));
        }, 1000);
      } catch (e) {
        console.warn("Audio synthesis unavailable", e);
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAllAudio();
    } else {
      startTrack(activeTrack);
    }
  };

  const switchTrack = (index: number) => {
    setActiveTrackIndex(index);
    if (isPlaying) {
      startTrack(TRACKS[index]);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAllAudio();
  }, []);

  return (
    <>
      {/* FLOATING TRIGGER BADGE: Strictly rendered only while scrolling */}
      {isScrolled && (
        <div
          className="fixed bottom-6 right-6 z-40 print:hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Hear Radhaa Dudeja Audio & Stage Voice"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#121212]/95 border border-[#C9A84C]/60 text-white shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl hover:border-[#C9A84C] hover:bg-[#1C1C1C] transition-all hover:scale-105"
          >
            <div className="w-6 h-6 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/50 flex items-center justify-center text-[#E2C775] group-hover:bg-[#C9A84C] group-hover:text-black transition-colors">
              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "animate-pulse" : ""}`} />
            </div>

            <span className="text-xs uppercase font-bold tracking-wider text-[#E2C775]">
              Hear Radhaa
            </span>

            {/* Animated Wave Bars */}
            <div className="flex items-end gap-0.5 h-3.5 pl-0.5">
              <span
                className={`w-0.5 rounded-full bg-[#C9A84C] ${
                  isPlaying ? "h-full animate-pulse" : "h-2"
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-[#E2C775] ${
                  isPlaying ? "h-2/3 animate-pulse delay-75" : "h-3"
                }`}
              />
              <span
                className={`w-0.5 rounded-full bg-[#C9A84C] ${
                  isPlaying ? "h-4/5 animate-pulse delay-150" : "h-1.5"
                }`}
              />
            </div>
          </button>
        </div>
      )}

      {/* FLYOUT AUDIO PLAYER MODAL */}
      {isOpen && isScrolled && (
        <div className="fixed bottom-20 right-6 z-50 w-88 max-w-[calc(100vw-2rem)] bg-[#121212]/98 border border-[#C9A84C]/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl p-5 text-white animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-[#C9A84C]">
                <Radio className="w-3 h-3 text-[#C9A84C] animate-pulse" />
                <span>Artist Voice Signature</span>
              </div>
              <h4 className="text-sm font-serif font-bold text-white mt-0.5">
                Hear Radhaa Dudeja
              </h4>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                stopAllAudio();
              }}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Track Highlight */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A84C]">
                {activeTrack.genre}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {activeTrack.duration}
              </span>
            </div>

            <p className="text-xs font-semibold text-white truncate mb-1">
              {activeTrack.title}
            </p>
            <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
              {activeTrack.description}
            </p>

            {/* Simulated Track Progress Bar */}
            <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C9A84C] to-[#E2C775] h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Track Selection List */}
          <div className="space-y-1.5 mb-4">
            <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
              Select Sound Experience
            </p>
            {TRACKS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => switchTrack(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                  activeTrackIndex === idx
                    ? "bg-[#C9A84C]/20 text-[#E2C775] font-semibold border border-[#C9A84C]/40"
                    : "text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-[10px] text-neutral-500 font-mono">0{idx + 1}</span>
                  <span className="truncate">{t.title}</span>
                </div>
                {activeTrackIndex === idx && isPlaying && (
                  <span className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 h-full bg-[#C9A84C] animate-pulse" />
                    <span className="w-0.5 h-1/2 bg-[#C9A84C] animate-pulse delay-75" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Master Player Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={togglePlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                isPlaying
                  ? "bg-[#C9A84C] text-black shadow-[#C9A84C]/30 hover:bg-[#E2C775]"
                  : "bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black shadow-[#C9A84C]/20 hover:opacity-95"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-black" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                  <span>Listen Now</span>
                </>
              )}
            </button>

            <div className="text-[10px] font-mono text-neutral-500">
              {isPlaying ? "LIVE" : "READY"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
