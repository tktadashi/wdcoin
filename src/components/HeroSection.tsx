import { Zap, ShieldCheck, MessageCircle, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SearchArea } from './SearchArea';
import { GameId } from '../types';

interface HeroSectionProps {
  onSelectGame: (gameId: GameId | 'idle') => void;
  onGoToOrders?: (prefill?: string) => void;
  onGoToIntermediation?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectGame,
  onGoToOrders,
  onGoToIntermediation,
}) => {
  const { isDark } = useTheme();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Main Headline */}
        <h1
          data-typography="hero-title"
          className={`hero-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.15] font-display ${
            isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
          }`}
        >
          Tudo o que você precisa para{' '}
          <span className={isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}>
            ir além.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          data-typography="description"
          className={`mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal font-sans leading-relaxed ${
            isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
          }`}
        >
          Pesquise o seu jogo de interesse e confira o que cada usuário verificado está vendendo com intermediação segura.
        </p>

        {/* Dedicated Game Search Area for Customers */}
        <div className="mt-8 sm:mt-9 max-w-2xl mx-auto">
          <SearchArea
            onSelectGame={onSelectGame}
            onGoToOrders={onGoToOrders}
            onGoToIntermediation={onGoToIntermediation}
          />
        </div>

        {/* Value Highlights Strip - Clean & Discreet */}
        <div className="mt-14 sm:mt-18 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left">
          
          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#191A1E] border-[#303036]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-2.5 ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036] text-[#25D366]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#168B4B]'
            }`}>
              <Zap className="w-4 h-4" />
            </div>
            <div className={`text-xs font-semibold font-sans ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              PIX & Crypto
            </div>
            <div className={`text-[11px] font-normal font-sans mt-0.5 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              Pagamento rápido e seguro
            </div>
          </div>

          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#191A1E] border-[#303036]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-2.5 ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className={`text-xs font-semibold font-sans ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Entrega Direta
            </div>
            <div className={`text-[11px] font-normal font-sans mt-0.5 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              Manual no seu personagem
            </div>
          </div>

          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#191A1E] border-[#303036]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-2.5 ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
            <div className={`text-xs font-semibold font-sans ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Rapidez no Envio
            </div>
            <div className={`text-[11px] font-normal font-sans mt-0.5 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              Média de 10 a 25 minutos
            </div>
          </div>

          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-colors ${
              isDark
                ? 'bg-[#191A1E] border-[#303036]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border mb-2.5 ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036] text-[#25D366]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#168B4B]'
            }`}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className={`text-xs font-semibold font-sans ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Suporte Humano
            </div>
            <div className={`text-[11px] font-normal font-sans mt-0.5 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              Atendimento no WhatsApp
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
