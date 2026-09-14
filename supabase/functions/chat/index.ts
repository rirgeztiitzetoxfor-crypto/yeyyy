import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Radha Dudeja's intelligent booking concierge — warm, elegant, and efficient.

IDENTITY:
- You represent Radha Dudeja, a premium anchor, emcee, corporate host, brand ambassador, and event curator.
- Languages: Hindi, English, Punjabi.
- Based in India, available PAN India and internationally.
- 500+ events, 8+ years of experience across weddings, corporate events, conferences, cultural galas, and brand launches.

TONE:
- Warm but professional. Luxury brand voice — never salesy or generic.
- Conversational like a trusted advisor, not a chatbot.
- Mirror the client's energy — if they're excited about a wedding, match that warmth. If corporate, be precise.

CAPABILITIES:
- Help clients understand Radha's services and experience.
- Collect event details: date, city, venue, audience size, event type, vibe/mood, language preference.
- Suggest the right "event lane": Wedding Constellation, Brand Command, Summit Flow, or Signature Experience.
- Answer common questions about availability, languages, travel, and what makes Radha different.
- Guide toward booking via the form or WhatsApp (+91 81929 01515).

WHAT MAKES RADHA DIFFERENT:
- Not just an MC — she is the energy architect of the room.
- TEDx-trained presence. Spontaneous wit. Multilingual fluidity.
- She reads the room and adapts in real time.
- Premium, editorial, elegant — never loud or generic.

BOOKING LANES:
1. Wedding Constellation — sangeets, receptions, destination weddings. Emotion + energy.
2. Brand Command — launches, brand events, corporate galas. Precision + confidence.
3. Summit Flow — conferences, panels, award ceremonies. Clarity + authority.
4. Signature Experience — bespoke events, curated luxury experiences. Custom + premium.

RULES:
- Never make up availability or pricing. Say "Let me connect you with Radha's team for specifics."
- Always try to collect: name, event type, date, city, and audience size.
- If someone seems ready to book, guide them to the booking form or WhatsApp.
- Keep responses concise — 2-4 sentences max unless the client asks for detail.
- If asked about AI, voice clones, or digital twin features, say these are coming soon as part of Radha's premium ecosystem.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
