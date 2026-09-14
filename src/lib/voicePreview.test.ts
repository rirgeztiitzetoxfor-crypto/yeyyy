import { afterEach, describe, expect, it, vi } from "vitest";
import { requestVoicePreview } from "@/lib/voicePreview";

describe("requestVoicePreview", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("posts text to the proxy endpoint and returns an object URL", async () => {
    const blob = new Blob(["audio"], { type: "audio/mpeg" });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(blob, { status: 200 })
    );
    const objectUrlMock = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");

    const result = await requestVoicePreview("Hello world");

    expect(fetchMock).toHaveBeenCalledWith("/api/voice-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Hello world" }),
    });
    expect(objectUrlMock).toHaveBeenCalledWith(blob);
    expect(result).toBe("blob:preview");
  });

  it("throws the response body when the proxy fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Missing ELEVENLABS_API_KEY on the server.", { status: 503 })
    );

    await expect(requestVoicePreview("Hello world")).rejects.toThrow(
      "Missing ELEVENLABS_API_KEY on the server."
    );
  });
});
