export type GameId = 'poke-idle' | 'mu-idle' | 'priston-tale' | 'aion-2' | (string & {});

export type ThemeMode = 'dark' | 'light' | 'purple' | 'red';

export type ProductCategory = 'coins' | 'items' | 'combos';

export type NavTab = 'home' | 'produtos' | 'intermediacao' | 'encomendas' | 'como-comprar' | 'contato' | 'admin' | 'usuario';

export interface GameInfo {
  id: GameId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  badgeColor: string; // Pastel theme colors
  accentGradient: string;
  iconName: string;
  availableServers: string[];
  features: string[];
  isIdle?: boolean;
  aliases?: string[];
}

export interface Product {
  id: string;
  gameId: GameId;
  customGameName?: string;
  sellerName?: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  deliveryMethod: string;
  estimatedDeliveryTime: string;
  stockStatus: 'disponivel' | 'poucas_unidades' | 'sob_encomenda';
  inStock?: boolean; // Se false, marca como Esgotado / Sem estoque
  hasDemand?: boolean; // Se tem demanda ativa cadastrada pelo admin
  isRegisteredByAdmin?: boolean; // Item cadastrado pelo lojista
  popular?: boolean;
  createdAt?: string;
}

export interface StoreConfig {
  storeName: string;
  ownerName: string;
  whatsappNumber: string; // e.g. 5511999999999
  pixKey: string;
  pixKeyType: string;
  pixReceiverName: string;
  pixBank?: string;
  usdtAddress: string;
  usdtNetwork: string;
  workingHours: string;
  averageDelivery: string;
}

export interface CheckoutDetails {
  product: Product;
  quantity: number;
  server: string;
  characterName: string;
  customerWhatsApp: string;
  notes?: string;
  paymentMethod: 'pix' | 'crypto';
}

export type UnifiedOrderStatus = 'pendente' | 'pago' | 'entregue' | 'cancelado';

export type EncomendaOption = 'moeda' | 'item' | 'servico';

export interface CustomOrder {
  id: string;
  createdAt: string;
  customerName: string;
  customerWhatsApp: string;
  gameId: GameId | 'outro';
  customGameName?: string;
  server: string;
  characterName: string;
  orderType: 'coins' | 'item' | 'combo' | 'servico' | 'outro';
  encomendaType?: EncomendaOption; // Moeda, Item, Serviço
  details: string;
  budget?: string;
  status: 'pendente' | 'pago' | 'entregue' | 'cancelado' | 'em_analise' | 'aceito' | 'em_entrega' | 'concluido';
  adminNotes?: string;
  serviceType?: string;
  pokemonName?: string;
  pokemonIv?: string;
  quantity?: string | number;
  paymentMethod?: 'pix' | 'crypto' | string;
  targetItem?: string;
  targetService?: string;
  targetQuantity?: string;
}

export interface PurchaseOrder {
  id: string;
  createdAt: string;
  productId: string;
  productName: string;
  gameId: GameId;
  price: number;
  quantity: number;
  total: number;
  server: string;
  characterName: string;
  customerWhatsApp: string;
  paymentMethod: 'pix' | 'crypto';
  status: 'pendente' | 'pago' | 'entregue' | 'cancelado' | 'aguardando_comprovante' | 'em_analise';
}

export interface UserProfile {
  name: string;
  email: string;
  favoriteGame: GameId | 'all';
  whatsapp?: string;
  characterName?: string;
  server?: string;
  createdAt?: string;
}

// ---------------------------------------------------------------------------
// Intermediação Segura (Escrow / Middleman Negociação Gamer)
// ---------------------------------------------------------------------------
export type IntermediationStatus = 
  | 'aguardando_participante'
  | 'em_negociacao'
  | 'pagamento_retido'
  | 'entrega_andamento'
  | 'concluido'
  | 'cancelado';

export interface IntermediationParticipant {
  role: 'vendedor' | 'comprador' | 'intermediador';
  name: string;
  characterName?: string;
  whatsapp?: string;
  joinedAt: string;
}

export interface IntermediationMessage {
  id: string;
  senderRole: 'vendedor' | 'comprador' | 'intermediador' | 'sistema';
  senderName: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface IntermediationRoom {
  id: string; // WD-INTER-XXXX
  code: string; // Código de 6 a 8 dígitos para a outra pessoa entrar
  createdAt: string;
  gameId: GameId | 'outro';
  customGameName?: string;
  server?: string;
  itemOrCoinsDescription: string;
  agreedValue: string | number;
  status: IntermediationStatus;
  creatorRole: 'vendedor' | 'comprador';
  seller?: IntermediationParticipant;
  buyer?: IntermediationParticipant;
  intermediator: IntermediationParticipant;
  messages: IntermediationMessage[];
  paymentStatus?: 'pendente' | 'retido_seguro' | 'liberado_vendedor';
  deliveryStatus?: 'pendente' | 'conferido';
  feePercentage?: number; // ex: 5% ou taxa fixa
  adminNotes?: string;
}
