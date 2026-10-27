import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ArrowRight, Gamepad2, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { GAMES } from '../data/storeData';
import { GameId } from '../types';

export interface SearchableGameEntry {
  id: GameId | 'idle';
  name: string;
  tagline: string;
  aliases: string[];
  sellerCount: number;
  offerCount: number;
  isGroup?: boolean;
}

interface SearchAreaProps {
  onSelectGame: (gameId: GameId | 'idle') => void;
  onGoToOrders?: (prefillGame?: string) => void;
  onGoToIntermediation?: () => void;
  compact?: boolean;
  hideQuickLinks?: boolean;
  className?: string;
}

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export const SearchArea: React.FC<SearchAreaProps> = ({
  onSelectGame,
  onGoToOrders,
  onGoToIntermediation,
  compact = false,
  hideQuickLinks = false,
  className = 'max-w-2xl mx-auto',
}) => {
  const { isDark } = useTheme();
  const { products, onlyShowRegisteredDemand } = useStore();
  const [gameQuery, setGameQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active products with demand
  const activeProducts = useMemo(() => {
    return products.filter((p) => {
      const hasActiveDemand =
        p.inStock !== false && p.stockStatus !== 'sob_encomenda' && p.hasDemand !== false;
      if (!hasActiveDemand) return false;
      if (onlyShowRegisteredDemand && !p.isRegisteredByAdmin) return false;
      return true;
    });
  }, [products, onlyShowRegisteredDemand]);

  // Build searchable games list (ONLY GAMES + Idle Category + Custom Admin Games)
  const gameEntries = useMemo<SearchableGameEntry[]>(() => {
    const entries: SearchableGameEntry[] = [];

    // 1. Standard Games from GAMES
    for (const game of GAMES) {
      const gameProds = activeProducts.filter((p) => p.gameId === game.id);
      const uniqueSellers = new Set(
        gameProds.map((p) => (p.sellerName?.trim() || 'WD Coins Oficial').toLowerCase())
      );
      entries.push({
        id: game.id,
        name: game.shortName || game.name,
        tagline: game.tagline,
        aliases: [game.name, game.shortName, ...(game.aliases || [])],
        sellerCount: uniqueSellers.size,
        offerCount: gameProds.length,
      });
    }

    // 2. Dynamic Custom Games registered by Admin in products
    const knownIds = new Set(GAMES.map((g) => g.id));
    const customGameMap = new Map<string, { id: string; name: string }>();
    for (const prod of products) {
      if (!knownIds.has(prod.gameId)) {
        const displayName = prod.customGameName?.trim() || prod.gameId;
        if (!customGameMap.has(prod.gameId)) {
          customGameMap.set(prod.gameId, { id: prod.gameId, name: displayName });
        }
      }
    }

    for (const custom of customGameMap.values()) {
      const gameProds = activeProducts.filter((p) => p.gameId === custom.id);
      const uniqueSellers = new Set(
        gameProds.map((p) => (p.sellerName?.trim() || 'WD Coins Oficial').toLowerCase())
      );
      entries.push({
        id: custom.id,
        name: custom.name,
        tagline: 'Anúncios de usuários verificados',
        aliases: [custom.name, custom.id],
        sellerCount: uniqueSellers.size,
        offerCount: gameProds.length,
      });
    }

    // 3. "Jogos Idle" unified entry
    const idleGameIds = new Set(
      GAMES.filter((g) => g.isIdle).map((g) => g.id)
    );
    const idleProds = activeProducts.filter(
      (p) =>
        idleGameIds.has(p.gameId) ||
        normalizeSearchText(p.customGameName || p.gameId).includes('idle')
    );
    const idleSellers = new Set(
      idleProds.map((p) => (p.sellerName?.trim() || 'WD Coins Oficial').toLowerCase())
    );

    entries.splice(2, 0, {
      id: 'idle',
      name: 'Jogos Idle',
      tagline: 'Poke Idle World, Mu Lorvath e outros jogos Idle',
      aliases: ['jogos idle', 'idle', 'idle games', 'jogos'],
      sellerCount: idleSellers.size,
      offerCount: idleProds.length,
      isGroup: true,
    });

    return entries;
  }, [activeProducts, products]);

  // Filter ONLY games by user query
  const matchedGames = useMemo(() => {
    const q = normalizeSearchText(gameQuery);
    if (!q) return gameEntries;

    const qNoSpaces = q.replace(/\s+/g, '');

    return gameEntries.filter((entry) => {
      return entry.aliases.some((alias) => {
        const normAlias = normalizeSearchText(alias);
        const normAliasNoSpaces = normAlias.replace(/\s+/g, '');
        return normAlias.includes(q) || normAliasNoSpaces.includes(qNoSpaces);
      });
    });
  }, [gameQuery, gameEntries]);

  const handleChooseGame = (gameId: GameId | 'idle') => {
    setIsFocused(false);
    setGameQuery('');
    onSelectGame(gameId);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedGames.length > 0) {
      handleChooseGame(matchedGames[0].id);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Game-Only Search Input */}
      <form onSubmit={handleFormSubmit} className="relative">
        <div
          className={`flex items-center rounded-2xl border transition-all duration-200 ${
            isFocused
              ? isDark
                ? 'border-[#C7B0D4] bg-[#111214] ring-2 ring-[#C7B0D4]/20 shadow-lg'
                : 'border-[#80658F] bg-[#FFFFFF] ring-2 ring-[#80658F]/20 shadow-md'
              : isDark
              ? 'border-[#303036] bg-[#191A1E] hover:border-[#45454d]'
              : 'border-[#DDD8D1] bg-[#FFFFFF] hover:border-[#b5b0a8] shadow-xs'
          } ${compact ? 'px-3 py-1.5' : 'px-4 py-2.5 sm:py-3'}`}
        >
          <Search
            className={`shrink-0 transition-colors ${
              compact ? 'w-4 h-4 mr-2.5' : 'w-5 h-5 mr-3'
            } ${
              isFocused
                ? isDark
                  ? 'text-[#C7B0D4]'
                  : 'text-[#80658F]'
                : isDark
                ? 'text-[#AAA9B0]'
                : 'text-[#68676D]'
            }`}
          />

          <input
            type="text"
            value={gameQuery}
            onChange={(e) => {
              setGameQuery(e.target.value);
              if (!isFocused) setIsFocused(true);
            }}
            onFocus={() => setIsFocused(true)}
            placeholder={
              compact
                ? 'Buscar jogo...'
                : 'Procure pelo jogo... (Ex: Aion 2, Priston Tale, Jogos Idle)'
            }
            aria-label="Pesquisar jogos"
            className={`w-full bg-transparent border-none focus:outline-none font-sans transition-colors ${
              compact ? 'text-xs' : 'text-xs sm:text-sm'
            } ${
              isDark
                ? 'text-[#F4F1EC] placeholder-[#AAA9B0]/60'
                : 'text-[#202124] placeholder-[#68676D]/60'
            }`}
          />

          {gameQuery && (
            <button
              type="button"
              onClick={() => setGameQuery('')}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-xs opacity-70 hover:opacity-100 transition-opacity mr-1.5 cursor-pointer"
              title="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className={`shrink-0 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
            }`}
          >
            <span>Buscar</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </form>

      {/* Quick Game Filter Buttons (Hero Mode) */}
      {!compact && !hideQuickLinks && (
        <div className="flex items-center gap-1.5 mt-3 flex-wrap justify-center text-xs">
          <span
            className={`text-[11px] font-medium mr-1 ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Jogos:
          </span>
          {gameEntries.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => handleChooseGame(game.id)}
              className={`px-3 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#15161A] border-[#303036] text-[#F4F1EC] hover:border-[#C7B0D4] hover:bg-[#1D1E23]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] hover:border-[#80658F] hover:bg-[#ECE9E3]'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown: Games Only */}
      {isFocused && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 rounded-2xl border shadow-2xl z-50 overflow-hidden backdrop-blur-xl text-left transition-all ${
            isDark
              ? 'bg-[#191A1E]/98 border-[#303036] text-[#F4F1EC]'
              : 'bg-[#FFFFFF]/98 border-[#DDD8D1] text-[#202124]'
          }`}
        >
          <div
            className={`px-4 py-2.5 border-b text-xs flex items-center justify-between font-medium ${
              isDark
                ? 'bg-[#15161A] border-[#303036] text-[#AAA9B0]'
                : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D]'
            }`}
          >
            <span>
              {gameQuery.trim()
                ? `${matchedGames.length} ${
                    matchedGames.length === 1 ? 'jogo encontrado' : 'jogos encontrados'
                  }`
                : 'Selecione um jogo para ver o que cada usuário está vendendo'}
            </span>
          </div>

          {matchedGames.length > 0 ? (
            <div className="max-h-80 overflow-y-auto divide-y divide-inherit/20 p-1.5">
              {matchedGames.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleChooseGame(game.id)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-[#1D1E23]' : 'hover:bg-[#F5F3EF]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                        isDark
                          ? 'bg-[#111214] border-[#303036] text-[#C7B0D4]'
                          : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold font-display truncate">
                        {game.name}
                      </div>
                      <div
                        className={`text-[11px] flex items-center gap-1.5 flex-wrap mt-0.5 ${
                          isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                        }`}
                      >
                        <Users className="w-3 h-3 shrink-0 opacity-75" />
                        {game.sellerCount > 0 ? (
                          <span>
                            {game.sellerCount}{' '}
                            {game.sellerCount === 1 ? 'usuário vendendo' : 'usuários vendendo'} ·{' '}
                            {game.offerCount}{' '}
                            {game.offerCount === 1 ? 'item anunciado' : 'itens anunciados'}
                          </span>
                        ) : (
                          <span>Nenhum anúncio ativo no momento · Sob encomenda</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 text-xs font-semibold flex items-center gap-1 ${
                      isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                    }`}
                  >
                    <span className="hidden sm:inline">Ver vendedores</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center space-y-3">
              <p className={`text-xs ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                O jogo <strong>&quot;{gameQuery}&quot;</strong> ainda não possui anúncios listados.
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {onGoToOrders && (
                  <button
                    type="button"
                    onClick={() => {
                      const q = gameQuery;
                      setIsFocused(false);
                      setGameQuery('');
                      onGoToOrders(q);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDark ? 'bg-[#E7DED0] text-[#202124]' : 'bg-[#25242A] text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fazer Encomenda para &quot;{gameQuery}&quot;</span>
                  </button>
                )}
                {onGoToIntermediation && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsFocused(false);
                      setGameQuery('');
                      onGoToIntermediation();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isDark
                        ? 'border-[#303036] text-[#F4F1EC] hover:bg-[#1D1E23]'
                        : 'border-[#DDD8D1] text-[#202124] hover:bg-[#ECE9E3]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Intermediação Segura</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
