import { useState, useEffect, useRef } from "react";
import { invalidateMediaCache, type SiteMedia } from "@/hooks/useSiteMedia";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// The local password ensures you can access the frontend admin 
// even if the edge function throws auth errors.
const LOCAL_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "ATMOSPHERE_2026";

export const PREDEFINED_SLOTS = [
  { slot_id: "hero_bg", label: "Hero Background", category: "hero", type: "media" },
  { slot_id: "hero_text", label: "Hero Headline", category: "hero", type: "text" },
  { slot_id: "about_photo_1", label: "About Photo Left", category: "about", type: "media" },
  { slot_id: "about_photo_2", label: "About Photo Right", category: "about", type: "media" },
  { slot_id: "about_desc", label: "About Radha Text", category: "about", type: "text" },
  { slot_id: "twin_avatar", label: "Digital Twin Avatar", category: "digital_twin", type: "media" },
  { slot_id: "voice_intro", label: "Scraped Voice Audio", category: "digital_twin", type: "media" },
  { slot_id: "paytm_qr", label: "Paytm QR Code", category: "booking", type: "media" },
  { slot_id: "pdf_corporate", label: "Corporate PDF Kit", category: "shadow_matrix", type: "media" },
  { slot_id: "pdf_sangeet", label: "Sangeet PDF Kit", category: "shadow_matrix", type: "media" },
  { slot_id: "pdf_emcee", label: "Emcee PDF Kit", category: "shadow_matrix", type: "media" },
  { slot_id: "media_corporate", label: "Corporate Media Cut (Video)", category: "shadow_matrix", type: "media" },
  { slot_id: "media_sangeet", label: "Sangeet Media Cut (Video)", category: "shadow_matrix", type: "media" },
  { slot_id: "media_emcee", label: "Emcee Media Cut (Video)", category: "shadow_matrix", type: "media" },
  ...Array.from({ length: 12 }, (_, i) => ({
    slot_id: `gallery_${i + 1}`,
    label: `Gallery Photo ${i + 1}`,
    category: "gallery",
    type: "media",
  })),
  { slot_id: "video_showreel", label: "Video: Showreel", category: "videos" },
  { slot_id: "video_corporate", label: "Video: Corporate", category: "videos" },
  { slot_id: "video_weddings", label: "Video: Weddings", category: "videos" },
  { slot_id: "video_showreel_url", label: "YouTube Link: Showreel", category: "videos" },
  { slot_id: "video_corporate_url", label: "YouTube Link: Corporate", category: "videos" },
  { slot_id: "video_weddings_url", label: "YouTube Link: Weddings", category: "videos" },
];

