import React, { useState, useEffect, useRef } from "react";
import {
  Scissors,
  Crop,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  Sliders,
  Square,
  Smartphone,
  Monitor,
  Layout,
  User,
  Check,
  Zap,
  Info,
  Maximize2,
  Film,
} from "lucide-react";

export type AspectRatioOption = "16/9" | "9/16" | "4/5" | "1/1" | "21/9" | "auto";
export type FocalPointOption = "top" | "center" | "bottom" | "left" | "right";
export type FitModeOption = "cover" | "contain";

export interface MediaCropTrimConfig {
  clipStart?: number;
  clipEnd?: number;
  aspectRatio: AspectRatioOption;
  focalPoint: FocalPointOption;
  fitMode: FitModeOption;
}

interface MediaCropAndTrimStudioProps {
  mediaUrl: string;
  mediaType: "image" | "video";
  initialConfig?: Partial<MediaCropTrimConfig>;
  slotLabel?: string;
  onChange: (config: MediaCropTrimConfig) => void;
  className?: string;
}

export function formatSecondsToTime(totalSec: number): string {
  if (isNaN(totalSec) || totalSec < 0) return "00:00";
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(":");
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  const val = parseFloat(timeStr);
  return isNaN(val) ? 0 : val;
}

export default function MediaCropAndTrimStudio({
  mediaUrl,
  mediaType,
  initialConfig,
  slotLabel,
  onChange,
  className = "",
}: MediaCropAndTrimStudioProps) {
  // Video Trimming State
  const [clipStart, setClipStart] = useState<number>(initialConfig?.clipStart || 0);
  const [clipEnd, setClipEnd] = useState<number>(initialConfig?.clipEnd || (mediaType === "video" ? 30 : 0));
  const [activePreset, setActivePreset] = useState<"15s" | "30s" | "45s" | "full" | "custom">(
    initialConfig?.clipEnd && initialConfig.clipEnd - (initialConfig.clipStart || 0) === 15
      ? "15s"
      : initialConfig?.clipEnd && initialConfig.clipEnd - (initialConfig.clipStart || 0) === 30
      ? "30s"
      : initialConfig?.clipEnd && initialConfig.clipEnd - (initialConfig.clipStart || 0) === 45
      ? "45s"
      : initialConfig?.clipEnd
      ? "custom"
      : "30s"
  );

  // Photo Aspect Ratio & Framing State
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(
    initialConfig?.aspectRatio || (mediaType === "video" ? "16/9" : "16/9")
  );
  const [focalPoint, setFocalPoint] = useState<FocalPointOption>(initialConfig?.focalPoint || "top");
  const [fitMode, setFitMode] = useState<FitModeOption>(initialConfig?.fitMode || "cover");

  // Video playback preview state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(clipStart);
  const [videoDuration, setVideoDuration] = useState<number>(60);

  // Notify parent of changes
  useEffect(() => {
    onChange({
      clipStart: mediaType === "video" && activePreset !== "full" ? clipStart : undefined,
      clipEnd: mediaType === "video" && activePreset !== "full" ? clipEnd : undefined,
      aspectRatio,
      focalPoint,
      fitMode,
    });
  }, [clipStart, clipEnd, activePreset, aspectRatio, focalPoint, fitMode, mediaType, onChange]);

  // Video Time Loop Clamping (Only plays between clipStart and clipEnd)
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const now = videoRef.current.currentTime;
    setCurrentPlaybackTime(now);

    if (activePreset !== "full" && clipEnd > 0 && now >= clipEnd) {
      videoRef.current.currentTime = clipStart;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const applyPreset = (preset: "15s" | "30s" | "45s" | "full") => {
    setActivePreset(preset);
    if (preset === "15s") {
      setClipStart(0);
      setClipEnd(15);
      if (videoRef.current) videoRef.current.currentTime = 0;
    } else if (preset === "30s") {
      setClipStart(0);
      setClipEnd(30);
      if (videoRef.current) videoRef.current.currentTime = 0;
    } else if (preset === "45s") {
      setClipStart(0);
      setClipEnd(45);
      if (videoRef.current) videoRef.current.currentTime = 0;
    } else if (preset === "full") {
      setClipStart(0);
      setClipEnd(videoDuration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Helper aspect ratio CSS class or style
  const getAspectStyle = () => {
    switch (aspectRatio) {
      case "16/9":
        return "aspect-[16/9]";
      case "9/16":
        return "aspect-[9/16] max-h-[380px] mx-auto";
      case "4/5":
        return "aspect-[4/5] max-h-[380px] mx-auto";
      case "1/1":
        return "aspect-[1/1] max-h-[360px] mx-auto";
      case "21/9":
        return "aspect-[21/9]";
      case "auto":
      default:
        return "aspect-auto max-h-[360px]";
    }
  };

  const getFocalPositionStyle = () => {
    switch (focalPoint) {
      case "top":
        return "center top";
      case "center":
        return "center center";
      case "bottom":
        return "center bottom";
      case "left":
        return "left center";
      case "right":
        return "right center";
      default:
        return "center center";
    }
  };

  const isYouTube = mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be");
  const isDirectVideo = mediaType === "video" && !isYouTube;
  const trimmedDuration = Math.max(0, clipEnd - clipStart);

  return (
    <div className={`p-5 rounded-2xl bg-[#0F0F0F] border border-[#C9A84C]/30 shadow-xl space-y-6 ${className}`}>
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C]">
            {mediaType === "video" ? <Scissors className="w-4 h-4" /> : <Crop className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-serif font-bold text-white tracking-wide">
                {mediaType === "video" ? "Video Highlight Trimmer & Stream Parts" : "Photo Aspect Ratio & Smart Framing"}
              </h4>
              <span className="text-[10px] font-mono font-bold text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2 py-0.5 rounded-full">
                {mediaType === "video" ? "Fast Streaming" : "Lock Ratio"}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {mediaType === "video"
                ? "Very long videos slow down loading. Trim to a high-voltage 15s–45s highlight loop."
                : "Photos need precise proportions so Radhaa's face and stage presence are never cut off."}
            </p>
          </div>
        </div>

        {slotLabel && (
          <span className="text-[10px] font-mono text-[#E2C775] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg truncate max-w-[200px]">
            Slot: {slotLabel}
          </span>
        )}
      </div>

      {/* ============================================================ */}
      {/* PART A: VIDEO SEGMENT & HIGHLIGHT TRIMMER CONTROLS            */}
      {/* ============================================================ */}
      {mediaType === "video" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs uppercase font-mono tracking-wider text-[#C9A84C] font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#E2C775]" /> Select Highlight Duration Preset
            </label>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>
                {activePreset === "full"
                  ? "Full length video (Longer load)"
                  : `Loading ${trimmedDuration}s Segment (${formatSecondsToTime(clipStart)} ➔ ${formatSecondsToTime(clipEnd)})`}
              </span>
            </div>
          </div>

          {/* Quick Duration Preset Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => applyPreset("15s")}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activePreset === "15s"
                  ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                  : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ 15s Hook</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("30s")}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activePreset === "30s"
                  ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                  : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🎯 30s Showcase</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("45s")}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activePreset === "45s"
                  ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                  : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>👑 45s Reel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePreset("custom");
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activePreset === "custom"
                  ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                  : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Range</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset("full")}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all col-span-2 sm:col-span-1 ${
                activePreset === "full"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10"
              }`}
            >
              <span>Full Video</span>
            </button>
          </div>

          {/* Precision Time Scrubbers & Range Sliders */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1 flex items-center justify-between">
                  <span>Clip Start Time:</span>
                  <span className="text-[#C9A84C] font-bold">{formatSecondsToTime(clipStart)}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(60, videoDuration - 5)}
                    value={clipStart}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setClipStart(val);
                      if (val >= clipEnd) setClipEnd(val + 15);
                      setActivePreset("custom");
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="w-full accent-[#C9A84C] h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formatSecondsToTime(clipStart)}
                    onChange={(e) => {
                      const sec = parseTimeToSeconds(e.target.value);
                      setClipStart(sec);
                      setActivePreset("custom");
                    }}
                    className="w-16 bg-[#181818] border border-white/15 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:border-[#C9A84C] outline-none"
                    placeholder="00:00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1 flex items-center justify-between">
                  <span>Clip End Time:</span>
                  <span className="text-[#C9A84C] font-bold">{formatSecondsToTime(clipEnd)}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max={Math.max(120, videoDuration)}
                    value={clipEnd}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setClipEnd(val);
                      if (val <= clipStart) setClipStart(Math.max(0, val - 15));
                      setActivePreset("custom");
                    }}
                    className="w-full accent-[#C9A84C] h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formatSecondsToTime(clipEnd)}
                    onChange={(e) => {
                      const sec = parseTimeToSeconds(e.target.value);
                      setClipEnd(sec);
                      setActivePreset("custom");
                    }}
                    className="w-16 bg-[#181818] border border-white/15 rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:border-[#C9A84C] outline-none"
                    placeholder="00:30"
                  />
                </div>
              </div>
            </div>

            {/* Visual Segment Timeline Bar */}
            <div className="space-y-1 pt-1">
              <div className="relative w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden flex items-center">
                {/* Visual active trimmed segment */}
                <div
                  className="absolute h-full bg-gradient-to-r from-[#C9A84C] to-[#E2C775] rounded-full shadow-md"
                  style={{
                    left: `${Math.min(95, (clipStart / Math.max(videoDuration, 60)) * 100)}%`,
                    width: `${Math.max(5, Math.min(100, ((clipEnd - clipStart) / Math.max(videoDuration, 60)) * 100))}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>00:00</span>
                <span className="text-[#E2C775] font-semibold">
                  ⚡ Segment Length: {trimmedDuration}s (Loads instantly on mobile & desktop)
                </span>
                <span>{formatSecondsToTime(Math.max(videoDuration, 60))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PART B: PHOTO ASPECT RATIO & FRAMING CONTROLS                */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase font-mono tracking-wider text-[#C9A84C] font-semibold flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-[#E2C775]" /> Aspect Ratio Lock ({aspectRatio})
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">
            Target Container Proportions
          </span>
        </div>

        {/* Aspect Ratio Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { id: "16/9", label: "16:9 Stage", desc: "Horizontal Rail", icon: Monitor },
            { id: "9/16", label: "9:16 Reel", desc: "Vertical Full", icon: Smartphone },
            { id: "4/5", label: "4:5 Portrait", desc: "Magazine Cut", icon: User },
            { id: "1/1", label: "1:1 Square", desc: "Grid Card", icon: Square },
            { id: "21/9", label: "21:9 Ultra", desc: "Hero Billboard", icon: Monitor },
            { id: "auto", label: "Auto", desc: "Original File", icon: Maximize2 },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = aspectRatio === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAspectRatio(item.id as AspectRatioOption)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-[#C9A84C] text-black border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20 font-bold"
                    : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-mono">{item.id}</span>
                </div>
                <p className={`text-[10px] truncate ${isSelected ? "text-black/80" : "text-neutral-400"}`}>
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Smart Focal Point Anchor & Fit Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Focal Point Alignment */}
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Smart Focal Point (Never Cut Head / Face)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "top", label: "👤 Face / Top" },
                { id: "center", label: "🎯 Center Stage" },
                { id: "bottom", label: "👥 Crowd / Floor" },
              ].map((fp) => (
                <button
                  key={fp.id}
                  type="button"
                  onClick={() => setFocalPoint(fp.id as FocalPointOption)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                    focalPoint === fp.id
                      ? "bg-[#C9A84C] text-black shadow-md font-bold"
                      : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
                  }`}
                >
                  {fp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Mode */}
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Fit Mode: Bleed Fill vs Complete Photo</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setFitMode("cover")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                  fitMode === "cover"
                    ? "bg-[#C9A84C] text-black shadow-md font-bold"
                    : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
                }`}
              >
                Cover (Full Bleed Fill)
              </button>
              <button
                type="button"
                onClick={() => setFitMode("contain")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
                  fitMode === "contain"
                    ? "bg-[#C9A84C] text-black shadow-md font-bold"
                    : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
                }`}
              >
                Contain (Show Entire Photo)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PART C: LIVE INTERACTIVE PREVIEW BOX WITH GRID OVERLAY       */}
      {/* ============================================================ */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> Live Framing & Segment Loop Preview
          </span>
          <span className="font-mono text-[11px] text-[#E2C775]">
            {aspectRatio} • {focalPoint.toUpperCase()} • {fitMode.toUpperCase()}
          </span>
        </div>

        {/* Live Preview Window */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-[#C9A84C]/40 shadow-2xl flex items-center justify-center p-2 min-h-[220px]">
          <div
            className={`w-full relative rounded-xl overflow-hidden bg-neutral-900 border border-white/10 transition-all duration-300 ${getAspectStyle()}`}
          >
            {mediaType === "video" ? (
              isYouTube ? (
                <iframe
                  src={`${mediaUrl}${mediaUrl.includes("?") ? "&" : "?"}start=${clipStart}&end=${clipEnd}&autoplay=1&mute=1&loop=1`}
                  title="YouTube Clip Preview"
                  className="w-full h-full pointer-events-none"
                  allow="autoplay; encrypted-media"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  playsInline
                  muted
                  autoPlay
                  className="w-full h-full"
                  style={{
                    objectPosition: getFocalPositionStyle(),
                    objectFit: fitMode,
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />
              )
            ) : (
              <img
                src={mediaUrl}
                alt="Framing Preview"
                className="w-full h-full transition-all duration-300"
                style={{
                  objectPosition: getFocalPositionStyle(),
                  objectFit: fitMode,
                }}
              />
            )}

            {/* Rule of Thirds Grid Overlay for precise composition */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 hover:opacity-40 transition-opacity">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-b border-white" />
              <div />
            </div>

            {/* Floating Live Badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
              <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#C9A84C] border border-[#C9A84C]/30 font-bold uppercase">
                {mediaType === "video" ? `✂️ ${trimmedDuration}s Segment` : `📐 ${aspectRatio}`}
              </span>
              <span className="bg-emerald-500/90 text-black px-1.5 py-0.5 rounded text-[9px] font-bold">
                Live Frame
              </span>
            </div>

            {/* Video Play / Scrub Controls Overlay */}
            {isDirectVideo && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 hover:text-[#C9A84C] transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <span className="text-[11px] text-white">
                  {formatSecondsToTime(currentPlaybackTime)} / {formatSecondsToTime(clipEnd)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = clipStart;
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="p-1 hover:text-[#C9A84C] transition-colors"
                  title="Loop from clip start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
