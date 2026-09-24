import { useState, useEffect, useCallback } from "react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: "Weddings & Sangeet" | "Corporate Events" | "Anchor & Emcee Tips" | "Behind the Scenes";
  excerpt: string;
  content: string;
  cover_image: string;
  read_time: string;
  author: string;
  author_role: string;
  published_date: string;
  tags: string[];
  featured?: boolean;
  meta_description?: string;
}

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-sangeet-playbook",
    slug: "how-to-host-a-sangeet-till-3am",
    title: "How to Host a Sangeet That Keeps Guests Dancing Until 3 AM: The Anchor's Playbook",
    category: "Weddings & Sangeet",
    excerpt: "The secret to an unforgettable Sangeet isn't just a loud sound system—it's energy pacing, spontaneous crowd engagement, and knowing when to ignite the floor.",
    cover_image: "/images/img_28.jpg",
    read_time: "5 min read",
    author: "Radhaa Dudeja",
    author_role: "Premier Anchor & Corporate Emcee",
    published_date: "September 2026",
    tags: ["Sangeet", "Wedding Entertainment", "Dance Battles", "Crowd Pacing"],
    featured: true,
    meta_description: "Expert tips by premier wedding anchor Radhaa Dudeja on hosting a high-energy Sangeet night with dance battles, crowd games, and DJ synergy.",
    content: `
### The Myth of the "Polite" Sangeet

Every bride and groom envisions their Sangeet as the electric highlight of their wedding week. Yet, we've all been to events where performances lag, uncle and aunties drift toward the buffet, and the room loses its momentum before the party even begins.

After anchoring hundreds of luxury destination weddings across Jaipur, Udaipur, Goa, and Delhi NCR, here is my definitive blueprint for keeping 500+ guests cheering, laughing, and dancing well past 3 AM.

---

### 1. The Golden 45-Minute Window
Performances should never drag on for two continuous hours. Divide the evening into focused blocks:
* **The Warm-Up Act (15 mins):** Welcoming guests, playful light-hearted banter with both families, and establishing the vibe.
* **The Core Showcase (45 mins max):** Curate family choreographies in tight 2-3 minute edits. No 8-minute solos!
* **The Transition Spark:** The moment choreographed dances end, the anchor must immediately bridge the stage with the dance floor.

---

### 2. The Power of Friendly "Ladkewale vs. Ladkiwale" Rivalry
Nothing mobilizes an audience faster than healthy competition. When you introduce playful dance-offs, impromptu hook-step challenges, and spontaneous roasts between the bride's squad and the groom's groomsmen, the entire room is invested.

> "A great emcee is never the star of the night—they are the catalyst that makes the families shine like stars."

---

### 3. Seamless Synergy with the DJ & Dhol Players
A live anchor and the DJ must operate as one single heartbeat. We coordinate visual cues, sudden bass drops, and crowd-swarming moments with the dholis so that dead air literally cannot exist.

---

### 4. Interactive Icebreakers for Reluctant Dancers
Not everyone loves dancing right away. That's where signature games—like the Rapid-Fire Couple Quiz or Musical Chair Relay with hilarious rules—pull even the most reserved corporate uncles right into the center of the action.

*Planning your dream destination wedding? Connect with Radhaa Dudeja to curate an unforgettable celebration.*
    `.trim(),
  },
  {
    id: "blog-corporate-blueprint",
    slug: "executive-emcee-blueprint-tech-summits",
    title: "The Executive Emcee Blueprint: Elevating Tech Summits & Fortune 500 Galas",
    category: "Corporate Events",
    excerpt: "Why Fortune 500 enterprises need more than a voice with a microphone: Master teleprompters, fireside moderations, and VIP speaker time delays with executive poise.",
    cover_image: "/images/img_14.jpg",
    read_time: "6 min read",
    author: "Radhaa Dudeja",
    author_role: "Premier Anchor & Corporate Emcee",
    published_date: "September 2026",
    tags: ["Corporate Events", "Tech Summits", "CXO Moderation", "Award Galas"],
    featured: true,
    meta_description: "How top corporate emcee Radhaa Dudeja manages multi-day leadership conclaves, CXO panel discussions, teleprompters, and zero dead air.",
    content: `
### Elevating the Corporate Stage

In high-stakes corporate conferences, every minute has a measurable ROI. When 1,000 delegates, international guests, and C-suite leaders gather, the emcee is the single thread holding the entire agenda together.

Here is how an executive corporate emcee transforms a formal schedule into a compelling brand experience.

---

### 1. Flawless Protocol & Pronunciation Mastery
Whether introducing a Cabinet Minister, an AI visionary from Silicon Valley, or a Fortune 500 CEO, accurate pronunciation of names, designations, and corporate milestones is non-negotiable. Preparation begins days before rehearsal.

---

### 2. Managing The "VIP Delayed" Crisis with Zero Dead Air
Live events are unpredictable. A speaker gets caught in airport traffic, a presentation slide fails to load, or audio requires a 3-minute patch. 
An amateur freezes or repeats "we will be back shortly."
An executive anchor immediately engages the audience:
* Summarizes key insights from the previous speaker.
* Polls the audience on emerging industry trends.
* Seamlessly bridges into an interactive Q&A without guests ever realizing a technical hiccup occurred.

---

### 3. Impeccable Pacing for Award Galas
Nothing dampens an awards evening like a 90-minute repetitive trophy procession. Maintaining high energy, varying vocal inflections, and keeping winners moving swiftly onto and off the stage ensures the gala ends on a triumphant crescendo.

> "Elegance is not about being noticed; it is about being remembered for creating seamless perfection."
    `.trim(),
  },
  {
    id: "blog-family-games",
    slug: "10-interactive-family-games-destination-weddings",
    title: "10 Signature Interactive Family Games That Break the Ice at Destination Weddings",
    category: "Weddings & Sangeet",
    excerpt: "Ditch the boring speeches! Discover the top signature icebreaker games designed to connect both families across all generations effortlessly.",
    cover_image: "/images/img_33.jpg",
    read_time: "4 min read",
    author: "Radhaa Dudeja",
    author_role: "Premier Anchor & Corporate Emcee",
    published_date: "August 2026",
    tags: ["Family Games", "Icebreakers", "Haldi Fiesta", "Wedding Fun"],
    featured: false,
    meta_description: "Top 10 wedding games by Radhaa Dudeja that bring grandparents, cousins, and in-laws together in non-awkward, hilarious laughter.",
    content: `
### Bringing Two Families Together

Destination weddings are magic because they bring two distinct worlds into one shared celebration. But on Day 1, guests are often polite and cautious.

Here are 5 of our most requested signature family games that shatter the ice in under 20 minutes:

---

### 1. The "Whose Lie Is It Anyway?" Couple Roast
The couple sits back-to-back with their shoes. But instead of standard questions like "Who takes longer to get ready?", we dig deeper:
* "Who was more nervous on the first phone call?"
* "Who would survive longer on a deserted island with only Maggi?"
The crowd votes with flags, and the banter is always side-splitting.

---

### 2. The Generation Bollywood Antakshari
We pit Gen-Z cousins against the Golden Era Uncles & Aunts. When a 75-year-old grandfather belts out a classic Kishore Kumar track with full swagger, the emotional warmth in the room is unmatched.

---

### 3. The Runway Walk-Off
A mock fashion runway down the Sangeet ramp where the groom's mamas face off against the bride's chachis in high-energy Bollywood poses.

*Want these custom games tailored to your family's unique inside jokes? Book Radhaa Dudeja for your wedding.*
    `.trim(),
  },
  {
    id: "blog-stage-confidence",
    slug: "zero-dead-air-how-anchors-handle-live-glitches",
    title: "Zero Dead Air: How Professional Anchors Handle Audio Glitches & Stage Delays",
    category: "Anchor & Emcee Tips",
    excerpt: "Behind the microphone: The psychology of stage presence, vocal projection, and turning unexpected live hiccups into charming memorable moments.",
    cover_image: "/images/img_25.jpg",
    read_time: "5 min read",
    author: "Radhaa Dudeja",
    author_role: "Premier Anchor & Corporate Emcee",
    published_date: "July 2026",
    tags: ["Stage Presence", "Public Speaking", "Anchor Tips", "Live Events"],
    featured: false,
    meta_description: "Learn how professional emcees maintain composure, vocal stamina, and audience control when live event technical failures happen.",
    content: `
### What Happens When The Mic Cuts Out?

Every anchor has had that heart-stopping moment: 1,500 people staring at you, and the microphone suddenly dies. Or the stage lights black out.

Your response in those first 4 seconds defines whether the event loses its authority or rallies around your leadership.

---

### 1. Never Show Panic in Your Posture
Audiences mirror the anchor's nervous system. If you fidget or look anxiously toward the sound console, the audience gets anxious. If you smile, expand your posture, and project your voice naturally, the crowd understands you are in absolute command.

---

### 2. Turn Technical Glitches into Human Moments
"I guess our sound engineers wanted to test if my natural voice can reach the last row without digital help—can you hear me in the back?!"
A quick, self-deprecating line instantly converts an awkward technical error into audience applause.

---

### 3. The Power of Breathing & Eye Contact
Stage presence isn't loud volume—it is grounded stillness. Connecting with individual eyes in the audience creates an intimate bond that commands undivided respect.
    `.trim(),
  },
];

