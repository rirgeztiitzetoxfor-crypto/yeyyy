import React, { useState } from "react";
import {
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { parseGoogleDriveUrl, parseYouTubeEmbedUrl, type SiteMedia } from "@/hooks/useSiteMedia";

interface GoogleDriveUploaderProps {
  onMediaAdded: (item: Partial<SiteMedia> & { slot_id: string; media_url: string }) => Promise<void>;
  defaultVertical?: "corporate" | "weddings_sangeet";
}

export default function GoogleDriveUploader({
  onMediaAdded,
  defaultVertical = "corporate",
}: GoogleDriveUploaderProps) {
  const [driveUrl, setDriveUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [vertical, setVertical] = useState<"corporate" | "weddings_sangeet">(defaultVertical);
  const [subgroup, setSubgroup] = useState<string>(defaultVertical === "corporate" ? "summits" : "sangeet");
  const [category, setCategory] = useState<"gallery" | "videos" | "hero" | "corporate" | "weddings_sangeet">("gallery");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [badge, setBadge] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerticalChange = (newVertical: "corporate" | "weddings_sangeet") => {
    setVertical(newVertical);
    setSubgroup(newVertical === "corporate" ? "summits" : "sangeet");
  };

  const handleUrlChange = (val: string) => {
    setDriveUrl(val);
    setStatus("idle");
    setErrorMessage("");

    if (!val.trim()) {
      setPreviewUrl(null);
      return;
    }

    // Auto-detect type
    const isVideo = val.includes("youtube") || val.includes("youtu.be") || mediaType === "video";
    const detectedType = isVideo ? "video" : mediaType;

    let parsed = "";
    if (val.includes("youtube") || val.includes("youtu.be")) {
      parsed = parseYouTubeEmbedUrl(val);
    } else {
      parsed = parseGoogleDriveUrl(val, detectedType);
    }
    setPreviewUrl(parsed);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    setStatus("testing");
    try {
      let finalUrl = "";
      let finalSource: "google_drive" | "youtube" | "upload" = "google_drive";

      if (driveUrl.includes("youtube") || driveUrl.includes("youtu.be")) {
        finalUrl = parseYouTubeEmbedUrl(driveUrl);
        finalSource = "youtube";
      } else {
        finalUrl = parseGoogleDriveUrl(driveUrl, mediaType);
      }

      if (!finalUrl) {
        throw new Error("Could not extract a valid ID from the provided Google Drive link.");
      }

      const slotId = `${vertical}_${mediaType}_${Date.now()}`;

      await onMediaAdded({
        slot_id: slotId,
        media_url: finalUrl,
        media_type: mediaType,
        alt_text: title.trim() || `${vertical === "corporate" ? "Corporate Event" : "Wedding & Sangeet"} Media`,
        category: category,
        vertical: vertical,
        source: finalSource,
        sort_order: Date.now(),
        subgroup: subgroup,
        duration: duration.trim() || (mediaType === "video" ? "1:15" : undefined),
        badge: badge.trim() || undefined,
      });

      setStatus("success");
      setDriveUrl("");
      setTitle("");
      setDuration("");
      setBadge("");
      setPreviewUrl(null);

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to process Google Drive link.");
    }
  };

  return (
    <div className="bg-[#121212] border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base">Google Drive & Media Importer</h3>
            <p className="text-[#888] text-xs">
              Paste any shared Google Drive file link, video link, or YouTube URL
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Auto-Converter
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Portal Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A84C] mb-2">
            Select Portal Showcase
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleVerticalChange("corporate")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all ${
                vertical === "corporate"
                  ? "bg-[#C9A84C] text-black border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20"
                  : "bg-black/40 text-white/70 border-white/10 hover:border-white/30"
              }`}
            >
              🏢 Corporate Portal
            </button>
            <button
              type="button"
              onClick={() => handleVerticalChange("weddings_sangeet")}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-semibold tracking-wider uppercase transition-all ${
                vertical === "weddings_sangeet"
                  ? "bg-[#CC2936] text-white border-[#CC2936] shadow-lg shadow-[#CC2936]/20"
                  : "bg-black/40 text-white/70 border-white/10 hover:border-white/30"
              }`}
            >
              💍 Weddings & Sangeet Portal
            </button>
          </div>
        </div>

        {/* Master Sub-Group Collection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#E2C775] mb-2">
            Master Group / Event Format
          </label>
          <select
            value={subgroup}
            onChange={(e) => setSubgroup(e.target.value)}
            className="w-full bg-black/60 border border-[#C9A84C]/40 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-medium"
          >
            {vertical === "weddings_sangeet" ? (
              <>
                <option value="sangeet">💃 Sangeet & Dance Battles</option>
                <option value="haldi">💛 Haldi & Mehendi Fiesta</option>
                <option value="group_games">🎯 Signature Family Games & Group Activities</option>
                <option value="varmala">💍 Royal Varmala & Entrances</option>
                <option value="wedding_general">🎬 General Wedding Highlight</option>
              </>
            ) : (
              <>
                <option value="summits">💼 Tech Summits & Keynote Panels</option>
                <option value="awards">🏆 Annual Galas & Award Nights</option>
                <option value="offsites">⚡ Executive Offsites & Icebreakers</option>
                <option value="brand_launch">🚀 Brand Launches & Product Reveals</option>
                <option value="corporate_general">🎬 General Corporate Highlight</option>
              </>
            )}
          </select>
        </div>

        {/* Media Type & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
              Media Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMediaType("image");
                  handleUrlChange(driveUrl);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  mediaType === "image"
                    ? "bg-white/10 text-white border-[#C9A84C]"
                    : "bg-black/30 text-white/50 border-white/10"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Photo / Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setMediaType("video");
                  handleUrlChange(driveUrl);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                  mediaType === "video"
                    ? "bg-white/10 text-white border-[#C9A84C]"
                    : "bg-black/30 text-white/50 border-white/10"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video / Reel
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
              Display Placement
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-black/60 border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:border-[#C9A84C] outline-none"
            >
              <option value="gallery">Photo & Video Gallery (Main Rails & Vault)</option>
              <option value="videos">Featured Video Showreel Section</option>
              <option value="hero">Hero Background Spotlight</option>
            </select>
          </div>
        </div>

        {/* Video Duration & Badge Inputs (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
              Clip Duration (e.g. 1:15)
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 1:30"
              className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
              Custom Tag / Badge (Optional)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Trending, Crowd Favorite, Viral"
              className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none"
            />
          </div>
        </div>

        {/* Google Drive Link Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
            Google Drive Share URL or File ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={driveUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="e.g. https://drive.google.com/file/d/1XyZ.../view?usp=sharing"
              className="w-full bg-black/60 border border-white/10 text-white rounded-xl pl-9 pr-4 py-3 text-xs focus:border-[#C9A84C] outline-none font-mono"
              required
            />
          </div>
          <p className="mt-1.5 text-[11px] text-[#777]">
            Make sure the file in Google Drive has permissions set to:{" "}
            <span className="text-[#C9A84C]">"Anyone with the link can view"</span>.
          </p>
        </div>

        {/* Title / Caption */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
            Title / Event Caption (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Tech Summit 2026 / Sangeet Night Gala"
            className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none"
          />
        </div>

        {/* Live Preview Box */}
        {previewUrl && (
          <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A0A0A0] block mb-2">
              Live Embed Preview:
            </span>
            <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/5 relative">
              {mediaType === "video" || previewUrl.includes("youtube") || previewUrl.includes("/preview") ? (
                <iframe
                  src={previewUrl}
                  title="Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Drive Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setErrorMessage("Unable to load Google Drive thumbnail. Ensure file is shared publicly.");
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Status & Submit */}
        {status === "error" && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Successfully added to {vertical === "corporate" ? "Corporate Portal" : "Weddings & Sangeet Portal"}!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "testing"}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A84C]/20 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {status === "testing" ? "Processing & Saving..." : "Add to Live Website"}
        </button>

        {/* Cloud Storage Architecture Callout */}
        <div className="mt-4 p-4 rounded-xl bg-black/60 border border-[#C9A84C]/20 text-[11px] text-neutral-300 leading-relaxed">
          <div className="flex items-center gap-2 text-[#C9A84C] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Where Is Google Drive Media Stored?
          </div>
          <p>
            When you upload or paste links from Google Drive, your original high-resolution footage and photos <strong className="text-white">remain securely stored in your personal Google Drive account</strong>.
            The website's cloud proxy streams directly from Google's high-speed global CDN (<code>lh3.googleusercontent.com</code>), providing fast playback with zero hosting storage costs and no bandwidth limits!
          </p>
        </div>
      </form>
    </div>
  );
}
