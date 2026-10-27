import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/storeData';
import { ShoppingBag, CreditCard, Send, CheckCircle2, ChevronDown, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';

export const HowToBuy: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { isDark } = useTheme();
  const { storeConfig } = useStore();

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      step: '01',
      title: 'Escolha seu Jogo e Produto',
      desc: 'Navegue pelo catálogo de Poke Idle World, Mu Lorvath, Priston Tale ou Aion 2. Selecione o pacote desejado.',
      icon: <ShoppingBag className="w-5 h-5 text-amber-500" />,
    },
    {
      step: '02',
      title: 'Pague via PIX ou Crypto',
      desc: 'No modal de compra, copie a chave PIX ou escaneie o QR Code. Para pagamentos internacionais aceitamos USDT (BEP-20).',
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
    },
    {
      step: '03',
      title: 'Envie o Comprovante no WhatsApp',
      desc: 'Clique no botão verde de envio. O WhatsApp abrirá já formatado com seu Nickname e Servidor para agilizar o atendimento.',
      icon: <Send className={`w-5 h-5 ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`} />,
    },
    {
      step: '04',
      title: 'Receba seus Itens com Segurança',
      desc: 'Após a checagem rápida do pagamento, nos encontramos no jogo ou realizamos o envio direto via correio/trade em 10 a 25 min.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#25D366]" />,
    },
  ];

  return (
    <section id="como-comprar" className={`py-14 border-t transition-colors ${
      isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
            isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
          }`}>
            Simples e Transparente
          </div>
          <h2 
            data-typography="section-title"
            className={`text-2xl sm:text-3xl font-semibold tracking-tight font-display ${
              isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
            }`}
          >
            Como Comprar Passo a Passo
          </h2>
          <p 
            data-typography="description"
            className={`mt-2 text-xs sm:text-sm font-normal font-sans ${
              isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
            }`}
          >
            Veja como é simples e seguro adquirir moedas e itens diretamente para seu personagem.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${
                isDark
                  ? 'bg-[#1D1E23] border-[#303036]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#ECE9E3] border-[#DDD8D1]'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-xs font-semibold font-sans ${
                    isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
                  }`}>
                    PASSO {item.step}
                  </span>
                </div>

                <h3 className={`text-base font-semibold font-display mb-2 ${
                  isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
                }`}>
                  {item.title}
                </h3>

                <p 
                  data-typography="description"
                  className={`text-xs font-normal font-sans leading-relaxed ${
                    isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
                  }`}
                >
                  {item.desc}
                </p>
              </div>

              <div className={`mt-5 pt-3 border-t text-[11px] font-sans ${
                isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
              }`}>
                {idx === 0 && 'Catálogo 100% atualizado'}
                {idx === 1 && 'PIX instantâneo ou USDT'}
                {idx === 2 && 'Mensagem pré-formatada'}
                {idx === 3 && 'Entrega direta in-game'}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 
              data-typography="section-title"
              className={`text-xl sm:text-2xl font-semibold font-display ${
                isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'
              }`}
            >
              Perguntas Frequentes
            </h3>
            <p 
              data-typography="description"
              className={`mt-1 text-xs font-normal font-sans ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}
            >
              Tire suas principais dúvidas sobre pedidos, pagamento e segurança
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-xl border overflow-hidden transition-colors ${
                  isDark
                    ? 'bg-[#1D1E23] border-[#303036]'
                    : 'bg-[#FFFFFF] border-[#DDD8D1]'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  data-typography="button"
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  <span className={isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-amber-500' : 'text-slate-400'
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className={`px-5 pb-4 pt-1 border-t text-xs font-normal font-sans leading-relaxed ${
                    isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
                  }`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Support Callout */}
          <div className={`mt-8 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
            isDark ? 'bg-[#191A1E] border-[#303036]' : 'bg-[#ECE9E3] border-[#DDD8D1]'
          }`}>
            <div>
              <div className={`text-xs font-semibold ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
                Ainda tem alguma dúvida?
              </div>
              <div className={`text-[11px] ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                Fale comigo agora pelo WhatsApp oficial
              </div>
            </div>
            <a
              href={`https://wa.me/${storeConfig.whatsappNumber}?text=Olá,%20tenho%20uma%20dúvida%20sobre%20as%20compras%20na%20WD%20Coins!`}
              target="_blank"
              rel="noopener noreferrer"
              data-typography="button"
              className={`px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-[#168B4B] hover:bg-[#12723d]'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
