import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CustomOrder, 
  PurchaseOrder, 
  UserProfile, 
  StoreConfig,
  IntermediationRoom,
  IntermediationParticipant,
  IntermediationMessage,
  IntermediationStatus,
  GameId
} from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, STORE_CONFIG as INITIAL_STORE_CONFIG } from '../data/storeData';

export interface AdminLoginResult {
  success: boolean;
  error?: string;
  isLocked?: boolean;
  attemptsRemaining?: number;
  remainingMinutes?: number;
}

interface StoreContextType {
  // Store Config (Editable in Admin: WhatsApp, PIX, etc.)
  storeConfig: StoreConfig;
  updateStoreConfig: (updates: Partial<StoreConfig>) => void;
  resetStoreConfigToDefault: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  resetProductsToDefault: () => void;

  // Custom Orders (Encomendas)
  customOrders: CustomOrder[];
  addCustomOrder: (order: Omit<CustomOrder, 'id' | 'createdAt' | 'status'>) => CustomOrder;
  updateCustomOrderStatus: (id: string, status: CustomOrder['status'], adminNotes?: string) => void;
  deleteCustomOrder: (id: string) => void;

  // Purchases
  purchases: PurchaseOrder[];
  addPurchase: (purchase: Omit<PurchaseOrder, 'id' | 'createdAt' | 'status'>) => PurchaseOrder;
  updatePurchaseStatus: (id: string, status: PurchaseOrder['status']) => void;
  deletePurchase: (id: string) => void;

  // User Profile
  userProfile: UserProfile | null;
  saveUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;

  // Admin Auth (Server-Backed & Brute-Force Protected)
  isAdminLoggedIn: boolean;
  loginAdmin: (pin: string) => Promise<AdminLoginResult>;
  logoutAdmin: () => Promise<void>;
  changeAdminPin: (newPin: string) => Promise<{ success: boolean; error?: string; message?: string }>;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Intermediações (Escrow / Middleman)
  intermediations: IntermediationRoom[];
  createIntermediation: (data: {
    gameId: GameId | 'outro';
    customGameName?: string;
    server?: string;
    itemOrCoinsDescription: string;
    agreedValue: string | number;
    creatorRole: 'vendedor' | 'comprador';
    participantData: {
      name: string;
      characterName?: string;
      whatsapp: string;
    };
  }) => IntermediationRoom;
  joinIntermediation: (
    code: string,
    participantData: {
      name: string;
      characterName?: string;
      whatsapp: string;
    }
  ) => { success: boolean; room?: IntermediationRoom; error?: string };
  sendIntermediationMessage: (
    roomId: string,
    message: {
      senderRole: 'vendedor' | 'comprador' | 'intermediador' | 'sistema';
      senderName: string;
      text: string;
      isOfficial?: boolean;
    }
  ) => void;
  updateIntermediationStatus: (
    roomId: string,
    status: IntermediationStatus,
    adminNotes?: string
  ) => void;
  getIntermediationByCode: (code: string) => IntermediationRoom | undefined;

  // Demand & Catalog Visibility Control ("só vai aparecer o que eu cadastrar se tiver demanda")
  onlyShowRegisteredDemand: boolean;
  setOnlyShowRegisteredDemand: (val: boolean) => void;
  toggleProductDemand: (id: string) => void;
  clearAllProducts: () => void;

