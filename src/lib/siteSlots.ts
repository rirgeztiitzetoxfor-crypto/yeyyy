export interface SiteSlotDefinition {
  slot_id: string;
  label: string;
  section: "hero" | "corporate" | "weddings" | "games" | "about" | "vault";
  sectionName: string;
  default_url: string;
  default_title: string;
  default_type: "image" | "video";
  badge?: string;
}

export const MASTER_SITE_SLOTS: SiteSlotDefinition[] = [
  // HERO BILLBOARD
  {
    slot_id: "hero_billboard",
    label: "Homepage Hero — Master Billboard Showreel",
    section: "hero",
    sectionName: "Homepage Hero",
    default_url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    default_title: "Annual Tech Leadership Summit & Royal Sangeet Showreel",
    default_type: "video",
    badge: "Featured Billboard",
  },

  // CORPORATE CONCLAVES RAIL
  {
    slot_id: "corp_rail_1",
    label: "Corporate Rail #1 — National Leadership Tech Summit",
    section: "corporate",
    sectionName: "Corporate Conclaves",
    default_url: "/images/img_14.jpg",
    default_title: "National Leadership Tech Summit 2026",
    default_type: "image",
    badge: "Trending",
  },
  {
    slot_id: "corp_rail_2",
    label: "Corporate Rail #2 — Brand Launch & Keynote Reveal Gala",
    section: "corporate",
    sectionName: "Corporate Conclaves",
    default_url: "/images/img_06.jpg",
    default_title: "Brand Launch & Keynote Reveal Gala",
    default_type: "image",
    badge: "High Impact",
  },
  {
    slot_id: "corp_rail_3",
    label: "Corporate Rail #3 — Annual Fortune 500 Awards Gala",
    section: "corporate",
    sectionName: "Corporate Conclaves",
    default_url: "/images/img_11.jpg",
    default_title: "Annual Fortune 500 Awards Gala",
    default_type: "image",
    badge: "Black Tie",
  },
  {
    slot_id: "corp_rail_4",
    label: "Corporate Rail #4 — Executive Leadership Fireside Moderation",
    section: "corporate",
    sectionName: "Corporate Conclaves",
    default_url: "/images/img_20.jpg",
    default_title: "Executive Leadership Fireside Moderation",
    default_type: "image",
    badge: "Exclusive",
  },
  {
    slot_id: "corp_rail_5",
    label: "Corporate Rail #5 — Corporate Stagecraft & Executive Pacing",
    section: "corporate",
    sectionName: "Corporate Conclaves",
    default_url: "/images/img_13.jpg",
    default_title: "Corporate Stagecraft & Executive Pacing",
    default_type: "image",
  },
  {
    slot_id: "corp_rail_6",
    label: "Corporate Rail #6 — International Delegations Gala Evening",
    section: "corporate",
    sectionName: "Corporate Conclaves",
    default_url: "/images/img_22.jpg",
    default_title: "International Delegations Gala Evening",
    default_type: "image",
  },

  // CORPORATE OFFSITES
  {
    slot_id: "corp_offsite_1",
    label: "Corporate Offsite #1 — Interactive Icebreakers",
    section: "corporate",
    sectionName: "Corporate Offsites",
    default_url: "/images/img_13.jpg",
    default_title: "Executive Offsite Interactive Icebreakers",
    default_type: "image",
    badge: "Team Building",
  },
  {
    slot_id: "corp_offsite_2",
    label: "Corporate Offsite #2 — C-Suite Leadership Retreats",
    section: "corporate",
    sectionName: "Corporate Offsites",
    default_url: "/images/img_20.jpg",
    default_title: "C-Suite Leadership Retreat Evenings",
    default_type: "image",
    badge: "Exclusive",
  },
  {
    slot_id: "corp_offsite_3",
    label: "Corporate Offsite #3 — Cross-Department Games",
    section: "corporate",
    sectionName: "Corporate Offsites",
    default_url: "/images/img_06.jpg",
    default_title: "Cross-Department Communication Games",
    default_type: "image",
    badge: "Energizer",
  },
  {
    slot_id: "corp_offsite_4",
    label: "Corporate Offsite #4 — Global Leaders Networking Dinner",
    section: "corporate",
    sectionName: "Corporate Offsites",
    default_url: "/images/img_14.jpg",
    default_title: "Global Leaders Networking Dinner",
    default_type: "image",
    badge: "Black Tie",
  },

  // LUXURY WEDDINGS & SANGEET RAIL
  {
    slot_id: "wed_rail_1",
    label: "Weddings Rail #1 — Electric Sangeet Night MC & Dance Cues",
    section: "weddings",
    sectionName: "Luxury Weddings",
    default_url: "/images/img_28.jpg",
    default_title: "Electric Sangeet Night MC & Dance Cues",
    default_type: "image",
    badge: "Crowd Favorite",
  },
  {
    slot_id: "wed_rail_2",
    label: "Weddings Rail #2 — Royal Varmala Direction & Sacred Entrance",
    section: "weddings",
    sectionName: "Luxury Weddings",
    default_url: "/images/img_01.jpg",
    default_title: "Royal Varmala Direction & Sacred Entrance",
    default_type: "image",
    badge: "Royalty",
  },
  {
    slot_id: "wed_rail_3",
    label: "Weddings Rail #3 — Sangeet Dance Battles & DJ Coordination",
    section: "weddings",
    sectionName: "Luxury Weddings",
    default_url: "/images/img_25.jpg",
    default_title: "Sangeet Dance Battles & DJ Coordination",
    default_type: "image",
    badge: "High Energy",
  },
  {
    slot_id: "wed_rail_4",
    label: "Weddings Rail #4 — Haldi & Mehendi Afternoon Fiesta",
    section: "weddings",
    sectionName: "Luxury Weddings",
    default_url: "/images/img_32.jpg",
    default_title: "Haldi & Mehendi Afternoon Fiesta",
    default_type: "image",
    badge: "Festive",
  },
  {
    slot_id: "wed_rail_5",
    label: "Weddings Rail #5 — Signature Family Games & Crowd Engagement",
    section: "weddings",
    sectionName: "Luxury Weddings",
    default_url: "/images/img_33.jpg",
    default_title: "Signature Family Games & Crowd Engagement",
    default_type: "image",
  },
  {
    slot_id: "wed_rail_6",
    label: "Weddings Rail #6 — Destination Wedding Reception Gala",
    section: "weddings",
    sectionName: "Luxury Weddings",
    default_url: "/images/img_17.jpg",
    default_title: "Destination Wedding Reception Gala",
    default_type: "image",
  },

  // SIGNATURE FAMILY GAMES
  {
    slot_id: "games_rail_1",
    label: "Family Games #1 — The Couple Roast & Shoe Game",
    section: "games",
    sectionName: "Family Games",
    default_url: "/images/img_33.jpg",
    default_title: "The Couple Roast & Shoe Game",
    default_type: "image",
    badge: "Hilarious",
  },
  {
    slot_id: "games_rail_2",
    label: "Family Games #2 — Grandparents' Antakshari Melodies",
    section: "games",
    sectionName: "Family Games",
    default_url: "/images/img_25.jpg",
    default_title: "Grandparents' Antakshari Melodies",
    default_type: "image",
    badge: "Emotional",
  },
  {
    slot_id: "games_rail_3",
    label: "Family Games #3 — Larkiwale vs. Ladkewale Dance Off",
    section: "games",
    sectionName: "Family Games",
    default_url: "/images/img_28.jpg",
    default_title: "Larkiwale vs. Ladkewale Dance Off",
    default_type: "image",
    badge: "Dance Battle",
  },
  {
    slot_id: "games_rail_4",
    label: "Family Games #4 — Table Relay & Rapid Trivia Rush",
    section: "games",
    sectionName: "Family Games",
    default_url: "/images/img_11.jpg",
    default_title: "Table Relay & Rapid Trivia Rush",
    default_type: "image",
    badge: "Interactive",
  },

  // ABOUT SECTION
  {
    slot_id: "about_portrait",
    label: "About Radhaa — Artist Dossier Portrait Photo",
    section: "about",
    sectionName: "About Section",
    default_url: "/images/img_01.jpg",
    default_title: "Radhaa Dudeja Official Stagecraft Portrait",
    default_type: "image",
  },

  // NEW CUSTOM VAULT ENTRY
  {
    slot_id: "custom_vault_item",
    label: "Master Video Vault — Add Custom Reel / Media Cut",
    section: "vault",
    sectionName: "Video Vault",
    default_url: "",
    default_title: "New Stage Performance Cut",
    default_type: "video",
  },
];

export function getSlotById(slotId: string): SiteSlotDefinition | undefined {
  return MASTER_SITE_SLOTS.find((s) => s.slot_id === slotId);
}

export function resolveSlotMedia(
  slotId: string,
  customMediaList: Array<{ slot_id: string; media_url: string; alt_text?: string; media_type?: "image" | "video"; badge?: string }>
) {
  const custom = customMediaList.find((m) => m.slot_id === slotId);
  const def = getSlotById(slotId);

  if (custom && custom.media_url) {
    return {
      url: custom.media_url,
      title: custom.alt_text || def?.default_title || "Stage Media",
      type: custom.media_type || def?.default_type || "image",
      badge: custom.badge || def?.badge,
      isCustom: true,
    };
  }

  return {
    url: def?.default_url || "/images/img_14.jpg",
    title: def?.default_title || "Stage Media",
    type: def?.default_type || "image",
    badge: def?.badge,
    isCustom: false,
  };
}
