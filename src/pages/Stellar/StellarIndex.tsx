import React, { useEffect, useState, useRef } from 'react';
import { useSiteMedia } from '@/hooks/useSiteMedia';
import VoiceAgentSection from '@/components/VoiceAgentSection';
import './Stellar.css';

const galleryData = [
  { img: 'images/img_17.jpg', caption: 'Hotel Entrance – Red Evening Gown' },
  { img: 'images/img_11.jpg', caption: 'Restaurant – Black Sparkle Dress' },
  { img: 'images/img_28.jpg', caption: 'Outdoor Ceremony – Pink Top' },
  { img: 'images/img_22.jpg', caption: 'Hotel Lobby – Black Lace Gown' },
  { img: 'images/img_01.jpg', caption: 'Event Hosting – Floral White Dress' },
  { img: 'images/img_14.jpg', caption: 'Wedding Stage – Pastel Blue Gown' },
  { img: 'images/img_25.jpg', caption: 'Sangeet Ceremony – Night Event' },
  { img: 'images/img_32.jpg', caption: 'Haldi Function – Green Velvet' },
  { img: 'images/img_13.jpg', caption: 'Hotel Lobby – Maroon Dress' },
  { img: 'images/img_33.jpg', caption: 'Wedding Stage – Pink Co-ord' },
  { img: 'images/img_20.jpg', caption: 'Hotel – Maroon Evening Gown' },
  { img: 'images/img_23.jpg', caption: 'Safari Resort – Purple Top' },
  { img: 'images/img_24.jpg', caption: 'Sangeet Night – Dark Red' },
  { img: 'images/img_29.jpg', caption: 'Sangeet Night – Red Sparkle' },
  { img: 'images/img_31.jpg', caption: 'Wedding Stage – Red Polka Dot' },
  { img: 'images/img_08.jpg', caption: 'Temple Event – Floral White' },
  { img: 'images/img_06.jpg', caption: 'Salon – Pink Sequin Top' },
  { img: 'images/img_04.jpg', caption: 'Hotel Room – Black Mini Dress' },
];

