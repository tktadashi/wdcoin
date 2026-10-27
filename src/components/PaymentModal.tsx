import React, { useState } from 'react';
import { Product } from '../types';
import { GAMES } from '../data/storeData';
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  Zap, 
  QrCode, 
  ShieldCheck, 
  AlertCircle,
  Coins
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';

interface PaymentModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ product, onClose }) => {
  const { isDark } = useTheme();
  const { storeConfig, addPurchase, userProfile } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'crypto'>('pix');
  const [quantity, setQuantity] = useState(1);
  const [customerWhatsApp, setCustomerWhatsApp] = useState(() => userProfile?.whatsapp || '');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCrypto, setCopiedCrypto] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!product) return null;

  const game = GAMES.find((g) => g.id === product.gameId);
  const gameName = game?.name || product.customGameName || product.gameId;
  const sellerDisplay = product.sellerName?.trim() || 'WD Coins Oficial';
  const totalPrice = product.price * quantity;
  const estimatedUsdt = (totalPrice / 5.75).toFixed(2);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(storeConfig.pixKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleCopyCrypto = () => {
    navigator.clipboard.writeText(storeConfig.usdtAddress);
    setCopiedCrypto(true);
    setTimeout(() => setCopiedCrypto(false), 2500);
  };

  const handleSendToWhatsApp = () => {
    const wa = customerWhatsApp.trim();
    if (!wa) {
      setErrorMessage('Por favor, informe o seu WhatsApp para receber o atendimento e a entrega.');
      return;
    }
    setErrorMessage(null);

    const purchase = addPurchase({
      productId: product.id,
      productName: product.name,
      gameId: product.gameId,
      price: product.price,
      quantity,
      total: totalPrice,
      server: 'Padrão',
      characterName: 'Cliente',
      customerWhatsApp: wa,
      paymentMethod,
    });

    const orderCode = purchase.id;

    const message = 
`*NOVO PEDIDO - WD COINS* 🎮
------------------------------------
*Pedido:* #${orderCode}
*Jogo:* ${gameName}
*Vendedor:* ${sellerDisplay}
*Produto:* ${product.name} (x${quantity})
*Valor Total:* R$ ${totalPrice.toFixed(2).replace('.', ',')}
*Método de Pagamento:* ${paymentMethod === 'pix' ? 'PIX' : 'Crypto (USDT)'}
*WhatsApp do Comprador:* ${wa}
------------------------------------
Acabei de efetuar o pagamento e estou enviando o comprovante em anexo para combinarmos a entrega!`;

    const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      id="payment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="payment-modal-container"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-5 sm:p-6 shadow-xl border transition-colors ${
          isDark
            ? 'bg-[#191A1E] border-[#303036] text-[#F4F1EC]'
            : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124]'
        }`}
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#1D1E23] hover:bg-[#25262c] text-[#AAA9B0] hover:text-[#F4F1EC]'
              : 'bg-[#ECE9E3] hover:bg-[#DDD8D1] text-[#68676D] hover:text-[#202124]'
          }`}
          aria-label="Fechar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pr-8 mb-5">
          <div className={`text-[11px] font-semibold flex items-center gap-1.5 flex-wrap ${
            isDark ? 'text-[#C7B0D4]' : 'text-[#80658F]'
          }`}>
            <span className="uppercase tracking-wider">{gameName}</span>
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>·</span>
            <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>
              Vendedor: <strong className={isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}>{sellerDisplay}</strong>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-display mt-0.5 flex items-center gap-2">
            {product.category === 'coins' && <Coins className="w-5 h-5 text-amber-500 shrink-0 inline-block" />}
            <span>{product.name}</span>
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span 
              data-typography="price"
              className="text-2xl font-semibold font-sans"
            >
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </span>
            {quantity > 1 && (
              <span className={`text-xs ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                ({quantity}x de R$ {product.price.toFixed(2).replace('.', ',')})
              </span>
            )}
          </div>
        </div>

        {/* Quantity & WhatsApp Form */}
        <div className={`space-y-3.5 p-3.5 rounded-xl border mb-5 text-xs transition-colors ${
          isDark ? 'bg-[#1D1E23] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
        }`}>
          
          <div className="flex items-center justify-between">
            <label className={`font-medium ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Quantidade:
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center border cursor-pointer ${
                  isDark
                    ? 'bg-[#191A1E] text-[#F4F1EC] hover:bg-[#25262c] border-[#303036]'
                    : 'bg-[#FFFFFF] text-[#202124] hover:bg-[#ECE9E3] border-[#DDD8D1]'
                }`}
              >
                -
              </button>
              <span className="font-semibold text-sm w-5 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className={`w-7 h-7 rounded-lg font-semibold flex items-center justify-center border cursor-pointer ${
                  isDark
                    ? 'bg-[#191A1E] text-[#F4F1EC] hover:bg-[#25262c] border-[#303036]'
                    : 'bg-[#FFFFFF] text-[#202124] hover:bg-[#ECE9E3] border-[#DDD8D1]'
                }`}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>
              Seu WhatsApp (com DDD) *
            </label>
            <input
              type="text"
              required
              id="input-customer-whatsapp"
              placeholder="Ex: (11) 99999-8888"
              value={customerWhatsApp}
              onChange={(e) => setCustomerWhatsApp(e.target.value)}
              className={`w-full rounded-lg px-3 py-2 text-xs outline-none border transition-colors ${
                isDark
                  ? 'bg-[#111214] border-[#303036] text-[#F4F1EC] placeholder-[#AAA9B0]/60 focus:border-[#A78AB8]'
                  : 'bg-[#FFFFFF] border-[#DDD8D1] text-[#202124] placeholder-[#68676D]/60 focus:border-[#80658F]'
              }`}
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Payment Tabs: PIX or Crypto */}
        <div className={`flex gap-2 p-1 rounded-xl border mb-4 ${
          isDark ? 'bg-[#111214] border-[#303036]' : 'bg-[#ECE9E3] border-[#DDD8D1]'
        }`}>
          <button
            id="tab-btn-pix"
            onClick={() => setPaymentMethod('pix')}
            data-typography="button"
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              paymentMethod === 'pix'
                ? isDark
                  ? 'bg-[#1D1E23] text-[#F4F1EC] border border-[#303036]'
                  : 'bg-[#FFFFFF] text-[#202124] shadow-xs'
                : isDark
                ? 'text-[#AAA9B0] hover:text-[#F4F1EC]'
                : 'text-[#68676D] hover:text-[#202124]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pagar com PIX</span>
          </button>
          <button
            id="tab-btn-crypto"
            onClick={() => setPaymentMethod('crypto')}
            data-typography="button"
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              paymentMethod === 'crypto'
                ? isDark
                  ? 'bg-[#1D1E23] text-[#F4F1EC] border border-[#303036]'
                  : 'bg-[#FFFFFF] text-[#202124] shadow-xs'
                : isDark
                ? 'text-[#AAA9B0] hover:text-[#F4F1EC]'
                : 'text-[#68676D] hover:text-[#202124]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pagar com USDT</span>
          </button>
        </div>

        {/* PIX View */}
        {paymentMethod === 'pix' && (
          <div className="space-y-3.5">
            {/* PIX Key Box */}
            <div>
              <div className={`flex items-center justify-between text-xs mb-1 ${
                isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
              }`}>
                <span>Chave PIX Oficial ({storeConfig.pixKeyType}):</span>
                <span className="text-[11px]">
                  {storeConfig.pixReceiverName}{storeConfig.pixBank ? ` • ${storeConfig.pixBank}` : ''}
                </span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                isDark ? 'bg-[#111214] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
              }`}>
                <code className="text-xs font-mono flex-1 truncate px-1">
                  {storeConfig.pixKey}
                </code>
                <button
                  id="btn-copy-pix"
                  onClick={handleCopyPix}
                  data-typography="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#1D1E23] hover:bg-[#25262c] text-[#F4F1EC] border-[#303036]'
                      : 'bg-[#FFFFFF] hover:bg-[#ECE9E3] text-[#202124] border-[#DDD8D1]'
                  }`}
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Chave</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step Instructions */}
            <div className={`text-[11px] space-y-1 p-3 rounded-xl border ${
              isDark ? 'bg-[#1D1E23] border-[#303036] text-[#AAA9B0]' : 'bg-[#F5F3EF] border-[#DDD8D1] text-[#68676D]'
            }`}>
              <p className={`font-semibold ${isDark ? 'text-[#F4F1EC]' : 'text-[#202124]'}`}>Como pagar via PIX:</p>
              <p>1. Copie a chave acima no app do seu banco.</p>
              <p>2. Transfira o valor exato de <strong>R$ {totalPrice.toFixed(2).replace('.', ',')}</strong>.</p>
              <p>3. Clique no botão abaixo para enviar o comprovante no WhatsApp e receber no jogo.</p>
            </div>
          </div>
        )}

        {/* Crypto View */}
        {paymentMethod === 'crypto' && (
          <div className="space-y-3.5">
            <div className={`p-3.5 rounded-xl border ${
              isDark ? 'bg-[#1D1E23] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}>Valor correspondente:</span>
                <span className="text-base font-semibold font-display">
                  ~ {estimatedUsdt} USDT
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                Rede: <strong>{storeConfig.usdtNetwork}</strong>
              </p>
            </div>

            {/* Wallet Address */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'}`}>
                Endereço da Carteira USDT (BSC / BEP-20):
              </label>
              <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                isDark ? 'bg-[#111214] border-[#303036]' : 'bg-[#F5F3EF] border-[#DDD8D1]'
              }`}>
                <code className="text-[11px] font-mono flex-1 break-all px-1">
                  {storeConfig.usdtAddress}
                </code>
                <button
                  id="btn-copy-crypto"
                  onClick={handleCopyCrypto}
                  data-typography="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 shrink-0 transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#1D1E23] hover:bg-[#25262c] text-[#F4F1EC] border-[#303036]'
                      : 'bg-[#FFFFFF] hover:bg-[#ECE9E3] text-[#202124] border-[#DDD8D1]'
                  }`}
                >
                  {copiedCrypto ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] flex items-start gap-2 ${
              isDark ? 'bg-[#1D1E23] border-[#303036] text-[#AAA9B0]' : 'bg-[#ECE9E3] border-[#DDD8D1] text-[#68676D]'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <span>
                Envie somente via <strong>BEP-20 (Binance Smart Chain)</strong>. Após a confirmação, envie a hash no WhatsApp.
              </span>
            </div>
          </div>
        )}

        {/* Action Button: Send Receipt on WhatsApp */}
        <div className={`mt-6 pt-4 border-t ${isDark ? 'border-[#303036]' : 'border-[#DDD8D1]'}`}>
          <button
            id="btn-send-whatsapp-receipt"
            onClick={handleSendToWhatsApp}
            data-typography="button"
            className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isDark ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-[#168B4B] hover:bg-[#12723d]'
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Enviar Comprovante via WhatsApp</span>
          </button>

          <div className={`mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-center ${
            isDark ? 'text-[#AAA9B0]' : 'text-[#68676D]'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Entrega manual ágil direto no seu personagem.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
