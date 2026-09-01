// ==============================================
// FEC 2026 | Página de envio de foto (/enviar)
// ==============================================
import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { SectionEyebrow, HUDCorners } from '../components/HUD';
import TermsModal from '../components/TermsModal';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [instagram, setInstagram] = useState('');
  const [lgpd, setLgpd] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ packet_code: string; created_at: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    setError(null);
    if (!f) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(f.type)) {
      setError('FORMATO_INVALIDO: envie apenas JPG, PNG ou WEBP.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('ARQUIVO_MUITO_GRANDE: o limite é de 10MB.');
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) return setError('Selecione uma imagem antes de enviar.');
    if (!lgpd) return setError('É necessário autorizar o uso da imagem (LGPD) para continuar.');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('nickname', nickname);
    formData.append('instagram', instagram);
    formData.append('lgpd_authorized', 'true');

    setSubmitting(true);
    try {
      const res = await api.uploadPhoto(formData);
      setResult({ packet_code: res.photo.packet_code, created_at: res.photo.created_at });
    } catch (err: any) {
      setError(err.message || 'Falha ao transmitir o pacote de dados.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center md:px-8">
        <CheckCircle2 className="mx-auto text-cyan" size={48} />
        <p className="mt-4 font-mono text-xs tracking-widest text-cyan">[ DATA PACKET TRANSMITTED ]</p>
        <h1 className="mt-2 font-display text-xl text-metal">Seu registro foi enviado com sucesso.</h1>
        <p className="mt-3 font-body text-sm text-metal/70">
          Sua foto entrou na fila de análise da moderação. Assim que aprovada, ela será injetada no
          sistema público.
        </p>
        <div className="hud-panel relative mt-8 space-y-2 p-5 text-left font-mono text-xs text-tech">
          <HUDCorners />
          <p>STATUS: <span className="text-cyan">PENDING_REVIEW</span></p>
          <p>PACKET_ID: <span className="text-cyan">{result.packet_code}</span></p>
          <p>TIMESTAMP: <span className="text-cyan">{new Date(result.created_at).toLocaleString('pt-BR')}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 md:px-8">
      <SectionEyebrow>UPLOAD DATA</SectionEyebrow>
      <h1 className="font-display text-lg text-metal">Enviar registro fotográfico</h1>
      <p className="mt-2 font-body text-sm text-metal/65">
        Envie seu registro para ser processado pela nossa equipe de moderação.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Área de upload */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0] || null);
          }}
          onClick={() => inputRef.current?.click()}
          className={`hud-panel relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 border-dashed p-6 text-center transition ${
            dragOver ? 'border-cyan/60 shadow-neon' : ''
          }`}
        >
          <HUDCorners />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          {!preview && (
            <>
              <UploadCloud className="text-cyan" size={32} />
              <p className="font-mono text-xs text-metal/70">
                Arraste sua imagem aqui ou toque para selecionar
              </p>
              <p className="font-mono text-[10px] text-tech">JPG · PNG · WEBP — até 10MB</p>
            </>
          )}
          {preview && (
            <div className="relative w-full">
              <img src={preview} alt="Pré-visualização" className="mx-auto max-h-64 object-contain" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute -top-3 right-0 rounded-full bg-black/70 p-1.5 text-metal hover:text-danger"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Identificação */}
        <div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-cyan/80">
            Identificação
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            onBlur={() => setNickname((n) => n || instagram)}
            placeholder="@seuinstagram"
            className="w-full border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-metal placeholder:text-tech focus:border-cyan/50 focus:outline-none"
          />
        </div>

        {/* LGPD */}
        <label className="flex items-start gap-3 font-body text-xs text-metal/75">
          <input
            type="checkbox"
            checked={lgpd}
            onChange={(e) => setLgpd(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-cyan"
          />
          <span>
            Autorizo o uso e a publicação da imagem enviada neste projeto da FEC 2026, conforme os termos
            apresentados.{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-cyan underline underline-offset-2"
            >
              [ VER TERMOS DE USO ]
            </button>
          </span>
        </label>

        {error && (
          <p className="border border-danger/40 bg-danger/10 px-4 py-2 font-mono text-xs text-danger">
            [ ERROR ] {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !file || !lgpd}
          className="w-full border border-cyan bg-cyan/10 py-3 font-mono text-xs uppercase tracking-widest text-cyan shadow-neon transition hover:bg-cyan/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'transmitindo_pacote...' : 'Transmitir registro'}
        </button>
      </form>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
