import React from 'react';
import { GameId } from '../types';
import { GAMES } from '../data/storeData';
import { Sparkles, Shield, Coins, ArrowRight, Server } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface GamesBannerProps {
  onSelectGame: (gameId: GameId) => void;
}

export const GamesBanner: React.FC<GamesBannerProps> = ({ onSelectGame }) => {
  const { isDark } = useTheme();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Shield':
        return <Shield className={`w-5 h-5 ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`} />;
      case 'Coins':
      default:
        return <Coins className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section className={`py-12 border-t transition-colors ${
      isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
              isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
            }`}>
              Catálogo Especializado
            </div>
            <h2 
              data-typography="section-title"
              className={`text-2xl sm:text-3xl font-semibold font-display ${
                isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
              }`}
            >
              Jogos em Destaque
            </h2>
          </div>
          <p 
            data-typography="description"
            className={`text-xs sm:text-sm font-normal font-sans max-w-md ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Selecione seu jogo para explorar pacotes de Kinah, moedas, joias e itens com entrega direta no personagem.
          </p>
        </div>

        {/* 4 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {GAMES.map((game) => (
            <div
              key={game.id}
              id={`game-card-${game.id}`}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-[#1D1E23] border-[#303036] hover:border-[#45454d]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] hover:border-[#b5b0a8] shadow-xs'
              }`}
            >
              <div>
                {/* Header with Icon & Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    isDark
                      ? 'bg-[#191A1E] border-[#303036]'
                      : 'bg-[#ECE9E3] border-[#DDD8D1]'
                  }`}>
                    {getIcon(game.iconName)}
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    isDark
                      ? 'bg-[#15161A] text-[#25D366] border-[#25D366]/30'
                      : 'bg-[#ECE9E3] text-[#168B4B] border-[#168B4B]/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>Disponível</span>
                  </span>
                </div>

                {/* Game Title and Tagline */}
                <h3 
                  data-typography="game-name"
                  className={`text-lg sm:text-xl font-bold font-display ${
                    isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                  }`}
                >
                  {game.name}
                </h3>
                <p className={`text-xs font-semibold mt-1 mb-2.5 ${
                  isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                }`}>
                  {game.tagline}
                </p>
                <p 
                  data-typography="description"
                  className={`text-xs leading-relaxed mb-4 font-normal font-sans ${
                    isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                  }`}
                >
                  {game.description}
                </p>

                {/* Features List */}
                <div className="space-y-1.5 mb-4 text-xs">
                  {game.features.map((feat, idx) => (
                    <div key={idx} className={`flex items-center gap-2 ${
                      isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                      }`} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Server Info */}
                <div className={`pt-3 border-t mb-4 ${
                  isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
                }`}>
                  <div className={`flex items-center gap-1.5 text-[11px] ${
                    isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                  }`}>
                    <Server className="w-3.5 h-3.5 opacity-70" />
                    <span>
                      {game.availableServers.length > 0 
                        ? `Servidor: ${game.availableServers.join(' / ')}`
                        : 'Servidor Único Oficial'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`btn-explore-${game.id}`}
                onClick={() => onSelectGame(game.id)}
                data-typography="button"
                className={`w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold font-sans flex items-center justify-center gap-1.5 transition-colors border cursor-pointer ${
                  isDark
                    ? 'bg-[#191A1E] hover:bg-[#22242a] border-[#303036] text-[#F4F1EC]'
                    : 'bg-[#ECE9E3] hover:bg-[#e4e0d8] border-[#DDD8D1] text-[#202124]'
                }`}
              >
                <span>Ver Produtos de {game.shortName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
