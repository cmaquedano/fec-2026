// ==============================================
// FEC 2026 | Página inicial (Hero + Status + Curso)
// ==============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Eye, BrainCircuit, Database, ShieldCheck, Cloud, BarChart3, Cog } from 'lucide-react';
import { HUDBadge, SectionEyebrow, HUDCorners } from '../components/HUD';
import StatusPanel from '../components/StatusPanel';

const MODULES = [
  { icon: BrainCircuit, title: 'NEURAL AI', id: 'MOD_01', desc: 'Inteligência Artificial, Machine Learning e algoritmos.' },
  { icon: Database, title: 'DATA CORE', id: 'MOD_02', desc: 'Banco de dados, estruturas de dados e gerenciamento de informação.' },
  { icon: ShieldCheck, title: 'CYBERSECURITY', id: 'MOD_03', desc: 'Segurança da informação, criptografia e proteção de dados.' },
  { icon: Cloud, title: 'WEB & CLOUD SYSTEMS', id: 'MOD_04', desc: 'Desenvolvimento web, sistemas distribuídos e computação em nuvem.' },
  { icon: BarChart3, title: 'DATA ANALYTICS', id: 'MOD_05', desc: 'Análise de dados, inteligência de negócios e tomada de decisão.' },
  { icon: Cog, title: 'SOFTWARE ENGINEERING', id: 'MOD_06', desc: 'Desenvolvimento, arquitetura e manutenção de sistemas.' },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-grid px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden font-mono text-[10px] leading-5 text-cyan/10 md:text-xs">
          <p className="absolute left-4 top-4">INITIALIZING MATRIX...</p>
          <p className="absolute left-4 top-10">CONNECTING TO FEC_NETWORK...</p>
          <p className="absolute left-4 top-16">VERIFYING USER...</p>
          <p className="absolute left-4 top-24 text-cyan/20">ACCESS_GRANTED</p>
          <p className="absolute right-4 top-4">SELECT * FROM visitantes WHERE vibe = 'tech';</p>
          <p className="absolute bottom-4 right-4">01000110 01000101 01000011</p>
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <HUDBadge label="SYSTEM: ONLINE" />
            <HUDBadge label="LOCATION: UNIARA_CAMPUS" tone="blue" />
            <HUDBadge label="PROTOCOL: FEC_2026" />
          </div>

          <h1 className="font-display text-3xl uppercase leading-tight tracking-wide text-metal md:text-5xl">
            <span className="block text-cyan text-glow-cyan">Conexão estabelecida:</span>
            Sistemas de Informação
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-sm text-metal/70 md:text-base">
            Você acessou a rede do 4º Semestre. Explore nossa infraestrutura, envie seus registros
            visuais e faça parte do banco de imagens da FEC.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/enviar"
              className="flex items-center gap-2 border border-cyan bg-cyan/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-cyan shadow-neon transition hover:bg-cyan/20"
            >
              <Camera size={16} /> Upload de dados // Enviar foto
            </Link>
            <Link
              to="/galeria"
              className="flex items-center gap-2 border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-widest text-metal/80 transition hover:border-blueTech/50 hover:text-blueTech"
            >
              <Eye size={16} /> Decodificar galeria // Ver fotos
            </Link>
          </div>
        </div>
      </section>

      {/* STATUS DO SISTEMA */}
      <StatusPanel />

      {/* ARQUITETURA DO CURSO */}
      <section id="curso" className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <SectionEyebrow>ARQUITETURA DO CURSO: O QUE FAZEMOS?</SectionEyebrow>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <div
              key={m.id}
              className="hud-panel group relative p-5 transition hover:border-cyan/40 hover:shadow-neon"
            >
              <HUDCorners />
              <div className="flex items-center justify-between">
                <m.icon className="text-cyan" size={26} />
                <span className="font-mono text-[10px] tracking-widest text-tech">{m.id}</span>
              </div>
              <h3 className="mt-4 font-display text-sm tracking-widest text-metal">{m.title}</h3>
              <p className="mt-2 font-body text-xs text-metal/65">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
