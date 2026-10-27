export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WD Coins - Venda de Coins e Itens Gamer</title>
  <meta name="description" content="Site pessoal para venda de coins e itens de Poke Idle World, Mu Idle Lorvath e Priston Tale. Pagamento via PIX e Crypto.">
  
  <!-- Fontes do Google (Design Moderno Gamer) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">

  <style>
    /* ==========================================================================
       WD COINS - ESTILOS CSS PURO (DARK MODE MODERNO COM TONS PASTÉIS SUAVES)
       Você pode alterar cores, textos e produtos diretamente neste arquivo!
       ========================================================================== */
    
    :root {
      /* Paleta de Cores Pasteis Suaves (Sem cores pesadas ou saturadas) */
      --bg-dark: #0e1117;
      --bg-card: #151923;
      --bg-card-hover: #1b212f;
      --bg-modal: #131722;
      
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      
      /* Tons Pastéis Suaves (Roxo / Lavanda, Dourado Champagne, Verde Menta) */
      --pastel-purple: #c4b5fd;
      --pastel-purple-bg: rgba(196, 181, 253, 0.12);
      --pastel-gold: #fde68a;
      --pastel-gold-bg: rgba(253, 230, 138, 0.12);
      --pastel-mint: #a7f3d0;
      --pastel-mint-bg: rgba(167, 243, 208, 0.12);
      
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-focus: rgba(196, 181, 253, 0.35);
      
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
      
      --shadow-soft: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      --transition: all 0.25s ease;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      line-height: 1.6;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, .brand-font {
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.02em;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    button {
      cursor: pointer;
      border: none;
      font-family: inherit;
      transition: var(--transition);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* AVISO DISCRETO NO TOPO */
    .top-notice {
      background: rgba(196, 181, 253, 0.08);
      border-bottom: 1px solid rgba(196, 181, 253, 0.15);
      text-align: center;
      padding: 8px 16px;
      font-size: 13px;
      color: var(--pastel-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* HEADER & NAVBAR */
    header {
      background: rgba(14, 17, 23, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(196, 181, 253, 0.25), rgba(253, 230, 138, 0.25));
      border: 1px solid rgba(196, 181, 253, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--pastel-gold);
      font-weight: 800;
      font-size: 18px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }

    .logo-text span {
      color: var(--pastel-purple);
    }

    .nav-links {
      display: flex;
      gap: 28px;
      list-style: none;
    }

    .nav-links a {
      color: var(--text-muted);
      font-size: 15px;
      font-weight: 500;
      transition: var(--transition);
    }

    .nav-links a:hover, .nav-links a.active {
      color: var(--pastel-purple);
    }

    .nav-cta {
      background: var(--pastel-purple-bg);
      color: var(--pastel-purple);
      border: 1px solid rgba(196, 181, 253, 0.3);
      padding: 9px 18px;
      border-radius: var(--radius-full);
      font-size: 14px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .nav-cta:hover {
      background: rgba(196, 181, 253, 0.2);
      border-color: var(--pastel-purple);
    }

    /* HERO SECTION */
    .hero {
      padding: 60px 0 40px;
      text-align: center;
      position: relative;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--pastel-purple-bg);
      border: 1px solid rgba(196, 181, 253, 0.25);
      border-radius: var(--radius-full);
      color: var(--pastel-purple);
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .hero h1 {
      font-size: 42px;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 16px;
      color: #fff;
    }

    .hero h1 span {
      background: linear-gradient(135deg, var(--pastel-purple), var(--pastel-gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      max-width: 650px;
      margin: 0 auto 30px;
      color: var(--text-muted);
      font-size: 16px;
    }

    .hero-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: linear-gradient(135deg, #a78bfa, #8b5cf6);
      color: #fff;
      padding: 12px 28px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    }

    .btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 12px 26px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 15px;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* DESTAQUE DOS 3 JOGOS */
    .games-section {
      padding: 40px 0 50px;
    }

    .section-title {
      text-align: center;
      margin-bottom: 36px;
    }

    .section-title h2 {
      font-size: 28px;
      color: #fff;
      margin-bottom: 8px;
    }

    .section-title p {
      color: var(--text-muted);
      font-size: 15px;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .game-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      transition: var(--transition);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .game-card:hover {
      border-color: rgba(196, 181, 253, 0.4);
      transform: translateY(-4px);
      box-shadow: var(--shadow-soft);
    }

    .game-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }

    .game-icon-box {
      width: 50px;
      height: 50px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .game-card.poke .game-icon-box {
      background: var(--pastel-mint-bg);
      color: var(--pastel-mint);
      border: 1px solid rgba(167, 243, 208, 0.3);
    }

    .game-card.mu .game-icon-box {
      background: var(--pastel-purple-bg);
      color: var(--pastel-purple);
      border: 1px solid rgba(196, 181, 253, 0.3);
    }

    .game-card.priston .game-icon-box {
      background: var(--pastel-gold-bg);
      color: var(--pastel-gold);
      border: 1px solid rgba(253, 230, 138, 0.3);
    }

    .game-title {
      font-size: 19px;
      font-weight: 700;
      color: #fff;
    }

    .game-card p {
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .game-btn {
      width: 100%;
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .game-btn:hover {
      background: rgba(196, 181, 253, 0.15);
      border-color: var(--pastel-purple);
      color: var(--pastel-purple);
    }

    /* FILTROS E PRODUTOS */
    .products-section {
      padding: 50px 0;
      border-top: 1px solid var(--border-subtle);
    }

    .filter-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 36px;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 9px 20px;
      border-radius: var(--radius-full);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 600;
    }

    .filter-btn.active, .filter-btn:hover {
      background: var(--pastel-purple-bg);
      border-color: rgba(196, 181, 253, 0.4);
      color: var(--pastel-purple);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .product-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: var(--transition);
      position: relative;
    }

    .product-card:hover {
      border-color: rgba(196, 181, 253, 0.35);
      transform: translateY(-3px);
      box-shadow: var(--shadow-soft);
    }

    .prod-tags {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .tag-game {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }

    .tag-poke { background: var(--pastel-mint-bg); color: var(--pastel-mint); border: 1px solid rgba(167, 243, 208, 0.2); }
    .tag-mu { background: var(--pastel-purple-bg); color: var(--pastel-purple); border: 1px solid rgba(196, 181, 253, 0.2); }
    .tag-priston { background: var(--pastel-gold-bg); color: var(--pastel-gold); border: 1px solid rgba(253, 230, 138, 0.2); }

    .tag-badge {
      font-size: 11px;
      background: rgba(253, 230, 138, 0.15);
      color: var(--pastel-gold);
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-weight: 600;
    }

    .prod-name {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .prod-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 16px;
      flex-grow: 1;
    }

    .prod-meta {
      font-size: 12px;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.03);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .prod-footer {
      border-top: 1px solid var(--border-subtle);
      padding-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .price-box {
      display: flex;
      flex-direction: column;
    }

    .price-label {
      font-size: 11px;
      color: var(--text-muted);
    }

    .price-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--pastel-gold);
      font-family: 'Space Grotesk', sans-serif;
    }

    .btn-buy-pix {
      background: linear-gradient(135deg, #059669, #10b981);
      color: #fff;
      padding: 9px 16px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn-buy-pix:hover {
      filter: brightness(1.1);
      transform: scale(1.02);
    }

    /* COMO COMPRAR & FAQ */
    .how-to-buy {
      padding: 60px 0;
      border-top: 1px solid var(--border-subtle);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 50px;
    }

    .step-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      position: relative;
    }

    .step-number {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--pastel-purple-bg);
      border: 1px solid rgba(196, 181, 253, 0.3);
      color: var(--pastel-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 16px;
    }

    .step-card h3 {
      font-size: 17px;
      color: #fff;
      margin-bottom: 8px;
    }

    .step-card p {
      font-size: 13px;
      color: var(--text-muted);
    }

    /* CONTATO */
    .contact-section {
      padding: 60px 0;
      border-top: 1px solid var(--border-subtle);
      text-align: center;
    }

    .contact-box {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      max-width: 600px;
      margin: 0 auto;
      padding: 36px;
    }

    .whatsapp-btn-large {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: #25D366;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: var(--radius-md);
      margin-top: 20px;
      transition: var(--transition);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
    }

    .whatsapp-btn-large:hover {
      background: #20bd5a;
      transform: translateY(-2px);
    }

    /* BOTÃO FLUTUANTE DE WHATSAPP */
    .float-whatsapp {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99;
      background: #25D366;
      color: #fff;
      width: 60px;
      height: 60px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
      transition: var(--transition);
    }

    .float-whatsapp:hover {
      transform: scale(1.08);
      background: #20bd5a;
    }

    .float-whatsapp svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
    }

    /* MODAL DE CHECKOUT (PIX & CRYPTO) */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .modal-overlay.open {
      display: flex;
    }

    .modal-content {
      background: var(--bg-modal);
      border: 1px solid rgba(196, 181, 253, 0.3);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 28px;
      position: relative;
      box-shadow: var(--shadow-soft);
    }

    .modal-close {
      position: absolute;
      top: 18px;
      right: 18px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: var(--text-muted);
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      font-size: 16px;
    }

    .modal-close:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-header {
      margin-bottom: 20px;
    }

    .modal-header h3 {
      font-size: 22px;
      color: #fff;
      margin-bottom: 4px;
    }

    .payment-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.04);
      padding: 4px;
      border-radius: var(--radius-md);
    }

    .pay-tab {
      flex: 1;
      padding: 8px;
      text-align: center;
      background: transparent;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      font-size: 14px;
      font-weight: 600;
    }

    .pay-tab.active {
      background: var(--pastel-purple-bg);
      color: var(--pastel-purple);
      border: 1px solid rgba(196, 181, 253, 0.3);
    }

    .qr-container {
      background: #fff;
      padding: 16px;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .qr-placeholder {
      width: 170px;
      height: 170px;
      background: #f8fafc;
      border: 2px dashed #94a3b8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #475569;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      padding: 10px;
      border-radius: var(--radius-sm);
    }

    .key-box {
      display: flex;
      gap: 8px;
      margin-bottom: 18px;
    }

    .key-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-subtle);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      color: var(--pastel-gold);
      font-size: 13px;
      font-family: monospace;
    }

    .btn-copy {
      background: rgba(196, 181, 253, 0.2);
      color: var(--pastel-purple);
      border: 1px solid rgba(196, 181, 253, 0.3);
      padding: 0 16px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 13px;
    }

    .btn-copy:hover {
      background: var(--pastel-purple);
      color: var(--bg-dark);
    }

    .form-group {
      margin-bottom: 14px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .form-group input, .form-group select {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-subtle);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      color: #fff;
      font-size: 14px;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: var(--pastel-purple);
    }

    .btn-submit-order {
      width: 100%;
      background: #25D366;
      color: #fff;
      padding: 13px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 15px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-submit-order:hover {
      background: #20bd5a;
    }

    footer {
      border-top: 1px solid var(--border-subtle);
      padding: 30px 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }

    /* RESPONSIVIDADE */
    @media (max-width: 768px) {
      .hero h1 { font-size: 30px; }
      .nav-links { display: none; }
    }
  </style>
</head>
<body>

  <!-- AVISO DISCRETO OBRIGATÓRIO -->
  <div class="top-notice">
    <span>🛡️</span> Site pessoal – Entrega manual após confirmação do pagamento via PIX & Crypto
  </div>

  <!-- HEADER -->
  <header>
    <div class="container nav-wrapper">
      <div class="logo-container">
        <div class="logo-icon">WD</div>
        <div class="logo-text">WD <span>Coins</span></div>
      </div>
      <ul class="nav-links">
        <li><a href="#home" class="active">Home</a></li>
        <li><a href="#produtos">Produtos</a></li>
        <li><a href="#como-comprar">Como Comprar</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
      <a href="#produtos" class="nav-cta">Comprar Coins</a>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="hero" id="home">
    <div class="container">
      <div class="badge-pill">✨ Atendimento Pessoal & Rápido</div>
      <h1>Coins e Itens para <span>Jogos Online</span></h1>
      <p>Estoque seguro e entrega ágil para Poke Idle World, Mu Idle Online Lorvath e Priston Tale. Pagamento simplificado via PIX e Criptomoeda.</p>
      <div class="hero-buttons">
        <a href="#produtos" class="btn-primary">Ver Catálogo de Itens</a>
        <a href="#como-comprar" class="btn-secondary">Como Comprar</a>
      </div>
    </div>
  </section>

  <!-- DESTAQUE DOS 3 JOGOS -->
  <section class="games-section">
    <div class="container">
      <div class="section-title">
        <h2>Jogos Disponíveis</h2>
        <p>Selecione seu jogo para filtrar coins e itens exclusivos</p>
      </div>
      <div class="games-grid">
        <!-- Poke Idle World -->
        <div class="game-card poke">
          <div>
            <div class="game-header">
              <div class="game-icon-box">⚡</div>
              <div>
                <div class="game-title">Poke Idle World</div>
                <small style="color: var(--pastel-mint)">Coins & VIP</small>
              </div>
            </div>
            <p>PokeCoins instantâneas para evolução, summons e pacotes de diamantes de treinador.</p>
          </div>
          <button class="game-btn" onclick="filterGame('poke-idle')">Ver Produtos Poke Idle</button>
        </div>

        <!-- Mu Idle Online Lorvath -->
        <div class="game-card mu">
          <div>
            <div class="game-header">
              <div class="game-icon-box">⚔️</div>
              <div>
                <div class="game-title">Mu Idle Online Lorvath</div>
                <small style="color: var(--pastel-purple)">Zen & Joias Raras</small>
              </div>
            </div>
            <p>Zen limpo para resets, packs de Bless, Soul e Chaos para aprimorar seus sets.</p>
          </div>
          <button class="game-btn" onclick="filterGame('mu-idle')">Ver Produtos Mu Lorvath</button>
        </div>

        <!-- Priston Tale -->
        <div class="game-card priston">
          <div>
            <div class="game-header">
              <div class="game-icon-box">🛡️</div>
              <div>
                <div class="game-title">Priston Tale</div>
                <small style="color: var(--pastel-gold)">Gold & P-Coins</small>
              </div>
            </div>
            <p>Gold puro de Ricarten, Sheltons para refino no Morald e poções de XP 100%.</p>
          </div>
          <button class="game-btn" onclick="filterGame('priston-tale')">Ver Produtos Priston Tale</button>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUTOS COM FILTRO -->
  <section class="products-section" id="produtos">
    <div class="container">
      <div class="section-title">
        <h2>Catálogo de Produtos</h2>
        <p>Selecione um produto e clique em "Comprar via PIX" para efetuar o pedido</p>
      </div>

      <!-- Barra de Filtros -->
      <div class="filter-bar">
        <button class="filter-btn active" onclick="filterGame('all', this)">Todos os Jogos</button>
        <button class="filter-btn" onclick="filterGame('poke-idle', this)">Poke Idle World</button>
        <button class="filter-btn" onclick="filterGame('mu-idle', this)">Mu Idle Lorvath</button>
        <button class="filter-btn" onclick="filterGame('priston-tale', this)">Priston Tale</button>
      </div>

      <!-- Grid de Produtos Renderizado Dinamicamente -->
      <div class="products-grid" id="products-grid">
        <!-- Produtos injetados pelo JS abaixo -->
      </div>
    </div>
  </section>

  <!-- COMO COMPRAR -->
  <section class="how-to-buy" id="como-comprar">
    <div class="container">
      <div class="section-title">
        <h2>Como Comprar</h2>
        <p>Passo a passo simples, rápido e seguro</p>
      </div>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Escolha o Produto</h3>
          <p>Selecione a quantia de Coins ou os itens desejados no catálogo acima e clique em Comprar via PIX.</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Pague via PIX ou Crypto</h3>
          <p>Copie a chave PIX ou escaneie o QR Code no seu aplicativo do banco com valor correspondente.</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Envie o Comprovante</h3>
          <p>Clique em "Enviar no WhatsApp". Nosso link já vem preenchido com seu Nick e Servidor para entrega!</p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h3>Receba no Jogo</h3>
          <p>Nós combinamos a entrega (Trade seguro ou Correio in-game) em cerca de 10 a 25 minutos.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTATO -->
  <section class="contact-section" id="contato">
    <div class="container">
      <div class="contact-box">
        <h2>Fale Diretamente Comigo</h2>
        <p style="color: var(--text-muted); margin-top: 8px;">Dúvidas sobre estoque, encomendas personalizadas ou entrega? Atendimento direto pelo WhatsApp!</p>
        <a href="https://wa.me/5511999998888?text=Olá,%20gostaria%20de%20tirar%20uma%20dúvida%20sobre%20os%20itens%20da%20WD%20Coins!" target="_blank" class="whatsapp-btn-large">
          <span>💬</span> Chamar no WhatsApp
        </a>
      </div>
    </div>
  </section>

  <!-- BOTÃO FLUTUANTE DE WHATSAPP -->
  <a href="https://wa.me/5511999998888?text=Olá%20WD%20Coins,%20estou%20no%20site%20e%20gostaria%20de%20comprar!" target="_blank" class="float-whatsapp" title="Falar no WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
  </a>

  <!-- MODAL DE CHECKOUT / PAGAMENTO (PIX & CRYPTO) -->
  <div class="modal-overlay" id="checkout-modal">
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      
      <div class="modal-header">
        <h3 id="modal-product-name">Produto Selecionado</h3>
        <p style="color: var(--pastel-gold); font-size: 18px; font-weight: 700;" id="modal-product-price">R$ 0,00</p>
      </div>

      <!-- Abas de Pagamento -->
      <div class="payment-tabs">
        <button class="pay-tab active" id="tab-pix" onclick="switchPayTab('pix')">PIX (Recomendado)</button>
        <button class="pay-tab" id="tab-crypto" onclick="switchPayTab('crypto')">Cripto (USDT)</button>
      </div>

      <!-- Conteúdo PIX -->
      <div id="content-pix">
        <div class="qr-container">
          <!-- QR Code Simulado com SVG -->
          <svg width="150" height="150" viewBox="0 0 100 100" style="background:#fff;">
            <rect width="100" height="100" fill="#ffffff" />
            <rect x="10" y="10" width="25" height="25" fill="#000" />
            <rect x="15" y="15" width="15" height="15" fill="#fff" />
            <rect x="18" y="18" width="9" height="9" fill="#000" />
            <rect x="65" y="10" width="25" height="25" fill="#000" />
            <rect x="70" y="15" width="15" height="15" fill="#fff" />
            <rect x="73" y="18" width="9" height="9" fill="#000" />
            <rect x="10" y="65" width="25" height="25" fill="#000" />
            <rect x="15" y="70" width="15" height="15" fill="#fff" />
            <rect x="18" y="73" width="9" height="9" fill="#000" />
            <!-- Padrões internos fictícios -->
            <rect x="42" y="15" width="8" height="8" fill="#000" />
            <rect x="42" y="35" width="16" height="8" fill="#000" />
            <rect x="45" y="65" width="12" height="12" fill="#000" />
            <rect x="65" y="45" width="15" height="8" fill="#000" />
            <rect x="70" y="65" width="20" height="20" fill="#000" />
          </svg>
          <span style="color:#059669; font-size:12px; font-weight:700; margin-top:8px;">Chave PIX Oficial</span>
        </div>

        <div class="form-group">
          <label>Chave PIX (E-mail):</label>
          <div class="key-box">
            <input type="text" id="pix-key-val" class="key-input" value="pix.wdcoins@gmail.com" readonly>
            <button class="btn-copy" onclick="copyPixKey()">Copiar</button>
          </div>
        </div>
      </div>

      <!-- Conteúdo Crypto -->
      <div id="content-crypto" style="display: none;">
        <div class="form-group">
          <label>Carteira USDT (Rede BEP-20 / Binance Smart Chain):</label>
          <div class="key-box">
            <input type="text" id="crypto-key-val" class="key-input" value="0x71C8F79B25e5b3260c6d59C1B2677C064e4b52Ef" readonly>
            <button class="btn-copy" onclick="copyCryptoKey()">Copiar</button>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">Envie o valor correspondente em USDT. Mande a Hash da transação ou print no WhatsApp.</p>
      </div>

      <!-- Dados do Jogador para Entrega -->
      <div class="form-group">
        <label>Seu Nickname no Jogo:</label>
        <input type="text" id="player-nick" placeholder="Ex: GuerreiroX ou TrainerAsh">
      </div>

      <div class="form-group">
        <label>Servidor / Realm:</label>
        <input type="text" id="player-server" placeholder="Ex: Lorvath S1, Kanto Global ou Awell">
      </div>

      <button class="btn-submit-order" onclick="sendReceiptToWhatsApp()">
        <span>📲</span> Enviar Comprovante no WhatsApp
      </button>

      <p style="font-size: 11px; text-align: center; color: var(--text-muted); margin-top: 12px;">
        Ao clicar, o WhatsApp abrirá com o resumo do seu pedido preenchido automaticamente.
      </p>
    </div>
  </div>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <p>WD Coins &copy; 2026 - Loja Pessoal de Coins e Itens Gamer.</p>
      <p style="margin-top: 4px; font-size: 12px;">Não possuímos afiliação com as empresas proprietárias dos jogos. Todas as marcas pertencem aos seus respectivos donos.</p>
    </div>
  </footer>

  <!-- ==========================================================================
       JAVASCRIPT PURO (LÓGICA DO SITE, CATÁLOGO E CHECKOUT WHATSAPP)
       ========================================================================== -->
  <script>
    // CONFIGURAÇÕES DA LOJA (Edite aqui para personalizar)
    const STORE_CONFIG = {
      whatsapp: '5511999998888', // Coloque seu DDD + Número aqui (Ex: 5511999998888)
      pixKey: 'pix.wdcoins@gmail.com',
      usdtWallet: '0x71C8F79B25e5b3260c6d59C1B2677C064e4b52Ef'
    };

    // CATÁLOGO DE PRODUTOS FICTÍCIOS
    const PRODUCTS = [
      // Poke Idle World
      { id: 'p1', gameId: 'poke-idle', gameName: 'Poke Idle World', name: '500.000 PokeCoins', price: 15.00, desc: 'Pacote inicial ideal para compras básicas e summons.', badge: 'Iniciante' },
      { id: 'p2', gameId: 'poke-idle', gameName: 'Poke Idle World', name: '2.500.000 PokeCoins + Bônus', price: 39.90, desc: 'Melhor custo-benefício com bônus de 200k coins.', badge: 'Mais Vendido' },
      { id: 'p3', gameId: 'poke-idle', gameName: 'Poke Idle World', name: '1.000 Diamantes VIP', price: 45.00, desc: 'Moeda premium para eventos e passes especiais.', badge: 'VIP' },
      { id: 'p4', gameId: 'poke-idle', gameName: 'Poke Idle World', name: 'Kit Pedras de Evolução (5x)', price: 28.00, desc: 'Pedras elementais raras para evoluções avançadas.', badge: 'Itens' },
      
      // Mu Idle Online Lorvath
      { id: 'm1', gameId: 'mu-idle', gameName: 'Mu Idle Lorvath', name: '100kk Zen Puro', price: 18.00, desc: 'Zen limpo para resets e taxas da Chaos Machine.', badge: 'Coins' },
      { id: 'm2', gameId: 'mu-idle', gameName: 'Mu Idle Lorvath', name: '500kk Zen + Bônus', price: 49.90, desc: 'Pacote de meio bilhão para players hardcore.', badge: 'Top Escolha' },
      { id: 'm3', gameId: 'mu-idle', gameName: 'Mu Idle Lorvath', name: 'Pack 30x Bless + 30x Soul', price: 35.00, desc: '60 joias de refino para subir seus itens ao +9.', badge: 'Joias' },
      { id: 'm4', gameId: 'mu-idle', gameName: 'Mu Idle Lorvath', name: 'Asa Level 3 (+11 Defesa)', price: 120.00, desc: 'Item lendário para combate PvP e caça de Bosses.', badge: 'Raro' },

      // Priston Tale
      { id: 'pt1', gameId: 'priston-tale', gameName: 'Priston Tale', name: '50kk Gold Priston', price: 19.90, desc: 'Gold para consertos, poções e compras com players.', badge: 'Coins' },
      { id: 'pt2', gameId: 'priston-tale', gameName: 'Priston Tale', name: '200kk Gold Priston', price: 64.90, desc: 'Estoque limpo farmado legitimamente.', badge: 'Mais Vendido' },
      { id: 'pt3', gameId: 'priston-tale', gameName: 'Priston Tale', name: 'Pack 100 Priston Coins', price: 40.00, desc: 'P-Coins para loja oficial e itens premium.', badge: 'P-Coins' },
      { id: 'pt4', gameId: 'priston-tale', gameName: 'Priston Tale', name: 'Kit Sheltons de Refino (10x)', price: 45.00, desc: 'Transparo, Enigma e Bellum para refino de armas.', badge: 'Itens' }
    ];

    let currentSelectedProduct = null;

    // RENDERIZAR PRODUTOS
    function renderProducts(filter = 'all') {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = '';

      const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.gameId === filter);

      filtered.forEach(prod => {
        let tagClass = 'tag-poke';
        if (prod.gameId === 'mu-idle') tagClass = 'tag-mu';
        if (prod.gameId === 'priston-tale') tagClass = 'tag-priston';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = \`
          <div>
            <div class="prod-tags">
              <span class="tag-game \${tagClass}">\${prod.gameName}</span>
              \${prod.badge ? \`<span class="tag-badge">\${prod.badge}</span>\` : ''}
            </div>
            <div class="prod-name">\${prod.name}</div>
            <div class="prod-desc">\${prod.desc}</div>
            <div class="prod-meta">⚡ Entrega manual em 10-25 min</div>
          </div>
          <div class="prod-footer">
            <div class="price-box">
              <span class="price-label">Preço à vista</span>
              <span class="price-value">R$ \${prod.price.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="btn-buy-pix" onclick="openCheckout('\${prod.id}')">
              <span>💳</span> Comprar via PIX
            </button>
          </div>
        \`;
        grid.appendChild(card);
      });
    }

    // FILTRO DE JOGOS
    function filterGame(gameId, buttonElement) {
      if (buttonElement) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        buttonElement.classList.add('active');
      }
      renderProducts(gameId);
      const target = document.getElementById('produtos');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }

    // ABRIR MODAL DE CHECKOUT
    function openCheckout(productId) {
      const prod = PRODUCTS.find(p => p.id === productId);
      if (!prod) return;

      currentSelectedProduct = prod;
      document.getElementById('modal-product-name').innerText = prod.name + ' (' + prod.gameName + ')';
      document.getElementById('modal-product-price').innerText = 'R$ ' + prod.price.toFixed(2).replace('.', ',');
      document.getElementById('checkout-modal').classList.add('open');
    }

    function closeModal() {
      document.getElementById('checkout-modal').classList.remove('open');
    }

    // ALTERNAR ABAS PIX / CRYPTO
    function switchPayTab(type) {
      const tabPix = document.getElementById('tab-pix');
      const tabCrypto = document.getElementById('tab-crypto');
      const contentPix = document.getElementById('content-pix');
      const contentCrypto = document.getElementById('content-crypto');

      if (type === 'pix') {
        tabPix.classList.add('active');
        tabCrypto.classList.remove('active');
        contentPix.style.display = 'block';
        contentCrypto.style.display = 'none';
      } else {
        tabCrypto.classList.add('active');
        tabPix.classList.remove('active');
        contentCrypto.style.display = 'block';
        contentPix.style.display = 'none';
      }
    }

    // COPIAR CHAVE PIX
    function copyPixKey() {
      const input = document.getElementById('pix-key-val');
      input.select();
      navigator.clipboard.writeText(input.value);
      alert('Chave PIX copiada com sucesso!');
    }

    // COPIAR CARTEIRA CRYPTO
    function copyCryptoKey() {
      const input = document.getElementById('crypto-key-val');
      input.select();
      navigator.clipboard.writeText(input.value);
      alert('Carteira USDT copiada com sucesso!');
    }

    // ENVIAR COMPROVANTE VIA WHATSAPP COM OS DADOS PREENCHIDOS
    function sendReceiptToWhatsApp() {
      if (!currentSelectedProduct) return;

      const nick = document.getElementById('player-nick').value.trim() || 'Não informado';
      const server = document.getElementById('player-server').value.trim() || 'Padrão';
      const orderCode = 'WD-' + Math.floor(1000 + Math.random() * 9000);

      const msg = \`*NOVO PEDIDO - WD COINS* 🎮\\n\\n\` +
        \`*Código do Pedido:* #\${orderCode}\\n\` +
        \`*Jogo:* \${currentSelectedProduct.gameName}\\n\` +
        \`*Produto:* \${currentSelectedProduct.name}\\n\` +
        \`*Valor:* R$ \${currentSelectedProduct.price.toFixed(2).replace('.', ',')}\\n\` +
        \`*Meu Nick no Jogo:* \${nick}\\n\` +
        \`*Servidor:* \${server}\\n\\n\` +
        \`Acabei de efetuar o pagamento e estou enviando o comprovante em anexo!\`;

      const whatsappUrl = \`https://wa.me/\${STORE_CONFIG.whatsapp}?text=\${encodeURIComponent(msg)}\`;
      window.open(whatsappUrl, '_blank');
    }

    // INICIALIZAR SITE
    document.addEventListener('DOMContentLoaded', () => {
      renderProducts('all');
    });
  </script>
</body>
</html>
`;
