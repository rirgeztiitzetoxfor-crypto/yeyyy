import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteMedia {
  id: string;
  slot_id: string;
  media_url: string;
  media_type: string;
  alt_text: string;
  category: string;
  sort_order: number;
}

let mediaCache: SiteMedia[] | null = null;
let fetchPromise: Promise<SiteMedia[]> | null = null;

async function fetchAllMedia(): Promise<SiteMedia[]> {
  if (mediaCache) return mediaCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const { data, error } = await supabase
      .from("site_media")
      .select("*")
      .order("category")
      .order("sort_order");

    if (error) {
      console.error("Failed to fetch site media:", error);
      return [];
    }

    mediaCache = (data as SiteMedia[]) || [];
    return mediaCache;
  })();

  return fetchPromise;
}

// Invalidate cache when admin uploads
export function invalidateMediaCache() {
  mediaCache = null;
  fetchPromise = null;
}

export function useSiteMedia() {
  const [media, setMedia] = useState<SiteMedia[]>(mediaCache || []);
  const [loading, setLoading] = useState(!mediaCache);

  useEffect(() => {
    fetchAllMedia().then((data) => {
      setMedia(data);
      setLoading(false);
    });
  }, []);

  const getMediaUrl = useCallback(
    (slotId: string, fallback: string): string => {
      const item = media.find((m) => m.slot_id === slotId);
      return item?.media_url || fallback;
    },
    [media]
  );

  const getMediaByCategory = useCallback(
    (category: string): SiteMedia[] => {
      return media
        .filter((m) => m.category === category)
        .sort((a, b) => a.sort_order - b.sort_order);
    },
    [media]
  );

  const getMediaAlt = useCallback(
    (slotId: string, fallback: string): string => {
      const item = media.find((m) => m.slot_id === slotId);
      return item?.alt_text || fallback;
    },
    [media]
  );

  return { media, loading, getMediaUrl, getMediaByCategory, getMediaAlt };
}
