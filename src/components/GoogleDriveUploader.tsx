import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Check,
  AlertCircle,
  FolderOpen,
  Sparkles,
  HardDrive,
  Cloud,
  Layers,
  ArrowRight,
  ExternalLink,
  Eye,
  Trash2,
  FileCheck,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import {
  parseGoogleDriveUrl,
  parseYouTubeEmbedUrl,
  type SiteMedia,
} from "@/hooks/useSiteMedia";
import {
  MASTER_SITE_SLOTS,
  getSlotById,
  resolveSlotMedia,
  type SiteSlotDefinition,
} from "@/lib/siteSlots";
import { storeLocalFile } from "@/lib/indexedDbMedia";
import GoogleDriveWorkspace from "@/components/GoogleDriveWorkspace";
import MediaCropAndTrimStudio, { type MediaCropTrimConfig } from "@/components/MediaCropAndTrimStudio";

interface GoogleDriveUploaderProps {
  onMediaAdded: (
    item: Partial<SiteMedia> & { slot_id: string; media_url: string }
  ) => Promise<void>;
  defaultVertical?: "corporate" | "weddings_sangeet";
  initialSlotId?: string;
  existingMediaList?: SiteMedia[];
}

export default function GoogleDriveUploader({
  onMediaAdded,
  defaultVertical = "corporate",
  initialSlotId = "corp_rail_1",
  existingMediaList = [],
}: GoogleDriveUploaderProps) {
  // Mode: Laptop upload vs Google Drive / Cloud links
  const [sourceMode, setSourceMode] = useState<"laptop" | "gdrive">("laptop");

  // Selected Target Slot
  const [selectedSlotId, setSelectedSlotId] = useState<string>(initialSlotId);

  // Sync initialSlotId if prop changes
  useEffect(() => {
    if (initialSlotId) {
      setSelectedSlotId(initialSlotId);
    }
  }, [initialSlotId]);

  // Current slot details & live asset
  const targetSlot = getSlotById(selectedSlotId);
  const currentLive = resolveSlotMedia(selectedSlotId, existingMediaList);

  // Common metadata
  const [title, setTitle] = useState(targetSlot?.default_title || "");
  const [mediaType, setMediaType] = useState<"image" | "video">(
    targetSlot?.default_type || "image"
  );
  const [badge, setBadge] = useState(targetSlot?.badge || "");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Media Framing & Video Trim Config
  const [cropTrimConfig, setCropTrimConfig] = useState<MediaCropTrimConfig>({
    clipStart: currentLive.clip_start || 0,
    clipEnd: currentLive.clip_end || (currentLive.type === "video" ? 30 : 0),
    aspectRatio: currentLive.aspect_ratio || "16/9",
    focalPoint: currentLive.focal_point || "top",
    fitMode: currentLive.fit_mode || "cover",
  });

  // Update form fields when slot changes
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    const slot = getSlotById(slotId);
    if (slot) {
      const active = resolveSlotMedia(slotId, existingMediaList);
      setTitle(active.title);
      setMediaType(active.type);
      setBadge(active.badge || "");
      setCropTrimConfig({
        clipStart: active.clip_start || 0,
        clipEnd: active.clip_end || (active.type === "video" ? 30 : 0),
        aspectRatio: active.aspect_ratio || "16/9",
        focalPoint: active.focal_point || "top",
        fitMode: active.fit_mode || "cover",
      });
    }
  };

  // ----------------------------------------------------
  // OPTION 1: LAPTOP UPLOAD STATE
  // ----------------------------------------------------
  const [laptopFiles, setLaptopFiles] = useState<
    Array<{
      file: File;
      preview: string;
      type: "image" | "video";
      name: string;
      sizeMB: string;
      assignedSlotId: string;
    }>
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((file, idx) => {
      const isVid = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|mkv)$/i);
      const preview = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

      // Auto-assign slot: first file takes selected slot, subsequent files take next available slots
      let assignedSlot = selectedSlotId;
      if (idx > 0) {
        const slotIdx = MASTER_SITE_SLOTS.findIndex((s) => s.slot_id === selectedSlotId);
        if (slotIdx >= 0 && slotIdx + idx < MASTER_SITE_SLOTS.length) {
          assignedSlot = MASTER_SITE_SLOTS[slotIdx + idx].slot_id;
        } else {
          assignedSlot = `custom_vault_${Date.now()}_${idx}`;
        }
      }

      return {
        file,
        preview,
        type: (isVid ? "video" : "image") as "image" | "video",
        name: file.name,
        sizeMB: `${sizeMB} MB`,
        assignedSlotId: assignedSlot,
      };
    });

    setLaptopFiles(newFiles);
    if (newFiles.length === 1) {
      setMediaType(newFiles[0].type);
      if (!title || title === targetSlot?.default_title) {
        setTitle(newFiles[0].name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    }
    setStatus("idle");
  };

  const handleLaptopUpload = async () => {
    if (laptopFiles.length === 0) return;
    setStatus("uploading");
    setStatusMessage("Storing media files securely in browser vault...");

    try {
      for (const item of laptopFiles) {
        const slotKey = item.assignedSlotId;

        // Store file in IndexedDB for reliable offline playback & no size limits
        const objectUrl = await storeLocalFile(slotKey, item.file);

        let finalUrl = objectUrl;
        if (item.type === "image" && item.file.size < 2.5 * 1024 * 1024) {
          try {
            finalUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve((reader.result as string) || objectUrl);
              reader.onerror = () => resolve(objectUrl);
              reader.readAsDataURL(item.file);
            });
          } catch {
            finalUrl = objectUrl;
          }
        }

        const slotDef = getSlotById(slotKey);
        const section = slotDef?.section || "corporate";
        const vertical =
          section === "weddings" || section === "games"
            ? "weddings_sangeet"
            : "corporate";

        await onMediaAdded({
          id: `media_${slotKey}`,
          slot_id: slotKey,
          media_url: finalUrl,
          media_type: item.type,
          alt_text:
            laptopFiles.length === 1 && title.trim()
              ? title.trim()
              : item.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ") || slotDef?.default_title || "Stage Media",
          category: section === "weddings" ? "weddings_sangeet" : section === "corporate" ? "corporate" : "gallery",
          vertical: vertical,
          source: "upload",
          sort_order: Date.now(),
          badge: badge.trim() || slotDef?.badge,
          clip_start: cropTrimConfig.clipStart,
          clip_end: cropTrimConfig.clipEnd,
          aspect_ratio: cropTrimConfig.aspectRatio,
          focal_point: cropTrimConfig.focalPoint,
          fit_mode: cropTrimConfig.fitMode,
        });
      }

      setStatus("success");
      setStatusMessage(`Successfully updated ${laptopFiles.length} photo/video on live site!`);
      setTimeout(() => {
        setLaptopFiles([]);
        setStatus("idle");
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setStatusMessage(err.message || "Failed to process laptop upload.");
    }
  };

  // ----------------------------------------------------
  // OPTION 2: GOOGLE DRIVE & CLOUD LINK STATE
  // ----------------------------------------------------
  const [driveSubMode, setDriveSubMode] = useState<"workspace" | "single" | "bulk">("workspace");
  const [driveUrl, setDriveUrl] = useState("");
  const [bulkDriveText, setBulkDriveText] = useState("");
  const [drivePreviewUrl, setDrivePreviewUrl] = useState<string | null>(null);

  const handleSingleDriveUrlChange = (val: string) => {
    setDriveUrl(val);
    setStatus("idle");
    setStatusMessage("");

    if (!val.trim()) {
      setDrivePreviewUrl(null);
      return;
    }

    const isVideo = val.includes("youtube") || val.includes("youtu.be") || mediaType === "video";
    const detectedType = isVideo ? "video" : mediaType;

    let parsed = "";
    if (val.includes("youtube") || val.includes("youtu.be")) {
      parsed = parseYouTubeEmbedUrl(val);
    } else {
      parsed = parseGoogleDriveUrl(val, detectedType);
    }
    setDrivePreviewUrl(parsed);
  };

  const handleDriveSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("uploading");

    try {
      if (driveSubMode === "bulk") {
        // Bulk link mode: Split by newlines or commas
        const lines = bulkDriveText
          .split(/[\n,]/)
          .map((l) => l.trim())
          .filter((l) => l.length > 5);

        if (lines.length === 0) {
          throw new Error("Please enter at least one valid Google Drive or YouTube URL.");
        }

        setStatusMessage(`Processing and validating ${lines.length} cloud links...`);

        for (let i = 0; i < lines.length; i++) {
          const rawUrl = lines[i];
          const isVid = rawUrl.includes("youtube") || rawUrl.includes("youtu.be") || rawUrl.includes("video");
          const type: "image" | "video" = isVid ? "video" : "image";

          let finalUrl = "";
          let finalSource: "google_drive" | "youtube" = "google_drive";

          if (rawUrl.includes("youtube") || rawUrl.includes("youtu.be")) {
            finalUrl = parseYouTubeEmbedUrl(rawUrl, cropTrimConfig.clipStart, cropTrimConfig.clipEnd);
            finalSource = "youtube";
          } else {
            finalUrl = parseGoogleDriveUrl(rawUrl, type);
          }

          // Target slot
          let slotId = selectedSlotId;
          if (i > 0) {
            const slotIdx = MASTER_SITE_SLOTS.findIndex((s) => s.slot_id === selectedSlotId);
            if (slotIdx >= 0 && slotIdx + i < MASTER_SITE_SLOTS.length) {
              slotId = MASTER_SITE_SLOTS[slotIdx + i].slot_id;
            } else {
              slotId = `cloud_vault_${Date.now()}_${i}`;
            }
          }

          const slotDef = getSlotById(slotId);
          const section = slotDef?.section || "corporate";

          await onMediaAdded({
            slot_id: slotId,
            media_url: finalUrl,
            media_type: type,
            alt_text: `${slotDef?.default_title || "Stage Media"} (Cloud Link ${i + 1})`,
            category: section === "weddings" ? "weddings_sangeet" : section === "corporate" ? "corporate" : "gallery",
            vertical: section === "weddings" ? "weddings_sangeet" : "corporate",
            source: finalSource,
            sort_order: Date.now() + i,
            clip_start: cropTrimConfig.clipStart,
            clip_end: cropTrimConfig.clipEnd,
            aspect_ratio: cropTrimConfig.aspectRatio,
            focal_point: cropTrimConfig.focalPoint,
            fit_mode: cropTrimConfig.fitMode,
          });
        }

        setStatus("success");
        setStatusMessage(`Successfully imported ${lines.length} cloud links to live website!`);
        setTimeout(() => {
          setBulkDriveText("");
          setStatus("idle");
        }, 2500);
      } else {
        // Single link mode
        if (!driveUrl.trim()) throw new Error("Please enter a Google Drive or YouTube link.");

        let finalUrl = "";
        let finalSource: "google_drive" | "youtube" = "google_drive";

        if (driveUrl.includes("youtube") || driveUrl.includes("youtu.be")) {
          finalUrl = parseYouTubeEmbedUrl(driveUrl, cropTrimConfig.clipStart, cropTrimConfig.clipEnd);
          finalSource = "youtube";
        } else {
          finalUrl = parseGoogleDriveUrl(driveUrl, mediaType);
        }

        const slotDef = getSlotById(selectedSlotId);
        const section = slotDef?.section || "corporate";

        await onMediaAdded({
          slot_id: selectedSlotId,
          media_url: finalUrl,
          media_type: mediaType,
          alt_text: title.trim() || slotDef?.default_title || "Stage Media",
          category: section === "weddings" ? "weddings_sangeet" : section === "corporate" ? "corporate" : "gallery",
          vertical: section === "weddings" ? "weddings_sangeet" : "corporate",
          source: finalSource,
          sort_order: Date.now(),
          badge: badge.trim() || slotDef?.badge,
          clip_start: cropTrimConfig.clipStart,
          clip_end: cropTrimConfig.clipEnd,
          aspect_ratio: cropTrimConfig.aspectRatio,
          focal_point: cropTrimConfig.focalPoint,
          fit_mode: cropTrimConfig.fitMode,
        });

        setStatus("success");
        setStatusMessage(`Successfully updated ${slotDef?.label || selectedSlotId}!`);
        setTimeout(() => {
          setDriveUrl("");
          setDrivePreviewUrl(null);
          setStatus("idle");
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setStatusMessage(err.message || "Failed to process Google Drive link.");
    }
  };

  return (
    <div className="bg-[#121212] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#C9A84C]/20 text-[#C9A84C]">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Media Manager & Slot Uploader</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Choose where to apply changes, preview current vs new media, and upload from your laptop or Google Drive.
          </p>
        </div>

        {/* Source Mode Switcher */}
        <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setSourceMode("laptop")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              sourceMode === "laptop"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>💻 From Laptop</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceMode("gdrive")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              sourceMode === "gdrive"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>☁️ Google Drive / Link</span>
          </button>
        </div>
      </div>

      {/* STEP 1: TARGET SLOT SELECTOR ("I SHOULD KNOW WHICH PHOTO/VIDEO I AM CHANGING") */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-[#C9A84C]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C9A84C] text-black text-xs font-bold flex items-center justify-center font-mono">
              1
            </span>
            <label className="text-xs uppercase font-mono tracking-wider text-[#C9A84C] font-semibold">
              Select Which Photo / Video Slot You Are Changing
            </label>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            Active Slot ID: <code className="text-[#E2C775]">{selectedSlotId}</code>
          </span>
        </div>

        {/* Dropdown with categorized slots */}
        <select
          value={selectedSlotId}
          onChange={(e) => handleSlotSelect(e.target.value)}
          className="w-full bg-[#181818] border border-white/20 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[#C9A84C] outline-none cursor-pointer"
        >
          <optgroup label="🎬 Homepage Hero & Master Video">
            {MASTER_SITE_SLOTS.filter((s) => s.section === "hero").map((s) => (
              <option key={s.slot_id} value={s.slot_id}>
                {s.label}
              </option>
            ))}
          </optgroup>

          <optgroup label="🏢 Corporate Conclaves & Tech Summits Rails">
            {MASTER_SITE_SLOTS.filter((s) => s.section === "corporate").map((s) => (
              <option key={s.slot_id} value={s.slot_id}>
                {s.label}
              </option>
            ))}
          </optgroup>

          <optgroup label="💍 Luxury Destination Weddings & Sangeet Rails">
            {MASTER_SITE_SLOTS.filter((s) => s.section === "weddings").map((s) => (
              <option key={s.slot_id} value={s.slot_id}>
                {s.label}
              </option>
            ))}
          </optgroup>

          <optgroup label="🎲 Signature Family Interactive Games Rails">
            {MASTER_SITE_SLOTS.filter((s) => s.section === "games").map((s) => (
              <option key={s.slot_id} value={s.slot_id}>
                {s.label}
              </option>
            ))}
          </optgroup>

          <optgroup label="👤 Artist Bio & Video Vault">
            {MASTER_SITE_SLOTS.filter((s) => s.section === "about" || s.section === "vault").map((s) => (
              <option key={s.slot_id} value={s.slot_id}>
                {s.label}
              </option>
            ))}
          </optgroup>
        </select>

        {/* SIDE-BY-SIDE VISUAL COMPARISON: CURRENT LIVE ASSET vs NEW ASSET */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Box A: Currently Live Asset */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Currently Live on Website
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {currentLive.type.toUpperCase()}
              </span>
            </div>

            <div className="aspect-video w-full rounded-lg bg-black/60 overflow-hidden mb-2 border border-white/10 flex items-center justify-center">
              {currentLive.type === "video" ? (
                <iframe
                  src={currentLive.url}
                  title="Current Live Video"
                  className="w-full h-full pointer-events-none"
                />
              ) : (
                <img
                  src={currentLive.url}
                  alt={currentLive.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p className="text-xs font-semibold text-white truncate">{currentLive.title}</p>
            <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
              URL: {currentLive.url}
            </p>
          </div>

          {/* Box B: New Replacement Media */}
          <div className="p-4 rounded-xl bg-black/40 border border-[#C9A84C]/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#E2C775] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-[#C9A84C]" /> Will Replace With This
              </span>
              <span className="text-[10px] font-mono text-[#C9A84C]">
                {mediaType.toUpperCase()}
              </span>
            </div>

            <div className="aspect-video w-full rounded-lg bg-black/60 overflow-hidden mb-2 border border-dashed border-[#C9A84C]/40 flex items-center justify-center">
              {sourceMode === "laptop" && laptopFiles.length > 0 ? (
                laptopFiles[0].type === "video" ? (
                  <video
                    src={laptopFiles[0].preview}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={laptopFiles[0].preview}
                    alt="New Upload Preview"
                    className="w-full h-full object-cover"
                  />
                )
              ) : sourceMode === "gdrive" && drivePreviewUrl ? (
                mediaType === "video" ? (
                  <iframe
                    src={drivePreviewUrl}
                    title="Google Drive Preview"
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={drivePreviewUrl}
                    alt="Google Drive Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                )
              ) : (
                <div className="text-center p-4 text-neutral-500">
                  <ArrowRight className="w-6 h-6 mx-auto mb-1 text-neutral-600" />
                  <p className="text-xs">
                    {sourceMode === "laptop"
                      ? "Select a file from your laptop below"
                      : "Paste Google Drive URL below"}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs font-semibold text-[#E2C775] truncate">
              {title || "Pending Selection..."}
            </p>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
              Target: {targetSlot?.label}
            </p>
          </div>
        </div>

        {/* STEP 1.5: TRIM & FRAMING STUDIO (Loading parts of media & photo ratios) */}
        <div className="pt-2">
          <MediaCropAndTrimStudio
            mediaUrl={
              sourceMode === "laptop" && laptopFiles.length > 0
                ? laptopFiles[0].preview
                : sourceMode === "gdrive" && drivePreviewUrl
                ? drivePreviewUrl
                : currentLive.url
            }
            mediaType={
              sourceMode === "laptop" && laptopFiles.length > 0
                ? laptopFiles[0].type
                : mediaType
            }
            slotLabel={targetSlot?.label || selectedSlotId}
            initialConfig={cropTrimConfig}
            onChange={(cfg) => setCropTrimConfig(cfg)}
          />
        </div>
      </div>

      {/* STEP 2A: UPLOAD FROM LAPTOP / DEVICE */}
      {sourceMode === "laptop" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C9A84C] text-black text-xs font-bold flex items-center justify-center font-mono">
              2
            </span>
            <label className="text-xs uppercase font-mono tracking-wider text-[#C9A84C] font-semibold">
              Select Media Files from Laptop (Single or Bulk)
            </label>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#C9A84C]/40 hover:border-[#C9A84C] bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl p-8 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 mx-auto flex items-center justify-center text-[#E2C775] group-hover:scale-110 transition-transform mb-3">
              <HardDrive className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-white">
              Click to Browse or Drag & Drop Files from Laptop
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              Supports MP4, MOV, WEBM videos, and JPG, PNG, WEBP photos. Stores directly in browser vault with no size restrictions!
            </p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono">
              💡 Tip: Select multiple files at once for Bulk Upload
            </span>
          </div>

          {/* Staged Laptop Files List */}
          {laptopFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase font-mono text-white">
                  Staged Files to Apply ({laptopFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => setLaptopFiles([])}
                  className="text-xs text-neutral-400 hover:text-red-400"
                >
                  Clear Selection
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {laptopFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
                  >
                    <div className="w-16 h-12 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-white/10">
                      {item.type === "video" ? (
                        <video src={item.preview} className="w-full h-full object-cover" />
                      ) : (
                        <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white truncate">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5">
                        <span className="text-[#C9A84C] uppercase">{item.type}</span>
                        <span>•</span>
                        <span>{item.sizeMB}</span>
                        <span>•</span>
                        <span className="truncate">Slot: {item.assignedSlotId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Title & Badge for primary item */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">
                    Display Caption / Event Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. National Leadership Tech Summit 2026"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Trending, Black Tie, Crowd Favorite"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaptopUpload}
                disabled={status === "uploading"}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                {status === "uploading" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Website...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply & Replace on Live Website ({laptopFiles.length} item{laptopFiles.length > 1 ? "s" : ""})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2B: GOOGLE DRIVE & CLOUD LINK */}
      {sourceMode === "gdrive" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C9A84C] text-black text-xs font-bold flex items-center justify-center font-mono">
                2
              </span>
              <label className="text-xs uppercase font-mono tracking-wider text-[#C9A84C] font-semibold">
                Google Drive Cloud Integration
              </label>
            </div>

            {/* Sub Mode Switcher: Workspace Folders vs Single vs Bulk */}
            <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setDriveSubMode("workspace")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  driveSubMode === "workspace"
                    ? "bg-[#C9A84C] text-black shadow-md font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Drive Folders & Vault</span>
              </button>
              <button
                type="button"
                onClick={() => setDriveSubMode("single")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  driveSubMode === "single"
                    ? "bg-[#C9A84C] text-black shadow-md font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Single Link
              </button>
              <button
                type="button"
                onClick={() => setDriveSubMode("bulk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  driveSubMode === "bulk"
                    ? "bg-[#C9A84C] text-black shadow-md font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Bulk Links
              </button>
            </div>
          </div>

          {/* GOOGLE DRIVE 403 FIX CALLOUT BOX */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-300">
                Fix for "Google 403 That's an error" (Permission Denied):
              </p>
              <p className="text-neutral-300 leading-relaxed">
                If Google Drive shows a 403 error, your file is set to private. To fix in 5 seconds:
                Open Google Drive ➔ Right-click the file ➔ <strong>Share</strong> ➔ Change <em>"Restricted"</em> to <strong>"Anyone with the link can view"</strong>.
              </p>
              <p className="text-neutral-400 pt-1">
                ⭐ Or avoid permissions entirely by clicking <strong>"💻 From Laptop"</strong> above to upload directly from your hard drive!
              </p>
            </div>
          </div>

          {/* SUB-VIEW 1: Interactive Drive Folders Workspace */}
          {driveSubMode === "workspace" && (
            <GoogleDriveWorkspace
              defaultSlotId={selectedSlotId}
              onAssignToSlot={async (slotId, mediaUrl, itemTitle, itemType, trimFraming) => {
                const slotDef = getSlotById(slotId);
                const section = slotDef?.section || "corporate";
                const vertical =
                  section === "weddings" || section === "games"
                    ? "weddings_sangeet"
                    : "corporate";

                await onMediaAdded({
                  id: `media_${slotId}`,
                  slot_id: slotId,
                  media_url: mediaUrl,
                  media_type: itemType,
                  alt_text: itemTitle || slotDef?.default_title || "Stage Media",
                  category: section === "weddings" ? "weddings_sangeet" : section === "corporate" ? "corporate" : "gallery",
                  vertical: vertical,
                  source: "gdrive",
                  sort_order: Date.now(),
                  badge: slotDef?.badge || "Drive Sync",
                  clip_start: trimFraming?.clipStart,
                  clip_end: trimFraming?.clipEnd,
                  aspect_ratio: trimFraming?.aspectRatio,
                  focal_point: trimFraming?.focalPoint,
                  fit_mode: trimFraming?.fitMode,
                });

                setStatus("success");
                setStatusMessage(`Successfully synced "${itemTitle}" to slot ${slotDef?.label || slotId}!`);
                setTimeout(() => setStatus("idle"), 2500);
              }}
            />
          )}

          {/* SUB-VIEW 2 & 3: Single Link or Bulk Links form */}
          {driveSubMode !== "workspace" && (
            <form onSubmit={handleDriveSave} className="space-y-6">
              {/* SINGLE LINK INPUT */}
              {driveSubMode === "single" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                      Google Drive Share Link, File ID, or YouTube Embed URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={driveUrl}
                        onChange={(e) => handleSingleDriveUrlChange(e.target.value)}
                        placeholder="https://drive.google.com/file/d/1XyZ.../view?usp=sharing"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:border-[#C9A84C] outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">
                        Display Caption / Event Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Brand Reveal Keynote Gala"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1">
                        Badge Tag (Optional)
                      </label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="e.g. Trending, Black Tie"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* BULK DRIVE LINKS INPUT */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                      Paste Multiple Google Drive / YouTube URLs (One per line)
                    </label>
                    <textarea
                      rows={5}
                      value={bulkDriveText}
                      onChange={(e) => setBulkDriveText(e.target.value)}
                      placeholder="https://drive.google.com/file/d/1ABC...&#10;https://drive.google.com/file/d/2XYZ...&#10;https://www.youtube.com/watch?v=..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:border-[#C9A84C] outline-none font-mono leading-relaxed"
                      required
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block font-mono">
                      Each link will automatically be converted to a direct embed and assigned to sequential slots or the video vault.
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "uploading"}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                {status === "uploading" ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing Cloud Media...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Google Drive Media to Website</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Status Notifications */}
      {status === "success" && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400 animate-in fade-in">
          <FileCheck className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400 animate-in fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
