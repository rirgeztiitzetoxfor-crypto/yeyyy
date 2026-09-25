export type WebhookEventType = 
  | "lead.created" 
  | "calendar.hold_requested" 
  | "rfp.generated" 
  | "content.updated" 
  | "ping.test";

export interface WebhookConfig {
  zapier_url: string;
  make_url: string;
  slack_url: string;
  enabled_events: {
    lead_created: boolean;
    calendar_hold: boolean;
    rfp_generated: boolean;
    content_updated: boolean;
  };
}

export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  eventType: WebhookEventType;
  destination: string;
  status: "success" | "failure" | "pending";
  httpCode?: number;
  payloadSummary: string;
  error?: string;
}

const LOCAL_STORAGE_WEBHOOK_CONFIG_KEY = "radhaa_webhook_config_v1";
const LOCAL_STORAGE_WEBHOOK_LOGS_KEY = "radhaa_webhook_logs_v1";

export const DEFAULT_WEBHOOK_CONFIG: WebhookConfig = {
  zapier_url: "",
  make_url: "",
  slack_url: "",
  enabled_events: {
    lead_created: true,
    calendar_hold: true,
    rfp_generated: true,
    content_updated: false,
  },
};

export function getWebhookConfig(): WebhookConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEBHOOK_CONFIG_KEY);
    if (!raw) return DEFAULT_WEBHOOK_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_WEBHOOK_CONFIG,
      ...parsed,
      enabled_events: {
        ...DEFAULT_WEBHOOK_CONFIG.enabled_events,
        ...(parsed.enabled_events || {}),
      },
    };
  } catch {
    return DEFAULT_WEBHOOK_CONFIG;
  }
}

export function saveWebhookConfig(config: WebhookConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_WEBHOOK_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save webhook config", e);
  }
}

export function getWebhookLogs(): WebhookLogEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WEBHOOK_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addWebhookLog(entry: Omit<WebhookLogEntry, "id" | "timestamp">): void {
  try {
    const logs = getWebhookLogs();
    const newEntry: WebhookLogEntry = {
      id: `wh-log-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    const updated = [newEntry, ...logs.slice(0, 49)]; // keep latest 50 logs
    localStorage.setItem(LOCAL_STORAGE_WEBHOOK_LOGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("radhaa_webhook_logs_updated", { detail: updated }));
  } catch (e) {
    console.error("Failed to append webhook log", e);
  }
}

/**
 * Dispatches an event payload across all configured webhook endpoints
 */
export async function dispatchWebhookEvent(
  eventType: WebhookEventType,
  payload: Record<string, unknown>
): Promise<void> {
  const config = getWebhookConfig();
  
  // Check if this event category is enabled
  if (eventType === "lead.created" && !config.enabled_events.lead_created) return;
  if (eventType === "calendar.hold_requested" && !config.enabled_events.calendar_hold) return;
  if (eventType === "rfp.generated" && !config.enabled_events.rfp_generated) return;
  if (eventType === "content.updated" && !config.enabled_events.content_updated) return;

  const enrichedPayload = {
    event: eventType,
    artist: "Radhaa Dudeja",
    website: "https://radhaadudeja.com",
    environment: "production",
    timestamp: new Date().toISOString(),
    data: payload,
  };

  const payloadSummary = JSON.stringify(payload).slice(0, 100);

  const targets = [
    { name: "Zapier", url: config.zapier_url },
    { name: "Make.com", url: config.make_url },
    { name: "Slack", url: config.slack_url },
  ].filter(t => Boolean(t.url && t.url.trim().startsWith("http")));

  if (targets.length === 0) {
    // If no external URLs are configured, log as internal simulation so admin sees the stream
    addWebhookLog({
      eventType,
      destination: "Internal Dispatch (No active URL)",
      status: "success",
      httpCode: 200,
      payloadSummary: `Simulated: ${payloadSummary}`,
    });
    return;
  }

  targets.forEach(async (target) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(target.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedPayload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      addWebhookLog({
        eventType,
        destination: target.name,
        status: res.ok ? "success" : "failure",
        httpCode: res.status,
        payloadSummary,
        error: res.ok ? undefined : `HTTP Status ${res.status}: ${res.statusText}`,
      });
    } catch (err) {
      addWebhookLog({
        eventType,
        destination: target.name,
        status: "failure",
        payloadSummary,
        error: err instanceof Error ? err.message : "Network/CORS error",
      });
    }
  });
}

/**
 * Dedicated test ping function for the admin dashboard
 */
export async function testWebhookPing(serviceName: string, url: string): Promise<{ success: boolean; message: string; httpCode?: number }> {
  if (!url || !url.trim().startsWith("http")) {
    return { success: false, message: "Invalid URL. Please enter a valid HTTP/HTTPS endpoint." };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const testPayload = {
      event: "ping.test",
      artist: "Radhaa Dudeja",
      service: serviceName,
      message: "⚡ Radhaa Dudeja Portfolio Live Webhook Test Ping",
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const isSuccess = res.ok || res.status === 200 || res.status === 201 || res.status === 204;
    addWebhookLog({
      eventType: "ping.test",
      destination: serviceName,
      status: isSuccess ? "success" : "failure",
      httpCode: res.status,
      payloadSummary: "Test Ping Handshake",
      error: isSuccess ? undefined : `HTTP ${res.status} ${res.statusText}`,
    });

    return {
      success: isSuccess,
      httpCode: res.status,
      message: isSuccess
        ? `Handshake Successful! Received HTTP ${res.status} from ${serviceName}.`
        : `Endpoint responded with HTTP ${res.status}: ${res.statusText}`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "CORS or Network error (webhook received if no CORS header)";
    addWebhookLog({
      eventType: "ping.test",
      destination: serviceName,
      status: "failure",
      payloadSummary: "Test Ping Handshake",
      error: msg,
    });
    return {
      success: false,
      message: `Failed to reach endpoint: ${msg}. Note: Some webhook endpoints like Zapier catch the payload even if browser CORS blocks response.`,
    };
  }
}
