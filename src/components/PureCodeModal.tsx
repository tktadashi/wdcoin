import React, { useState } from 'react';
import { STANDALONE_HTML_CODE } from '../data/pureCodeString';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PureCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PureCodeModal: React.FC<PureCodeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { isDark, isRed } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(STANDALONE_HTML_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([STANDALONE_HTML_CODE], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'index.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="pure-code-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="pure-code-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${
          isDark
            ? 'bg-[#10141f] border-purple-500/30 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-purple-500/20 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isDark
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                : isRed
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-purple-50 text-purple-600 border-purple-200'
            }`}>
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold font-display flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>Código HTML + CSS + JS Puro (Pronto para Copiar)</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  isDark
                    ? 'bg-purple-500/30 text-purple-200 border-purple-400/30'
                    : isRed
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  Arquivo Único
                </span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                100% autônomo, sem dependências ou frameworks. Salve como <strong>index.html</strong> e suba em qualquer hospedagem!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className={`p-3.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          isDark ? 'bg-slate-950 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <div>
            Dica: No código abaixo, edite a constante <code className={isDark ? 'text-amber-200' : 'text-purple-700 font-bold'}>STORE_CONFIG</code> com seu WhatsApp e Chave PIX!
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm border ${
                isDark
                  ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border-purple-400/40'
                  : isRed
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Código Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Código Completo</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Baixar index.html</span>
            </button>
          </div>
        </div>

        {/* Code Preview Area (Editor Dark theme looks best for code readability) */}
        <div className="flex-1 overflow-auto p-4 bg-[#0d1117] font-mono text-xs text-slate-200 border-y border-slate-800">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {STANDALONE_HTML_CODE}
          </pre>
        </div>

        {/* Footer */}
        <div className={`p-3.5 flex items-center justify-between text-xs ${
          isDark ? 'border-t border-purple-500/15 bg-slate-900/60 text-slate-400' : 'border-t border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <span>Totalmente comentado em português para facilitar personalizações futuras.</span>
          <button
            onClick={onClose}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
