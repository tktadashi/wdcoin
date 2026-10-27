import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';

export const WhatsAppFloat: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { isDark } = useTheme();
  const { storeConfig } = useStore();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      
      {/* Mini Tooltip Bubble */}
      {showTooltip && (
        <div
          className={`relative px-3.5 py-2 rounded-xl text-xs max-w-[210px] hidden sm:flex items-center gap-2 border transition-colors ${
            isDark
              ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC] shadow-xl'
              : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-md'
          }`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${isDark ? 'bg-[#25D366]' : 'bg-[#168B4B]'}`} />
          <p className="leading-tight text-[11px] font-normal font-sans">
            Dúvidas ou envio de comprovante?{' '}
            <strong className={`font-semibold ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`}>
              Fale comigo!
            </strong>
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="ml-1 p-0.5 opacity-60 hover:opacity-100 cursor-pointer"
            aria-label="Fechar dica"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="btn-whatsapp-floating"
        href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá%20WD%20Coins,%20estou%20no%20site%20e%20gostaria%20de%20tirar%20uma%20dúvida!`}
        target="_blank"
        rel="noopener noreferrer"
        title="Falar no WhatsApp"
        className={`group relative w-13 h-13 rounded-full text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
          isDark
            ? 'bg-[#25D366] hover:bg-[#20bd5a]'
            : 'bg-[#168B4B] hover:bg-[#12723d]'
        }`}
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        
        {/* Subtle Online Ping */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-current animate-pulse" />
      </a>
    </div>
  );
};
