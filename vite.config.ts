import { defineConfig, loadEnv, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

const ELEVENLABS_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";
const ELEVENLABS_MODEL_ID = "eleven_multilingual_v2";
const ELEVENLABS_OUTPUT_FORMAT = "mp3_44100_128";

const json = (payload: unknown) => JSON.stringify(payload);

type MiddlewareServer = {
  middlewares: {
    use: (path: string, handler: (req: any, res: any, next: () => void) => void | Promise<void>) => void;
  };
};

function readJsonBody(req: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function registerVoicePreviewRoute(server: MiddlewareServer, apiKey?: string) {
  server.middlewares.use("/api/voice-preview", async (req, res, next) => {
    if (req.method !== "POST") {
      return next();
    }

    if (!apiKey) {
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(json({ error: "Missing ELEVENLABS_API_KEY on the server." }));
      return;
    }

    try {
      const rawBody = await readJsonBody(req);
      const { text } = JSON.parse(rawBody || "{}");

      if (typeof text !== "string" || !text.trim()) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(json({ error: "A text string is required." }));
        return;
      }

      const elevenLabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "xi-api-key": apiKey,
        },
        body: json({
          text: text.trim(),
          model_id: ELEVENLABS_MODEL_ID,
          output_format: ELEVENLABS_OUTPUT_FORMAT,
        }),
      });

      if (!elevenLabsResponse.ok) {
        const details = await elevenLabsResponse.text();
        res.statusCode = elevenLabsResponse.status;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end(details || "ElevenLabs request failed.");
        return;
      }

      const arrayBuffer = await elevenLabsResponse.arrayBuffer();
      res.statusCode = 200;
      res.setHeader("Content-Type", "audio/mpeg");
      res.end(Buffer.from(arrayBuffer));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Voice preview failed.";
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(message);
    }
  });
}

function voicePreviewProxy(apiKey?: string): PluginOption {
  return {
    name: "voice-preview-proxy",
    configureServer(server) {
      registerVoicePreviewRoute(server, apiKey);
    },
    configurePreviewServer(server) {
      registerVoicePreviewRoute(server, apiKey);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), voicePreviewProxy(env.ELEVENLABS_API_KEY), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
