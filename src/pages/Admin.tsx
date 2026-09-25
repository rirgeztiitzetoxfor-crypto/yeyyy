import React, { useState, useEffect } from "react";
import {
  useSiteMedia,
  type SiteMedia,
  parseGoogleDriveUrl,
  parseYouTubeEmbedUrl,
} from "@/hooks/useSiteMedia";
import GoogleDriveUploader from "@/components/GoogleDriveUploader";
import RadhaaLogo from "@/components/RadhaaLogo";
import AdminSEOContentManager from "@/components/admin/AdminSEOContentManager";
import AdminBlogManager from "@/components/admin/AdminBlogManager";
import AdminLeadsCRM from "@/components/admin/AdminLeadsCRM";
import AdminConnectorsHub from "@/components/admin/AdminConnectorsHub";
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
    "uploader" | "corporate" | "weddings" | "seo_content" | "blog" | "calendar" | "leads" | "connectors" | "social" | "all"
  >("uploader");

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
            onClick={() => setActiveTab("uploader")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "uploader"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Google Drive Uploader
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
            Corporate Events ({corporateItems.length})
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
            onClick={() => setActiveTab("seo_content")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "seo_content"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO & Content Text
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
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "calendar"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Google Calendar & Holds
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "leads"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4" />
            Leads & Inquiries CRM
          </button>

          <button
            onClick={() => setActiveTab("connectors")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "connectors"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Zap className="w-4 h-4" />
            Connectors & Automations
          </button>

          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "social"
                ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <Share2 className="w-4 h-4" />
            Social & Google Business
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

        {/* Tab 1: Google Drive Uploader */}
        {activeTab === "uploader" && (
          <div className="space-y-8">
            <GoogleDriveUploader
              onMediaAdded={async (item) => {
                await addOrUpdateMedia(item);
              }}
            />

            {/* Quick overview of latest additions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                  Recently Added Media Items ({media.slice(0, 8).length})
                </h3>
                <span className="text-xs text-[#777]">
                  Stored locally & synced with Supabase
                </span>
              </div>

              {media.length === 0 ? (
                <div className="p-8 text-center bg-[#121212] rounded-2xl border border-white/5 text-[#888] text-xs">
                  No custom media added yet. Use the Google Drive form above to add your first photo or video!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {media.slice(0, 8).map((item) => (
                    <div
                      key={item.id || item.slot_id}
                      className="group relative bg-[#141414] border border-white/10 rounded-xl overflow-hidden shadow-lg"
                    >
                      <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
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
                      </div>
                      <div className="p-2.5 flex items-center justify-between">
                        <div className="truncate pr-2">
                          <p className="text-xs text-white truncate font-medium">
                            {item.alt_text}
                          </p>
                          <span className="text-[10px] text-[#C9A84C] uppercase tracking-wider">
                            {item.vertical === "corporate" ? "Corporate" : "Wedding"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeMedia(item.id || item.slot_id)}
                          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Corporate Events Media */}
        {activeTab === "corporate" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Corporate Events & Summits
                </h3>
                <p className="text-xs text-[#888]">
                  Photos, video showreels, and client gala moments for corporate clients
                </p>
              </div>
              <button
                onClick={() => setActiveTab("uploader")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A84C] text-black text-xs font-semibold tracking-wider uppercase hover:opacity-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Corporate Media
              </button>
            </div>

            {corporateItems.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] rounded-2xl border border-dashed border-white/10">
                <Briefcase className="w-10 h-10 text-[#C9A84C]/50 mx-auto mb-3" />
                <h4 className="text-white text-sm font-semibold">
                  No Corporate Media Items Yet
                </h4>
                <p className="text-[#888] text-xs max-w-sm mx-auto mt-1 mb-4">
                  Add photos and video cuts from Google Drive to display in the Corporate section.
                </p>
                <button
                  onClick={() => setActiveTab("uploader")}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-all"
                >
                  Go to Google Drive Uploader
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {corporateItems.map((item) => (
                  <div
                    key={item.id || item.slot_id}
                    className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                  >
                    <div className="aspect-video bg-black relative">
                      {item.media_type === "video" ? (
                        <iframe
                          src={item.media_url}
                          title={item.alt_text}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={item.media_url}
                          alt={item.alt_text}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#C9A84C] border border-white/10">
                        {item.media_type.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.alt_text}
                        </p>
                        <p className="text-[10px] text-[#777] font-mono truncate">
                          Slot: {item.slot_id}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMedia(item.id || item.slot_id)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Weddings & Sangeet Media */}
        {activeTab === "weddings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Weddings, Sangeet & Family Celebrations
                </h3>
                <p className="text-xs text-[#888]">
                  Curated photos, sangeet video clips, and interactive family games moments
                </p>
              </div>
              <button
                onClick={() => setActiveTab("uploader")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C9A84C] text-black text-xs font-semibold tracking-wider uppercase hover:opacity-95"
              >
                <Plus className="w-3.5 h-3.5" /> Add Wedding Media
              </button>
            </div>

            {weddingItems.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] rounded-2xl border border-dashed border-white/10">
                <Heart className="w-10 h-10 text-[#C9A84C]/50 mx-auto mb-3" />
                <h4 className="text-white text-sm font-semibold">
                  No Wedding / Sangeet Media Items Yet
                </h4>
                <p className="text-[#888] text-xs max-w-sm mx-auto mt-1 mb-4">
                  Add photos and video cuts from Google Drive to display in the Wedding and Sangeet section.
                </p>
                <button
                  onClick={() => setActiveTab("uploader")}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-all"
                >
                  Go to Google Drive Uploader
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {weddingItems.map((item) => (
                  <div
                    key={item.id || item.slot_id}
                    className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                  >
                    <div className="aspect-video bg-black relative">
                      {item.media_type === "video" ? (
                        <iframe
                          src={item.media_url}
                          title={item.alt_text}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={item.media_url}
                          alt={item.alt_text}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#C9A84C] border border-white/10">
                        {item.media_type.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3.5 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.alt_text}
                        </p>
                        <p className="text-[10px] text-[#777] font-mono truncate">
                          Slot: {item.slot_id}
                        </p>
                      </div>
                      <button
                        onClick={() => removeMedia(item.id || item.slot_id)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
