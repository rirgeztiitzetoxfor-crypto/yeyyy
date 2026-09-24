import React, { useState } from "react";
import { useBlog, type BlogPost } from "@/hooks/useBlog";
import { parseGoogleDriveUrl } from "@/hooks/useSiteMedia";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  Save,
  X,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";

export default function AdminBlogManager() {
  const { blogs, addOrUpdateBlog, deleteBlog, resetBlogs } = useBlog();

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    category: "Weddings & Sangeet",
    excerpt: "",
    content: "",
    cover_image: "/images/img_28.jpg",
    read_time: "5 min read",
    author: "Radhaa Dudeja",
    author_role: "Premier Anchor & Corporate Emcee",
    published_date: "September 2026",
    tags: ["Sangeet", "Wedding Entertainment"],
    featured: false,
    meta_description: "",
  });

  const handleStartCreate = () => {
    setFormData({
      title: "",
      slug: "",
      category: "Weddings & Sangeet",
      excerpt: "",
      content: "",
      cover_image: "/images/img_28.jpg",
      read_time: "5 min read",
      author: "Radhaa Dudeja",
      author_role: "Premier Anchor & Corporate Emcee",
      published_date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      tags: ["Wedding", "Emcee"],
      featured: false,
      meta_description: "",
    });
    setEditingPost(null);
    setIsCreatingNew(true);
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ ...post });
    setIsCreatingNew(true);
  };

  const handleCoverImageChange = (val: string) => {
    const converted = parseGoogleDriveUrl(val, "image");
    setFormData({ ...formData, cover_image: converted });
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    addOrUpdateBlog(formData as BlogPost);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsCreatingNew(false);
      setEditingPost(null);
    }, 1200);
  };

  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteBlog(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C9A84C]" /> Blog & Event Playbooks Manager
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Publish thought-leadership articles, wedding tips, and corporate emcee guides to boost Google organic search rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetBlogs}
            className="text-xs text-neutral-400 hover:text-white px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5"
            title="Reset to default luxury pre-seeded articles"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore Default Articles
          </button>

          <button
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#E2C775] transition-all flex items-center gap-2 shadow-lg shadow-[#C9A84C]/20"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      {/* Editor Modal / Form */}
      {isCreatingNew && (
        <div className="bg-[#121212] border border-[#C9A84C]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#C9A84C]">
                {editingPost ? "Editing Playbook" : "Create New Playbook"}
              </span>
            </div>
            <button
              onClick={() => {
                setIsCreatingNew(false);
                setEditingPost(null);
              }}
              className="text-neutral-400 hover:text-white p-1 rounded-lg bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSavePost} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Title */}
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    const autoSlug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");
                    setFormData({
                      ...formData,
                      title,
                      slug: editingPost ? formData.slug : autoSlug,
                    });
                  }}
                  placeholder="e.g. How to Pacing a Royal Sangeet Dance Floor Until 3 AM"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as BlogPost["category"],
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                >
                  <option value="Weddings & Sangeet">Weddings & Sangeet</option>
                  <option value="Corporate Events">Corporate Events</option>
                  <option value="Anchor & Emcee Tips">Anchor & Emcee Tips</option>
                  <option value="Behind the Scenes">Behind the Scenes</option>
                </select>
              </div>

              {/* Slug */}
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  URL Slug (/blog/...)
                </label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. how-to-host-a-sangeet"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-xs font-mono text-neutral-300 focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              {/* Read Time & Date */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.read_time || ""}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  placeholder="e.g. 5 min read"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-white"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Publish Date
                </label>
                <input
                  type="text"
                  value={formData.published_date || ""}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  placeholder="e.g. September 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-white"
                />
              </div>

              {/* Cover Image (Google Drive or direct) */}
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Cover Image (Direct URL or Google Drive link)
                </label>
                <input
                  type="text"
                  value={formData.cover_image || ""}
                  onChange={(e) => handleCoverImageChange(e.target.value)}
                  placeholder="Paste image URL or Google Drive share link"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-white focus:border-[#C9A84C] focus:outline-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="md:col-span-4 flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C9A84C] focus:ring-0 bg-black border-white/20"
                  />
                  <span>Feature on Blog Homepage Spotlight</span>
                </label>
              </div>

              {/* Excerpt */}
              <div className="md:col-span-12">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A compelling 2-sentence summary that appears on cards and search results..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              {/* Full Content */}
              <div className="md:col-span-12">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    Full Article Content (Supports Markdown: ### Header, > Quote, * List)
                  </label>
                </div>
                <textarea
                  rows={12}
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article here..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-sm text-neutral-200 font-mono leading-relaxed focus:border-[#C9A84C] focus:outline-none"
                  required
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-12">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Sangeet, Corporate, Stage Presence, Live Events"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingPost(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 text-xs font-semibold text-neutral-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#C9A84C] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#E2C775] transition-all flex items-center gap-2 shadow-lg shadow-[#C9A84C]/20"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Publish Article</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Existing Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((post) => (
          <div
            key={post.id}
            className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-[#C9A84C]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-black bg-amber-400 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.read_time}
                </div>
              </div>

              <h4 className="text-base font-serif font-bold text-white leading-snug line-clamp-2 mb-2">
                {post.title}
              </h4>

              <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A84C] hover:underline flex items-center gap-1 text-[11px]"
              >
                <Eye className="w-3.5 h-3.5" /> View Live
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(post)}
                  className="p-1.5 rounded-lg bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Edit Playbook"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id, post.title)}
                  className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Playbook"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
