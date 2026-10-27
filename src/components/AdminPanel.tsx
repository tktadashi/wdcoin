import React, { useState } from 'react';
import { Product, CustomOrder, GameId, ProductCategory } from '../types';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { GAMES } from '../data/storeData';
import { AdminStoreSettings } from './AdminStoreSettings';
import { AdminOrderList } from './AdminOrderList';
import { 
  ShieldCheck, 
  Package, 
  Coins, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageCircle, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  KeyRound, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Sparkles,
  ShoppingBag,
  Settings,
  Smartphone,
  Save,
  RotateCcw,
  Copy,
  Pencil,
  Check,
  X,
  Tag,
  FileText
} from 'lucide-react';

interface AdminPanelProps {
  onGoToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onGoToStore }) => {
  const { isDark, isRed } = useTheme();
  const {
    products,
    addProduct,
    deleteProduct,
    toggleStock,
    updateProduct,
    resetProductsToDefault,
    customOrders,
    updateCustomOrderStatus,
    deleteCustomOrder,
    purchases,
    updatePurchaseStatus,
    deletePurchase,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    changeAdminPin,
    storeConfig,
    updateStoreConfig,
    resetStoreConfigToDefault,
    intermediations,
    updateIntermediationStatus,
    sendIntermediationMessage,
    onlyShowRegisteredDemand,
    setOnlyShowRegisteredDemand,
    toggleProductDemand,
    clearAllProducts,
  } = useStore();

  // Login PIN state
  const [pinInput, setPinInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

  // Active Admin Tab - Orders view as primary or easily toggled
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'intermediations' | 'settings'>('orders');

  // Product Filter / Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameFilter, setSelectedGameFilter] = useState<GameId | 'all'>('all');

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sellerName: 'WD Coins Oficial',
    gameId: 'aion-2' as GameId,
    customGameName: '',
    category: 'coins' as ProductCategory,
    price: '',
    originalPrice: '',
    description: '',
    deliveryMethod: 'Entrega in-game via trade ou correio',
    estimatedDeliveryTime: '10 a 20 min',
    inStock: true,
    popular: false,
    badge: '',
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductForm, setEditProductForm] = useState({
    name: '',
    sellerName: 'WD Coins Oficial',
    gameId: 'aion-2' as GameId,
    customGameName: '',
    category: 'coins' as ProductCategory,
    price: '',
    originalPrice: '',
    description: '',
    deliveryMethod: 'Entrega in-game via trade ou correio',
    estimatedDeliveryTime: '10 a 20 min',
    stockStatus: 'disponivel' as 'disponivel' | 'poucas_unidades' | 'sob_encomenda',
    inStock: true,
    popular: false,
    badge: '',
  });

  // Quick inline price edit state
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlinePriceInput, setInlinePriceInput] = useState<string>('');

  const handleStartInlineEdit = (product: Product) => {
    setInlineEditingId(product.id);
    setInlinePriceInput(product.price.toString().replace('.', ','));
  };

  const handleSaveInlinePrice = (id: string) => {
    const parsed = parseFloat(inlinePriceInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      updateProduct(id, { price: parsed });
    }
    setInlineEditingId(null);
  };

  const handleCancelInlinePrice = () => {
    setInlineEditingId(null);
  };

  // Open Full Edit Modal
  const openEditModal = (product: Product) => {
    const isKnownGame = GAMES.some((g) => g.id === product.gameId);
    setEditingProduct(product);
    setEditProductForm({
      name: product.name,
      sellerName: product.sellerName || 'WD Coins Oficial',
      gameId: isKnownGame ? product.gameId : ('outro' as GameId),
      customGameName: isKnownGame ? '' : product.customGameName || product.gameId,
      category: product.category,
      price: product.price.toString().replace('.', ','),
      originalPrice: product.originalPrice !== undefined ? product.originalPrice.toString().replace('.', ',') : '',
      description: product.description || '',
      deliveryMethod: product.deliveryMethod || 'Entrega in-game via trade ou correio',
      estimatedDeliveryTime: product.estimatedDeliveryTime || '10 a 20 min',
      stockStatus: product.stockStatus || (product.inStock !== false ? 'disponivel' : 'sob_encomenda'),
      inStock: product.inStock !== false,
      popular: !!product.popular,
      badge: product.badge || '',
    });
  };

  const slugifyGameId = (raw: string): GameId =>
    raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'jogo-custom';

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parsedPrice = parseFloat(editProductForm.price.replace(',', '.'));
    const parsedOriginal = editProductForm.originalPrice.trim()
      ? parseFloat(editProductForm.originalPrice.replace(',', '.'))
      : undefined;

    const isCustomGame = editProductForm.gameId === 'outro';
    const resolvedGameId = isCustomGame
      ? slugifyGameId(editProductForm.customGameName)
      : editProductForm.gameId;

    updateProduct(editingProduct.id, {
      name: editProductForm.name.trim(),
      sellerName: editProductForm.sellerName.trim() || 'WD Coins Oficial',
      gameId: resolvedGameId,
      customGameName: isCustomGame ? editProductForm.customGameName.trim() : undefined,
      category: editProductForm.category,
      price: !isNaN(parsedPrice) ? parsedPrice : editingProduct.price,
      originalPrice: parsedOriginal !== undefined && !isNaN(parsedOriginal) ? parsedOriginal : undefined,
      description: editProductForm.description.trim(),
      deliveryMethod: editProductForm.deliveryMethod.trim(),
      estimatedDeliveryTime: editProductForm.estimatedDeliveryTime.trim(),
      stockStatus: editProductForm.inStock ? editProductForm.stockStatus : 'sob_encomenda',
      inStock: editProductForm.inStock,
      popular: editProductForm.popular,
      badge: editProductForm.badge.trim() || undefined,
    });

    setEditingProduct(null);
  };

  // Change PIN State
  const [newPinInput, setNewPinInput] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinChangedMsg, setPinChangedMsg] = useState(false);
  const [pinChangeError, setPinChangeError] = useState<string | null>(null);

  // Handle Login with server-backed anti-brute force
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim() || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError(null);

    const res = await loginAdmin(pinInput.trim());
    setIsLoggingIn(false);

    if (res.success) {
      setPinInput('');
      setLoginError(null);
      setIsLocked(false);
    } else {
      setLoginError(res.error || 'PIN incorreto.');
      if (res.isLocked) {
        setIsLocked(true);
        setRemainingMinutes(res.remainingMinutes || 15);
      }
      if (res.attemptsRemaining !== undefined) {
        setAttemptsRemaining(res.attemptsRemaining);
      }
    }
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const parsedPrice = parseFloat(newProduct.price.replace(',', '.'));
    const parsedOriginal = newProduct.originalPrice ? parseFloat(newProduct.originalPrice.replace(',', '.')) : undefined;

    const isCustomGame = newProduct.gameId === 'outro';
    const resolvedGameId = isCustomGame
      ? slugifyGameId(newProduct.customGameName)
      : newProduct.gameId;

    addProduct({
      name: newProduct.name,
      sellerName: newProduct.sellerName.trim() || 'WD Coins Oficial',
      gameId: resolvedGameId,
      customGameName: isCustomGame ? newProduct.customGameName.trim() : undefined,
      category: newProduct.category,
      price: isNaN(parsedPrice) ? 10 : parsedPrice,
      originalPrice: parsedOriginal && !isNaN(parsedOriginal) ? parsedOriginal : undefined,
      description: newProduct.description || 'Produto oficial entregue com segurança e rapidez.',
      deliveryMethod: newProduct.deliveryMethod,
      estimatedDeliveryTime: newProduct.estimatedDeliveryTime,
      stockStatus: newProduct.inStock ? 'disponivel' : 'sob_encomenda',
      inStock: newProduct.inStock,
      popular: newProduct.popular,
      badge: newProduct.badge || undefined,
    });

    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      sellerName: 'WD Coins Oficial',
      gameId: 'aion-2',
      customGameName: '',
      category: 'coins',
      price: '',
      originalPrice: '',
      description: '',
      deliveryMethod: 'Entrega in-game via trade ou correio',
      estimatedDeliveryTime: '10 a 20 min',
      inStock: true,
      popular: false,
      badge: '',
    });
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchGame = selectedGameFilter === 'all' || p.gameId === selectedGameFilter;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.sellerName || '').toLowerCase().includes(q) ||
      (p.customGameName || '').toLowerCase().includes(q);
    return matchGame && matchSearch;
  });

  // Stock & Order Counters
  const inStockCount = products.filter(p => p.inStock !== false).length;
  const outOfStockCount = products.filter(p => p.inStock === false).length;
  const pendingCustomCount = customOrders.filter(o => o.status === 'pendente' || (o.status as string) === 'aguardando_comprovante').length;
  const pendingPurchasesCount = purchases.filter(p => p.status === 'pendente' || p.status === 'aguardando_comprovante').length;
  const pendingOrdersCount = pendingCustomCount + pendingPurchasesCount;
  const totalOrdersCount = customOrders.length + purchases.length;

  // -------------------------------------------------------------
  // If not logged in -> PIN screen
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-20 animate-fadeIn">
        <div className={`p-8 rounded-3xl border shadow-xl text-center ${
          isDark
            ? 'bg-[#121622] border-purple-500/20 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 border ${
            isDark
              ? 'bg-purple-500/20 border-purple-400/30 text-purple-300'
              : isRed
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-purple-50 border-purple-200 text-purple-600'
          }`}>
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acesso Restrito /wdadminpage</span>
          </div>

          <h2 className="text-2xl font-bold font-display mb-1.5">
            Painel do Administrador
          </h2>
          <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Área protegida por servidor. Gerencie catálogo de produtos, estoque e encomendas.
          </p>

          {isLocked ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs mb-5 text-left space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Bloqueio de Segurança Ativo!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Muitas tentativas incorretas consecutivas detectadas. O servidor bloqueou novas tentativas temporariamente por {remainingMinutes || 15} minutos para prevenir ataques de força bruta.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1.5 opacity-80">
                  <span>Digite o PIN de Acesso</span>
                  {attemptsRemaining !== null && attemptsRemaining < 5 && (
                    <span className="text-amber-500 font-semibold text-[11px]">
                      {attemptsRemaining} tentativa(s) restante(s)
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  maxLength={12}
                  value={pinInput}
                  disabled={isLoggingIn}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Digite o PIN do servidor"
                  className={`w-full px-4 py-3 rounded-xl text-center text-lg tracking-widest font-mono font-bold border focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-900 border-purple-500/30 text-white focus:border-purple-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500'
                  }`}
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-500 font-semibold text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || !pinInput.trim()}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  isRed
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20'
                }`}
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Validando no Servidor...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Acessar Painel Seguro</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
            <div className={`text-[11px] p-2.5 rounded-xl border w-full text-left space-y-1 ${
              isDark ? 'bg-slate-900/50 border-purple-500/15 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <div className="font-semibold text-slate-300 dark:text-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Segurança de Produção:</span>
              </div>
              <p className="text-[10px]">
                • Proteção anti-hacker com bloqueio após 5 falhas consecutivas.
              </p>
              <p className="text-[10px]">
                • PIN configurável no arquivo <code className="text-purple-400 font-mono">.env (ADMIN_SECRET_PIN)</code>.
              </p>
              <p className="text-[10px]">
                • PIN padrão inicial: <code className="font-mono font-bold text-amber-500">9842</code> ou definido no ambiente.
              </p>
            </div>

            <button
              type="button"
              onClick={onGoToStore}
              className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors pt-1"
            >
              &larr; Voltar para a Loja Pública
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Admin Logged In Screen
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header Bar */}
      <div className={`p-6 rounded-3xl border shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#121622] border-purple-500/20' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isDark ? 'bg-purple-500/20 border-purple-400/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 
                data-typography="section-title"
                className={`text-xl sm:text-2xl font-semibold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}
              >
                Painel Administrativo da Loja
              </h2>
              <p 
                data-typography="description"
                className={`text-xs font-normal font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                Gerencie catálogo de coins/itens, alterne estoque com 1 clique e acompanhe encomendas.
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            data-typography="button"
            className={`px-4 py-2.5 rounded-xl font-semibold font-sans text-white text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95 ${
              isRed ? 'bg-rose-600 hover:bg-rose-500' : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Produto</span>
          </button>

          <button
            onClick={onGoToStore}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Loja Pública</span>
          </button>

          <button
            onClick={logoutAdmin}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Encerrar Sessão
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#131722] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-purple-500 mb-1">
            <span className="font-semibold">Total de Pedidos</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black font-display">{totalOrdersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Compras e Encomendas</div>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#131722] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-amber-500 mb-1">
            <span className="font-semibold">Pedidos Pendentes</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-display text-amber-500">
            {pendingOrdersCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Aguardando pagamento / entrega</div>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#131722] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="font-semibold">Produtos no Catálogo</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{inStockCount} em estoque</div>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isDark ? 'bg-[#131722] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs text-rose-500 mb-1">
            <span className="font-semibold">Esgotados</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-display text-rose-600">
            {outOfStockCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sinalizados no catálogo</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap relative ${
            activeTab === 'orders'
              ? isDark
                ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                : isRed
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-500" />
          <span>Lista de Pedidos ({totalOrdersCount})</span>
          {pendingOrdersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
              {pendingOrdersCount} pendente{pendingOrdersCount > 1 ? 's' : ''}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? isDark
                ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                : isRed
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catálogo & Estoque ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('intermediations')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'intermediations'
              ? isDark
                ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                : isRed
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Intermediações ({intermediations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? isDark
                ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                : isRed
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações (WhatsApp & PIX)</span>
        </button>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* TAB 1: PRODUCTS & STOCK MANAGEMENT */}
      {/* ---------------------------------------------------------- */}
      {activeTab === 'products' && (
        <div>
          {/* Banner de Controle de Demanda e Cadastro Estrito */}
          <div className={`p-4 rounded-xl border mb-5 flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDark ? 'bg-slate-900/60 border-purple-500/20' : 'bg-purple-50/50 border-purple-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-2">
                  <span>Filtro de Demanda no Catálogo:</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    onlyShowRegisteredDemand ? 'bg-emerald-500 text-white' : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {onlyShowRegisteredDemand ? 'Ativo (Apenas o que eu cadastrar com demanda)' : 'Modo Padrão'}
                  </span>
                </div>
                <p className="text-[11px] opacity-75 mt-0.5">
                  Conforme configurado: no catálogo só vai aparecer se tiver alguma demanda cadastrada por você.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setOnlyShowRegisteredDemand(!onlyShowRegisteredDemand)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  onlyShowRegisteredDemand
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                {onlyShowRegisteredDemand ? '✓ Modo Apenas Meus Cadastros Ativo' : 'Ativar Apenas Meus Cadastros'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Deseja limpar todos os produtos de exemplo para manter no catálogo exclusivamente o que você cadastrar?')) {
                    clearAllProducts();
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
                title="Limpar catálogo de exemplo para cadastrar apenas os seus"
              >
                Limpar Catálogo
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <select
                value={selectedGameFilter}
                onChange={(e) => setSelectedGameFilter(e.target.value as any)}
                className={`px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <option value="all">Todos os Jogos</option>
                {GAMES.map(g => (
                  <option key={g.id} value={g.id}>{g.shortName}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95 ${
                  isRed ? 'bg-rose-600 hover:bg-rose-500' : 'bg-purple-600 hover:bg-purple-500'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Novo Produto</span>
              </button>

              <button
                onClick={resetProductsToDefault}
                className="text-[11px] text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors px-2 py-1"
                title="Restaura os produtos padrão iniciais da loja"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restaurar Catálogo Padrão</span>
              </button>
            </div>
          </div>

          {/* Product Items Table / Grid */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm ${
            isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <tr>
                    <th className="p-3.5 font-bold">Produto</th>
                    <th className="p-3.5 font-bold">Jogo & Categoria</th>
                    <th className="p-3.5 font-bold">Preço (Editar)</th>
                    <th className="p-3.5 font-bold text-center">Status no Estoque</th>
                    <th className="p-3.5 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredProducts.map(product => {
                    const game = GAMES.find(g => g.id === product.gameId);
                    const isInStock = product.inStock !== false;
                    const isInlineEditing = inlineEditingId === product.id;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        {/* Name & Desc */}
                        <td className="p-3.5">
                          <div className="font-bold font-display flex items-center gap-2">
                            {product.category === 'coins' && <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                            <span className={isInStock ? '' : 'line-through text-slate-400'}>
                              {product.name}
                            </span>
                            {product.popular && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                                Destaque
                              </span>
                            )}
                            {product.badge && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                            <span className="font-semibold text-purple-400">
                              Usuário: {product.sellerName || 'WD Coins Oficial'}
                            </span>{' '}
                            · {product.description}
                          </div>
                        </td>

                        {/* Game & Category */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            product.gameId === 'poke-idle'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : product.gameId === 'mu-idle'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {game?.shortName || product.customGameName || product.gameId}
                          </span>
                          <span className="text-slate-400 ml-1.5 capitalize">
                            • {product.category}
                          </span>
                        </td>

                        {/* Price (Editable Inline) */}
                        <td className="p-3.5 whitespace-nowrap">
                          {isInlineEditing ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-400">R$</span>
                              <input
                                type="text"
                                autoFocus
                                value={inlinePriceInput}
                                onChange={(e) => setInlinePriceInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlinePrice(product.id);
                                  if (e.key === 'Escape') handleCancelInlinePrice();
                                }}
                                className={`w-20 px-2 py-1 text-xs font-bold rounded-lg border focus:outline-none ${
                                  isDark ? 'bg-slate-900 border-purple-500 text-white' : 'bg-white border-purple-500 text-slate-900'
                                }`}
                                placeholder="0,00"
                              />
                              <button
                                onClick={() => handleSaveInlinePrice(product.id)}
                                className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                title="Salvar novo preço"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelInlinePrice}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                                title="Cancelar edição rápida"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/price">
                              <div>
                                <span className="font-bold text-sm">
                                  R$ {product.price.toFixed(2).replace('.', ',')}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-[10px] line-through text-slate-400 ml-1.5 font-normal">
                                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleStartInlineEdit(product)}
                                className="opacity-60 hover:opacity-100 p-1 text-slate-400 hover:text-purple-400 transition-opacity rounded hover:bg-slate-800/30"
                                title="Clique para editar valor rapidamente"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Stock & Demand Toggle Switch */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => toggleStock(product.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border shadow-sm ${
                                isInStock
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100'
                              }`}
                              title="Clique para alternar o status de estoque"
                            >
                              {isInStock ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Estoque</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Esgotado</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => toggleProductDemand(product.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                                product.hasDemand !== false
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                                  : 'bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20'
                              }`}
                              title="Alternar se o item tem demanda ativa no catálogo"
                            >
                              <span>{product.hasDemand !== false ? 'Demanda: Sim' : 'Demanda: Não'}</span>
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(product)}
                              className="px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors flex items-center gap-1.5 text-[11px] font-semibold border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700"
                              title="Editar valor, nome, desconto e detalhes do produto"
                            >
                              <Pencil className="w-3.5 h-3.5 text-purple-500" />
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                              title="Excluir produto da loja"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Nenhum produto encontrado com os filtros atuais.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* TAB: LISTA UNIFICADA DE PEDIDOS (ENCOMENDAS & COMPRAS) */}
      {/* ---------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <AdminOrderList
          customOrders={customOrders}
          purchases={purchases}
          updateCustomOrderStatus={updateCustomOrderStatus}
          deleteCustomOrder={deleteCustomOrder}
          updatePurchaseStatus={updatePurchaseStatus}
          deletePurchase={deletePurchase}
          whatsappNumber={storeConfig.whatsappNumber}
        />
      )}

      {/* ---------------------------------------------------------- */}
      {/* TAB 4: SETTINGS (WHATSAPP, PIX & PIN) */}
      {/* ---------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Componente Modular de Configurações da Loja (WhatsApp & PIX) */}
          <AdminStoreSettings />

          {/* CARD 3: SEGURANÇA E PIN */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-md mx-auto">
              <div className={`p-6 rounded-3xl border shadow-sm ${
                isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className="text-base font-bold font-display mb-2 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-500" />
                  <span>Alterar PIN de Acesso ao Painel</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Defina um novo PIN para restringir o painel seguro. A alteração é validada e sincronizada no servidor.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Novo PIN (mínimo 4 caracteres)</label>
                    <input
                      type="password"
                      maxLength={12}
                      value={newPinInput}
                      disabled={isChangingPin}
                      onChange={(e) => {
                        setNewPinInput(e.target.value);
                        setPinChangeError(null);
                      }}
                      placeholder="Digite novo PIN seguro..."
                      className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  {pinChangedMsg && (
                    <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> PIN atualizado no servidor com sucesso!
                    </p>
                  )}

                  {pinChangeError && (
                    <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> {pinChangeError}
                    </p>
                  )}

                  <button
                    onClick={async () => {
                      if (newPinInput.trim().length >= 4) {
                        setIsChangingPin(true);
                        setPinChangeError(null);
                        const res = await changeAdminPin(newPinInput.trim());
                        setIsChangingPin(false);
                        if (res.success) {
                          setNewPinInput('');
                          setPinChangedMsg(true);
                          setTimeout(() => setPinChangedMsg(false), 4000);
                        } else {
                          setPinChangeError(res.error || 'Erro ao alterar PIN.');
                        }
                      }
                    }}
                    disabled={newPinInput.trim().length < 4 || isChangingPin}
                    className="w-full py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    {isChangingPin ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <span>Salvar Novo PIN</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* TAB 4: INTERMEDIAÇÕES MANAGEMENT (ESCROW) */}
      {/* ---------------------------------------------------------- */}
      {activeTab === 'intermediations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-display flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Salas de Intermediação Segura ({intermediations.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Acompanhe o chat entre comprador e vendedor, confirme pagamentos retidos e libere valores.
              </p>
            </div>
          </div>

          {intermediations.length === 0 ? (
            <div className={`p-12 rounded-2xl border text-center ${
              isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-60" />
              <p className="text-sm font-semibold">Nenhuma intermediação aberta até o momento.</p>
              <p className="text-xs text-slate-400 mt-1">Quando um usuário solicitar intermediação pelo site, ela aparecerá aqui em tempo real.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {intermediations.map((room) => {
                return (
                  <div
                    key={room.id}
                    className={`p-5 rounded-2xl border transition-colors ${
                      isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-inherit/40">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            Código: {room.code}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {room.customGameName || room.gameId} ({room.server})
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            Valor: R$ {room.agreedValue}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm mt-1.5">{room.itemOrCoinsDescription}</h4>
                      </div>

                      {/* Status Selector for Admin */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold opacity-70">Status:</span>
                        <select
                          value={room.status}
                          onChange={(e) => updateIntermediationStatus(room.id, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                            room.status === 'pagamento_retido'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : room.status === 'concluido'
                              ? 'bg-emerald-600 text-white border-transparent'
                              : room.status === 'entrega_andamento'
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                              : isDark
                              ? 'bg-slate-900 border-slate-700 text-white'
                              : 'bg-slate-100 border-slate-300 text-slate-800'
                          }`}
                        >
                          <option value="aguardando_participante">Aguardando 2º Jogador</option>
                          <option value="em_negociacao">Em Negociação</option>
                          <option value="pagamento_retido">💰 Pagamento Retido (Seguro)</option>
                          <option value="entrega_andamento">📦 Entrega in-game</option>
                          <option value="concluido">✅ Negociação Concluída</option>
                          <option value="cancelado">❌ Cancelada</option>
                        </select>
                      </div>
                    </div>

                    {/* Participants & WhatsApp Shortcuts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3.5 border-b border-inherit/40 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/40 dark:bg-slate-950/40 border border-inherit/30 space-y-1">
                        <div className="font-bold text-blue-400 flex items-center justify-between">
                          <span>Vendedor:</span>
                          {room.seller?.whatsapp && (
                            <a
                              href={`https://wa.me/${room.seller.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Sou o intermediador da WD Coins referente à negociação *${room.code}*.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                        <p className="font-semibold">{room.seller ? `${room.seller.name} (Nick: ${room.seller.characterName || 'N/A'})` : 'Aguardando entrar'}</p>
                        <p className="opacity-70 text-[11px]">WhatsApp: {room.seller?.whatsapp || 'N/A'}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/40 dark:bg-slate-950/40 border border-inherit/30 space-y-1">
                        <div className="font-bold text-amber-400 flex items-center justify-between">
                          <span>Comprador:</span>
                          {room.buyer?.whatsapp && (
                            <a
                              href={`https://wa.me/${room.buyer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Sou o intermediador da WD Coins referente à negociação *${room.code}*.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                        <p className="font-semibold">{room.buyer ? `${room.buyer.name} (Nick: ${room.buyer.characterName || 'N/A'})` : 'Aguardando código'}</p>
                        <p className="opacity-70 text-[11px]">WhatsApp: {room.buyer?.whatsapp || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Messages Preview */}
                    <div className="pt-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold opacity-80">Últimas Mensagens no Chat da Sala ({room.messages.length}):</span>
                      </div>

                      <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-950/50 border border-inherit/30 text-xs">
                        {room.messages.slice(-5).map(m => (
                          <div key={m.id} className="text-[11px] leading-relaxed">
                            <span className="font-bold opacity-75">{m.senderName}: </span>
                            <span className={m.isOfficial ? 'text-purple-300 font-semibold' : ''}>{m.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Quick Send Staff Message */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const input = (e.currentTarget.elements.namedItem('staffMsg') as HTMLInputElement);
                          if (input && input.value.trim()) {
                            sendIntermediationMessage(room.id, {
                              senderRole: 'intermediador',
                              senderName: 'Intermediador Oficial WD Coins',
                              text: input.value.trim(),
                              isOfficial: true,
                            });
                            input.value = '';
                          }
                        }}
                        className="flex items-center gap-2 mt-3"
                      >
                        <input
                          name="staffMsg"
                          type="text"
                          placeholder="Responder oficialmente como Intermediador WD Coins..."
                          className={`flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                        >
                          Enviar Resposta
                        </button>
                      </form>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* MODAL: PUBLICAR NOVO PRODUTO */}
      {/* ---------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 overflow-y-auto max-h-[90vh] ${
            isDark ? 'bg-[#131722] border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Publicar Novo Produto</h3>
                  <p className="text-xs text-slate-400">Preencha os dados do item ou coins a vender.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Ex: 500M Kinah, 100M Gold, Set +15..."
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Usuário / Vendedor *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sellerName}
                    onChange={(e) => setNewProduct({ ...newProduct, sellerName: e.target.value })}
                    placeholder="Ex: GabsKinah, WD Coins Oficial..."
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Jogo *</label>
                  <select
                    value={newProduct.gameId}
                    onChange={(e) => setNewProduct({ ...newProduct, gameId: e.target.value as GameId })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {GAMES.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                    <option value="outro">+ Outro jogo (cadastrar novo)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Categoria *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="coins">Coins & Moedas</option>
                    <option value="items">Itens & Refinos</option>
                    <option value="combos">Combos & Pacotes</option>
                  </select>
                </div>
              </div>

              {newProduct.gameId === 'outro' && (
                <div>
                  <label className="block font-bold mb-1">Nome do Novo Jogo *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.customGameName}
                    onChange={(e) => setNewProduct({ ...newProduct, customGameName: e.target.value })}
                    placeholder="Ex: Lineage 2, Ragnarok Idle, etc."
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-purple-500/60 text-white' : 'bg-slate-50 border-purple-400 text-slate-900'
                    }`}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Preço em R$ *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="Ex: 25.00"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Preço Original (opcional)</label>
                  <input
                    type="text"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="Ex: 35.00 (riscado)"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Descrição Curta</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Informações rápidas sobre a quantia ou bônus do produto..."
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tempo Estimado</label>
                  <input
                    type="text"
                    value={newProduct.estimatedDeliveryTime}
                    onChange={(e) => setNewProduct({ ...newProduct, estimatedDeliveryTime: e.target.value })}
                    placeholder="Ex: 5 a 15 min"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Selo / Tag (opcional)</label>
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    placeholder="Ex: Mais Vendido, Promoção"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-3 rounded-xl border space-y-2 border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span className="font-bold">Item Disponível em Estoque Imediato</span>
                </label>
                <p className="text-[10px] text-slate-400 pl-6">
                  Se desmarcar, o produto será exibido com status "Sem Estoque / Sob Encomenda".
                </p>

                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={newProduct.popular}
                    onChange={(e) => setNewProduct({ ...newProduct, popular: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="font-bold">Destacar na Vitrine (Badge Destaque)</span>
                </label>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md"
                >
                  Publicar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* MODAL: EDITAR PRODUTO / VALORES */}
      {/* ---------------------------------------------------------- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 overflow-y-auto max-h-[90vh] ${
            isDark ? 'bg-[#131722] border-purple-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">Editar Produto & Valores</h3>
                  <p className="text-xs text-slate-400">Altere o preço em R$, descontos, estoque e detalhes do item.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    required
                    value={editProductForm.name}
                    onChange={(e) => setEditProductForm({ ...editProductForm, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Usuário / Vendedor *</label>
                  <input
                    type="text"
                    required
                    value={editProductForm.sellerName}
                    onChange={(e) => setEditProductForm({ ...editProductForm, sellerName: e.target.value })}
                    placeholder="Ex: GabsKinah, WD Coins Oficial..."
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Jogo *</label>
                  <select
                    value={editProductForm.gameId}
                    onChange={(e) => setEditProductForm({ ...editProductForm, gameId: e.target.value as GameId })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {GAMES.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                    <option value="outro">+ Outro jogo (customizado)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Categoria *</label>
                  <select
                    value={editProductForm.category}
                    onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value as ProductCategory })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="coins">Coins & Moedas</option>
                    <option value="items">Itens & Refinos</option>
                    <option value="combos">Combos & Pacotes</option>
                  </select>
                </div>
              </div>

              {editProductForm.gameId === 'outro' && (
                <div>
                  <label className="block font-bold mb-1">Nome do Jogo Customizado *</label>
                  <input
                    type="text"
                    required
                    value={editProductForm.customGameName}
                    onChange={(e) => setEditProductForm({ ...editProductForm, customGameName: e.target.value })}
                    placeholder="Ex: Lineage 2, Ragnarok Idle, etc."
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-purple-500/60 text-white' : 'bg-slate-50 border-purple-400 text-slate-900'
                    }`}
                  />
                </div>
              )}

              {/* Price inputs highlighted */}
              <div className={`p-3.5 rounded-2xl border grid grid-cols-2 gap-3 ${
                isDark ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50/60 border-purple-200'
              }`}>
                <div>
                  <label className="block font-bold mb-1 text-purple-600 dark:text-purple-300 flex items-center gap-1">
                    <span>Preço de Venda (R$) *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input
                      type="text"
                      required
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                      placeholder="Ex: 25,00"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl font-bold border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-purple-500/50 text-white' : 'bg-white border-purple-400 text-slate-900'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Valor final cobrado no PIX/USDT.</p>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-500 dark:text-slate-400">
                    Preço Original / De: (opcional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                    <input
                      type="text"
                      value={editProductForm.originalPrice}
                      onChange={(e) => setEditProductForm({ ...editProductForm, originalPrice: e.target.value })}
                      placeholder="Ex: 35,00 (riscado)"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Exibido riscado como desconto.</p>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Descrição Curta</label>
                <textarea
                  rows={2}
                  value={editProductForm.description}
                  onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                  placeholder="Informações rápidas sobre a quantia ou bônus do produto..."
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tempo Estimado</label>
                  <input
                    type="text"
                    value={editProductForm.estimatedDeliveryTime}
                    onChange={(e) => setEditProductForm({ ...editProductForm, estimatedDeliveryTime: e.target.value })}
                    placeholder="Ex: 5 a 15 min"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Selo / Tag (Badge)</label>
                  <input
                    type="text"
                    value={editProductForm.badge}
                    onChange={(e) => setEditProductForm({ ...editProductForm, badge: e.target.value })}
                    placeholder="Ex: Mais Vendido, Promoção, Raro"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Método de Entrega</label>
                <input
                  type="text"
                  value={editProductForm.deliveryMethod}
                  onChange={(e) => setEditProductForm({ ...editProductForm, deliveryMethod: e.target.value })}
                  placeholder="Ex: Entrega in-game via trade ou correio"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Toggles & Stock Status */}
              <div className="p-3.5 rounded-2xl border space-y-3 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div>
                  <label className="block font-bold mb-1">Status de Disponibilidade</label>
                  <select
                    value={editProductForm.stockStatus}
                    onChange={(e) => setEditProductForm({ ...editProductForm, stockStatus: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="disponivel">Disponível em Estoque</option>
                    <option value="poucas_unidades">Poucas Unidades Restantes</option>
                    <option value="sob_encomenda">Sob Encomenda</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editProductForm.inStock}
                      onChange={(e) => setEditProductForm({ ...editProductForm, inStock: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span className="font-bold">Item Disponível em Estoque</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editProductForm.popular}
                      onChange={(e) => setEditProductForm({ ...editProductForm, popular: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="font-bold">Destacar na Vitrine</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
