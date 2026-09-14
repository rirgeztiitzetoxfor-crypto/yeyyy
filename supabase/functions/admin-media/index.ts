import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function getSupabaseAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

function verifyPassword(req: Request): boolean {
  const password = req.headers.get("x-admin-password");
  return password === Deno.env.get("ADMIN_PASSWORD");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // Public: list all media (no password needed)
  if (action === "list" && req.method === "GET") {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_media")
      .select("*")
      .order("category")
      .order("sort_order");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ media: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // All other actions require password
  if (!verifyPassword(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = getSupabaseAdmin();

  try {
    // Upload media
    if (action === "upload" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const slotId = formData.get("slot_id") as string;
      const category = (formData.get("category") as string) || "general";
      const altText = (formData.get("alt_text") as string) || "";
      const mediaType = (formData.get("media_type") as string) || "image";
      const sortOrder = parseInt((formData.get("sort_order") as string) || "0");

      if (!file || !slotId) {
        return new Response(
          JSON.stringify({ error: "file and slot_id are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Upload to storage
      const ext = file.name.split(".").pop() || "jpg";
      const storagePath = `${category}/${slotId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(storagePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        return new Response(
          JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(storagePath);

      const mediaUrl = urlData.publicUrl + `?t=${Date.now()}`;

      // Upsert into site_media table
      const { data, error: dbError } = await supabase
        .from("site_media")
        .upsert(
          {
            slot_id: slotId,
            media_url: mediaUrl,
            media_type: mediaType,
            alt_text: altText,
            category,
            sort_order: sortOrder,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slot_id" }
        )
        .select()
        .single();

      if (dbError) {
        return new Response(
          JSON.stringify({ error: `DB error: ${dbError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true, media: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete media
    if (action === "delete" && req.method === "POST") {
      const { slot_id } = await req.json();

      const { error } = await supabase
        .from("site_media")
        .delete()
        .eq("slot_id", slot_id);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Set external URL (no file upload, just a URL)
    if (action === "set-url" && req.method === "POST") {
      const { slot_id, media_url, category, alt_text, media_type, sort_order } = await req.json();

      const { data, error } = await supabase
        .from("site_media")
        .upsert(
          {
            slot_id,
            media_url,
            media_type: media_type || "image",
            alt_text: alt_text || "",
            category: category || "general",
            sort_order: sort_order || 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slot_id" }
        )
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true, media: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Admin media error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
