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

export default function LiveVisualContentEditor() {
  const { copy, updateCopy, resetToDefault } = useSiteContent();

  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
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

  return (
    <>
      {/* Floating launcher trigger */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#141414]/90 border border-[#C9A84C]/50 text-[#E2C775] text-xs font-semibold uppercase tracking-wider shadow-2xl backdrop-blur-md hover:bg-[#C9A84C] hover:text-black transition-all group"
          title="Open Live Visual Content Editor"
        >
          <Edit3 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Visual Content Editor</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>
      </div>

      {/* Floating Editor Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[480px] max-h-[80vh] bg-[#0E0E0E]/98 border border-[#C9A84C]/40 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300 print:hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#C9A84C]/20 text-[#C9A84C]">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Live Visual Content Tool
                </h4>
                <p className="text-[10px] text-neutral-400 font-mono">
                  {isUnlocked ? "🟢 Unlocked & Live Sync Active" : "🔒 Enter Admin Passcode"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isUnlocked ? (
            /* Passcode Unlock Form */
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 mx-auto flex items-center justify-center text-[#C9A84C]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white">Visual Editor Passcode</h5>
                <p className="text-xs text-neutral-400 mt-1">
                  Authenticate to edit on-page headlines, bios, stats, and showcase text directly.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-3">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. radhaa2026)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-center text-white focus:border-[#C9A84C] outline-none"
                  autoFocus
                />
                {authError && <p className="text-[11px] text-red-400">{authError}</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg"
                >
                  Unlock Live Content Editor
                </button>
              </form>
            </div>
          ) : (
            /* Content Editing Sections */
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Section Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "hero", label: "Hero Copy", icon: Type },
                  { id: "about", label: "Bio & Quotes", icon: FileText },
                  { id: "stats", label: "Numbers", icon: BarChart2 },
                  { id: "corporate", label: "Corporate", icon: Briefcase },
                  { id: "weddings", label: "Weddings", icon: Heart },
                  { id: "contact", label: "Contact", icon: Phone },
                ].map((s) => {
                  const Icon = s.icon;
                  const active = activeSection === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-medium transition-all ${
                        active
                          ? "bg-[#C9A84C] text-black font-semibold shadow-md"
                          : "bg-white/5 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* SECTION: HERO */}
              {activeSection === "hero" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Main Stage Headline
                    </label>
                    <input
                      type="text"
                      value={copy.hero_headline}
                      onChange={(e) => handleFieldChange("hero_headline", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Billboard Tagline & Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={copy.hero_tagline}
                      onChange={(e) => handleFieldChange("hero_tagline", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Top Pill Badge
                    </label>
                    <input
                      type="text"
                      value={copy.hero_badge}
                      onChange={(e) => handleFieldChange("hero_badge", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: ABOUT */}
              {activeSection === "about" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Signature Philosophy Quote
                    </label>
                    <input
                      type="text"
                      value={copy.about_quote}
                      onChange={(e) => handleFieldChange("about_quote", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Biography Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={copy.about_body_p1}
                      onChange={(e) => handleFieldChange("about_body_p1", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Biography Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={copy.about_body_p2}
                      onChange={(e) => handleFieldChange("about_body_p2", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: STATS */}
              {activeSection === "stats" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Stages Metric
                    </label>
                    <input
                      type="text"
                      value={copy.stat_events}
                      onChange={(e) => handleFieldChange("stat_events", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                    <input
                      type="text"
                      value={copy.stat_events_label}
                      onChange={(e) => handleFieldChange("stat_events_label", e.target.value)}
                      className="w-full bg-transparent text-[11px] text-neutral-400 mt-1 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Audience Metric
                    </label>
                    <input
                      type="text"
                      value={copy.stat_audience}
                      onChange={(e) => handleFieldChange("stat_audience", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                    <input
                      type="text"
                      value={copy.stat_audience_label}
                      onChange={(e) => handleFieldChange("stat_audience_label", e.target.value)}
                      className="w-full bg-transparent text-[11px] text-neutral-400 mt-1 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Rating Metric
                    </label>
                    <input
                      type="text"
                      value={copy.stat_rating}
                      onChange={(e) => handleFieldChange("stat_rating", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                    <input
                      type="text"
                      value={copy.stat_rating_label}
                      onChange={(e) => handleFieldChange("stat_rating_label", e.target.value)}
                      className="w-full bg-transparent text-[11px] text-neutral-400 mt-1 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Cities Metric
                    </label>
                    <input
                      type="text"
                      value={copy.stat_cities}
                      onChange={(e) => handleFieldChange("stat_cities", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                    <input
                      type="text"
                      value={copy.stat_cities_label}
                      onChange={(e) => handleFieldChange("stat_cities_label", e.target.value)}
                      className="w-full bg-transparent text-[11px] text-neutral-400 mt-1 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: CORPORATE */}
              {activeSection === "corporate" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Corporate Showcase Title
                    </label>
                    <input
                      type="text"
                      value={copy.corporate_title}
                      onChange={(e) => handleFieldChange("corporate_title", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Subtitle / Event Formats
                    </label>
                    <input
                      type="text"
                      value={copy.corporate_subtitle}
                      onChange={(e) => handleFieldChange("corporate_subtitle", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Corporate Overview Description
                    </label>
                    <textarea
                      rows={3}
                      value={copy.corporate_description}
                      onChange={(e) => handleFieldChange("corporate_description", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: WEDDINGS */}
              {activeSection === "weddings" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Weddings Showcase Title
                    </label>
                    <input
                      type="text"
                      value={copy.weddings_title}
                      onChange={(e) => handleFieldChange("weddings_title", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Subtitle / Signature Ceremonies
                    </label>
                    <input
                      type="text"
                      value={copy.weddings_subtitle}
                      onChange={(e) => handleFieldChange("weddings_subtitle", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Weddings Overview Description
                    </label>
                    <textarea
                      rows={3}
                      value={copy.weddings_description}
                      onChange={(e) => handleFieldChange("weddings_description", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: CONTACT */}
              {activeSection === "contact" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Official Booking Email
                    </label>
                    <input
                      type="email"
                      value={copy.contact_email}
                      onChange={(e) => handleFieldChange("contact_email", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Phone / WhatsApp Hotline
                    </label>
                    <input
                      type="tel"
                      value={copy.contact_phone}
                      onChange={(e) => handleFieldChange("contact_phone", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1">
                      Base Location & Travel Radius
                    </label>
                    <input
                      type="text"
                      value={copy.contact_location}
                      onChange={(e) => handleFieldChange("contact_location", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Utility actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-neutral-400">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="flex items-center gap-1.5 text-[11px] hover:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Revert all website copy to original defaults?")) {
                      resetToDefault();
                    }
                  }}
                  className="flex items-center gap-1.5 text-[11px] hover:text-red-400 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
