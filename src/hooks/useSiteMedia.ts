import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteMedia {
  id: string;
  slot_id: string;
  media_url: string;
  media_type: "image" | "video" | "pdf" | "text";
  alt_text: string;
  category: "hero" | "corporate" | "weddings_sangeet" | "gallery" | "videos" | "about" | "general";
  sort_order: number;
  source?: "google_drive" | "upload" | "youtube" | "system";
  vertical?: "corporate" | "weddings_sangeet" | "both";
  subgroup?: string;
  duration?: string;
  badge?: string;
}

export interface SiteSettings {
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  google_business_url: string;
  google_rating: string;
  google_reviews_count: string;
  whatsapp_number: string;
  corporate_showreel_url: string;
  weddings_showreel_url: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  instagram_url: "https://www.instagram.com/radha_dudeja_/",
  facebook_url: "https://www.facebook.com/profile.php?id=100091785037914",
  youtube_url: "https://www.youtube.com/@anchorrd8794",
  google_business_url: "https://search.google.com/local/writereview?placeid=ChIJlYrZi9s_CjkR-NmXydNGO-Q",
  google_rating: "5.0",
  google_reviews_count: "150+",
  whatsapp_number: "+919876543210",
  corporate_showreel_url: "https://www.youtube.com/embed/videoseries?list=PLdummylist",
  weddings_showreel_url: "https://www.youtube.com/embed/videoseries?list=PLdummylist",
};

const LOCAL_STORAGE_MEDIA_KEY = "radha_site_media_v2";
const LOCAL_STORAGE_SETTINGS_KEY = "radha_site_settings_v2";

/**
 * Converts a Google Drive link or file ID into a direct viewable image or embeddable video URL.
 */
export function parseGoogleDriveUrl(url: string, type: "image" | "video" = "image"): string {
  if (!url) return "";
  const trimmed = url.trim();

  // If already a direct preview or converted url
  if (trimmed.includes("googleusercontent.com/d/") || trimmed.includes("/preview")) {
    return trimmed;
  }

  // Extract ID from standard formats:
  // - https://drive.google.com/file/d/FILE_ID/view...
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  // - Or just raw FILE_ID
  const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                trimmed.match(/[\?&]id=([a-zA-Z0-9_-]+)/) ||
                trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

  const fileId = match ? match[1] : (trimmed.length > 20 && !trimmed.includes("/") ? trimmed : null);

  if (!fileId) return trimmed;

  if (type === "video") {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  // High-res Googleusercontent proxy for images
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/**
 * Extracts and formats YouTube video embed URL
 */
export function parseYouTubeEmbedUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/embed/")) return trimmed;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return trimmed;
}

function getLocalMedia(): SiteMedia[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMedia(items: SiteMedia[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save media locally", e);
  }
}

export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    return raw ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
  try {
    const current = getSiteSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save site settings", e);
    return DEFAULT_SITE_SETTINGS;
  }
}

let mediaCache: SiteMedia[] | null = null;
let fetchPromise: Promise<SiteMedia[]> | null = null;

async function fetchAllMedia(): Promise<SiteMedia[]> {
  if (mediaCache) return mediaCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const localItems = getLocalMedia();
    let supabaseItems: SiteMedia[] = [];

    try {
      const { data, error } = await supabase
        .from("site_media")
        .select("*")
        .order("category")
        .order("sort_order");

      if (!error && data) {
        supabaseItems = data as SiteMedia[];
      }
    } catch (e) {
      // Supabase is offline or unconfigured; safely fall back to local
    }

    // Merge supabase and local items (local items take precedence or append)
    const map = new Map<string, SiteMedia>();
    supabaseItems.forEach((item) => map.set(item.slot_id || item.id, item));
    localItems.forEach((item) => map.set(item.slot_id || item.id, item));

    mediaCache = Array.from(map.values());
    return mediaCache;
  })();

  return fetchPromise;
}

export function invalidateMediaCache() {
  mediaCache = null;
  fetchPromise = null;
}

export function useSiteMedia() {
  const [media, setMedia] = useState<SiteMedia[]>(mediaCache || getLocalMedia());
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());
  const [loading, setLoading] = useState(!mediaCache);

  const refreshMedia = useCallback(async () => {
    invalidateMediaCache();
    const data = await fetchAllMedia();
    setMedia([...data]);
  }, []);

  useEffect(() => {
    fetchAllMedia().then((data) => {
      setMedia(data);
      setLoading(false);
    });

    const onStorageChange = () => {
      setSettings(getSiteSettings());
      setMedia(getLocalMedia());
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
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
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    },
    [media]
  );

  const getMediaByVertical = useCallback(
    (vertical: "corporate" | "weddings_sangeet"): SiteMedia[] => {
      return media
        .filter((m) => m.vertical === vertical || m.category === vertical || m.vertical === "both")
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
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

  const addOrUpdateMedia = useCallback(
    async (item: Partial<SiteMedia> & { slot_id: string; media_url: string }) => {
      const fullItem: SiteMedia = {
        id: item.id || `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        slot_id: item.slot_id,
        media_url: item.media_url,
        media_type: item.media_type || "image",
        alt_text: item.alt_text || item.slot_id.replace(/_/g, " "),
        category: item.category || "gallery",
        sort_order: item.sort_order || Date.now(),
        source: item.source || "upload",
        vertical: item.vertical || "both",
      };

      const current = getLocalMedia();
      const existingIdx = current.findIndex((m) => m.slot_id === fullItem.slot_id);
      if (existingIdx >= 0) {
        current[existingIdx] = { ...current[existingIdx], ...fullItem };
      } else {
        current.push(fullItem);
      }
      saveLocalMedia(current);

      // Attempt Supabase sync
      try {
        await supabase.from("site_media").upsert([fullItem]);
      } catch (err) {
        // Safe offline fallback
      }

      await refreshMedia();
    },
    [refreshMedia]
  );

  const removeMedia = useCallback(
    async (idOrSlotId: string) => {
      const current = getLocalMedia().filter(
        (m) => m.id !== idOrSlotId && m.slot_id !== idOrSlotId
      );
      saveLocalMedia(current);

      try {
        await supabase.from("site_media").delete().eq("slot_id", idOrSlotId);
      } catch (err) {
        // Safe offline fallback
      }

      await refreshMedia();
    },
    [refreshMedia]
  );

  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    const updated = saveSiteSettings(newSettings);
    setSettings(updated);
  }, []);

  return {
    media,
    settings,
    loading,
    getMediaUrl,
    getMediaByCategory,
    getMediaByVertical,
    getMediaAlt,
    addOrUpdateMedia,
    removeMedia,
    updateSettings,
    refreshMedia,
  };
}
