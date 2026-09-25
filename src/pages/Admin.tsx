import React, { useState, useEffect } from "react";
import {
  useSiteMedia,
  type SiteMedia,
  parseGoogleDriveUrl,
  parseYouTubeEmbedUrl,
} from "@/hooks/useSiteMedia";
import GoogleDriveUploader from "@/components/GoogleDriveUploader";
import GoogleDriveWorkspace from "@/components/GoogleDriveWorkspace";
import RadhaaLogo from "@/components/RadhaaLogo";
import AdminSEOContentManager from "@/components/admin/AdminSEOContentManager";
import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminLeadsCRM from "@/components/admin/AdminLeadsCRM";
import AdminConnectorsHub from "@/components/admin/AdminConnectorsHub";
import LiveVisualContentEditor from "@/components/LiveVisualContentEditor";
import AudioAtmosphereBar from "@/components/AudioAtmosphereBar";
import SimpleMediaStudio from "@/components/admin/SimpleMediaStudio";
import AdminSocialManager from "@/components/admin/AdminSocialManager";
import { MASTER_SITE_SLOTS, resolveSlotMedia, getSlotById } from "@/lib/siteSlots";
import {
  Lock,
  LogOut,
  FolderOpen,
  Briefcase,
  Heart,
  Share2,
  Trash2,
  ExternalLink,
  Save,
  Check,
  Plus,
  RefreshCw,
  Eye,
  Star,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  BookOpen,
  Calendar,
  CalendarCheck,
  Users,
  Zap,
  Edit3,
  Headphones,
  HardDrive,
  Sparkles,
} from "lucide-react";
import GoogleCalendarBooking from "@/components/GoogleCalendarBooking";

const LOCAL_ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || "ATMOSPHERE_2026";