  // Global Search State for Customers
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SAMPLE_ORDERS: CustomOrder[] = [
  {
    id: 'ENC-9281',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: 'RedMaster99',
    customerWhatsApp: '5511988887777',
    gameId: 'poke-idle',
    customGameName: 'Poke Idle World',
    server: 'Único / Poke Idle World',
    characterName: 'RedMaster99',
    orderType: 'item',
    serviceType: 'encomenda_pokemon',
    pokemonName: 'Charizard',
    pokemonIv: '180 IV',
    details: '[Poke Idle World - Encomenda Pokémon] Pokémon: Charizard | IV: 180 IV',
    budget: 'Sob Cotação',
    status: 'pendente',
    adminNotes: 'Aguardando avaliação do administrador.',
  },
  {
    id: 'ENC-8420',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    customerName: 'PokeKing_BR',
    customerWhatsApp: '5521977776666',
    gameId: 'poke-idle',
    customGameName: 'Poke Idle World',
    server: 'Único / Poke Idle World',
    characterName: 'PokeKing_BR',
    orderType: 'coins',
    serviceType: 'diamantes',
    quantity: '50.000',
    paymentMethod: 'pix',
    details: '[Poke Idle World - Diamantes] Quantidade: 50.000 Diamantes | Valor oferecido: R$ 45,00 | Pagamento: PIX',
    budget: 'R$ 45,00',
    status: 'pendente',
    adminNotes: 'Cliente aguardando contato via WhatsApp.',
  },
  {
    id: 'ENC-7142',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    customerName: 'AshKetchum01',
    customerWhatsApp: '5531988883333',
    gameId: 'poke-idle',
    customGameName: 'Poke Idle World',
    server: 'Único / Poke Idle World',
    characterName: 'AshKetchum01',
    orderType: 'coins',
    serviceType: 'dollar',
    quantity: '200',
    paymentMethod: 'crypto',
    details: '[Poke Idle World - Dollar] Quantidade: 200 Dollar | Valor oferecido: R$ 80,00 | Pagamento: CRYPTO',
    budget: 'R$ 80,00',
    status: 'aceito',
    adminNotes: 'Pedido aceito pelo administrador. Em andamento.',
  }
];

const SAMPLE_INTERMEDIATIONS: IntermediationRoom[] = [
  {
    id: 'WD-INTER-7842',
    code: 'WD-7842',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    gameId: 'aion-2',
    customGameName: 'Aion 2',
    server: 'Servidor Global',
    itemOrCoinsDescription: '250.000.000 Kinah (250KK)',
    agreedValue: '280,00',
    status: 'pagamento_retido',
    creatorRole: 'vendedor',
    seller: {
      role: 'vendedor',
      name: 'Leonardo (Vendedor)',
      characterName: 'LeoAion99',
      whatsapp: '5511998887711',
      joinedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    buyer: {
      role: 'comprador',
      name: 'Gabriel (Comprador)',
      characterName: 'GabsHunter',
      whatsapp: '5521997772233',
      joinedAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
    },
    intermediator: {
      role: 'intermediador',
      name: 'Intermediador Oficial WD Coins',
      characterName: 'Staff_WDCoins',
      whatsapp: '5511999998888',
      joinedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    paymentStatus: 'retido_seguro',
    deliveryStatus: 'pendente',
    feePercentage: 5,
    messages: [
      {
        id: 'msg-1',
        senderRole: 'sistema',
        senderName: 'Sistema WD Coins',
        text: 'Intermediação oficial iniciada. Código de acesso: WD-7842. Ambas as partes estão sob proteção da WD Coins.',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        isOfficial: true,
      },
      {
        id: 'msg-2',
        senderRole: 'vendedor',
        senderName: 'Leonardo (Vendedor)',
        text: 'Boa tarde! Já estou com os 250KK Kinah prontos no char LeoAion99 no Servidor Global.',
        timestamp: new Date(Date.now() - 3600000 * 3.7).toISOString(),
      },
      {
        id: 'msg-3',
        senderRole: 'comprador',
        senderName: 'Gabriel (Comprador)',
        text: 'Olá! Enviei o comprovante do PIX de R$ 280,00 no WhatsApp da WD Coins.',
        timestamp: new Date(Date.now() - 3600000 * 3.4).toISOString(),
      },
      {
        id: 'msg-4',
        senderRole: 'intermediador',
        senderName: 'Intermediador Oficial WD Coins',
        text: '✅ Pagamento de R$ 280,00 verificado e RETIDO EM SEGURANÇA pela WD Coins. Vendedor Leonardo, pode entregar o Kinah para o personagem GabsHunter via Trade no jogo. Não se esqueça de tirar print da confirmação!',
        timestamp: new Date(Date.now() - 3600000 * 3.2).toISOString(),
        isOfficial: true,
      },
    ],
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Config (WhatsApp, PIX, Owner, etc.)
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('wd_store_config');
      if (saved) {
        return { ...INITIAL_STORE_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return INITIAL_STORE_CONFIG;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const CATALOG_KEY_VERSION = 'v7_sellers_by_game';
    try {
      const savedVersion = localStorage.getItem('wd_catalog_ver');
      const savedRaw = localStorage.getItem('wd_store_products');
      if (savedVersion === CATALOG_KEY_VERSION && savedRaw) {
        return JSON.parse(savedRaw);
      }
      localStorage.setItem('wd_catalog_ver', CATALOG_KEY_VERSION);
      const customSaved: Product[] = savedRaw
        ? (JSON.parse(savedRaw) as Product[]).filter((p) => p.id.startsWith('wd-custom-'))
        : [];
      return [
        ...customSaved,
        ...INITIAL_PRODUCTS.map((p) => ({
          ...p,
          inStock: true,
        })),
      ];
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS.map((p) => ({
      ...p,
      inStock: true,
    }));
  });

  // Custom Orders
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(() => {
    try {
      const saved = localStorage.getItem('wd_custom_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return SAMPLE_ORDERS;
  });

  // Purchases
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem('wd_purchases');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('wd_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wd_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Global Customer Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Auth State (Verified via server session token)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!sessionStorage.getItem('wd_admin_token');
  });

  // Check token validity with server on mount
  useEffect(() => {
    const token = sessionStorage.getItem('wd_admin_token');
    if (token) {
      fetch('/api/admin/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.valid) {
            sessionStorage.removeItem('wd_admin_token');
            setIsAdminLoggedIn(false);
          }
        })
        .catch(() => {
          // If server call fails temporarily, keep current state
        });
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wd_store_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('wd_custom_orders', JSON.stringify(customOrders));
    } catch {}
  }, [customOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('wd_purchases', JSON.stringify(purchases));
    } catch {}
  }, [purchases]);

  useEffect(() => {
    try {
      localStorage.setItem('wd_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('wd_user_profile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('wd_user_profile');
      }
    } catch {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('wd_store_config', JSON.stringify(storeConfig));
    } catch {}
  }, [storeConfig]);

  const updateStoreConfig = (updates: Partial<StoreConfig>) => {
    setStoreConfig(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const resetStoreConfigToDefault = () => {
    setStoreConfig(INITIAL_STORE_CONFIG);
  };

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newId = `wd-custom-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
      inStock: productData.inStock ?? true,
      hasDemand: productData.hasDemand ?? true,
      isRegisteredByAdmin: productData.isRegisteredByAdmin ?? true,
      sellerName: productData.sellerName?.trim() || 'WD Coins Oficial',
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const currentStock = p.inStock !== false;
          return {
            ...p,
            inStock: !currentStock,
            stockStatus: !currentStock ? 'disponivel' : 'sob_encomenda',
          };
        }
        return p;
      })
    );
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const resetProductsToDefault = () => {
    setProducts(
      INITIAL_PRODUCTS.map(p => ({
        ...p,
        inStock: true,
      }))
    );
  };

  // Custom Orders actions
  const addCustomOrder = (orderData: Omit<CustomOrder, 'id' | 'createdAt' | 'status'>): CustomOrder => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newOrder: CustomOrder = {
      ...orderData,
      id: `ENC-${randomDigits}`,
      createdAt: new Date().toISOString(),
      status: 'pendente',
    };
    setCustomOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateCustomOrderStatus = (id: string, status: CustomOrder['status'], adminNotes?: string) => {
    setCustomOrders(prev =>
      prev.map(order =>
        order.id === id
          ? {
              ...order,
              status,
              adminNotes: adminNotes !== undefined ? adminNotes : order.adminNotes,
            }
          : order
      )
    );
  };

  const deleteCustomOrder = (id: string) => {
    setCustomOrders(prev => prev.filter(o => o.id !== id));
  };

  // Purchases actions
  const addPurchase = (purchaseData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'status'>): PurchaseOrder => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newPurchase: PurchaseOrder = {
      ...purchaseData,
      id: `PED-${randomDigits}`,
      createdAt: new Date().toISOString(),
      status: 'aguardando_comprovante',
    };
    setPurchases(prev => [newPurchase, ...prev]);
    return newPurchase;
  };

  const updatePurchaseStatus = (id: string, status: PurchaseOrder['status']) => {
    setPurchases(prev =>
      prev.map(purchase =>
        purchase.id === id ? { ...purchase, status } : purchase
      )
    );
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  // User Profile actions
  const saveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const clearUserProfile = () => {
    setUserProfile(null);
  };

  // Admin Auth actions (Server-side secured)
  const loginAdmin = async (pin: string): Promise<AdminLoginResult> => {
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('wd_admin_token', data.token);
        setIsAdminLoggedIn(true);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || 'PIN incorreto',
          isLocked: data.isLocked || false,
          attemptsRemaining: data.attemptsRemaining,
          remainingMinutes: data.remainingMinutes,
        };
      }
    } catch {
      // Offline / fallback protection
      return {
        success: false,
        error: 'Erro de conexão com o servidor seguro. Tente novamente.',
      };
    }
  };

  const logoutAdmin = async () => {
    const token = sessionStorage.getItem('wd_admin_token');
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch {}
    }
    sessionStorage.removeItem('wd_admin_token');
    setIsAdminLoggedIn(false);
  };

  const changeAdminPin = async (newPin: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    const token = sessionStorage.getItem('wd_admin_token');
    if (!token) {
      return { success: false, error: 'Sessão administrativa não autenticada.' };
    }

    try {
      const res = await fetch('/api/admin/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Erro ao alterar PIN' };
      }
    } catch {
      return { success: false, error: 'Erro de conexão ao salvar novo PIN.' };
    }
  };

  // Intermediações State
  const [intermediations, setIntermediations] = useState<IntermediationRoom[]>(() => {
    try {
      const saved = localStorage.getItem('wd_intermediations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return SAMPLE_INTERMEDIATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('wd_intermediations', JSON.stringify(intermediations));
    } catch {}
  }, [intermediations]);

  // Catalog Demand visibility setting ("só vai aparecer se tiver demanda / só o que eu cadastrar")
  const [onlyShowRegisteredDemand, setOnlyShowRegisteredDemand] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wd_only_registered_demand');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wd_only_registered_demand', String(onlyShowRegisteredDemand));
    } catch {}
  }, [onlyShowRegisteredDemand]);

  const createIntermediation = (data: {
    gameId: GameId | 'outro';
    customGameName?: string;
    server?: string;
    itemOrCoinsDescription: string;
    agreedValue: string | number;
    creatorRole: 'vendedor' | 'comprador';
    participantData: {
      name: string;
      characterName?: string;
      whatsapp: string;
    };
  }): IntermediationRoom => {
    const randomCode = `WD-${Math.floor(1000 + Math.random() * 9000)}`;
    const roomId = `WD-INTER-${Math.floor(1000 + Math.random() * 9000)}`;

    const newParticipant: IntermediationParticipant = {
      role: data.creatorRole,
      name: data.participantData.name.trim(),
      characterName: data.participantData.characterName?.trim(),
      whatsapp: data.participantData.whatsapp.trim(),
      joinedAt: new Date().toISOString(),
    };

    const intermediator: IntermediationParticipant = {
      role: 'intermediador',
      name: 'Intermediador Oficial WD Coins',
      characterName: 'Staff_WDCoins',
      whatsapp: storeConfig.whatsappNumber,
      joinedAt: new Date().toISOString(),
    };

    const newRoom: IntermediationRoom = {
      id: roomId,
      code: randomCode,
      createdAt: new Date().toISOString(),
      gameId: data.gameId,
      customGameName: data.customGameName,
      server: data.server || 'Servidor Principal',
      itemOrCoinsDescription: data.itemOrCoinsDescription,
      agreedValue: data.agreedValue,
      status: 'aguardando_participante',
      creatorRole: data.creatorRole,
      seller: data.creatorRole === 'vendedor' ? newParticipant : undefined,
      buyer: data.creatorRole === 'comprador' ? newParticipant : undefined,
      intermediator,
      paymentStatus: 'pendente',
      deliveryStatus: 'pendente',
      feePercentage: 5,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          senderRole: 'sistema',
          senderName: 'Sistema WD Coins',
          text: `Sala de intermediação criada com sucesso! Código de acesso: ${randomCode}. Compartilhe este código com a outra parte da negociação para entrar no chat.`,
          timestamp: new Date().toISOString(),
          isOfficial: true,
        },
        {
          id: `msg-${Date.now()}-2`,
          senderRole: 'intermediador',
          senderName: 'Intermediador Oficial WD Coins',
          text: `Olá! Eu serei o intermediador oficial desta negociação. Aguardando o ${data.creatorRole === 'vendedor' ? 'Comprador' : 'Vendedor'} entrar com o código ${randomCode}. Lembrete de segurança: NUNCA entregue o item nem pague fora desta sala oficial.`,
          timestamp: new Date().toISOString(),
          isOfficial: true,
        },
      ],
    };

    setIntermediations(prev => [newRoom, ...prev]);
    return newRoom;
  };

  const joinIntermediation = (
    code: string,
    participantData: {
      name: string;
      characterName?: string;
      whatsapp: string;
    }
  ): { success: boolean; room?: IntermediationRoom; error?: string } => {
    const cleanCode = code.trim().toUpperCase();
    const room = intermediations.find(r => r.code.toUpperCase() === cleanCode || r.id.toUpperCase() === cleanCode);
    if (!room) {
      return { success: false, error: 'Nenhuma sala de intermediação encontrada com este código.' };
    }

    const assignedRole: 'vendedor' | 'comprador' = room.creatorRole === 'vendedor' ? 'comprador' : 'vendedor';

    const newParticipant: IntermediationParticipant = {
      role: assignedRole,
      name: participantData.name.trim(),
      characterName: participantData.characterName?.trim(),
      whatsapp: participantData.whatsapp.trim(),
      joinedAt: new Date().toISOString(),
    };

    const updatedRoom: IntermediationRoom = {
      ...room,
      seller: assignedRole === 'vendedor' ? newParticipant : room.seller,
      buyer: assignedRole === 'comprador' ? newParticipant : room.buyer,
      status: room.status === 'aguardando_participante' ? 'em_negociacao' : room.status,
      messages: [
        ...room.messages,
        {
          id: `msg-${Date.now()}`,
          senderRole: 'sistema',
          senderName: 'Sistema WD Coins',
          text: `${participantData.name.trim()} (${assignedRole === 'vendedor' ? 'Vendedor' : 'Comprador'} - Nick: ${participantData.characterName || 'N/A'}) entrou na sala de intermediação.`,
          timestamp: new Date().toISOString(),
          isOfficial: true,
        },
      ],
    };

    setIntermediations(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    return { success: true, room: updatedRoom };
  };

  const sendIntermediationMessage = (
    roomId: string,
    message: {
      senderRole: 'vendedor' | 'comprador' | 'intermediador' | 'sistema';
      senderName: string;
      text: string;
      isOfficial?: boolean;
    }
  ) => {
    setIntermediations(prev =>
      prev.map(room => {
        if (room.id === roomId || room.code === roomId) {
          const newMsg: IntermediationMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            senderRole: message.senderRole,
            senderName: message.senderName,
            text: message.text,
            timestamp: new Date().toISOString(),
            isOfficial: message.isOfficial || message.senderRole === 'intermediador',
          };
          return {
            ...room,
            messages: [...room.messages, newMsg],
          };
        }
        return room;
      })
    );
  };

  const updateIntermediationStatus = (
    roomId: string,
    status: IntermediationStatus,
    adminNotes?: string
  ) => {
    setIntermediations(prev =>
      prev.map(room => {
        if (room.id === roomId || room.code === roomId) {
          let systemText = `Status atualizado: ${status.replace('_', ' ').toUpperCase()}`;
          if (status === 'pagamento_retido') {
            systemText = '💰 PAGAMENTO CONFIRMADO E RETIDO EM SEGURANÇA pela WD Coins. O Vendedor já pode realizar a entrega do item/moedas in-game com segurança.';
          } else if (status === 'entrega_andamento') {
            systemText = '📦 Entrega in-game em andamento. Comprador, por favor confirme no chat assim que receber.';
          } else if (status === 'concluido') {
            systemText = '🎉 NEGOCIAÇÃO CONCLUÍDA COM SUCESSO! Entrega confirmada e valor transferido ao Vendedor pela WD Coins.';
          } else if (status === 'cancelado') {
            systemText = '❌ Intermediação cancelada. Se houver valores retidos pela WD Coins, serão estornados integralmente.';
          }

          const statusMsg: IntermediationMessage = {
            id: `msg-${Date.now()}`,
            senderRole: 'sistema',
            senderName: 'Sistema WD Coins',
            text: systemText,
            timestamp: new Date().toISOString(),
            isOfficial: true,
          };

          return {
            ...room,
            status,
            paymentStatus: status === 'pagamento_retido' ? 'retido_seguro' : status === 'concluido' ? 'liberado_vendedor' : room.paymentStatus,
            deliveryStatus: status === 'concluido' ? 'conferido' : room.deliveryStatus,
            adminNotes: adminNotes !== undefined ? adminNotes : room.adminNotes,
            messages: [...room.messages, statusMsg],
          };
        }
        return room;
      })
    );
  };

  const getIntermediationByCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    return intermediations.find(r => r.code.toUpperCase() === clean || r.id.toUpperCase() === clean);
  };

  const toggleProductDemand = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const curDemand = p.hasDemand !== false;
          return {
            ...p,
            hasDemand: !curDemand,
          };
        }
        return p;
      })
    );
  };

  const clearAllProducts = () => {
    setProducts([]);
  };

  return (
    <StoreContext.Provider
      value={{
        storeConfig,
        updateStoreConfig,
        resetStoreConfigToDefault,
        products,
        addProduct,
        deleteProduct,
        toggleStock,
        updateProduct,
        resetProductsToDefault,
        customOrders,
        addCustomOrder,
        updateCustomOrderStatus,
        deleteCustomOrder,
        purchases,
        addPurchase,
        updatePurchaseStatus,
        deletePurchase,
        userProfile,
        saveUserProfile,
        clearUserProfile,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        favorites,
        toggleFavorite,
        isFavorite,
        intermediations,
        createIntermediation,
        joinIntermediation,
        sendIntermediationMessage,
        updateIntermediationStatus,
        getIntermediationByCode,
        onlyShowRegisteredDemand,
        setOnlyShowRegisteredDemand,
        toggleProductDemand,
        clearAllProducts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
