// ==============================================
// FEC 2026 | Rodapé estilo terminal
// ==============================================
import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-cyan/15 bg-panel/60 px-4 py-8 font-mono text-xs text-tech md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="tracking-widest text-cyan/80">FEC_2026</p>
          <p>UNIARA — INFORMATION SYSTEMS — 4TH SEMESTER</p>
        </div>
        <div className="space-y-1 md:text-right">
          <p><span className="text-cyan/70">SYSTEM STATUS:</span> ONLINE</p>
          <p><span className="text-cyan/70">DATABASE:</span> CONNECTED</p>
          <p><span className="text-cyan/70">SECURITY PROTOCOL:</span> ACTIVE</p>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl border-t border-white/5 pt-4 text-[10px] text-tech/70">
        root@fec:~$ transmission_complete // access_level: public // FEC_2026 · SYS_04 · NODE_004
      </p>
    </footer>
  );
}
