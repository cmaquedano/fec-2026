// ==============================================
// FEC 2026 | Tela inicial de carregamento
// ==============================================
import React, { useEffect, useState } from 'react';

const LINES = [
  'INITIALIZING FEC_NETWORK...',
  'LOADING DATABASE...',
  'AUTHENTICATING CONNECTION...',
  'ACCESS GRANTED',
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1300; // curto: não prender o usuário

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setLineIndex(Math.min(LINES.length - 1, Math.floor((pct / 100) * LINES.length)));

      if (pct >= 100) {
        clearInterval(tick);
        setTimeout(onDone, 250);
      }
    }, 40);

    return () => clearInterval(tick);
  }, [onDone]);

  const filled = Math.round(progress / 5);
  const bar = '█'.repeat(filled) + '░'.repeat(20 - filled);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void bg-grid px-6">
      <p className="font-display text-lg tracking-[0.3em] text-cyan text-glow-cyan md:text-2xl">
        FEC_2026
      </p>
      <p className="mt-6 font-mono text-xs text-metal/80 md:text-sm">{LINES[lineIndex]}</p>
      <p className="mt-3 font-mono text-xs text-cyan/80 md:text-sm">
        [{bar}] {progress}%
      </p>
    </div>
  );
}
