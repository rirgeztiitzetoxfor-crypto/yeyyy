import React, { useState } from "react";
import { saveLead } from "@/lib/leads";
import confetti from "canvas-confetti";
import {
  Briefcase,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface LuxuryLeadGeneratorProps {
  defaultVertical?: "corporate" | "weddings";
  whatsappNumber?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function LuxuryLeadGenerator({
  defaultVertical = "corporate",
  whatsappNumber = "+919876543210",
  onSuccess,
  className = "",
}: LuxuryLeadGeneratorProps) {
  const [eventType, setEventType] = useState<"corporate" | "weddings" | "other">(defaultVertical);
  const [formData, setFormData] = useState({
    clientName: "",
    organization: "",
    phone: "",
    email: "",
    eventDate: "",
    city: "",
    guestCount: "250-500",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cleanPhone = (whatsappNumber || "919876543210").replace(/[^0-9]/g, "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.phone.trim()) {
      setErrorMsg("Please provide your name and WhatsApp/contact number.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const typeLabel =
        eventType === "corporate"
          ? "Corporate Summit / Conclave / Gala"
          : eventType === "weddings"
          ? "Luxury Wedding / Sangeet / Reception"
          : "Exclusive Private Gala";

      // Save lead to local CRM & trigger sync
      saveLead({
        clientName: formData.clientName.trim(),
        organization: formData.organization.trim() || undefined,
        email: formData.email.trim() || "not-provided@lead.local",
        phone: formData.phone.trim(),
        eventType: typeLabel,
        eventDate: formData.eventDate || undefined,
        city: formData.city.trim() || undefined,
        guestCount: formData.guestCount,
        notes: formData.notes.trim() || undefined,
        source: "direct_form",
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#C9A84C", "#E2C775", "#ffffff", "#CC2936"],
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg("Failed to submit request. Please reach out via WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppPrefillUrl = () => {
    const typeLabel =
      eventType === "corporate"
        ? "Corporate Summit / Conclave"
        : eventType === "weddings"
        ? "Luxury Wedding & Sangeet"
        : "Exclusive Event";

    let message = `Hello Radhaa, I would like to inquire about booking you for our upcoming ${typeLabel}.`;
    if (formData.clientName) message += `\n\n• Name: ${formData.clientName}`;
    if (formData.organization) message += `\n• Org/Family: ${formData.organization}`;
    if (formData.eventDate) message += `\n• Date: ${formData.eventDate}`;
    if (formData.city) message += `\n• Destination: ${formData.city}`;
    if (formData.guestCount) message += `\n• Guests: ${formData.guestCount}`;
    if (formData.notes) message += `\n• Details: ${formData.notes}`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={`relative rounded-3xl border border-[#C9A84C]/30 bg-[#12100C]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl overflow-hidden ${className}`}>
      {/* Subtle luxury ambient accent glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#CC2936]/10 rounded-full blur-3xl pointer-events-none" />

      {isSuccess ? (
        <div className="text-center py-12 px-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-[#C9A84C] uppercase font-semibold">
              VIP Request Received
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold">
              Thank You, {formData.clientName || "Esteemed Client"}!
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Your stage date inquiry has been registered in Radhaa's direct booking portal. Her executive management desk will review date availability and respond within 12 hours.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={getWhatsAppPrefillUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#20ba59] transition-all shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              Open WhatsApp Fast-Track
            </a>
            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  clientName: "",
                  organization: "",
                  phone: "",
                  email: "",
                  eventDate: "",
                  city: "",
                  guestCount: "250-500",
                  notes: "",
                });
              }}
              className="text-xs text-neutral-400 hover:text-white underline tracking-wider uppercase"
            >
              Send Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A84C] mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority Date Hold & Stage Inquiry</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold tracking-tight">
              Reserve Your Stage Experience
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
              Direct access to Radhaa Dudeja’s calendar for Fortune 500 corporate summits, leadership conclaves, and luxury royal sangeets.
            </p>
          </div>

          {/* Segmented Experience Selector */}
          <div className="mb-6">
            <label className="block text-[11px] font-mono tracking-widest text-neutral-400 uppercase mb-2">
              Select Experience Discipline
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEventType("corporate")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  eventType === "corporate"
                    ? "bg-[#C9A84C]/15 border-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/10"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-lg ${eventType === "corporate" ? "bg-[#C9A84C] text-black" : "bg-white/5 text-neutral-400"}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">Corporate Summit / Gala</div>
                  <div className="text-[10px] text-neutral-400">CXO Summits, Tech Galas, Conclaves</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setEventType("weddings")}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  eventType === "weddings"
                    ? "bg-[#CC2936]/15 border-[#CC2936] text-white shadow-lg shadow-[#CC2936]/10"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-lg ${eventType === "weddings" ? "bg-[#CC2936] text-white" : "bg-white/5 text-neutral-400"}`}>
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider">Luxury Wedding & Sangeet</div>
                  <div className="text-[10px] text-neutral-400">Royal Varmala, Sangeet Battles, Games</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Your Full Name <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="e.g. Priya Sharma / Rohan Mehta"
                  required
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Company / Family Name
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="e.g. Google India / Mehta Family"
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  WhatsApp / Phone Number <span className="text-[#C9A84C]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C9A84C]" /> Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C9A84C]" /> City / Destination
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Udaipur / Delhi / Goa"
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#C9A84C]" /> Attendees
                </label>
                <select
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-3 outline-none transition-colors"
                >
                  <option value="Under 150">Under 150 VIPs</option>
                  <option value="150-300">150 - 300 Guests</option>
                  <option value="300-600">300 - 600 Guests</option>
                  <option value="600-1200">600 - 1,200 Attendees</option>
                  <option value="1200+">1,200+ Mega Audience</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                Stage Brief & Specific Highlights
              </label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Mention any specific segments: Bilingual hosting, couple entry, fireside moderation, duration, etc."
                className="w-full bg-black/60 border border-white/15 focus:border-[#C9A84C] text-white text-xs rounded-xl px-4 py-2.5 outline-none transition-colors resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {errorMsg}
              </p>
            )}

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-opacity shadow-lg shadow-[#C9A84C]/25 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? "Transmitting Brief..." : "Submit Stage Booking Brief"}
              </button>

              <a
                href={getWhatsAppPrefillUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                Quick WhatsApp
              </a>
            </div>

            {/* Trust note */}
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#C9A84C]" /> Average confirmation response: ~4 hours
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#C9A84C]" /> Confidential & Direct Management
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
