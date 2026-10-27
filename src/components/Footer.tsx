import React from 'react';
import { Gamepad2, ShieldCheck, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { NavTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenCode: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCode }) => {
  const { isDark } = useTheme();

  return (
    <footer className={`border-t text-xs pt-12 pb-8 transition-colors ${
      isDark
        ? 'border-[#303036] bg-[#15161A] text-[#AAA9B0]'
        : 'border-[#DDD8D1] bg-[#ECE9E3] text-[#68676D]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Disclaimer */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isDark
                  ? 'bg-[#1D1E23] border-[#303036] text-[#C7B0D4]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#80658F]'
              }`}>
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div 
                data-typography="brand-logo"
                className={`text-base font-bold font-display ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}
              >
                WD <span className={isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}>Coins</span>
              </div>
            </div>

            <p 
              data-typography="description"
              className={`text-xs max-w-md leading-relaxed font-normal font-sans ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}
            >
              Loja gamer especializada na venda e entrega direta de Kinah, coins, joias e equipamentos para Poke Idle World, Mu Lorvath, Priston Tale e Aion 2.
            </p>

            <div className={`flex items-center gap-2 text-[11px] p-2.5 rounded-xl border max-w-md ${
              isDark
                ? 'bg-[#1D1E23] border-[#303036] text-[#AAA9B0]'
                : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#68676D]'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-normal font-sans">Entrega manual rápida após confirmação do pagamento via PIX & USDT.</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  data-typography="menu"
                  className="hover:underline transition-colors cursor-pointer text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('produtos')}
                  data-typography="menu"
                  className="hover:underline transition-colors cursor-pointer text-left"
                >
                  Catálogo de Produtos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('encomendas')}
                  data-typography="menu"
                  className="hover:underline transition-colors cursor-pointer text-left"
                >
                  Encomendas Sob Medida
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('como-comprar')}
                  data-typography="menu"
                  className="hover:underline transition-colors cursor-pointer text-left"
                >
                  Como Comprar Passo a Passo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contato')}
                  data-typography="menu"
                  className="hover:underline transition-colors cursor-pointer text-left"
                >
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Jogos & Área do Cliente */}
          <div className="space-y-2.5">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Jogos Atendidos
            </h4>
            <ul className="space-y-2">
              <li>Poke Idle World (IVs & Diamantes)</li>
              <li>Mu Lorvath (Joias & Zen)</li>
              <li>Priston Tale (Servidor Idhas)</li>
              <li>Aion 2 (Venda de Kinah)</li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('usuario')}
                  data-typography="menu"
                  className={`font-semibold underline ${isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'}`}
                >
                  Acessar Meus Pedidos
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin discreet entrance */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${
          isDark ? 'border-[#303036] text-[#AAA9B0]' : 'border-[#DDD8D1] text-[#68676D]'
        }`}>
          <div>
            &copy; {new Date().getFullYear()} WD Coins. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenCode}
              data-typography="button"
              className="hover:underline cursor-pointer opacity-80 hover:opacity-100"
            >
              Exportar Código
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              data-typography="button"
              className="flex items-center gap-1 hover:underline cursor-pointer opacity-80 hover:opacity-100"
              title="Painel Administrativo da Loja"
            >
              <Lock className="w-3 h-3" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