export default function Admin() {
  const {
    media,
    settings,
    loading,
    addOrUpdateMedia,
    removeMedia,
    updateSettings,
    refreshMedia,
  } = useSiteMedia();

  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "simple_studio" | "leads" | "social" | "corporate" | "weddings" | "blog" | "seo_content" | "drive_workspace" | "all"
  >("simple_studio");

  // Track which slot the user wants to replace from cards
  const [selectedSlotForReplace, setSelectedSlotForReplace] = useState<string>("hero_billboard");

  const handleInitiateReplace = (slotId: string) => {
    setSelectedSlotForReplace(slotId);
    setActiveTab("simple_studio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Local settings edit state
  const [socialForm, setSocialForm] = useState(settings);
  const [socialSaved, setSocialSaved] = useState(false);

  // Sync settings into local form state
  useEffect(() => {
    setSocialForm(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      password === LOCAL_ADMIN_PASSWORD ||
      password === "ATMOSPHERE_2026" ||
      password === "radhaa2026" ||
      password === "radha2026" ||
      password === "radhaadudeja2026" ||
      password === "admin"
    ) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(socialForm);
    setSocialSaved(true);
    setTimeout(() => setSocialSaved(false), 2500);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121212] border border-[#C9A84C]/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="mb-3">
              <RadhaaLogo variant="hero" />
            </div>
            <p className="text-[#C9A84C] text-xs font-mono uppercase tracking-widest mt-1">
              Admin & Media Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-medium">
                Admin Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-[#C9A84C] outline-none"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-lg"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-[#777] hover:text-[#C9A84C] transition-colors"
            >
              ← Back to Main Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  const corporateItems = media.filter(
    (m) => m.vertical === "corporate" || m.category === "corporate"
  );
  const weddingItems = media.filter(
    (m) =>
      m.vertical === "weddings_sangeet" || m.category === "weddings_sangeet"
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RadhaaLogo variant="navbar" showSubtitle={false} />
            <span className="text-xs font-mono text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2 py-0.5 rounded-full">
              ADMIN CONTROL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3 text-[#C9A84C]" />
            </a>

            <button
              onClick={() => setAuthed(false)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab("simple_studio")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "simple_studio"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Sparkles className="w-4 h-4 text-black" />
            Upload & Embed Studio
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "leads"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            Leads & Inquiries CRM
          </button>

          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "social"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Share2 className="w-4 h-4 text-pink-400" />
            Social Profiles & IDs
          </button>

          <button
            onClick={() => setActiveTab("corporate")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "corporate"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Corporate Slots ({corporateItems.length})
          </button>

          <button
            onClick={() => setActiveTab("weddings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "weddings"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Heart className="w-4 h-4" />
            Weddings & Sangeet ({weddingItems.length})
          </button>

          <button
            onClick={() => setActiveTab("blog")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "blog"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blog & Playbooks
          </button>

          <button
            onClick={() => setActiveTab("seo_content")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "seo_content"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO & Content
          </button>

          <button
            onClick={() => setActiveTab("drive_workspace")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "drive_workspace"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20 font-bold"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <HardDrive className="w-4 h-4 text-emerald-400" />
            Drive Workspace
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            All Media ({media.length})
          </button>
        </div>

        {/* Tab 1: Simple Upload & Embed Studio */}
        {activeTab === "simple_studio" && (
          <div className="space-y-8">
            <SimpleMediaStudio
              initialSlotId={selectedSlotForReplace}
              existingMediaList={media}
              onMediaSaved={async (item) => {
                await addOrUpdateMedia(item);
              }}
            />

            {/* Quick overview of latest additions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                    Active Customized Slots & Live Media ({media.length})
                  </h3>
                  <p className="text-xs text-[#777]">
                    Media items overriding default site showreels, photos, and rails
                  </p>
                </div>
                <button
                  onClick={() => refreshMedia()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 hover:bg-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Cache
                </button>
              </div>

              {media.length === 0 ? (
                <div className="p-8 text-center bg-[#121212] rounded-2xl border border-white/5 text-[#888] text-xs">
                  No custom media uploaded yet. All website sections are currently running in high-definition Curated Default mode. Select any slot above to customize it!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {media.map((item) => {
                    const slotDef = MASTER_SITE_SLOTS.find((s) => s.slot_id === item.slot_id);
                    return (
                      <div
                        key={item.id || item.slot_id}
                        className="group relative bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden border-b border-white/10">
                            {item.media_type === "video" ? (
                              <iframe
                                src={item.media_url}
                                title={item.alt_text}
                                className="w-full h-full pointer-events-none"
                              />
                            ) : (
                              <img
                                src={item.media_url}
                                alt={item.alt_text}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-[#C9A84C] border border-white/10 uppercase">
                                {item.aspect_ratio || "16/9"}
                              </span>
                              {item.source === "upload" ? (
                                <span className="bg-emerald-500/80 text-black px-1.5 py-0.5 rounded text-[9px] font-bold">
                                  💻 File
                                </span>
                              ) : (
                                <span className="bg-blue-500/80 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                                  ☁️ Embed
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[10px] font-mono text-[#E2C775] bg-[#E2C775]/10 px-1.5 py-0.5 rounded border border-[#E2C775]/20 truncate">
                                {item.slot_id}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-white truncate">
                              {item.alt_text}
                            </h4>
                          </div>
                        </div>

                        <div className="p-3 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                          <button
                            onClick={() => handleInitiateReplace(item.slot_id)}
                            className="text-[11px] text-[#C9A84C] hover:underline flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" /> Edit in Studio
                          </button>
                          <button
                            onClick={() => removeMedia(item.id || item.slot_id)}
                            className="text-[11px] text-neutral-500 hover:text-red-400"
                            title="Reset to default"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Social Profile IDs */}
        {activeTab === "social" && (
          <AdminSocialManager
            settings={settings}
            onSaveSettings={updateSettings}
          />
        )}

        {/* Tab: Google Drive Workspace */}
        {activeTab === "drive_workspace" && (
          <div className="space-y-6">
            <GoogleDriveWorkspace
              defaultSlotId={selectedSlotForReplace}
              onAssignToSlot={async (slotId, mediaUrl, itemTitle, itemType, trimFramingConfig) => {
                const slotDef = getSlotById(slotId);
                const section = slotDef?.section || "corporate";
                const vertical =
                  section === "weddings" || section === "games"
                    ? "weddings_sangeet"
                    : "corporate";

                await addOrUpdateMedia({
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
                  clip_start: trimFramingConfig?.clipStart,
                  clip_end: trimFramingConfig?.clipEnd,
                  aspect_ratio: trimFramingConfig?.aspectRatio,
                  focal_point: trimFramingConfig?.focalPoint,
                  fit_mode: trimFramingConfig?.fitMode,
                });
              }}
            />
          </div>
        )}

        {/* Tab 2: Corporate Events Media Slots */}
        {activeTab === "corporate" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#C9A84C]" /> Corporate Events & Summits Media Slots
                </h3>
                <p className="text-xs text-[#888] mt-1">
                  Manage all photos and videos appearing across Corporate Conclaves and Executive Offsite rails. Click "Change Photo / Video" on any slot to upload from your laptop or paste a Google Drive link.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSlotForReplace("corp_rail_1");
                  setActiveTab("uploader");
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C9A84C] text-black text-xs font-semibold tracking-wider uppercase hover:opacity-95 shadow-lg shadow-[#C9A84C]/20"
              >
                <Plus className="w-3.5 h-3.5" /> Open Media Uploader
              </button>
            </div>

            {/* Corporate Conclaves Slots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2">
                  <span>🏢 Rail 1: Tech Summits & Annual Leadership Conclaves</span>
                  <span className="text-[10px] text-neutral-400 font-mono font-normal">
                    (6 Designated Slots on Live Site)
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {MASTER_SITE_SLOTS.filter(
                  (s) => s.section === "corporate" && s.slot_id.startsWith("corp_rail_")
                ).map((slot) => {
                  const resolved = resolveSlotMedia(slot.slot_id, media);
                  return (
                    <div
                      key={slot.slot_id}
                      className={`bg-[#121212] border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
                        resolved.isCustom
                          ? "border-emerald-500/40 shadow-emerald-500/5"
                          : "border-white/10"
                      }`}
                    >
                      <div>
                        {/* Live Preview Screen */}
                        <div className="aspect-video bg-black relative overflow-hidden border-b border-white/10">
                          {resolved.type === "video" ? (
                            <iframe
                              src={resolved.url}
                              title={resolved.title}
                              className="w-full h-full pointer-events-none"
                            />
                          ) : (
                            <img
                              src={resolved.url}
                              alt={resolved.title}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Overlay Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#C9A84C] border border-white/10">
                              {slot.slot_id}
                            </span>
                            {slot.badge && (
                              <span className="bg-[#C9A84C] text-black px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                                {slot.badge}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            {resolved.isCustom ? (
                              <span className="bg-emerald-500 text-black px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Check className="w-3 h-3" /> Custom Active
                              </span>
                            ) : (
                              <span className="bg-white/20 backdrop-blur-md text-white/80 px-2 py-0.5 rounded-full text-[10px] font-mono">
                                Default Curated
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Slot Information */}
                        <div className="p-4 space-y-1.5">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {slot.label}
                          </p>
                          <p className="text-[11px] text-neutral-300 line-clamp-1">
                            Current: <span className="text-[#E2C775]">{resolved.title}</span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 pt-0 flex items-center gap-2">
                        <button
                          onClick={() => handleInitiateReplace(slot.slot_id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#E2C775] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#C9A84C]/10"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Change Photo / Video</span>
                        </button>

                        {resolved.isCustom && (
                          <button
                            onClick={() => removeMedia(slot.slot_id)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Revert this slot to original default"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Corporate Offsites Slots */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#E2C775] flex items-center gap-2">
                  <span>🌲 Rail 2: Executive Retreats & Offsite Energizers</span>
                  <span className="text-[10px] text-neutral-400 font-mono font-normal">
                    (4 Designated Slots on Live Site)
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MASTER_SITE_SLOTS.filter(
                  (s) => s.section === "corporate" && s.slot_id.startsWith("corp_offsite_")
                ).map((slot) => {
                  const resolved = resolveSlotMedia(slot.slot_id, media);
                  return (
                    <div
                      key={slot.slot_id}
                      className={`bg-[#121212] border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
                        resolved.isCustom
                          ? "border-emerald-500/40 shadow-emerald-500/5"
                          : "border-white/10"
                      }`}
                    >
                      <div>
                        <div className="aspect-video bg-black relative overflow-hidden border-b border-white/10">
                          {resolved.type === "video" ? (
                            <iframe
                              src={resolved.url}
                              title={resolved.title}
                              className="w-full h-full pointer-events-none"
                            />
                          ) : (
                            <img
                              src={resolved.url}
                              alt={resolved.title}
                              className="w-full h-full object-cover"
                            />
                          )}

                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#C9A84C] border border-white/10">
                              {slot.slot_id}
                            </span>
                          </div>

                          <div className="absolute top-2 right-2">
                            {resolved.isCustom ? (
                              <span className="bg-emerald-500 text-black px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                Custom
                              </span>
                            ) : (
                              <span className="bg-white/20 text-white/80 px-1.5 py-0.5 rounded-full text-[9px] font-mono">
                                Default
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {slot.label}
                          </p>
                          <p className="text-[10px] text-neutral-300 line-clamp-1">
                            {resolved.title}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 pt-0 flex items-center gap-2">
                        <button
                          onClick={() => handleInitiateReplace(slot.slot_id)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-[#C9A84C] text-black font-semibold text-[11px] uppercase tracking-wider hover:bg-[#E2C775] transition-all flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Change</span>
                        </button>
                        {resolved.isCustom && (
                          <button
                            onClick={() => removeMedia(slot.slot_id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Revert to original default"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Weddings, Sangeet & Family Celebrations Media Slots */}
        {activeTab === "weddings" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#CC2936] fill-[#CC2936]" /> Luxury Weddings, Sangeet & Family Games Slots
                </h3>
                <p className="text-xs text-[#888] mt-1">
                  Manage all photos and videos appearing across Sangeet, Royal Varmala, and Family Interactive Games rails. Click "Change Photo / Video" on any slot to upload from your laptop or paste a Google Drive link.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSlotForReplace("wed_rail_1");
                  setActiveTab("uploader");
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CC2936] to-[#E91E63] text-white text-xs font-semibold tracking-wider uppercase hover:opacity-95 shadow-lg shadow-[#CC2936]/20"
              >
                <Plus className="w-3.5 h-3.5" /> Open Media Uploader
              </button>
            </div>

            {/* Wedding & Sangeet Rail Slots */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#F06292] flex items-center gap-2">
                  <span>💍 Rail 1: Luxury Sangeet & Destination Wedding Moments</span>
                  <span className="text-[10px] text-neutral-400 font-mono font-normal">
                    (6 Designated Slots on Live Site)
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {MASTER_SITE_SLOTS.filter((s) => s.section === "weddings").map((slot) => {
                  const resolved = resolveSlotMedia(slot.slot_id, media);
                  return (
                    <div
                      key={slot.slot_id}
                      className={`bg-[#121212] border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
                        resolved.isCustom
                          ? "border-[#CC2936]/50 shadow-[#CC2936]/10"
                          : "border-white/10"
                      }`}
                    >
                      <div>
                        <div className="aspect-video bg-black relative overflow-hidden border-b border-white/10">
                          {resolved.type === "video" ? (
                            <iframe
                              src={resolved.url}
                              title={resolved.title}
                              className="w-full h-full pointer-events-none"
                            />
                          ) : (
                            <img
                              src={resolved.url}
                              alt={resolved.title}
                              className="w-full h-full object-cover"
                            />
                          )}

                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#F06292] border border-white/10">
                              {slot.slot_id}
                            </span>
                            {slot.badge && (
                              <span className="bg-[#CC2936] text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">
                                {slot.badge}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            {resolved.isCustom ? (
                              <span className="bg-[#CC2936] text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Check className="w-3 h-3" /> Custom Active
                              </span>
                            ) : (
                              <span className="bg-white/20 backdrop-blur-md text-white/80 px-2 py-0.5 rounded-full text-[10px] font-mono">
                                Default Curated
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 space-y-1.5">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {slot.label}
                          </p>
                          <p className="text-[11px] text-neutral-300 line-clamp-1">
                            Current: <span className="text-[#F06292]">{resolved.title}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center gap-2">
                        <button
                          onClick={() => handleInitiateReplace(slot.slot_id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#CC2936] to-[#E91E63] text-white font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#CC2936]/10"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Change Photo / Video</span>
                        </button>

                        {resolved.isCustom && (
                          <button
                            onClick={() => removeMedia(slot.slot_id)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Revert this slot to original default"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signature Family Games Slots */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#E2C775] flex items-center gap-2">
                  <span>🎲 Rail 2: Signature Family Interactive Games & Icebreakers</span>
                  <span className="text-[10px] text-neutral-400 font-mono font-normal">
                    (4 Designated Slots on Live Site)
                  </span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MASTER_SITE_SLOTS.filter((s) => s.section === "games").map((slot) => {
                  const resolved = resolveSlotMedia(slot.slot_id, media);
                  return (
                    <div
                      key={slot.slot_id}
                      className={`bg-[#121212] border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
                        resolved.isCustom
                          ? "border-[#CC2936]/50 shadow-[#CC2936]/10"
                          : "border-white/10"
                      }`}
                    >
                      <div>
                        <div className="aspect-video bg-black relative overflow-hidden border-b border-white/10">
                          {resolved.type === "video" ? (
                            <iframe
                              src={resolved.url}
                              title={resolved.title}
                              className="w-full h-full pointer-events-none"
                            />
                          ) : (
                            <img
                              src={resolved.url}
                              alt={resolved.title}
                              className="w-full h-full object-cover"
                            />
                          )}

                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#F06292] border border-white/10">
                              {slot.slot_id}
                            </span>
                            {slot.badge && (
                              <span className="bg-[#CC2936] text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                                {slot.badge}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2">
                            {resolved.isCustom ? (
                              <span className="bg-[#CC2936] text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                Custom
                              </span>
                            ) : (
                              <span className="bg-white/20 text-white/80 px-1.5 py-0.5 rounded-full text-[9px] font-mono">
                                Default
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {slot.label}
                          </p>
                          <p className="text-[10px] text-neutral-300 line-clamp-1">
                            {resolved.title}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 pt-0 flex items-center gap-2">
                        <button
                          onClick={() => handleInitiateReplace(slot.slot_id)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-[#CC2936] to-[#E91E63] text-white font-semibold text-[11px] uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Change</span>
                        </button>
                        {resolved.isCustom && (
                          <button
                            onClick={() => removeMedia(slot.slot_id)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Revert to original default"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Social & Google Business Settings */}
        {activeTab === "social" && (
          <div className="max-w-3xl mx-auto bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">
                  Social Channels & Google Business Hub
                </h3>
                <p className="text-[#888] text-xs">
                  Update your official links across Instagram, Facebook, YouTube, and Google My Business
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-5">
              {/* Instagram */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  <Instagram className="w-4 h-4 text-[#E1306C]" /> Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={socialForm.instagram_url}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, instagram_url: e.target.value })
                  }
                  className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                  placeholder="https://www.instagram.com/radha_dudeja_/"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  <Youtube className="w-4 h-4 text-[#FF0000]" /> YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={socialForm.youtube_url}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, youtube_url: e.target.value })
                  }
                  className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                  placeholder="https://www.youtube.com/@anchorrd8794"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook Page / Profile URL
                </label>
                <input
                  type="url"
                  value={socialForm.facebook_url}
                  onChange={(e) =>
                    setSocialForm({ ...socialForm, facebook_url: e.target.value })
                  }
                  className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                  placeholder="https://www.facebook.com/profile.php?id=100091785037914"
                />
              </div>

              {/* Google My Business */}
              <div className="p-4 bg-black/40 border border-[#C9A84C]/20 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-[#C9A84C] font-semibold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-[#C9A84C]" /> Google My Business & Rating
                </div>

                <div>
                  <label className="block text-xs text-[#A0A0A0] mb-1 font-medium">
                    Google Review Direct Link (or Maps profile link)
                  </label>
                  <input
                    type="url"
                    value={socialForm.google_business_url}
                    onChange={(e) =>
                      setSocialForm({
                        ...socialForm,
                        google_business_url: e.target.value,
                      })
                    }
                    className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2 text-xs focus:border-[#C9A84C] outline-none font-mono"
                    placeholder="https://search.google.com/local/writereview?placeid=..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#A0A0A0] mb-1 font-medium">
                      Displayed Google Rating
                    </label>
                    <input
                      type="text"
                      value={socialForm.google_rating}
                      onChange={(e) =>
                        setSocialForm({
                          ...socialForm,
                          google_rating: e.target.value,
                        })
                      }
                      className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2 text-xs focus:border-[#C9A84C] outline-none font-mono"
                      placeholder="5.0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#A0A0A0] mb-1 font-medium">
                      Reviews Count Text
                    </label>
                    <input
                      type="text"
                      value={socialForm.google_reviews_count}
                      onChange={(e) =>
                        setSocialForm({
                          ...socialForm,
                          google_reviews_count: e.target.value,
                        })
                      }
                      className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2 text-xs focus:border-[#C9A84C] outline-none font-mono"
                      placeholder="150+"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  WhatsApp Contact Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={socialForm.whatsapp_number}
                  onChange={(e) =>
                    setSocialForm({
                      ...socialForm,
                      whatsapp_number: e.target.value,
                    })
                  }
                  className="w-full bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                  placeholder="+919876543210"
                />
              </div>

              {socialSaved && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400">
                  <Check className="w-4 h-4" />
                  <span>Settings updated successfully! Changes reflect on the live website.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Channels & Business Info
              </button>
            </form>
          </div>
        )}

        {/* Tab: Visual Content Editor */}
        {activeTab === "visual_editor" && (
          <LiveVisualContentEditor embedded={true} />
        )}

        {/* Tab: Stage Audio Studio */}
        {activeTab === "audio_studio" && (
          <AudioAtmosphereBar embedded={true} />
        )}

        {/* Tab: SEO & Website Content Text */}
        {activeTab === "seo_content" && (
          <AdminSEOContentManager />
        )}

        {/* Tab: Blog & Playbooks Manager */}
        {activeTab === "blog" && (
          <AdminBlogManager />
        )}

        {/* Tab: Google Calendar & Date Holds */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            <div className="bg-[#121212] border border-[#C9A84C]/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
                    <CalendarCheck className="w-4 h-4" /> Google Calendar & Drive Cloud Sync
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Stage Availability, Calendar Sync & Cloud Storage
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage your Google Calendar appointment links, live date holds, and Master Google Drive folder.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={socialForm.google_calendar_url || "https://calendar.google.com/calendar"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 border border-white/15"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" /> Open Google Calendar ↗
                  </a>
                  <a
                    href={socialForm.google_drive_folder_url || "https://drive.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 border border-white/15"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#E2C775]" /> Open Google Drive ↗
                  </a>
                </div>
              </div>

              {/* Settings Form */}
              <form onSubmit={handleSaveSocial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Google Calendar Appointment Link / Calendar URL
                    </label>
                    <input
                      type="url"
                      value={socialForm.google_calendar_url || ""}
                      onChange={(e) => setSocialForm({ ...socialForm, google_calendar_url: e.target.value })}
                      placeholder="https://calendar.google.com/calendar/u/0/appointments/schedules/..."
                      className="w-full bg-black/60 border border-white/15 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Allows visitors to book directly on your personal Google Workspace calendar.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Google Calendar ID / Notifications Email
                    </label>
                    <input
                      type="email"
                      value={socialForm.google_calendar_id || ""}
                      onChange={(e) => setSocialForm({ ...socialForm, google_calendar_id: e.target.value })}
                      placeholder="bookings@radhaadudeja.com"
                      className="w-full bg-black/60 border border-white/15 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      Google account receiving stage brief notifications and date hold invites.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Master Google Drive Vault Folder URL
                  </label>
                  <input
                    type="url"
                    value={socialForm.google_drive_folder_url || ""}
                    onChange={(e) => setSocialForm({ ...socialForm, google_drive_folder_url: e.target.value })}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full bg-black/60 border border-white/15 text-white rounded-xl px-4 py-2.5 text-xs focus:border-[#C9A84C] outline-none font-mono"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Your shared team folder containing event reels, raw clips, and photo collections.
                  </span>
                </div>

                {socialSaved && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 text-xs text-green-400">
                    <Check className="w-4 h-4" />
                    <span>Google Calendar & Drive settings saved successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-opacity shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Calendar & Cloud Settings
                </button>
              </form>
            </div>

            {/* Live Interactive Widget Preview */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#C9A84C] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Live Website Calendar Preview (What Clients Experience)
              </h4>
              <GoogleCalendarBooking format="Corporate Summits & Awards" accentColor="gold" />
            </div>
          </div>
        )}

        {/* Tab: Leads & Inquiries CRM */}
        {activeTab === "leads" && (
          <AdminLeadsCRM />
        )}

        {/* Tab: Connectors & Automations Hub */}
        {activeTab === "connectors" && (
          <AdminConnectorsHub />
        )}

        {/* Tab 5: All Media Table */}
        {activeTab === "all" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                  Full Site Media Matrix ({media.length} items)
                </h3>
                <p className="text-xs text-[#888]">
                  Comprehensive list of all active media records
                </p>
              </div>
              <button
                onClick={() => refreshMedia()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 text-white/80"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Cache
              </button>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/50 border-b border-white/10 text-[#A0A0A0] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3">Preview</th>
                      <th className="p-3">Slot / Title</th>
                      <th className="p-3">Portal Category</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Source</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {media.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#777]">
                          No custom media loaded yet.
                        </td>
                      </tr>
                    ) : (
                      media.map((item) => (
                        <tr
                          key={item.id || item.slot_id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-3 w-16">
                            <div className="w-14 h-10 rounded bg-black overflow-hidden flex items-center justify-center">
                              {item.media_type === "video" ? (
                                <iframe
                                  src={item.media_url}
                                  title="thumb"
                                  className="w-full h-full pointer-events-none"
                                />
                              ) : (
                                <img
                                  src={item.media_url}
                                  alt="thumb"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white">
                              {item.alt_text}
                            </div>
                            <div className="text-[10px] text-[#777] font-mono">
                              {item.slot_id}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-[#C9A84C] uppercase">
                              {item.vertical || "both"}
                            </span>
                          </td>
                          <td className="p-3 text-[#A0A0A0]">
                            {item.category}
                          </td>
                          <td className="p-3 text-[#777] font-mono text-[10px]">
                            {item.source || "upload"}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => removeMedia(item.id || item.slot_id)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
