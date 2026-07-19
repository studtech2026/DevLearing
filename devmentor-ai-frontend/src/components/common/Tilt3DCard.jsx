import React, { useRef } from "react";

/**
 * Tilt3DCard
 *
 * Wraps any card content and gives it a real, mouse-tracked 3D tilt
 * plus a soft moving glare — the kind of subtle depth effect premium
 * dashboards use. Pure CSS transforms + refs (no extra dependencies,
 * no re-renders on mousemove).
 *
 * Usage:
 *   <Tilt3DCard accent="from-purple-500 to-fuchsia-500">
 *     <StatCard ... />
 *   </Tilt3DCard>
 */
export default function Tilt3DCard({ children, className = "", accent, maxTilt = 7, glare = true }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;

    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.14), transparent 55%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {accent && (
        <div
          aria-hidden="true"
          className={`absolute inset-x-3 top-0 h-[2.5px] rounded-full bg-gradient-to-r ${accent} opacity-80 z-10`}
        />
      )}

      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 z-10"
          style={{ mixBlendMode: "overlay" }}
        />
      )}

      <div className="relative [transform:translateZ(20px)]">{children}</div>
    </div>
  );
}
