import { dispatchWebhookEvent } from "./outboundWebhooks";

export type LeadSource = "direct_form" | "price_estimator" | "rfp_download" | "calendar_hold" | "smart_chat";
export type LeadStatus = "new" | "contacted" | "proposal_sent" | "confirmed" | "archived";

export interface LeadInquiry {
  id: string;
  clientName: string;
  organization?: string;
  email: string;
  phone: string;
  eventType: string; // "Corporate Tech Summit" | "Royal Sangeet" | etc.
  eventDate?: string;
  city?: string;
  guestCount?: string | number;
  budgetTier?: string;
  notes?: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
  customScope?: string[];
}

const LOCAL_STORAGE_LEADS_KEY = "radhaa_leads_crm_v1";

export const INITIAL_SEED_LEADS: LeadInquiry[] = [
  {
    id: "lead-2026-001",
    clientName: "Vikram Singhania",
    organization: "Singhania Family Estate",
    email: "vikram@singhaniagroup.in",
    phone: "+91 98200 45112",
    eventType: "Luxury Royal Sangeet & Reception",
    eventDate: "2026-11-18",
    city: "Udaipur (The Oberoi Udaivilas)",
    guestCount: "650",
    budgetTier: "₹3,50,000 - ₹5,00,000",
    notes: "Requires high-energy family dance cues, couple roast, and seamless English/Hindi flow.",
    source: "calendar_hold",
    status: "proposal_sent",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customScope: ["Bilingual Hosting", "Couple Roast Scripting", "Stage Director Cues"]
  },
  {
    id: "lead-2026-002",
    clientName: "Pooja Malhotra",
    organization: "Google Cloud India",
    email: "poojamalhotra@google.com",
    phone: "+91 99881 23456",
    eventType: "Annual AI Leadership Summit & Keynote",
    eventDate: "2026-10-24",
    city: "Bengaluru (Grand Sheraton)",
    guestCount: "1200",
    budgetTier: "₹4,00,000 - ₹6,00,000",
    notes: "CXO fireside moderation, teleprompter mastery, and executive timing precision required.",
    source: "rfp_download",
    status: "new",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    customScope: ["CXO Fireside Moderation", "Teleprompter Hosting", "Executive Protocol"]
  },
  {
    id: "lead-2026-003",
    clientName: "Ananya Deshmukh",
    organization: "Deshmukh & Khurana Wedding",
    email: "ananya.d@gmail.com",
    phone: "+91 98111 78901",
    eventType: "3-Day Destination Wedding Extravaganza",
    eventDate: "2026-12-05",
    city: "Goa (W Goa)",
    guestCount: "400",
    budgetTier: "₹5,00,000 - ₹7,50,000",
    notes: "Sundowner Haldi, Bohemian Beach Sangeet, and Royal Varmala storytelling.",
    source: "price_estimator",
    status: "contacted",
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    customScope: ["Sundowner Haldi", "Royal Varmala Storytelling", "Interactive Crowd Games"]
  }
];

export function getStoredLeads(): LeadInquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(INITIAL_SEED_LEADS));
      return INITIAL_SEED_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_LEADS;
  } catch (e) {
    console.error("Failed to load leads from localStorage", e);
    return INITIAL_SEED_LEADS;
  }
}

export function saveLead(leadData: Omit<LeadInquiry, "id" | "createdAt" | "status"> & { id?: string; status?: LeadStatus }): LeadInquiry {
  const leads = getStoredLeads();
  const newLead: LeadInquiry = {
    id: leadData.id || `lead-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    status: leadData.status || "new",
    ...leadData,
  };

  const updated = [newLead, ...leads.filter(l => l.id !== newLead.id)];
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("radhaa_leads_updated", { detail: updated }));
  } catch (e) {
    console.error("Failed to save lead", e);
  }

  // Dispatch Outbound Webhook asynchronously
  dispatchWebhookEvent("lead.created", {
    leadId: newLead.id,
    clientName: newLead.clientName,
    organization: newLead.organization || "Private Client",
    email: newLead.email,
    phone: newLead.phone,
    eventType: newLead.eventType,
    eventDate: newLead.eventDate || "TBD",
    city: newLead.city || "TBD",
    budgetTier: newLead.budgetTier || "Standard",
    source: newLead.source,
    createdAt: newLead.createdAt,
    notes: newLead.notes || "",
  });

  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus): void {
  const leads = getStoredLeads();
  const updated = leads.map(l => (l.id === id ? { ...l, status } : l));
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("radhaa_leads_updated", { detail: updated }));
  } catch (e) {
    console.error("Failed to update lead status", e);
  }
}

export function deleteLead(id: string): void {
  const leads = getStoredLeads();
  const updated = leads.filter(l => l.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("radhaa_leads_updated", { detail: updated }));
  } catch (e) {
    console.error("Failed to delete lead", e);
  }
}

export function exportLeadsToCSV(leads: LeadInquiry[]): void {
  const headers = ["ID", "Client Name", "Organization", "Email", "Phone", "Event Type", "Event Date", "City", "Guests", "Budget", "Source", "Status", "Date Captured", "Notes"];
  
  const rows = leads.map(l => [
    `"${l.id}"`,
    `"${(l.clientName || "").replace(/"/g, '""')}"`,
    `"${(l.organization || "").replace(/"/g, '""')}"`,
    `"${(l.email || "").replace(/"/g, '""')}"`,
    `"${(l.phone || "").replace(/"/g, '""')}"`,
    `"${(l.eventType || "").replace(/"/g, '""')}"`,
    `"${(l.eventDate || "").replace(/"/g, '""')}"`,
    `"${(l.city || "").replace(/"/g, '""')}"`,
    `"${l.guestCount || ""}"`,
    `"${(l.budgetTier || "").replace(/"/g, '""')}"`,
    `"${l.source}"`,
    `"${l.status}"`,
    `"${new Date(l.createdAt).toLocaleDateString()}"`,
    `"${(l.notes || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `radhaa_dudeja_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
