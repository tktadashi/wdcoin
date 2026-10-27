import React, { useState, useMemo } from 'react';
import { GameId, ProductCategory, Product } from '../types';
import { GAMES } from '../data/storeData';
import {
  Sparkles,
  Coins,
  Shield,
  Layers,
  Heart,
  ShieldCheck,
  User,
  Zap,
  Clock,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import { SearchArea } from './SearchArea';

interface ProductCatalogProps {
  selectedGame: GameId | 'all' | 'idle';
  onSelectGame: (gameId: GameId | 'all' | 'idle') => void;
  onBuyProduct: (product: Product) => void;
  onOrderCustom?: (product?: Product) => void;
  onGoToIntermediation?: () => void;
}

interface SellerGroup {
  sellerKey: string;
  sellerName: string;
  initials: string;
  gamesList: string[];
  items: Product[];
}

const getInitials = (name: string) => {
  const parts = name.replace(/[_.-]+/g, ' ').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  selectedGame,
  onSelectGame,
  onBuyProduct,
  onOrderCustom,
  onGoToIntermediation,
}) => {
  const { isDark } = useTheme();
  const { products, favorites, toggleFavorite, isFavorite, onlyShowRegisteredDemand } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedSeller, setSelectedSeller] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Reset seller filter if game changes
  const handleGameTabChange = (gameId: GameId | 'all' | 'idle') => {
    setSelectedSeller('all');
    onSelectGame(gameId);
  };

  // Discover any custom games registered by Admin
  const customGames = useMemo(() => {
    const knownIds = new Set(GAMES.map((g) => g.id));
    const map = new Map<string, string>();
    for (const p of products) {
      if (!knownIds.has(p.gameId)) {
        map.set(p.gameId, p.customGameName?.trim() || p.gameId);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const getGameDisplayName = (prod: Product) => {
    const found = GAMES.find((g) => g.id === prod.gameId);
    if (found) return found.shortName || found.name;
    return prod.customGameName?.trim() || prod.gameId;
  };

  const selectedGameTitle = useMemo(() => {
    if (selectedGame === 'all') return null;
    if (selectedGame === 'idle') return 'Jogos Idle';
    const found = GAMES.find((g) => g.id === selectedGame);
    if (found) return found.shortName || found.name;
    const custom = customGames.find((c) => c.id === selectedGame);
    return custom ? custom.name : selectedGame;
  }, [selectedGame, customGames]);

  // Products matching selected game & active demand
  const gameMatchedProducts = useMemo(() => {
    const idleIds = new Set(GAMES.filter((g) => g.isIdle).map((g) => g.id));

    return products.filter((prod) => {
      const hasActiveDemand =
        prod.inStock !== false &&
        prod.stockStatus !== 'sob_encomenda' &&
        prod.hasDemand !== false;
      if (!hasActiveDemand) return false;

      if (onlyShowRegisteredDemand && !prod.isRegisteredByAdmin) {
        return false;
      }

      if (selectedGame === 'all') return true;
      if (selectedGame === 'idle') {
        const customNameNorm = (prod.customGameName || prod.gameId).toLowerCase();
        return idleIds.has(prod.gameId) || customNameNorm.includes('idle');
      }
      return prod.gameId === selectedGame;
    });
  }, [products, selectedGame, onlyShowRegisteredDemand]);

  // Available sellers within the current game view
  const availableSellers = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of gameMatchedProducts) {
      const sName = p.sellerName?.trim() || 'WD Coins Oficial';
      const key = sName.toLowerCase();
      if (!map.has(key)) {
        map.set(key, sName);
      }
    }
    return Array.from(map.entries()).map(([key, name]) => ({ key, name }));
  }, [gameMatchedProducts]);

  // Apply category, seller, favorite, and sort filters
  const filteredProducts = useMemo(() => {
    return gameMatchedProducts
      .filter((prod) => {
        const matchCategory = selectedCategory === 'all' || prod.category === selectedCategory;
        const sKey = (prod.sellerName?.trim() || 'WD Coins Oficial').toLowerCase();
        const matchSeller = selectedSeller === 'all' || sKey === selectedSeller;
        const matchFavorites = !onlyFavorites || favorites.includes(prod.id);
        return matchCategory && matchSeller && matchFavorites;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return 0;
      });
  }, [gameMatchedProducts, selectedCategory, selectedSeller, onlyFavorites, favorites, sortBy]);

  // Group filtered products BY USER / SELLER
  const sellerGroups = useMemo<SellerGroup[]>(() => {
    const groupsMap = new Map<string, SellerGroup>();

    for (const prod of filteredProducts) {
      const sellerName = prod.sellerName?.trim() || 'WD Coins Oficial';
      const sellerKey = sellerName.toLowerCase();
      const gameLabel = getGameDisplayName(prod);

      if (!groupsMap.has(sellerKey)) {
        groupsMap.set(sellerKey, {
          sellerKey,
          sellerName,
          initials: getInitials(sellerName),
          gamesList: [gameLabel],
          items: [prod],
        });
      } else {
        const existing = groupsMap.get(sellerKey)!;
        if (!existing.gamesList.includes(gameLabel)) {
          existing.gamesList.push(gameLabel);
        }
        existing.items.push(prod);
      }
    }

    return Array.from(groupsMap.values());
  }, [filteredProducts]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coins':
        return <Coins className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'items':
        return (
          <Shield
            className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`}
          />
        );
      default:
        return <Package className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getCategoryLabel = (product: Product) => {
    if (product.category === 'coins') {
      return product.gameId === 'aion-2' ? 'Kinah' : 'Moedas';
    }
    if (product.category === 'items') return 'Item';
    return 'Combo';
  };

  return (
    <section id="catalogo-produtos" className="py-6 sm:py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Integrated Game Search */}
        <div className="mb-7">
          {selectedGame !== 'all' && (
            <button
              type="button"
              onClick={() => handleGameTabChange('all')}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-3 transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC]'
                  : 'text-[#68676D] hover:text-[#202124]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o catálogo completo</span>
            </button>
          )}

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div>
              <div
                className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
                  isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                }`}
              >
                {selectedGameTitle ? 'Vendedores Ativos no Jogo' : 'Catálogo Completo'}
              </div>
              <h2
                data-typography="section-title"
                className={`text-2xl sm:text-3xl font-semibold tracking-tight font-display ${
                  isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                }`}
              >
                {selectedGameTitle
                  ? `${selectedGameTitle} — Anúncios por Usuário`
                  : 'O que cada usuário está vendendo'}
              </h2>
              <p
                data-typography="description"
                className={`mt-1.5 text-xs sm:text-sm font-normal font-sans ${
                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                }`}
              >
                {sellerGroups.length > 0
                  ? `${sellerGroups.length} ${
                      sellerGroups.length === 1 ? 'usuário vendendo' : 'usuários vendendo'
                    } · ${filteredProducts.length} ${
                      filteredProducts.length === 1 ? 'item disponível' : 'itens disponíveis'
                    } com pagamento seguro`
                  : 'Pesquise ou selecione um jogo abaixo para ver os vendedores e seus anúncios disponíveis.'}
              </p>
            </div>

            {/* Integrated Game Search inside Catalog */}
            <div className="w-full lg:w-[420px] shrink-0">
              <SearchArea
                hideQuickLinks
                className="w-full"
                onSelectGame={(gameId) => handleGameTabChange(gameId)}
                onGoToOrders={() => onOrderCustom?.()}
                onGoToIntermediation={onGoToIntermediation}
              />
            </div>
          </div>
        </div>

        {/* Game Selector Bar */}
        <div
          className={`p-3 sm:p-3.5 rounded-xl border mb-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 transition-colors ${
            isDark
              ? 'bg-[#191A1E] border-[#303036]'
              : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}
        >
          {/* Game Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => handleGameTabChange('all')}
              data-typography="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedGame === 'all'
                  ? isDark
                    ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#A78AB8]'
                    : 'bg-[#25242A] text-white border-[#25242A]'
                  : isDark
                  ? 'bg-transparent text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent hover:bg-[#1D1E23]/60'
                  : 'bg-transparent text-[#68676D] hover:text-[#202124] border-transparent hover:bg-[#ECE9E3]'
              }`}
            >
              Todos os Jogos
            </button>

            {GAMES.slice(0, 2).map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameTabChange(game.id)}
                data-typography="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedGame === game.id
                    ? isDark
                      ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#A78AB8]'
                      : 'bg-[#25242A] text-white border-[#25242A]'
                    : isDark
                    ? 'bg-transparent text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent hover:bg-[#1D1E23]/60'
                    : 'bg-transparent text-[#68676D] hover:text-[#202124] border-transparent hover:bg-[#ECE9E3]'
                }`}
              >
                {game.shortName}
              </button>
            ))}

            {/* Jogos Idle Tab */}
            <button
              onClick={() => handleGameTabChange('idle')}
              data-typography="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedGame === 'idle'
                  ? isDark
                    ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#A78AB8]'
                    : 'bg-[#25242A] text-white border-[#25242A]'
                  : isDark
                  ? 'bg-transparent text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent hover:bg-[#1D1E23]/60'
                  : 'bg-transparent text-[#68676D] hover:text-[#202124] border-transparent hover:bg-[#ECE9E3]'
              }`}
            >
              Jogos Idle
            </button>

            {GAMES.slice(2).map((game) => (
              <button
                key={game.id}
                onClick={() => handleGameTabChange(game.id)}
                data-typography="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedGame === game.id
                    ? isDark
                      ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#A78AB8]'
                      : 'bg-[#25242A] text-white border-[#25242A]'
                    : isDark
                    ? 'bg-transparent text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent hover:bg-[#1D1E23]/60'
                    : 'bg-transparent text-[#68676D] hover:text-[#202124] border-transparent hover:bg-[#ECE9E3]'
                }`}
              >
                {game.shortName}
              </button>
            ))}

            {customGames.map((cg) => (
              <button
                key={cg.id}
                onClick={() => handleGameTabChange(cg.id)}
                data-typography="button"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                  selectedGame === cg.id
                    ? isDark
                      ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#A78AB8]'
                      : 'bg-[#25242A] text-white border-[#25242A]'
                    : isDark
                    ? 'bg-transparent text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent hover:bg-[#1D1E23]/60'
                    : 'bg-transparent text-[#68676D] hover:text-[#202124] border-transparent hover:bg-[#ECE9E3]'
                }`}
              >
                {cg.name}
              </button>
            ))}
          </div>

          {/* Seller Filter Dropdown */}
          {availableSellers.length > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <User
                className={`w-3.5 h-3.5 shrink-0 ${
                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                }`}
              />
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                aria-label="Filtrar por usuário vendedor"
                className={`w-full lg:w-auto px-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none cursor-pointer ${
                  isDark
                    ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                }`}
              >
                <option value="all">Todos os usuários ({availableSellers.length})</option>
                {availableSellers.map((s) => (
                  <option key={s.key} value={s.key}>
                    Vendedor: {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Secondary Category, Favorites & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-7">
          {/* Category Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              data-typography="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === 'all'
                  ? isDark
                    ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#303036]'
                    : 'bg-[#ECE9E3] text-[#202124] border-[#DDD8D1]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent'
                  : 'text-[#68676D] hover:text-[#202124] border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5 opacity-70" />
              <span>Todos</span>
            </button>

            <button
              onClick={() => setSelectedCategory('coins')}
              data-typography="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === 'coins'
                  ? isDark
                    ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#303036]'
                    : 'bg-[#ECE9E3] text-[#202124] border-[#DDD8D1]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent'
                  : 'text-[#68676D] hover:text-[#202124] border-transparent'
              }`}
            >
              <Coins className="w-3.5 h-3.5 opacity-70" />
              <span>Moedas</span>
            </button>

            <button
              onClick={() => setSelectedCategory('items')}
              data-typography="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === 'items'
                  ? isDark
                    ? 'bg-[#1D1E23] text-[#F4F1EC] border-[#303036]'
                    : 'bg-[#ECE9E3] text-[#202124] border-[#DDD8D1]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent'
                  : 'text-[#68676D] hover:text-[#202124] border-transparent'
              }`}
            >
              <Shield className="w-3.5 h-3.5 opacity-70" />
              <span>Itens</span>
            </button>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              data-typography="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                onlyFavorites
                  ? isDark
                    ? 'bg-[#1D1E23] text-[#C7B0D4] border-[#A78AB8]'
                    : 'bg-[#ECE9E3] text-[#80658F] border-[#80658F]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] border-transparent'
                  : 'text-[#68676D] hover:text-[#202124] border-transparent'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current' : 'opacity-70'}`} />
              <span>Favoritos ({favorites.length})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124]'
              }`}
            >
              <option value="featured">Destaques Primeiro</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Listings Grouped BY USER / SELLER */}
        {sellerGroups.length > 0 ? (
          <div className="space-y-6">
            {sellerGroups.map((group) => (
              <div
                key={group.sellerKey}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  isDark
                    ? 'bg-[#191A1E] border-[#303036]'
                    : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
                }`}
              >
                {/* Seller Header Bar */}
                <div
                  className={`px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDark
                      ? 'bg-[#15161A] border-[#303036]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs font-display shrink-0 ${
                        isDark
                          ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                          : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#80658F]'
                      }`}
                    >
                      {group.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`text-sm sm:text-base font-bold font-display ${
                            isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                          }`}
                        >
                          {group.sellerName}
                        </h3>
                        <span title="Usuário Verificado" className="inline-flex">
                          <ShieldCheck
                            className={`w-4 h-4 shrink-0 ${
                              isDark ? 'text-[#25D366]' : 'text-[#168B4B]'
                            }`}
                          />
                        </span>
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1.5 flex-wrap mt-0.5 ${
                          isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                        }`}
                      >
                        <span>Vendendo em {group.gamesList.join(', ')}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {group.items.length}{' '}
                          {group.items.length === 1 ? 'anúncio disponível' : 'anúncios disponíveis'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {onGoToIntermediation && (
                    <button
                      type="button"
                      onClick={onGoToIntermediation}
                      className={`self-start sm:self-auto px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC] hover:border-[#45454d]'
                          : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] hover:bg-[#ECE9E3]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Intermediação Segura</span>
                    </button>
                  )}
                </div>

                {/* Items Sold by This User */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((product) => {
                    const favorited = isFavorite(product.id);

                    return (
                      <div
                        key={product.id}
                        id={`product-card-${product.id}`}
                        className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                          isDark
                            ? 'bg-[#1D1E23] border-[#303036] hover:border-[#45454d]'
                            : 'bg-[#F9F8F6] border-[#DDD8D1] hover:border-[#b5b0a8]'
                        }`}
                      >
                        <div>
                          {/* Kicker & Favorite */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div
                              className={`flex items-center gap-1.5 text-xs ${
                                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                              }`}
                            >
                              {getCategoryIcon(product.category)}
                              <span
                                className={`font-semibold ${
                                  isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                                }`}
                              >
                                {getGameDisplayName(product)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{getCategoryLabel(product)}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleFavorite(product.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                favorited
                                  ? isDark
                                    ? 'bg-[#191A1E] border-[#A78AB8] text-[#C7B0D4]'
                                    : 'bg-[#ECE9E3] border-[#80658F] text-[#80658F]'
                                  : isDark
                                  ? 'bg-[#191A1E] border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                              }`}
                              title={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                              aria-label="Favoritar produto"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Product Name */}
                          <h4
                            className={`text-sm sm:text-base font-bold font-display leading-snug ${
                              isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                            }`}
                          >
                            {product.name}
                          </h4>

                          {/* Description */}
                          <p
                            className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
                              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                            }`}
                          >
                            {product.description}
                          </p>

                          {/* Delivery Info */}
                          <div
                            className={`mt-2.5 flex items-center gap-1.5 text-[11px] ${
                              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                            }`}
                          >
                            <Clock className="w-3 h-3 shrink-0 opacity-70" />
                            <span className="truncate">
                              {product.deliveryMethod} · {product.estimatedDeliveryTime}
                            </span>
                          </div>
                        </div>

                        {/* Price & Buy Button */}
                        <div
                          className={`mt-4 pt-3 border-t flex items-center justify-between gap-3 ${
                            isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
                          }`}
                        >
                          <div>
                            {product.originalPrice && (
                              <span
                                className={`text-[10px] line-through block ${
                                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                                }`}
                              >
                                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                            <div
                              data-typography="price"
                              className={`text-base font-semibold font-sans ${
                                isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                              }`}
                            >
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </div>
                          </div>

                          <button
                            id={`btn-buy-${product.id}`}
                            type="button"
                            onClick={() => onBuyProduct(product)}
                            data-typography="button"
                            className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                              isDark
                                ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                                : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 shrink-0" />
                            <span>Comprar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 px-6 rounded-2xl border max-w-2xl mx-auto transition-colors ${
              isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1]'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center border mb-3 ${
                isDark
                  ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                  : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-base sm:text-lg font-bold font-display mb-1.5">
              {onlyFavorites
                ? 'Nenhum favorito encontrado neste jogo'
                : 'Nenhum usuário vendendo neste filtro no momento'}
            </h3>

            <p
              className={`text-xs sm:text-sm max-w-lg mx-auto font-normal font-sans mb-6 ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}
            >
              {onlyFavorites
                ? 'Você ainda não salvou itens favoritos para este jogo.'
                : 'O catálogo exibe apenas os anúncios ativos cadastrados. Você pode solicitar uma encomenda sob medida ou abrir uma sala de intermediação com outro jogador.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onlyFavorites ? (
                <button
                  type="button"
                  onClick={() => setOnlyFavorites(false)}
                  data-typography="button"
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                    isDark
                      ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC]'
                      : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#202124]'
                  }`}
                >
                  Ver todos os anúncios
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onOrderCustom?.()}
                    data-typography="button"
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                        : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fazer Encomenda (Moeda, Item ou Serviço)</span>
                  </button>

                  {onGoToIntermediation && (
                    <button
                      type="button"
                      onClick={onGoToIntermediation}
                      data-typography="button"
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isDark
                          ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC] hover:border-[#45454d]'
                          : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#202124] hover:bg-[#dfdbd3]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Solicitar Intermediação</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
