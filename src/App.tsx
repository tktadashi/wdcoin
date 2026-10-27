/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameId, Product, NavTab } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GamesBanner } from './components/GamesBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { HowToBuy } from './components/HowToBuy';
import { ContactSection } from './components/ContactSection';
import { PaymentModal } from './components/PaymentModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { PureCodeModal } from './components/PureCodeModal';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { CustomOrdersSection } from './components/CustomOrdersSection';
import { IntermediationSection } from './components/IntermediationSection';
import { UserArea } from './components/UserArea';
import { Sparkles, ArrowRight, ShieldCheck, ShoppingBag, Clock } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedGame, setSelectedGame] = useState<GameId | 'all' | 'idle'>('all');
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [pureCodeModalOpen, setPureCodeModalOpen] = useState(false);
  const { isDark } = useTheme();

  // Navegar entre abas pelo menu ou rodapé (ao entrar em Catálogo pelo menu, abre o catálogo completo)
  const handleNavigateTab = (tab: NavTab) => {
    if (tab === 'produtos') {
      setSelectedGame('all');
    }
    setActiveTab(tab);
  };

  // Selecionar jogo a partir da busca ou dos cards de jogos -> abre Catálogo filtrado pelo jogo
  const handleSelectGame = (gameId: GameId | 'idle') => {
    setSelectedGame(gameId);
    setActiveTab('produtos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Abrir modal de checkout para um produto
  const handleBuyProduct = (product: Product) => {
    setCheckoutProduct(product);
  };

  // Encomendar item sem estoque
  const handleOrderCustom = () => {
    setActiveTab('encomendas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? 'bg-[#111214] text-[#F4F1EC] selection:bg-[#A78AB8]/30 selection:text-[#F4F1EC]'
          : 'bg-[#F5F3EF] text-[#202124] selection:bg-[#E9DFEE] selection:text-[#80658F]'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
      />

      {/* Main Content Sections Based on Tab */}
      <main className="flex-1">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onSelectGame={handleSelectGame}
              onGoToOrders={() => {
                setActiveTab('encomendas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToIntermediation={() => {
                setActiveTab('intermediacao');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Destaque dos Jogos (Cards que levam ao Catálogo) */}
            <GamesBanner onSelectGame={handleSelectGame} />

            {/* Callout Especial de Intermediação Segura */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className={`p-6 sm:p-8 rounded-2xl border transition-colors flex flex-col md:flex-row items-center justify-between gap-6 ${
                isDark
                  ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-xs'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                    isDark
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold font-display">
                        Vai negociar com outro jogador?
                      </h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                        isDark
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Anti-Golpe
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 max-w-xl font-normal font-sans ${
                      isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                    }`}>
                      Use a Intermediação Oficial da WD Coins. Criamos uma sala privada com código exclusivo e retemos o pagamento até a entrega no jogo ser confirmada.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setActiveTab('intermediacao');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-typography="button"
                    className={`px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                      isDark
                        ? 'bg-[#1D1E23] border border-[#303036] text-[#F4F1EC] hover:border-[#45454d]'
                        : 'bg-[#ECE9E3] border border-[#DDD8D1] text-[#202124] hover:bg-[#dfdbd3]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Acessar Intermediação</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Callout Especial de Encomendas */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className={`p-6 sm:p-8 rounded-2xl border transition-colors flex flex-col md:flex-row items-center justify-between gap-6 ${
                isDark
                  ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-xs'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                    isDark
                      ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                      : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold font-display">
                        Não encontrou o que procura?
                      </h3>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                        isDark
                          ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                          : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
                      }`}>
                        Sob Medida
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-1 max-w-xl font-normal font-sans ${
                      isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                    }`}>
                      Trabalhamos com encomendas personalizadas: escolha se deseja Moeda, Item ou Serviço com cotação imediata.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setActiveTab('encomendas');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-typography="button"
                    className={`px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                      isDark
                        ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                        : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                    }`}
                  >
                    <span>Fazer uma Encomenda</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Resumo do Como Comprar */}
            <HowToBuy />

            {/* Contato e Avaliações */}
            <ContactSection />
          </div>
        )}

        {/* PRODUTOS TAB */}
        {activeTab === 'produtos' && (
          <div className="pt-6">
            <ProductCatalog
              selectedGame={selectedGame}
              onSelectGame={setSelectedGame}
              onBuyProduct={handleBuyProduct}
              onOrderCustom={handleOrderCustom}
              onGoToIntermediation={() => {
                setActiveTab('intermediacao');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* INTERMEDIAÇÃO TAB */}
        {activeTab === 'intermediacao' && (
          <div className="pt-4">
            <IntermediationSection />
          </div>
        )}

        {/* ENCOMENDAS TAB */}
        {activeTab === 'encomendas' && (
          <div className="pt-4">
            <CustomOrdersSection />
          </div>
        )}

        {/* ÁREA DO USUÁRIO TAB */}
        {activeTab === 'usuario' && (
          <div className="pt-4">
            <UserArea
              onGoToStore={() => {
                setActiveTab('produtos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToOrders={() => {
                setActiveTab('encomendas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* ÁREA ADMINISTRATIVA TAB */}
        {activeTab === 'admin' && (
          <div className="pt-4">
            <AdminPanel
              onGoToStore={() => {
                setActiveTab('produtos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* COMO COMPRAR TAB */}
        {activeTab === 'como-comprar' && (
          <div className="pt-6">
            <HowToBuy />
          </div>
        )}

        {/* CONTATO TAB */}
        {activeTab === 'contato' && (
          <div className="pt-6">
            <ContactSection />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          handleNavigateTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCode={() => setPureCodeModalOpen(true)}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloat />

      {/* Modal de Pagamento Interativo (PIX & Crypto) */}
      <PaymentModal
        product={checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
      />

      {/* Modal com Código HTML/CSS/JS Puro pronto para cópia */}
      <PureCodeModal
        isOpen={pureCodeModalOpen}
        onClose={() => setPureCodeModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ThemeProvider>
  );
}
