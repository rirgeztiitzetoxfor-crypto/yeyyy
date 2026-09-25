import React, { useEffect, useRef } from "react";

export interface MotionVideoBackgroundProps {
  variant?: "fullscreen" | "section" | "card" | "hero";
  overlayOpacity?: number; // 0 to 1
  accentColor?: "gold" | "crimson" | "obsidian";
  className?: string;
  children?: React.ReactNode;
}

export default function MotionVideoBackground({
  variant = "fullscreen",
  overlayOpacity = 0.65,
  accentColor = "gold",
  className = "",
  children,
}: MotionVideoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Particle motion video simulation: sweeping beams, glowing bokeh, and champagne stardust
    const particleCount = variant === "card" ? 18 : 42;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4 - 0.2, // gentle upward drift
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    // Stage spotlight beams sweep back and forth continuously
    let beamAngle1 = 0;
    let beamAngle2 = Math.PI / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Moving ambient light gradient (Simulated continuous motion video atmosphere)
      beamAngle1 += 0.008;
      beamAngle2 += 0.006;

      const beamX1 = width * (0.5 + Math.sin(beamAngle1) * 0.35);
      const beamY1 = height * 0.2;
      const grad1 = ctx.createRadialGradient(beamX1, beamY1, 20, beamX1, beamY1, width * 0.6);

      if (accentColor === "crimson") {
        grad1.addColorStop(0, "rgba(204, 41, 54, 0.16)");
        grad1.addColorStop(0.5, "rgba(240, 98, 146, 0.06)");
        grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        // Gold / Obsidian
        grad1.addColorStop(0, "rgba(201, 168, 76, 0.18)");
        grad1.addColorStop(0.5, "rgba(226, 199, 117, 0.07)");
        grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      }

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Beam 2 (Secondary counter-sweep)
      const beamX2 = width * (0.5 + Math.cos(beamAngle2) * 0.4);
      const beamY2 = height * 0.7;
      const grad2 = ctx.createRadialGradient(beamX2, beamY2, 40, beamX2, beamY2, width * 0.5);
      grad2.addColorStop(0, accentColor === "crimson" ? "rgba(180, 20, 40, 0.12)" : "rgba(180, 140, 40, 0.12)");
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Floating Champagne Stardust Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.angle));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          accentColor === "crimson"
            ? `rgba(240, 98, 146, ${currentAlpha})`
            : `rgba(226, 199, 117, ${currentAlpha})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = accentColor === "crimson" ? "#F06292" : "#C9A84C";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [accentColor, variant]);

  const containerClasses =
    variant === "fullscreen"
      ? "fixed inset-0 pointer-events-none z-0 overflow-hidden"
      : variant === "section"
      ? "relative w-full overflow-hidden"
      : "relative overflow-hidden";

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* HTML5 Looping Motion Video (Subtle Ambient Stage Atmosphere) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-25 mix-blend-screen scale-105 transition-transform duration-1000"
        style={{ filter: "brightness(0.85) contrast(1.2) saturate(1.1)" }}
        poster="/images/img_14.jpg"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-curtain-of-golden-particles-slowly-falling-31804-large.mp4"
          type="video/mp4"
        />
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41444-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dynamic Animated Motion Canvas (Spotlight Sweeps & Stardust) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Darkening Gradient Overlay to Ensure Content Contrast */}
      <div
        className="absolute inset-0 pointer-events-none bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Section Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

