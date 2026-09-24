import React, { useState } from "react";
import { useSiteContent, type SiteSEO, type SiteCopy } from "@/hooks/useSiteContent";
import { parseGoogleDriveUrl } from "@/hooks/useSiteMedia";
import {
  Search,
  Globe,
  FileText,
  Save,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Smartphone,
  Monitor,
  Eye,
  Type,
  Briefcase,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function AdminSEOContentManager() {
  const { content, seo, copy, updateSEO, updateCopy, resetToDefault } = useSiteContent();

  const [localSEO, setLocalSEO] = useState<SiteSEO>(seo);
  const [localCopy, setLocalCopy] = useState<SiteCopy>(copy);
  const [seoSaved, setSeoSaved] = useState(false);
  const [copySaved, setCopySaved] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [activeSection, setActiveSection] = useState<"seo" | "copy">("seo");

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    updateSEO(localSEO);
    setSeoSaved(true);
    setTimeout(() => setSeoSaved(false), 2500);
  };

  const handleSaveCopy = (e: React.FormEvent) => {
    e.preventDefault();
    updateCopy(localCopy);
    setCopySaved(true);
    setTimeout(() => setCopySaved(false), 2500);
  };

  const handleDriveImage = (val: string) => {
    const converted = parseGoogleDriveUrl(val, "image");
    setLocalSEO({ ...localSEO, og_image_url: converted });
  };

  return (
    <div className="space-y-8">
      {/* Sub-Tabs: SEO vs Content */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveSection("seo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            activeSection === "seo"
              ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
              : "bg-white/5 text-neutral-300 hover:bg-white/10"
          }`}
        >
          <Search className="w-4 h-4" />
          SEO & Meta Tags
        </button>

        <button
          onClick={() => setActiveSection("copy")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
            activeSection === "copy"
              ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
              : "bg-white/5 text-neutral-300 hover:bg-white/10"
          }`}
        >
          <Type className="w-4 h-4" />
          Website Text & Copy
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: SEO MANAGER */}
      {/* ========================================================================= */}
      {activeSection === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#121212] border border-[#C9A84C]/30 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C9A84C]" /> Search Engine Optimization (SEO)
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage how your portfolio appears on Google, WhatsApp, Facebook, and Twitter.
                </p>
              </div>
              <button
                type="button"
                onClick={resetToDefault}
                className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                title="Reset SEO to default recommendations"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>

            <form onSubmit={handleSaveSEO} className="space-y-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Meta Title (Browser & Google Header)
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      localSEO.meta_title.length > 60 ? "text-amber-400" : "text-neutral-500"
                    }`}
                  >
                    {localSEO.meta_title.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={localSEO.meta_title}
                  onChange={(e) => setLocalSEO({ ...localSEO, meta_title: e.target.value })}
                  placeholder="e.g. Radhaa Dudeja — Premier Anchor & Corporate Emcee"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Meta Description (Google Snippet)
                  </label>
                  <span
                    className={`text-[10px] font-mono ${
                      localSEO.meta_description.length > 160 ? "text-amber-400" : "text-neutral-500"
                    }`}
                  >
                    {localSEO.meta_description.length} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={localSEO.meta_description}
                  onChange={(e) => setLocalSEO({ ...localSEO, meta_description: e.target.value })}
                  placeholder="Engaging audiences for Fortune 500 summits and luxury royal Sangeets..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  SEO Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={localSEO.meta_keywords}
                  onChange={(e) => setLocalSEO({ ...localSEO, meta_keywords: e.target.value })}
                  placeholder="corporate emcee, wedding anchor, sangeet host India, Radhaa Dudeja"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              {/* Canonical URL & OG Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Canonical Website URL
                  </label>
                  <input
                    type="url"
                    value={localSEO.canonical_url}
                    onChange={(e) => setLocalSEO({ ...localSEO, canonical_url: e.target.value })}
                    placeholder="https://radhaadudeja.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                    OpenGraph Share Image (URL or Drive)
                  </label>
                  <input
                    type="text"
                    value={localSEO.og_image_url}
                    onChange={(e) => handleDriveImage(e.target.value)}
                    placeholder="/logo.png or Google Drive link"
                    className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Verification */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Google Search Console Verification Token (Optional)
                </label>
                <input
                  type="text"
                  value={localSEO.google_site_verification || ""}
                  onChange={(e) => setLocalSEO({ ...localSEO, google_site_verification: e.target.value })}
                  placeholder="e.g. google-site-verification=abc123xyz..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#E2C775] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C9A84C]/20"
                >
                  {seoSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-900" />
                      <span>SEO Settings Saved & Applied!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save & Apply SEO Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Google Search Snippet Preview */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Search className="w-3.5 h-3.5 text-[#C9A84C]" />
                  <span>Google Search Live Preview</span>
                </div>
                <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-white/10 text-[10px]">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-2 py-0.5 rounded ${previewDevice === "desktop" ? "bg-white/20 text-white" : "text-neutral-400"}`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-2 py-0.5 rounded ${previewDevice === "mobile" ? "bg-white/20 text-white" : "text-neutral-400"}`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* Google Result Card */}
              <div className="bg-white rounded-xl p-4 text-black font-sans space-y-1 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <div className="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold">
                    R
                  </div>
                  <span className="truncate">{localSEO.canonical_url.replace(/^https?:\/\//, "")}</span>
                </div>
                <h4 className="text-[#1a0dab] hover:underline text-base font-medium leading-snug cursor-pointer line-clamp-2">
                  {localSEO.meta_title || "Radhaa Dudeja — Premier Anchor & Corporate Emcee"}
                </h4>
                <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                  {localSEO.meta_description || "The Radhaa Dudeja Experience: Engaging audiences for Fortune 500 summits..."}
                </p>
              </div>
            </div>

            {/* Social Share Preview (WhatsApp / LinkedIn) */}
            <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white border-b border-white/10 pb-3">
                <Eye className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Social Share Card (WhatsApp & LinkedIn)</span>
              </div>

              <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <div className="aspect-[16/9] w-full bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={localSEO.og_image_url || "/logo.png"}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo.png";
                    }}
                  />
                </div>
                <div className="p-4 space-y-1 bg-[#181818]">
                  <div className="text-[10px] uppercase font-mono text-neutral-400">
                    {localSEO.canonical_url.replace(/^https?:\/\//, "").toUpperCase()}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {localSEO.meta_title}
                  </div>
                  <div className="text-xs text-neutral-400 line-clamp-2">
                    {localSEO.meta_description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: WEBSITE CONTENT & COPY */}
      {/* ========================================================================= */}
      {activeSection === "copy" && (
        <form onSubmit={handleSaveCopy} className="space-y-8">
          {/* Card: Hero Section */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Homepage Hero Billboard Text
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={localCopy.hero_headline}
                  onChange={(e) => setLocalCopy({ ...localCopy, hero_headline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Top Season Badge
                </label>
                <input
                  type="text"
                  value={localCopy.hero_badge}
                  onChange={(e) => setLocalCopy({ ...localCopy, hero_badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Hero Subtitle / Tagline
              </label>
              <textarea
                rows={2}
                value={localCopy.hero_tagline}
                onChange={(e) => setLocalCopy({ ...localCopy, hero_tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
          </div>

          {/* Card: Live Stats Counters */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-3">
              <Award className="w-4 h-4 text-[#C9A84C]" /> Live Performance Counters & Stats
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Total Events</label>
                <input
                  type="text"
                  value={localCopy.stat_events}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_events: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-sm font-bold text-[#C9A84C]"
                />
                <input
                  type="text"
                  value={localCopy.stat_events_label}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_events_label: e.target.value })}
                  className="w-full px-2 py-1 mt-1 rounded bg-transparent border-0 text-[11px] text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Audience Engaged</label>
                <input
                  type="text"
                  value={localCopy.stat_audience}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_audience: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-sm font-bold text-[#C9A84C]"
                />
                <input
                  type="text"
                  value={localCopy.stat_audience_label}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_audience_label: e.target.value })}
                  className="w-full px-2 py-1 mt-1 rounded bg-transparent border-0 text-[11px] text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Google Rating</label>
                <input
                  type="text"
                  value={localCopy.stat_rating}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_rating: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-sm font-bold text-amber-400"
                />
                <input
                  type="text"
                  value={localCopy.stat_rating_label}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_rating_label: e.target.value })}
                  className="w-full px-2 py-1 mt-1 rounded bg-transparent border-0 text-[11px] text-neutral-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Cities / Destinations</label>
                <input
                  type="text"
                  value={localCopy.stat_cities}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_cities: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-sm font-bold text-[#C9A84C]"
                />
                <input
                  type="text"
                  value={localCopy.stat_cities_label}
                  onChange={(e) => setLocalCopy({ ...localCopy, stat_cities_label: e.target.value })}
                  className="w-full px-2 py-1 mt-1 rounded bg-transparent border-0 text-[11px] text-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Card: About Bio & Quote */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-4 h-4 text-[#C9A84C]" /> About Radhaa (Bio & Philosophy)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Signature Quote
              </label>
              <input
                type="text"
                value={localCopy.about_quote}
                onChange={(e) => setLocalCopy({ ...localCopy, about_quote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-[#C9A84C] font-serif italic focus:border-[#C9A84C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Bio Paragraph 1 (Roots & Background)
              </label>
              <textarea
                rows={3}
                value={localCopy.about_body_p1}
                onChange={(e) => setLocalCopy({ ...localCopy, about_body_p1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Bio Paragraph 2 (Philosophy & Crowd Connection)
              </label>
              <textarea
                rows={3}
                value={localCopy.about_body_p2}
                onChange={(e) => setLocalCopy({ ...localCopy, about_body_p2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
          </div>

          {/* Card: Vertical Overviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Corporate Vertical */}
            <div className="bg-[#121212] border border-[#C9A84C]/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#C9A84C]">
                <Briefcase className="w-4 h-4" /> Corporate Portal Overview
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={localCopy.corporate_title}
                  onChange={(e) => setLocalCopy({ ...localCopy, corporate_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={localCopy.corporate_description}
                  onChange={(e) => setLocalCopy({ ...localCopy, corporate_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-xs text-neutral-300"
                />
              </div>
            </div>

            {/* Weddings Vertical */}
            <div className="bg-[#121212] border border-[#CC2936]/40 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#F06292]">
                <Heart className="w-4 h-4 fill-[#CC2936] text-[#CC2936]" /> Weddings Portal Overview
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={localCopy.weddings_title}
                  onChange={(e) => setLocalCopy({ ...localCopy, weddings_title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={localCopy.weddings_description}
                  onChange={(e) => setLocalCopy({ ...localCopy, weddings_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/15 text-xs text-neutral-300"
                />
              </div>
            </div>
          </div>

          {/* Card: Contact Information */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-3">
              <Phone className="w-4 h-4 text-[#C9A84C]" /> Booking & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C9A84C]" /> Booking Email
                </label>
                <input
                  type="email"
                  value={localCopy.contact_email}
                  onChange={(e) => setLocalCopy({ ...localCopy, contact_email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C9A84C]" /> Contact / WhatsApp Phone
                </label>
                <input
                  type="text"
                  value={localCopy.contact_phone}
                  onChange={(e) => setLocalCopy({ ...localCopy, contact_phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" /> Base Location & Availability
                </label>
                <input
                  type="text"
                  value={localCopy.contact_location}
                  onChange={(e) => setLocalCopy({ ...localCopy, contact_location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#E2C775] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#C9A84C]/20"
            >
              {copySaved ? (
                <>
                  <Check className="w-5 h-5 text-emerald-900" />
                  <span>All Website Content Updated & Saved Live!</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save All Website Content Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
