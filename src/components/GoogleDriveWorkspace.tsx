import React, { useState, useMemo } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  File,
  Image as ImageIcon,
  Video as VideoIcon,
  ExternalLink,
  Trash2,
  RefreshCw,
  LogOut,
  Search,
  Check,
  Plus,
  Cloud,
  HardDrive,
  Download,
  Upload,
  X,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { MASTER_SITE_SLOTS, getSlotById } from "@/lib/siteSlots";
import { parseGoogleDriveUrl, type SiteMedia } from "@/hooks/useSiteMedia";
import MediaCropAndTrimStudio, { type MediaCropTrimConfig } from "./MediaCropAndTrimStudio";

export interface DriveItem {
  id: string;
  name: string;
  type: "folder" | "image" | "video" | "document";
  date: string;
  size?: string;
  url?: string;
  parentId?: string | null;
  description?: string;
  previewUrl?: string;
  slotId?: string;
}

const INITIAL_DRIVE_ITEMS: DriveItem[] = [
  // Top-Level Folders exactly from user's screenshot
  {
    id: "f_lg_corporate",
    name: "lg_corporate",
    type: "folder",
    date: "9/14/2026",
    parentId: null,
    description: "Corporate conclaves, tech summits, leadership keynotes, Fortune 500 stagecraft",
  },
  {
    id: "f_tiger_trees",
    name: "Tiger & trees",
    type: "folder",
    date: "5/13/2025",
    parentId: null,
    description: "Jim Corbett destination resort weddings, forest lawn galas, live band setups",
  },
  {
    id: "f_deluxe",
    name: "Deluxe",
    type: "folder",
    date: "5/12/2025",
    parentId: null,
    description: "Deluxe banquet stage setups, VIP speaker green rooms, tech soundchecks",
  },
  {
    id: "f_premium_cottage",
    name: "Premium cottage",
    type: "folder",
    date: "5/12/2025",
    parentId: null,
    description: "Sangeet night rehearsal clips, bride & groom entrance choreography",
  },
  {
    id: "f_hut_cottage",
    name: "Hut cottage",
    type: "folder",
    date: "5/12/2025",
    parentId: null,
    description: "Haldi & Mehendi afternoon fiesta, Phoolon Ki Holi photos, Punjabi dhol moments",
  },
  {
    id: "f_luxury_jacuzzi",
    name: "Luxury with jacuzzi",
    type: "folder",
    date: "5/12/2025",
    parentId: null,
    description: "Royal evening reception, couple roast battles, after-party dance floor cuts",
  },

  // Files inside lg_corporate
  {
    id: "file_corp_1",
    name: "National_Tech_Leadership_Summit_Showreel_2026.mp4",
    type: "video",
    date: "9/14/2026",
    size: "148 MB",
    url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    parentId: "f_lg_corporate",
    description: "Fortune 500 keynote moderation and fireside pacing",
    slotId: "corp_rail_1",
  },
  {
    id: "file_corp_2",
    name: "Brand_Launch_Keynote_Reveal_Gala.jpg",
    type: "image",
    date: "9/14/2026",
    size: "8.4 MB",
    url: "/images/img_06.jpg",
    parentId: "f_lg_corporate",
    description: "Stage reveal with dramatic lighting cues",
    slotId: "corp_rail_2",
  },
  {
    id: "file_corp_3",
    name: "Fortune_500_Annual_Excellence_Awards.jpg",
    type: "image",
    date: "9/14/2026",
    size: "6.2 MB",
    url: "/images/img_11.jpg",
    parentId: "f_lg_corporate",
    description: "Black-tie awards evening coordination",
    slotId: "corp_rail_3",
  },
  {
    id: "file_corp_4",
    name: "Executive_Leadership_Fireside_Moderation.jpg",
    type: "image",
    date: "9/14/2026",
    size: "7.1 MB",
    url: "/images/img_20.jpg",
    parentId: "f_lg_corporate",
    description: "Bilingual conversation with CXOs and industry titans",
    slotId: "corp_rail_4",
  },
  {
    id: "file_corp_doc",
    name: "Radhaa_Dudeja_Corporate_Stage_Rider_2026.pdf",
    type: "document",
    date: "9/14/2026",
    size: "1.4 MB",
    url: "#",
    parentId: "f_lg_corporate",
    description: "Official AV requirements, prompter tech, mic preferences",
  },

  // Files inside Tiger & trees (Corbett Destination Wedding)
  {
    id: "file_tiger_1",
    name: "Royal_Varmala_Storytelling_Entrance.jpg",
    type: "image",
    date: "5/13/2025",
    size: "9.6 MB",
    url: "/images/img_01.jpg",
    parentId: "f_tiger_trees",
    description: "Cinematic Hindi & English couple entrance narrative",
    slotId: "wed_rail_2",
  },
  {
    id: "file_tiger_2",
    name: "Electric_Sangeet_Night_MC_Dance_Battle.jpg",
    type: "image",
    date: "5/13/2025",
    size: "8.1 MB",
    url: "/images/img_28.jpg",
    parentId: "f_tiger_trees",
    description: "Groom side vs Bride side dance faceoff",
    slotId: "wed_rail_1",
  },
  {
    id: "file_tiger_doc",
    name: "Jim_Corbett_3Day_Wedding_Run_Of_Show.pdf",
    type: "document",
    date: "5/13/2025",
    size: "2.8 MB",
    url: "#",
    parentId: "f_tiger_trees",
    description: "Minute-by-minute itinerary for Mehendi, Sangeet & Pheras",
  },

  // Files inside Hut cottage (Haldi & Family Games)
  {
    id: "file_hut_1",
    name: "Haldi_Phoolon_Ki_Holi_Afternoon.jpg",
    type: "image",
    date: "5/12/2025",
    size: "7.8 MB",
    url: "/images/img_32.jpg",
    parentId: "f_hut_cottage",
    description: "High-energy afternoon festivities and floral shower",
    slotId: "wed_rail_4",
  },
  {
    id: "file_hut_2",
    name: "Signature_Couple_Roast_And_Shoe_Game.jpg",
    type: "image",
    date: "5/12/2025",
    size: "8.3 MB",
    url: "/images/img_33.jpg",
    parentId: "f_hut_cottage",
    description: "Interactive comedy game with both families laughing together",
    slotId: "games_rail_1",
  },
  {
    id: "file_hut_3",
    name: "Grandparents_Antakshari_Melodies.jpg",
    type: "image",
    date: "5/12/2025",
    size: "6.9 MB",
    url: "/images/img_25.jpg",
    parentId: "f_hut_cottage",
    description: "Heartwarming cross-generational musical session",
    slotId: "games_rail_2",
  },

  // Files inside Luxury with jacuzzi
  {
    id: "file_jacuzzi_1",
    name: "Destination_Wedding_Reception_Gala.jpg",
    type: "image",
    date: "5/12/2025",
    size: "9.2 MB",
    url: "/images/img_17.jpg",
    parentId: "f_luxury_jacuzzi",
    description: "Grand reception with live violinists and champagne toast",
    slotId: "wed_rail_6",
  },

  // Root Level Documents & Showreels
  {
    id: "file_root_doc",
    name: "Radhaa_Dudeja_Executive_Artist_Dossier_2026.pdf",
    type: "document",
    date: "9/15/2026",
    size: "4.5 MB",
    url: "#",
    parentId: null,
    description: "Comprehensive credentials, client testimonials, fee schedule",
  },
  {
    id: "file_root_video",
    name: "Master_Billboard_Showreel_Curated.mp4",
    type: "video",
    date: "9/15/2026",
    size: "210 MB",
    url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    parentId: null,
    description: "Live stage performance master cut",
    slotId: "hero_billboard",
  },
];

