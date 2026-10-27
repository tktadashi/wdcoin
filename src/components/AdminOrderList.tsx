import React, { useState, useMemo } from 'react';
import { CustomOrder, PurchaseOrder, GameId, UnifiedOrderStatus } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GAMES } from '../data/storeData';
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  Edit3,
  Calendar,
  Gamepad2,
  User,
  AlertCircle,
  Coins,
  ArrowUpDown,
  FileText
} from 'lucide-react';

export type FilterStatus = 'all' | UnifiedOrderStatus;
export type FilterType = 'all' | 'purchases' | 'custom_orders';

// Normalized order item for unified display
export interface UnifiedOrder {
  rawId: string;
  kind: 'purchase' | 'custom_order';
  id: string;
  createdAt: string;
  customerName: string;
  customerWhatsApp: string;
  gameId: string;
  gameName: string;
  server: string;
  characterName: string;
  title: string;
  details: string;
  totalDisplay: string;
  paymentMethod?: string;
  status: UnifiedOrderStatus;
  rawStatus: string;
  adminNotes?: string;
  originalPurchase?: PurchaseOrder;
  originalCustomOrder?: CustomOrder;
}

// Normalizes various status strings to the four core statuses: pendente, pago, entregue, cancelado
export function normalizeStatus(status: string): UnifiedOrderStatus {
  if (status === 'entregue' || status === 'concluido') return 'entregue';
  if (status === 'pago' || status === 'aceito' || status === 'em_analise' || status === 'em_entrega') return 'pago';
  if (status === 'cancelado') return 'cancelado';
  return 'pendente'; // 'pendente', 'aguardando_comprovante'
}