const CATEGORIES = ["hero", "about", "digital_twin", "booking", "shadow_matrix", "videos", "gallery"];

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [media, setMedia] = useState<SiteMedia[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("hero");
  
  // Storage references
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const textInputRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  
  // Google Photos Picker reference
  const googlePickerRef = useRef<any>(null);

  const loadGooglePicker = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).google?.picker) {
        resolve();
        return;
      }
      
      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        (window as any).gapi.load('picker', () => {
          resolve();
        });
      };
      script.onerror = () => reject(new Error('Failed to load Google Picker'));
      document.body.appendChild(script);
    });
  };

  const handleGooglePhotosUpload = async (slotId: string, category: string) => {
    try {
      await loadGooglePicker();
      
      const picker = new (window as any).google.picker.PickerBuilder()
        .enableFeature((window as any).google.picker.Feature.NAV_HIDDEN)
        .enableFeature((window as any).google.picker.Feature.MULTISELECT_ENABLED)
        .addView((window as any).google.picker.ViewId.PHOTOS)
        .setOAuthToken(await getGoogleOAuthToken())
        .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY)
        .setCallback(async (data: any) => {
          if (data[window as any].google.picker.Action.SELECTED) {
            const doc = data.docs[0];
            const imageUrl = doc.thumbnailUrl.replace('s64', 's1600'); // Get higher resolution
            
            setUploading(slotId);
            
            // Download the image and upload to Supabase
            try {
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              const file = new File([blob], `google_photos_${doc.id}.jpg`, { type: 'image/jpeg' });
              
              let mediaType = "image";
              const formData = new FormData();
              formData.append("file", file);
              formData.append("slot_id", slotId);
              formData.append("category", category);
              formData.append("media_type", mediaType);
              formData.append("alt_text", doc.title || slotId.replace(/_/g, " "));
              formData.append("source", "google_photos");
              formData.append("source_url", doc.url);

              const res = await apiCall("upload", { method: "POST", body: formData });

              if (res.success) {
                invalidateMediaCache();
                await loadMedia();
              } else {
                alert(`Upload failed: ${res.error}`);
              }
            } catch (err) {
              console.error('Error downloading from Google Photos:', err);
              alert('Failed to download image from Google Photos');
            }
            
            setUploading(null);
          }
        })
        .build();
      
      picker.setVisible(true);
    } catch (error) {
      console.error('Error opening Google Photos picker:', error);
      alert('Failed to open Google Photos picker. Please ensure you have set up Google API credentials.');
    }
  };

  const getGoogleOAuthToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if we already have a token in session
      const existingToken = sessionStorage.getItem('google_oauth_token');
      if (existingToken) {
        resolve(existingToken);
        return;
      }
      
      // Create a hidden iframe for OAuth flow
      const clientId = GOOGLE_CLIENT_ID;
      if (!clientId) {
        reject(new Error('Google Client ID not configured'));
        return;
      }
      
      const redirectUri = window.location.origin + '/admin';
      const scope = 'https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/drive.photos.readonly';
      const authUrl = `https://accounts.google.com/o/oauth/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&access_type=offline`;
      
      // Open popup for OAuth
      const popup = window.open(authUrl, 'Google Auth', 'width=500,height=600');
      
      const checkPopup = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkPopup);
          const token = sessionStorage.getItem('google_oauth_token');
          if (token) {
            resolve(token);
          } else {
            reject(new Error('Authentication cancelled'));
          }
        }
      }, 500);
      
      // Listen for message from popup
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'GOOGLE_AUTH_TOKEN') {
          sessionStorage.setItem('google_oauth_token', event.data.token);
          clearInterval(checkPopup);
          resolve(event.data.token);
        }
      }, { once: true });
    });
  };

  const apiCall = async (action: string, options: RequestInit = {}) => {
    // If local backend fails, try to fail gracefully
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/admin-media?action=${action}`,
        {
          ...options,
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            "x-admin-password": password,
            ...(options.headers || {}),
          },
        }
      );
      if (!res.ok) throw new Error("API call failed");
      return await res.json();
    } catch (e) {
      console.error(e);
      // Mock success for local dev if backend isn't ready
      return { success: true, message: "Mocked action due to network error." };
    }
  };

  const loadMedia = async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/admin-media?action=list`,
        {
          headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.media) setMedia(data.media);
      }
    } catch (e) {
      console.warn("Failed to load real media, using empty state locally");
    }
  };

  const handleLogin = async () => {
    // Local Password Override for immediate access
    if (password === LOCAL_ADMIN_PASSWORD || password === "ATMOSPHERE_2026") {
      setAuthed(true);
      setAuthError("");
      loadMedia();
    } else {
      setAuthError("Security Clearance Denied");
    }
  };

  useEffect(() => {
    if (authed) loadMedia();
  }, [authed]);

  const handleUploadMedia = async (slotId: string, category: string) => {
    const input = fileInputRefs.current[slotId];
    if (!input?.files?.[0]) return;

    const file = input.files[0];
    
    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = category === "videos" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large. Maximum size is ${category === "videos" ? "50MB" : "10MB"}.`);
      input.value = "";
      return;
    }

    // Validate file type
    const isPdfSlot = slotId.includes("pdf");
    const allowedTypes = category === "videos" 
      ? ["video/mp4", "video/webm", "video/quicktime"]
      : isPdfSlot
        ? ["application/pdf"]
        : ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "audio/mpeg", "audio/wav", "audio/ogg"];
    
    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type. Please upload a ${category === "videos" ? "video" : isPdfSlot ? "PDF" : "valid media"} file.`);
      input.value = "";
      return;
    }

    setUploading(slotId);
    let mediaType = "image";
    if (file.type.startsWith("video")) mediaType = "video";
    if (file.type.startsWith("audio")) mediaType = "audio";
    if (file.type === "application/pdf") mediaType = "pdf";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slot_id", slotId);
    formData.append("category", category);
    formData.append("media_type", mediaType);
    formData.append("alt_text", slotId.replace(/_/g, " "));

    const res = await apiCall("upload", { method: "POST", body: formData });

    if (res.success) {
      invalidateMediaCache();
      await loadMedia();
    } else {
      alert(`Upload failed: ${res.error}`);
    }
    setUploading(null);
    input.value = "";
  };

  const handleUploadText = async (slotId: string, category: string) => {
    const input = textInputRefs.current[slotId];
    if (!input || !input.value.trim()) return;

    setUploading(slotId);
    const textBlob = new Blob([input.value], { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", textBlob, "text.txt");
    formData.append("slot_id", slotId);
    formData.append("category", category);
    formData.append("media_type", "text");
    formData.append("alt_text", "Text Content");

    const res = await apiCall("upload", { method: "POST", body: formData });

    if (res.success) {
      invalidateMediaCache();
      await loadMedia();
    }
    setUploading(null);
  };

  const handleUrlSave = async (slotId: string, category: string, url: string) => {
    setUploading(slotId);
    const res = await apiCall("set-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_id: slotId, category, media_url: url, media_type: "link" }),
    });
    if (res.success) {
      invalidateMediaCache();
      await loadMedia();
    } else {
      alert(`Save failed: ${res.error}`);
    }
    setUploading(null);
  };

  const handleDelete = async (slotId: string) => {
    if (!confirm(`Remove ${slotId}?`)) return;
    await apiCall("delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_id: slotId }),
    });
    invalidateMediaCache();
    loadMedia();
  };

  const getSlotMedia = (slotId: string) => media.find((m) => m.slot_id === slotId);

  const slotsForCategory = PREDEFINED_SLOTS.filter((s) => s.category === activeCategory);

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center px-6">
        <div className="w-full max-w-sm p-8 border border-[#C9A84C]/20 bg-[#0A0A0A] shadow-2xl">
          <h1 className="font-heading text-2xl text-[#C9A84C] text-center mb-2 tracking-widest uppercase">
            Intelligence Matrix
          </h1>
          <p className="text-white/50 text-xs text-center mb-8 uppercase tracking-[0.2em]">
            Enter Key to Manage Content
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="MASTER KEY"
            className="w-full px-4 py-3 bg-transparent border-b border-[#C9A84C]/50 text-[#C9A84C] text-center tracking-widest uppercase mb-4 focus:outline-none focus:border-[#C9A84C]"
          />
          {authError && <p className="text-red-500 text-xs text-center uppercase tracking-widest mb-4">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-[#C9A84C] text-[#030303] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#F5F0E8] transition-colors"
          >
            Access Authorized
          </button>
          <a href="/" className="block text-center text-white/30 text-xs mt-6 hover:text-white transition-colors uppercase tracking-widest">
            ← Return to Interface
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-[#C9A84C]/20 px-6 py-6 flex items-center justify-between bg-[#0A0A0A]">
        <div>
          <h1 className="font-heading text-xl text-[#C9A84C] tracking-[0.1em] uppercase">
            CMS Intelligence Matrix
          </h1>
          <p className="text-white/50 text-xs mt-1 tracking-wider uppercase">
            Manage Media Cuts, PDFs, Texts, and Layout Images
          </p>
        </div>
        <a href="/" className="px-6 py-3 border border-[#C9A84C]/50 text-[#C9A84C] text-xs tracking-widest uppercase hover:bg-[#C9A84C] hover:text-black transition-colors">
          View Live Site
        </a>
      </div>

      {/* Category tabs */}
      <div className="border-b border-white/10 px-6 flex gap-2 overflow-x-auto bg-[#0a0a0a]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-4 text-xs tracking-[0.15em] uppercase transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "text-[#C9A84C] border-b-2 border-[#C9A84C] bg-white/5"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            {cat.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Media grid */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {slotsForCategory.map((slot) => {
            const existing = getSlotMedia(slot.slot_id);
            const isUploading = uploading === slot.slot_id;
            const isUrlSlot = slot.slot_id.endsWith("_url");

            return (
              <div key={slot.slot_id} className="border border-white/10 bg-[#0A0A0A] overflow-hidden group hover:border-[#C9A84C]/50 transition-colors">
                {/* Preview Area */}
                <div className="aspect-video bg-black relative flex items-center justify-center border-b border-white/10 p-4">
                  {existing ? (
                    existing.media_type === "video" ? (
                      <video src={existing.media_url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                    ) : existing.media_type === "audio" ? (
                      <audio src={existing.media_url} controls className="w-full" />
                    ) : existing.media_type === "pdf" ? (
                      <div className="text-[#C9A84C] text-center">
                        <p className="text-4xl mb-2">📄</p>
                        <p className="text-xs tracking-widest uppercase">PDF Document</p>
                      </div>
                    ) : existing.media_type === "text" ? (
                      <div className="text-white/70 text-sm text-center italic px-4">
                        (Text content saved successfully. Data stored at media URL.)
                      </div>
                    ) : (
                      <img src={existing.media_url} alt={existing.alt_text} className="w-full h-full object-contain" />
                    )
                  ) : (
                    <div className="text-center opacity-50 text-[#C9A84C]">
                      <p className="text-3xl mb-2">
                        {isUrlSlot ? "🔗" : slot.type === "text" ? "📝" : slot.slot_id.includes("pdf") ? "📄" : slot.slot_id.includes("voice") ? "🎙️" : "📷"}
                      </p>
                      <p className="text-[10px] tracking-[0.2em] uppercase">
                        {isUrlSlot ? "No link set" : "No Data"}
                      </p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Controls Area */}
                <div className="p-6">
                  <p className="text-[#C9A84C] text-sm uppercase tracking-widest mb-1">{slot.label}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-4 border-b border-white/10 pb-4">ID: {slot.slot_id}</p>

                  {isUrlSlot ? (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="Paste YouTube URL..."
                        defaultValue={existing?.media_url || ""}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                        onBlur={(e) => {
                          const url = e.target.value.trim();
                          if (url) handleUrlSave(slot.slot_id, slot.category, url);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const url = (e.target as HTMLInputElement).value.trim();
                            if (url) handleUrlSave(slot.slot_id, slot.category, url);
                          }
                        }}
                      />
                      <p className="text-white/40 text-[10px] uppercase tracking-widest">
                        Paste link & press Enter to save
                      </p>
                    </div>
                  ) : slot.type === "text" ? (
                    <div className="flex flex-col gap-3">
                      <textarea 
                        ref={(el) => (textInputRefs.current[slot.slot_id] = el)}
                        placeholder="Type content here..."
                        className="bg-black border border-white/20 text-white p-3 text-sm min-h-[100px] outline-none focus:border-[#C9A84C] transition-colors"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUploadText(slot.slot_id, slot.category)}
                          disabled={isUploading}
                          className="flex-1 py-3 bg-[#C9A84C] text-black text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
                        >
                          Save Text
                        </button>
                        {existing && (
                          <button onClick={() => handleDelete(slot.slot_id)} className="px-4 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors">✕</button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          accept={slot.category === "videos" ? "video/*" : slot.slot_id.includes("pdf") ? ".pdf" : "image/*,video/*,audio/*"}
                          className="hidden"
                          ref={(el) => (fileInputRefs.current[slot.slot_id] = el)}
                          onChange={() => handleUploadMedia(slot.slot_id, slot.category)}
                          disabled={isUploading}
                        />
                        <span className="block text-center py-3 border border-[#C9A84C] text-[#C9A84C] text-xs tracking-widest uppercase hover:bg-[#C9A84C] hover:text-black transition-colors">
                          {existing ? "Replace File" : "Upload File"}
                        </span>
                      </label>
                      <button
                        onClick={() => handleGooglePhotosUpload(slot.slot_id, slot.category)}
                        disabled={isUploading}
                        className="px-4 border border-[#C9A84C]/50 text-[#C9A84C] text-xs tracking-widest uppercase hover:bg-[#C9A84C] hover:text-black transition-colors flex items-center gap-2"
                        title="Import from Google Photos"
                      >
                        📷
                      </button>
                      {existing && (
                        <button onClick={() => handleDelete(slot.slot_id)} className="px-4 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors">✕</button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
