import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog, type BlogPost } from "@/hooks/useBlog";
import RadhaaLogo from "@/components/RadhaaLogo";
import ParticleBackground from "@/components/ParticleBackground";
import MotionVideoBackground from "@/components/MotionVideoBackground";
import TiltCard from "@/components/TiltCard";
import SocialChannelsBar from "@/components/SocialChannelsBar";
import {
  BookOpen,
  Calendar,
  Clock,
  Tag,
  Search,
  ArrowRight,
  Share2,
  Check,
  Heart,
  Briefcase,
  Sparkles,
  ChevronLeft,
  X,
  MessageCircle,
} from "lucide-react";
import "@/pages/Stellar/Stellar.css";

export default function BlogIndex() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { blogs, getBlogBySlug } = useBlog();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // If a slug is provided in URL, open that article
  useEffect(() => {
    if (slug) {
      const found = getBlogBySlug(slug);
      if (found) {
        setActiveArticle(found);
        document.title = `${found.title} — Radhaa Dudeja Insights`;
      }
    } else {
      setActiveArticle(null);
      document.title = "Blog & Event Playbooks — Radhaa Dudeja";
    }
  }, [slug, getBlogBySlug]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(blogs.map((b) => b.category));
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query));
      return matchesCat && matchesQuery;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0];
  }, [blogs]);

  const openArticle = (post: BlogPost) => {
    setActiveArticle(post);
    navigate(`/blog/${post.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeArticle = () => {
    setActiveArticle(null);
    navigate("/blog");
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden font-sans">
      {/* Continuous Ambient Looping Motion Video & Stage Spotlight Sweep */}
      <MotionVideoBackground variant="fullscreen" overlayOpacity={0.7} accentColor="gold" />

      <ParticleBackground />

      {/* TOP NOTIFICATION BAR */}
      <div className="bg-[#121008] border-b border-[#C9A84C]/30 px-4 py-2 text-center text-xs flex items-center justify-center gap-3">
        <span className="text-[#C9A84C] font-semibold flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Stagecraft, Sangeet Playbooks & Industry Insights
        </span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <span className="text-white/80 text-[11px]">By Premier Anchor Radhaa Dudeja</span>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
        <a href="/corporate" onClick={() => setIsMenuOpen(false)}>Corporate Summits</a>
        <a href="/weddings" onClick={() => setIsMenuOpen(false)}>Weddings & Sangeet</a>
        <a href="/blog" onClick={() => setIsMenuOpen(false)} className="text-[#C9A84C]">Blog & Insights</a>
        <a href="/admin" onClick={() => setIsMenuOpen(false)} className="text-xs text-[#C9A84C]">Admin Portal</a>
      </div>

      {/* NAVBAR */}
      <nav id="navbar" className={isScrolled ? "scrolled" : ""}>
        <a href="/" className="no-underline">
          <RadhaaLogo variant="navbar" />
        </a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/corporate">Corporate</a></li>
          <li><a href="/weddings">Weddings</a></li>
          <li><a href="/blog" className="text-[#C9A84C]">Blog</a></li>
          <li><a href="/#booking" className="nav-cta">Book Radhaa</a></li>
        </ul>
        <div
          className={`hamburger ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span /><span /><span />
        </div>
      </nav>

      {/* ARTICLE READER VIEW */}
      {activeArticle ? (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-20">
          <button
            onClick={closeArticle}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A84C] hover:text-[#E2C775] mb-6 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back to All Articles
          </button>

          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full font-semibold bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30">
                {activeArticle.category}
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeArticle.read_time}
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {activeArticle.published_date}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed italic border-l-2 border-[#C9A84C] pl-4">
              {activeArticle.excerpt}
            </p>

            {/* Author row & share */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#C9A84C] overflow-hidden bg-neutral-900">
                  <img src="/logo.png" alt="Radhaa Dudeja" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{activeArticle.author}</div>
                  <div className="text-xs text-[#C9A84C]">{activeArticle.author_role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyArticleLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? "Link Copied!" : "Share"}</span>
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `${activeArticle.title} by Radhaa Dudeja: ${window.location.href}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-all"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          {activeArticle.cover_image && (
            <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden mb-10 border border-white/10 shadow-2xl relative">
              <img
                src={activeArticle.cover_image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Article Body Content */}
          <article className="prose prose-invert prose-neutral max-w-none space-y-6 text-neutral-200 leading-relaxed text-base sm:text-lg">
            {activeArticle.content.split("\n\n").map((block, i) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-2xl font-serif font-bold text-white pt-6 border-b border-white/10 pb-2">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-[#C9A84C] pl-4 py-2 my-6 bg-[#C9A84C]/5 rounded-r-xl italic text-white/90 font-serif text-lg sm:text-xl"
                  >
                    {trimmed.replace("> ", "")}
                  </blockquote>
                );
              }
              if (trimmed.startsWith("---")) {
                return <hr key={i} className="border-white/10 my-8" />;
              }
              if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^[\*\-]\s+/, ""));
                return (
                  <ul key={i} className="space-y-2 list-disc list-inside text-neutral-300">
                    {items.map((item, j) => (
                      <li key={j} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-neutral-300 leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </article>

          {/* Tags */}
          {activeArticle.tags && activeArticle.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-8 mt-10 border-t border-white/10">
              <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5" /> Tags:
              </span>
              {activeArticle.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-neutral-300"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Booking CTA Card */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-[#121008] border border-[#C9A84C]/40 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#C9A84C]/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3 py-1 rounded-full">
              Reserve Your Event Date
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif text-white font-bold mt-4">
              Bring Radhaa's High-Voltage Energy to Your Stage
            </h3>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto mt-2">
              Whether you are curating a multi-day corporate summit or an electric royal wedding Sangeet, let's create memories that linger for years.
            </p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <a
                href="/#booking"
                className="px-6 py-3 rounded-full bg-[#C9A84C] text-black font-semibold text-sm hover:bg-[#E2C775] transition-all shadow-lg shadow-[#C9A84C]/20"
              >
                Inquire For Dates
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi%20Radhaa,%20I%20read%20your%20playbook%20and%20would%20like%20to%20discuss%20an%20event"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/15 border border-white/20 transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Direct
              </a>
            </div>
          </div>
        </main>
      ) : (
        /* BLOG INDEX LISTING VIEW */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#C9A84C] font-semibold bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Stage Insights & Event Guides
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white mt-4 tracking-tight">
              The Anchor's Journal
            </h1>
            <p className="text-base sm:text-lg text-neutral-300 mt-3 leading-relaxed">
              Curated playbooks on Sangeet crowd dynamics, Fortune 500 stagecraft, icebreakers, and behind-the-scenes hosting strategies by <em>Radhaa Dudeja</em>.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20"
                      : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search guides, Sangeet, CXO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A84C] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Featured Post Hero Banner */}
          {selectedCategory === "All" && !searchQuery && featuredPost && (
            <div
              onClick={() => openArticle(featuredPost)}
              className="group cursor-pointer mb-14 rounded-3xl overflow-hidden border border-[#C9A84C]/30 bg-gradient-to-br from-neutral-900 to-[#121008] p-6 sm:p-10 hover:border-[#C9A84C] transition-all duration-300 shadow-2xl hover:shadow-[#C9A84C]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/15 border border-[#C9A84C]/30 px-3 py-1 rounded-full">
                    Featured Playbook · {featuredPost.category}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featuredPost.read_time}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#C9A84C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                    Read Full Playbook <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <img
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <div
                key={post.id}
                onClick={() => openArticle(post)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/60 hover:bg-neutral-900 hover:border-[#C9A84C]/60 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-black bg-[#C9A84C] px-2.5 py-0.5 rounded-full shadow">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C9A84C]" /> {post.published_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.read_time}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#C9A84C] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#C9A84C] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-neutral-500 text-[11px]">{post.author}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-white/10">
              <BookOpen className="w-12 h-12 text-[#C9A84C]/50 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No articles found</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Try searching with different keywords or switch the category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-full bg-white/10 text-xs font-semibold text-white hover:bg-white/20"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6 relative z-20 bg-black text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <RadhaaLogo variant="icon" />
          <p>© 2026 Radhaa Dudeja. All rights reserved. Premier Anchor & Corporate Emcee.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/corporate" className="hover:text-white">Corporate</a>
            <a href="/weddings" className="hover:text-white">Weddings</a>
            <a href="/admin" className="text-[#C9A84C] hover:underline">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