const LOCAL_STORAGE_BLOGS_KEY = "radha_site_blogs_v1";

export function getLocalBlogs(): BlogPost[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BLOGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_BLOGS_KEY, JSON.stringify(SEED_BLOG_POSTS));
      return SEED_BLOG_POSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_BLOG_POSTS;
  } catch {
    return SEED_BLOG_POSTS;
  }
}

export function saveLocalBlogs(blogs: BlogPost[]): BlogPost[] {
  try {
    localStorage.setItem(LOCAL_STORAGE_BLOGS_KEY, JSON.stringify(blogs));
    return blogs;
  } catch (e) {
    console.error("Failed to save blogs locally", e);
    return getLocalBlogs();
  }
}

export function useBlog() {
  const [blogs, setBlogs] = useState<BlogPost[]>(getLocalBlogs());

  useEffect(() => {
    setBlogs(getLocalBlogs());

    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_BLOGS_KEY) {
        setBlogs(getLocalBlogs());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getBlogBySlug = useCallback(
    (slug: string): BlogPost | undefined => {
      return blogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase() || b.id === slug);
    },
    [blogs]
  );

  const addOrUpdateBlog = useCallback(
    (post: Partial<BlogPost> & { title: string }) => {
      const slug =
        post.slug ||
        post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const newPost: BlogPost = {
        id: post.id || `blog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        slug,
        title: post.title,
        category: post.category || "Anchor & Emcee Tips",
        excerpt: post.excerpt || post.content?.slice(0, 150) + "..." || "",
        content: post.content || "",
        cover_image: post.cover_image || "/images/img_14.jpg",
        read_time: post.read_time || "4 min read",
        author: post.author || "Radhaa Dudeja",
        author_role: post.author_role || "Premier Anchor & Corporate Emcee",
        published_date: post.published_date || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        tags: post.tags || ["Live Events"],
        featured: post.featured || false,
        meta_description: post.meta_description || post.excerpt,
      };

      setBlogs((prev) => {
        const existingIdx = prev.findIndex((b) => b.id === newPost.id || b.slug === newPost.slug);
        let updated: BlogPost[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = newPost;
        } else {
          updated = [newPost, ...prev];
        }
        saveLocalBlogs(updated);
        return updated;
      });
      return newPost;
    },
    []
  );

  const deleteBlog = useCallback((idOrSlug: string) => {
    setBlogs((prev) => {
      const updated = prev.filter((b) => b.id !== idOrSlug && b.slug !== idOrSlug);
      saveLocalBlogs(updated);
      return updated;
    });
  }, []);

  const resetBlogs = useCallback(() => {
    saveLocalBlogs(SEED_BLOG_POSTS);
    setBlogs(SEED_BLOG_POSTS);
  }, []);

  return {
    blogs,
    getBlogBySlug,
    addOrUpdateBlog,
    deleteBlog,
    resetBlogs,
  };
}