interface AdminOrderListProps {
  customOrders: CustomOrder[];
  purchases: PurchaseOrder[];
  updateCustomOrderStatus: (id: string, status: CustomOrder['status'], adminNotes?: string) => void;
  deleteCustomOrder: (id: string) => void;
  updatePurchaseStatus: (id: string, status: PurchaseOrder['status']) => void;
  deletePurchase?: (id: string) => void;
  whatsappNumber?: string;
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({
  customOrders,
  purchases,
  updateCustomOrderStatus,
  deleteCustomOrder,
  updatePurchaseStatus,
  deletePurchase,
  whatsappNumber,
}) => {
  const { isDark, isRed } = useTheme();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status feedback toast
  const [statusToast, setStatusToast] = useState<{ id: string; message: string } | null>(null);

  // Inline admin note editing for custom orders
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');

  // Unify custom orders and purchases into a single sorted list
  const unifiedOrders = useMemo<UnifiedOrder[]>(() => {
    const list: UnifiedOrder[] = [];

    // 1. Process Product Purchases
    purchases.forEach(p => {
      const gameObj = GAMES.find(g => g.id === p.gameId);
      const normalized = normalizeStatus(p.status);

      list.push({
        rawId: p.id,
        kind: 'purchase',
        id: p.id,
        createdAt: p.createdAt,
        customerName: p.characterName || 'Cliente Catálogo',
        customerWhatsApp: p.customerWhatsApp,
        gameId: p.gameId,
        gameName: gameObj ? gameObj.name : p.gameId,
        server: p.server,
        characterName: p.characterName,
        title: `${p.productName} (x${p.quantity})`,
        details: `Produto do catálogo da loja. Servidor: ${p.server} | Char: ${p.characterName}`,
        totalDisplay: `R$ ${p.total.toFixed(2).replace('.', ',')}`,
        paymentMethod: p.paymentMethod ? p.paymentMethod.toUpperCase() : 'PIX',
        status: normalized,
        rawStatus: p.status,
        originalPurchase: p,
      });
    });

    // 2. Process Custom Orders (Encomendas)
    customOrders.forEach(o => {
      const gameObj = GAMES.find(g => g.id === o.gameId);
      const normalized = normalizeStatus(o.status);

      list.push({
        rawId: o.id,
        kind: 'custom_order',
        id: o.id,
        createdAt: o.createdAt,
        customerName: o.customerName,
        customerWhatsApp: o.customerWhatsApp,
        gameId: o.gameId,
        gameName: gameObj ? gameObj.name : (o.customGameName || 'Outro Jogo'),
        server: o.server,
        characterName: o.characterName,
        title: `Encomenda: ${o.orderType.toUpperCase()}`,
        details: o.details,
        totalDisplay: o.budget ? o.budget : 'A Combinar / Sob Cotação',
        paymentMethod: 'Sob Demanda',
        status: normalized,
        rawStatus: o.status,
        adminNotes: o.adminNotes,
        originalCustomOrder: o,
      });
    });

    // Sort descending by date (most recent first)
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [purchases, customOrders]);

  // Filter logic
  const filteredOrders = useMemo(() => {
    return unifiedOrders.filter(order => {
      // 1. Status Filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // 2. Type Filter
      if (typeFilter === 'purchases' && order.kind !== 'purchase') return false;
      if (typeFilter === 'custom_orders' && order.kind !== 'custom_order') return false;

      // 3. Game Filter
      if (gameFilter !== 'all' && order.gameId !== gameFilter) return false;

      // 4. Search Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(term);
        const matchesName = order.customerName.toLowerCase().includes(term);
        const matchesPhone = order.customerWhatsApp.includes(term);
        const matchesChar = order.characterName.toLowerCase().includes(term);
        const matchesTitle = order.title.toLowerCase().includes(term);
        const matchesDetails = order.details.toLowerCase().includes(term);

        if (!matchesId && !matchesName && !matchesPhone && !matchesChar && !matchesTitle && !matchesDetails) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedOrders, statusFilter, typeFilter, gameFilter, searchTerm]);

  // Metric counts
  const countTotal = unifiedOrders.length;
  const countPendente = unifiedOrders.filter(o => o.status === 'pendente').length;
  const countPago = unifiedOrders.filter(o => o.status === 'pago').length;
  const countEntregue = unifiedOrders.filter(o => o.status === 'entregue').length;
  const countCancelado = unifiedOrders.filter(o => o.status === 'cancelado').length;

  // Handle status change
  const handleUpdateStatus = (order: UnifiedOrder, newStatus: UnifiedOrderStatus) => {
    if (order.kind === 'purchase') {
      // Map to purchase status
      const mappedPurchaseStatus: PurchaseOrder['status'] =
        newStatus === 'entregue' ? 'entregue' :
        newStatus === 'pago' ? 'pago' :
        newStatus === 'cancelado' ? 'cancelado' : 'pendente';
      updatePurchaseStatus(order.rawId, mappedPurchaseStatus);
    } else {
      // Map to custom order status
      const mappedCustomStatus: CustomOrder['status'] =
        newStatus === 'entregue' ? 'entregue' :
        newStatus === 'pago' ? 'aceito' :
        newStatus === 'cancelado' ? 'cancelado' : 'pendente';
      updateCustomOrderStatus(order.rawId, mappedCustomStatus);
    }

    const label = 
      newStatus === 'pendente' ? 'Pendente' :
      newStatus === 'pago' ? 'Aceito / Em Andamento' :
      newStatus === 'entregue' ? 'Entregue' : 'Cancelado';

    setStatusToast({
      id: order.id,
      message: `Status do pedido #${order.id} alterado para "${label}"!`,
    });
    setTimeout(() => setStatusToast(null), 3000);
  };

  // Aceitar Pedido: Atualiza para aceito/em andamento e abre WhatsApp do cliente
  const handleAcceptOrder = (order: UnifiedOrder) => {
    // 1. Atualiza status no store
    if (order.kind === 'purchase') {
      updatePurchaseStatus(order.rawId, 'pago');
    } else {
      updateCustomOrderStatus(order.rawId, 'aceito', 'Pedido aceito pelo administrador. Em andamento.');
    }

    // 2. Formata número de WhatsApp do cliente com DDI 55 caso não tenha
    let num = order.customerWhatsApp.replace(/\D/g, '');
    if (num.length >= 10 && !num.startsWith('55')) {
      num = `55${num}`;
    }

    // 3. Monta mensagem informando que o pedido está em andamento
    const clientName = order.characterName || order.customerName || 'Cliente';
    let message = `Olá ${clientName}! 🎮 Seu pedido (#${order.id}) no ${order.gameName} foi ACEITO pela administração e já está EM ANDAMENTO! 🚀\n\n`;
    message += `📋 Detalhes do Pedido:\n`;
    message += `• Solicitação: ${order.title}\n`;
    message += `• Especificações: ${order.details}\n`;
    if (order.totalDisplay && order.totalDisplay !== 'A Combinar / Sob Cotação') {
      message += `• Valor acordado: ${order.totalDisplay}\n`;
    }
    if (order.paymentMethod && order.paymentMethod !== 'Sob Demanda') {
      message += `• Forma de Pagamento: ${order.paymentMethod}\n`;
    }
    message += `\nNossa equipe já está providenciando. Qualquer dúvida, estou à disposição por aqui!`;

    const whatsappUrl = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

    // 4. Abre janela direta no WhatsApp do cliente
    window.open(whatsappUrl, '_blank');

    setStatusToast({
      id: order.id,
      message: `Pedido #${order.id} ACEITO! Janela do WhatsApp aberta avisando o cliente que o pedido está em andamento.`,
    });
    setTimeout(() => setStatusToast(null), 4500);
  };

  // Recusar Pedido: Confirma e marca como cancelado
  const handleRejectOrder = (order: UnifiedOrder) => {
    if (window.confirm(`Deseja realmente recusar / não aceitar o pedido #${order.id}?`)) {
      if (order.kind === 'purchase') {
        updatePurchaseStatus(order.rawId, 'cancelado');
      } else {
        updateCustomOrderStatus(order.rawId, 'cancelado', 'Pedido recusado pelo administrador.');
      }

      setStatusToast({
        id: order.id,
        message: `Pedido #${order.id} foi recusado e marcado como Cancelado.`,
      });
      setTimeout(() => setStatusToast(null), 3000);
    }
  };

  // Handle Copy ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Note Save for Custom Order
  const handleSaveNote = (orderId: string) => {
    updateCustomOrderStatus(orderId, undefined as any, noteInput.trim());
    setEditingNoteId(null);
  };

  // Status Colors & Badges Helper
  const getStatusBadge = (status: UnifiedOrderStatus) => {
    switch (status) {
      case 'pendente':
        return {
          bg: isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800',
          dot: 'bg-amber-500 animate-pulse',
          label: 'Pendente',
          icon: Clock,
        };
      case 'pago':
        return {
          bg: isDark ? 'bg-blue-500/15 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-800',
          dot: 'bg-blue-500',
          label: 'Aceito / Em Andamento',
          icon: CheckCircle2,
        };
      case 'entregue':
        return {
          bg: isDark ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800',
          dot: 'bg-emerald-500',
          label: 'Entregue',
          icon: Check,
        };
      case 'cancelado':
        return {
          bg: isDark ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-800',
          dot: 'bg-rose-500',
          label: 'Cancelado',
          icon: XCircle,
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {statusToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-semibold">{statusToast.message}</span>
          </div>
          <button
            onClick={() => setStatusToast(null)}
            className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. STATUS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* All */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'all'
              ? isDark
                ? 'bg-purple-500/20 border-purple-500 text-white shadow-md'
                : 'bg-purple-50 border-purple-300 text-purple-900 shadow-sm'
              : isDark
              ? 'bg-[#121622] border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold">Todos os Pedidos</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black font-display">{countTotal}</div>
          <div className="text-[10px] text-slate-400 mt-1">Compras & Encomendas</div>
        </button>

        {/* Pendente */}
        <button
          onClick={() => setStatusFilter('pendente')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'pendente'
              ? isDark
                ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                : 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
              : isDark
              ? 'bg-[#121622] border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-500 mb-1">
            <span className="font-semibold">Pendentes</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-display text-amber-500">{countPendente}</div>
          <div className="text-[10px] text-slate-400 mt-1">Aguardando ação/pagto</div>
        </button>

        {/* Pago */}
        <button
          onClick={() => setStatusFilter('pago')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'pago'
              ? isDark
                ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-md'
                : 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm'
              : isDark
              ? 'bg-[#121622] border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-blue-500 mb-1">
            <span className="font-semibold">Pagos / Preparando</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black font-display text-blue-500">{countPago}</div>
          <div className="text-[10px] text-slate-400 mt-1">Prontos para trade/entrega</div>
        </button>

        {/* Entregue */}
        <button
          onClick={() => setStatusFilter('entregue')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'entregue'
              ? isDark
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
              : isDark
              ? 'bg-[#121622] border-slate-800 text-slate-300 hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-500 mb-1">
            <span className="font-semibold">Entregues</span>
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-500">{countEntregue}</div>
          <div className="text-[10px] text-slate-400 mt-1">Concluídos com sucesso</div>
        </button>

      </div>

      {/* 2. FILTERS CONTROLS BAR */}
      <div className={`p-5 rounded-3xl border shadow-xs space-y-4 ${
        isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Search & Game Select */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ID (#PED, #ENC), cliente, WhatsApp, char ou item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none ${
                isDark ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Game Selector */}
            <select
              value={gameFilter}
              onChange={(e) => setGameFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs focus:outline-none cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">Todos os Jogos</option>
              {GAMES.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
              <option value="outro">Outros Jogos</option>
            </select>
          </div>

        </div>

        {/* Segmented Controls: Type & Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* Order Kind Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Todos ({unifiedOrders.length})
            </button>
            <button
              onClick={() => setTypeFilter('purchases')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                typeFilter === 'purchases'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Compras ({purchases.length})</span>
            </button>
            <button
              onClick={() => setTypeFilter('custom_orders')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                typeFilter === 'custom_orders'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Encomendas ({customOrders.length})</span>
            </button>
          </div>

          {/* Status Quick Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Filtrar Status:</span>
            
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                statusFilter === 'all'
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setStatusFilter('pendente')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                statusFilter === 'pendente'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pendente ({countPendente})</span>
            </button>

            <button
              onClick={() => setStatusFilter('pago')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                statusFilter === 'pago'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Pago ({countPago})</span>
            </button>

            <button
              onClick={() => setStatusFilter('entregue')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                statusFilter === 'entregue'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Entregue ({countEntregue})</span>
            </button>

            <button
              onClick={() => setStatusFilter('cancelado')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                statusFilter === 'cancelado'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Cancelado ({countCancelado})</span>
            </button>
          </div>

        </div>

      </div>

      {/* 3. ORDER LIST CARDS */}
      {filteredOrders.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          isDark ? 'bg-[#121622] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-700 dark:text-slate-200">Nenhum pedido encontrado</h3>
          <p className="text-xs mt-1 max-w-md mx-auto text-slate-400">
            Não há pedidos correspondentes aos filtros selecionados. Tente limpar a busca ou mudar os filtros de status.
          </p>
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || gameFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
                setGameFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>Exibindo <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}</span>
            <span className="text-[11px]">Ordenado pelos mais recentes primeiro</span>
          </div>

          {filteredOrders.map(order => {
            const badge = getStatusBadge(order.status);
            const BadgeIcon = badge.icon;
            const cleanPhone = order.customerWhatsApp.replace(/\D/g, '');
            const phoneWithCountryCode = cleanPhone.length >= 10 && !cleanPhone.startsWith('55')
              ? `55${cleanPhone}`
              : cleanPhone;

            return (
              <div
                key={`${order.kind}-${order.id}`}
                className={`p-5 rounded-3xl border shadow-xs transition-all ${
                  isDark ? 'bg-[#121622] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                
                {/* Top Bar: Kind Badge, ID, Date and Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Kind Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      order.kind === 'purchase'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20'
                    }`}>
                      {order.kind === 'purchase' ? (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>Compra da Loja</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Encomenda Sob Demanda</span>
                        </>
                      )}
                    </span>

                    {/* Order ID with Copy */}
                    <button
                      onClick={() => handleCopyId(order.id)}
                      className="font-mono font-bold text-xs text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      title="Clique para copiar ID do pedido"
                    >
                      <span>#{order.id}</span>
                      {copiedId === order.id ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    {/* Created Date */}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(order.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </span>
                  </div>

                  {/* Status & Decision Controls (Aceitar / Recusar) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Caso Pendente: Botões diretos para Aceitar ou Recusar */}
                    {order.status === 'pendente' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAcceptOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 hover:shadow-emerald-600/25"
                          title="Aceitar pedido e abrir WhatsApp do cliente informando que está em andamento"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Aceitar Pedido</span>
                        </button>

                        <button
                          onClick={() => handleRejectOrder(order)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white border border-rose-500/25 font-bold text-xs flex items-center gap-1 transition-all active:scale-95"
                          title="Não aceitar / recusar este pedido"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Recusar</span>
                        </button>
                      </div>
                    )}

                    {/* Caso Aceito / Em Andamento */}
                    {order.status === 'pago' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(order, 'entregue')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs active:scale-95"
                          title="Marcar pedido como Entregue / Concluído"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marcar Entregue</span>
                        </button>

                        <button
                          onClick={() => handleAcceptOrder(order)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                          title="Reabrir mensagem no WhatsApp do cliente"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    )}

                    {/* Dropdown seletor de status para ajuste fino */}
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order, e.target.value as UnifiedOrderStatus)}
                        data-typography="order-status"
                        className={`text-xs font-semibold font-sans px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-all ${
                          order.status === 'pendente'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                            : order.status === 'pago'
                            ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300'
                            : order.status === 'entregue'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        <option value="pendente">⏳ Pendente</option>
                        <option value="pago">🚀 Aceito / Em Andamento</option>
                        <option value="entregue">✅ Entregue / Concluído</option>
                        <option value="cancelado">❌ Cancelado / Recusado</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Main Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3 text-xs">
                  
                  {/* Col 1: Customer & In-Game Info */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 flex items-center gap-1">
                      <User className="w-3 h-3 text-purple-400" />
                      <span>Dados do Cliente & Jogo</span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{order.customerName}</span>
                    </div>

                    <div className="text-slate-600 dark:text-slate-200 font-medium">
                      Jogo: <strong className="text-purple-600 dark:text-purple-300 font-bold">{order.gameName}</strong>
                    </div>

                    <div className="text-slate-600 dark:text-slate-200 font-medium">
                      WhatsApp: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{order.customerWhatsApp}</strong>
                    </div>

                    {order.server && order.server !== 'Padrão' && order.server !== 'Sem Servidor' && (
                      <div className="text-slate-600 dark:text-slate-200 font-medium">
                        Servidor: <strong className="text-slate-900 dark:text-white font-bold">{order.server}</strong>
                      </div>
                    )}

                    {order.characterName && order.characterName !== 'Cliente' && order.characterName !== 'Sem Nick' && (
                      <div className="text-slate-600 dark:text-slate-200 font-medium">
                        Char (Nick): <strong className="text-slate-900 dark:text-white font-mono font-bold">{order.characterName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Col 2: Item & Content */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300 flex items-center gap-1">
                      <Coins className="w-3 h-3 text-amber-400" />
                      <span>Item ou Solicitação Solicitada</span>
                    </div>

                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {order.title}
                    </div>

                    <div className={`p-3 rounded-2xl border leading-relaxed text-xs font-medium ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      {order.details}
                    </div>

                    {/* Admin Notes Section (if custom order) */}
                    {order.kind === 'custom_order' && (
                      <div className="mt-2 text-[11px]">
                        {editingNoteId === order.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={noteInput}
                              onChange={(e) => setNoteInput(e.target.value)}
                              placeholder="Observação interna (ex: entregar em Lorencia bau 1)..."
                              className={`flex-1 px-2.5 py-1 rounded-lg border text-xs ${
                                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                              }`}
                            />
                            <button
                              onClick={() => handleSaveNote(order.rawId)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2 py-1 text-slate-400 hover:text-slate-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-slate-400">
                            <span>
                              Nota interna: <em className="text-slate-600 dark:text-slate-300">{order.adminNotes || 'Nenhuma anotação'}</em>
                            </span>
                            <button
                              onClick={() => {
                                setEditingNoteId(order.id);
                                setNoteInput(order.adminNotes || '');
                              }}
                              className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{order.adminNotes ? 'Editar nota' : 'Adicionar nota'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer Bar: Total Price + WhatsApp Button + Delete */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-center gap-3">
                    <div>
                      <span 
                        data-typography="info"
                        className="text-[10px] text-slate-400 block uppercase font-normal font-sans"
                      >
                        Valor / Orçamento
                      </span>
                      <span 
                        data-typography="price"
                        className="text-base font-semibold font-sans text-emerald-600 dark:text-emerald-400"
                      >
                        {order.totalDisplay}
                      </span>
                    </div>

                    <span className="text-slate-300 dark:text-slate-700">|</span>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Forma de Pagamento</span>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    
                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${phoneWithCountryCode}?text=Olá%20${encodeURIComponent(order.customerName)},%20sou%20da%20equipe%20WD%20Coins!%20Referente%20ao%20seu%20pedido%20(#${order.id})%20de%20${encodeURIComponent(order.title)}%20no%20jogo%20${encodeURIComponent(order.gameName)}:`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      title="Abrir WhatsApp para conversar com o cliente"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Falar no WhatsApp ({order.customerWhatsApp})</span>
                    </a>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        if (confirm(`Deseja realmente remover o registro do pedido #${order.id}?`)) {
                          if (order.kind === 'purchase' && deletePurchase) {
                            deletePurchase(order.rawId);
                          } else {
                            deleteCustomOrder(order.rawId);
                          }
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
                      title="Excluir pedido permanentemente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