export default function StellarIndex() {
  const { getMediaUrl, getMediaAlt } = useSiteMedia();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState('✨  Send Inquiry  ✨');
  const [isFormSuccess, setIsFormSuccess] = useState(false);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let stopCursor = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateRing = () => {
      if (stopCursor) return;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (cursorRef.current && cursorRingRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorRingRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', onMouseMove);
    animateRing();

    const onHoverEnter = () => document.body.classList.add('cursor-hover');
    const onHoverLeave = () => document.body.classList.remove('cursor-hover');
    const attachHovers = () => {
      document.querySelectorAll('a, button, .gallery-item, .event-card, .social-card').forEach(el => {
        el.addEventListener('mouseenter', onHoverEnter);
        el.addEventListener('mouseleave', onHoverLeave);
      });
    };
    attachHovers();
    
    setTimeout(attachHovers, 500);

    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      stopCursor = true;
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.querySelectorAll('a, button, .gallery-item, .event-card, .social-card').forEach(el => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
      });
    };
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { 
        if (e.isIntersecting) e.target.classList.add('visible'); 
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const animateCounter = (el: Element, target: number, suffix: string) => {
      let current = 0;
      const increment = target / 60;
      const timer = window.setInterval(() => {
        current += increment;
        if (current >= target) { 
          current = target; 
          clearInterval(timer); 
        }
        const numEl = el.querySelector('.stat-num');
        if (numEl) numEl.innerHTML = Math.round(current) + suffix;
      }, 16);
    };

    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const target = e.target as HTMLElement;
        if (e.isIntersecting && !target.dataset.counted) {
          target.dataset.counted = "true";
          const items = target.querySelectorAll('.stat-item');
          const data = [
            { target: 500, suffix: '<span style="font-size:2rem">+</span>' },
            { target: 8, suffix: '<span style="font-size:2rem">+</span>' },
            { target: 3, suffix: '' },
            { target: 100, suffix: '<span style="font-size:2rem">%</span>' },
          ];
          items.forEach((item, i) => {
            setTimeout(() => animateCounter(item, data[i].target, data[i].suffix), i * 150);
          });
        }
      });
    }, { threshold: 0.5 });
    
    const strip = document.querySelector('.stats-strip');
    if (strip) statsObserver.observe(strip);
    
    return () => statsObserver.disconnect();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('✅  Inquiry Sent! Will respond within 24 hours.');
    setIsFormSuccess(true);
    setTimeout(() => {
      setFormStatus('✨  Send Inquiry  ✨');
      setIsFormSuccess(false);
      (e.target as HTMLFormElement).reset();
    }, 4000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + galleryData.length) % galleryData.length);
      if (e.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % galleryData.length);
    };
    if (lightboxIndex !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div className="stellar-wrapper">
      <VoiceAgentSection />
      
{/* PAGE LOADER */}
<div className="page-loader" id="loader" style={{ display: 'none' }}></div>

{/* CUSTOM CURSOR */}
<div className="cursor" ref={cursorRef}></div>
<div className="cursor-ring" ref={cursorRingRef}></div>

{/* LIGHTBOX */}
<div className={`lightbox ${lightboxIndex !== null ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setLightboxIndex(null); }}>
  <div className="lightbox-close" onClick={() => setLightboxIndex(null)}>✕</div>
  {lightboxIndex !== null && (
    <>
      <div className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + galleryData.length) % galleryData.length); }}>‹</div>
      <img src={getMediaUrl(`gallery_${lightboxIndex + 1}`, galleryData[lightboxIndex].img)} alt="Gallery" />
      <div className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % galleryData.length); }}>›</div>
    </>
  )}
</div>

{/* MOBILE MENU */}
<div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
  <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
  <a href="#events" onClick={() => setIsMenuOpen(false)}>Events</a>
  <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
  <a href="#videos" onClick={() => setIsMenuOpen(false)}>Videos</a>
  <a href="#booking" onClick={() => setIsMenuOpen(false)}>Book Me</a>
</div>

{/* NAVIGATION */}
<nav id="navbar" className={isScrolled ? "scrolled" : ""}>
  <div className="nav-logo">Radha Dudeja</div>
  <ul className="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#events">Events</a></li>
    <li><a href="#strengths">Strengths</a></li>
    <li><a href="#gallery">Gallery</a></li>
    <li><a href="#videos">Videos</a></li>
    <li><a href="#booking" className="nav-cta">Book Now</a></li>
  </ul>
  <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
    <span></span><span></span><span></span>
  </div>
</nav>

{/* HERO */}
<section id="hero">
  <div className="hero-bg" ref={heroBgRef}></div>
  <div className="hero-overlay"></div>
  <div className="hero-grain"></div>
  <div className="hero-content">
    <div className="hero-pre">✦ India's Premier Anchor & Emcee ✦</div>
    <h1 className="hero-name">
      Radha<span>Dudeja</span>
    </h1>
    <div className="hero-title">Anchor &nbsp;·&nbsp; Emcee &nbsp;·&nbsp; Host &nbsp;·&nbsp; Speaker</div>
    <div className="hero-tagline">"Let's create a moment worth remembering"</div>
    <div className="hero-badges">
      <div className="hero-badge">
        <div className="hero-badge-num">500+</div>
        <div className="hero-badge-label">Events Hosted</div>
      </div>
      <div className="hero-divider"></div>
      <div className="hero-badge">
        <div className="hero-badge-num">3</div>
        <div className="hero-badge-label">Languages</div>
      </div>
      <div className="hero-divider"></div>
      <div className="hero-badge">
        <div className="hero-badge-num">8+</div>
        <div className="hero-badge-label">Years Experience</div>
      </div>
      <div className="hero-divider"></div>
      <div className="hero-badge">
        <div className="hero-badge-num">PAN</div>
        <div className="hero-badge-label">India Travel</div>
      </div>
    </div>
    <div className="hero-btns">
      <a href="#booking" className="btn-primary">Book Radha</a>
      <a href="#gallery" className="btn-ghost">View Portfolio</a>
    </div>
  </div>
  <div className="hero-scroll">
    <span>Scroll</span>
    <div className="scroll-line"></div>
  </div>
</section>

{/* MARQUEE */}
<div className="marquee-strip">
  <div className="marquee-track" id="marqueeTrack">
    <span className="marquee-item">Corporate Events <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Weddings &amp; Sangeets <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">TEDx-Style Hosting <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Trilingual MC <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Cultural Festivals <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Summit Moderator <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Team Building <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Award Ceremonies <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Corporate Events <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Weddings &amp; Sangeets <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">TEDx-Style Hosting <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Trilingual MC <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Cultural Festivals <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Summit Moderator <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Team Building <span className="marquee-dot">✦</span></span>
    <span className="marquee-item">Award Ceremonies <span className="marquee-dot">✦</span></span>
  </div>
</div>

{/* ABOUT */}
<section id="about">
  <div className="about-visual reveal-left">
    <div className="about-gold-accent"></div>
    <div className="about-frame"></div>
    <img src="images/img_14.jpg" alt="Radha Dudeja on stage" className="about-img-main" />
    <img src="images/img_28.jpg" alt="Radha Dudeja close-up" className="about-img-accent" />
  </div>
  <div className="about-text reveal-right">
    <div className="section-label">The Anchor Behind the Magic</div>
    <h2 className="section-title">From the foothills of <em>Uttarakhand</em> to centre stage across India</h2>
    <div className="gold-line"></div>
    <div className="about-quote">"I don't just host an event, I ignite an experience."</div>
    <p className="about-body">
      Radha Dudeja enters every stage with the energy of a live wire and the poise of a seasoned speaker. 
      Growing up in Ramnagar near the lush forests of Jim Corbett, she was always the one who could charm 
      a room — and today, that natural magnetism has blossomed into a career that spans Fortune 500 
      conferences, destination weddings, and cultural festivals across India.
    </p>
    <p className="about-body">
      Her TEDx-style philosophy is beautifully simple: <em>engage the mind, ignite the heart</em>, 
      and the audience will remember your message. Every event she hosts becomes a living, breathing 
      story — thoughtfully crafted, spontaneously delivered.
    </p>
    <div className="about-langs">
      <div className="lang-tag">🇮🇳 Hindi</div>
      <div className="lang-tag">🌍 English</div>
      <div className="lang-tag">🎉 Punjabi</div>
    </div>
    <div style={{"display":"flex","gap":"1.2rem","flexWrap":"wrap","marginTop":"1rem"}}>
      <a href="#booking" className="btn-primary">Book Radha</a>
      <a href="https://www.youtube.com/@anchorrd8794" target="_blank" className="btn-ghost">Watch Showreel</a>
    </div>
  </div>
</section>

{/* STATS STRIP */}
<div className="stats-strip">
  <div className="stat-item reveal reveal-delay-1">
    <div className="stat-num">500<span style={{"fontSize":"2rem"}}>+</span></div>
    <div className="stat-label">Events Hosted</div>
  </div>
  <div className="stat-item reveal reveal-delay-2">
    <div className="stat-num">8<span style={{"fontSize":"2rem"}}>+</span></div>
    <div className="stat-label">Years Experience</div>
  </div>
  <div className="stat-item reveal reveal-delay-3">
    <div className="stat-num">3</div>
    <div className="stat-label">Languages Fluent</div>
  </div>
  <div className="stat-item reveal reveal-delay-4">
    <div className="stat-num">100<span style={{"fontSize":"2rem"}}>%</span></div>
    <div className="stat-label">Client Satisfaction</div>
  </div>
</div>

{/* EVENTS */}
<section id="events">
  <div className="section-label reveal">What Radha Hosts</div>
  <h2 className="section-title reveal reveal-delay-1">Versatile across every <em>stage & setting</em></h2>
  <div className="events-grid" style={{"marginTop":"4rem"}}>
    <div className="event-card reveal reveal-delay-1">
      <img src="images/img_06.jpg" alt="Corporate Events" />
      <div className="event-card-content">
        <div className="event-card-tag">Corporate</div>
        <div className="event-card-icon">💼</div>
        <div className="event-card-title">Corporate Events & Summits</div>
        <div className="event-card-desc">Conferences, product launches, award nights, and team-building retreats — delivered with polished grace and lively energy.</div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {getMediaUrl('pdf_corporate', '') && <a href={getMediaUrl('pdf_corporate', '')} target="_blank" rel="noreferrer" className="event-card-tag !mt-0 !mb-0" style={{background: '#fff'}}>📑 Download Kit</a>}
          {getMediaUrl('media_corporate', '') && <a href={getMediaUrl('media_corporate', '')} target="_blank" rel="noreferrer" className="event-card-tag !mt-0 !mb-0" style={{background: '#CC2936', color: '#fff'}}>▶ Watch Media Cut</a>}
        </div>
      </div>
    </div>
    <div className="event-card reveal reveal-delay-2">
      <img src="images/img_01.jpg" alt="Weddings" />
      <div className="event-card-content">
        <div className="event-card-tag">Celebrations</div>
        <div className="event-card-icon">💍</div>
        <div className="event-card-title">Weddings & Sangeets</div>
        <div className="event-card-desc">From intimate mehendi ceremonies to grand reception nights — Radha becomes the heartbeat of your celebration.</div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {getMediaUrl('pdf_sangeet', '') && <a href={getMediaUrl('pdf_sangeet', '')} target="_blank" rel="noreferrer" className="event-card-tag !mt-0 !mb-0" style={{background: '#fff'}}>📑 Download Kit</a>}
          {getMediaUrl('media_sangeet', '') && <a href={getMediaUrl('media_sangeet', '')} target="_blank" rel="noreferrer" className="event-card-tag !mt-0 !mb-0" style={{background: '#CC2936', color: '#fff'}}>▶ Watch Media Cut</a>}
        </div>
      </div>
    </div>
    <div className="event-card reveal reveal-delay-3">
      <img src="images/img_08.jpg" alt="Cultural Events" />
      <div className="event-card-content">
        <div className="event-card-tag">Cultural</div>
        <div className="event-card-icon">🎭</div>
        <div className="event-card-title">Cultural & Festive Events</div>
        <div className="event-card-desc">Holi, New Year, community nights, public ceremonies — Radha's bilingual energy unites diverse audiences.</div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {getMediaUrl('pdf_emcee', '') && <a href={getMediaUrl('pdf_emcee', '')} target="_blank" rel="noreferrer" className="event-card-tag !mt-0 !mb-0" style={{background: '#fff'}}>📑 Download Kit</a>}
          {getMediaUrl('media_emcee', '') && <a href={getMediaUrl('media_emcee', '')} target="_blank" rel="noreferrer" className="event-card-tag !mt-0 !mb-0" style={{background: '#CC2936', color: '#fff'}}>▶ Watch Media Cut</a>}
        </div>
      </div>
    </div>
    <div className="event-card reveal reveal-delay-4">
      <img src="images/img_13.jpg" alt="Team Building" />
      <div className="event-card-content">
        <div className="event-card-tag">Interactive</div>
        <div className="event-card-icon">🎲</div>
        <div className="event-card-title">Team-Building & Games</div>
        <div className="event-card-desc">Interactive hosting for corporate offsites, fun games, workshops, and employee engagement sessions.</div>
      </div>
    </div>
  </div>
</section>

{/* STRENGTHS */}
<section id="strengths">
  <div className="strengths-header">
    <div>
      <div className="section-label reveal">Why Radha?</div>
      <h2 className="section-title reveal reveal-delay-1">Stage presence that <em>sets her apart</em></h2>
    </div>
    <p className="strengths-intro reveal reveal-delay-2">
      Radha is frequently praised as an "articulate and engaging anchor" who brings a unique blend of 
      professionalism and charisma. From spontaneous crowd management to heartfelt storytelling, 
      she adapts to every audience with precision and warmth.
    </p>
  </div>
  <div className="strengths-grid">
    <div className="strength-card reveal reveal-delay-1">
      <div className="strength-num">01</div>
      <div className="strength-title">⚡ High Energy & Enthusiasm</div>
      <p className="strength-body">Radha has a knack for instantly lighting up any venue. Her voice is assertive yet friendly, commanding attention from the first word without ever needing to shout.</p>
    </div>
    <div className="strength-card reveal reveal-delay-2">
      <div className="strength-num">02</div>
      <div className="strength-title">❤️ Audience Connection</div>
      <p className="strength-body">Her genuine warmth helps her bond with audiences of all sizes. Guests frequently remark that they feel like they've known her for years after just one event.</p>
    </div>
    <div className="strength-card reveal reveal-delay-3">
      <div className="strength-num">03</div>
      <div className="strength-title">🎭 Spontaneity & Grace</div>
      <p className="strength-body">Schedule change? Chief guest running late? AV glitch? Radha's improv skills and quick wit keep the audience entertained no matter what happens backstage.</p>
    </div>
    <div className="strength-card reveal reveal-delay-1">
      <div className="strength-num">04</div>
      <div className="strength-title">🌐 Multilingual Fluency</div>
      <p className="strength-body">Fluent in Hindi, English, and Punjabi. She might welcome delegates in polished English, then charm locals with a Punjabi proverb — inclusivity in every syllable.</p>
    </div>
    <div className="strength-card reveal reveal-delay-2">
      <div className="strength-num">05</div>
      <div className="strength-title">💎 Elegance & Professionalism</div>
      <p className="strength-body">From formal gowns for corporate galas to vibrant outfits for cultural events — Radha embodies professional glamour, punctuality, and thorough preparation.</p>
    </div>
    <div className="strength-card reveal reveal-delay-3">
      <div className="strength-num">06</div>
      <div className="strength-title">🎤 TEDx-Style Philosophy</div>
      <p className="strength-body">She approaches every stage with a speaker's mindset: meticulous preparation, an improviser's flexibility, and a deep desire to move hearts — not just fill schedules.</p>
    </div>
  </div>
</section>

{/* PHILOSOPHY */}
<section id="philosophy">
  <div className="philosophy-bg"></div>
  <div className="philosophy-content">
    <div className="phil-stars">✦ ✦ ✦</div>
    <div className="philosophy-quote reveal">"Let's create a moment worth remembering."</div>
    <div className="phil-stars">✦ ✦ ✦</div>
    <div className="philosophy-attr reveal reveal-delay-1">
      — <strong>Radha Dudeja</strong> &nbsp;·&nbsp; Anchor · Emcee · Host
    </div>
    <div style={{"marginTop":"3rem"}} className="reveal reveal-delay-2">
      <a href="#booking" className="btn-primary">Book Your Event</a>
    </div>
  </div>
</section>

{/* GALLERY */}
<section id="gallery">
  <div className="section-label reveal">Photo Portfolio</div>
  <h2 className="section-title reveal reveal-delay-1">Captured moments from <em>real events</em></h2>
  <p className="gallery-intro reveal reveal-delay-2">
    A glimpse into the stages, smiles, and stories that define Radha's journey — 
    from corporate summits to grand wedding receptions across India.
  </p>
  <div className="gallery-masonry" id="galleryMasonry">
    {galleryData.map((item, i) => {
      const dynamicUrl = getMediaUrl(`gallery_${i + 1}`, item.img);
      const dynamicAlt = getMediaAlt(`gallery_${i + 1}`, item.caption);
      return (
        <div key={i} className="gallery-item reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }} onClick={() => setLightboxIndex(i)}>
          <img src={dynamicUrl} alt={dynamicAlt} loading="lazy" />
          <div className="gallery-item-overlay"><div className="gallery-expand">⊕</div></div>
          <div className="gallery-caption">{dynamicAlt}</div>
        </div>
      );
    })}
  </div>
  <div style={{"textAlign":"center","marginTop":"3rem"}} className="reveal">
    <a href="https://www.instagram.com/radha_dudeja_/" target="_blank" className="btn-ghost">
      📸 &nbsp;View More on Instagram
    </a>
  </div>
</section>

{/* VIDEOS */}
<section id="videos">
  <div className="section-label reveal">Watch Radha in Action</div>
  <h2 className="section-title reveal reveal-delay-1">From the <em>showreel</em> & channel</h2>
  <p className="video-intro reveal reveal-delay-2">
    Words describe talent. Videos prove it. Watch Radha host, engage, and electrify audiences 
    across India's most memorable events.
  </p>
  <div className="video-grid">
    <div className="video-main reveal">
      <div className="video-embed">
        <iframe src="https://www.youtube.com/embed/videoseries?list=PLdummylist&autoplay=0"
          title="Radha Dudeja Showreel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </div>
      <div className="video-label">🔥 Channel Highlight</div>
      <div className="video-title">Anchor Radha Dudeja — Full Channel Showreel</div>
    </div>
    <div>
      <div className="video-embed reveal reveal-delay-1">
        <iframe src="https://www.youtube.com/embed/?listType=user_uploads&list=anchorrd8794"
          title="Corporate Events"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </div>
      <div className="video-label">💼 Corporate</div>
      <div className="video-title">Conference &amp; Summit Hosting</div>
    </div>
    <div>
      <div className="video-embed reveal reveal-delay-2">
        <iframe src="https://www.youtube.com/embed/?listType=user_uploads&list=anchorrd8794"
          title="Wedding Events"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen>
        </iframe>
      </div>
      <div className="video-label">💍 Weddings</div>
      <div className="video-title">Sangeet &amp; Reception Highlights</div>
    </div>
  </div>
  <div className="yt-cta reveal">
    <a href="https://www.youtube.com/@anchorrd8794" target="_blank" className="yt-btn">
      <span className="yt-icon">▶</span>
      Subscribe on YouTube
    </a>
    <span style={{"fontSize":"0.75rem","color":"var(--grey)"}}>@anchorrd8794 · 1300+ Videos</span>
  </div>
</section>

{/* TESTIMONIALS */}
<section id="testimonials">
  <div className="section-label reveal">Client Love</div>
  <h2 className="section-title reveal reveal-delay-1">What <em>clients say</em> about Radha</h2>
  <div className="testimonials-grid">
    <div className="testimonial-card reveal reveal-delay-1">
      <div className="quote-mark">"</div>
      <div className="testimonial-stars">★★★★★</div>
      <div className="testimonial-text">"Radha was the life of our corporate gala — our employees are still talking about her! Her bilingual hosting kept everyone engaged and the energy she brought was electric."</div>
      <div className="testimonial-author">Priya Sharma</div>
      <div className="testimonial-role">HR Director, Fortune 500 Company · Delhi</div>
    </div>
    <div className="testimonial-card reveal reveal-delay-2">
      <div className="quote-mark">"</div>
      <div className="testimonial-stars">★★★★★</div>
      <div className="testimonial-text">"She didn't just host our sangeet, she became part of our family! Her impromptu games had even our most reserved relatives dancing. We couldn't imagine our wedding without her."</div>
      <div className="testimonial-author">Ananya & Rohan Mehta</div>
      <div className="testimonial-role">Wedding Couple · Jim Corbett Destination Wedding</div>
    </div>
    <div className="testimonial-card reveal reveal-delay-3">
      <div className="quote-mark">"</div>
      <div className="testimonial-stars">★★★★★</div>
      <div className="testimonial-text">"Radha handled a last-minute change in our conference schedule with such grace and humor that the audience didn't even notice. True professional — highly recommended for any summit!"</div>
      <div className="testimonial-author">Vikram Negi</div>
      <div className="testimonial-role">Event Director · Uttarakhand Tourism Festival</div>
    </div>
  </div>
</section>

{/* SOCIAL */}
<section id="social">
  <div className="section-label reveal" style={{"justifyContent":"center"}}>Connect With Radha</div>
  <h2 className="section-title reveal reveal-delay-1" style={{"textAlign":"center"}}>Follow the <em>journey</em></h2>
  <div className="social-links-row">
    <a href="https://www.instagram.com/radha_dudeja_/" target="_blank" className="social-card reveal reveal-delay-1">
      <div className="social-icon">📸</div>
      <div className="social-name">Instagram</div>
      <div className="social-handle">@radha_dudeja_</div>
    </a>
    <a href="https://www.youtube.com/@anchorrd8794" target="_blank" className="social-card reveal reveal-delay-2">
      <div className="social-icon">▶️</div>
      <div className="social-name">YouTube</div>
      <div className="social-handle">Anchor RDZ</div>
    </a>
    <a href="https://starclinch.com/anchor-radha-dudeja" target="_blank" className="social-card reveal reveal-delay-3">
      <div className="social-icon">⭐</div>
      <div className="social-name">StarClinch</div>
      <div className="social-handle">Book Via Platform</div>
    </a>
    <a href="#booking" className="social-card reveal reveal-delay-4">
      <div className="social-icon">📩</div>
      <div className="social-name">Direct Booking</div>
      <div className="social-handle">DM or Email</div>
    </a>
  </div>
</section>

{/* BOOKING */}
<section id="booking">
  <div className="booking-grid">
    <div className="booking-info">
      <div className="section-label reveal">Let's Talk</div>
      <h2 className="section-title reveal reveal-delay-1">Ready to create something <em>unforgettable?</em></h2>
      <div className="booking-tagline reveal reveal-delay-2">"Your event, my expertise."</div>
      <p className="booking-body reveal reveal-delay-3">
        Whether it's an intimate corporate breakfast or a 5000-guest wedding extravaganza, 
        Radha brings the same passion, preparation, and presence to every stage. 
        Dates fill up fast — reach out today.
      </p>
      <div className="contact-items reveal reveal-delay-4">
        <div className="contact-item">
          <div className="contact-icon">📧</div>
          <div className="contact-detail">
            <strong>Email</strong>
            info@radhadudeja.com
          </div>
        </div>
        <div className="contact-item">
          <div className="contact-icon">📞</div>
          <div className="contact-detail">
            <strong>Phone / WhatsApp</strong>
            +91 XXXXX XXXXX
          </div>
        </div>
        <div className="contact-item">
          <div className="contact-icon">📍</div>
          <div className="contact-detail">
            <strong>Based In</strong>
            Ramnagar / Haldwani, Uttarakhand · PAN India Travel
          </div>
        </div>
        <div className="contact-item">
          <div className="contact-icon">⏰</div>
          <div className="contact-detail">
            <strong>Response Time</strong>
            Within 24 hours on all inquiries
          </div>
        </div>
      </div>
    </div>
    <div className="booking-form reveal reveal-delay-2">
      <form id="bookingForm" onSubmit={handleFormSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input type="text" className="form-control" placeholder="Full Name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone / WhatsApp</label>
            <input type="tel" className="form-control" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Event Date</label>
            <input type="date" className="form-control" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Event Type</label>
            <select className="form-control">
              <option value="">Select Event Type</option>
              <option>Wedding / Sangeet / Reception</option>
              <option>Corporate Event / Conference</option>
              <option>Award Night / Gala</option>
              <option>Cultural / Festive Event</option>
              <option>Team Building</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Expected Audience</label>
            <select className="form-control">
              <option value="">Audience Size</option>
              <option>Up to 100</option>
              <option>100 – 500</option>
              <option>500 – 1000</option>
              <option>1000 – 5000</option>
              <option>5000+</option>
            </select>
          </div>
        </div>
        <div className="form-group full">
          <label className="form-label">Event Location</label>
          <input type="text" className="form-control" placeholder="City, Venue Name" />
        </div>
        <div className="form-group full">
          <label className="form-label">Tell Me About Your Event</label>
          <textarea className="form-control" placeholder="Share the vision for your event — theme, special requests, languages needed..."></textarea>
        </div>
        <button type="submit" className="form-submit" style={isFormSuccess ? {background: "#2a7a2a", color: "#fff"} : {}}>
          {formStatus}
        </button>
        <div className="form-note">🔒 Your details are 100% private. Response within 24 hours guaranteed.</div>
      </form>
    </div>
  </div>
</section>

{/* FOOTER */}
<footer>
  <div className="footer-grid">
    <div className="footer-brand">
      <div className="footer-logo">Radha Dudeja</div>
      <p className="footer-brand-body">
        India's trilingual anchor & emcee, turning events into unforgettable experiences 
        — one stage at a time. Based in Uttarakhand, available PAN India.
      </p>
      <div className="footer-social-row">
        <a href="https://www.instagram.com/radha_dudeja_/" target="_blank" className="footer-social-icon" title="Instagram">📸</a>
        <a href="https://www.youtube.com/@anchorrd8794" target="_blank" className="footer-social-icon" title="YouTube">▶</a>
        <a href="https://starclinch.com/anchor-radha-dudeja" target="_blank" className="footer-social-icon" title="StarClinch">⭐</a>
        <a href="#booking" className="footer-social-icon" title="Book Now">📩</a>
      </div>
    </div>
    <div>
      <div className="footer-title">Navigation</div>
      <ul className="footer-links">
        <li><a href="#about">About Radha</a></li>
        <li><a href="#events">Event Types</a></li>
        <li><a href="#strengths">Strengths</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#videos">Videos</a></li>
        <li><a href="#booking">Book Radha</a></li>
      </ul>
    </div>
    <div>
      <div className="footer-title">Events</div>
      <ul className="footer-links">
        <li><a href="#events">Corporate Events</a></li>
        <li><a href="#events">Weddings & Sangeets</a></li>
        <li><a href="#events">Cultural Festivals</a></li>
        <li><a href="#events">Team Building</a></li>
        <li><a href="#events">Award Ceremonies</a></li>
        <li><a href="#events">Conferences</a></li>
      </ul>
    </div>
    <div>
      <div className="footer-title">Contact</div>
      <ul className="footer-links">
        <li><a href="mailto:info@radhadudeja.com">info@radhadudeja.com</a></li>
        <li><a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a></li>
        <li><a href="https://starclinch.com/anchor-radha-dudeja" target="_blank">Book via StarClinch</a></li>
        <li><a href="https://www.instagram.com/radha_dudeja_/" target="_blank">@radha_dudeja_</a></li>
      </ul>
    </div>
  </div>
  <div className="footer-bottom">
    <div className="footer-copy">
      © 2026 <span>Radha Dudeja</span>. All rights reserved. &nbsp;·&nbsp;
      Designed with ✦ passion ✦
    </div>
    <div className="footer-copy">
      "Let's create a <span>moment worth remembering</span>."
    </div>
  </div>
</footer>

    </div>
  );
}
