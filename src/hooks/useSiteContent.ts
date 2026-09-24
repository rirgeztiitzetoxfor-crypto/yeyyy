import { useState, useEffect, useCallback } from "react";

export interface SiteSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  canonical_url: string;
  og_image_url: string;
  og_site_name: string;
  twitter_card: string;
  google_site_verification?: string;
}

export interface SiteCopy {
  // Hero
  hero_headline: string;
  hero_tagline: string;
  hero_badge: string;
  
  // About
  about_quote: string;
  about_body_p1: string;
  about_body_p2: string;
  about_languages: string[];
  
  // Stats
  stat_events: string;
  stat_events_label: string;
  stat_audience: string;
  stat_audience_label: string;
  stat_rating: string;
  stat_rating_label: string;
  stat_cities: string;
  stat_cities_label: string;
  
  // Corporate Vertical
  corporate_title: string;
  corporate_subtitle: string;
  corporate_description: string;
  
  // Weddings Vertical
  weddings_title: string;
  weddings_subtitle: string;
  weddings_description: string;
  
  // Contact & Location
  contact_email: string;
  contact_phone: string;
  contact_location: string;
}

export interface SiteContentData {
  seo: SiteSEO;
  copy: SiteCopy;
}

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  seo: {
    meta_title: "Radhaa Dudeja — Premier Anchor & Corporate Emcee | Weddings, Summits & Galas",
    meta_description: "The Radhaa Dudeja Experience: Engaging audiences for Fortune 500 summits and luxury royal Sangeets. India's premier Anchor & Corporate Emcee.",
    meta_keywords: "wedding anchor, corporate emcee, premium host India, book female anchor, Radhaa Dudeja, event planner, sangeet host, tech summit host",
    canonical_url: "https://radhaadudeja.com",
    og_image_url: "/logo.png",
    og_site_name: "Radhaa Dudeja Experience",
    twitter_card: "summary_large_image",
    google_site_verification: "",
  },
  copy: {
    hero_headline: "Engage the Mind. Ignite the Heart.",
    hero_tagline: "From high-stakes Fortune 500 tech summits to electric Royal Sangeet dance battles — Radhaa Dudeja brings poise, magnetic elegance, and unstoppable high-voltage entertainment.",
    hero_badge: "Pan-India & Global Bookings · 2026 Season Open",
    about_quote: "I don't just host an event, I ignite an experience.",
    about_body_p1: "Radhaa Dudeja brings the energy of a live wire and the poised elegance of a seasoned speaker to every stage. Rooted in Ramnagar near the forests of Jim Corbett, her natural magnetism has blossomed into an illustrious career spanning Fortune 500 conferences, luxury destination weddings, and international cultural summits.",
    about_body_p2: "Her philosophy is simple: engage the mind, ignite the heart. Whether moderating senior executive panels or getting 500 wedding guests on their feet for family games, Radhaa makes every event feel spontaneous, personal, and unforgettable.",
    about_languages: ["Hindi", "English", "Punjabi"],
    stat_events: "500+",
    stat_events_label: "Stages Commanded",
    stat_audience: "100k+",
    stat_audience_label: "Delighted Guests",
    stat_rating: "5.0 ★",
    stat_rating_label: "Google Verified",
    stat_cities: "25+",
    stat_cities_label: "Destination Cities",
    corporate_title: "High-Impact Stage Presence for Fortune 500 Brands",
    corporate_subtitle: "Tech Summits · Award Galas · Leadership Offsites · Keynote Reveals",
    corporate_description: "Navigating teleprompters, fireside chats with CXOs, and high-glamour award galas with impeccable bilingual eloquence, razor-sharp stagecraft, and zero dead air.",
    weddings_title: "High-Voltage Energy & Soulful Family Storytelling",
    weddings_subtitle: "Luxury Sangeet · Signature Family Games · Haldi Fiesta · Royal Varmala",
    weddings_description: "Electrifying dance performance cues, couple roast battles, and emotional family bonding that keeps every generation laughing and dancing until 3 AM.",
    contact_email: "bookings@radhaadudeja.com",
    contact_phone: "+91 98765 43210",
    contact_location: "Delhi NCR · Mumbai · Available Globally",
  },
};

const LOCAL_STORAGE_CONTENT_KEY = "radha_site_content_v1";

export function getLocalContent(): SiteContentData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      seo: { ...DEFAULT_SITE_CONTENT.seo, ...(parsed.seo || {}) },
      copy: { ...DEFAULT_SITE_CONTENT.copy, ...(parsed.copy || {}) },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveLocalContent(content: SiteContentData): SiteContentData {
  try {
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(content));
    applySEOToDocument(content.seo);
    return content;
  } catch (e) {
    console.error("Failed to save content locally", e);
    return DEFAULT_SITE_CONTENT;
  }
}

/**
 * Dynamically updates document title and meta tags for live SEO
 */
export function applySEOToDocument(seo: SiteSEO) {
  if (typeof document === "undefined") return;

  if (seo.meta_title) {
    document.title = seo.meta_title;
  }

  const updateMetaTag = (selector: string, attr: string, value: string) => {
    if (!value) return;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      const [key, val] = selector.replace("meta[", "").replace("]", "").split("=");
      el.setAttribute(key, val.replace(/"/g, ""));
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  updateMetaTag('meta[name="description"]', "content", seo.meta_description);
  updateMetaTag('meta[name="keywords"]', "content", seo.meta_keywords);
  updateMetaTag('meta[property="og:title"]', "content", seo.meta_title);
  updateMetaTag('meta[property="og:description"]', "content", seo.meta_description);
  updateMetaTag('meta[property="og:image"]', "content", seo.og_image_url);
  updateMetaTag('meta[property="og:url"]', "content", seo.canonical_url);
  updateMetaTag('meta[name="twitter:title"]', "content", seo.meta_title);
  updateMetaTag('meta[name="twitter:description"]', "content", seo.meta_description);
  updateMetaTag('meta[name="twitter:image"]', "content", seo.og_image_url);

  if (seo.google_site_verification) {
    updateMetaTag('meta[name="google-site-verification"]', "content", seo.google_site_verification);
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContentData>(getLocalContent());

  useEffect(() => {
    const current = getLocalContent();
    setContent(current);
    applySEOToDocument(current.seo);

    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_CONTENT_KEY) {
        const fresh = getLocalContent();
        setContent(fresh);
        applySEOToDocument(fresh.seo);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateSEO = useCallback((newSEO: Partial<SiteSEO>) => {
    setContent((prev) => {
      const updated: SiteContentData = {
        ...prev,
        seo: { ...prev.seo, ...newSEO },
      };
      saveLocalContent(updated);
      return updated;
    });
  }, []);

  const updateCopy = useCallback((newCopy: Partial<SiteCopy>) => {
    setContent((prev) => {
      const updated: SiteContentData = {
        ...prev,
        copy: { ...prev.copy, ...newCopy },
      };
      saveLocalContent(updated);
      return updated;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    saveLocalContent(DEFAULT_SITE_CONTENT);
    setContent(DEFAULT_SITE_CONTENT);
  }, []);

  return {
    content,
    seo: content.seo,
    copy: content.copy,
    updateSEO,
    updateCopy,
    resetToDefault,
  };
}
