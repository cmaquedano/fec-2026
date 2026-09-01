// ==============================================
// FEC 2026 | Pequenos elementos HUD reutilizáveis
// ==============================================
import React from 'react';

export function HUDBadge({ label, tone = 'cyan' }: { label: string; tone?: 'cyan' | 'blue' | 'alert' }) {
  const toneClasses = {
    cyan: 'border-cyan/40 text-cyan shadow-neon',
    blue: 'border-blueTech/40 text-blueTech shadow-neonBlue',
    alert: 'border-alert/40 text-alert shadow-neonAlert',
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border ${toneClasses} bg-black/40 px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulseGlow" />
      {label}
    </span>
  );
}

export function HUDCorners() {
  return (
    <>
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
    </>
  );
}

export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.3em] text-cyan/80 uppercase mb-3 flex items-center gap-2">
      <span className="text-cyan">//</span> {children}
    </p>
  );
}

export function ScanlineOverlay() {
  return (
    <>
      <div className="scanline-overlay" />
      <div className="scanline-beam animate-scan" />
    </>
  );
}
