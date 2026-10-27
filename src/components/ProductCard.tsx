import React from 'react';
import { Product } from '../types';
import { GAMES } from '../data/storeData';
import { Zap, Clock, ShieldCheck, Coins, Shield, Package, XCircle, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onOrderCustom?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy, onOrderCustom }) => {
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useStore();
  const game = GAMES.find((g) => g.id === product.gameId);
  const isInStock = product.inStock !== false;
  const favorited = isFavorite(product.id);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coins':
        return <Coins className="w-5 h-5 text-amber-500" />;
      case 'items':
        return <Shield className={`w-5 h-5 ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`} />;
      case 'combos':
      default:
        return <Package className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'coins':
        return product.gameId === 'aion-2' ? 'Kinah' : 'Coins & Moedas';
      case 'items':
        return 'Item / Refino';
      case 'combos':
        return 'Combo Especial';
      default:
        return category;
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
        isDark
          ? 'bg-[#1D1E23] border-[#303036] hover:border-[#45454d]'
          : 'bg-[#FFFFFF] border-[#DDD8D1] hover:border-[#b5b0a8] shadow-xs'
      } ${!isInStock ? 'opacity-90' : ''}`}
    >
      <div>
        {/* Top Header Row: Game Kicker + Favorite Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span 
              data-typography="game-name"
              className={`font-semibold font-display ${
                isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
              }`}
            >
              {game?.shortName || product.gameId}
            </span>
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>·</span>
            <span className={`text-[11px] font-normal font-sans ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              {getCategoryLabel(product.category)}
            </span>
          </div>

          <button
            onClick={() => toggleFavorite(product.id)}
            data-typography="button"
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
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Visual Banner Graphic */}
        <div className={`w-full h-24 rounded-xl border flex items-center justify-center mb-3.5 relative overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#191A1E] border-[#303036]'
            : 'bg-[#F5F3EF] border-[#DDD8D1]'
        }`}>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className={`p-2.5 rounded-lg border ${
              isDark ? 'bg-[#1D1E23] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1]'
            }`}>
              {getCategoryIcon(product.category)}
            </div>
            {product.badge && (
              <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md ${
                isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
              }`}>
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Product Name */}
        <h3
          className={`text-base font-bold font-display line-clamp-2 transition-colors ${
            isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
          }`}
        >
          {product.name}
        </h3>

        {/* Product Description */}
        <p
          data-typography="description"
          className={`mt-1.5 text-xs font-normal font-sans leading-relaxed min-h-[34px] line-clamp-2 ${
            isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
          }`}
        >
          {product.description}
        </p>

        {/* Delivery Details Meta */}
        <div
          data-typography="info"
          className={`mt-3 p-2 rounded-lg space-y-1 text-[11px] font-normal font-sans border transition-colors ${
            isDark
              ? 'bg-[#191A1E] border-[#303036] text-[#AAA9B0]'
              : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#25D366]' : 'text-[#168B4B]'}`} />
            <span className="truncate">Entrega: {product.deliveryMethod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
            <span>Prazo: {product.estimatedDeliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Footer: Price, Availability & Purchase CTA Button */}
      <div
        className={`mt-4 pt-3 flex items-center justify-between gap-3 border-t transition-colors ${
          isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
        }`}
      >
        <div>
          {product.originalPrice && (
            <span className={`text-[10px] line-through font-normal font-sans block ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}>
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <div
            data-typography="price"
            className={`text-base sm:text-lg font-semibold font-sans ${
              isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
            }`}
          >
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {isInStock ? (
          <button
            id={`btn-buy-${product.id}`}
            onClick={() => onBuy(product)}
            data-typography="button"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Comprar</span>
          </button>
        ) : (
          <button
            id={`btn-order-${product.id}`}
            onClick={() => (onOrderCustom ? onOrderCustom(product) : onBuy(product))}
            data-typography="button"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all border active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-[#191A1E] hover:bg-[#202228] border-[#303036] text-[#F4F1EC]'
                : 'bg-[#FFFFFF] hover:bg-[#ECE9E3] border-[#D5D0C9] text-[#202124]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Encomendar</span>
          </button>
        )}
      </div>
    </div>
  );
};
