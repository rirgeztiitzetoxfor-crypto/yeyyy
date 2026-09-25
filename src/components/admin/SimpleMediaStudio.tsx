import React, { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Check,
  Sparkles,
  Play,
  Clock,
  Crop,
  Layers,
  Save,
  AlertCircle,
  Eye,
  Film,
  Instagram,
  Youtube,
  HardDrive,
} from "lucide-react";
import {
  MASTER_SITE_SLOTS,
  getSlotById,
  resolveSlotMedia,
  type SiteSlotDefinition,
} from "@/lib/siteSlots";
import {
  parseGoogleDriveUrl,
  parseYouTubeEmbedUrl,
  type SiteMedia,
} from "@/hooks/useSiteMedia";
import { storeLocalFile } from "@/lib/indexedDbMedia";

interface SimpleMediaStudioProps {
  existingMediaList: SiteMedia[];
  onMediaSaved: (
    item: Partial<SiteMedia> & { slot_id: string; media_url: string }
  ) => Promise<void>;
  initialSlotId?: string;
}

export type AspectRatioType = "16/9" | "9/16" | "4/5" | "1/1" | "21/9";

const ASPECT_RATIO_OPTIONS: { id: AspectRatioType; label: string; desc: string; icon: string }[] = [
  { id: "16/9", label: "16:9 Landscape", desc: "Hero Billboards & Widescreen Showreels", icon: "▭" },
  { id: "9/16", label: "9:16 Vertical Reel", desc: "Instagram Reels & YouTube Shorts", icon: "▯" },
  { id: "4/5", label: "4:5 Portrait", desc: "Celebrity Stage Portraits & Editorial", icon: "▯" },
  { id: "1/1", label: "1:1 Square", desc: "Social Feeds & Square Highlights", icon: "□" },
  { id: "21/9", label: "21:9 Ultra-Wide", desc: "Cinematic Stage Backdrops", icon: "▬" },
];

