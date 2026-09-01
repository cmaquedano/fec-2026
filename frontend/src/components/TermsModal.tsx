// ==============================================
// FEC 2026 | Modal de termos LGPD (estrutura pronta para texto oficial)
// ==============================================
import React from 'react';
import { X } from 'lucide-react';

export default function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="hud-panel relative max-h-[80vh] w-full max-w-xl overflow-y-auto p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-tech transition hover:text-cyan"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
        <p className="font-mono text-xs tracking-widest text-cyan/80">// DATA &amp; IMAGE POLICY</p>
        <h2 className="mt-2 font-display text-lg text-metal">TERMOS DE USO E IMAGEM — LGPD</h2>

        <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-metal/85">
          <p>
            <strong className="text-cyan">Finalidade do envio:</strong> as imagens enviadas neste sistema
            têm como objetivo registrar a participação do público na Feira de Cursos (FEC) 2026, promovida
            pelo curso de Sistemas de Informação da UNIARA.
          </p>
          <p>
            <strong className="text-cyan">Finalidade da publicação:</strong> após passar por moderação, a
            imagem poderá ser publicada na galeria pública deste site, associada ao apelido ou perfil de
            Instagram informado (quando fornecido).
          </p>
          <p>
            <strong className="text-cyan">Responsabilidade sobre o conteúdo:</strong> o participante declara
            ser o titular da imagem enviada e se responsabiliza pela veracidade e adequação do conteúdo.
          </p>
          <p>
            <strong className="text-cyan">Remoção de conteúdo:</strong> é possível solicitar a remoção da
            imagem publicada entrando em contato com a organização da FEC/UNIARA, conforme os canais
            oficiais divulgados pelo evento.
          </p>
          <div className="border border-alert/30 bg-alert/5 p-3 font-mono text-xs text-alert/90">
            [ AVISO ] Este é um texto estrutural provisório. O texto jurídico oficial deverá ser fornecido
            pelos responsáveis da FEC/UNIARA e inserido neste componente antes da publicação em produção.
          </div>
        </div>
      </div>
    </div>
  );
}
