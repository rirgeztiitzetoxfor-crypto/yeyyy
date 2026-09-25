import React, { useState, useEffect } from "react";
import { type SiteSettings } from "@/hooks/useSiteMedia";
import {
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  MessageCircle,
  Mail,
  Star,
  Globe,
  Save,
  Check,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface AdminSocialManagerProps {
  settings: SiteSettings;
  onSaveSettings: (newSettings: Partial<SiteSettings>) => void;
}

export default function AdminSocialManager({
  settings,
  onSaveSettings,
}: AdminSocialManagerProps) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleInstagramChange = (val: string) => {
    let clean = val.trim();
    if (clean && !clean.startsWith("http") && !clean.includes("/")) {
      clean = `https://www.instagram.com/${clean.replace("@", "")}/`;
    }
    handleChange("instagram_url", clean);
  };

  const handleYoutubeChange = (val: string) => {
    let clean = val.trim();
    if (clean && !clean.startsWith("http") && !clean.includes("/")) {
      const handle = clean.startsWith("@") ? clean : `@${clean}`;
      clean = `https://www.youtube.com/${handle}`;
    }
    handleChange("youtube_url", clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A84C] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile & Channel Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-white font-bold">
            Social Profiles & Contact Channels
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Update Instagram, YouTube, WhatsApp, Facebook, LinkedIn and review IDs across the entire website instantly.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Channels updated on live site!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Instagram Profile ID / URL
              </label>
              {form.instagram_url && (
                <a
                  href={form.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={form.instagram_url}
              onChange={(e) => handleInstagramChange(e.target.value)}
              placeholder="e.g. radha_dudeja_ or https://instagram.com/radha_dudeja_"
              className="w-full bg-black/80 border border-white/15 focus:border-pink-500 text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              Accepts username (e.g. <code className="text-pink-300">radha_dudeja_</code>) or full URL. Updates Instagram link in nav, footer, and floating bar.
            </p>
          </div>

          {/* YouTube */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold flex items-center gap-2">
                <Youtube className="w-4 h-4" /> YouTube Channel / Handle
              </label>
              {form.youtube_url && (
                <a
                  href={form.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={form.youtube_url}
              onChange={(e) => handleYoutubeChange(e.target.value)}
              placeholder="e.g. @anchorrd8794 or https://youtube.com/@anchorrd8794"
              className="w-full bg-black/80 border border-white/15 focus:border-red-500 text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              Channel link used for Showreel playback and official channel buttons.
            </p>
          </div>

          {/* WhatsApp Direct Number */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#25D366] font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp Booking Number
              </label>
              <span className="text-[10px] font-mono text-neutral-500">Fast-Track Chat</span>
            </div>
            <input
              type="text"
              value={form.whatsapp_number}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
              placeholder="+91 81929 01515"
              className="w-full bg-black/80 border border-white/15 focus:border-[#25D366] text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              All 1-click WhatsApp buttons on the portfolio redirect directly to this number with pre-filled briefs.
            </p>
          </div>

          {/* Facebook */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-2">
                <Facebook className="w-4 h-4" /> Facebook Profile / Page
              </label>
              {form.facebook_url && (
                <a
                  href={form.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={form.facebook_url}
              onChange={(e) => handleChange("facebook_url", e.target.value)}
              placeholder="https://www.facebook.com/profile.php?id=..."
              className="w-full bg-black/80 border border-white/15 focus:border-blue-500 text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              Public Facebook page or official profile link.
            </p>
          </div>

          {/* LinkedIn Profile */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn Executive Profile
              </label>
              {form.linkedin_url && (
                <a
                  href={form.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={form.linkedin_url || ""}
              onChange={(e) => handleChange("linkedin_url", e.target.value)}
              placeholder="https://www.linkedin.com/in/radhaadudeja"
              className="w-full bg-black/80 border border-white/15 focus:border-sky-500 text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              For corporate event organizers and HR leaders checking credentials.
            </p>
          </div>

          {/* StarClinch or Agency Profile */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-[#C9A84C] font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" /> StarClinch / Artist Directory
              </label>
              {form.starclinch_url && (
                <a
                  href={form.starclinch_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={form.starclinch_url || ""}
              onChange={(e) => handleChange("starclinch_url", e.target.value)}
              placeholder="https://starclinch.com/book-anchor-online/l--dehradun"
              className="w-full bg-black/80 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              Artist booking directory profile link.
            </p>
          </div>

          {/* Official Email */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" /> Official Booking Email
              </label>
            </div>
            <input
              type="email"
              value={form.email_address || "bookings@radhaadudeja.com"}
              onChange={(e) => handleChange("email_address", e.target.value)}
              placeholder="bookings@radhaadudeja.com"
              className="w-full bg-black/80 border border-white/15 focus:border-purple-500 text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <p className="text-[10px] text-neutral-500">
              Displayed in contact sections and footer across the portfolio.
            </p>
          </div>

          {/* Google Business & Review Link */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400" /> Google Business & Review Link
              </label>
              {form.google_business_url && (
                <a
                  href={form.google_business_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="text"
              value={form.google_business_url}
              onChange={(e) => handleChange("google_business_url", e.target.value)}
              placeholder="https://search.google.com/local/writereview?placeid=..."
              className="w-full bg-black/80 border border-white/15 focus:border-amber-500 text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400">Display Rating</label>
                <input
                  type="text"
                  value={form.google_rating}
                  onChange={(e) => handleChange("google_rating", e.target.value)}
                  className="w-full bg-black/80 border border-white/15 text-white text-xs rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400">Review Count</label>
                <input
                  type="text"
                  value={form.google_reviews_count}
                  onChange={(e) => handleChange("google_reviews_count", e.target.value)}
                  className="w-full bg-black/80 border border-white/15 text-white text-xs rounded-lg px-3 py-2 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A84C]/25"
          >
            <Save className="w-4 h-4" />
            Save All Social Profile IDs
          </button>
        </div>
      </form>
    </div>
  );
}