export default function SimpleMediaStudio({
  existingMediaList,
  onMediaSaved,
  initialSlotId = "hero_billboard",
}: SimpleMediaStudioProps) {
  const [mode, setMode] = useState<"file_upload" | "url_embed">("file_upload");
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlotId);

  // Active slot definition & current media
  const currentSlotDef = getSlotById(selectedSlotId);
  const currentLive = resolveSlotMedia(selectedSlotId, existingMediaList);

  // Common item metadata
  const [title, setTitle] = useState(currentLive.title || currentSlotDef?.default_title || "");
  const [mediaType, setMediaType] = useState<"image" | "video">(currentLive.type || "image");
  const [badge, setBadge] = useState(currentLive.badge || currentSlotDef?.badge || "");

  // Aspect ratio & video length
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(
    (currentLive.aspect_ratio as AspectRatioType) || "16/9"
  );
  const [fitMode, setFitMode] = useState<"cover" | "contain">(currentLive.fit_mode || "cover");
  const [videoDuration, setVideoDuration] = useState<string>("0:45 min");
  const [clipStartSec, setClipStartSec] = useState<number>(currentLive.clip_start || 0);
  const [clipEndSec, setClipEndSec] = useState<number>(currentLive.clip_end || 30);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // URL Embed State
  const [rawEmbedUrl, setRawEmbedUrl] = useState<string>("");
  const [parsedEmbedUrl, setParsedEmbedUrl] = useState<string>("");

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // When target slot changes from dropdown
  const handleSlotChange = (newSlotId: string) => {
    setSelectedSlotId(newSlotId);
    const live = resolveSlotMedia(newSlotId, existingMediaList);
    const slotDef = getSlotById(newSlotId);
    setTitle(live.title || slotDef?.default_title || "");
    setMediaType(live.type || slotDef?.default_type || "image");
    setBadge(live.badge || slotDef?.badge || "");
    if (live.aspect_ratio) {
      setAspectRatio(live.aspect_ratio as AspectRatioType);
    }
  };

  // Handle local file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const preview = URL.createObjectURL(file);
    setFilePreviewUrl(preview);

    const isVid = file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name);
    setMediaType(isVid ? "video" : "image");

    if (!title || title === currentSlotDef?.default_title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
    }
    setSaveStatus("idle");
  };

  // Handle URL change for embeds (YouTube, Instagram, Google Drive, direct MP4)
  const handleUrlChange = (val: string) => {
    setRawEmbedUrl(val);
    setSaveStatus("idle");

    if (!val.trim()) {
      setParsedEmbedUrl("");
      return;
    }

    const trimmed = val.trim();
    const isVid =
      trimmed.includes("youtube") ||
      trimmed.includes("youtu.be") ||
      trimmed.includes("instagram.com/reel") ||
      trimmed.includes(".mp4") ||
      trimmed.includes(".mov");

    if (isVid) setMediaType("video");

    let parsed = "";
    if (trimmed.includes("youtube") || trimmed.includes("youtu.be")) {
      parsed = parseYouTubeEmbedUrl(trimmed, clipStartSec, clipEndSec);
      if (trimmed.includes("shorts")) {
        setAspectRatio("9/16");
      }
    } else if (trimmed.includes("drive.google.com")) {
      parsed = parseGoogleDriveUrl(trimmed, isVid ? "video" : "image");
    } else {
      parsed = trimmed;
    }

    setParsedEmbedUrl(parsed);
  };

  // Execute Save
  const handleSaveToSlot = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setStatusMessage("");

    try {
      let finalMediaUrl = "";
      let source: "upload" | "youtube" | "google_drive" | "system" = "upload";

      if (mode === "file_upload") {
        if (!uploadedFile && !currentLive.url) {
          throw new Error("Please select a photo or video file from your computer.");
        }

        if (uploadedFile) {
          // Store securely in browser IndexedDB
          const objectUrl = await storeLocalFile(selectedSlotId, uploadedFile);
          finalMediaUrl = objectUrl;

          // For smaller images, fallback to base64 for persistent inline data
          if (mediaType === "image" && uploadedFile.size < 3 * 1024 * 1024) {
            try {
              finalMediaUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string) || objectUrl);
                reader.readAsDataURL(uploadedFile);
              });
            } catch {
              finalMediaUrl = objectUrl;
            }
          }
          source = "upload";
        } else {
          finalMediaUrl = currentLive.url;
        }
      } else {
        // Mode: URL embed
        if (!parsedEmbedUrl && !rawEmbedUrl) {
          throw new Error("Please paste a valid video or image URL to embed.");
        }
        finalMediaUrl = parsedEmbedUrl || rawEmbedUrl.trim();

        if (rawEmbedUrl.includes("youtube") || rawEmbedUrl.includes("youtu.be")) {
          source = "youtube";
          finalMediaUrl = parseYouTubeEmbedUrl(rawEmbedUrl, clipStartSec, clipEndSec);
        } else if (rawEmbedUrl.includes("drive.google.com")) {
          source = "google_drive";
          finalMediaUrl = parseGoogleDriveUrl(rawEmbedUrl, mediaType);
        }
      }

      const slotDef = getSlotById(selectedSlotId);
      const section = slotDef?.section || "corporate";
      const vertical =
        section === "weddings" || section === "games"
          ? "weddings_sangeet"
          : "corporate";

      await onMediaSaved({
        id: `media_${selectedSlotId}`,
        slot_id: selectedSlotId,
        media_url: finalMediaUrl,
        media_type: mediaType,
        alt_text: title.trim() || slotDef?.default_title || "Stage Media",
        category: section === "weddings" ? "weddings_sangeet" : section === "corporate" ? "corporate" : "hero",
        vertical: vertical,
        source: source,
        sort_order: Date.now(),
        badge: badge.trim() || undefined,
        duration: videoDuration || undefined,
        clip_start: clipStartSec,
        clip_end: clipEndSec,
        aspect_ratio: aspectRatio,
        fit_mode: fitMode,
      });

      setSaveStatus("success");
      setStatusMessage(`✨ Successfully published to ${slotDef?.label || selectedSlotId}!`);
      setTimeout(() => setSaveStatus("idle"), 4000);
    } catch (err: any) {
      console.error(err);
      setSaveStatus("error");
      setStatusMessage(err.message || "Failed to update media.");
    } finally {
      setIsSaving(false);
    }
  };

  // Preview Media URL for framing box
  const activePreviewUrl =
    mode === "file_upload"
      ? filePreviewUrl || currentLive.url
      : parsedEmbedUrl || currentLive.url;

  // Aspect ratio CSS class
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case "9/16":
        return { aspectRatio: "9/16", maxWidth: "280px" };
      case "4/5":
        return { aspectRatio: "4/5", maxWidth: "340px" };
      case "1/1":
        return { aspectRatio: "1/1", maxWidth: "360px" };
      case "21/9":
        return { aspectRatio: "21/9", maxWidth: "100%" };
      case "16/9":
      default:
        return { aspectRatio: "16/9", maxWidth: "100%" };
    }
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A84C] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Media Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-white font-bold">
            Upload & Embed Media Manager
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Upload photos and videos directly from your laptop or embed from YouTube / Instagram with custom aspect ratio and length.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-black/60 border border-white/15 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode("file_upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              mode === "file_upload"
                ? "bg-[#C9A84C] text-black shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url_embed")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              mode === "url_embed"
                ? "bg-[#C9A84C] text-black shadow-md font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Embed Link
          </button>
        </div>
      </div>

      {/* Target Slot Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold">
          1. Select Target Website Slot
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <select
              value={selectedSlotId}
              onChange={(e) => handleSlotChange(e.target.value)}
              className="w-full bg-black/80 border border-white/20 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
            >
              <optgroup label="🌟 Hero & Header">
                <option value="hero_billboard">Homepage Hero — Master Billboard Showreel</option>
                <option value="about_portrait">About Section — Radhaa Signature Portrait</option>
              </optgroup>
              <optgroup label="🏢 Corporate Summits & Galas (Rails 1-6)">
                <option value="corp_rail_1">Corporate Rail #1 — Tech Leadership Summit</option>
                <option value="corp_rail_2">Corporate Rail #2 — Brand Launch & Keynote</option>
                <option value="corp_rail_3">Corporate Rail #3 — Annual Fortune 500 Awards</option>
                <option value="corp_rail_4">Corporate Rail #4 — Executive Fireside Moderation</option>
                <option value="corp_rail_5">Corporate Rail #5 — Corporate Stagecraft</option>
                <option value="corp_rail_6">Corporate Rail #6 — International Delegations</option>
              </optgroup>
              <optgroup label="💍 Weddings & Sangeet (Rails 1-6)">
                <option value="wed_rail_1">Weddings Rail #1 — Electric Sangeet Night MC</option>
                <option value="wed_rail_2">Weddings Rail #2 — Royal Varmala Direction</option>
                <option value="wed_rail_3">Weddings Rail #3 — Sangeet Dance Battles</option>
                <option value="wed_rail_4">Weddings Rail #4 — Haldi & Mehendi Fiesta</option>
                <option value="wed_rail_5">Weddings Rail #5 — Signature Family Games</option>
                <option value="wed_rail_6">Weddings Rail #6 — Destination Reception Gala</option>
              </optgroup>
              <optgroup label="🎉 Signature Family Games (Rails 1-4)">
                <option value="games_rail_1">Games Rail #1 — Couple Roast & Shoe Game</option>
                <option value="games_rail_2">Games Rail #2 — Grandparents Antakshari</option>
                <option value="games_rail_3">Games Rail #3 — Ladkiwale vs Ladkewale Dance Off</option>
                <option value="games_rail_4">Games Rail #4 — Table Relay & Rapid Trivia</option>
              </optgroup>
            </select>
          </div>
          <div className="flex items-center text-xs text-neutral-400 bg-black/40 border border-white/5 rounded-xl px-4 py-2">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-mono">Current Live Asset:</span>
              <span className="text-white font-medium truncate block max-w-[200px]">{currentLive.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Media Input Area */}
      <div className="space-y-4">
        <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold">
          2. {mode === "file_upload" ? "Choose Media File from Device" : "Enter Media URL to Embed"}
        </label>

        {mode === "file_upload" ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] bg-black/40 rounded-2xl p-8 text-center cursor-pointer transition-all hover:bg-[#C9A84C]/5 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            {uploadedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">{uploadedFile.name}</p>
                <p className="text-xs text-[#C9A84C]">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to replace
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">Click or drag photo / video here</p>
                <p className="text-xs text-neutral-400">
                  Supports JPG, PNG, WEBP for photos · MP4, MOV, WEBM for showreels
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={rawEmbedUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Paste YouTube video/Shorts URL, Instagram Reel, or Google Drive link..."
                className="w-full bg-black/80 border border-white/20 focus:border-[#C9A84C] text-white text-xs rounded-xl pl-11 pr-4 py-3.5 outline-none transition-colors"
              />
              <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-3 text-[11px] text-neutral-400 flex-wrap">
              <span className="text-neutral-500 font-mono">Supported embeds:</span>
              <span className="flex items-center gap-1 text-red-400"><Youtube className="w-3.5 h-3.5" /> YouTube / Shorts</span>
              <span className="flex items-center gap-1 text-pink-400"><Instagram className="w-3.5 h-3.5" /> Instagram Reels</span>
              <span className="flex items-center gap-1 text-blue-400"><HardDrive className="w-3.5 h-3.5" /> Google Drive</span>
            </div>
          </div>
        )}
      </div>

      {/* ASPECT RATIO & VIDEO LENGTH CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-white/10">
        {/* Left: Aspect Ratio Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold mb-1 flex items-center gap-1.5">
              <Crop className="w-3.5 h-3.5" />
              3. Aspect Ratio of Photo / Video
            </label>
            <p className="text-[11px] text-neutral-400">
              Select the optimal framing ratio for how this asset displays on stage rails and hero sections.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ASPECT_RATIO_OPTIONS.map((ratio) => (
              <button
                key={ratio.id}
                type="button"
                onClick={() => setAspectRatio(ratio.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  aspectRatio === ratio.id
                    ? "bg-[#C9A84C]/20 border-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/10"
                    : "bg-black/50 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-sm font-bold text-[#C9A84C] mb-0.5">{ratio.label}</div>
                <div className="text-[10px] text-neutral-400 line-clamp-1">{ratio.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs text-neutral-300 font-mono uppercase">Fit Mode:</span>
            <div className="flex bg-black/60 border border-white/15 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setFitMode("cover")}
                className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                  fitMode === "cover" ? "bg-[#C9A84C] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                Fill & Crop (Cover)
              </button>
              <button
                type="button"
                onClick={() => setFitMode("contain")}
                className={`px-3 py-1 text-xs rounded font-medium transition-all ${
                  fitMode === "contain" ? "bg-[#C9A84C] text-black" : "text-neutral-400 hover:text-white"
                }`}
              >
                Show Entire Frame (Contain)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Video Length & Timing Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              4. Video Length & Clip Timestamps
            </label>
            <p className="text-[11px] text-neutral-400">
              Specify duration badge or set clip start/end timestamps for precision highlight showreels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Display Length (Badge)
              </label>
              <input
                type="text"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="e.g. 0:45 min / 2:30 min"
                className="w-full bg-black/80 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Badge Tag (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. High Energy / Royal"
                className="w-full bg-black/80 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-black/40 border border-white/10 rounded-xl p-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Clip Start (Seconds)
              </label>
              <input
                type="number"
                min={0}
                value={clipStartSec}
                onChange={(e) => setClipStartSec(Number(e.target.value) || 0)}
                className="w-full bg-black/80 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-lg px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Clip End (Seconds)
              </label>
              <input
                type="number"
                min={1}
                value={clipEndSec}
                onChange={(e) => setClipEndSec(Number(e.target.value) || 30)}
                className="w-full bg-black/80 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Asset Title */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold mb-1.5">
          5. Asset Title / Caption on Website
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. National Leadership Tech Summit 2026 Keynote"
          className="w-full bg-black/80 border border-white/20 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none"
        />
      </div>

      {/* LIVE ASPECT RATIO FRAMING PREVIEW */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300">
            <Eye className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Live Framing Preview ({aspectRatio} {fitMode})</span>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">
            {mediaType === "video" ? "🎬 Video Container" : "📷 Photo Container"}
          </span>
        </div>

        <div className="bg-black/90 border border-white/15 rounded-2xl p-4 flex items-center justify-center min-h-[260px] overflow-hidden">
          <div
            style={getAspectRatioStyle()}
            className="w-full relative rounded-xl overflow-hidden bg-neutral-900 border border-[#C9A84C]/30 shadow-2xl flex items-center justify-center mx-auto"
          >
            {activePreviewUrl ? (
              mediaType === "video" && (activePreviewUrl.includes("youtube") || activePreviewUrl.includes("drive.google")) ? (
                <iframe
                  src={activePreviewUrl}
                  title={title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : mediaType === "video" ? (
                <video
                  src={activePreviewUrl}
                  controls
                  className={`w-full h-full ${fitMode === "cover" ? "object-cover" : "object-contain"}`}
                />
              ) : (
                <img
                  src={activePreviewUrl}
                  alt={title}
                  className={`w-full h-full ${fitMode === "cover" ? "object-cover" : "object-contain"}`}
                />
              )
            ) : (
              <div className="text-center p-6 space-y-2">
                <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-500">No media selected yet</p>
              </div>
            )}

            {/* Overlay badge in preview */}
            {badge && (
              <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md border border-[#C9A84C]/40 text-[#C9A84C] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                {badge}
              </div>
            )}
            {videoDuration && mediaType === "video" && (
              <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                {videoDuration}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        {saveStatus === "success" && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <Check className="w-4 h-4" /> {statusMessage}
          </p>
        )}
        {saveStatus === "error" && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {statusMessage}
          </p>
        )}
        <div className="flex-1" />

        <button
          type="button"
          onClick={handleSaveToSlot}
          disabled={isSaving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A84C]/25 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving to Live Website..." : "Publish to Live Website"}
        </button>
      </div>
    </div>
  );
}
