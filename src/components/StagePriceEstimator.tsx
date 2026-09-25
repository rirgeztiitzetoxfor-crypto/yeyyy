import React, { useState, useMemo } from "react";
import { saveLead } from "@/lib/leads";
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

interface StagePriceEstimatorProps {
  defaultCategory?: "corporate" | "weddings";
  className?: string;
}

export default function StagePriceEstimator({
  defaultCategory = "corporate",
  className = "",
}: StagePriceEstimatorProps) {
  const [eventType, setEventType] = useState(
    defaultCategory === "corporate" ? "Corporate Tech Summit" : "Luxury Royal Sangeet"
  );
  const [duration, setDuration] = useState<"keynote" | "half_day" | "full_day" | "multi_day">("half_day");
  const [guestTier, setGuestTier] = useState<"intimate" | "ballroom" | "mega">("ballroom");
  const [addons, setAddons] = useState<string[]>([
    "Bilingual Mastery (Hindi & English)",
    "Stage Director & Cue Coordination",
  ]);

  // Lead capture state
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [lockedSuccess, setLockedSuccess] = useState(false);

  const toggleAddon = (item: string) => {
    setAddons((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const calculatedEstimate = useMemo(() => {
    let base = 180000;
    if (eventType.includes("Sangeet")) base = 225000;
    else if (eventType.includes("Gala")) base = 210000;
    else if (eventType.includes("Multi-Day")) base = 380000;

    let durationMultiplier = 1.0;
    if (duration === "half_day") durationMultiplier = 1.25;
    else if (duration === "full_day") durationMultiplier = 1.65;
    else if (duration === "multi_day") durationMultiplier = 2.4;

    let guestFee = 0;
    if (guestTier === "ballroom") guestFee = 25000;
    else if (guestTier === "mega") guestFee = 55000;

    let addonTotal = 0;
    if (addons.includes("CXO Fireside Moderation / Teleprompter")) addonTotal += 30000;
    if (addons.includes("Couple Roast & Custom Family Scripting")) addonTotal += 35000;
    if (addons.includes("Bilingual Mastery (Hindi & English)")) addonTotal += 15000;
    if (addons.includes("Stage Director & Cue Coordination")) addonTotal += 20000;

    const subtotal = Math.round((base * durationMultiplier + guestFee + addonTotal) / 5000) * 5000;
    const lower = subtotal;
    const upper = Math.round((subtotal * 1.2) / 5000) * 5000;

    const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");
    return {
      lowerFormatted: formatINR(lower),
      upperFormatted: formatINR(upper),
      rawLower: lower,
      rawUpper: upper,
    };
  }, [eventType, duration, guestTier, addons]);

  const handleLockEstimate = (e: React.FormEvent) => {
    e.preventDefault();

    saveLead({
      clientName: clientName || "Event Producer",
      organization: "Price Estimator Inquirer",
      email: contactInfo.includes("@") ? contactInfo : "planner@inquiry.com",
      phone: contactInfo.includes("@") ? "+91 98765 43210" : contactInfo,
      eventType: `${eventType} (${duration.replace("_", " ")})`,
      eventDate: eventDate || "2026 Upcoming",
      city: "TBD",
      guestCount: guestTier === "intimate" ? "<200" : guestTier === "ballroom" ? "200-800" : "800+",
      budgetTier: `${calculatedEstimate.lowerFormatted} - ${calculatedEstimate.upperFormatted}`,
      notes: `Scope estimate locked. Add-ons selected: ${addons.join(", ")}`,
      source: "price_estimator",
      customScope: addons,
    });

    setLockedSuccess(true);
    setTimeout(() => {
      setLockedSuccess(false);
      setShowInquiryForm(false);
    }, 3500);
  };

  return (
    <div
      className={`relative w-full bg-[#101010]/95 border border-[#C9A84C]/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* Subtle gold badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-mono tracking-widest uppercase mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Transparent Stage Investment Calculator
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-white font-normal">
            Curate Your Stage Production Scope
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time stagecraft scope builder tailored for enterprise producers and royal wedding families.
          </p>
        </div>

        {/* Live Estimated Investment Pill */}
        <div className="bg-black/60 border border-[#C9A84C]/40 px-5 py-3 rounded-2xl text-right">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            Estimated Investment Range
          </span>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#E2C775]">
            {calculatedEstimate.lowerFormatted} – {calculatedEstimate.upperFormatted}
          </div>
          <span className="block text-[9px] text-neutral-500 font-mono">
            + Applicable Travel & Lodging (Outstation)
          </span>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Event Category */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C9A84C]" />
            1. Event Production Tier
          </label>
          <div className="space-y-2">
            {[
              "Corporate Tech Summit",
              "Annual CXO Award Gala",
              "Luxury Royal Sangeet",
              "Multi-Day Destination Extravaganza",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setEventType(cat)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                  eventType === cat
                    ? "bg-[#C9A84C]/20 border border-[#C9A84C] text-white font-semibold"
                    : "bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{cat}</span>
                {eventType === cat && <Check className="w-3.5 h-3.5 text-[#C9A84C]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
            2. Stage Engagement Duration
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "keynote", label: "Keynote (1-2h)" },
              { id: "half_day", label: "Half-Day (4h)" },
              { id: "full_day", label: "Full Day (Dual)" },
              { id: "multi_day", label: "2-3 Days" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDuration(d.id as any)}
                className={`px-3 py-3 rounded-xl text-xs transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  duration === d.id
                    ? "bg-[#C9A84C]/20 border border-[#C9A84C] text-white font-semibold"
                    : "bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{d.label}</span>
              </button>
            ))}
          </div>

          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mt-4 mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C9A84C]" />
            Audience Scale
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "intimate", label: "<200 VIP" },
              { id: "ballroom", label: "200-800" },
              { id: "mega", label: "800+ Arena" },
            ].map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGuestTier(g.id as any)}
                className={`py-2 px-1 text-[11px] rounded-lg transition-all text-center ${
                  guestTier === g.id
                    ? "bg-[#C9A84C] text-black font-bold"
                    : "bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value Add-ons */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            3. Signature Stage Deliverables
          </label>
          <div className="space-y-2">
            {[
              "Bilingual Mastery (Hindi & English)",
              "CXO Fireside Moderation / Teleprompter",
              "Couple Roast & Custom Family Scripting",
              "Stage Director & Cue Coordination",
            ].map((addon) => {
              const active = addons.includes(addon);
              return (
                <button
                  key={addon}
                  type="button"
                  onClick={() => toggleAddon(addon)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                    active
                      ? "bg-white/10 border border-[#C9A84C]/60 text-white font-medium"
                      : "bg-white/5 border border-white/5 text-neutral-400 hover:text-white"
                  }`}
                >
                  <span className="truncate pr-2">{addon}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      active ? "bg-[#C9A84C] border-[#C9A84C]" : "border-neutral-500"
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lock CTA & Inline Booking */}
      {!showInquiryForm ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C9A84C] shrink-0" />
            <p className="text-xs text-neutral-300">
              Includes comprehensive technical rider, agenda pre-alignment call, and guaranteed zero dead-air stage discipline.
            </p>
          </div>

          <button
            onClick={() => setShowInquiryForm(true)}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#C9A84C]/20 transition-all"
          >
            <span>Lock Estimate & Hold Date</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleLockEstimate}
          className="p-6 rounded-2xl bg-black/80 border border-[#C9A84C]/40 space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" />
              Lock This Package for {calculatedEstimate.lowerFormatted} – {calculatedEstimate.upperFormatted}
            </h4>
            <button
              type="button"
              onClick={() => setShowInquiryForm(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
            />
            <input
              type="text"
              required
              placeholder="WhatsApp Number or Work Email *"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
            />
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
            />
          </div>

          {lockedSuccess ? (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              <span>
                🎉 Custom Stage Package Captured! Radhaa's booking desk has been notified via priority webhook.
              </span>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg"
              >
                Submit & Request 24h Date Hold
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
