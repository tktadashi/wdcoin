import React, { useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Shield, 
  Wrench, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Gamepad2, 
  User, 
  Phone, 
  ArrowRight, 
  Clock, 
  RotateCcw,
  Wallet,
  Check,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { GAMES } from '../data/storeData';
import { CustomOrder, GameId, EncomendaOption } from '../types';

export const CustomOrdersSection: React.FC = () => {
  const { isDark } = useTheme();
  const { addCustomOrder, userProfile, storeConfig, customOrders } = useStore();

  // Step 1: Game Selection
  const [selectedGame, setSelectedGame] = useState<GameId | 'outro'>('aion-2');
  const [customGameName, setCustomGameName] = useState('');
  const [server, setServer] = useState('');

  // Step 2: Encomenda Option ('moeda' | 'item' | 'servico')
  const [encomendaType, setEncomendaType] = useState<EncomendaOption>('moeda');

  // Fields for Moeda
  const [coinName, setCoinName] = useState('Kinah');
  const [coinQuantity, setCoinQuantity] = useState('');

  // Fields for Item
  const [itemName, setItemName] = useState('');
  const [itemAttributes, setItemAttributes] = useState('');

  // Fields for Serviço
  const [serviceName, setServiceName] = useState('');
  const [serviceGoal, setServiceGoal] = useState('');
  const [serviceDeadline, setServiceDeadline] = useState('');

  // Common Fields
  const [characterName, setCharacterName] = useState(userProfile?.characterName || '');
  const [customerWhatsApp, setCustomerWhatsApp] = useState(userProfile?.whatsapp || '');
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [budget, setBudget] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'crypto'>('pix');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Submitted order feedback
  const [submittedOrder, setSubmittedOrder] = useState<CustomOrder | null>(null);

  // Sync default coin names when game changes
  const handleGameChange = (gameId: GameId | 'outro') => {
    setSelectedGame(gameId);
    if (gameId === 'aion-2') {
      setCoinName('Kinah');
      setServer('Servidor Global');
    } else if (gameId === 'poke-idle') {
      setCoinName('Diamantes / KKs');
      setServer('Servidor Oficial');
    } else if (gameId === 'mu-idle') {
      setCoinName('KKs de Zen / Joias');
      setServer('Servidor Principal');
    } else if (gameId === 'priston-tale') {
      setCoinName('Gold / KKs (Idhas)');
      setServer('Servidor Idhas');
    } else {
      setCoinName('');
      setServer('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerWhatsApp.trim()) return;

    let detailsString = '';
    const gameLabel = selectedGame === 'outro' ? customGameName.trim() : GAMES.find(g => g.id === selectedGame)?.name || selectedGame;

    if (encomendaType === 'moeda') {
      if (!coinQuantity.trim()) return;
      detailsString = `[Moeda] ${coinName.trim() || 'Coins'}: ${coinQuantity.trim()}`;
    } else if (encomendaType === 'item') {
      if (!itemName.trim()) return;
      detailsString = `[Item] ${itemName.trim()} | Requisitos: ${itemAttributes.trim() || 'N/A'}`;
    } else if (encomendaType === 'servico') {
      if (!serviceName.trim()) return;
      detailsString = `[Serviço] ${serviceName.trim()} | Meta: ${serviceGoal.trim() || 'N/A'} | Prazo: ${serviceDeadline.trim() || 'A combinar'}`;
    }

    if (additionalNotes.trim()) {
      detailsString += ` | Obs: ${additionalNotes.trim()}`;
    }

    const orderTypeMap: Record<EncomendaOption, CustomOrder['orderType']> = {
      moeda: 'coins',
      item: 'item',
      servico: 'servico',
    };

    const newOrder = addCustomOrder({
      customerName: customerName.trim() || 'Cliente',
      customerWhatsApp: customerWhatsApp.trim(),
      gameId: selectedGame,
      customGameName: selectedGame === 'outro' ? customGameName.trim() : gameLabel,
      server: 'Padrão',
      characterName: characterName.trim() || 'Cliente',
      orderType: orderTypeMap[encomendaType],
      encomendaType,
      targetQuantity: encomendaType === 'moeda' ? coinQuantity.trim() : undefined,
      targetItem: encomendaType === 'item' ? itemName.trim() : undefined,
      targetService: encomendaType === 'servico' ? serviceName.trim() : undefined,
      paymentMethod,
      details: detailsString,
      budget: budget.trim() ? `R$ ${budget.trim()}` : 'Sob Cotação',
    });

    setSubmittedOrder(newOrder);

    // Prepare WhatsApp text
    const waText = 
`*NOVA ENCOMENDA - WD COINS* 🎮
-----------------------------------------
*Código do Pedido:* #${newOrder.id}
*Tipo:* ${encomendaType === 'moeda' ? '🪙 Moeda' : encomendaType === 'item' ? '⚔️ Item' : '🛡️ Serviço'}
*Jogo:* ${gameLabel}
*Detalhes:* ${detailsString}
*Orçamento Pretendido:* ${budget.trim() ? `R$ ${budget.trim()}` : 'Sob Cotação'}
*Forma de Pagamento:* ${paymentMethod.toUpperCase()}
*WhatsApp do Cliente:* ${customerWhatsApp.trim()}
-----------------------------------------
Olá! Acabei de registrar essa encomenda no site da WD Coins e gostaria de dar andamento!`;

    const waUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleReset = () => {
    setSubmittedOrder(null);
    setCoinQuantity('');
    setItemName('');
    setItemAttributes('');
    setServiceName('');
    setServiceGoal('');
    setBudget('');
    setAdditionalNotes('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors mb-8 ${
        isDark ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-xs'
      }`}>
        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
            isDark ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
          }`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display">
                Central de Encomendas Gamer
              </h1>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                isDark ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
              }`}>
                Sob Medida
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl font-normal font-sans ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}>
              Precisa de um lote grande de moedas, um item raro refinado ou um serviço de leveling/quest? Escolha o jogo, o tipo de encomenda e nós cotamos e entregamos diretamente no seu personagem.
            </p>
          </div>
        </div>
      </div>

      {/* Main Order Form / Success State */}
      {submittedOrder ? (
        <div className={`p-8 rounded-2xl border text-center transition-colors max-w-xl mx-auto ${
          isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
        }`}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-bold font-display mb-1">
            Encomenda Registrada com Sucesso!
          </h2>
          <p className="text-xs font-mono font-bold text-amber-500 mb-4">
            Código do Pedido: #{submittedOrder.id}
          </p>

          <div className={`p-4 rounded-xl border text-left text-xs mb-6 space-y-2 ${
            isDark ? 'bg-[#111214] border-[#303036] text-[#AAA9B0]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D]'
          }`}>
            <div className="flex justify-between">
              <span className="font-semibold text-inherit">Jogo:</span>
              <span className="font-bold text-white dark:text-white">{submittedOrder.customGameName || submittedOrder.gameId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-inherit">Tipo:</span>
              <span className="font-bold capitalize text-white dark:text-white">{submittedOrder.encomendaType || submittedOrder.orderType}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-inherit">WhatsApp de Contato:</span>
              <span className="font-bold text-white dark:text-white">{submittedOrder.customerWhatsApp}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-inherit">Orçamento:</span>
              <span className="font-bold text-emerald-400">{submittedOrder.budget}</span>
            </div>
            <div className="pt-2 border-t border-inherit/40 text-[11px] leading-relaxed">
              <strong>Detalhes:</strong> {submittedOrder.details}
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(`Olá! Acabei de registrar a encomenda #${submittedOrder.id} no site.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 text-white ${
                isDark ? 'bg-[#25D366] hover:bg-[#20ba59]' : 'bg-[#168B4B] hover:bg-[#12723d]'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirmar no WhatsApp da Loja</span>
            </a>

            <button
              onClick={handleReset}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC] hover:bg-[#25272e]'
                  : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#202124] hover:bg-[#dfdbd3]'
              }`}
            >
              Fazer Outra Encomenda
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Escolha do Jogo */}
          <div className={`p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-[#1D1E23] text-[#C7B0D4]' : 'bg-[#ECE9E3] text-[#80658F]'
              }`}>
                1
              </span>
              <h3 className="text-sm sm:text-base font-bold font-display">
                Para qual jogo você deseja a encomenda?
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
              {GAMES.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleGameChange(game.id)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedGame === game.id
                      ? isDark
                        ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC] ring-1 ring-[#A78AB8]'
                        : 'bg-[#ECE9E3] border-[#80658F] text-[#202124] ring-1 ring-[#80658F]'
                      : isDark
                      ? 'bg-[#111214]/60 border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                  }`}
                >
                  <Gamepad2 className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
                  <span className="text-xs font-bold block truncate">{game.shortName}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleGameChange('outro')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedGame === 'outro'
                    ? isDark
                      ? 'bg-[#1D1E23] border-[#A78AB8] text-[#F4F1EC] ring-1 ring-[#A78AB8]'
                      : 'bg-[#ECE9E3] border-[#80658F] text-[#202124] ring-1 ring-[#80658F]'
                    : isDark
                    ? 'bg-[#111214]/60 border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                }`}
              >
                <Sparkles className="w-5 h-5 mx-auto mb-1.5 opacity-80 text-amber-500" />
                <span className="text-xs font-bold block truncate">Outro Jogo</span>
              </button>
            </div>

            {selectedGame === 'outro' && (
              <div className="mb-3">
                <label className="block text-xs font-semibold mb-1 opacity-80">Digite o Nome do Jogo *</label>
                <input
                  type="text"
                  required
                  value={customGameName}
                  onChange={(e) => setCustomGameName(e.target.value)}
                  placeholder="Ex: Ragnarok Online, Tibia, Albion Online, WoW..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                    isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                />
              </div>
            )}

          </div>

          {/* STEP 2: Seleção do Tipo: Moeda, Item, Serviço */}
          <div className={`p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-[#1D1E23] text-[#C7B0D4]' : 'bg-[#ECE9E3] text-[#80658F]'
              }`}>
                2
              </span>
              <h3 className="text-sm sm:text-base font-bold font-display">
                O que você deseja encomendar? Selecione uma opção:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Opção 1: Moeda */}
              <button
                type="button"
                onClick={() => setEncomendaType('moeda')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  encomendaType === 'moeda'
                    ? isDark
                      ? 'bg-[#1D1E23] border-[#A78AB8] ring-1 ring-[#A78AB8] text-[#F4F1EC]'
                      : 'bg-[#ECE9E3] border-[#80658F] ring-1 ring-[#80658F] text-[#202124]'
                    : isDark
                    ? 'bg-[#111214]/60 border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Coins className="w-5 h-5" />
                  </div>
                  {encomendaType === 'moeda' && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="text-sm font-bold font-display">🪙 Moeda</h4>
                <p className="text-[11px] mt-1 opacity-75">
                  Coins, Kinah, KKs de Gold, Diamantes ou Zen em grande quantidade.
                </p>
              </button>

              {/* Opção 2: Item */}
              <button
                type="button"
                onClick={() => setEncomendaType('item')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  encomendaType === 'item'
                    ? isDark
                      ? 'bg-[#1D1E23] border-[#A78AB8] ring-1 ring-[#A78AB8] text-[#F4F1EC]'
                      : 'bg-[#ECE9E3] border-[#80658F] ring-1 ring-[#80658F] text-[#202124]'
                    : isDark
                    ? 'bg-[#111214]/60 border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <Shield className="w-5 h-5" />
                  </div>
                  {encomendaType === 'item' && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="text-sm font-bold font-display">⚔️ Item</h4>
                <p className="text-[11px] mt-1 opacity-75">
                  Armas, Armaduras, Sets refinados (+9/+15), Pokémons ou itens raros.
                </p>
              </button>

              {/* Opção 3: Serviço */}
              <button
                type="button"
                onClick={() => setEncomendaType('servico')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  encomendaType === 'servico'
                    ? isDark
                      ? 'bg-[#1D1E23] border-[#A78AB8] ring-1 ring-[#A78AB8] text-[#F4F1EC]'
                      : 'bg-[#ECE9E3] border-[#80658F] ring-1 ring-[#80658F] text-[#202124]'
                    : isDark
                    ? 'bg-[#111214]/60 border-[#303036] text-[#AAA9B0] hover:text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Wrench className="w-5 h-5" />
                  </div>
                  {encomendaType === 'servico' && <Check className="w-4 h-4 text-emerald-500" />}
                </div>
                <h4 className="text-sm font-bold font-display">🛡️ Serviço</h4>
                <p className="text-[11px] mt-1 opacity-75">
                  Powerleveling, Upar do lv X ao Y, Dungeons diárias, Quests de acesso ou Bosses.
                </p>
              </button>
            </div>
          </div>

          {/* STEP 3: Detalhes Específicos da Opção Escolhida */}
          <div className={`p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-[#1D1E23] text-[#C7B0D4]' : 'bg-[#ECE9E3] text-[#80658F]'
              }`}>
                3
              </span>
              <h3 className="text-sm sm:text-base font-bold font-display">
                {encomendaType === 'moeda' && 'Detalhes da Moeda Desejada'}
                {encomendaType === 'item' && 'Detalhes do Item Desejado'}
                {encomendaType === 'servico' && 'Detalhes do Serviço Gamer'}
              </h3>
            </div>

            {/* SE MOEDA */}
            {encomendaType === 'moeda' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Qual moeda deseja?</label>
                  <input
                    type="text"
                    value={coinName}
                    onChange={(e) => setCoinName(e.target.value)}
                    placeholder="Ex: Kinah, KKs, Diamantes, Zen..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Quantidade pretendida *</label>
                  <input
                    type="text"
                    required
                    value={coinQuantity}
                    onChange={(e) => setCoinQuantity(e.target.value)}
                    placeholder="Ex: 500 Milhões (500KK), 1 Bilhão, 50.000..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* SE ITEM */}
            {encomendaType === 'item' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Nome do Item Desejado *</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Ex: Espada Dracônica +15, Set Dragon +9, Mewtwo 150 IV..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Requisitos / Atributos / Refinamento</label>
                  <textarea
                    rows={2}
                    value={itemAttributes}
                    onChange={(e) => setItemAttributes(e.target.value)}
                    placeholder="Ex: Refino mínimo +11, IV 140+, opcional Excellent Damage, socket limpo..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* SE SERVIÇO */}
            {encomendaType === 'servico' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">Tipo de Serviço *</label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="Ex: Leveling / Upar Personagem, Quest de Acesso, Rota Diária..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                      isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Nível / Estado Atual e Meta Desejada</label>
                    <input
                      type="text"
                      value={serviceGoal}
                      onChange={(e) => setServiceGoal(e.target.value)}
                      placeholder="Ex: Estou no lv 45 e quero chegar ao lv 70"
                      className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                        isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 opacity-80">Prazo Desejado / Restrições de Horário</label>
                    <input
                      type="text"
                      value={serviceDeadline}
                      onChange={(e) => setServiceDeadline(e.target.value)}
                      placeholder="Ex: Em até 3 dias, só logar de madrugada..."
                      className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                        isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: Dados de Entrega e Contato */}
          <div className={`p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                isDark ? 'bg-[#1D1E23] text-[#C7B0D4]' : 'bg-[#ECE9E3] text-[#80658F]'
              }`}>
                4
              </span>
              <h3 className="text-sm sm:text-base font-bold font-display">
                Contato via WhatsApp
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">Seu WhatsApp (com DDD) *</label>
                <input
                  type="text"
                  required
                  value={customerWhatsApp}
                  onChange={(e) => setCustomerWhatsApp(e.target.value)}
                  placeholder="(DDD) 99999-9999"
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                    isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">Seu Nome (Opcional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Como prefere ser chamado"
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                    isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">Orçamento Pretendido (R$)</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex: 150,00 ou deixe em branco para cotação"
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                    isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 opacity-80">Forma de Pagamento Preferida</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors cursor-pointer ${
                    isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                >
                  <option value="pix">PIX (Entrega rápida imediata)</option>
                  <option value="crypto">USDT Crypto (Rede BEP-20)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 opacity-80">Observações Adicionais</label>
              <textarea
                rows={2}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Horários que você fica online, detalhes adicionais ou preferências..."
                className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none transition-colors ${
                  isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              data-typography="button"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-sm ${
                isDark
                  ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                  : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Enviar Solicitação de Encomenda</span>
            </button>
          </div>

        </form>
      )}

      {/* Histórico recente de encomendas do usuário */}
      {customOrders.length > 0 && (
        <div className="mt-12 pt-8 border-t border-inherit/40">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider opacity-80">
              Suas Encomendas em Andamento ({customOrders.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className={`p-4 rounded-xl border text-xs transition-colors ${
                  isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-amber-500">#{order.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                    order.status === 'concluido' || order.status === 'entregue'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : order.status === 'aceito'
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="font-semibold text-white dark:text-white mb-1">
                  {order.customGameName || order.gameId} • Nick: {order.characterName}
                </p>
                <p className={`line-clamp-2 text-[11px] ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                  {order.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
