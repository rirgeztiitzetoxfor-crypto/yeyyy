import React, { useState, useEffect } from "react";
import {
  getWebhookConfig,
  saveWebhookConfig,
  getWebhookLogs,
  testWebhookPing,
  type WebhookConfig,
  type WebhookLogEntry,
} from "@/lib/outboundWebhooks";
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
  Send,
  RefreshCw,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function AdminConnectorsHub() {
  const [config, setConfig] = useState<WebhookConfig>(getWebhookConfig());
  const [logs, setLogs] = useState<WebhookLogEntry[]>(getWebhookLogs());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStates, setTestStates] = useState<Record<string, { loading: boolean; result?: string; success?: boolean }>>({});

  useEffect(() => {
    setConfig(getWebhookConfig());
    setLogs(getWebhookLogs());

    const handleLogsUpdate = () => {
      setLogs(getWebhookLogs());
    };
    window.addEventListener("radhaa_webhook_logs_updated", handleLogsUpdate);
    return () => window.removeEventListener("radhaa_webhook_logs_updated", handleLogsUpdate);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestPing = async (serviceName: string, url: string) => {
    setTestStates((prev) => ({
      ...prev,
      [serviceName]: { loading: true },
    }));

    const res = await testWebhookPing(serviceName, url);

    setTestStates((prev) => ({
      ...prev,
      [serviceName]: {
        loading: false,
        result: res.message,
        success: res.success,
      },
    }));

    setLogs(getWebhookLogs());
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-mono tracking-widest uppercase mb-2">
            <Zap className="w-3.5 h-3.5" />
            Integrations & Outbound Webhooks
          </div>
          <h2 className="text-2xl font-serif text-white font-normal">
            Connectors & Automation Hub
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Automatically dispatch real-time lead payloads, calendar date holds, and proposal generation events to Zapier, Make.com, and Slack.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Connectors Saved!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ZAPIER CONNECTOR */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xs">
                  Z
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Zapier Webhook</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Catch Hook endpoint</span>
                </div>
              </div>
              <a
                href="https://zapier.com/apps/webhook/integrations"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-500 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                Zapier Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={config.zapier_url}
                onChange={(e) => setConfig({ ...config, zapier_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
              />
            </div>

            <button
              type="button"
              disabled={testStates["Zapier"]?.loading || !config.zapier_url}
              onClick={() => handleTestPing("Zapier", config.zapier_url)}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Send className="w-3 h-3 text-[#C9A84C]" />
              <span>{testStates["Zapier"]?.loading ? "Testing..." : "Send Test Ping"}</span>
            </button>

            {testStates["Zapier"]?.result && (
              <p className={`text-[11px] p-2 rounded-lg ${testStates["Zapier"].success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-300"}`}>
                {testStates["Zapier"].result}
              </p>
            )}
          </div>

          {/* MAKE.COM CONNECTOR */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xs">
                  M
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Make.com Webhook</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Integromat Webhook</span>
                </div>
              </div>
              <a
                href="https://www.make.com/en/help/tools/webhooks"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-500 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                Make.com Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://hook.eu1.make.com/..."
                value={config.make_url}
                onChange={(e) => setConfig({ ...config, make_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
              />
            </div>

            <button
              type="button"
              disabled={testStates["Make.com"]?.loading || !config.make_url}
              onClick={() => handleTestPing("Make.com", config.make_url)}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Send className="w-3 h-3 text-[#C9A84C]" />
              <span>{testStates["Make.com"]?.loading ? "Testing..." : "Send Test Ping"}</span>
            </button>

            {testStates["Make.com"]?.result && (
              <p className={`text-[11px] p-2 rounded-lg ${testStates["Make.com"].success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-300"}`}>
                {testStates["Make.com"].result}
              </p>
            )}
          </div>

          {/* SLACK / DISCORD CONNECTOR */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  S
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Slack Incoming Webhook</h4>
                  <span className="text-[10px] text-neutral-400 font-mono">Team Notification Channel</span>
                </div>
              </div>
              <a
                href="https://api.slack.com/messaging/webhooks"
                target="_blank"
                rel="noreferrer"
                className="text-neutral-500 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-neutral-400 mb-1">
                Slack Webhook URL
              </label>
              <input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={config.slack_url}
                onChange={(e) => setConfig({ ...config, slack_url: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C9A84C] outline-none"
              />
            </div>

            <button
              type="button"
              disabled={testStates["Slack"]?.loading || !config.slack_url}
              onClick={() => handleTestPing("Slack", config.slack_url)}
              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Send className="w-3 h-3 text-[#C9A84C]" />
              <span>{testStates["Slack"]?.loading ? "Testing..." : "Send Test Ping"}</span>
            </button>

            {testStates["Slack"]?.result && (
              <p className={`text-[11px] p-2 rounded-lg ${testStates["Slack"].success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-800 text-neutral-300"}`}>
                {testStates["Slack"].result}
              </p>
            )}
          </div>
        </div>

        {/* Triggers Configuration */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#C9A84C]" />
                Event Triggers & Automation Rules
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select which customer actions trigger outbound payloads to your connectors.
              </p>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#C9A84C]/20 transition-all"
            >
              <Save className="w-4 h-4 text-black" />
              <span>Save Connector Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              {
                id: "lead_created",
                label: "New Lead Captured",
                desc: "Fires on booking form submission, RFP generation, and price locks.",
              },
              {
                id: "calendar_hold",
                label: "Google Calendar Hold",
                desc: "Fires when a client reserves a date slot on the calendar.",
              },
              {
                id: "rfp_generated",
                label: "RFP Pitch Deck Download",
                desc: "Fires when an executive pitch deck PDF is compiled.",
              },
              {
                id: "content_updated",
                label: "Live Content Edited",
                desc: "Fires when headlines or bios are modified in the visual editor.",
              },
            ].map((trigger) => {
              const key = trigger.id as keyof typeof config.enabled_events;
              const isChecked = config.enabled_events[key];
              return (
                <label
                  key={trigger.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isChecked
                      ? "bg-[#C9A84C]/10 border-[#C9A84C]/50 text-white"
                      : "bg-white/5 border-white/5 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">{trigger.label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          enabled_events: {
                            ...config.enabled_events,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="accent-[#C9A84C] w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{trigger.desc}</p>
                </label>
              );
            })}
          </div>
        </div>
      </form>

      {/* Live Webhook Dispatch Stream */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#C9A84C]" />
              Real-Time Outbound Activity Stream
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              History of recent webhook events, HTTP responses, and dispatched payloads.
            </p>
          </div>

          <button
            onClick={() => setLogs(getWebhookLogs())}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors"
            title="Refresh Log Stream"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500 rounded-xl bg-white/[0.02]">
            No webhook activity logged yet. Test a connector or trigger an inquiry to view real-time events.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-black/50 border border-white/5 flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      log.status === "success" ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <span className="font-mono text-[10px] text-neutral-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-semibold text-white font-mono text-[11px] px-2 py-0.5 rounded bg-white/5">
                    {log.eventType}
                  </span>
                  <span className="text-neutral-400 truncate text-[11px]">
                    → {log.destination}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[10px] text-neutral-400 hidden sm:inline truncate max-w-xs">
                    {log.payloadSummary}
                  </span>
                  {log.httpCode && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        log.httpCode >= 200 && log.httpCode < 300
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      HTTP {log.httpCode}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
