import React, { useState } from 'react';
import { Gamepad2, MessageCircle, Menu, X, Sparkles, User, Sun, Moon, Heart, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { NavTab } from '../types';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { userProfile, storeConfig, favorites } = useStore();

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Palette styling based on design system
  const headerBg = isDark
    ? 'bg-[#191A1E]/95 border-[#303036] text-[#F4F1EC]'
    : 'bg-[#FFFFFF]/95 border-[#DDD8D1] text-[#202124] shadow-xs';

  const bannerBg = isDark
    ? 'bg-[#15161A] border-[#303036] text-[#AAA9B0]'
    : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#68676D]';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${headerBg}`}>
      {/* Top Banner Notice - Discreet & Clean */}
      <div className={`border-b py-1.5 px-4 text-center text-xs font-normal font-sans flex items-center justify-center gap-2 ${bannerBg}`}>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#25D366]" />
        <span>Loja de coins e itens para jogos • Entrega manual segura direto no seu personagem</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div 
                data-typography="brand-logo"
                className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-1 font-display"
              >
                WD <span className={isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}>Coins</span>
              </div>
              <p 
                data-typography="description"
                className={`text-[10px] font-normal font-sans hidden sm:block ${
                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                }`}
              >
                Coins & Itens Gamer
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links - Discreet & Non-Bulky */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick('home')}
              data-typography="menu"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors relative cursor-pointer ${
                activeTab === 'home'
                  ? isDark
                    ? 'text-[#F4F1EC] bg-[#1D1E23]'
                    : 'text-[#202124] bg-[#ECE9E3]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] hover:bg-[#1D1E23]/60'
                  : 'text-[#68676D] hover:text-[#202124] hover:bg-[#ECE9E3]/60'
              }`}
            >
              Início
              {activeTab === 'home' && (
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                }`} />
              )}
            </button>

            <button
              id="nav-link-produtos"
              onClick={() => handleNavClick('produtos')}
              data-typography="menu"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors relative cursor-pointer ${
                activeTab === 'produtos'
                  ? isDark
                    ? 'text-[#F4F1EC] bg-[#1D1E23]'
                    : 'text-[#202124] bg-[#ECE9E3]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] hover:bg-[#1D1E23]/60'
                  : 'text-[#68676D] hover:text-[#202124] hover:bg-[#ECE9E3]/60'
              }`}
            >
              Catálogo
              {activeTab === 'produtos' && (
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                }`} />
              )}
            </button>

            <button
              id="nav-link-intermediacao"
              onClick={() => handleNavClick('intermediacao')}
              data-typography="menu"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'intermediacao'
                  ? isDark
                    ? 'text-[#F4F1EC] bg-[#1D1E23]'
                    : 'text-[#202124] bg-[#ECE9E3]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] hover:bg-[#1D1E23]/60'
                  : 'text-[#68676D] hover:text-[#202124] hover:bg-[#ECE9E3]/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Intermediação</span>
              {activeTab === 'intermediacao' && (
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                }`} />
              )}
            </button>

            <button
              id="nav-link-encomendas"
              onClick={() => handleNavClick('encomendas')}
              data-typography="menu"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'encomendas'
                  ? isDark
                    ? 'text-[#F4F1EC] bg-[#1D1E23]'
                    : 'text-[#202124] bg-[#ECE9E3]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] hover:bg-[#1D1E23]/60'
                  : 'text-[#68676D] hover:text-[#202124] hover:bg-[#ECE9E3]/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Encomendas</span>
              {activeTab === 'encomendas' && (
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                }`} />
              )}
            </button>

            <button
              id="nav-link-como-comprar"
              onClick={() => handleNavClick('como-comprar')}
              data-typography="menu"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors relative cursor-pointer ${
                activeTab === 'como-comprar'
                  ? isDark
                    ? 'text-[#F4F1EC] bg-[#1D1E23]'
                    : 'text-[#202124] bg-[#ECE9E3]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] hover:bg-[#1D1E23]/60'
                  : 'text-[#68676D] hover:text-[#202124] hover:bg-[#ECE9E3]/60'
              }`}
            >
              Como Comprar
              {activeTab === 'como-comprar' && (
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                }`} />
              )}
            </button>

            <button
              id="nav-link-contato"
              onClick={() => handleNavClick('contato')}
              data-typography="menu"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-colors relative cursor-pointer ${
                activeTab === 'contato'
                  ? isDark
                    ? 'text-[#F4F1EC] bg-[#1D1E23]'
                    : 'text-[#202124] bg-[#ECE9E3]'
                  : isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] hover:bg-[#1D1E23]/60'
                  : 'text-[#68676D] hover:text-[#202124] hover:bg-[#ECE9E3]/60'
              }`}
            >
              Contato
              {activeTab === 'contato' && (
                <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                  isDark ? 'bg-[#A78AB8]' : 'bg-[#80658F]'
                }`} />
              )}
            </button>
          </nav>

          {/* Right Actions: Meus Pedidos + Favoritos + Dark/Light Mode + WhatsApp */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Meus Pedidos Button */}
            <button
              id="nav-btn-user"
              onClick={() => handleNavClick('usuario')}
              data-typography="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans border transition-colors cursor-pointer ${
                activeTab === 'usuario'
                  ? isDark
                    ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC]'
                    : 'bg-[#ECE9E3] border-[#80658F] text-[#202124]'
                  : isDark
                  ? 'bg-[#191A1E] border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC] hover:border-[#45454d]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124] hover:border-[#b5b0a8]'
              }`}
              title="Acompanhar meus pedidos e perfil gamer"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {userProfile ? userProfile.name.split(' ')[0] : 'Meus Pedidos'}
              </span>
            </button>

            {/* Favoritos Button */}
            <button
              id="nav-btn-favorites"
              onClick={() => handleNavClick('produtos')}
              data-typography="button"
              className={`relative flex items-center justify-center w-8 h-8 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#191A1E] border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC] hover:border-[#45454d]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124] hover:border-[#b5b0a8]'
              }`}
              title={`Favoritos (${favorites.length})`}
              aria-label="Ver produtos favoritos"
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? (isDark ? 'text-[#C7B0D4] fill-[#C7B0D4]' : 'text-[#80658F] fill-[#80658F]') : ''}`} />
              {favorites.length > 0 && (
                <span className={`absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-[#A78AB8] text-[#111214]' : 'bg-[#80658F] text-white'
                }`}>
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Alternância entre Modo Escuro e Claro (Minimalist Theme Toggle) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#191A1E] border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC] hover:border-[#45454d]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124] hover:border-[#b5b0a8]'
              }`}
              title={isDark ? 'Mudar para Modo Claro Premium' : 'Mudar para Modo Escuro Premium'}
              aria-label="Alternar tema claro e escuro"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-[#80658F]" />
              )}
            </button>

            {/* WhatsApp CTA Button */}
            <a
              id="header-whatsapp-cta"
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá%20WD%20Coins,%20gostaria%20de%20tirar%20uma%20dúvida!`}
              target="_blank"
              rel="noopener noreferrer"
              data-typography="button"
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold font-sans text-white transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-[#25D366] hover:bg-[#20bd5a]'
                  : 'bg-[#168B4B] hover:bg-[#12723d]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'text-[#AAA9B0] hover:text-[#F4F1EC] bg-[#191A1E] border-[#303036]'
                  : 'text-[#68676D] hover:text-[#202124] bg-[#FFFFFF] border-[#DDD8D1]'
              }`}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-5 space-y-2 animate-fadeIn ${
          isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1]'
        }`}>
          {/* Mobile Theme Switcher Bar */}
          <div className={`pb-3 mb-2 border-b flex items-center justify-between ${
            isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
          }`}>
            <span className={`text-xs font-normal font-sans ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              Tema Visual:
            </span>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                isDark
                  ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC]'
                  : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#202124]'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-[#80658F]" />}
              <span>{isDark ? 'Modo Escuro' : 'Modo Claro'}</span>
            </button>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors ${
              activeTab === 'home'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => handleNavClick('produtos')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors ${
              activeTab === 'produtos'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => handleNavClick('intermediacao')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors flex items-center justify-between ${
              activeTab === 'intermediacao'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Intermediação</span>
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
              isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              Anti-Golpe
            </span>
          </button>
          <button
            onClick={() => handleNavClick('encomendas')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors flex items-center justify-between ${
              activeTab === 'encomendas'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Encomendas</span>
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
              isDark ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              Sob Medida
            </span>
          </button>
          <button
            onClick={() => handleNavClick('como-comprar')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors ${
              activeTab === 'como-comprar'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Como Comprar
          </button>
          <button
            onClick={() => handleNavClick('contato')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors ${
              activeTab === 'contato'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Contato
          </button>
          <button
            onClick={() => handleNavClick('usuario')}
            data-typography="menu"
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold font-sans transition-colors flex items-center gap-2 ${
              activeTab === 'usuario'
                ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                : isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            <User className="w-4 h-4 text-[#A78AB8]" />
            <span>Meus Pedidos</span>
          </button>
        </div>
      )}
    </header>
  );
};
