import React, { useState } from "react";
import { useSiteContent, DEFAULT_SITE_CONTENT } from "@/hooks/useSiteContent";
import { dispatchWebhookEvent } from "@/lib/outboundWebhooks";
import {
  Edit3,
  Check,
  RotateCcw,
  Download,
  Lock,
  Unlock,
  X,
  Sparkles,
  Type,
  FileText,
  BarChart2,
  Phone,
  Briefcase,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LiveVisualContentEditorProps {
  embedded?: boolean;
}

export default function LiveVisualContentEditor({ embedded = false }: LiveVisualContentEditorProps) {
  const { copy, updateCopy, resetToDefault } = useSiteContent();

  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(embedded);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeSection, setActiveSection] = useState<"hero" | "about" | "stats" | "corporate" | "weddings" | "contact">("hero");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quick unlock check
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcode === "ATMOSPHERE_2026" ||
      passcode === "radhaa2026" ||
      passcode === "radha2026" ||
      passcode === "admin"
    ) {
      setIsUnlocked(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode.");
    }
  };

  const handleFieldChange = (key: keyof typeof copy, value: string | string[]) => {
    updateCopy({ [key]: value });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);

    // Debounced webhook event for content update
    dispatchWebhookEvent("content.updated", {
      field: key,
      updatedValue: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(copy, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `radhaa_site_copy_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reusable Form Fields Component
  const renderEditorFields = () => (
    <div className="space-y-6">
      {/* SECTION: HERO */}
      {activeSection === "hero" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Artist Brand Name
            </label>
            <input
              type="text"
              value={copy.hero_title}
              onChange={(e) => handleFieldChange("hero_title", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none font-serif"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Hero Tagline / Subtitle
            </label>
            <input
              type="text"
              value={copy.hero_tagline}
              onChange={(e) => handleFieldChange("hero_tagline", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Hero Philosophy Statement
            </label>
            <textarea
              rows={3}
              value={copy.hero_subhead}
              onChange={(e) => handleFieldChange("hero_subhead", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                Hero Badge 1 (Corporate)
              </label>
              <input
                type="text"
                value={copy.hero_badge_corporate}
                onChange={(e) => handleFieldChange("hero_badge_corporate", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
                Hero Badge 2 (Weddings)
              </label>
              <input
                type="text"
                value={copy.hero_badge_wedding}
                onChange={(e) => handleFieldChange("hero_badge_wedding", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ABOUT */}
      {activeSection === "about" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Artist Dossier Bio (Paragraph 1)
            </label>
            <textarea
              rows={4}
              value={copy.about_bio_p1}
              onChange={(e) => handleFieldChange("about_bio_p1", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Artist Philosophy (Paragraph 2)
            </label>
            <textarea
              rows={3}
              value={copy.about_bio_p2}
              onChange={(e) => handleFieldChange("about_bio_p2", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Signature Quote
            </label>
            <input
              type="text"
              value={copy.about_quote}
              onChange={(e) => handleFieldChange("about_quote", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#E2C775] italic focus:border-[#C9A84C] outline-none font-serif"
            />
          </div>
        </div>
      )}

      {/* SECTION: STATS */}
      {activeSection === "stats" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Stages Hosted Metric
            </label>
            <input
              type="text"
              value={copy.stat_stages}
              onChange={(e) => handleFieldChange("stat_stages", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-[#C9A84C] outline-none"
            />
            <input
              type="text"
              value={copy.stat_stages_label}
              onChange={(e) => handleFieldChange("stat_stages_label", e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-400 mt-1.5 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Countries Metric
            </label>
            <input
              type="text"
              value={copy.stat_countries}
              onChange={(e) => handleFieldChange("stat_countries", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-[#C9A84C] outline-none"
            />
            <input
              type="text"
              value={copy.stat_countries_label}
              onChange={(e) => handleFieldChange("stat_countries_label", e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-400 mt-1.5 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Rating Metric
            </label>
            <input
              type="text"
              value={copy.stat_rating}
              onChange={(e) => handleFieldChange("stat_rating", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-[#C9A84C] outline-none"
            />
            <input
              type="text"
              value={copy.stat_rating_label}
              onChange={(e) => handleFieldChange("stat_rating_label", e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-400 mt-1.5 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Cities Metric
            </label>
            <input
              type="text"
              value={copy.stat_cities}
              onChange={(e) => handleFieldChange("stat_cities", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-[#C9A84C] outline-none"
            />
            <input
              type="text"
              value={copy.stat_cities_label}
              onChange={(e) => handleFieldChange("stat_cities_label", e.target.value)}
              className="w-full bg-transparent text-xs text-neutral-400 mt-1.5 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* SECTION: CORPORATE */}
      {activeSection === "corporate" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Corporate Conclaves Title
            </label>
            <input
              type="text"
              value={copy.corporate_title}
              onChange={(e) => handleFieldChange("corporate_title", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Subtitle / Summit Formats
            </label>
            <input
              type="text"
              value={copy.corporate_subtitle}
              onChange={(e) => handleFieldChange("corporate_subtitle", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Corporate Stagecraft Overview
            </label>
            <textarea
              rows={4}
              value={copy.corporate_description}
              onChange={(e) => handleFieldChange("corporate_description", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* SECTION: WEDDINGS */}
      {activeSection === "weddings" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Weddings & Sangeet Title
            </label>
            <input
              type="text"
              value={copy.weddings_title}
              onChange={(e) => handleFieldChange("weddings_title", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Subtitle / Signature Revelries
            </label>
            <input
              type="text"
              value={copy.weddings_subtitle}
              onChange={(e) => handleFieldChange("weddings_subtitle", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Luxury Weddings Overview
            </label>
            <textarea
              rows={4}
              value={copy.weddings_description}
              onChange={(e) => handleFieldChange("weddings_description", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* SECTION: CONTACT */}
      {activeSection === "contact" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Official Booking Email
            </label>
            <input
              type="email"
              value={copy.contact_email}
              onChange={(e) => handleFieldChange("contact_email", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Phone / WhatsApp Hotline
            </label>
            <input
              type="tel"
              value={copy.contact_phone}
              onChange={(e) => handleFieldChange("contact_phone", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-neutral-400 mb-1.5">
              Base Location & Global Reach
            </label>
            <input
              type="text"
              value={copy.contact_location}
              onChange={(e) => handleFieldChange("contact_location", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );

  // If EMBEDDED inside Admin Panel: Render full wide dashboard card
  if (embedded) {
    return (
      <div className="bg-[#121212] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#C9A84C]/20 text-[#C9A84C]">
                <Edit3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Visual Content Editor</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Directly edit and sync website headlines, artist dossiers, metrics, and showcase copy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Synced to Live Site
              </span>
            )}
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Revert all website copy to verified defaults?")) {
                  resetToDefault();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {[
            { id: "hero", label: "Hero Headlines & Tagline", icon: Type },
            { id: "about", label: "Artist Bio & Dossier", icon: FileText },
            { id: "stats", label: "Key Numbers & Stats", icon: BarChart2 },
            { id: "corporate", label: "Corporate Conclaves", icon: Briefcase },
            { id: "weddings", label: "Luxury Weddings", icon: Heart },
            { id: "contact", label: "Contact Coordinates", icon: Phone },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSection === sec.id
                    ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        {renderEditorFields()}
      </div>
    );
  }

  // Fallback standalone floating view (if ever used)
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141414]/90 border border-[#C9A84C]/50 text-[#E2C775] text-xs font-semibold uppercase tracking-wider shadow-2xl backdrop-blur-md hover:bg-[#C9A84C] hover:text-black transition-all group"
          title="Open Live Visual Content Editor"
        >
          <Edit3 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Visual Content Editor</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[480px] max-h-[80vh] bg-[#0E0E0E]/98 border border-[#C9A84C]/40 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#C9A84C]/20 text-[#C9A84C]">
                <Edit3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Live Visual Content Tool
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {renderEditorFields()}
          </div>
        </div>
      )}
    </>
  );
}