interface GoogleDriveWorkspaceProps {
  onAssignToSlot?: (
    slotId: string,
    mediaUrl: string,
    title: string,
    type: "image" | "video",
    trimFramingConfig?: MediaCropTrimConfig
  ) => Promise<void>;
  onClose?: () => void;
  className?: string;
  defaultSlotId?: string;
}

export default function GoogleDriveWorkspace({
  onAssignToSlot,
  onClose,
  className = "",
  defaultSlotId = "corp_rail_1",
}: GoogleDriveWorkspaceProps) {
  const [items, setItems] = useState<DriveItem[]>(INITIAL_DRIVE_ITEMS);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Documents" | "Images" | "Videos" | "Folders">("All");

  // Slot Assignment Modal state
  const [assigningItem, setAssigningItem] = useState<DriveItem | null>(null);
  const [targetSlotId, setTargetSlotId] = useState<string>(defaultSlotId);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [cropTrimConfig, setCropTrimConfig] = useState<MediaCropTrimConfig>({
    clipStart: 0,
    clipEnd: 30,
    aspectRatio: "16/9",
    focalPoint: "top",
    fitMode: "cover",
  });

  // New Link modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkType, setNewLinkType] = useState<"folder" | "image" | "video" | "document">("folder");

  // Backup state
  const [backupStatus, setBackupStatus] = useState<"idle" | "backing_up" | "done">("idle");

  // Current folder object
  const currentFolder = useMemo(() => {
    return items.find((i) => i.id === currentFolderId && i.type === "folder");
  }, [items, currentFolderId]);

  // Filtered Items
  const displayedItems = useMemo(() => {
    let result = items;

    // Filter by Folder hierarchy
    if (searchQuery.trim()) {
      // Global search across all folders if searching
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q))
      );
    } else {
      result = result.filter((i) => i.parentId === currentFolderId);
    }

    // Filter by Type
    if (activeFilter === "Folders") {
      result = result.filter((i) => i.type === "folder");
    } else if (activeFilter === "Documents") {
      result = result.filter((i) => i.type === "document");
    } else if (activeFilter === "Images") {
      result = result.filter((i) => i.type === "image");
    } else if (activeFilter === "Videos") {
      result = result.filter((i) => i.type === "video");
    }

    return result;
  }, [items, currentFolderId, searchQuery, activeFilter]);

  const handleBackupSiteToDrive = () => {
    setBackupStatus("backing_up");
    setTimeout(() => {
      // Create backup manifest
      const backupData = {
        timestamp: new Date().toISOString(),
        brand: "Radhaa Dudeja",
        account: "radhadudeja514@gmail.com",
        slots: MASTER_SITE_SLOTS.map((s) => ({
          slot_id: s.slot_id,
          label: s.label,
          section: s.section,
        })),
        driveFolders: items.filter((i) => i.type === "folder").map((f) => f.name),
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Radhaa_Dudeja_Drive_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setBackupStatus("done");
      setTimeout(() => setBackupStatus("idle"), 3500);
    }, 1200);
  };

  const handleConfirmAssignment = async () => {
    if (!assigningItem || !assigningItem.url) return;
    try {
      if (onAssignToSlot) {
        await onAssignToSlot(
          targetSlotId,
          assigningItem.url,
          assigningItem.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          assigningItem.type === "video" ? "video" : "image",
          cropTrimConfig
        );
      }
      const slotDef = getSlotById(targetSlotId);
      setAssignSuccess(`Assigned to ${slotDef?.label || targetSlotId}!`);
      setTimeout(() => {
        setAssignSuccess(null);
        setAssigningItem(null);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkName.trim()) return;

    let finalUrl = newLinkUrl.trim();
    if (newLinkType === "image" || newLinkType === "video") {
      finalUrl = parseGoogleDriveUrl(finalUrl, newLinkType);
    }

    const newItem: DriveItem = {
      id: `drive_custom_${Date.now()}`,
      name: newLinkName.trim(),
      type: newLinkType,
      date: new Date().toLocaleDateString(),
      url: finalUrl,
      parentId: currentFolderId,
      description: "Added to workspace from Google Drive link",
      size: newLinkType === "folder" ? undefined : "Cloud File",
    };

    setItems([newItem, ...items]);
    setNewLinkName("");
    setNewLinkUrl("");
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Remove this item from your Google Drive workspace view?")) {
      setItems(items.filter((i) => i.id !== id && i.parentId !== id));
    }
  };

  return (
    <div
      className={`bg-[#141414] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER EXACTLY AS IN USER'S SCREENSHOT */}
      <div className="flex items-start justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          {/* Green Hard Drive / Cloud Icon */}
          <div className="w-11 h-11 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40">
            <HardDrive className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                Google Drive Workspace
              </h3>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Official IP Integration
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
              Sync event riders, Jim Corbett run-of-show files, high-res stage photos, and cloud backups with permission.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close Workspace"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* CONNECTED ACCOUNT PROFILE BAR */}
      <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
        <div className="flex items-center gap-3">
          {/* Avatar Circle with Capital R */}
          <div className="w-10 h-10 rounded-full bg-[#E64A19] text-white font-bold flex items-center justify-center text-base shadow-md font-sans">
            R
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                Radhaa Dudeja
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              radhadudeja514@gmail.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleBackupSiteToDrive}
            disabled={backupStatus === "backing_up"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/40"
          >
            <Cloud className="w-4 h-4" />
            <span>
              {backupStatus === "backing_up"
                ? "Backing up..."
                : backupStatus === "done"
                ? "✓ Backup Created"
                : "Backup Site to Drive"}
            </span>
          </button>

          <button
            onClick={() => {
              setItems([...INITIAL_DRIVE_ITEMS]);
              setSearchQuery("");
            }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
            title="Refresh Drive Cache"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all flex items-center gap-1 text-xs"
            title="Add Link / Folder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER PILLS ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input with magnifying glass */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google Drive files (e.g. 'Wedding Rider', 'Taj Corbett', 'Sangeet')..."
            className="w-full bg-black/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#C9A84C] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 overflow-x-auto scrollbar-none">
          {(["All", "Documents", "Images", "Videos", "Folders"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeFilter === tab
                    ? "bg-white/15 text-white shadow-sm font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* BREADCRUMB / CURRENT FOLDER BAR */}
      {currentFolderId && (
        <div className="flex items-center gap-2 text-xs bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2">
          <button
            onClick={() => setCurrentFolderId(null)}
            className="flex items-center gap-1 text-[#C9A84C] hover:underline font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Google Drive</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-white font-semibold flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            {currentFolder?.name}
          </span>
          <span className="text-[10px] text-neutral-400 ml-auto font-mono">
            {displayedItems.length} items inside
          </span>
        </div>
      )}

      {/* FOLDERS AND FILES GRID (2 COLUMNS AS IN SCREENSHOT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
        {displayedItems.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-black/40 rounded-2xl border border-dashed border-white/10 text-neutral-400 text-xs">
            No files or folders found matching "{searchQuery}".
          </div>
        ) : (
          displayedItems.map((item) => {
            const isFolder = item.type === "folder";
            const isMedia = item.type === "image" || item.type === "video";

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isFolder) {
                    setCurrentFolderId(item.id);
                  }
                }}
                className={`group relative bg-[#181818] hover:bg-[#1f1f1f] border border-white/10 hover:border-[#C9A84C]/40 rounded-2xl p-4 transition-all duration-200 flex items-center justify-between gap-3 shadow-lg ${
                  isFolder ? "cursor-pointer" : ""
                }`}
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isFolder
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                        : item.type === "video"
                        ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                        : item.type === "image"
                        ? "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                        : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    }`}
                  >
                    {isFolder ? (
                      <Folder className="w-5 h-5 fill-amber-400/20" />
                    ) : item.type === "video" ? (
                      <VideoIcon className="w-5 h-5" />
                    ) : item.type === "image" ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#E2C775] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1.5 truncate">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                      {item.size && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-neutral-500">
                            {item.size}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* If Media: direct "Apply to Slot" button */}
                  {isMedia && item.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssigningItem(item);
                        setTargetSlotId(item.slotId || defaultSlotId);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#C9A84C]/20 hover:bg-[#C9A84C] text-[#E2C775] hover:text-black text-[11px] font-semibold flex items-center gap-1 transition-all"
                      title="Assign this media to a website photo/video slot"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Use on Site</span>
                    </button>
                  )}

                  {/* Open Link */}
                  {item.url && item.url !== "#" ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Open file / preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFolder) setCurrentFolderId(item.id);
                      }}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Browse Folder"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QUICK STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          Google Drive Workspace Active · Linked to{" "}
          <strong className="text-white">radhadudeja514@gmail.com</strong>
        </span>
        <span className="text-[11px] font-mono text-[#C9A84C]">
          Click "Use on Site" on any photo or video to replace any live slot.
        </span>
      </div>

      {/* MODAL 1: ASSIGN TO WEBSITE SLOT */}
      {assigningItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-[#C9A84C]/50 rounded-3xl p-6 sm:p-8 max-w-xl max-h-[92vh] overflow-y-auto w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                <h4 className="text-base font-bold text-white font-serif">
                  Assign to Website Slot & Trim Media
                </h4>
              </div>
              <button
                onClick={() => setAssigningItem(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-1">Selected Google Drive Asset:</p>
              <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                  {assigningItem.type === "video" ? (
                    <VideoIcon className="w-5 h-5" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">
                    {assigningItem.name}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {assigningItem.type.toUpperCase()} • {assigningItem.size}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Target Website Slot to Update:
              </label>
              <select
                value={targetSlotId}
                onChange={(e) => setTargetSlotId(e.target.value)}
                className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
              >
                <optgroup label="🏢 Corporate Conclaves Rails">
                  {MASTER_SITE_SLOTS.filter(
                    (s) => s.section === "corporate" && s.slot_id.startsWith("corp_rail_")
                  ).map((s) => (
                    <option key={s.slot_id} value={s.slot_id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🌲 Corporate Offsites Rails">
                  {MASTER_SITE_SLOTS.filter(
                    (s) => s.section === "corporate" && s.slot_id.startsWith("corp_offsite_")
                  ).map((s) => (
                    <option key={s.slot_id} value={s.slot_id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="💍 Luxury Sangeet & Weddings Rails">
                  {MASTER_SITE_SLOTS.filter((s) => s.section === "weddings").map((s) => (
                    <option key={s.slot_id} value={s.slot_id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🎲 Signature Family Interactive Games">
                  {MASTER_SITE_SLOTS.filter((s) => s.section === "games").map((s) => (
                    <option key={s.slot_id} value={s.slot_id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🎬 Master Billboard & Bio">
                  <option value="hero_billboard">Homepage Hero — Master Billboard Showreel</option>
                  <option value="about_portrait">About Radhaa — Artist Dossier Portrait</option>
                </optgroup>
              </select>
            </div>

            {/* Media Framing & Trim Studio for the selected asset */}
            {assigningItem.url && (assigningItem.type === "video" || assigningItem.type === "image") && (
              <div className="max-h-[380px] overflow-y-auto pr-1">
                <MediaCropAndTrimStudio
                  mediaUrl={assigningItem.url}
                  mediaType={assigningItem.type === "video" ? "video" : "image"}
                  slotLabel={targetSlotId}
                  initialConfig={cropTrimConfig}
                  onChange={setCropTrimConfig}
                />
              </div>
            )}

            {assignSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                <Check className="w-4 h-4" />
                <span>{assignSuccess}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssigningItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E2C775] text-black text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity"
              >
                Update Live Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD GOOGLE DRIVE FOLDER OR LINK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddNewItem}
            className="bg-[#161616] border border-[#C9A84C]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <Plus className="w-5 h-5" />
                <h4 className="text-base font-bold text-white font-serif">
                  Add to Drive Workspace
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Item Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["folder", "image", "video", "document"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewLinkType(t)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      newLinkType === t
                        ? "bg-[#C9A84C] text-black border-[#C9A84C]"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Folder / File Name
              </label>
              <input
                type="text"
                required
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
                placeholder="e.g. Goa Destination Wedding 2026 / Keynote Reel"
                className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Google Drive Share URL or ID (Optional for folders)
              </label>
              <input
                type="text"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#C9A84C] outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#C9A84C] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#E2C775] transition-colors"
              >
                Add to Workspace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
