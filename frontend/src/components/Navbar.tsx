// ==============================================
// FEC 2026 | Navegação principal
// ==============================================
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/#system', label: 'SYSTEM' },
  { to: '/galeria', label: 'GALLERY' },
  { to: '/enviar', label: 'UPLOAD' },
  { to: '/#curso', label: 'COURSE' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-cyan/15 bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <NavLink to="/" className="font-display text-sm tracking-[0.25em] text-cyan text-glow-cyan">
          [ FEC_2026 ]
        </NavLink>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="font-mono text-xs tracking-widest text-metal/70 transition hover:text-cyan hover:text-glow-cyan"
            >
              // {l.label}
            </a>
          ))}
          <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-cyan/80">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulseGlow" /> SYSTEM ONLINE
          </span>
        </nav>

        <button
          className="text-cyan md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-cyan/15 bg-panel/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.to}
                onClick={() => setOpen(false)}
                className="font-mono text-sm tracking-widest text-metal/80 hover:text-cyan"
              >
                // {l.label}
              </a>
            ))}
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-cyan/80">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulseGlow" /> SYSTEM ONLINE
            </span>
          </div>
        </nav>
      )}
    </header>
  );
}
