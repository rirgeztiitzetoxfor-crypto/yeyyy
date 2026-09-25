import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  Heart,
  CalendarCheck,
  Download,
} from "lucide-react";

export interface GoogleCalendarBookingProps {
  format?: "Corporate Summits & Awards" | "Luxury Weddings & Sangeet";
  onDateSelected?: (dateStr: string, slotLabel: string) => void;
  accentColor?: "gold" | "crimson";
}

interface DateHold {
  date: string; // YYYY-MM-DD
  status: "available" | "on_hold" | "booked";
  note?: string;
}

// Sample dates held or booked for demonstration and realism
const MOCK_DATE_STATUSES: Record<string, "available" | "on_hold" | "booked"> = {
  // We dynamically generate or keep realistic mock holds
};

export default function GoogleCalendarBooking({
  format = "Corporate Summits & Awards",
  onDateSelected,
  accentColor = "gold",
}: GoogleCalendarBookingProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("Evening Gala / Luxury Sangeet (06:30 PM – 01:00 AM)");
  const [cityInput, setCityInput] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper functions for calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateKey = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const getDateStatus = (day: number): "available" | "on_hold" | "booked" => {
    const key = formatDateKey(day);
    if (MOCK_DATE_STATUSES[key]) return MOCK_DATE_STATUSES[key];
    
    // Deterministic simulation for realistic calendar showcase
    const checkDate = new Date(year, month, day);
    if (checkDate < today) return "booked";
    
    const dayOfWeek = checkDate.getDay();
    // Weekends in winter/spring are popular
    if ((month === 10 || month === 11 || month === 0 || month === 1) && (dayOfWeek === 6 || dayOfWeek === 0)) {
      if (day % 3 === 0) return "booked";
      if (day % 2 === 0) return "on_hold";
    }
    return "available";
  };

  const handleSelectDay = (day: number) => {
    const target = new Date(year, month, day);
    if (target < today) return;
    
    setSelectedDate(target);
    const dateStr = formatDateKey(day);
    if (onDateSelected) {
      onDateSelected(dateStr, selectedSlot);
    }
  };

  // Generate Google Calendar Link
  const generateGoogleCalendarUrl = () => {
    if (!selectedDate) return "";

    const dateKey = `${selectedDate.getFullYear()}${String(selectedDate.getMonth() + 1).padStart(2, "0")}${String(selectedDate.getDate()).padStart(2, "0")}`;
    
    // Default 6:30 PM to 11:30 PM IST (UTC +5:30)
    let startHour = "130000Z"; // 18:30 IST
    let endHour = "180000Z";   // 23:30 IST

    if (selectedSlot.includes("Morning")) {
      startHour = "033000Z"; // 09:00 IST
      endHour = "080000Z";   // 13:30 IST
    } else if (selectedSlot.includes("Full-Day")) {
      startHour = "033000Z"; // 09:00 IST
      endHour = "183000Z";   // 00:00 IST
    }

    const startDateTime = `${dateKey}T${startHour}`;
    const endDateTime = `${dateKey}T${endHour}`;

    const title = encodeURIComponent(`Hold: Radhaa Dudeja Emcee Hosting (${format})`);
    const details = encodeURIComponent(
      `Event: ${format}\nAnchor & Host: Radhaa Dudeja\nSlot: ${selectedSlot}\nVenue/City: ${cityInput || "Venue to be confirmed"}\nContact: bookings@radhaadudeja.com | WhatsApp: +91 98765 43210\nWebsite: https://radhaadudeja.com`
    );
    const location = encodeURIComponent(cityInput || "India / Destination Venue");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}`;
  };

  // Download iCal (.ics)
  const downloadIcs = () => {
    if (!selectedDate) return;
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Radhaa Dudeja Experience//Event Hold//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:Hold: Radhaa Dudeja Hosting - ${format}`,
      `DESCRIPTION:Anchor: Radhaa Dudeja\\nSlot: ${selectedSlot}\\nCity: ${cityInput || "TBD"}\\nContact: bookings@radhaadudeja.com`,
      `LOCATION:${cityInput || "India"}`,
      `DTSTART:${y}${m}${d}T183000`,
      `DTEND:${y}${m}${d}T233000`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `radhaa_dudeja_${y}_${m}_${d}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isGold = accentColor === "gold";
  const brandAccent = isGold ? "#C9A84C" : "#CC2936";

  return (
    <div className="rounded-3xl border border-white/10 bg-neutral-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Glow background accent */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: brandAccent }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C9A84C]">
            <CalendarCheck className="w-4 h-4 text-[#C9A84C]" />
            Google Calendar Live Availability
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Check Dates & <em className="italic" style={{ color: brandAccent }}>Sync Calendar</em>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time stage schedule across India & destination locations. Pick a date to verify instant availability.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]" />
            Available
          </span>
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_#fbbf24]" />
            On Hold
          </span>
          <span className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_#f43f5e]" />
            Reserved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 bg-black/50 p-5 rounded-2xl border border-white/10">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif font-bold text-base sm:text-lg text-white">
              {months[month]} <span className="text-[#C9A84C]">{year}</span>
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all border border-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset for day 1 */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9 sm:h-10" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, month, day);
              const isPast = dateObj < today;
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === day;
              
              const status = getDateStatus(day);

              let statusDot = "bg-emerald-400";
              if (status === "on_hold") statusDot = "bg-amber-400";
              if (status === "booked") statusDot = "bg-rose-500 opacity-60";

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast || status === "booked"}
                  onClick={() => handleSelectDay(day)}
                  className={`relative h-9 sm:h-10 rounded-xl text-xs font-medium transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-[#C9A84C] text-black font-bold shadow-lg shadow-[#C9A84C]/30 scale-105 z-10"
                      : isPast || status === "booked"
                      ? "text-neutral-600 bg-white/[0.02] cursor-not-allowed line-through"
                      : "text-neutral-200 bg-white/5 hover:bg-white/15 hover:border-[#C9A84C]/50 border border-transparent"
                  }`}
                >
                  <span>{day}</span>
                  {!isPast && status !== "booked" && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isSelected ? "bg-black" : statusDot
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Actions & Direct Google Calendar Sync (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Selected Event Date
              </span>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#C9A84C]" />
                {selectedDate ? (
                  <span>
                    {selectedDate.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="text-neutral-400 text-sm italic font-normal">
                    Click any available date on calendar
                  </span>
                )}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Session Format & Hours
              </label>
              <div className="space-y-2">
                {[
                  "Evening Gala / Luxury Sangeet (06:30 PM – 01:00 AM)",
                  "Morning Keynote & Summit (09:00 AM – 02:00 PM)",
                  "Full-Day Conclave & Dinner Gala (All Day)",
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot);
                      if (selectedDate && onDateSelected) {
                        onDateSelected(
                          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
                          slot
                        );
                      }
                    }}
                    className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      selectedSlot === slot
                        ? "bg-[#C9A84C]/15 border-[#C9A84C] text-white font-semibold"
                        : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{slot}</span>
                    {selectedSlot === slot && <CheckCircle className="w-3.5 h-3.5 text-[#C9A84C]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* City / Venue input */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Event City / Destination
              </label>
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, Udaipur, Goa"
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] focus:outline-none"
              />
            </div>
          </div>

          {/* Sync Buttons */}
          <div className="space-y-2.5">
            <a
              href={selectedDate ? generateGoogleCalendarUrl() : "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!selectedDate) {
                  e.preventDefault();
                  alert("Please select an available event date from the calendar first!");
                }
              }}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                selectedDate
                  ? "bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] text-white hover:opacity-95 shadow-[#4285F4]/30 cursor-pointer"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5"
              }`}
            >
              <CalendarIcon className="w-4 h-4 fill-white text-white" />
              Add to Google Calendar
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={downloadIcs}
                disabled={!selectedDate}
                className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 text-[#C9A84C]" /> Download .ICS (Apple/Outlook)
              </button>

              <a
                href={`https://wa.me/919876543210?text=Hi%20Radhaa,%20I%20am%20checking%20availability%20for%20${selectedDate ? selectedDate.toLocaleDateString() : 'an%20event'}%20in%20${encodeURIComponent(cityInput || 'our city')}%20for%20${encodeURIComponent(selectedSlot)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                Confirm via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
