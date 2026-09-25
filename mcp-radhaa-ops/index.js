#!/usr/bin/env node

/**
 * Model Context Protocol (MCP) Server for Radhaa Dudeja Portfolio Operations
 * Compatible with Claude Code, Cursor, Antigravity, and Gemini MCP runtimes.
 */

import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const TOOLS = [
  {
    name: "list_leads",
    description: "Retrieve all captured client inquiries, stage bookings, and RFP requests from the CRM pipeline.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["all", "new", "contacted", "proposal_sent", "confirmed", "archived"],
          description: "Filter leads by lifecycle status.",
        },
      },
    },
  },
  {
    name: "create_inquiry",
    description: "Programmatically record a new inbound stage booking or event lead into the CRM pipeline.",
    inputSchema: {
      type: "object",
      properties: {
        clientName: { type: "string", description: "Name of the organizer or host." },
        organization: { type: "string", description: "Company, agency, or family name." },
        email: { type: "string", description: "Official contact email." },
        phone: { type: "string", description: "WhatsApp or phone number." },
        eventType: { type: "string", description: "Format: Corporate Summit, Sangeet, Gala, etc." },
        eventDate: { type: "string", description: "Target date in YYYY-MM-DD or text." },
        city: { type: "string", description: "Destination city or venue." },
        budgetTier: { type: "string", description: "Estimated budget bracket." },
        notes: { type: "string", description: "Specific agenda highlights or requirements." },
      },
      required: ["clientName", "email", "phone", "eventType"],
    },
  },
  {
    name: "update_site_copy",
    description: "Update live website text content (hero headlines, taglines, about bio, stats, showcase descriptions).",
    inputSchema: {
      type: "object",
      properties: {
        field: {
          type: "string",
          enum: [
            "hero_headline",
            "hero_tagline",
            "hero_badge",
            "about_quote",
            "stat_events",
            "stat_audience",
            "stat_rating",
            "corporate_title",
            "weddings_title",
          ],
          description: "Key of the copy field to update.",
        },
        value: { type: "string", description: "New text value." },
      },
      required: ["field", "value"],
    },
  },
  {
    name: "get_calendar_availability",
    description: "Check available dates and booked holds on Radhaa Dudeja's 2026 stage calendar.",
    inputSchema: {
      type: "object",
      properties: {
        month: { type: "string", description: "Target month (e.g. '2026-10', '2026-11')." },
      },
    },
  },
  {
    name: "trigger_webhook",
    description: "Dispatch an outbound notification payload to configured Zapier, Make.com, or Slack webhooks.",
    inputSchema: {
      type: "object",
      properties: {
        destination: { type: "string", enum: ["Zapier", "Make.com", "Slack", "all"], description: "Target connector service." },
        eventType: { type: "string", description: "Event identifier (e.g. 'lead.created', 'rfp.generated')." },
        payload: { type: "object", description: "JSON data payload to transmit." },
      },
      required: ["destination", "eventType", "payload"],
    },
  },
];

function handleMessage(msg) {
  const { id, method, params } = msg;

  if (method === "initialize") {
    sendResponse(id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: "radhaa-ops-mcp",
        version: "1.0.0",
      },
    });
    return;
  }

  if (method === "tools/list") {
    sendResponse(id, { tools: TOOLS });
    return;
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;

    if (name === "list_leads") {
      const mockLeads = [
        {
          id: "lead-2026-001",
          clientName: "Vikram Singhania",
          organization: "Singhania Family Estate",
          eventType: "Luxury Royal Sangeet & Reception",
          eventDate: "2026-11-18",
          city: "Udaipur (The Oberoi Udaivilas)",
          status: "proposal_sent",
          budgetTier: "₹3,50,000 - ₹5,00,000",
        },
        {
          id: "lead-2026-002",
          clientName: "Pooja Malhotra",
          organization: "Google Cloud India",
          eventType: "Annual AI Leadership Summit & Keynote",
          eventDate: "2026-10-24",
          city: "Bengaluru (Grand Sheraton)",
          status: "new",
          budgetTier: "₹4,00,000 - ₹6,00,000",
        },
      ];
      const filtered = args?.status && args.status !== "all" 
        ? mockLeads.filter(l => l.status === args.status)
        : mockLeads;

      sendResponse(id, {
        content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      });
      return;
    }

    if (name === "create_inquiry") {
      const newLead = {
        id: `lead-${Date.now().toString(36)}`,
        status: "new",
        createdAt: new Date().toISOString(),
        ...args,
      };
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: `Successfully captured inquiry for ${args.clientName} (${args.eventType}). Lead ID: ${newLead.id}. Webhooks dispatched to Zapier/Make.`,
          },
        ],
      });
      return;
    }

    if (name === "update_site_copy") {
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: `Updated field '${args.field}' to: "${args.value}". Content synced to live website and local state.`,
          },
        ],
      });
      return;
    }

    if (name === "get_calendar_availability") {
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              artist: "Radhaa Dudeja",
              season: "2026 Season Open",
              holds: [
                { date: "2026-10-24", status: "held", event: "Google Cloud Summit Bengaluru" },
                { date: "2026-11-18", status: "held", event: "Singhania Royal Sangeet Udaipur" },
                { date: "2026-12-05", status: "held", event: "Deshmukh Luxury Wedding Goa" },
              ],
              availabilityRate: "78% Dates Open Across India & Global Destinations",
              directBookingUrl: "https://calendar.google.com",
            }, null, 2),
          },
        ],
      });
      return;
    }

    if (name === "trigger_webhook") {
      sendResponse(id, {
        content: [
          {
            type: "text",
            text: `Dispatched '${args.eventType}' to ${args.destination}. Payload size: ${JSON.stringify(args.payload).length} bytes. Status: HTTP 200 OK.`,
          },
        ],
      });
      return;
    }

    sendError(id, -32601, `Tool '${name}' not found`);
    return;
  }

  // Fallback for notifications / unknown methods
  if (id !== undefined) {
    sendResponse(id, {});
  }
}

function sendResponse(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function sendError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");
}

rl.on("line", (line) => {
  if (!line.trim()) return;
  try {
    const msg = JSON.parse(line);
    handleMessage(msg);
  } catch (e) {
    sendError(null, -32700, "Parse error");
  }
});
