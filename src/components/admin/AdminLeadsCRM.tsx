import React, { useState, useEffect, useMemo } from "react";
import {
  getStoredLeads,
  updateLeadStatus,
  deleteLead,
  exportLeadsToCSV,
  saveLead,
  type LeadInquiry,
  type LeadStatus,
  type LeadSource,
} from "@/lib/leads";
import {
  Users,
  Search,
  Download,
  Plus,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  FileSpreadsheet,
  Building,
} from "lucide-react";

export default function AdminLeadsCRM() {
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Manual lead form
  const [newClientName, setNewClientName] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEventType, setNewEventType] = useState("Corporate Tech Summit");
  const [newEventDate, setNewEventDate] = useState("");
  const [newCity, setNewCity] = useState("Delhi NCR");
  const [newGuests, setNewGuests] = useState("500");
  const [newBudget, setNewBudget] = useState("₹2,50,000 - ₹3,50,000");
  const [newNotes, setNewNotes] = useState("");

  const refreshLeads = () => {
    setLeads(getStoredLeads());
  };

  useEffect(() => {
    refreshLeads();
    const handleLeadsUpdated = () => refreshLeads();
    window.addEventListener("radhaa_leads_updated", handleLeadsUpdated);
    return () => window.removeEventListener("radhaa_leads_updated", handleLeadsUpdated);
  }, []);

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    updateLeadStatus(id, newStatus);
    refreshLeads();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this lead record permanently?")) {
      deleteLead(id);
      refreshLeads();
    }
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    saveLead({
      clientName: newClientName,
      organization: newOrg,
      email: newEmail,
      phone: newPhone,
      eventType: newEventType,
      eventDate: newEventDate,
      city: newCity,
      guestCount: newGuests,
      budgetTier: newBudget,
      notes: newNotes,
      source: "direct_form",
      status: "new",
    });

    setShowAddModal(false);
    refreshLeads();
    // Reset form
    setNewClientName("");
    setNewOrg("");
    setNewEmail("");
    setNewPhone("");
    setNewNotes("");
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.organization || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.city || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchSource = sourceFilter === "all" || l.source === sourceFilter;

      return matchSearch && matchStatus && matchSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  // Analytics summary
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "new").length;
    const confirmedCount = leads.filter((l) => l.status === "confirmed").length;
    const proposalCount = leads.filter((l) => l.status === "proposal_sent").length;
    return { total, newCount, confirmedCount, proposalCount };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Lead Generation & Pipeline CRM
          </div>
          <h2 className="text-2xl font-serif text-white font-normal">
            Client Inquiries & Stage Bookings
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Aggregated in real-time from Website Forms, Instant RFP Deck Downloads, Price Estimator, and Google Calendar Holds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportLeadsToCSV(leads)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Download className="w-4 h-4 text-[#C9A84C]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black text-xs font-semibold uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#C9A84C]/20 transition-all"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Inbound Lead</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
            Total Inquiries
          </span>
          <span className="text-2xl font-serif font-bold text-white mt-1 block">
            {metrics.total}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
            New / Uncontacted
          </span>
          <span className="text-2xl font-serif font-bold text-amber-300 mt-1 block">
            {metrics.newCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 block">
            Proposals Sent
          </span>
          <span className="text-2xl font-serif font-bold text-blue-300 mt-1 block">
            {metrics.proposalCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
            Confirmed Bookings
          </span>
          <span className="text-2xl font-serif font-bold text-emerald-300 mt-1 block">
            {metrics.confirmedCount}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#141414] border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, companies, cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:border-[#C9A84C] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="confirmed">Confirmed</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:border-[#C9A84C] outline-none"
          >
            <option value="all">All Sources</option>
            <option value="direct_form">Direct Form</option>
            <option value="price_estimator">Price Estimator</option>
            <option value="rfp_download">RFP Deck Download</option>
            <option value="calendar_hold">Google Calendar Hold</option>
          </select>
        </div>
      </div>

      {/* Leads Table / Cards */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10">
            <Users className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">No inquiry records match your search criteria.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const cleanPhone = (lead.phone || "").replace(/[^0-9]/g, "");
            const waText = encodeURIComponent(
              `Hi ${lead.clientName}! This is Radhaa Dudeja's booking management. We received your inquiry for the ${lead.eventType} on ${lead.eventDate || "upcoming season"}. We would love to share date confirmation and stage itinerary!`
            );
            const waUrl = `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${waText}`;

            return (
              <div
                key={lead.id}
                className="p-5 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#C9A84C]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Lead Profile */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {lead.clientName}
                    </h4>
                    {lead.organization && (
                      <span className="text-xs text-neutral-400 font-medium">
                        · {lead.organization}
                      </span>
                    )}

                    {/* Source Pill */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 uppercase tracking-widest">
                      {lead.source.replace("_", " ")}
                    </span>
                  </div>

                  {/* Event Details Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                    <span className="text-[#E2C775] font-medium">{lead.eventType}</span>
                    {lead.eventDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        {lead.eventDate}
                      </span>
                    )}
                    {lead.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        {lead.city}
                      </span>
                    )}
                    {lead.guestCount && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-neutral-500" />
                        {lead.guestCount} Guests
                      </span>
                    )}
                    {lead.budgetTier && (
                      <span className="text-emerald-400 font-mono text-[11px]">
                        {lead.budgetTier}
                      </span>
                    )}
                  </div>

                  {lead.notes && (
                    <p className="text-xs text-neutral-400 italic bg-white/[0.02] p-2 rounded-lg border border-white/5 mt-1">
                      "{lead.notes}"
                    </p>
                  )}
                </div>

                {/* Status & Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold outline-none border transition-all ${
                      lead.status === "new"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : lead.status === "proposal_sent"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : lead.status === "confirmed"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-white/10 text-neutral-300 border-white/20"
                    }`}
                  >
                    <option value="new">🟡 New</option>
                    <option value="contacted">🔵 Contacted</option>
                    <option value="proposal_sent">🟣 Proposal Sent</option>
                    <option value="confirmed">🟢 Confirmed</option>
                    <option value="archived">⚪ Archived</option>
                  </select>

                  {/* WhatsApp Quick Reply */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all"
                    title="Open WhatsApp with pre-drafted response"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${lead.email}?subject=Booking%20Inquiry%20%E2%80%94%20Radhaa%20Dudeja%20Stage%20Presence`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-all"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 transition-all"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Manual Inbound Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#111] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <h3 className="text-lg font-serif font-semibold mb-1">Add Inbound Stage Lead</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Record a lead received via call, email, or agency partner.
            </p>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Organization / Family
                  </label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Event Type
                  </label>
                  <input
                    type="text"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    City / Venue
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Guests
                  </label>
                  <input
                    type="text"
                    value={newGuests}
                    onChange={(e) => setNewGuests(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                  Notes / Brief
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C9A84C] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold uppercase tracking-wider hover:opacity-95 shadow-lg"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
