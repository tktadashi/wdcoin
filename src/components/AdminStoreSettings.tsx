import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Coins,
  CheckCircle2,
  Save,
  RotateCcw,
  Copy,
  ExternalLink,
  Sparkles,
  QrCode,
  ShieldCheck,
  Smartphone,
  Building,
  Clock,
  UserCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { StoreConfig } from '../types';

export const AdminStoreSettings: React.FC = () => {
  const { storeConfig, updateStoreConfig, resetStoreConfigToDefault } = useStore();
  const { isDark, isRed } = useTheme();

  // Local state initialized with current storeConfig
  const [form, setForm] = useState<StoreConfig>({ ...storeConfig });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Sync if storeConfig updates from external source
  useEffect(() => {
    setForm({ ...storeConfig });
  }, [storeConfig]);

  // Clean WhatsApp number to digits only
  const cleanPhone = form.whatsappNumber.replace(/\D/g, '');

  // Formatter for visual preview
  const formatPhoneNumber = (num: string) => {
    const digits = num.replace(/\D/g, '');
    if (digits.length === 13) {
      // 55 11 99999-9999
      return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
    }
    if (digits.length === 11) {
      // 11 99999-9999
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return digits ? `+${digits}` : '(Nenhum número configurado)';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean whatsapp number ensuring digits
    const cleanedWhatsapp = form.whatsappNumber.replace(/\D/g, '');

    const updatedConfig: StoreConfig = {
      ...form,
      whatsappNumber: cleanedWhatsapp || form.whatsappNumber.trim(),
      storeName: form.storeName.trim() || 'WD Coins',
      ownerName: form.ownerName.trim() || 'WD Coins Atendimento',
      pixKey: form.pixKey.trim(),
      pixReceiverName: form.pixReceiverName.trim(),
      pixBank: form.pixBank?.trim() || 'Banco Inter',
      usdtAddress: form.usdtAddress.trim(),
      usdtNetwork: form.usdtNetwork.trim(),
      workingHours: form.workingHours.trim() || 'Todos os dias das 10:00 às 00:00',
      averageDelivery: form.averageDelivery.trim() || '5 a 15 minutos via in-game trade',
    };

    updateStoreConfig(updatedConfig);
    setSaveStatus('Configurações salvas com sucesso! O WhatsApp e a Chave PIX foram atualizados em todo o site.');

    setTimeout(() => {
      setSaveStatus(null);
    }, 4500);
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações padrão iniciais da loja?')) {
      resetStoreConfigToDefault();
      setSaveStatus('Configurações restauradas para os valores padrão de fábrica.');
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const handleCopyTestPix = () => {
    navigator.clipboard.writeText(form.pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-5 rounded-3xl border ${
        isDark
          ? 'bg-gradient-to-r from-purple-950/40 via-[#141926] to-slate-900 border-purple-500/20 text-white'
          : 'bg-gradient-to-r from-purple-50 via-white to-slate-50 border-purple-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-display">
                  Configurações de Contato & Pagamento
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Dinamismo em Tempo Real
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                Altere aqui o número do WhatsApp de suporte e os dados da Chave PIX. Todas as alterações refletem imediatamente no fluxo de checkout (PIX), botão flutuante e botões de atendimento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-800"
              title="Restaurar valores de demonstração/originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Feedback Alert */}
      {saveStatus && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CARD 1: WHATSAPP E ATENDIMENTO */}
          <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${
            isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2.5 mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display">WhatsApp da Loja</h3>
                  <p className="text-[11px] text-slate-500">Número de destino para envio de comprovantes e suporte.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs mt-4">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>Número do WhatsApp (com DDI e DDD) *</span>
                    <span className="text-[10px] text-slate-400 font-normal">Ex: 5511999999999</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.whatsappNumber}
                      onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                      placeholder="5511999999999"
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-emerald-500/40 text-white' : 'bg-slate-50 border-emerald-500/50 text-slate-900'
                      }`}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Visualização formatada: <strong className="text-emerald-500 font-mono">{formatPhoneNumber(form.whatsappNumber)}</strong>
                    </span>
                    <span className={`text-[10px] font-semibold ${cleanPhone.length >= 12 && cleanPhone.length <= 13 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {cleanPhone.length} dígitos
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Nome do Atendente / Loja</span>
                    </label>
                    <input
                      type="text"
                      value={form.ownerName}
                      onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                      placeholder="Ex: WD Coins Atendimento"
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Prazo Médio de Entrega</span>
                    </label>
                    <input
                      type="text"
                      value={form.averageDelivery}
                      onChange={(e) => setForm({ ...form, averageDelivery: e.target.value })}
                      placeholder="Ex: 5 a 15 minutos via in-game"
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    Horário de Atendimento
                  </label>
                  <input
                    type="text"
                    value={form.workingHours}
                    onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                    placeholder="Ex: Todos os dias das 10:00 às 00:00"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Test WhatsApp Action */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <a
                href={`https://wa.me/${cleanPhone}?text=Ol%C3%A1%20WD%20Coins,%20teste%20de%20conex%C3%A3o%20do%20WhatsApp!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Testar Link do WhatsApp no Navegador</span>
              </a>
              <span className="text-[10px] text-slate-400">Status: Conectado</span>
            </div>
          </div>

          {/* CARD 2: CHAVE PIX & RECEBIMENTO */}
          <div className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between ${
            isDark ? 'bg-[#121622] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <div className="flex items-center gap-2.5 mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display">Dados de Pagamento (PIX & Crypto)</h3>
                  <p className="text-[11px] text-slate-500">Exibidos instantaneamente na tela de pagamento para o cliente.</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs mt-4">
                <div>
                  <label className="block font-bold mb-1 flex items-center justify-between text-slate-700 dark:text-slate-200">
                    <span>Chave PIX Oficial *</span>
                    {copiedKey && (
                      <span className="text-emerald-500 text-[10px] font-bold">Copiado para teste!</span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={form.pixKey}
                      onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
                      placeholder="Informe sua chave (E-mail, CPF, Celular, CNPJ ou Aleatória)..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none font-mono text-xs ${
                        isDark ? 'bg-slate-900 border-purple-500/40 text-white' : 'bg-slate-50 border-purple-500/40 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleCopyTestPix}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition-colors"
                      title="Copiar chave para testar"
                    >
                      <Copy className="w-4 h-4 text-purple-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                      Tipo da Chave PIX
                    </label>
                    <select
                      value={form.pixKeyType}
                      onChange={(e) => setForm({ ...form, pixKeyType: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Aleatória">Chave Aleatória (EVP)</option>
                      <option value="Celular">Celular</option>
                      <option value="CPF">CPF</option>
                      <option value="E-mail">E-mail</option>
                      <option value="CNPJ">CNPJ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>Banco / Instituição</span>
                    </label>
                    <input
                      type="text"
                      value={form.pixBank || ''}
                      onChange={(e) => setForm({ ...form, pixBank: e.target.value })}
                      placeholder="Ex: Banco Inter / Nubank"
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    Nome do Titular / Favorecido
                  </label>
                  <input
                    type="text"
                    value={form.pixReceiverName}
                    onChange={(e) => setForm({ ...form, pixReceiverName: e.target.value })}
                    placeholder="Ex: WD Coins Vendas Digitais"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-200">
                    Carteira USDT (Crypto) - Opcional
                  </label>
                  <input
                    type="text"
                    value={form.usdtAddress}
                    onChange={(e) => setForm({ ...form, usdtAddress: e.target.value })}
                    placeholder="Ex: 0x71C8F79B25e5b3260c6d59C1B2677C064e4b52Ef"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none font-mono text-[11px] ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Rede USDT: {form.usdtNetwork}</span>
              <span className="text-emerald-500 font-bold">PIX Banco Central Ativo</span>
            </div>
          </div>

        </div>

        {/* -------------------------------------------------------- */}
        {/* LIVE PREVIEW: COMO O CLIENTE VÊ NA LOJA */}
        {/* -------------------------------------------------------- */}
        <div className={`p-6 rounded-3xl border ${
          isDark ? 'bg-[#141824] border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold font-display">
              Prévia em Tempo Real (Como o Cliente Vê no Fluxo de Compra)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Live Checkout PIX Box Preview */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/90 border-purple-500/25' : 'bg-white border-purple-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-purple-500 tracking-wider block mb-2">
                1. Tela de Pagamento (PIX) do Checkout
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Chave PIX Oficial ({form.pixKeyType}):</span>
                  <span className="font-semibold text-slate-300 dark:text-slate-300">
                    {form.pixReceiverName}{form.pixBank ? ` • ${form.pixBank}` : ''}
                  </span>
                </div>

                <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-purple-500/20' : 'bg-slate-50 border-slate-200'
                }`}>
                  <code className="text-xs font-mono text-amber-300 flex-1 truncate">
                    {form.pixKey || 'pix@loja.com'}
                  </code>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold shrink-0">
                    Copiar
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-semibold pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Pagamento instantâneo via Banco Central com aprovação imediata</span>
                </div>
              </div>
            </div>

            {/* Live WhatsApp Button Preview */}
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-slate-900/90 border-emerald-500/25' : 'bg-white border-emerald-200'
            }`}>
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider block mb-2">
                2. Botão de Envio de Comprovante & Contato
              </span>

              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm">
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Enviar Comprovante via WhatsApp ({cleanPhone || '55...'})</span>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>• Destino: <span className="font-mono text-emerald-400">{cleanPhone ? `+${cleanPhone}` : 'Configurar'}</span></p>
                  <p>• Atendente: <span className="text-slate-300">{form.ownerName}</span></p>
                  <p>• Horário: <span className="text-slate-300">{form.workingHours}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2.5 text-sm transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações Dinamicamente</span>
          </button>
        </div>
      </form>
    </div>
  );
};
