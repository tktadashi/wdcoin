import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Gamepad2, 
  Coins, 
  ArrowRight, 
  DollarSign,
  Share2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { GAMES } from '../data/storeData';
import { GameId, IntermediationRoom, IntermediationStatus } from '../types';

export const IntermediationSection: React.FC = () => {
  const { isDark } = useTheme();
  const { 
    intermediations, 
    createIntermediation, 
    joinIntermediation, 
    sendIntermediationMessage, 
    updateIntermediationStatus, 
    getIntermediationByCode,
    storeConfig,
    userProfile,
    isAdminLoggedIn
  } = useStore();

  // Active view: 'list_or_create' or 'active_room'
  const [activeRoomId, setActiveRoomId] = useState<string | null>(() => {
    return intermediations.length > 0 ? intermediations[0].id : null;
  });

  // Mode tab in creation/join: 'create' | 'join' | 'how_it_works'
  const [entryMode, setEntryMode] = useState<'create' | 'join' | 'how_it_works'>('create');

  // Create form state
  const [selectedGame, setSelectedGame] = useState<GameId | 'outro'>('aion-2');
  const [customGameName, setCustomGameName] = useState('');
  const [serverName, setServerName] = useState('');
  const [myRole, setMyRole] = useState<'vendedor' | 'comprador'>('vendedor');
  const [characterName, setCharacterName] = useState(userProfile?.characterName || '');
  const [userName, setUserName] = useState(userProfile?.name || '');
  const [userWhatsApp, setUserWhatsApp] = useState(userProfile?.whatsapp || '');
  const [negotiatedItem, setNegotiatedItem] = useState('');
  const [agreedValue, setAgreedValue] = useState('');

  // Join form state
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinCharacterName, setJoinCharacterName] = useState(userProfile?.characterName || '');
  const [joinUserName, setJoinUserName] = useState(userProfile?.name || '');
  const [joinWhatsApp, setJoinWhatsApp] = useState(userProfile?.whatsapp || '');
  const [joinError, setJoinError] = useState<string | null>(null);

  // Chat message input
  const [chatInput, setChatInput] = useState('');
  const [chatSenderRole, setChatSenderRole] = useState<'vendedor' | 'comprador' | 'intermediador'>('vendedor');

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState(false);

  // Active room data
  const activeRoom = intermediations.find(r => r.id === activeRoomId || r.code === activeRoomId);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userWhatsApp.trim() || !negotiatedItem.trim() || !agreedValue.trim()) {
      return;
    }

    const room = createIntermediation({
      gameId: selectedGame,
      customGameName: selectedGame === 'outro' ? customGameName.trim() : undefined,
      server: 'Padrão',
      itemOrCoinsDescription: negotiatedItem.trim(),
      agreedValue: agreedValue.trim(),
      creatorRole: myRole,
      participantData: {
        name: myRole === 'vendedor' ? 'Vendedor' : 'Comprador',
        whatsapp: userWhatsApp.trim(),
      },
    });

    setActiveRoomId(room.id);
    setChatSenderRole(myRole);

    // Send WhatsApp notification with clean format
    const gameLabel = selectedGame === 'outro' ? customGameName.trim() : GAMES.find(g => g.id === selectedGame)?.name || selectedGame;
    const waText = `*NOVA INTERMEDIAÇÃO SOLICITADA - WD COINS* 🛡️\n\nCódigo da Sala: *${room.code}*\nPapel: *${myRole === 'vendedor' ? 'Vendedor' : 'Comprador'}*\nJogo: *${gameLabel}*\nO que está sendo negociado: *${negotiatedItem.trim()}*\nValor Combinado: *R$ ${agreedValue.trim()}*\nWhatsApp: *${userWhatsApp.trim()}*\n\nOlá, gostaria de confirmar o atendimento para essa intermediação!`;
    const waUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    if (!joinCodeInput.trim() || !joinWhatsApp.trim()) {
      setJoinError('Por favor informe o código da intermediação e seu WhatsApp.');
      return;
    }

    const res = joinIntermediation(joinCodeInput.trim(), {
      name: 'Participante',
      whatsapp: joinWhatsApp.trim(),
    });

    if (res.success && res.room) {
      setActiveRoomId(res.room.id);
      const otherRole = res.room.creatorRole === 'vendedor' ? 'comprador' : 'vendedor';
      setChatSenderRole(otherRole);
      setJoinCodeInput('');
    } else {
      setJoinError(res.error || 'Código de negociação não encontrado.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeRoom) return;

    let senderDisplayName = '';
    if (chatSenderRole === 'vendedor') {
      senderDisplayName = activeRoom.seller ? `${activeRoom.seller.name} (Vendedor)` : 'Vendedor';
    } else if (chatSenderRole === 'comprador') {
      senderDisplayName = activeRoom.buyer ? `${activeRoom.buyer.name} (Comprador)` : 'Comprador';
    } else {
      senderDisplayName = 'Intermediador Oficial WD Coins';
    }

    sendIntermediationMessage(activeRoom.id, {
      senderRole: chatSenderRole,
      senderName: senderDisplayName,
      text: chatInput.trim(),
      isOfficial: chatSenderRole === 'intermediador',
    });

    setChatInput('');
  };

  const getStatusBadge = (status: IntermediationStatus) => {
    switch (status) {
      case 'aguardando_participante':
        return {
          label: 'Aguardando 2º Jogador entrar',
          color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'em_negociacao':
        return {
          label: 'Em Negociação Ativa',
          color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        };
      case 'pagamento_retido':
        return {
          label: '💰 Pagamento Retido em Segurança',
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        };
      case 'entrega_andamento':
        return {
          label: '📦 Entrega in-game em andamento',
          color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
        };
      case 'concluido':
        return {
          label: '✅ Negociação Concluída',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      case 'cancelado':
        return {
          label: '❌ Cancelada',
          color: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        };
      default:
        return { label: status, color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors mb-8 ${
        isDark ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
              isDark ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display">
                  Intermediação Segura WD Coins
                </h1>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                  isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  Anti-Golpe
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl font-normal font-sans ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}>
                Compre e venda coins, itens ou contas com total segurança entre jogadores. Nós retemos o pagamento em escrow, você entrega o item no jogo e o valor é liberado na hora.
              </p>
            </div>
          </div>

          {/* Quick Stats or WhatsApp CTA */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre a Intermediação Segura da WD Coins.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                isDark ? 'bg-[#1D1E23] border-[#303036] text-[#25D366] hover:border-[#25D366]/40' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#168B4B] hover:border-[#168B4B]/40'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Suporte Oficial no WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-inherit/40 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold">Pagamento Protegido:</span>
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>Dinheiro retido até a entrega</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="font-semibold">Código Exclusivo:</span>
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>Chat tripartite privado</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-semibold">Liberação via PIX:</span>
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>Transferência imediata ao vendedor</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Room Selector / Creator on Left + Chat on Right (or full view) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Management, Creation & Code Input (4 or 5 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Navigation Rooms Switcher */}
          {intermediations.length > 0 && (
            <div className={`p-4 rounded-xl border transition-colors ${
              isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Suas Salas de Negociação ({intermediations.length})</span>
                </span>
                <button
                  onClick={() => {
                    setEntryMode('create');
                    setActiveRoomId(null);
                  }}
                  className={`text-[11px] font-semibold underline ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`}
                >
                  + Nova Sala
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {intermediations.map((room) => {
                  const isActive = room.id === activeRoomId;
                  const statusInfo = getStatusBadge(room.status);
                  return (
                    <div
                      key={room.id}
                      onClick={() => setActiveRoomId(room.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isActive
                          ? isDark
                            ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC]'
                            : 'bg-[#ECE9E3] border-[#80658F] text-[#202124]'
                          : isDark
                          ? 'bg-[#111214]/60 border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                          : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold font-mono">{room.code}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="font-semibold truncate">{room.itemOrCoinsDescription}</p>
                      <div className="flex items-center justify-between mt-1 text-[11px] opacity-75">
                        <span>{room.customGameName || room.gameId}</span>
                        <span className="font-semibold">R$ {room.agreedValue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Creation / Join Tabs */}
          <div className={`p-5 rounded-xl border transition-colors ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center gap-1.5 p-1 rounded-lg border mb-5 bg-inherit border-inherit">
              <button
                type="button"
                onClick={() => setEntryMode('create')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  entryMode === 'create'
                    ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Criar Nova
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('join')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  entryMode === 'join'
                    ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Entrar com Código
              </button>
              <button
                type="button"
                onClick={() => setEntryMode('how_it_works')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  entryMode === 'how_it_works'
                    ? isDark ? 'bg-[#1D1E23] text-[#F4F1EC]' : 'bg-[#ECE9E3] text-[#202124]'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Regras
              </button>
            </div>

            {/* CREATE FORM */}
            {entryMode === 'create' && (
              <form onSubmit={handleCreateRoom} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">1. Selecione o Jogo *</label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  >
                    {GAMES.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                    <option value="outro">Outro Jogo (Digitar nome)</option>
                  </select>
                </div>

                {selectedGame === 'outro' && (
                  <div>
                    <label className="block font-semibold mb-1 opacity-80">Nome do Jogo *</label>
                    <input
                      type="text"
                      required
                      value={customGameName}
                      onChange={(e) => setCustomGameName(e.target.value)}
                      placeholder="Ex: Ragnarok, Tibia, Albion..."
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none transition-colors ${
                        isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                      }`}
                    />
                  </div>
                )}

                {/* Role Switcher */}
                <div>
                  <label className="block font-semibold mb-1 opacity-80">2. O que você é nessa negociação? *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMyRole('vendedor')}
                      className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        myRole === 'vendedor'
                          ? isDark
                            ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC]'
                            : 'bg-[#ECE9E3] border-[#80658F] text-[#202124]'
                          : isDark
                          ? 'border-[#303036] text-[#AAA9B0]'
                          : 'border-[#DDD8D1] text-[#68676D]'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Sou o Vendedor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMyRole('comprador')}
                      className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        myRole === 'comprador'
                          ? isDark
                            ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC]'
                            : 'bg-[#ECE9E3] border-[#80658F] text-[#202124]'
                          : isDark
                          ? 'border-[#303036] text-[#AAA9B0]'
                          : 'border-[#DDD8D1] text-[#68676D]'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Sou o Comprador</span>
                    </button>
                  </div>
                </div>

                {/* Item description & Agreed Value */}
                <div>
                  <label className="block font-semibold mb-1 opacity-80">3. O que está sendo negociado? *</label>
                  <textarea
                    required
                    rows={2}
                    value={negotiatedItem}
                    onChange={(e) => setNegotiatedItem(e.target.value)}
                    placeholder="Ex: 500 Milhões Kinah, Set +15 Dragon, Conta Lv 90..."
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">4. Valor Combinado (R$) *</label>
                  <input
                    type="text"
                    required
                    value={agreedValue}
                    onChange={(e) => setAgreedValue(e.target.value)}
                    placeholder="Ex: 250,00"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Seu WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={userWhatsApp}
                    onChange={(e) => setUserWhatsApp(e.target.value)}
                    placeholder="(DDD) 99999-9999"
                    className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  data-typography="button"
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm mt-3 ${
                    isDark
                      ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                      : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Criar Sala e Gerar Código</span>
                </button>
              </form>
            )}

            {/* JOIN FORM */}
            {entryMode === 'join' && (
              <form onSubmit={handleJoinRoom} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold mb-1 opacity-80">Código da Intermediação *</label>
                  <input
                    type="text"
                    required
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder="Ex: WD-7842"
                    className={`w-full px-3 py-2.5 rounded-lg border font-mono font-bold text-center tracking-wider text-sm focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                  <p className="text-[11px] mt-1 opacity-70">
                    O código foi gerado pela pessoa que iniciou a negociação com você.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-1 opacity-80">Seu WhatsApp (com DDD) *</label>
                  <input
                    type="text"
                    required
                    value={joinWhatsApp}
                    onChange={(e) => setJoinWhatsApp(e.target.value)}
                    placeholder="(DDD) 99999-9999"
                    className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                {joinError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{joinError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  data-typography="button"
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm mt-3 ${
                    isDark
                      ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                      : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Acessar Sala de Intermediação</span>
                </button>
              </form>
            )}

            {/* RULES GUIDE */}
            {entryMode === 'how_it_works' && (
              <div className="space-y-3 text-xs leading-relaxed opacity-90">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-500">1.</span>
                  <div>
                    <strong>Criação e Código:</strong> Uma das partes cria a sala e envia o código para a outra.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-500">2.</span>
                  <div>
                    <strong>Pagamento Seguro (Escrow):</strong> O Comprador paga via PIX ou USDT diretamente ao intermediador oficial WD Coins.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-500">3.</span>
                  <div>
                    <strong>Entrega no Jogo:</strong> Com o dinheiro 100% garantido, o Vendedor realiza a entrega do item/moedas in-game com print/gravação.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-500">4.</span>
                  <div>
                    <strong>Liberação:</strong> O Comprador confirma o recebimento e o intermediador transfere o pagamento ao Vendedor imediatamente.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Negotiation Room & Chat (8 cols) */}
        <div className="lg:col-span-8">
          {activeRoom ? (
            <div className={`rounded-2xl border transition-colors flex flex-col h-[680px] overflow-hidden ${
              isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}>
              
              {/* Room Top Bar */}
              <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-[#15161A] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold opacity-70">Código da Sala:</span>
                    <span className="font-mono font-bold text-sm tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      {activeRoom.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(activeRoom.code)}
                      className="p-1 rounded hover:opacity-80 text-xs flex items-center gap-1 cursor-pointer"
                      title="Copiar código"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`Acesse a nossa sala de intermediação segura na WD Coins pelo código: ${activeRoom.code}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded hover:opacity-80 text-xs flex items-center gap-1 cursor-pointer text-[#25D366]"
                      title="Compartilhar no WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs font-semibold mt-1 flex items-center gap-2 flex-wrap">
                    <span>{activeRoom.customGameName || activeRoom.gameId}</span>
                    <span className="opacity-40">•</span>
                    <span className="font-bold">{activeRoom.itemOrCoinsDescription}</span>
                    <span className="opacity-40">•</span>
                    <span className="text-emerald-500 font-bold">R$ {activeRoom.agreedValue}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${getStatusBadge(activeRoom.status).color}`}>
                    {getStatusBadge(activeRoom.status).label}
                  </span>
                </div>
              </div>

              {/* Participants Bar */}
              <div className={`px-4 py-2.5 border-b text-xs flex items-center justify-between gap-3 flex-wrap ${
                isDark ? 'bg-[#191A1E] border-[#303036] text-[#AAA9B0]' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#68676D]'
              }`}>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-semibold text-inherit">Vendedor:</span>
                    <span>{activeRoom.seller ? (activeRoom.seller.whatsapp ? `WhatsApp ${activeRoom.seller.whatsapp}` : 'Online') : 'Aguardando entrar'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-semibold text-inherit">Comprador:</span>
                    <span>{activeRoom.buyer ? (activeRoom.buyer.whatsapp ? `WhatsApp ${activeRoom.buyer.whatsapp}` : 'Online') : 'Aguardando código'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-inherit">Intermediador:</span>
                    <span className="text-emerald-400 font-semibold">WD Coins Staff</span>
                  </div>
                </div>

                {/* WhatsApp Help CTA for room */}
                <a
                  href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(`Olá! Estou na sala de intermediação *${activeRoom.code}* e preciso do suporte do intermediador.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Chamar Staff no WhatsApp</span>
                </a>
              </div>

              {/* Chat Message Stream */}
              <div className={`flex-1 p-4 overflow-y-auto space-y-3 ${
                isDark ? 'bg-[#111214]' : 'bg-[#F9F8F6]'
              }`}>
                {activeRoom.messages.map((msg) => {
                  const isOfficial = msg.isOfficial || msg.senderRole === 'intermediador';
                  const isSystem = msg.senderRole === 'sistema';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <div className={`inline-block px-3 py-1.5 rounded-lg border text-[11px] font-sans ${
                          isDark ? 'bg-[#1D1E23] border-[#303036] text-[#AAA9B0]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#68676D]'
                        }`}>
                          <span className="font-semibold text-inherit">{msg.text}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isOfficial
                          ? 'items-center my-2'
                          : msg.senderRole === 'vendedor'
                          ? 'items-start'
                          : 'items-end'
                      }`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs border ${
                        isOfficial
                          ? isDark
                            ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC]'
                            : 'bg-[#ECE9E3] border-[#80658F] text-[#202124]'
                          : msg.senderRole === 'vendedor'
                          ? isDark
                            ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]'
                            : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124]'
                          : isDark
                          ? 'bg-[#25242A] border-[#45454d] text-[#F4F1EC]'
                          : 'bg-[#202124] text-white border-transparent'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-1 text-[10px]">
                          <span className={`font-bold uppercase tracking-wider ${
                            isOfficial 
                              ? isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                              : msg.senderRole === 'vendedor' ? 'text-blue-400' : 'text-amber-400'
                          }`}>
                            {isOfficial ? '🛡️ Intermediador Oficial WD Coins' : msg.senderName}
                          </span>
                          <span className="opacity-60 text-[9px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Flow Control Quick Buttons (for demo, staff or test) */}
              <div className={`p-2.5 border-t flex items-center justify-between gap-2 flex-wrap text-xs ${
                isDark ? 'bg-[#15161A] border-[#303036]' : 'bg-[#ECE9E3] border-[#DDD8D1]'
              }`}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold opacity-70">Ações de Intermediação:</span>
                  <button
                    type="button"
                    onClick={() => updateIntermediationStatus(activeRoom.id, 'pagamento_retido')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer"
                  >
                    💰 Confirmar Pagamento Retido
                  </button>
                  <button
                    type="button"
                    onClick={() => updateIntermediationStatus(activeRoom.id, 'entrega_andamento')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 cursor-pointer"
                  >
                    📦 Confirmar Entrega in-Game
                  </button>
                  <button
                    type="button"
                    onClick={() => updateIntermediationStatus(activeRoom.id, 'concluido')}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                  >
                    🎉 Finalizar & Liberar
                  </button>
                </div>

                {/* Role Switcher in Chat */}
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="opacity-70">Falar como:</span>
                  <select
                    value={chatSenderRole}
                    onChange={(e) => setChatSenderRole(e.target.value as any)}
                    className={`px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${
                      isDark ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC]' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  >
                    <option value="vendedor">Vendedor</option>
                    <option value="comprador">Comprador</option>
                    <option value="intermediador">Intermediador (Staff)</option>
                  </select>
                </div>
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className={`p-3 border-t flex items-center gap-2 ${
                isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1]'
              }`}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Digite sua mensagem como ${chatSenderRole === 'vendedor' ? 'Vendedor' : chatSenderRole === 'comprador' ? 'Comprador' : 'Intermediador'}...`}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                  }`}
                />

                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer ${
                    isDark
                      ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                      : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>

            </div>
          ) : (
            <div className={`p-12 rounded-2xl border text-center ${
              isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1]'
            }`}>
              <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-3 opacity-80" />
              <h3 className="text-lg font-bold font-display mb-1">Nenhuma Sala Selecionada</h3>
              <p className={`text-xs max-w-md mx-auto mb-5 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                Crie uma nova sala para gerar um código ou insira o código fornecido pelo outro jogador para iniciar o chat tripartite de negociação segura.
              </p>
              <button
                onClick={() => setEntryMode('create')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  isDark ? 'bg-[#E7DED0] text-[#202124]' : 'bg-[#25242A] text-white'
                }`}
              >
                Criar Nova Intermediação
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
