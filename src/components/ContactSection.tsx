import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/storeData';
import { MessageCircle, Clock, ShieldCheck, Send, Star, UserCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';

export const ContactSection: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userGame, setUserGame] = useState('Poke Idle World');
  const [userMessage, setUserMessage] = useState('');
  const { isDark } = useTheme();
  const { storeConfig } = useStore();

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const name = userName.trim() || 'Jogador';
    const text = userMessage.trim() || 'Olá, gostaria de tirar uma dúvida sobre disponibilidade de moedas e itens.';

    const fullMsg = `*CONTATO VIA SITE - WD COINS* 💬\n\n*Nome:* ${name}\n*Jogo de Interesse:* ${userGame}\n*Mensagem:* ${text}`;
    const url = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(fullMsg)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contato" className={`py-14 border-t transition-colors ${
      isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
            isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
          }`}>
            Atendimento Direto
          </div>
          <h2 
            data-typography="section-title"
            className={`text-2xl sm:text-3xl font-semibold tracking-tight font-display ${
              isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
            }`}
          >
            Fale Diretamente Comigo
          </h2>
          <p 
            data-typography="description"
            className={`mt-2 text-xs sm:text-sm font-normal font-sans ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Tire dúvidas sobre Kinah, PokeCoins, Zen ou Gold e envie seu comprovante com rapidez.
          </p>
        </div>

        {/* Contact Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Left Column: Direct WhatsApp Card */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark
                    ? 'bg-[#191A1E] border-[#303036] text-[#25D366]'
                    : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#168B4B]'
                }`}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-base font-semibold font-display ${
                    isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                  }`}>
                    Canal Oficial WhatsApp
                  </h3>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold mt-0.5 ${
                    isDark ? 'text-[#25D366]' : 'text-[#168B4B]'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>Atendimento Ativo</span>
                  </div>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-6 font-normal font-sans ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}>
                Atendimento direto de gamer para gamer para garantir que suas moedas e itens sejam entregues com rapidez e segurança no seu personagem.
              </p>

              <div className={`space-y-3 pt-4 border-t text-xs font-sans ${
                isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 shrink-0 opacity-70" />
                  <div>
                    <span className={`font-semibold ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>Horário: </span>
                    <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>{storeConfig.workingHours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#25D366]' : 'text-[#168B4B]'}`} />
                  <div>
                    <span className={`font-semibold ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>Prazo Médio: </span>
                    <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>{storeConfig.averageDelivery}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 shrink-0 opacity-70" />
                  <div>
                    <span className={`font-semibold ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>Responsável: </span>
                    <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>{storeConfig.ownerName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                id="btn-direct-whatsapp-cta"
                href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20as%20coins%20da%20WD%20Coins!`}
                target="_blank"
                rel="noopener noreferrer"
                data-typography="button"
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold font-sans text-white flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  isDark ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-[#168B4B] hover:bg-[#12723d]'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Iniciar Conversa no WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Fast Form to WhatsApp */}
          <div
            className={`lg:col-span-7 rounded-2xl border p-5 sm:p-6 transition-colors ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
            }`}
          >
            <h3 className={`text-base font-semibold font-display mb-1 ${
              isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
            }`}>
              Envie uma Mensagem Rápida
            </h3>
            <p 
              data-typography="description"
              className={`text-xs font-normal font-sans mb-5 ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}
            >
              Preencha os campos abaixo para abrir o WhatsApp com os dados pré-carregados.
            </p>

            <form onSubmit={handleSendCustomMessage} className="space-y-3.5">
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                }`}>
                  Seu Nome ou Nick:
                </label>
                <input
                  type="text"
                  placeholder="Ex: João ou Nick do Jogo"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors border ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                }`}>
                  Jogo de Interesse:
                </label>
                <select
                  value={userGame}
                  onChange={(e) => setUserGame(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none cursor-pointer border ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] focus:border-[#80658F]'
                  }`}
                >
                  <option value="Poke Idle World">Poke Idle World</option>
                  <option value="Mu Lorvath">Mu Lorvath</option>
                  <option value="Priston Tale">Priston Tale</option>
                  <option value="Aion 2">Aion 2 (Kinah)</option>
                  <option value="Outro Jogo ou Parceria">Outro Jogo ou Parceria</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                }`}>
                  Sua Mensagem ou Dúvida:
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Gostaria de saber a cotação de Kinah para 500M no Aion 2..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none resize-none transition-colors border ${
                    isDark
                      ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                      : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
                  }`}
                />
              </div>

              <button
                type="submit"
                data-typography="button"
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-[#E7DED0] hover:bg-[#ded3c3] text-[#202124]'
                    : 'bg-[#25242A] hover:bg-[#37353f] text-[#FFFFFF]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar para o WhatsApp</span>
              </button>
            </form>
          </div>

        </div>

        {/* Testimonials from players */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className={`text-lg sm:text-xl font-semibold font-display ${
              isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
            }`}>
              Avaliações de Clientes Recentes
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
              Depoimentos de jogadores que compram regularmente conosco
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {TESTIMONIALS.map((test, tIdx) => (
              <div
                key={tIdx}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-colors ${
                  isDark
                    ? 'bg-[#1D1E23] border-[#303036]'
                    : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <p className={`text-xs leading-relaxed italic mb-4 font-normal font-sans ${
                    isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                  }`}>
                    "{test.text}"
                  </p>
                </div>
                <div className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                  isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
                }`}>
                  <div>
                    <div className={`font-semibold ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>{test.name}</div>
                    <div className={isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}>{test.game}</div>
                  </div>
                  <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>{test.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
