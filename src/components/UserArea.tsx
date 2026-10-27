import React, { useState } from 'react';
import { UserProfile, GameId } from '../types';
import { useStore } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { GAMES } from '../data/storeData';
import { 
  User, 
  Mail,
  Sparkles, 
  MessageCircle, 
  CheckCircle2, 
  Gamepad2, 
  Edit3, 
  LogOut, 
  ShoppingBag, 
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Check,
  Zap
} from 'lucide-react';

interface UserAreaProps {
  onGoToStore: () => void;
  onGoToOrders: () => void;
}

export const UserArea: React.FC<UserAreaProps> = ({ onGoToStore, onGoToOrders }) => {
  const { isDark } = useTheme();
  const { 
    userProfile, 
    saveUserProfile, 
    clearUserProfile, 
    customOrders, 
    purchases, 
    storeConfig
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(() => {
    return userProfile || {
      name: '',
      email: '',
      favoriteGame: 'poke-idle',
      characterName: '',
      server: '',
      whatsapp: '',
    };
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Email format validation helper
  const isValidEmail = (emailStr: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  // Helper phone mask for optional whatsapp
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Submit Registration (Email-only, simple & instant)
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('Por favor, informe seu nome ou apelido.');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('Por favor, informe seu e-mail.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFormError('Por favor, digite um endereço de e-mail válido (ex: seuemail@gmail.com).');
      return;
    }

    const defaultServer = 
      formData.favoriteGame === 'priston-tale'
        ? 'Servidor Idhas'
        : formData.favoriteGame === 'poke-idle'
        ? 'Global / Sem Servidor'
        : formData.favoriteGame === 'aion-2'
        ? 'Servidor Global / Principal'
        : 'Mu Lorvath Único';

    const newProfile: UserProfile = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      favoriteGame: formData.favoriteGame,
      characterName: formData.characterName?.trim() || '',
      server: formData.server || defaultServer,
      whatsapp: formData.whatsapp?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    saveUserProfile(newProfile);
    setSuccessFeedback('Cadastro realizado com sucesso! Sua conta gamer está pronta.');
    setIsEditing(false);
    setTimeout(() => setSuccessFeedback(null), 4000);
  };

  // Save profile edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Nome e E-mail são obrigatórios.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setFormError('E-mail inválido. Verifique o formato digitado.');
      return;
    }

    const updatedProfile: UserProfile = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    saveUserProfile(updatedProfile);
    setIsEditing(false);
    setSuccessFeedback('Perfil atualizado com sucesso!');
    setTimeout(() => setSuccessFeedback(null), 3000);
  };

  // Filter user orders and purchases by email or whatsapp
  const userOrders = customOrders.filter(o => {
    if (!userProfile) return false;
    const matchEmail = o.customerWhatsApp && userProfile.whatsapp && o.customerWhatsApp.replace(/\D/g, '') === userProfile.whatsapp.replace(/\D/g, '');
    const matchName = o.characterName && userProfile.characterName && o.characterName.toLowerCase() === userProfile.characterName.toLowerCase();
    return matchEmail || matchName;
  });

  const userPurchases = purchases.filter(p => {
    if (!userProfile) return false;
    const matchName = p.characterName && userProfile.characterName && p.characterName.toLowerCase() === userProfile.characterName.toLowerCase();
    const matchPhone = p.customerWhatsApp && userProfile.whatsapp && p.customerWhatsApp.replace(/\D/g, '') === userProfile.whatsapp.replace(/\D/g, '');
    return matchName || matchPhone;
  });

  // =================================================================
  // 1. REGISTRATION FORM (When user has no profile saved)
  // =================================================================
  if (!userProfile && !isEditing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC]'
            : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-xs'
        }`}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mx-auto mb-3 ${
              isDark
                ? 'bg-[#191A1E] border-[#303036] text-[#C7B0D4]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              <User className="w-6 h-6" />
            </div>
            <h2 
              data-typography="section-title"
              className="text-xl sm:text-2xl font-semibold font-display"
            >
              Área do Usuário & Meus Pedidos
            </h2>
            <p 
              data-typography="description"
              className={`text-xs max-w-md mx-auto mt-1.5 font-normal font-sans ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}
            >
              Acompanhe pedidos, agilize entregas in-game e salve seus dados de personagem.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">
                Nome ou Como prefere ser chamado *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Pedro ou Nick Gamer"
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 flex items-center justify-between">
                <span>Seu E-mail *</span>
                <span className={`text-[10px] ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`}>Identificador da Conta</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemplo@gmail.com"
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none font-mono text-xs transition-colors ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Jogo Principal</label>
                <select
                  value={formData.favoriteGame}
                  onChange={(e) => setFormData({ ...formData, favoriteGame: e.target.value as GameId })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] focus:border-[#80658F]'
                  }`}
                >
                  {GAMES.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nick do Personagem (Char)</label>
                <input
                  type="text"
                  value={formData.characterName || ''}
                  onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
                  placeholder="Ex: AshKetchum99"
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                WhatsApp de Contato (Opcional)
              </label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })}
                placeholder="(11) 98765-4321"
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none font-mono text-xs transition-colors ${
                  isDark
                    ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                }`}
              />
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              data-typography="button"
              className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer ${
                isDark
                  ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                  : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
              }`}
            >
              <span>Criar Cadastro com E-mail</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Benefits */}
            <div className={`pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] ${
              isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
            }`}>
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#25D366]' : 'text-[#168B4B]'}`} />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Ativação Instantânea</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`} />
                <span>Dados Seguros</span>
              </div>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // =================================================================
  // 2. PROFILE EDIT FORM
  // =================================================================
  if (isEditing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
          isDark ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC]' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124]'
        }`}>
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#303036] dark:border-[#303036]">
            <div className={`p-2 rounded-xl border ${
              isDark ? 'bg-[#191A1E] border-[#303036] text-[#C7B0D4]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-display">Editar Perfil Gamer</h2>
              <p className={`text-xs ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>Atualize seus dados cadastrais.</p>
            </div>
          </div>

          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Nome / Apelido *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                  isDark
                    ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">E-mail Cadastrado *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border focus:outline-none font-mono ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">WhatsApp de Contato (Opcional)</label>
              <input
                type="tel"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: formatPhone(e.target.value) })}
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none font-mono ${
                  isDark
                    ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Jogo Principal</label>
              <select
                value={formData.favoriteGame}
                onChange={(e) => setFormData({ ...formData, favoriteGame: e.target.value as GameId })}
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                  isDark
                    ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]'
                    : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                }`}
              >
                {GAMES.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Nick do Personagem (Char)</label>
                <input
                  type="text"
                  value={formData.characterName || ''}
                  onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Servidor Padrão</label>
                <div className={`w-full px-3.5 py-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  isDark ? 'bg-[#111214] border-[#303036] text-[#F4F1EC]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#202124]'
                }`}>
                  <span className="truncate">
                    {formData.favoriteGame === 'priston-tale'
                      ? 'Servidor Idhas'
                      : formData.favoriteGame === 'poke-idle'
                      ? 'Poke Idle (Global)'
                      : formData.favoriteGame === 'aion-2'
                      ? 'Servidor Global / Principal'
                      : 'Mu Lorvath Único'}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-[#191A1E] text-[#C7B0D4]' : 'bg-[#FFFFFF] text-[#80658F]'
                  }`}>
                    Auto
                  </span>
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className={`pt-3 border-t flex items-center justify-end gap-2 ${
              isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
            }`}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={`px-4 py-2 rounded-xl cursor-pointer ${
                  isDark ? 'text-[#AAA9B0] hover:text-[#F4F1EC]' : 'text-[#68676D] hover:text-[#202124]'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                data-typography="button"
                className={`px-5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                  isDark
                    ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                    : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                }`}
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =================================================================
  // 3. USER DASHBOARD (Logged-in Gamer View)
  // =================================================================
  if (!userProfile) {
    return null;
  }

  const favoriteGameInfo = GAMES.find(g => g.id === userProfile.favoriteGame);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast Feedback */}
      {successFeedback && (
        <div className={`mb-4 p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
          isDark
            ? 'bg-[#1D1E23] border-[#25D366]/30 text-[#25D366]'
            : 'bg-[#ECE9E3] border-[#168B4B]/30 text-[#168B4B]'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Gamer Profile Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors ${
        isDark ? 'bg-[#1D1E23] border-[#303036] text-[#F4F1EC]' : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center border font-display font-bold text-xl ${
            isDark
              ? 'bg-[#191A1E] border-[#303036] text-[#C7B0D4]'
              : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
          }`}>
            {userProfile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold font-display">
                {userProfile.name}
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${
                isDark
                  ? 'bg-[#15161A] text-[#25D366] border-[#25D366]/30'
                  : 'bg-[#ECE9E3] text-[#168B4B] border-[#168B4B]/30'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>Conta Ativa</span>
              </span>
            </div>

            <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 opacity-70" />
                <strong className="font-mono">{userProfile.email}</strong>
              </span>

              {userProfile.characterName && (
                <span>• Char: <strong>{userProfile.characterName}</strong></span>
              )}

              {userProfile.whatsapp && (
                <span>• WhatsApp: <span className="font-mono">{userProfile.whatsapp}</span></span>
              )}
            </div>

            {favoriteGameInfo && (
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${
                  isDark ? 'bg-[#191A1E] border-[#303036] text-[#C7B0D4]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#80658F]'
                }`}>
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>{favoriteGameInfo.name}</span>
                </span>
                {userProfile.server && (
                  <span className={`text-[11px] ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                    Servidor: {userProfile.server}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setFormData({ ...userProfile });
              setIsEditing(true);
            }}
            data-typography="button"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC] hover:bg-[#22242a]'
                : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#202124] hover:bg-[#e4e0d8]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Perfil</span>
          </button>

          <button
            onClick={clearUserProfile}
            data-typography="button"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center gap-1"
            title="Desconectar perfil"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Orders and Purchases */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Custom Orders Card */}
          <div className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#1D1E23] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 
                data-typography="section-title"
                className="text-base font-semibold font-display flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Minhas Encomendas Personalizadas ({userOrders.length})</span>
              </h3>

              <button
                onClick={onGoToOrders}
                data-typography="button"
                className={`text-xs font-semibold hover:underline cursor-pointer ${
                  isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                }`}
              >
                + Nova Encomenda
              </button>
            </div>

            {userOrders.length === 0 ? (
              <div className={`p-8 text-center text-xs border border-dashed rounded-xl ${
                isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
              }`}>
                <p>Nenhuma encomenda sob demanda registrada no momento.</p>
                <button
                  onClick={onGoToOrders}
                  data-typography="button"
                  className={`mt-3 px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                      : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                  }`}
                >
                  Fazer Encomenda Sob Medida
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map(order => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-semibold text-xs ${
                          isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                        }`}>
                          {order.id}
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <span 
                        data-typography="order-status"
                        className={`text-[10px] font-semibold font-sans px-2 py-0.5 rounded-md uppercase border ${
                          order.status === 'concluido'
                            ? isDark
                              ? 'bg-[#15161A] text-[#25D366] border-[#25D366]/30'
                              : 'bg-[#ECE9E3] text-[#168B4B] border-[#168B4B]/30'
                            : isDark
                            ? 'bg-[#15161A] text-[#C7B0D4] border-[#303036]'
                            : 'bg-[#ECE9E3] text-[#80658F] border-[#DDD8D1]'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p 
                      data-typography="description"
                      className="text-xs font-normal font-sans mb-1"
                    >
                      {order.details}
                    </p>

                    <div className={`text-[11px] flex items-center justify-between mt-2 pt-2 border-t ${
                      isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
                    }`}>
                      <span>Char: <strong>{order.characterName}</strong> ({order.server})</span>
                      <a
                        href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá%20WD%20Coins,%20gostaria%20de%20saber%20o%20status%20da%20minha%20encomenda%20(${order.id})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`hover:underline font-semibold flex items-center gap-1 ${
                          isDark ? 'text-[#25D366]' : 'text-[#168B4B]'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Ver no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchases History */}
          <div className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#1D1E23] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold font-display flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 opacity-70" />
                <span>Histórico de Compras da Loja ({userPurchases.length})</span>
              </h3>

              <button
                onClick={onGoToStore}
                data-typography="button"
                className={`text-xs font-semibold hover:underline cursor-pointer ${
                  isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                }`}
              >
                Ver Catálogo
              </button>
            </div>

            {userPurchases.length === 0 ? (
              <div className={`p-8 text-center text-xs border border-dashed rounded-xl ${
                isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
              }`}>
                <p>Nenhuma compra direta registrada ainda. Suas compras na loja aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userPurchases.map(p => (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">{p.productName}</div>
                      <div className={`text-[10px] ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                        {p.id} • {p.server} • Char: {p.characterName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        data-typography="price"
                        className="text-xs font-semibold font-sans"
                      >
                        R$ {p.total.toFixed(2).replace('.', ',')}
                      </div>
                      <span className={`text-[9px] uppercase font-semibold ${
                        isDark ? 'text-[#25D366]' : 'text-[#168B4B]'
                      }`}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Fast Actions & Direct Support */}
        <div className="space-y-4">
          
          <div className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#1D1E23] border-[#303036]' : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
          }`}>
            <h3 className="font-semibold font-display text-sm mb-3 flex items-center gap-2">
              <MessageCircle className={`w-4 h-4 ${isDark ? 'text-[#25D366]' : 'text-[#168B4B]'}`} />
              <span>Atendimento Direto</span>
            </h3>
            <p className={`text-xs leading-relaxed mb-4 font-normal font-sans ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}>
              Precisa agilizar a entrega de um pedido ou mandar comprovante do PIX? Fale com a loja pelo WhatsApp:
            </p>

            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá%20WD%20Coins,%20sou%20o%20jogador%20${encodeURIComponent(userProfile.name)}%20(E-mail:%20${encodeURIComponent(userProfile.email)},%20Char:%20${encodeURIComponent(userProfile.characterName || '')})!`}
              target="_blank"
              rel="noopener noreferrer"
              data-typography="button"
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-xs transition-colors shadow-xs ${
                isDark ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-[#168B4B] hover:bg-[#12723d]'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>

          <div className={`p-5 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#ECE9E3] border-[#DDD8D1]'
          }`}>
            <h4 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-[#25D366]' : 'text-[#168B4B]'}`} />
              <span>Dica de Segurança</span>
            </h4>
            <p className={`text-[11px] leading-relaxed font-normal font-sans ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}>
              Nunca passe a senha da sua conta de jogo para ninguém. Nossas entregas são feitas exclusivamente por Trade in-game ou pelo correio interno.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
