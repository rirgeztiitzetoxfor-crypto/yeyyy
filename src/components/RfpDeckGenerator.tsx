import React, { useState } from "react";
import { saveLead } from "@/lib/leads";
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Mic,
  Calendar,
  MapPin,
  Users,
  Building,
} from "lucide-react";
import RadhaaLogo from "./RadhaaLogo";

interface RfpDeckGeneratorProps {
  initialEventType?: string;
  className?: string;
  triggerLabel?: string;
}

export default function RfpDeckGenerator({
  initialEventType = "Corporate Tech Summit",
  className = "",
  triggerLabel = "⚡ Generate Instant Custom RFP & Rider Deck (PDF)",
}: RfpDeckGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"form" | "preview">("form");

  // Form inputs
  const [clientName, setClientName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState(initialEventType);
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("Delhi NCR / Mumbai / Destination");
  const [guestCount, setGuestCount] = useState("500");
  const [customNotes, setCustomNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Save lead to local CRM & trigger outbound webhooks
    saveLead({
      clientName: clientName || "VIP Planner",
      organization: organization || "Corporate / Private Host",
      email: email || "planner@event.com",
      phone: phone || "+91 98765 00000",
      eventType,
      eventDate: eventDate || "2026 Season",
      city,
      guestCount,
      budgetTier: "Executive Standard",
      notes: `Generated Instant RFP Pitch Deck. Notes: ${customNotes}`,
      source: "rfp_download",
      customScope: ["Custom Executive Pitch Deck", "Technical Stage Rider", "Showreel QR Access"],
    });

    setTimeout(() => {
      setIsGenerating(false);
      setStep("preview");
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setStep("form");
        }}
        className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-xl overflow-hidden ${
          className ||
          "bg-gradient-to-r from-[#C9A84C] via-[#DFCA77] to-[#C9A84C] text-black hover:scale-[1.02] shadow-[#C9A84C]/20 border border-[#E2C775]"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <FileText className="w-4 h-4 text-black group-hover:rotate-6 transition-transform" />
          <span>{triggerLabel}</span>
        </span>
        <div className="absolute inset-0 bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 py-8 sm:py-12 bg-black/85 backdrop-blur-xl overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0D0D0D] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-10 shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black print:max-w-none print:p-8">
            
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none print:hidden" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {step === "form" ? (
              <div>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-mono tracking-widest uppercase mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Executive Dossier Generator
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal tracking-wide">
                    Customized Stage Proposal & Rider Deck
                  </h2>
                  <p className="text-sm text-neutral-400 max-w-lg mx-auto mt-2">
                    Enter your event details to generate an instant, executive-grade PDF pitch deck prepared exclusively for your planning board or family.
                  </p>
                </div>

                <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Host / Organizer / Client Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania / Google Team"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Organization / Family Estate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tata Motors / Singhania Wedding"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Official Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. planner@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Event Category
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none"
                    >
                      <option value="Corporate Tech Summit">Corporate Tech Summit & Keynote</option>
                      <option value="Annual Leadership & Gala">Annual Leadership Awards Gala</option>
                      <option value="Luxury Royal Sangeet">Luxury Royal Sangeet & Celebration</option>
                      <option value="Multi-Day Destination Wedding">Multi-Day Destination Wedding</option>
                      <option value="Brand Launch & Reveal">Brand Launch & Product Reveal</option>
                      <option value="Cultural & Musical Festival">Mega Cultural / Public Festival</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Anticipated Date & City
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="City / Venue"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Specific Stage Requirements / Agenda Highlights
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Bilingual English/Hindi required, CXO fireside chat, 800 international delegates..."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#C9A84C] outline-none resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 mt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A84C]/20 flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <span>Compiling Dossier...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-black" />
                          <span>Generate Pitch Deck & Rider</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* PREVIEW / PRINTABLE DECK */
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 print:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep("form")}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      ← Edit Details
                    </button>
                    <span className="text-white/20">|</span>
                    <span className="text-xs font-mono text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full">
                      ✓ Executive Dossier Ready
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg"
                    >
                      <Printer className="w-4 h-4 text-black" />
                      <span>Print / Save as PDF</span>
                    </button>
                  </div>
                </div>

                {/* Printable Document Body */}
                <div id="rfp-printable-dossier" className="space-y-6 text-white print:text-neutral-900">
                  {/* Header / Crest */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#C9A84C]/30 gap-4">
                    <div>
                      <div className="mb-2">
                        <RadhaaLogo variant="hero" showSubtitle={false} />
                      </div>
                      <p className="text-xs font-mono tracking-widest text-[#C9A84C] print:text-amber-700 uppercase">
                        Official Artist Stage Proposal & Technical Rider
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="inline-block text-[11px] font-mono text-neutral-400 uppercase tracking-widest print:text-neutral-600">
                        CONFIDENTIAL PROPOSAL
                      </span>
                      <h4 className="text-base font-serif text-white print:text-black font-medium">
                        Prepared Exclusively for:
                      </h4>
                      <p className="text-sm font-semibold text-[#E2C775] print:text-amber-800">
                        {clientName} {organization ? `· ${organization}` : ""}
                      </p>
                      <p className="text-xs text-neutral-400 print:text-neutral-600">
                        Date of Issue: {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Event Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 print:bg-neutral-100 p-4 rounded-2xl border border-white/10 print:border-neutral-300 text-xs">
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block text-[10px] uppercase font-mono">Format</span>
                      <span className="font-semibold text-white print:text-black">{eventType}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block text-[10px] uppercase font-mono">Scheduled Date</span>
                      <span className="font-semibold text-white print:text-black">{eventDate || "Mutually Agreed 2026"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block text-[10px] uppercase font-mono">Destination / Venue</span>
                      <span className="font-semibold text-white print:text-black">{city}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block text-[10px] uppercase font-mono">Anticipated Guests</span>
                      <span className="font-semibold text-white print:text-black">{guestCount} Delegates / Guests</span>
                    </div>
                  </div>

                  {/* Executive Bio */}
                  <div>
                    <h3 className="text-sm font-serif font-semibold text-[#C9A84C] print:text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Artist Profile & Executive Credentials
                    </h3>
                    <p className="text-xs text-neutral-300 print:text-neutral-700 leading-relaxed">
                      Radhaa Dudeja is one of India's most versatile, magnetic, and sought-after stage anchors and corporate emcees. Rooted in Ramnagar near the forests of Jim Corbett, her career spans over 500+ stages across India and abroad — commanding Fortune 500 tech summits, global CXO galas, and ultra-luxury royal destination weddings with effortless bilingual poise (English & Hindi).
                    </p>
                  </div>

                  {/* Proven Scale Metrics */}
                  <div className="grid grid-cols-4 gap-2 text-center py-3 bg-[#111] print:bg-neutral-50 rounded-xl border border-white/5 print:border-neutral-200">
                    <div>
                      <span className="text-lg font-serif font-bold text-[#E2C775] print:text-amber-800 block">500+</span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Stages Commanded</span>
                    </div>
                    <div>
                      <span className="text-lg font-serif font-bold text-[#E2C775] print:text-amber-800 block">100k+</span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Audience Engaged</span>
                    </div>
                    <div>
                      <span className="text-lg font-serif font-bold text-[#E2C775] print:text-amber-800 block">5.0 ★</span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Google Verified</span>
                    </div>
                    <div>
                      <span className="text-lg font-serif font-bold text-[#E2C775] print:text-amber-800 block">25+</span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Global Cities</span>
                    </div>
                  </div>

                  {/* Technical Stage Rider & Protocol */}
                  <div>
                    <h3 className="text-sm font-serif font-semibold text-[#C9A84C] print:text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Stage Hospitality & Technical Rider
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white/5 print:bg-neutral-100 rounded-xl border border-white/10 print:border-neutral-300">
                        <span className="font-semibold text-white print:text-black block mb-1">Audio & Microphone Specs:</span>
                        <ul className="text-neutral-400 print:text-neutral-600 space-y-1 list-disc list-inside">
                          <li>1x UHF Wireless Handheld Mic (Shure Beta 58A / Sennheiser G4)</li>
                          <li>1x Wireless In-Ear Monitor (IEM) or dedicated stage wedge monitor</li>
                          <li>Fresh Alkaline AA batteries per 3-hour session</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white/5 print:bg-neutral-100 rounded-xl border border-white/10 print:border-neutral-300">
                        <span className="font-semibold text-white print:text-black block mb-1">Stage Protocol & Rehearsal:</span>
                        <ul className="text-neutral-400 print:text-neutral-600 space-y-1 list-disc list-inside">
                          <li>60-minute technical dry run with AV & show director prior to doors open</li>
                          <li>Direct talkback line or dedicated stage cue manager</li>
                          <li>Green room with bottled water, mirror, and secure wardrobe space</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Verified Showreel & Booking Office */}
                  <div className="pt-4 border-t border-white/10 print:border-neutral-300 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
                    <div>
                      <span className="text-neutral-400 print:text-neutral-600 block text-[10px] uppercase font-mono">Verified Portfolio & Video Vault</span>
                      <a
                        href="https://radhaadudeja.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C9A84C] font-semibold hover:underline"
                      >
                        radhaadudeja.com/corporate · radhaadudeja.com/weddings
                      </a>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-neutral-400 print:text-neutral-600 block text-[10px] uppercase font-mono">Official Booking Desk</span>
                      <span className="font-semibold text-white print:text-black block">bookings@radhaadudeja.com</span>
                      <span className="text-neutral-400 print:text-neutral-600">+91 98765 43210 · +91 81929 01515</span>
                    </div>
                  </div>
                </div>

                {/* Print button footer for screen */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between print:hidden">
                  <p className="text-xs text-neutral-400">
                    Click "Print / Save as PDF" to save or dispatch directly to your client board.
                  </p>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg"
                  >
                    <Printer className="w-4 h-4 text-black" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
