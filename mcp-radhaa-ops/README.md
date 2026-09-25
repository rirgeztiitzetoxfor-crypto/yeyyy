# Radhaa Ops MCP Server

Official **Model Context Protocol (MCP)** server for programmatic operations, booking management, and live website synchronization for **Radhaa Dudeja** (Premier Anchor & Corporate Emcee).

## Features

- `list_leads`: Query client inquiries, proposals, and pipeline leads.
- `create_inquiry`: Programmatically capture leads from external sources, bots, or agencies.
- `update_site_copy`: Live-edit website headlines, taglines, bios, and stats.
- `get_calendar_availability`: Check available dates and reserved holds.
- `trigger_webhook`: Dispatch event payloads to Zapier, Make.com, or Slack.

## Quickstart

### 1. Test via Node CLI
```bash
cd mcp-radhaa-ops
node index.js
```

### 2. Connect to Antigravity / Claude Code / Cursor

Add to your MCP configuration (`mcp_config.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "radhaa-ops": {
      "command": "node",
      "args": ["c:/Users/kartikey/Downloads/radhaqwen/mcp-radhaa-ops/index.js"]
    }
  }
}
```

Now any AI agent can inspect leads, check calendar holds, and update website copy autonomously!
