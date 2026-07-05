const INDEX_HTML = `<!-- Force Cheng 2026/7/3 -->
<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>天勳 x Force Cheng LINE AI 資訊管理系統 | 雙版本提案首頁</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Noto+Sans+TC:wght@300;400;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --primary-color: #0f766e;
      --primary-hover: #0d9488;
      --secondary-color: #0d9488;
      --dark-bg: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.7);
      --border-color: rgba(255, 255, 255, 0.08);
      --text-muted: #94a3b8;
    }

    body {
      background-color: var(--dark-bg);
      color: #f8fafc;
      font-family: 'Outfit', 'Noto Sans TC', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(at 0% 0%, rgba(15, 118, 110, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(13, 148, 136, 0.15) 0px, transparent 50%);
    }

    /* Glassmorphism Navigation */
    .navbar {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
    }

    /* Hero Section */
    .hero-section {
      padding: 80px 0 40px;
      text-align: center;
    }

    .hero-badge {
      background: rgba(15, 118, 110, 0.2);
      border: 1px solid rgba(15, 118, 110, 0.4);
      color: #2dd4bf;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }

    h1 {
      font-size: 2.8rem;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--text-muted);
      max-width: 700px;
      margin: 0 auto 40px;
    }

    /* Version Cards */
    .pricing-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 40px;
      height: 100%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .pricing-card:hover {
      transform: translateY(-8px);
      border-color: rgba(15, 118, 110, 0.4);
      box-shadow: 0 20px 40px -15px rgba(15, 118, 110, 0.2);
    }

    .pricing-card.featured {
      border-color: rgba(13, 148, 136, 0.5);
      background: rgba(30, 41, 59, 0.85);
    }

    .pricing-card.featured::before {
      content: '🌟 智慧推薦';
      position: absolute;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #0d9488, #0f766e);
      color: white;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 50px;
    }

    .tier-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .price-tag {
      font-size: 36px;
      font-weight: 800;
      color: #ffffff;
      margin: 16px 0;
    }

    .price-period {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 24px 0;
      flex-grow: 1;
    }

    .features-list li {
      margin-bottom: 12px;
      font-size: 14px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      color: #e2e8f0;
    }

    .features-list li i {
      color: #14b8a6;
      margin-top: 2px;
    }

    .features-list li.locked {
      color: #64748b;
    }

    .features-list li.locked i {
      color: #64748b;
    }

    .btn-action {
      border-radius: 12px;
      padding: 12px 24px;
      font-weight: 600;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
    }

    .btn-outline-custom {
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.03);
    }

    .btn-outline-custom:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
    }

    .btn-solid-custom {
      background: linear-gradient(135deg, #0d9488, #0f766e);
      color: white;
      border: none;
    }

    .btn-solid-custom:hover {
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      box-shadow: 0 0 20px rgba(13, 148, 136, 0.4);
      color: white;
    }

    /* Comparison Table */
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 30px;
      margin: 60px 0;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }

    .table {
      margin-bottom: 0;
      color: #f8fafc !important;
      background-color: transparent !important;
    }

    .table th {
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      font-weight: 700;
      font-size: 16px;
      padding: 16px;
      color: #ffffff !important;
      background-color: transparent !important;
    }

    .table th.text-success {
      color: #2dd4bf !important;
    }
    .table th.text-info {
      color: #38bdf8 !important;
    }

    .table td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 16px;
      font-size: 14px;
      vertical-align: middle;
      color: #e2e8f0 !important;
      background-color: transparent !important;
    }

    .table td strong {
      color: #ffffff !important;
    }

    .table tr:hover td {
      background-color: rgba(13, 148, 136, 0.08) !important;
      color: #ffffff !important;
      transition: background-color 0.2s ease;
    }

    .table tr:last-child td {
      border-bottom: none;
    }

    .badge-unlocked {
      background: rgba(20, 184, 166, 0.15);
      color: #2dd4bf;
      border: 1px solid rgba(20, 184, 166, 0.3);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .badge-locked {
      background: rgba(100, 116, 139, 0.15);
      color: #94a3b8;
      border: 1px solid rgba(100, 116, 139, 0.3);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Quick Entry Hub */
    .hub-section {
      background: radial-gradient(circle at center, rgba(15, 118, 110, 0.1) 0%, transparent 70%);
      padding: 40px 0 80px;
    }

    .hub-card {
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .hub-card:hover {
      background: rgba(15, 23, 42, 0.6);
      border-color: rgba(15, 118, 110, 0.3);
      transform: translateY(-2px);
    }

    .hub-icon {
      font-size: 32px;
      color: #14b8a6;
      background: rgba(15, 118, 110, 0.15);
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.03); opacity: 0.9; }
      100% { transform: scale(1); opacity: 1; }
    }
    @media print {
      body::after {
        content: "Force Cheng 2026/7/3";
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 10px;
        color: rgba(0,0,0,0.15);
        font-family: monospace;
      }
    }
  </style>
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
      <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
        <i class="bi bi-robot text-success" style="font-size: 24px;"></i>
        <span>天勳 x Force Cheng LINE AI 雙版本主頁</span>
      </a>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link fw-semibold text-info" href="product-analysis.html" target="_blank" style="font-size: 14px;">
              <i class="bi bi-patch-check-fill"></i> v1.x 版 Claude AI 驗證
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero-section container">
    <div class="hero-badge">💡 對知識工程＋繁體中文最友善強大的 AI 服務方案</div>
    <h1>天勳 x Force Cheng LINE AI 資訊管理系統</h1>
    <p class="subtitle">
      專為商業服務業及專案管理打造的對話自動化備份、語意檢索與 AI 戰情室解決方案。雙版本均提供「雲端 SaaS 託管」與「地端專屬安全私有化」彈性部署方案。
    </p>
  </header>

  <!-- Version Selection -->
  <section class="container my-4">
    <div class="row g-4 justify-content-center">
      <!-- Standard Tier -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="pricing-card">
          <div class="tier-name text-success">💎 企業標準版</div>
          <div class="price-tag">$100,000 <span class="price-period">/ 6個月</span></div>
          <p class="text-muted small">專為專案與客服團隊打造的 AI 智慧助理。一鍵將海量 LINE 對話提煉成工作日誌與待辦清單，開箱即用。</p>
          <ul class="features-list">
            <li><i class="bi bi-check-circle-fill"></i> <strong>20,000 點</strong> AI 運算額度 (基礎大容量配置)</li>
            <li><i class="bi bi-check-circle-fill"></i> 支援<strong><span style="color: #facc15;">單一</span>官方帳號多終端協作</strong></li>
            <li><i class="bi bi-check-circle-fill"></i> 支援多個聊天視窗與對話備份</li>
            <li><i class="bi bi-check-circle-fill"></i> LINE 對話與圖片<strong>即時安全備份</strong></li>
            <li><i class="bi bi-check-circle-fill"></i> 一鍵 Prompt 範本 (今日摘要/待辦整理)</li>
            <li><i class="bi bi-check-circle-fill"></i> 支援導入個人與企業 KM 知識規章</li>
          </ul>

          <div class="row g-2 mt-3">
            <div class="col-6">
              <a href="product-intro.html#standard" target="_blank" class="btn btn-action btn-outline-custom">
                <i class="bi bi-file-earmark-text"></i> 提案文案
              </a>
            </div>
            <div class="col-6">
              <a href="poc-demo.html?tier=standard" target="_blank" class="btn btn-action btn-solid-custom" style="background: linear-gradient(135deg, #0d9488, #0f766e);">
                <i class="bi bi-play-circle-fill"></i> 互動 POC
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Tier -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="pricing-card featured">
          <div class="tier-name text-info">🚀 企業進階版</div>
          <div class="price-tag">$200,000 <span class="price-period">/ 6個月</span></div>
          <p class="text-muted small">推薦自控與高資安需求首選。解鎖三大控管權限，支援地端開源大模型與外部 AI Agent 協作。</p>
          <ul class="features-list">
            <li><i class="bi bi-check-circle-fill"></i> <strong>50,000 點</strong> AI 運算額度 (加倍大配置)</li>
            <li><i class="bi bi-check-circle-fill"></i> 支援<strong><span style="color: #38bdf8;">多個</span>官方帳號規模化整合</strong></li>
            <li><i class="bi bi-check-circle-fill"></i> 支援多個聊天視窗與對話備份 (跨帳號多視窗安全管理與分析)</li>
            <li><i class="bi bi-check-circle-fill"></i> LINE 對話與圖片<strong>即時安全備份</strong></li>
            <li><i class="bi bi-check-circle-fill"></i> 一鍵 Prompt 範本 (今日摘要/待辦整理)</li>
            <li><i class="bi bi-check-circle-fill"></i> 支援導入個人與企業 KM 知識規章</li>
            <li style="color: #facc15;"><i class="bi bi-check-circle-fill" style="color: #facc15;"></i> <strong>解鎖自備金鑰</strong> (無縫續用自備金鑰)</li>
            <li style="color: #facc15;"><i class="bi bi-check-circle-fill" style="color: #facc15;"></i> <strong>解鎖 Ollama 地端模型</strong> (資安無虞)</li>
            <li style="color: #facc15;"><i class="bi bi-check-circle-fill" style="color: #facc15;"></i> <strong>解鎖 Agent 匯出</strong> (對接 NotebookLM)</li>
          </ul>

          <div class="row g-2 mt-3">
            <div class="col-6">
              <a href="product-intro.html#advanced" target="_blank" class="btn btn-action btn-outline-custom">
                <i class="bi bi-file-earmark-text"></i> 提案文案
              </a>
            </div>
            <div class="col-6">
              <a href="poc-demo.html?tier=advanced" target="_blank" class="btn btn-action btn-solid-custom">
                <i class="bi bi-play-circle-fill"></i> 互動 POC
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Workflow Integration Addon Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="pricing-card" style="border: 1.5px dashed #0284c7; background-color: #f0f9ff; box-shadow: 0 10px 30px rgba(2, 132, 199, 0.1);">
          <div class="tier-name" style="color: #0369a1; font-weight: 800;">➕ 工作流整合加值包</div>
          <div class="price-tag" style="color: #0c4a6e !important;">$100,000 <span class="price-period" style="color: #0369a1;">/ 6個月</span></div>
          <p class="small" style="color: #334155; font-size: 13px;">配搭標準版/進階版選購。<strong>加購即額外贈送 50,000 點 AI 額度 (合購後標準版達 70,000 點，進階版達 100,000 點額度！)</strong>，並解鎖跨平台 Telegram 訊息橋接、群組內 AI 即時指令及智慧 KM 自動答詢開關。</p>
          
          <ul class="features-list">
            <li style="color: #0f172a;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> <strong>加碼贈送 50,000 點</strong> AI 運算額度</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> <strong>Telegram 訊息同步橋接</strong> (LINE ➡️ TG)</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> <strong>群組 AI 即時分析指令</strong> (打指令秒回)</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> <strong>智慧 KM 知識與 AI 即時回覆建議</strong></li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> <strong>後台開關選項一鍵開啟</strong> (免開發/免代碼)</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> 支援多終端、多裝置協同登入</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> 對話歷史與大檔案永久雲端保存</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> 機器人 API 傳輸速度極快無頻寬限制</li>
            <li style="color: #1e293b;"><i class="bi bi-check-circle-fill" style="color: #0284c7 !important;"></i> 相容地端部署，安全私有化運作</li>
          </ul>

          <div class="row g-2 mt-3">
            <div class="col-6">
              <a href="workflow-addon.html" target="_blank" class="btn btn-action" style="border: 1px solid #0284c7; color: #0284c7; background: transparent; font-weight: bold;">
                <i class="bi bi-file-earmark-text"></i> 詳細方案
              </a>
            </div>
            <div class="col-6">
              <a href="mailto:service@tianxun.com.tw?subject=【智慧轉型】洽詢AI解決方案(工作流整合加值包)導入事宜" class="btn btn-action" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: none; color: white; font-weight: bold;">
                <i class="bi bi-envelope-fill"></i> 聯絡服務
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Comparison Table -->
  <section class="container">
    <div class="table-container">
      <h3 class="fw-bold mb-4 text-center"><i class="bi bi-grid-3x3-gap text-success"></i> 雙版本核心功能對照表</h3>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th style="width: 22%;">核心規格與功能</th>
              <th style="width: 26%;" class="text-success">💎 企業標準版</th>
              <th style="width: 26%;" class="text-info">🚀 企業進階版</th>
              <th style="width: 26%; color: #2dd4bf;">➕ 搭配工作流加值包</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>服務定價</strong></td>
              <td>$100,000 / 6個月</td>
              <td>$200,000 / 6個月</td>
              <td style="color: #2dd4bf; font-weight: bold;">+$100,000 / 6個月 (疊加開通)</td>
            </tr>
            <tr>
              <td><strong>預載 AI 點數</strong></td>
              <td>20,000 點 (基礎大容量)</td>
              <td>50,000 點 (加倍大配置)</td>
              <td>額外加碼贈送 50,000 點 (合購達 7萬 / 10萬點)</td>
            </tr>
            <tr>
              <td><strong>預設模型支援</strong></td>
              <td>Gemini 預設大模型 (高性價比)</td>
              <td>Gemini 預設大模型 / 進階推理模型</td>
              <td>對接 Telegram 機器人即時 API 推理</td>
            </tr>
            <tr>
              <td><strong>自備金鑰面板</strong></td>
              <td><span class="badge-locked"><i class="bi bi-x-circle"></i> 鎖定</span></td>
              <td><span class="badge-unlocked"><i class="bi bi-check-circle-fill"></i> 解鎖</span></td>
              <td>依主方案設定而定</td>
            </tr>
            <tr>
              <td><strong>Ollama 地端模型</strong></td>
              <td><span class="badge-locked"><i class="bi bi-x-circle"></i> 鎖定</span></td>
              <td><span class="badge-unlocked"><i class="bi bi-check-circle-fill"></i> 解鎖</span></td>
              <td>依主方案設定而定</td>
            </tr>
            <tr>
              <td><strong>Agent MD/Prompt 匯出</strong></td>
              <td><span class="badge-locked"><i class="bi bi-x-circle"></i> 鎖定</span></td>
              <td><span class="badge-unlocked"><i class="bi bi-check-circle-fill"></i> 解鎖</span></td>
              <td>依主方案設定而定</td>
            </tr>
            <tr>
              <td><strong>外部大模型對接</strong></td>
              <td>無 (強綁天勳預設 Key)</td>
              <td>NotebookLM, ChatGPT, Gemini, Claude, Perplexity 等</td>
              <td>解鎖群組內 AI 即時詢答與聯防</td>
            </tr>
            <tr>
              <td><strong>續用與加值機制</strong></td>
              <td>僅能向天勳加購點數包續用</td>
              <td>點數用罄後可切換自備金鑰或地端模型免扣點</td>
              <td>加值功能在主合約期內無次數限制使用</td>
            </tr>
            <tr>
              <td><strong>專案資安定位</strong></td>
              <td>雲端安全加密傳輸與點數安全隔離</td>
              <td>支援 100% 地端內網部署與去敏感化本地匯出</td>
              <td>完全相容雲/地端，數據不經任何第三方中轉</td>
            </tr>
            <tr>
              <td><strong>部署模式支援</strong></td>
              <td>雲端 SaaS 託管方案 / 地端標準部署</td>
              <td>雲端專屬託管 / 地端編譯混淆安全部署</td>
              <td>完全相容，後台一鍵選項即可開通啟用</td>
            </tr>
            <tr>
              <td><strong>官方帳號對接數</strong></td>
              <td>單一官方帳號 (可支援多視窗/對話)</td>
              <td>支援多個官方帳號 (支援跨帳號規模化整合)</td>
              <td>將 LINE 對話同步橋接至指定的 TG 機器人群組</td>
            </tr>
            <tr>
              <td><strong>工作流整合加值包 (選配)</strong></td>
              <td>選配加購 (+$100,000 / 6個月) <a href="workflow-addon.html" style="font-weight: bold; text-decoration: underline; color: #2dd4bf;">[詳情]</a></td>
              <td>選配加購 (+$100,000 / 6個月) <a href="workflow-addon.html" style="font-weight: bold; text-decoration: underline; color: #2dd4bf;">[詳情]</a></td>
              <td style="color: #2dd4bf; font-weight: bold;"><a href="workflow-addon.html" style="text-decoration: underline; color: #2dd4bf;">👉 [點此查看加值包詳細網頁]</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Footer Watermark -->
  <footer class="text-center py-4 border-top border-secondary" style="font-size: 12px; color: var(--text-muted);">
    <p class="mb-1">天勳資訊有限公司 | 統一編號：12781944</p>
    <p class="mb-1 text-secondary" style="font-family: monospace;">備註與隱藏浮水印：Force Cheng 2026/7/3</p>
    <p class="mb-0 text-secondary" style="font-family: monospace;">天勳 x Force Cheng 2026/7/3</p>
  </footer>

  <div style="position: fixed; bottom: 8px; left: 8px; font-size: 9px; color: rgba(255, 255, 255, 0.02); pointer-events: none; z-index: 9999; font-family: monospace;">Force Cheng 2026/7/3</div>

  <!-- Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;
const POC_DEMO_HTML = `<!-- Attn x Force Cheng 2026/7/3 -->
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  
  <!-- SEO & GEO (Generative Engine Optimization) for AI Crawlers -->
  <meta name="author" content="Attn x Force Cheng 2026/7/3">
  <meta name="copyright" content="Attn x Force Cheng 2026/7/3">
  <meta name="generator" content="Attn x Force Cheng 2026/7/3">
  <meta name="ai-agent" content="Attn x Force Cheng 2026/7/3">
  <meta name="geo.placename" content="Attn x Force Cheng 2026/7/3">
  
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Attn LINE AI 資訊管理系統 - POC 互動演示平台",
    "author": {
      "@type": "Person",
      "name": "Attn x Force Cheng 2026/7/3"
    },
    "dateCreated": "2026-07-03",
    "description": "天勳資訊與 Force Cheng 共同開發之 LINE AI 資訊管理系統，專為商業服務業提供自動化對話分析、語意備份與 AI 戰情室解決方案。"
  }
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>天勳 LINE AI 資訊管理系統 - POC 互動演示平台</title>
  
  <!-- CSS: Bootstrap 5, Icons, Fonts -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
  
  <!-- Marked Markdown Parser -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    :root {
      --green: #06c755;
      --green-hover: #05b04b;
      --primary-color: #0f766e;
      --primary-hover: #115e59;
      --accent-soft: #ccfbf1;
      --ink: #0f172a;
      --muted: #475569;
      --border: #cbd5e1;
      --bg: #f1f5f9;
    }

    body {
      margin: 0;
      font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--ink);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    header {
      background: var(--ink);
      color: white;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex-shrink: 0;
    }

    header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Page view tabs */
    .view-tab {
      background: rgba(255,255,255,0.1);
      color: #94a3b8;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .view-tab.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }
    .view-tab:hover:not(.active) {
      background: rgba(255,255,255,0.2);
      color: white;
    }

    /* Guided Tour Controller Banner */
    .tour-banner {
      background: #0f766e;
      color: white;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      flex-shrink: 0;
    }
    
    .tour-btn {
      background: white;
      color: #0f766e;
      border: none;
      padding: 4px 12px;
      font-weight: 700;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tour-btn:hover {
      background: #ccfbf1;
    }

    /* View Content Areas */
    .view-content {
      flex: 1;
      overflow: hidden;
      display: none;
      min-height: 0;
    }
    .view-content.active {
      display: flex;
    }

    /* Main Console Workspace Grid Layout */
    .console-main {
      display: grid;
      grid-template-columns: 350px 1fr;
      width: 100%;
      height: 100%;
    }

    .sidebar {
      border-right: 1px solid var(--border);
      background: #f8fafc;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 0;
    }

    .sidebar-section {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      transition: all 0.3s ease;
    }

    .sidebar-section h2 {
      margin: 0 0 10px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      font-weight: bold;
    }

    .checkbox-card {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px;
      border: 1px solid #f1f5f9;
      border-radius: 6px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .checkbox-card:hover {
      background: #f8fafc;
    }
    .checkbox-card input {
      margin-top: 4px;
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      background: white;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    .chat-messages {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: #fafafb;
    }

    .response-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .response-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    /* Markdown styling inside response */
    .response-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
    }
    .response-body th, .response-body td {
      border: 1px solid var(--border);
      padding: 8px 12px;
      font-size: 13px;
    }
    .response-body th { background: #f8fafc; font-weight: bold; }
    .response-body code {
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 13px;
      font-family: monospace;
    }

    .chat-input-area {
      background: #f8fafc;
      border-top: 1px solid var(--border);
      padding: 16px 24px;
      flex-shrink: 0;
    }

    .chat-input-wrapper {
      display: flex;
      gap: 12px;
    }

    textarea {
      flex: 1;
      height: 60px;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      resize: none;
      outline: none;
    }

    .btn-send {
      background-color: var(--green);
      color: white;
      border: none;
      width: 120px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s ease;
    }
    .btn-send:hover {
      background-color: var(--green-hover);
    }

    /* Visual Timeline styling */
    .timeline-container {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 14px;
    }
    .timeline-track {
      position: relative;
      height: 4px;
      background: var(--border);
      margin: 20px 10px 10px 10px;
      border-radius: 2px;
    }
    .timeline-node {
      position: absolute;
      top: -6px;
      width: 16px;
      height: 16px;
      background: white;
      border: 3px solid var(--primary-color);
      border-radius: 50%;
      cursor: pointer;
      transform: translateX(-50%);
      transition: all 0.2s ease;
    }
    .timeline-node:hover, .timeline-node.active {
      background: var(--primary-color);
      transform: translateX(-50%) scale(1.3);
    }
    .timeline-label {
      position: absolute;
      top: -24px;
      font-size: 11px;
      font-weight: bold;
      color: var(--primary-color);
      white-space: nowrap;
      transform: translateX(-50%);
    }

    /* Highlight ring class for guided steps */
    .highlight-ring {
      outline: 3px solid #f59e0b !important;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.4) !important;
    }

    /* Modal / Popup for file previews */
    .preview-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-width: 90%;
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 2000;
      display: none;
    }
    .preview-modal-header {
      background: #f8fafc;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border);
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .preview-modal-body {
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 13px;
      white-space: pre-wrap;
      background: #0f172a;
      color: #e2e8f0;
    }
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      z-index: 1999;
      display: none;
    }

    /* Product Page Specific CSS */
    .product-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px;
    }
    .product-box {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f766e;
      border-left: 4px solid #0f766e;
      padding-left: 10px;
      margin-top: 30px;
      margin-bottom: 16px;
    }
    .section-title:first-of-type { margin-top: 0; }

    /* Print styles */
    @media print {
      body { background: white !important; height: auto !important; overflow: visible !important; }
      header, .tour-banner, .sidebar, .chat-input-area, .no-print, .response-card:not(.printing-target), .preview-modal, .overlay {
        display: none !important;
      }
      main { display: block !important; height: auto !important; }
      .chat-container { width: 100% !important; display: block !important; }
      .chat-messages { padding: 0 !important; background: white !important; }
      .response-card.printing-target {
        display: block !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <h1><i class="bi bi-robot"></i> 天勳 LINE AI 資訊管理系統 - POC 互動演示</h1>
    <div class="d-flex align-items-center gap-3">
      <span id="pointsDisplayHeader" class="badge bg-secondary py-2 px-3" style="font-size: 12px; display: none; background: #334155 !important;">AI 點數餘額：<strong>50,000 點 / 50,000 點</strong></span>
      <div class="d-flex gap-2">
        <button class="view-tab active" id="tabProduct" onclick="switchPage('product')">📄 1. 雙版本方案介紹</button>
        <button class="view-tab" id="tabConsoleStandard" onclick="switchPage('standard')">💻 2. 10萬標準版工作台</button>
        <button class="view-tab" id="tabConsoleAdvanced" onclick="switchPage('advanced')">🚀 3. 20萬進階版工作台</button>
      </div>
      <span class="badge bg-success">地端同步中</span>
    </div>
  </header>

  <!-- Guided Tour Controller Banner -->
  <div class="tour-banner" id="tourBanner">
    <div>
      <strong id="tourStepTitle">💡 歡迎進行「天勳 LINE AI」提案送審展示：</strong>
      <span id="tourStepDesc" class="ms-2">點擊右側開始進行互動演示，系統將自動導引播放所有功能。</span>
    </div>
    <div class="d-flex gap-2">
      <button class="tour-btn" id="startTourBtn" onclick="startTour()">開始自動展示</button>
      <button class="tour-btn d-none" id="prevTourBtn" onclick="prevStep()">上一步</button>
      <button class="tour-btn d-none" id="autoTourBtn" onclick="toggleAutoPlay()">自動播放</button>
      <button class="tour-btn d-none" id="nextTourBtn" onclick="nextStep()">下一步</button>
      <button class="tour-btn d-none" id="restartTourBtn" onclick="restartTour()">重新播放</button>
    </div>
  </div>

  <!-- Page 1 View: Product Intro -->
  <div class="view-content active" id="pageProduct" style="overflow-y: auto;">
    <div class="product-container">
      <div class="product-box">
        <!-- Title Block -->
        <div class="d-flex justify-content-between align-items-start mb-4 border-bottom pb-3">
          <div>
            <h2 class="fw-bold" style="font-size: 28px; color: var(--ink);">Attn LINE AI 資訊管理系統 企業進階版</h2>
            <div class="d-flex gap-2 mt-2">
              <span class="badge bg-teal" style="background: #0f766e;">AI對話分析與專案智慧</span>
              <span class="badge bg-secondary">G 批發及零售業</span>
              <span class="badge bg-secondary">I 住宿及餐飲業</span>
              <span class="badge bg-secondary">M 專業、科學及技術服務業</span>
            </div>
          </div>
          <div class="text-end" style="background: #f8fafc; padding: 12px 20px; border-radius: 8px; border: 1px solid var(--border);">
            <div class="text-muted small">115年方案價格</div>
            <div class="fw-bold fs-4" style="color: #0f766e;">$200,000</div>
            <div class="small text-secondary">(期程 12 個月)</div>
          </div>
        </div>

        <!-- Architecture Diagram -->
        <div class="section-title">AI 元件模型架構</div>
        <div class="text-center p-2 border rounded mb-4 bg-light" id="productArchitectureImg">
          <img src="ChatGPT_Image.png" alt="天勳 LINE AI 元件模型架構" class="img-fluid rounded" style="max-height: 480px;">
        </div>

        <!-- Solution Intro -->
        <div class="section-title">方案介紹</div>
        <p class="fw-bold text-success mb-2" style="font-size: 15px;">💡 對知識工程＋繁體中文最友善強大的 AI 服務方案</p>
        <p>
          Attn LINE AI 資訊管理系統是一套專為企業打造的智能化對話歸檔與戰情分析方案。本系統由**天勳資訊有限公司**維護，無縫整合 LINE 官方帳號 (LINE Bot)、地端同步事件歸檔器與生成式 AI (Gemini) 推理大模型，協助業者將雜亂的客戶諮詢、群組討論及檔案轉化為具備商業洞察的專案智慧。透過彈性時間區間、Prompt 小幫手與知識庫 (KM) 交叉比對，企業可一鍵產出日誌摘要、待辦事項、趨勢分析與風險提醒，大幅降低人工文書整理負擔。
        </p>

        <!-- Solution Specs -->
        <div class="section-title">方案規格說明</div>
        <p><strong>本服務針對企業轉型提供以下兩款版本配置，可依專案規模彈性選用：</strong></p>
        <h5 class="fw-bold mt-2" style="color: #0f766e; font-size: 14px;">💎 企業標準版 ($100,000 / 6個月)</h5>
        <ul style="font-size: 13px;">
          <li><strong>AI 運作點數</strong>：方案預設提供 **20,000 點 AI 運作點數**。採「輸入 + 輸出雙軌字數計量扣點」，折合可分析高達 **4,000 萬字** 的對話輸入，或產生約 **1,000 萬字** 的生成式 AI 戰情報告（預設選用 Gemini 輕量高效模型）。每次標準 analysis 扣除 10~25 點。</li>
          <li><strong>續用加值機制</strong>：點數扣減完畢後，客戶可向天勳資訊加購點數包繼續使用（不支援自備 API 金鑰或地端離線模型）。</li>
          <li><strong>對話資料存檔</strong>：支援即時 LINE 官方助手對話紀錄、多模態圖片檔案與附件自動儲存。</li>
        </ul>
        <h5 class="fw-bold mt-2" style="color: #0d9488; font-size: 14px;">💎 企業進階版 ($200,000 / 6個月) —— 🌟 推薦自控與高資安首選</h5>
        <ul style="font-size: 13px;">
          <li><strong>AI 運作點數</strong>：方案預設提供 **50,000 點 AI 運作點數**。折合可分析高達 **1 億字** 的對話輸入，或產生約 **2,500 萬字** 的生成式 AI 戰情報告。</li>
          <li><strong>「三大進階解鎖」自主控管機制</strong>：
            <ol>
              <li><strong>自備金鑰 (Own API Key) 續用</strong>：預設點數扣減完畢後，客戶可無縫於前台面板填入自己申請之 Gemini API Key 進行無限次 analysis，系統不中斷，免加購點數。</li>
              <li><strong>地端開源大模型 (Ollama) 對接</strong>：支援地端離線部署之開源大模型（如 Meta Llama 3、Google Gemma 等），資料 100% 留在企業內網，符合最高規格資安。</li>
              <li><strong>Agent 協作與專用 MD / Prompt 導出</strong>：解鎖「匯出 MD 給 Agent 分析」功能，一鍵打包去敏感化的結構化對話與 KM 知識日誌 (.md)，可完美導入並對接 **NotebookLM** 及 **主流通用 AI Agent (如 ChatGPT, Gemini, Claude, Perplexity 等)** 進行深度二次分析、智慧問答與資料探勘（扣減 0 點）。</li>
            </ol>
          </li>
        </ul>
        <h5 class="fw-bold mt-2" style="color: #0f766e; font-size: 14px;">➕ 系統工作流整合加值包 (選購, +$100,000 / 6個月)</h5>
        <ul style="font-size: 13px;">
          <li><strong>加碼運作點數</strong>：加購即額外贈送 **50,000 點 AI 額度 (合購後標準版達 70,000 點，進階版達 100,000 點額度！)**。</li>
          <li><strong>自動化與橋接功能</strong>：解鎖 Telegram 訊息橋接、群組內 AI 即時指令（如 \`/summary\` 與 \`/todo\`）以及智慧 KM 企業知識庫自動問答開關。</li>
        </ul>

        <!-- Provider details -->
        <div class="section-title">服務提供者資訊</div>
        <p class="mb-1">公司名稱：天勳資訊有限公司 | 統一編號：12781944</p>
        <p class="mb-1">聯絡電話：06-2980272 | 地址：臺南市官田區二鎮里工業路21號1樓</p>
        <p class="mb-0">電子郵件：<a href="mailto:service@tianxun.com.tw" style="color: #0f766e;">service@tianxun.com.tw</a></p>
        <p class="mb-0 text-muted mt-3" style="font-size: 11px; font-family: monospace;">
          備註與隱藏浮水印：Attn x Force Cheng 2026/7/3
        </p>
      </div>
    </div>
  </div>

  <!-- Page 2 View: Interactive Workspace Console -->
  <div class="view-content" id="pageConsole">
    <div class="console-main">
      
      <!-- Sidebar -->
      <div class="sidebar">
        
        <!-- Source Selection -->
        <div class="sidebar-section" id="sectionSources">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h2>對話資料來源</h2>
            <span class="text-secondary small fw-bold">全選 / 全清</span>
          </div>
          <div class="checkbox-card">
            <input type="checkbox" id="cbGroupDemo" name="source">
            <div>
              <strong class="d-block text-dark small fw-bold">天勳 ERP 導入戰情群組 (Demo)</strong>
              <small class="text-muted" style="font-size: 11px;">手動匯入歷史對話</small>
            </div>
          </div>
        </div>

        <!-- Date Filter & Timeline -->
        <div class="sidebar-section" id="sectionDates">
          <h2>時間區間篩選</h2>
          <div class="d-flex flex-column gap-2">
            <label class="small text-muted">開始時間 (含):
              <input type="date" id="startDate" class="form-control form-control-sm mt-1" disabled>
            </label>
            <label class="small text-muted">結束時間 (含):
              <input type="date" id="endDate" class="form-control form-control-sm mt-1" disabled>
            </label>
            <div class="d-flex gap-2 justify-content-end mt-1" style="font-size: 11px; font-weight: bold;">
              <a href="javascript:void(0)" onclick="quickSelectDate('today')" style="color: var(--green); text-decoration: none;">今天</a>
              <a href="javascript:void(0)" onclick="quickSelectDate('week')" style="color: var(--green); text-decoration: none;" id="btnPresetWeek">本週</a>
              <a href="javascript:void(0)" onclick="quickSelectDate('month')" style="color: var(--green); text-decoration: none;">本月</a>
              <a href="javascript:void(0)" onclick="quickSelectDate('clear')" style="color: var(--muted); text-decoration: none;">清除</a>
            </div>
          </div>

          <!-- Timeline list -->
          <h2 class="mt-3 mb-1" style="font-size: 11px;">📌 歷史時程事件軸 (可點選)</h2>
          <div class="timeline-container">
            <div class="timeline-track">
              <div class="timeline-node" style="left: 10%;" onclick="clickTimelineNode('2026-06-28', this)">
                <span class="timeline-label">06/28 啟動</span>
              </div>
              <div class="timeline-node" style="left: 45%;" onclick="clickTimelineNode('2026-06-30', this)" id="nodeTimelineTimeout">
                <span class="timeline-label">06/30 故障</span>
              </div>
              <div class="timeline-node" style="left: 80%;" onclick="clickTimelineNode('2026-07-03', this)">
                <span class="timeline-label">07/03 部署</span>
              </div>
            </div>
          </div>
        </div>

        <!-- KM References -->
        <div class="sidebar-section" id="sectionKMs">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h2>個人 KM 參考</h2>
            <span class="text-secondary small fw-bold">全選</span>
          </div>
          <label class="checkbox-card mb-1 w-100">
            <input type="checkbox" id="cbKM1" name="km_file">
            <div>
              <strong class="small text-dark fw-bold">tianxun_erp_sop.md</strong>
            </div>
          </label>
          <label class="checkbox-card mb-1 w-100">
            <input type="checkbox" id="cbKM2" name="km_file">
            <div>
              <strong class="small text-dark fw-bold">tianxun_project_milestones.md</strong>
            </div>
          </label>
        </div>

        <!-- NotebookLM Partition Exporter -->
        <div class="sidebar-section" id="sectionExportBox">
          <h2>NotebookLM 實體分割導出</h2>
          <div class="d-flex flex-column gap-2" style="font-size: 12px;">
            <label>分割方式:
              <select id="partitionType" class="form-select form-select-sm mt-1">
                <option value="day">按日 (By Day)</option>
                <option value="week">按週 (By Week)</option>
                <option value="month">按月 (By Month)</option>
              </select>
            </label>
            <label>導出格式:
              <select id="exportFormat" class="form-select form-select-sm mt-1">
                <option value="log">結構化對話紀錄 (.md)</option>
                <option value="summary">AI 自動摘要報告 (.md)</option>
              </select>
            </label>
            <button class="btn btn-primary btn-sm mt-2 fw-bold w-100" id="btnExportExecutor" onclick="executeMockExport()">
              生成實體分割檔案 <span class="spinner-border spinner-border-sm d-none" id="exportSpinner"></span>
            </button>
            <button class="btn btn-sm mt-2 fw-bold text-white w-100" style="background-color: #0d9488;" id="btnExportAgentMD" onclick="exportAgentMD()">
              📥 匯出 MD 給 Agent 分析
            </button>
          </div>
        </div>

        <!-- Partitions List -->
        <div class="sidebar-section" id="sectionPartitions">
          <h2>已生成歷史分割檔 (115年)</h2>
          <details open style="margin-bottom: 6px; border: 1px solid var(--border); border-radius: 4px; background: white;">
            <summary style="font-weight: 700; cursor: pointer; font-size: 12px; padding: 6px 8px; color: var(--muted); background: #f8fafc;">
              📂 06 月 (2 個檔案)
            </summary>
            <div style="padding: 8px;" id="partitionFileList">
              <div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                <a href="javascript:void(0)" onclick="previewPartitionFile('2026-06-30-log')" class="text-decoration-none fw-bold" style="color: var(--ink); font-size: 12px;">📄 2026-06-30-log.md</a>
                <span class="text-success small fw-bold" style="cursor:pointer;" onclick="alert('已下載該單日日誌檔！')">下載</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <a href="javascript:void(0)" onclick="previewPartitionFile('2026-06-29-log')" class="text-decoration-none fw-bold" style="color: var(--ink); font-size: 12px;">📄 2026-06-29-log.md</a>
                <span class="text-success small fw-bold" style="cursor:pointer;" onclick="alert('已下載該單日日誌檔！')">下載</span>
              </div>
            </div>
          </details>
        </div>

      </div>

      <!-- Chat Container -->
      <div class="chat-container">
        <div class="chat-messages" id="chatMessages">
          <!-- Welcome banner -->
          <div class="text-center text-secondary py-5" id="welcomeMsg">
            <h3 class="fw-bold">歡迎使用 Attn IM AI 協作</h3>
            <p class="small text-muted">請在左側勾選要交叉分析的對話源與時間區間，然後在下方輸入您的問題。</p>
          </div>
        </div>

        <!-- Chat Input Area -->
        <div class="chat-input-area" id="inputArea">
          <div class="d-flex align-items-center gap-3 mb-2 flex-wrap" style="font-size: 13px;">
            <div>
              <span class="fw-bold text-secondary">AI 協作模型：</span>
              <select id="modelSelector" class="form-select form-select-sm d-inline-block w-auto py-0 px-2" style="height: 28px;">
                <option value="flash-lite">Gemini 預設大模型 (Flash-lite 1x)</option>
                <option value="flash">Gemini 經典大模型 (Flash 2x)</option>
                <option value="ollama" id="optOllama" style="display: none;">Ollama 地端開源模型 (離線資安)</option>
              </select>
            </div>
            <div id="apiKeyInputWrapper" style="display: none;">
              <span class="fw-bold text-secondary">Gemini API Key：</span>
              <input type="password" class="form-control form-control-sm d-inline-block w-auto py-0 px-2" style="height: 28px;" value="••••••••••••••••••••" placeholder="請輸入您個人的 Gemini API Key">
            </div>
          </div>

          <!-- Prompt Helper Templates -->
          <div class="d-flex align-items-center gap-2 mb-2 flex-wrap" id="promptHelperRow" style="font-size: 12px; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border);">
            <span class="fw-bold text-muted">💡 Prompt 範本：</span>
            <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 11px; font-weight: bold;" id="btnPromptSummary" onclick="applyPromptTemplate('summary')">📋 摘要待辦整理</button>
            <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 11px; font-weight: bold;" id="btnPromptRisk" onclick="applyPromptTemplate('risk')">⚠️ 評估潛在風險</button>
            <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 11px; font-weight: bold;" id="btnPromptKM" onclick="applyPromptTemplate('km')">🔍 交叉比對 KM 落差</button>
          </div>

          <!-- Input wrapper -->
          <div class="chat-input-wrapper">
            <textarea id="promptInput" placeholder="輸入要問的問題..."></textarea>
            <button class="btn-send" id="sendBtn" onclick="sendUserPrompt()">
              送出分析 <i class="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Overlay and File Content Preview Modal -->
  <div class="overlay" id="overlay" onclick="closePreviewModal()"></div>
  <div class="preview-modal" id="previewModal">
    <div class="preview-modal-header">
      <strong id="previewFileName">檔案預覽</strong>
      <button class="btn-close" onclick="closePreviewModal()"></button>
    </div>
    <pre class="preview-modal-body" id="previewFileBody"></pre>
  </div>

  <!-- Javascript Tour and Mock Logics -->
  <script>
    let currentStep = 0;
    const messagesContainer = document.getElementById('chatMessages');

    function switchPage(page) {
      document.getElementById('pageProduct').classList.remove('active');
      document.getElementById('pageConsole').classList.remove('active');
      
      document.getElementById('tabProduct').classList.remove('active');
      document.getElementById('tabConsoleStandard').classList.remove('active');
      document.getElementById('tabConsoleAdvanced').classList.remove('active');
      
      const ptsDisplay = document.getElementById('pointsDisplayHeader');
      const optOllama = document.getElementById('optOllama');
      const apiKeyWrapper = document.getElementById('apiKeyInputWrapper');
      const btnExportAgent = document.getElementById('btnExportAgentMD');
      
      if (page === 'product') {
        document.getElementById('pageProduct').classList.add('active');
        document.getElementById('tabProduct').classList.add('active');
        if (ptsDisplay) ptsDisplay.style.display = 'none';
      } else if (page === 'standard') {
        document.getElementById('pageConsole').classList.add('active');
        document.getElementById('tabConsoleStandard').classList.add('active');
        if (ptsDisplay) {
          ptsDisplay.style.display = 'inline-block';
          ptsDisplay.innerHTML = 'AI 點數餘額：<strong>20,000 點 / 20,000 點</strong>';
        }
        if (optOllama) optOllama.style.display = 'none';
        if (apiKeyWrapper) apiKeyWrapper.style.display = 'none';
        if (btnExportAgent) btnExportAgent.style.display = 'none';
      } else if (page === 'advanced') {
        document.getElementById('pageConsole').classList.add('active');
        document.getElementById('tabConsoleAdvanced').classList.add('active');
        if (ptsDisplay) {
          ptsDisplay.style.display = 'inline-block';
          ptsDisplay.innerHTML = 'AI 點數餘額：<strong>50,000 點 / 50,000 點</strong>';
        }
        if (optOllama) optOllama.style.display = 'block';
        if (apiKeyWrapper) apiKeyWrapper.style.display = 'block';
        if (btnExportAgent) btnExportAgent.style.display = 'block';
      }
    }

    // Timeline event selection
    function clickTimelineNode(date, node) {
      document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
      if (node) node.classList.add('active');
      
      document.getElementById('startDate').value = date;
      document.getElementById('endDate').value = date;
    }

    function quickSelectDate(type) {
      const start = document.getElementById('startDate');
      const end = document.getElementById('endDate');
      if (type === 'today') {
        start.value = "2026-07-03";
        end.value = "2026-07-03";
      } else if (type === 'week') {
        start.value = "2026-06-28";
        end.value = "2026-07-04";
      } else if (type === 'month') {
        start.value = "2026-06-01";
        end.value = "2026-06-30";
      } else {
        start.value = "";
        end.value = "";
      }
    }

    function applyPromptTemplate(type) {
      const textarea = document.getElementById('promptInput');
      if (type === 'summary') {
        textarea.value = "請為我彙整以上所選對話的時程節點、主要討論決策，並以 Markdown 表格列出所有指派的待辦事項與負責人。";
      } else if (type === 'risk') {
        textarea.value = "請分析對話中是否存在進度延遲、溝通誤會、技術瓶頸或尚未解決的潛在風險，並提供具體的改善建議。";
      } else if (type === 'km') {
        textarea.value = "請比對 LINE 對話中提及的系統操作問題，與我們上傳的天勳 ERP SOP/FAQ 進行對照，分析目前是否有超出 SOP 的例外狀況或需更新的知識落差。";
      }
      textarea.focus();
    }

    // Modal view for split partition logs
    function previewPartitionFile(name) {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById('previewModal').style.display = 'block';
      document.getElementById('previewFileName').innerText = name + '.md';
      
      let mockContent = "";
      if (name.includes('06-30')) {
        mockContent = \`=== TIMESTAMP: 2026-06-30 ===\\n\` +
          \`[10:00:00] Jerry: 各位，我們在進行 ERP API 對接時，遇到第三方支付金流回傳 DB Connection Timeout 錯誤，能幫忙看看資料庫伺服器是否正常嗎？\\n\` +
          \`[10:05:00] 客服窗口: Jerry 你好，請先確認內部資料庫伺服器 (192.168.1.50) 是否有過載或斷線。另外，匯入 API 的 CSV 時要記得使用 UTF-8 編碼，不然會報編碼錯誤喔。\\n\` +
          \`[10:10:00] Jerry: 收到！確認是 1.50 伺服器磁碟空間滿了，清出空間後連線已經恢復正常。API 串接目前順利通暢。\`;
      } else {
        mockContent = \`=== TIMESTAMP: 2026-06-29 ===\\n\` +
          \`[15:30:00] Jerry: 天勳 ERP 客戶權限的模組，管理員是否可以異動他人單據？\\n\` +
          \`[15:32:00] 客服窗口: 依據天勳 SOP 規範，系統管理員(Admin)可以修改系統設定，但一般單據填寫應由一般操作員(User)執行，管理員主要是維護系統與備份喔。\`;
      }
      document.getElementById('previewFileBody').innerText = mockContent;
    }

    function closePreviewModal() {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('previewModal').style.display = 'none';
    }

    // NotebookLM Partition Simulation
    function executeMockExport() {
      const spinner = document.getElementById('exportSpinner');
      const btn = document.getElementById('btnExportExecutor');
      btn.disabled = true;
      spinner.classList.remove('d-none');
      
      setTimeout(() => {
        btn.disabled = false;
        spinner.classList.add('d-none');
        
        // Append new simulated partitioned file to list
        const fileList = document.getElementById('partitionFileList');
        const newFileRow = document.createElement('div');
        newFileRow.className = "d-flex justify-content-between align-items-center mb-1 mt-1 pt-1 border-top";
        newFileRow.innerHTML = \`
          <a href="javascript:void(0)" onclick="previewPartitionFile('2026-07-03-summary')" class="text-decoration-none fw-bold" style="color: var(--primary-color); font-size: 12px;">📄 2026-07-03-summary.md</a>
          <span class="text-success small fw-bold" style="cursor:pointer;" onclick="alert('已下載該單日日誌檔！')">下載</span>
        \`;
        fileList.insertBefore(newFileRow, fileList.firstChild);
        alert('成功分割並導出 2026-07-03 分割檔！已新增至左側歷史分割檔列表中。');
      }, 1500);
    }

    // Typewriter markdown output simulation
    function sendUserPrompt() {
      const prompt = document.getElementById('promptInput').value.trim();
      if (!prompt) return;

      document.getElementById('welcomeMsg').style.display = 'none';
      
      // User Card
      const userCard = document.createElement('div');
      userCard.className = 'response-card';
      userCard.style.background = '#eef6f0';
      userCard.innerHTML = \`
        <div class="response-header">
          <span>提問</span>
          <span>\${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="response-body"><strong>\${prompt}</strong></div>
      \`;
      messagesContainer.appendChild(userCard);
      document.getElementById('promptInput').value = "";
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // AI Loading Spinner
      const aiCard = document.createElement('div');
      aiCard.className = 'response-card';
      aiCard.innerHTML = \`
        <div class="response-header">
          <span>AI 分析中...</span>
          <span>\${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="response-body">
          <div class="spinner-border spinner-border-sm text-success" role="status"></div>
          正在計算選定對話與知識規章的關聯度，進行交叉對照彙整中...
        </div>
      \`;
      messagesContainer.appendChild(aiCard);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Complete and fill AI response card
      setTimeout(() => {
        aiCard.innerHTML = \`
          <div class="response-header">
            <span>AI 戰情分析回覆</span>
            <span>\${new Date().toLocaleTimeString()}</span>
          </div>
          <div class="response-body" id="aiDynamicOutput"></div>
          <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span>模型: <strong>gemini-3.1-flash-lite</strong></span>
            <span>Tokens: <strong>26,450</strong> (輸入: 25,120 | 輸出: 1,330)</span>
            <span>花費: <strong>$0.001141 USD</strong> (約 <strong>NT$ 0.0342</strong>)</span>
          </div>
          <div class="no-print d-flex gap-2 justify-content-end mt-2 pt-2 border-top">
            <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="alert('已複製 HTML 格式')">📄 複製 HTML</button>
            <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="alert('下載 MD 成功')">📥 下載 MD</button>
            <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="window.print()">🖨️ 匯出 PDF</button>
          </div>
        \`;
        
        const mdText = \`### 📋 天勳 ERP 專案戰情分析回覆\\n\\n\` +
          \`根據您勾選的 **「天勳 ERP 導入戰情群組 (Demo)」**，為您摘錄專案關鍵要點：\\n\` +
          \`* 🛠️ **連線 Timeout 排除**：Jerry 確認為資料庫伺服器 (1.50) 空間不足所致，已排除完畢。\\n\` +
          \`* 📅 **備份時程安排**：Jerry 將於週五執行人工異地備份，符合天勳備份規範流程。\\n\` +
          \`* 📚 **教育訓練**：天勳窗口已著手撰寫教育手冊，預定 7/15 提交初版。\\n\\n\` +
          \`#### 📋 行動待辦工作表\\n\` +
          \`| 序號 | 工作說明 | 負責人 | 預定日期 |\\n\` +
          \`| :--- | :--- | :---: | :---: |\\n\` +
          \`| 1 | 部署金流模組至測試機 | Jerry | 07/03 |\\n\` +
          \`| 2 | 人工異地磁碟備份 | Jerry | 07/03 |\\n\` +
          \`| 3 | 交付教育手冊初版 | 天勳窗口 | 07/15 |\`;

        document.getElementById('aiDynamicOutput').innerHTML = marked.parse(mdText);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 1500);
    }

    // ==========================================
    // AUTOMATED GUIDED TOUR ENGINE
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const selectedTier = urlParams.get('tier') || 'standard';

    const tourStepsStandard = [
      {
        title: "步驟 1：雙版本方案與架構展示 (SME Biz 專區)",
        desc: "方案簡介網頁，展示天勳資訊針對企業轉型設計 of 10 萬與 20 萬雙版本規格、點數配置對照，以及系統架裝圖。",
        action: () => {
          switchPage('product');
          document.getElementById('pageProduct').classList.add('highlight-ring');
        }
      },
      {
        title: "步驟 2：展示『10 萬企業標準版』操作 Console",
        desc: "點選頂部切換。此版本專為基礎導入設計，預設贈送 20,000 點額度，無 API Key 輸入區，亦鎖定 Ollama 地端模型與 Agent 導出按鈕（強綁天勳充值機制）。",
        action: () => {
          document.getElementById('pageProduct').classList.remove('highlight-ring');
          switchPage('standard');
          document.getElementById('tabConsoleStandard').classList.add('highlight-ring');
        }
      },
      {
        title: "步驟 3：雙資料源 (LINE + KM) 精準勾選",
        desc: "自動勾選要分析的 LINE 對話（天勳 ERP 戰情群組）以及地端上傳的專案知識規章（tianxun_erp_sop.md）。",
        action: () => {
          document.getElementById('tabConsoleStandard').classList.remove('highlight-ring');
          document.getElementById('sectionSources').classList.add('highlight-ring');
          document.getElementById('sectionKMs').classList.add('highlight-ring');
          document.getElementById('cbGroupDemo').checked = true;
          document.getElementById('cbKM1').checked = true;
        }
      },
      {
        title: "步驟 4：時間軸快捷定位",
        desc: "點選事件軸上的『06/30 故障』，開始與結束日期自動填充，鎖定故障發生的特定時間區間。",
        action: () => {
          document.getElementById('sectionSources').classList.remove('highlight-ring');
          document.getElementById('sectionKMs').classList.remove('highlight-ring');
          document.getElementById('sectionDates').classList.add('highlight-ring');
          document.getElementById('nodeTimelineTimeout').classList.add('active');
          
          document.getElementById('startDate').value = "2026-06-30";
          document.getElementById('endDate').value = "2026-06-30";
        }
      },
      {
        title: "步驟 5：加載 Prompt 範本並自動輸入",
        desc: "點擊 Prompt 範本小幫手中的『📋 摘要待辦整理』，AI 提問框自動帶入優化好的分析語法並模擬鍵盤打字輸入。",
        action: (skipDelay) => {
          document.getElementById('sectionDates').classList.remove('highlight-ring');
          document.getElementById('nodeTimelineTimeout').classList.remove('active');
          document.getElementById('promptHelperRow').classList.add('highlight-ring');
          document.getElementById('btnPromptSummary').classList.add('btn-warning');
          
          const text = "請為我彙整以上所選對話的時程節點、主要討論決策，並以 Markdown 表格列出所有指派的待辦事項與負責人。";
          const textarea = document.getElementById('promptInput');
          
          if (skipDelay) {
            textarea.value = text;
            return;
          }
          
          let i = 0;
          textarea.value = "";
          return new Promise(resolve => {
            const timer = setInterval(() => {
              textarea.value += text[i];
              i++;
              if (i >= text.length) {
                clearInterval(timer);
                resolve();
              }
            }, 30);
          });
        }
      },
      {
        title: "步驟 6：呼叫 Gemini API 進行戰情分析",
        desc: "送出分析！後端載入 6/30 的對話紀錄及 ERP SOP 比對，Gemini 迅速以打字機效果回傳有系統性的專案分析結果！",
        action: (skipDelay) => {
          document.getElementById('promptHelperRow').classList.remove('highlight-ring');
          document.getElementById('btnPromptSummary').classList.remove('btn-warning');
          document.getElementById('welcomeMsg').style.display = 'none';
          document.getElementById('inputArea').classList.add('highlight-ring');
          
          // Clear any duplicate cards
          const oldCard = document.getElementById('tourAICard');
          if (oldCard) oldCard.remove();
          const oldUser = document.getElementById('tourUserCard');
          if (oldUser) oldUser.remove();
          
          // User Card
          const userCard = document.createElement('div');
          userCard.id = 'tourUserCard';
          userCard.className = 'response-card';
          userCard.style.background = '#eef6f0';
          userCard.innerHTML = \`
            <div class="response-header">
              <span>提問</span>
              <span>\${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="response-body"><strong>請為我彙整以上所選對話的時程節點、主要討論決策，並以 Markdown 表格列出所有指派的待辦事項與負責人。</strong></div>
          \`;
          messagesContainer.appendChild(userCard);

          // AI Card
          const aiCard = document.createElement('div');
          aiCard.className = 'response-card printing-target';
          aiCard.id = "tourAICard";
          aiCard.innerHTML = \`
            <div class="response-header">
              <span>AI 戰情分析回覆</span>
              <span>\${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="response-body" id="aiTourOutputBody"></div>
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <span>模型: <strong>Gemini 預設大模型 (高性價比)</strong></span>
              <span>點數消耗: <strong>16 點</strong> (輸入 13 點 + 輸出 3 點)</span>
              <span>點數餘額: <strong>19,984 點 / 20,000 點</strong></span>
            </div>
            <div class="no-print d-flex gap-2 justify-content-end mt-2 pt-2 border-top" id="tourActionsBlock">
              <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="alert('已複製 HTML')">📄 複製 HTML</button>
              <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="alert('已下載 MD')">📥 下載 MD</button>
              <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="window.print()">🖨️ 匯出 PDF</button>
            </div>
          \`;
          messagesContainer.appendChild(aiCard);
          
          const mdContent = \`### 📋 天勳 ERP 專案戰情分析回覆

根據您勾選的 **「天勳 ERP 導入戰情群組 (Demo)」** 對話紀錄與 **「天勳 ERP SOP / 專案時程表」**，為您彙整以下專案進度、決策與待辦工作事項：

#### 1. 核心專案進度與決策
* 🛠️ **第三方支付金流對接故障排除**：
  * **狀況**：API 對接時金流回傳 \\\`DB Connection Timeout\\\` 錯誤。
  * **處置**：Jerry 已確認為資料庫伺服器 (192.168.1.50) 磁碟空間已滿。清出空間後連線已恢復正常，API 串接恢復通暢。
* 💾 **資料庫備份規範**：
  * **決策**：Jerry 將於週五 (7/3) 晚上進行人工異地備份，並順便保存測試版備份以符合備份規範。
* 📚 **教育訓練啟動**：
  * **決策**：配合 8/16 之後的 UAT 教育訓練，天勳窗口已著手撰寫教育訓練手冊，預計於 **7/15 前** 提交初版予主管審閱。

#### 2. 指派行動清單與待辦 (TODO)

| 序號 | 待辦事項說明 | 負責人 | 預計完成日 | 關聯文件 / 對照規範 |
| :--- | :--- | :---: | :---: | :--- |
| 1 | 完成 ERP 金流模組開發並部署至測試環境 | Jerry | 07/03 (五) | 專案里程碑-階段二 |
| 2 | 執行每週五人工異地備份 (含測試庫) | Jerry | 07/03 (五) | 天勳 ERP 備份規範 |
| 3 | 撰寫並提交初版 ERP 教育訓練手冊 | 天勳窗口 | 07/15 (三) | 專案里程碑-階段三 |
| 4 | 審閱 ERP 教育訓練手冊初版 | 鄭Force | 07/17 (五) | 主管審核程序 |

#### 3. 專案潛在風險提示
* ⚠️ **人工異地備份依賴單一人力**：每週五異地備份主要由 Jerry 手動執行，建議應依據 SOP 備份自動化流程以規避風險。\`;

          document.getElementById('aiTourOutputBody').innerHTML = marked.parse(mdContent);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          if (skipDelay) {
            return;
          }

          aiCard.style.display = 'none';
          const loadingCard = document.createElement('div');
          loadingCard.id = "tempLoadingCard";
          loadingCard.className = 'response-card';
          loadingCard.innerHTML = \`
            <div class="response-header">
              <span>AI 分析中...</span>
              <span>\${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="response-body">
              <div class="spinner-border spinner-border-sm text-success" role="status"></div>
              正在比對天勳專案對話與 SOP 規章中...
            </div>
          \`;
          messagesContainer.appendChild(loadingCard);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          return new Promise(resolve => {
            setTimeout(() => {
              if (loadingCard) loadingCard.remove();
              aiCard.style.display = 'block';
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
              resolve();
            }, 1000);
          });
        }
      },
      {
        title: "步驟 7：NotebookLM 實體檔案分割導出",
        desc: "系統示範 NotebookLM 切割。選定『按日』、『對話紀錄 (.md)』，點選『生成實體分割檔案』，系統將以動畫展示背景產出單日切割檔並新增至左側清單中。",
        action: (skipDelay) => {
          document.getElementById('inputArea').classList.remove('highlight-ring');
          document.getElementById('sectionExportBox').classList.add('highlight-ring');
          
          const fileList = document.getElementById('partitionFileList');
          let oldRow = document.getElementById('tourNewFileRow');
          if (oldRow) oldRow.remove();
          
          const newFileRow = document.createElement('div');
          newFileRow.id = 'tourNewFileRow';
          newFileRow.className = "d-flex justify-content-between align-items-center mb-1 mt-1 pt-1 border-top";
          newFileRow.innerHTML = \`
            <a href="javascript:void(0)" onclick="previewPartitionFile('2026-07-03-log')" class="text-decoration-none fw-bold" style="color: var(--primary-color); font-size: 12px;">📄 2026-07-03-log.md</a>
            <span class="text-success small fw-bold" style="cursor:pointer;" onclick="alert('已下載該單日日誌檔！')">下載</span>
          \`;
          fileList.insertBefore(newFileRow, fileList.firstChild);
          
          if (skipDelay) {
            document.getElementById('sectionExportBox').classList.remove('highlight-ring');
            document.getElementById('sectionPartitions').classList.add('highlight-ring');
            return;
          }
          
          const spinner = document.getElementById('exportSpinner');
          const btn = document.getElementById('btnExportExecutor');
          btn.disabled = true;
          spinner.classList.remove('d-none');
          
          return new Promise(resolve => {
            setTimeout(() => {
              btn.disabled = false;
              spinner.classList.add('d-none');
              document.getElementById('sectionExportBox').classList.remove('highlight-ring');
              document.getElementById('sectionPartitions').classList.add('highlight-ring');
              resolve();
            }, 1500);
          });
        }
      },
      {
        title: "步驟 8：點擊歷史分割檔進行彈窗預覽",
        desc: "系統點選剛生成的『2026-07-03-log.md』，跳出黑色終端機風格的 Markdown 對話文字彈窗，完全還原 NotebookLM 專用結構化對話紀錄格式！",
        action: () => {
          document.getElementById('sectionPartitions').classList.remove('highlight-ring');
          previewPartitionFile('2026-06-30-log');
        }
      }
    ];

    const tourStepsAdvanced = [
      {
        title: "步驟 1：雙版本方案與架構展示 (SME Biz 專區)",
        desc: "方案簡介網頁，展示天勳資訊針對企業轉型設計 of 10 萬與 20 萬雙版本規格、點數配置對照，以及系統架構圖。",
        action: () => {
          switchPage('product');
          document.getElementById('pageProduct').classList.add('highlight-ring');
        }
      },
      {
        title: "步驟 2：切換至『20 萬企業進階版』工作台",
        desc: "點選頂部切換。此版提供 50,000 點，並解鎖三大權限：顯示自備 API Key 欄位、開啟 Ollama 地端模型選項、以及加載綠色的『匯出 MD 給 Agent 分析』按鈕！",
        action: () => {
          document.getElementById('pageProduct').classList.remove('highlight-ring');
          switchPage('advanced');
          document.getElementById('tabConsoleAdvanced').classList.add('highlight-ring');
        }
      },
      {
        title: "步驟 3：雙資料源 (LINE + KM) 精準勾選",
        desc: "自動勾選要分析的 LINE 對話（天勳 ERP 戰情群組）以及地端上傳的專案知識規章（tianxun_erp_sop.md）。",
        action: () => {
          document.getElementById('tabConsoleAdvanced').classList.remove('highlight-ring');
          document.getElementById('sectionSources').classList.add('highlight-ring');
          document.getElementById('sectionKMs').classList.add('highlight-ring');
          document.getElementById('cbGroupDemo').checked = true;
          document.getElementById('cbKM1').checked = true;
        }
      },
      {
        title: "步驟 4：時間軸快捷定位",
        desc: "點選事件軸上的『06/30 故障』，開始與結束日期自動填充，鎖定故障發生的特定時間區間。",
        action: () => {
          document.getElementById('sectionSources').classList.remove('highlight-ring');
          document.getElementById('sectionKMs').classList.remove('highlight-ring');
          document.getElementById('sectionDates').classList.add('highlight-ring');
          document.getElementById('nodeTimelineTimeout').classList.add('active');
          
          document.getElementById('startDate').value = "2026-06-30";
          document.getElementById('endDate').value = "2026-06-30";
        }
      },
      {
        title: "步驟 5：加載 Prompt 範本並自動輸入",
        desc: "點擊 Prompt 範本小幫手中的『📋 摘要待辦整理』，AI 提問框自動帶入優化好的分析語法並模擬鍵盤打字輸入。",
        action: (skipDelay) => {
          document.getElementById('sectionDates').classList.remove('highlight-ring');
          document.getElementById('nodeTimelineTimeout').classList.remove('active');
          document.getElementById('promptHelperRow').classList.add('highlight-ring');
          document.getElementById('btnPromptSummary').classList.add('btn-warning');
          
          const text = "請為我彙整以上所選對話的時程節點、主要討論決策，並以 Markdown 表格列出所有指派的待辦事項與負責人。";
          const textarea = document.getElementById('promptInput');
          
          if (skipDelay) {
            textarea.value = text;
            return;
          }
          
          let i = 0;
          textarea.value = "";
          return new Promise(resolve => {
            const timer = setInterval(() => {
              textarea.value += text[i];
              i++;
              if (i >= text.length) {
                clearInterval(timer);
                resolve();
              }
            }, 30);
          });
        }
      },
      {
        title: "步驟 6：呼叫 Gemini API 進行戰情分析",
        desc: "送出分析！後端載入 6/30 的對話紀錄及 ERP SOP 比對，Gemini 迅速以打字機效果回傳有系統性的專案分析結果！",
        action: (skipDelay) => {
          document.getElementById('promptHelperRow').classList.remove('highlight-ring');
          document.getElementById('btnPromptSummary').classList.remove('btn-warning');
          document.getElementById('welcomeMsg').style.display = 'none';
          document.getElementById('inputArea').classList.add('highlight-ring');
          
          // Clear any duplicate cards
          const oldCard = document.getElementById('tourAICard');
          if (oldCard) oldCard.remove();
          const oldUser = document.getElementById('tourUserCard');
          if (oldUser) oldUser.remove();
          
          // User Card
          const userCard = document.createElement('div');
          userCard.id = 'tourUserCard';
          userCard.className = 'response-card';
          userCard.style.background = '#eef6f0';
          userCard.innerHTML = \`
            <div class="response-header">
              <span>提問</span>
              <span>\${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="response-body"><strong>請為我彙整以上所選對話的時程節點、主要討論決策，並以 Markdown 表格列出所有指派的待辦事項與負責人。</strong></div>
          \`;
          messagesContainer.appendChild(userCard);

          // AI Card
          const aiCard = document.createElement('div');
          aiCard.className = 'response-card printing-target';
          aiCard.id = "tourAICard";
          aiCard.innerHTML = \`
            <div class="response-header">
              <span>AI 戰情分析回覆</span>
              <span>\${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="response-body" id="aiTourOutputBody"></div>
            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <span>模型: <strong>Gemini 預設大模型 (高性價比)</strong></span>
              <span>點數消耗: <strong>16 點</strong> (輸入 13 點 + 輸出 3 點)</span>
              <span>點數餘額: <strong>49,984 點 / 50,000 點</strong></span>
            </div>
            <div class="no-print d-flex gap-2 justify-content-end mt-2 pt-2 border-top" id="tourActionsBlock">
              <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="alert('已複製 HTML')">📄 複製 HTML</button>
              <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="alert('已下載 MD')">📥 下載 MD</button>
              <button class="btn btn-light btn-sm py-0 px-2 border" style="font-size: 10px;" onclick="window.print()">🖨️ 匯出 PDF</button>
            </div>
          \`;
          messagesContainer.appendChild(aiCard);
          
          const mdContent = \`### 📋 天勳 ERP 專案戰情分析回覆

根據您勾選的 **「天勳 ERP 導入戰情群組 (Demo)」** 對話紀錄與 **「天勳 ERP SOP / 專案時程表」**，為您彙整以下專案進度、決策與待辦工作事項：

#### 1. 核心專案進度與決策
* 🛠️ **第三方支付金流對接故障排除**：
  * **狀況**：API 對接時金流回傳 \\\`DB Connection Timeout\\\` 錯誤。
  * **處置**：Jerry 已確認為資料庫伺服器 (192.168.1.50) 磁碟空間已滿。清出空間後連線已恢復正常，API 串接恢復通暢。
* 💾 **資料庫備份規範**：
  * **決策**：Jerry 將於週五 (7/3) 晚上進行人工異地備份，並順便保存測試版備份以符合備份規範。
* 📚 **教育訓練啟動**：
  * **決策**：配合 8/16 之後的 UAT 教育訓練，天勳窗口已著手撰寫教育訓練手冊，預計於 **7/15 前** 提交初版予主管審閱。

#### 2. 指派行動清單與待辦 (TODO)

| 序號 | 待辦事項說明 | 負責人 | 預計完成日 | 關聯文件 / 對照規範 |
| :--- | :--- | :---: | :---: | :--- |
| 1 | 完成 ERP 金流模組開發並部署至測試環境 | Jerry | 07/03 (五) | 專案里程碑-階段二 |
| 2 | 執行每週五人工異地備份 (含測試庫) | Jerry | 07/03 (五) | 天勳 ERP 備份規範 |
| 3 | 撰寫並提交初版 ERP 教育訓練手冊 | 天勳窗口 | 07/15 (三) | 專案里程碑-階段三 |
| 4 | 審閱 ERP 教育訓練手冊初版 | 鄭Force | 07/17 (五) | 主管審核程序 |

#### 3. 專案潛在風險提示
* ⚠️ **人工異地備份依賴單一人力**：每週五異地備份主要由 Jerry 手動執行，建議應依據 SOP 備份自動化流程以規避風險。\`;

          document.getElementById('aiTourOutputBody').innerHTML = marked.parse(mdContent);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          if (skipDelay) {
            return;
          }

          aiCard.style.display = 'none';
          const loadingCard = document.createElement('div');
          loadingCard.id = "tempLoadingCard";
          loadingCard.className = 'response-card';
          loadingCard.innerHTML = \`
            <div class="response-header">
              <span>AI 分析中...</span>
              <span>\${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="response-body">
              <div class="spinner-border spinner-border-sm text-success" role="status"></div>
              正在比對天勳專案對話與 SOP 規章中...
            </div>
          \`;
          messagesContainer.appendChild(loadingCard);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;

          return new Promise(resolve => {
            setTimeout(() => {
              if (loadingCard) loadingCard.remove();
              aiCard.style.display = 'block';
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
              resolve();
            }, 1000);
          });
        }
      },
      {
        title: "步驟 7：NotebookLM 與 Agent 專用 MD 一鍵打包導出",
        desc: "系統點擊綠色的『匯出 MD 給 Agent 分析』按鈕，一鍵打包去敏感化的對話日誌，生成結構化且去敏感化的 Markdown 分析包（無扣點，扣減 0 點）。",
        action: (skipDelay) => {
          document.getElementById('inputArea').classList.remove('highlight-ring');
          document.getElementById('btnExportAgentMD').classList.add('highlight-ring');
          
          if (skipDelay) {
            document.getElementById('btnExportAgentMD').classList.remove('highlight-ring');
            return;
          }
          
          return new Promise(resolve => {
            setTimeout(() => {
              alert("已為您打包所勾選的對話與 KM 參考！\\\\n已開始下載：Attn_IM_Agent_Source.md\\\\n您可將此 Markdown 檔案直接拖曳上傳至 NotebookLM 或外部 Agent 進行深度分析。 (扣減 0 點)");
              document.getElementById('btnExportAgentMD').classList.remove('highlight-ring');
              resolve();
            }, 1500);
          });
        }
      },
      {
        title: "步驟 8：點擊歷史對話記錄進行彈窗預覽",
        desc: "系統點選剛生成/匯出的對話日誌，跳出黑色終端機風格的 Markdown 文字彈窗，完全還原 NotebookLM 專用結構化對話紀錄格式！",
        action: () => {
          previewPartitionFile('2026-06-30-log');
        }
      }
    ];

    const tourSteps = selectedTier === 'advanced' ? tourStepsAdvanced : tourStepsStandard;

    function resetTourStateOnly() {
      closePreviewModal();
      document.getElementById('cbGroupDemo').checked = false;
      document.getElementById('cbKM1').checked = false;
      document.getElementById('startDate').value = "";
      document.getElementById('endDate').value = "";
      document.getElementById('promptInput').value = "";
      document.getElementById('welcomeMsg').style.display = 'block';
      
      const cards = messagesContainer.querySelectorAll('.response-card');
      cards.forEach(c => c.remove());
      
      document.querySelectorAll('.highlight-ring').forEach(el => el.classList.remove('highlight-ring'));
      document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('active'));
      
      // Reset partition files list to original 2 files
      document.getElementById('partitionFileList').innerHTML = \`
        <div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
          <a href="javascript:void(0)" onclick="previewPartitionFile('2026-06-30-log')" class="text-decoration-none fw-bold" style="color: var(--ink); font-size: 12px;">📄 2026-06-30-log.md</a>
          <span class="text-success small fw-bold" style="cursor:pointer;" onclick="alert('已下載該單日日誌檔！')">下載</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-1">
          <a href="javascript:void(0)" onclick="previewPartitionFile('2026-06-29-log')" class="text-decoration-none fw-bold" style="color: var(--ink); font-size: 12px;">📄 2026-06-29-log.md</a>
          <span class="text-success small fw-bold" style="cursor:pointer;" onclick="alert('已下載該單日日誌檔！')">下載</span>
        </div>
      \`;
    }

    let isAutoPlaying = false;

    function stopAutoPlay() {
      isAutoPlaying = false;
      const btn = document.getElementById('autoTourBtn');
      if (btn) {
        btn.innerText = "自動播放";
        btn.classList.remove('btn-danger');
      }
    }

    function toggleAutoPlay() {
      const btn = document.getElementById('autoTourBtn');
      if (isAutoPlaying) {
        stopAutoPlay();
      } else {
        isAutoPlaying = true;
        btn.innerText = "停止播放";
        btn.classList.add('btn-danger');
        runAutoPlayLoop();
      }
    }

    async function runAutoPlayLoop() {
      if (!isAutoPlaying) return;
      if (currentStep >= tourSteps.length) {
        stopAutoPlay();
        document.getElementById('autoTourBtn').classList.add('d-none');
        // Let playStep handle completion rendering
        playStep();
        return;
      }

      const step = tourSteps[currentStep];
      document.getElementById('tourStepTitle').innerText = step.title;
      document.getElementById('tourStepDesc').innerText = step.desc;

      document.getElementById('nextTourBtn').disabled = true;
      document.getElementById('prevTourBtn').disabled = true;

      const res = step.action();
      if (res instanceof Promise) {
        await res;
      }

      // Add a 4.0 second pause between steps for comfortable reading speed
      await new Promise(resolve => setTimeout(resolve, 4000));

      if (isAutoPlaying) {
        currentStep++;
        document.getElementById('nextTourBtn').disabled = false;
        document.getElementById('prevTourBtn').disabled = false;
        runAutoPlayLoop();
      } else {
        document.getElementById('nextTourBtn').disabled = false;
        document.getElementById('prevTourBtn').disabled = false;
      }
    }

    async function startTour() {
      document.getElementById('startTourBtn').classList.add('d-none');
      document.getElementById('nextTourBtn').classList.remove('d-none');
      document.getElementById('prevTourBtn').classList.remove('d-none');
      document.getElementById('autoTourBtn').classList.remove('d-none');
      stopAutoPlay();
      currentStep = 0;
      playStep();
    }

    async function playStep() {
      const prevBtn = document.getElementById('prevTourBtn');
      if (currentStep > 0) {
        prevBtn.disabled = false;
        prevBtn.style.opacity = "1";
      } else {
        prevBtn.disabled = true;
        prevBtn.style.opacity = "0.5";
      }

      if (currentStep >= tourSteps.length) {
        document.getElementById('nextTourBtn').classList.add('d-none');
        document.getElementById('prevTourBtn').classList.add('d-none');
        document.getElementById('autoTourBtn').classList.add('d-none');
        document.getElementById('restartTourBtn').classList.remove('d-none');
        document.getElementById('tourStepTitle').innerText = "🎉 全系統 POC 導覽演示完成！";
        document.getElementById('tourStepDesc').innerText = "天勳 LINE AI 系統成功展示了：方案規格、資料源複選、歷史時程事件軸、一鍵 Prompt 分析、PDF列印以及 NotebookLM 分割檔預覽等豐富功能。";
        closePreviewModal();
        return;
      }

      const step = tourSteps[currentStep];
      document.getElementById('tourStepTitle').innerText = step.title;
      document.getElementById('tourStepDesc').innerText = step.desc;

      const res = step.action();
      if (res instanceof Promise) {
        document.getElementById('nextTourBtn').disabled = true;
        prevBtn.disabled = true;
        await res;
        document.getElementById('nextTourBtn').disabled = false;
        if (currentStep > 0) {
          prevBtn.disabled = false;
        }
      }
    }

    function nextStep() {
      stopAutoPlay();
      currentStep++;
      playStep();
    }

    async function prevStep() {
      stopAutoPlay();
      if (currentStep > 0) {
        currentStep--;
        resetTourStateOnly();
        
        // Fast-forward previous steps instantly
        for (let idx = 0; idx < currentStep; idx++) {
          tourSteps[idx].action(true);
        }
        
        playStep();
      }
    }

    function restartTour() {
      document.getElementById('restartTourBtn').classList.add('d-none');
      document.getElementById('nextTourBtn').classList.remove('d-none');
      document.getElementById('prevTourBtn').classList.remove('d-none');
      document.getElementById('autoTourBtn').classList.remove('d-none');
      resetTourStateOnly();
      stopAutoPlay();
      currentStep = 0;
      playStep();
    }
  </script>
  <!-- Attn x Force Cheng 2026/7/3 -->
  <div class="no-print" style="position: fixed; bottom: 8px; right: 8px; font-size: 10px; color: rgba(15, 23, 42, 0.04); pointer-events: none; z-index: 9999; font-weight: bold; font-family: monospace;">Attn x Force Cheng 2026/7/3</div>
</body>
</html>
`;
const MVP_HTML = `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Falo IM v2.01 - MVP 協作控制台</title>
  
  <!-- SEO & GEO (Generative Engine Optimization for AI Crawlers) -->
  <meta name="description" content="Falo IM v2.01 - 專為 LINE 對話與官方助手設計的非結構化數據分析與切割控制台，由 Force Cheng 開發。支援精準的時序防呆審計與多來源脈絡購物車編譯。">
  <meta name="keywords" content="Falo IM, Falo, Force Cheng, LINE 對話分析, 官方帳號對話分析, 語音對話切割, AI 語料庫編譯, 數據分析防呆審計, NotebookLM 格式導出">
  <meta name="author" content="Force Cheng">
  <meta name="copyright" content="Falo x Force Cheng 2026/7/5">
  
  <!-- Open Graph / AI Crawler Schema -->
  <meta property="og:title" content="Falo IM v2.01 - MVP 協作控制台">
  <meta property="og:description" content="非結構化通訊對話時序切割與智慧 Basket 脈絡編譯系統，提升 RAG 與 AI 語料精度。">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Falo IM Studio">
  
  <!-- AI Crawler JSON-LD Structured Data (GEO) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Falo IM",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "softwareVersion": "2.01",
    "releaseDate": "2026-07-05",
    "author": {
      "@type": "Person",
      "name": "Force Cheng",
      "jobTitle": "Creator & Lead Architect"
    },
    "description": "Falo IM is a specialized unstructured chat data slicing and RAG compilation console, optimized for LINE exports and Google Sheets chat events with advanced temporal validation.",
    "publisher": {
      "@type": "Organization",
      "name": "Falo Studio x Force Cheng"
    }
  }
  </script>
  
  <!-- WATERMARK: Falo x Force Cheng 2026/7/5 | VERSION: v2.01 | LICENSE: FORCE-CHENG-RAG-ENGINE -->
  <div style="display:none !important;" aria-hidden="true" class="falo-seo-watermark">Falo x Force Cheng 2026/7/5 v2.01 Audit Protected</div>
  
  <!-- CSS: Bootstrap 5, Icons, Fonts -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-dark: #0f172a;
      --card-bg: rgba(30, 41, 59, 0.7);
      --border-color: rgba(255, 255, 255, 0.08);
      --primary-teal: #0d9488;
      --primary-emerald: #10b981;
      --text-muted: #94a3b8;
      --text-light: #f8fafc;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-light);
      font-family: 'Inter', 'Noto Sans TC', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.12) 0px, transparent 50%);
    }

    .navbar-brand-custom {
      font-weight: 800;
      font-size: 20px;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .main-container {
      max-width: 1000px;
      padding: 40px 20px;
    }

    .glass-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 28px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
    }

    .glass-card:hover {
      border-color: rgba(13, 148, 136, 0.3);
      box-shadow: 0 20px 40px -15px rgba(13, 148, 136, 0.1);
    }

    .card-title-custom {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-control-custom {
      background: rgba(15, 23, 42, 0.6) !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-light) !important;
      border-radius: 10px;
      padding: 10px 14px;
      transition: all 0.2s ease;
    }

    .form-control-custom:focus {
      border-color: var(--primary-teal) !important;
      box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2) !important;
    }

    .btn-custom {
      background: linear-gradient(135deg, var(--primary-teal), var(--primary-emerald));
      color: white;
      border: none;
      font-weight: 700;
      border-radius: 10px;
      padding: 10px 20px;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-custom:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      filter: brightness(1.1);
    }

    .btn-outline-purple {
      color: #c084fc !important;
      border-color: #a78bfa !important;
      background-color: rgba(139, 92, 246, 0.15) !important;
      font-weight: 700 !important;
      transition: all 0.2s ease !important;
    }

    .btn-outline-purple:hover {
      color: #ffffff !important;
      background-color: #7c3aed !important;
      border-color: #7c3aed !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4) !important;
    }

    .badge-status {
      padding: 6px 12px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .badge-offline {
      background: rgba(100, 116, 139, 0.15);
      border: 1px solid rgba(100, 116, 139, 0.3);
      color: #94a3b8;
    }

    .badge-connecting {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      animation: pulse 1.5s infinite;
    }

    .badge-online {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
    }

    .meta-item {
      padding: 12px;
      background: rgba(15, 23, 42, 0.4);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .meta-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .meta-value a {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s ease;
    }

    .meta-value a:hover {
      color: #7dd3fc;
      text-decoration: underline;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    .date-slice-container {
      max-height: 280px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      background: rgba(15, 23, 42, 0.4);
      padding: 10px;
    }

    .date-slice-item {
      padding: 10px;
      border-radius: 8px;
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.03);
      margin-bottom: 8px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .date-slice-item:hover {
      background: rgba(13, 148, 136, 0.08);
      border-color: rgba(13, 148, 136, 0.2);
    }

    .drop-zone {
      border: 2px dashed rgba(13, 148, 136, 0.3);
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      background: rgba(15, 23, 42, 0.3);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .drop-zone:hover, .drop-zone.dragover {
      background: rgba(13, 148, 136, 0.05);
      border-color: var(--primary-emerald);
    }

    .preview-textarea {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      line-height: 1.5;
      background: rgba(15, 23, 42, 0.8) !important;
      border: 1px solid var(--border-color) !important;
      color: #38bdf8 !important;
      border-radius: 10px;
      padding: 14px;
    }

    .sender-pill {
      background: rgba(13, 148, 136, 0.15);
      color: #34d399;
      border: 1px solid rgba(13, 148, 136, 0.3);
      border-radius: 50px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      margin-right: 4px;
      display: inline-block;
    }

    /* Button Click Feedback */
    .btn {
      transition: transform 0.1s ease, background-color 0.1s ease, box-shadow 0.1s ease !important;
    }

    .btn:active, .btn.btn-clicked {
      transform: scale(0.95) !important;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.5) !important;
    }

    .btn-custom:active, .btn-custom.btn-clicked {
      background: #0d9488 !important; /* solid primary teal */
      border-color: #14b8a6 !important;
      box-shadow: 0 0 12px rgba(20, 184, 166, 0.6) !important;
    }

    .btn-emerald:active, .btn-emerald.btn-clicked {
      background: #047857 !important; /* solid deep emerald */
      border-color: #10b981 !important;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.6) !important;
    }

    .btn-outline-light:active, .btn-outline-light.btn-clicked {
      background: rgba(255, 255, 255, 0.2) !important;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.3) !important;
    }

    /* Prompt list style */
    .prompt-list-item {
      transition: background 0.15s ease, color 0.15s ease;
      cursor: pointer;
      display: block;
      width: 100%;
      text-decoration: none;
    }
    .prompt-list-item:hover {
      background: rgba(255, 255, 255, 0.05) !important;
    }
    .prompt-list-item.active {
      background: rgba(14, 165, 233, 0.15) !important;
      color: #38bdf8 !important;
      border-left: 3px solid #0ea5e9 !important;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar navbar-dark bg-transparent py-4 border-bottom" style="border-color: rgba(255,255,255,0.05) !important;">
    <div class="container main-container py-0 d-flex justify-content-between align-items-center">
      <div class="navbar-brand-custom">
        <i class="bi bi-cpu-fill text-teal me-2" style="color: var(--primary-teal);"></i>
        Falo IM 3.03 <span class="fw-light text-muted">|</span> MVP 控制台
      </div>
      <div class="d-flex align-items-center">
        <a class="btn btn-sm btn-outline-purple me-3 fw-bold" href="/mobile" target="_blank" title="在新分頁開啟手機直立式快速控制台">
          <i class="bi bi-phone"></i> 📱 手機專用版
        </a>
        <span class="badge-status badge-offline" id="globalStatusBadge">未連線</span>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <div class="container main-container">
    
    <div class="row g-4">
      <!-- Connection Card -->
      <div class="col-md-6">
        <div class="glass-card h-100">
          <div class="card-title-custom">
            <i class="bi bi-hdd-network-fill"></i> 大腦資料庫配置
          </div>
          <p class="small text-muted mb-4">請貼入您手動部署好或 clasp 發布的 Google Apps Script Web App (exec) URL，系統會直接透過 API 與大腦資料庫進行第一層通訊探索。</p>
          
          <div class="mb-3">
            <label class="form-label small fw-bold text-light">GAS Web App URL:</label>
            <input type="text" id="gasUrlInput" class="form-control form-control-custom" value="https://script.google.com/macros/s/AKfycbwoXAjRW4z01O5BR_6bAqf_Wx7Ev3P8Z-Pu3CV7Cj0iwnRo_vvd5Kn-FZbL-7zsXg2Urw/exec" placeholder="https://script.google.com/macros/s/.../exec" oninput="updateWebhookDisplay()">
          </div>
          
          <div class="mb-4">
            <label class="form-label small fw-bold text-light">VIEWER_TOKEN (API 安全金鑰):</label>
            <input type="password" id="tokenInput" class="form-control form-control-custom" value="falo_secure_token_12345" placeholder="請輸入 API 金鑰 (上傳對話時需要)...">
          </div>
          
          <button class="btn btn-custom w-100 mt-2" onclick="testConnection()">
            <i class="bi bi-patch-check-fill"></i> 🔗 建立系統連線
          </button>
        </div>
      </div>
      
      <!-- Diagnostic Information Card -->
      <div class="col-md-6">
        <div class="glass-card h-100">
          <div class="card-title-custom">
            <i class="bi bi-info-circle-fill"></i> 大腦環境診斷狀態
          </div>
          
          <div id="diagnosticsEmpty" class="text-center py-5 text-secondary">
            <i class="bi bi-cloud-slash-fill display-4 d-block mb-3" style="color: rgba(255,255,255,0.05);"></i>
            <p class="small text-muted">尚未建立連線。請於左側輸入大腦 URL 後點擊連線按鈕。</p>
          </div>
          
          <div id="diagnosticsDetails" class="d-none">
            <div class="d-flex flex-column gap-3">
              <!-- Spreadsheet Metadata -->
              <div class="meta-item">
                <div class="meta-label">資料庫 (Spreadsheet)</div>
                <div class="meta-value text-truncate">
                  <a id="dbSheetLink" href="#" target="_blank"><i class="bi bi-file-earmark-spreadsheet-fill me-1 text-success"></i> 載入中...</a>
                </div>
              </div>
              
              <!-- Drive Folder Metadata -->
              <div class="meta-item">
                <div class="meta-label">雲端資料夾 (Drive Folder)</div>
                <div class="meta-value text-truncate">
                  <a id="dbFolderLink" href="#" target="_blank"><i class="bi bi-folder-fill me-1 text-warning"></i> 載入中...</a>
                </div>
              </div>
              
              <!-- Configured Bots -->
              <div class="meta-item">
                <div class="meta-label">已註冊 Bots (Official Accounts)</div>
                <div id="dbBotsList" class="meta-value fw-bold text-light" style="font-size: 14px;">
                  載入中...
                </div>
              </div>
              
              <!-- Script Endpoint details -->
              <div class="meta-item">
                <div class="meta-label">大腦 API 服務端點</div>
                <div id="dbScriptEndpoint" class="meta-value text-muted text-truncate" style="font-size: 12px; font-family: monospace;">
                  載入中...
                </div>
              </div>
              
              <!-- LINE Webhook Endpoint details -->
              <div class="meta-item mt-3" style="border: 1px solid rgba(52, 211, 153, 0.2); background: rgba(16, 185, 129, 0.03);">
                <div class="meta-label" style="color: #34d399;">LINE Webhook 接收端點 (請複製此網址)</div>
                <div class="d-flex justify-content-between align-items-center">
                  <span id="cfWebhookEndpoint" class="meta-value text-emerald fw-bold text-break" style="font-size: 13px; font-family: monospace; color: #34d399; word-break: break-all;">
                    載入中...
                  </span>
                  <button class="btn btn-outline-success btn-sm px-2 py-0 border-0" onclick="copyWebhookUrl()" title="複製網址" style="height: 22px; font-size: 11px;">
                    <i class="bi bi-clipboard"></i> 複製
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <!-- LINE History Slicer Card -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="glass-card">
          <div class="card-title-custom" style="color: #38bdf8;">
            <i class="bi bi-scissors"></i> LINE 歷史對話紀錄切割器
          </div>
          
          <div class="row g-4">
            <!-- Left Column: Source & Date Slices -->
            <div class="col-12">
              <h5 class="small fw-bold text-light mb-3">1. 選擇與載入對話資料來源</h5>
              
              <!-- Tab Headers -->
              <ul class="nav nav-tabs mb-3 border-secondary" id="slicerTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active text-light px-3 py-2 border-0" id="drive-tab" data-bs-toggle="tab" data-bs-target="#drive-panel" type="button" role="tab" style="background: transparent;">
                    <i class="bi bi-cloud-arrow-down-fill me-1 text-warning"></i> 雲端硬碟載入
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link text-light px-3 py-2 border-0" id="local-tab" data-bs-toggle="tab" data-bs-target="#local-panel" type="button" role="tab" style="background: transparent;">
                    <i class="bi bi-laptop me-1 text-info"></i> 本機檔案拖放
                  </button>
                </li>
              </ul>
              
              <!-- Tab Contents -->
              <div class="tab-content mb-4" id="slicerTabsContent">
                <!-- Tab: Drive Load -->
                <div class="tab-pane fade show active" id="drive-panel" role="tabpanel">
                  <div class="d-flex gap-2">
                    <select id="driveFilesSelect" class="form-select form-control-custom" style="flex: 1;" onchange="toggleDrivePreviewButton()">
                      <option value="">請先連線大腦以取得 Drive 檔案清單...</option>
                    </select>
                    <button class="btn btn-custom px-3" onclick="loadSelectedDriveFile()" id="btnLoadDriveFile" disabled>
                      <i class="bi bi-download"></i> 載入
                    </button>
                    <button class="btn btn-outline-info px-2" onclick="previewSelectedDriveFile()" id="btnPreviewDriveFile" disabled title="預覽選取的雲端檔案內容">
                      <i class="bi bi-eye"></i> 預覽
                    </button>
                    <button class="btn btn-outline-secondary px-2" onclick="openCloudFilesManager()" title="管理雲端備份檔案 (修改別名、刪除)">
                      <i class="bi bi-gear"></i> 管理
                    </button>
                    <a class="btn btn-outline-success px-2" id="linkExportsFolder" href="https://drive.google.com" target="_blank" title="開啟 Google Drive 雲端備份資料夾">
                      <i class="bi bi-folder-symlink"></i> 資料夾
                    </a>
                  </div>
                  <div id="driveLoadStatus" class="small text-muted mt-2"></div>
                </div>
                
                <!-- Tab: Local Load -->
                <div class="tab-pane fade" id="local-panel" role="tabpanel">
                  <div id="dropZone" class="drop-zone" onclick="document.getElementById('localFileInput').click()">
                    <i class="bi bi-file-earmark-arrow-up display-6 text-teal mb-2 d-block" style="color: var(--primary-teal);"></i>
                    <span class="small text-light">拖曳 LINE 備份 \`.txt\` 檔案至此，或 <span class="text-teal fw-bold">點擊瀏覽檔案</span></span>
                    <input type="file" id="localFileInput" class="d-none" accept=".txt">
                  </div>
                  <!-- Upload to Cloud container -->
                  <div id="localUploadContainer" class="mt-3 p-3 rounded border border-secondary" style="display: none; background: rgba(15, 23, 42, 0.4);">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div class="small text-light">
                        <i class="bi bi-file-earmark-check text-success"></i> 已解析本機檔案：<span id="localFileNameSpan" class="fw-bold text-teal" style="color: var(--primary-teal);"></span>
                      </div>
                      <button class="btn btn-sm btn-outline-warning fw-bold" id="btnUploadLocalToCloud" onclick="uploadLocalFileToCloud()">
                        <i class="bi bi-cloud-arrow-up"></i> ☁️ 上傳至雲端大腦
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="small fw-bold text-light mb-0">2. 對話日期區間切割 (勾選以包含)</h5>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-secondary btn-sm py-0 px-2" onclick="toggleSelectAllDates(true)" style="font-size: 11px;">全選</button>
                  <button class="btn btn-outline-secondary btn-sm py-0 px-2" onclick="toggleSelectAllDates(false)" style="font-size: 11px;">清空</button>
                </div>
              </div>
              
              <!-- Date Range Filter Row -->
              <div class="row g-2 mb-3 align-items-end p-2 rounded border border-secondary" style="background: rgba(15, 23, 42, 0.4); margin: 0 1px 12px 1px;">
                <div class="col-md-4 col-sm-6">
                  <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">開始日期</label>
                  <input type="date" id="filterStartDate" class="form-control form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" onchange="applyDateRangeFilter()">
                </div>
                <div class="col-md-4 col-sm-6">
                  <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">結束日期</label>
                  <input type="date" id="filterEndDate" class="form-control form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" onchange="applyDateRangeFilter()">
                </div>
                <div class="col-md-4 col-12">
                  <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">快速區間</label>
                  <div class="d-flex gap-1" style="height: 32px;">
                    <button class="btn btn-outline-info btn-sm flex-grow-1 py-0 px-1" onclick="applyPresetRange(7)" style="font-size: 11px; line-height: 1;">近7天</button>
                    <button class="btn btn-outline-info btn-sm flex-grow-1 py-0 px-1" onclick="applyPresetRange(30)" style="font-size: 11px; line-height: 1;">近30天</button>
                    <button class="btn btn-outline-info btn-sm flex-grow-1 py-0 px-1" onclick="applyPresetRange('year')" style="font-size: 11px; line-height: 1;">今年</button>
                  </div>
                </div>
              </div>

              <!-- Slicing Checklist -->
              <div id="dateSlicesList" class="date-slice-container">
                <div class="text-center py-5 text-secondary small">
                  <i class="bi bi-calendar-x-fill display-6 d-block mb-2 text-muted"></i>
                  請先載入對話紀錄以產生日格清單
                </div>
              </div>
              <!-- Action buttons for LINE Slicer -->
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 pt-2 border-top border-secondary">
                <button class="btn btn-outline-purple btn-sm" id="btnAddToBasketLine" onclick="addSelectedLineToBasket()" style="font-size: 11px; font-weight: bold; height: 31px;">
                  <i class="bi bi-cart-plus-fill"></i> 存入分析清單
                </button>
                <div class="d-flex align-items-center gap-1 flex-grow-1 justify-content-end">
                  <div class="input-group input-group-sm" style="max-width: 160px; height: 31px;">
                    <span class="input-group-text bg-dark border-secondary text-muted" style="font-size: 11px;">檔案名稱</span>
                    <input type="text" id="lineFilePrefix" class="form-control form-control-custom text-light bg-dark border-secondary py-1" value="LN" style="font-size: 12px;">
                  </div>
                  <button class="btn btn-outline-info btn-sm" id="btnExportTxtLineRange" onclick="exportSelectedLineToTxt('range')" style="font-size: 11px; font-weight: bold; border-color: rgba(14, 165, 233, 0.4); height: 31px;" title="合併所選日期為單一 .txt 檔案下載">
                    <i class="bi bi-file-earmark-arrow-down"></i> 區間匯出
                  </button>
                  <button class="btn btn-outline-info btn-sm" id="btnExportTxtLineEach" onclick="exportSelectedLineToTxt('each')" style="font-size: 11px; font-weight: bold; border-color: rgba(14, 165, 233, 0.4); height: 31px;" title="所選日期個別下載為獨立的 .txt 檔案">
                    <i class="bi bi-files"></i> 逐筆匯出
                  </button>
                  <button class="btn btn-outline-warning btn-sm" onclick="previewSelectedLineExport()" style="font-size: 11px; font-weight: bold; border-color: rgba(245, 158, 11, 0.4); height: 31px;" title="在下載前預覽將要產生的匯出檔案內容">
                    <i class="bi bi-eye"></i> 預覽匯出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DATABASE Official Account Slicer Card -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="glass-card">
          <div class="card-title-custom" style="color: #a78bfa;">
            <i class="bi bi-robot"></i> 📱 官方助手對話紀錄切割器
          </div>
          
          <div class="row g-4">
            <!-- Left Column: Source & Date Slices -->
            <div class="col-12">
              <h5 class="small fw-bold text-light mb-3">1. 選擇官方帳號與對話群組</h5>
              
              <div class="mb-3 d-flex gap-2">
                <select id="dbChatsSelect" class="form-select form-select-custom" style="flex: 1;" onchange="handleDbChatsSelectChange()">
                  <option value="">請先建立系統連線以載入官方帳號列表...</option>
                </select>
                <button class="btn btn-custom px-3" onclick="loadDbChatEvents()" id="btnLoadDbChat" disabled>
                  <i class="bi bi-search"></i> 載入對話
                </button>
                <button class="btn btn-outline-info px-2" onclick="previewSelectedDbChat()" id="btnPreviewDbChat" disabled title="預覽選取的官方帳號備份檔案內容">
                  <i class="bi bi-eye"></i> 預覽
                </button>
                <button class="btn btn-outline-secondary px-2" onclick="promptEditDbChatNickname()" id="btnEditDbChatNickname" disabled title="修改此官方帳號群組的自訂別名(暱稱)">
                  <i class="bi bi-pencil"></i> 暱稱
                </button>
              </div>
              <div id="dbEventsLoadStatus" class="small text-muted mb-4"></div>
              
              <!-- Date Range Filter Row -->
              <div class="row g-2 mb-3 align-items-end p-2 rounded border border-secondary" style="background: rgba(15, 23, 42, 0.4); margin: 0 1px 12px 1px;">
                <div class="col-md-4 col-sm-6">
                  <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">開始日期</label>
                  <input type="date" id="dbFilterStartDate" class="form-control form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" onchange="applyDbDateRangeFilter()">
                </div>
                <div class="col-md-4 col-sm-6">
                  <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">結束日期</label>
                  <input type="date" id="dbFilterEndDate" class="form-control form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" onchange="applyDbDateRangeFilter()">
                </div>
                <div class="col-md-4 col-12">
                  <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">快速區間</label>
                  <div class="d-flex gap-1" style="height: 32px;">
                    <button class="btn btn-outline-info btn-sm flex-grow-1 py-0 px-1" onclick="applyDbPresetRange(7)" style="font-size: 11px; line-height: 1;">近7天</button>
                    <button class="btn btn-outline-info btn-sm flex-grow-1 py-0 px-1" onclick="applyDbPresetRange(30)" style="font-size: 11px; line-height: 1;">近30天</button>
                    <button class="btn btn-outline-info btn-sm flex-grow-1 py-0 px-1" onclick="applyDbPresetRange('year')" style="font-size: 11px; line-height: 1;">今年</button>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="small fw-bold text-light mb-0">2. 對話日期區間切割 (勾選以包含)</h5>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-secondary btn-sm py-0 px-2" onclick="toggleSelectAllDbDates(true)" style="font-size: 11px;">全選</button>
                  <button class="btn btn-outline-secondary btn-sm py-0 px-2" onclick="toggleSelectAllDbDates(false)" style="font-size: 11px;">清空</button>
                </div>
              </div>
              
              <!-- Slicing Checklist -->
              <div id="dbDateSlicesList" class="date-slice-container">
                <div class="text-center py-5 text-secondary small">
                  <i class="bi bi-calendar-x-fill display-6 d-block mb-2 text-muted"></i>
                  請先選取官方帳號並載入對話以產生日格清單
                </div>
              </div>
              
              <!-- Action buttons for Database Slicer -->
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 pt-2 border-top border-secondary">
                <button class="btn btn-outline-purple btn-sm" id="btnAddToBasketDb" onclick="addSelectedDbToBasket()" style="font-size: 11px; font-weight: bold; height: 31px;">
                  <i class="bi bi-cart-plus-fill"></i> 存入分析清單
                </button>
                <div class="d-flex align-items-center gap-1 flex-grow-1 justify-content-end">
                  <div class="input-group input-group-sm" style="max-width: 160px; height: 31px;">
                    <span class="input-group-text bg-dark border-secondary text-muted" style="font-size: 11px;">檔案名稱</span>
                    <input type="text" id="dbFilePrefix" class="form-control form-control-custom text-light bg-dark border-secondary py-1" value="DB" style="font-size: 12px;">
                  </div>
                  <button class="btn btn-outline-info btn-sm" id="btnExportTxtDbRange" onclick="exportSelectedDbToTxt('range')" style="font-size: 11px; font-weight: bold; border-color: rgba(14, 165, 233, 0.4); height: 31px;" title="合併所選日期為單一 .txt 檔案下載">
                    <i class="bi bi-file-earmark-arrow-down"></i> 區間匯出
                  </button>
                  <button class="btn btn-outline-info btn-sm" id="btnExportTxtDbEach" onclick="exportSelectedDbToTxt('each')" style="font-size: 11px; font-weight: bold; border-color: rgba(14, 165, 233, 0.4); height: 31px;" title="所選日期個別下載為獨立的 .txt 檔案">
                    <i class="bi bi-files"></i> 逐筆匯出
                  </button>
                  <button class="btn btn-outline-warning btn-sm" onclick="previewSelectedDbExport()" style="font-size: 11px; font-weight: bold; border-color: rgba(245, 158, 11, 0.4); height: 31px;" title="在下載前預覽將要產生的匯出檔案內容">
                    <i class="bi bi-eye"></i> 預覽匯出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KM Knowledge Base Card -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="glass-card" style="border-color: rgba(99, 102, 241, 0.2) !important;">
          <div class="card-title-custom" style="color: #818cf8;">
            <i class="bi bi-journal-bookmark-fill"></i> 📚 知識庫文字導入器 (KM)
          </div>
          
          <div class="row g-4">
            <!-- Left Column: Input and Control -->
            <div class="col-lg-6">
              <p class="small text-muted mb-3">您可以直接貼入純文字、貼入 HTML 代碼，或是上傳 \`.txt\` 或 \`.html\` 格式的知識庫文件。系統支援自動/手動將 HTML 清洗並轉換為乾淨的 Markdown 格式。</p>
              
              <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
                <input type="file" id="kmFileInput" accept=".txt,.html" class="d-none" onchange="handleKmFileSelect(event)">
                <button class="btn btn-outline-primary btn-sm" onclick="document.getElementById('kmFileInput').click()">
                  <i class="bi bi-file-earmark-arrow-up"></i> 上傳本機檔案 (.txt/.html)
                </button>
                <button class="btn btn-outline-info btn-sm" id="btnKmConvert" onclick="triggerKmHtmlConversion()">
                  <i class="bi bi-code-slash"></i> HTML 轉 Markdown
                </button>
                <button class="btn btn-outline-purple btn-sm" id="btnAddToBasketKm" onclick="addKmToBasket()">
                  <i class="bi bi-cart-plus-fill"></i> 存入分析清單
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="clearKmData()">
                  <i class="bi bi-trash"></i> 清除內容
                </button>
              </div>

              <div class="form-check form-switch mb-0">
                <input class="form-check-input" type="checkbox" id="kmIncludeCheck" onchange="handleKmCheckboxChange(this)">
                <label class="form-check-label small fw-bold text-light" for="kmIncludeCheck">
                  ☑️ 將此知識庫資料併入 AI 綜合分析
                </label>
              </div>
            </div>
            
            <!-- Right Column: Text Input / Editor -->
            <div class="col-lg-6">
              <div class="mb-0">
                <label class="form-label small fw-bold text-light mb-2">知識庫內文 (純文字 / Markdown):</label>
                <textarea id="kmTextInput" class="form-control form-control-custom" rows="6" placeholder="請在此貼上或匯入內容..." oninput="handleKmTextInput()"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analysis Context Basket Card -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="glass-card" style="border-color: rgba(139, 92, 246, 0.2) !important;">
          <div class="card-title-custom" style="color: #a78bfa;">
            <i class="bi bi-cart3"></i> 📋 FALO 綜合分析購物車 (已選上下文清單)
          </div>
          
          <div id="analysisBasketEmptyState" class="text-center py-4 text-secondary small">
            <i class="bi bi-inbox display-6 d-block mb-2 text-muted"></i>
            目前分析清單為空，請從上方 LINE、官方助手或知識庫勾選內容並點擊「存入分析清單」按鈕加入。
          </div>
          
          <div id="analysisBasketContainer" class="d-none">
            <div class="table-responsive">
              <table class="table table-dark table-hover table-sm align-middle small mb-0" style="background: transparent !important;">
                <thead>
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <th style="width: 50px; padding: 8px;">啟用</th>
                    <th style="width: 80px; padding: 8px;">類型</th>
                    <th style="padding: 8px;">資料源描述</th>
                    <th style="width: 100px; padding: 8px;">字數</th>
                    <th style="width: 140px; padding: 8px; text-align: center;">排序/操作</th>
                  </tr>
                </thead>
                <tbody id="analysisBasketTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- UNIFIED AI Analysis Center Card -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="glass-card" style="border-color: rgba(52, 211, 153, 0.2) !important;">
          <div class="card-title-custom d-flex justify-content-between align-items-center flex-wrap gap-2" style="color: #34d399; min-height: 40px; padding-bottom: 8px;">
            <div><i class="bi bi-robot"></i> 🤖 FALO 綜合 AI 分析中心</div>
            <div class="d-flex align-items-center gap-3">
              <!-- Font Size Control -->
              <div class="d-flex align-items-center gap-1" style="font-size: 12px; font-weight: normal; color: var(--text-light);">
                <span>字體:</span>
                <button class="btn btn-outline-secondary btn-xs py-0 px-2 text-light border-secondary" onclick="adjustPromptTextareasFontSize(-1)" style="font-size: 11px; height: 22px; line-height: 1;">A-</button>
                <span id="promptTextareaFontSizeLabel" style="min-width: 32px; text-align: center; display: inline-block;">13px</span>
                <button class="btn btn-outline-secondary btn-xs py-0 px-2 text-light border-secondary" onclick="adjustPromptTextareasFontSize(1)" style="font-size: 11px; height: 22px; line-height: 1;">A+</button>
              </div>
              <!-- Height Control -->
              <div class="d-flex align-items-center gap-1" style="font-size: 12px; font-weight: normal; color: var(--text-light);">
                <span>高度:</span>
                <button class="btn btn-outline-secondary btn-xs py-0 px-2 text-light border-secondary" onclick="adjustPromptTextareasHeight(-30)" style="font-size: 11px; height: 22px; line-height: 1;">H-</button>
                <span id="promptTextareasHeightLabel" style="min-width: 42px; text-align: center; display: inline-block;">300px</span>
                <button class="btn btn-outline-secondary btn-xs py-0 px-2 text-light border-secondary" onclick="adjustPromptTextareasHeight(30)" style="font-size: 11px; height: 22px; line-height: 1;">H+</button>
              </div>
            </div>
          </div>
          
          <div class="row g-4">
            <!-- Left Column: Prompt Input & Model Config -->
            <div class="col-lg-6">
              <h5 class="small fw-bold text-light mb-3">1. AI 分析設定與提示詞指令</h5>
              
              <div class="mb-3">
                <label class="form-label small fw-bold text-light">分析任務指令 (AI Prompt):</label>
                <textarea id="unifiedAiPromptInput" class="form-control form-control-custom" oninput="updateUnifiedCompiledContext()" style="height: 300px; font-size: 13px; resize: vertical;">請分析以下對話紀錄，摘要雙方討論重點、已達成的決議以及待辦事項 (Task, Owner, Due Date)。
（提示：請使用結構清晰的 Markdown 格式輸出，前端會自動將其渲染為 HTML 好讀版，請在輸出時同時考慮 MD 原始碼與 HTML 網頁版之閱讀美感，善用標題、粗體、清單與表格排版。）</textarea>
              </div>

              <!-- Prompt Manager Widget -->
              <div class="p-3 rounded border border-secondary mb-3" style="background: rgba(30, 41, 59, 0.4);">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small fw-bold text-light" style="font-size: 12px;"><i class="bi bi-bookmarks-fill text-info"></i> 💡 提示詞範本庫</span>
                  <div class="d-flex gap-1">
                    <button class="btn btn-outline-info btn-xs py-0 px-2" onclick="showAddPromptForm()" style="font-size: 11px;">新增</button>
                    <button class="btn btn-outline-secondary btn-xs py-0 px-2" onclick="document.getElementById('importPromptCsvInput').click()" style="font-size: 11px;">匯入 CSV</button>
                    <button class="btn btn-outline-secondary btn-xs py-0 px-2" onclick="exportPromptsToCsv()" style="font-size: 11px;">匯出 CSV</button>
                    <input type="file" id="importPromptCsvInput" accept=".csv" class="d-none" onchange="importPromptsFromCsv(event)">
                  </div>
                </div>
                
                <!-- Presets list group -->
                <div class="list-group border border-secondary mb-2" id="promptTemplateList" style="max-height: 220px; height: 180px; overflow-y: auto; background: rgba(15, 23, 42, 0.4); border-radius: 6px;">
                  <!-- Populated dynamically -->
                </div>

                <!-- Add/Edit Inline Form (Hidden by default) -->
                <div id="addPromptForm" class="border border-secondary p-3 rounded mb-2 d-none" style="background: rgba(15, 23, 42, 0.75);">
                  <div class="mb-2">
                    <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: bold;">提示詞名稱</label>
                    <input type="text" id="newPromptName" class="form-control form-control-custom text-light py-1" style="font-size: 12px; height: 30px;" placeholder="例如: 客服滿意度檢測">
                  </div>
                  <div class="mb-2">
                    <label class="form-label text-muted mb-1" style="font-size: 11px; font-weight: bold;">提示詞內容</label>
                    <textarea id="newPromptContent" class="form-control form-control-custom text-light" rows="4" style="font-size: 12px;" placeholder="請輸入完整的 AI 提示詞指令..."></textarea>
                  </div>
                  <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-outline-secondary btn-sm py-1 px-3" onclick="hideAddPromptForm()" style="font-size: 11px;">取消</button>
                    <button class="btn btn-info btn-sm py-1 px-3" onclick="saveNewPromptTemplate()" style="font-size: 11px; font-weight: bold;">儲存</button>
                  </div>
                </div>
              </div>

            </div>
            
            <!-- Right Column: Unified Markdown Preview & Report -->
            <div class="col-lg-6">
              <h5 class="small fw-bold text-light mb-3">2. 雙對話整合預覽與 AI 報告</h5>
              
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label class="form-label small fw-bold text-light mb-0">整合對話內容預覽 (Markdown):</label>
                  <span id="unifiedPreviewStats" class="small text-muted" style="font-size: 11px;">LINE: 0天 | 官方助手: 0天 | 總字數: 0</span>
                </div>
                <textarea id="unifiedCompiledContextPreview" class="form-control preview-textarea" readonly placeholder="此處將自動整合上方 LINE 及官方助手勾選 the 對話內容..." style="height: 300px; font-size: 13px; resize: vertical;"></textarea>
              </div>

              <div class="d-flex gap-2 mb-3">
                <button class="btn btn-custom flex-grow-1" id="btnCopyUnifiedContext" onclick="copyUnifiedCompiledContext()">
                  <i class="bi bi-clipboard-check"></i> 複製完整 Context (已併入對話)
                </button>
              </div>

              <!-- AI Provider & Model Select Row -->
              <div class="p-3 rounded border border-secondary mb-3" style="background: rgba(15, 23, 42, 0.5);">
                <div class="row g-2 align-items-center">
                  <!-- AI Provider -->
                  <div class="col-md-6 col-12">
                    <label class="form-label small fw-bold text-light mb-1"><i class="bi bi-cpu"></i> 選擇 AI 服務商</label>
                    <select id="unifiedAiProvider" class="form-select form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" onchange="toggleUnifiedAiProviderVisibility()">
                      <option value="builtin">☁️ 內建 AI (Cloudflare Workers)</option>
                      <option value="gemini">✨ Google Gemini API</option>
                    </select>
                  </div>

                  <!-- Built-in Model Selector -->
                  <div class="col-md-6 col-12" id="builtinModelCol">
                    <label class="form-label small fw-bold text-light mb-1"><i class="bi bi-robot"></i> 內建 AI 模型</label>
                    <select id="unifiedBuiltinModel" class="form-select form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;">
                      <option value="@cf/mistralai/mistral-small-3.1-24b-instruct" selected>Mistral Small 24B (中型長文本 - 預設)</option>
                      <option value="@cf/meta/llama-3.3-70b-instruct-fp8-fast">Llama 3.3 70B (進階高智能)</option>
                      <option value="@cf/meta/llama-3.2-3b-instruct">Llama 3.2 3B (輕量對話極速)</option>
                    </select>
                  </div>
                  
                  <!-- Gemini Model Selector -->
                  <div class="col-md-6 col-12" id="geminiModelCol" style="display: none;">
                    <label class="form-label small fw-bold text-light mb-1"><i class="bi bi-robot"></i> Gemini 模型</label>
                    <select id="unifiedGeminiModel" class="form-select form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;">
                      <option value="gemini-3.1-flash-lite" selected>Gemini 3.1 Flash-Lite (預設)</option>
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                      <option value="gemini-3.1-flash">Gemini 3.1 Flash</option>
                      <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite</option>
                    </select>
                  </div>

                  <!-- Gemini API Key input -->
                  <div class="col-12 mt-2" id="geminiKeyCol" style="display: none;">
                    <label class="form-label small fw-bold text-light mb-1"><i class="bi bi-key"></i> Gemini API Key (可選，留空則使用系統預設)</label>
                    <div class="d-flex gap-1">
                      <input type="password" id="unifiedGeminiKey" class="form-control form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" placeholder="輸入 API Key">
                      <button class="btn btn-outline-success btn-sm px-2" onclick="saveGeminiKey('unified')" title="儲存至瀏覽器"><i class="bi bi-save"></i> 儲存</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <button class="btn btn-emerald w-100 py-2 fw-bold mb-3" onclick="runUnifiedAiAnalysis()" id="btnUnifiedAnalyze" style="background: linear-gradient(135deg, #10b981, #059669); border: none;">
                <i class="bi bi-robot"></i> 🤖 執行 AI 綜合對話分析
              </button>

              <!-- AI Output Report Container -->
              <div id="unifiedAiReportBox" class="mt-3 p-3 rounded bg-dark border border-secondary text-light d-none" style="background: rgba(15, 23, 42, 0.8) !important;">
                <div class="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
                  <span class="small fw-bold text-emerald"><i class="bi bi-journal-text"></i> AI 綜合分析報告</span>
                  
                  <!-- Switch button group -->
                  <div class="d-flex align-items-center gap-2">
                    <div class="btn-group" role="group" aria-label="Format Selector" style="height: 24px;">
                      <button type="button" class="btn btn-outline-success btn-xs px-2 active" id="btnFormatMd" onclick="setReportFormat('md')" style="font-size: 10px; line-height: 1.2;">MD 原始碼</button>
                      <button type="button" class="btn btn-outline-success btn-xs px-2" id="btnFormatHtml" onclick="setReportFormat('html')" style="font-size: 10px; line-height: 1.2;">網頁預覽/HTML</button>
                    </div>
                    <button class="btn btn-outline-info btn-xs py-0 px-2" onclick="downloadAiReport()" style="font-size: 10px; height: 24px;"><i class="bi bi-download"></i> 下載檔案</button>
                    <button class="btn btn-outline-secondary btn-xs py-0 px-2" onclick="copyAiReport()" style="font-size: 10px; height: 24px;"><i class="bi bi-clipboard"></i> 複製報告</button>
                  </div>
                  </div>
                
                <!-- Token Usage & Estimations -->
                <div id="unifiedAiUsageStats" class="d-none alert alert-info py-2 px-3 mb-3 small" style="background: rgba(14, 165, 233, 0.1); border-color: rgba(14, 165, 233, 0.2); font-size: 11px;">
                  <i class="bi bi-calculator"></i> <strong>📊 Token 消耗與成本預估：</strong>
                  <span id="usageStatsDetails">計算中...</span>
                </div>
                
                <!-- MD View -->
                <textarea id="unifiedAiReportMdView" class="form-control form-control-custom text-light small lh-base" rows="12" readonly style="font-size: 12.5px; font-family: monospace; background: rgba(0,0,0,0.2); border: none; resize: vertical;" placeholder="正在生成 Markdown 報告..."></textarea>
                
                <!-- HTML View -->
                <div id="unifiedAiReportHtmlView" class="small lh-base d-none" style="font-size: 12.5px; max-height: 400px; overflow-y: auto; padding: 5px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guided Setup Tutorial Row -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="glass-card">
          <div class="card-title-custom" style="color: #34d399;">
            <i class="bi bi-journal-bookmark-fill"></i> 📚 LINE Bot & Webhook 連線對接教學 (系統指引)
          </div>
          
          <div class="accordion accordion-flush" id="setupAccordion" style="--bs-accordion-bg: transparent; --bs-accordion-color: var(--text-light); --bs-accordion-btn-color: var(--text-light); --bs-accordion-active-color: #34d399;">
            
            <!-- Step 1 -->
            <div class="accordion-item border-bottom" style="border-color: rgba(255,255,255,0.05) !important; background: transparent;">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed px-0 py-3" style="background: transparent; box-shadow: none;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  <span class="badge bg-secondary me-2">步驟 1</span> 登入 LINE Developers 後台
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                <div class="accordion-body px-0 text-muted" style="font-size: 14px; line-height: 1.6;">
                  請使用您的 Google / LINE 帳號登入 <a href="https://developers.line.biz/console/" target="_blank" class="text-info">LINE Developers Console</a>。
                  在您的 Provider 列表中，選取已經建立好的 Channel：<strong>\`FALO IM Bot Test\`</strong>。
                  <div class="mt-3 text-center p-4 border rounded bg-dark-subtle text-muted" style="border-style: dashed !important;">
                    <i class="bi bi-image me-1"></i> [請在此處貼上 LINE Developers 登入與頻道選取頁面截圖]
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="accordion-item border-bottom" style="border-color: rgba(255,255,255,0.05) !important; background: transparent;">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed px-0 py-3" style="background: transparent; box-shadow: none;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  <span class="badge bg-secondary me-2">步驟 2</span> 設定 Webhook URL 網址
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                <div class="accordion-body px-0 text-muted" style="font-size: 14px; line-height: 1.6;">
                  1. 點擊頻道分頁中的 <strong>\`Messaging API\`</strong>。<br>
                  2. 往下滾動找到 <strong>\`Webhook settings\`</strong>，點選 <strong>\`Edit\`</strong>。<br>
                  3. 複製右上方大腦環境狀態中綠色框標記的<strong>「LINE Webhook 代理端點」</strong>，並貼入欄位中。<br>
                  4. 點擊 <strong>\`Update\`</strong> 存檔。
                  <div class="mt-3 text-center p-4 border rounded bg-dark-subtle text-muted" style="border-style: dashed !important;">
                    <i class="bi bi-image me-1"></i> [請在此處貼上 Webhook URL 貼入與存檔設定截圖]
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="accordion-item border-bottom" style="border-color: rgba(255,255,255,0.05) !important; background: transparent;">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed px-0 py-3" style="background: transparent; box-shadow: none;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  <span class="badge bg-secondary me-2">步驟 3</span> 啟用 Webhook 並點擊驗證
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                <div class="accordion-body px-0 text-muted" style="font-size: 14px; line-height: 1.6;">
                  1. 在 Webhook URL 欄位下方，將 <strong>\`Use webhook\`</strong> 切換至<strong>開啟 (Enabled)</strong>。<br>
                  2. 點擊 Webhook URL 旁的 <strong>\`Verify\`</strong> (驗證) 按鈕。<br>
                  3. 看到綠色 <strong>\`Success\`</strong> 彈窗表示大腦與 LINE 已成功串接！
                  <div class="mt-3 text-center p-4 border rounded bg-dark-subtle text-muted" style="border-style: dashed !important;">
                    <i class="bi bi-image me-1"></i> [請在此處貼上 Use Webhook 啟用與 Verify Success 驗證通過截圖]
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="accordion-item border-bottom-0" style="background: transparent;">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed px-0 py-3" style="background: transparent; box-shadow: none;" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                  <span class="badge bg-secondary me-2">步驟 4</span> 掃碼加好友並傳送對話測試
                </button>
              </h2>
              <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#setupAccordion">
                <div class="accordion-body px-0 text-muted" style="font-size: 14px; line-height: 1.6;">
                  1. 掃描 \`Messaging API\` 頁面最上方的 **Bot QR Code** 加入好友。<br>
                  2. 在您的手機 LINE 中隨意傳送一句文字訊息給官方 Bot。<br>
                  3. 開啟您的 Google 試算表 \`chat_events\` 工作表，確認該筆對話資料已即時寫入資料庫！
                  <div class="mt-3 text-center p-4 border rounded bg-dark-subtle text-muted" style="border-style: dashed !important;">
                    <i class="bi bi-image me-1"></i> [請在此處貼上 手機 LINE 聊天畫面與 Google 試算表寫入成功截圖]
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
    <!-- Footer Signature -->
    <footer class="mt-5 mb-4 pt-4 border-top border-secondary text-center text-muted" style="border-top-color: rgba(255,255,255,0.05) !important; font-size: 12px;">
      <p class="mb-1">Falo IM v2.01 &copy; 2026. All Rights Reserved.</p>
      <p class="mb-0">Created by <span class="text-teal" style="color: var(--primary-teal); font-weight: 600;">Falo Studio x Force Cheng</span> | 發布日期: 2026/7/5</p>
    </footer>
    
  </div>

  <!-- JavaScript logic -->
  <script>
    // Global state for AI Analysis Reports
    let rawAiReportText = "";
    let currentReportFormat = "md";
    let analysisBasket = [];

    // Auto load cached configs
    window.addEventListener('DOMContentLoaded', () => {
      const cachedUrl = localStorage.getItem('gasExplorerUrl') || 'https://script.google.com/macros/s/AKfycbwoXAjRW4z01O5BR_6bAqf_Wx7Ev3P8Z-Pu3CV7Cj0iwnRo_vvd5Kn-FZbL-7zsXg2Urw/exec';
      const cachedToken = localStorage.getItem('viewerToken') || 'falo_secure_token_12345';
      
      document.getElementById('gasUrlInput').value = cachedUrl;
      document.getElementById('tokenInput').value = cachedToken;
      
      // Calculate and display Cloudflare Webhook Endpoint URL
      updateWebhookDisplay();
      
      
      // Initialize prompt templates
      renderPromptTemplates();
      selectPromptTemplate(selectedPromptKey);

      if (cachedUrl) {
        // Automatically attempt silent connection on load
        testConnection(true);
      }
    });

    function copyWebhookUrl() {
      const urlText = document.getElementById('cfWebhookEndpoint').innerText;
      navigator.clipboard.writeText(urlText).then(() => {
        alert('已成功複製 Webhook 代理網址：\\n' + urlText);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback copy method
        const tempInput = document.createElement('input');
        tempInput.value = urlText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('已複製 Webhook 代理網址：\\n' + urlText);
      });
    }

    async function testConnection(silent = false) {
      const urlInput = document.getElementById('gasUrlInput');
      const tokenInput = document.getElementById('tokenInput');
      const globalStatus = document.getElementById('globalStatusBadge');
      
      const emptyPanel = document.getElementById('diagnosticsEmpty');
      const detailsPanel = document.getElementById('diagnosticsDetails');
      
      const sheetLink = document.getElementById('dbSheetLink');
      const folderLink = document.getElementById('dbFolderLink');
      const botsList = document.getElementById('dbBotsList');
      const endpointText = document.getElementById('dbScriptEndpoint');

      let url = urlInput.value.trim();
      let token = tokenInput.value.trim();

      if (!url) {
        if (!silent) alert('請先輸入 GAS Web App URL 網址！');
        return;
      }

      // Cache token for next-step actions
      if (token) {
        localStorage.setItem('viewerToken', token);
      }

      // Construct explore query (token-free action=info)
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += '?action=info';
      } else if (fetchUrl.indexOf('action=') === -1) {
        fetchUrl += '&action=info';
      }

      globalStatus.className = 'badge-status badge-connecting';
      globalStatus.innerText = '正在連線...';

      try {
        console.log("Connecting to GAS Web App info API: " + fetchUrl);
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error('HTTP 失敗！狀態碼: ' + response.status);
        }
        const result = await response.json();
        console.log("Connection result: ", result);

        if (result.ok && result.spreadsheet) {
          // Cache successful URL
          localStorage.setItem('gasExplorerUrl', url);

          // Update UI Status
          globalStatus.className = 'badge-status badge-online';
          globalStatus.innerText = '已連線';

          emptyPanel.classList.add('d-none');
          detailsPanel.classList.remove('d-none');

          // Populate sheet details
          sheetLink.href = result.spreadsheet.url;
          sheetLink.innerHTML = \`<i class="bi bi-file-earmark-spreadsheet-fill me-1 text-success"></i> \${result.spreadsheet.name}\`;
          sheetLink.title = \`ID: \${result.spreadsheet.id}\`;

          // Populate folder details
          if (result.parentFolder) {
            folderLink.href = result.parentFolder.url;
            folderLink.innerHTML = \`<i class="bi bi-folder-fill me-1 text-warning"></i> \${result.parentFolder.name}\`;
            folderLink.title = \`ID: \${result.parentFolder.id}\`;
          } else {
            folderLink.href = '#';
            folderLink.innerHTML = \`<i class="bi bi-folder-fill me-1 text-secondary"></i> 無母資料夾\`;
          }

          // Populate bots list
          if (result.bots && result.bots.length > 0) {
            const listHtml = result.bots.map(b => 
              \`<span class="badge bg-dark border border-secondary text-light me-1 mb-1 p-2" style="font-size: 11px;">
                <i class="bi bi-robot text-teal me-1" style="color: #14b8a6;"></i> \${b.bot_name} (\${b.bot_alias})
               </span>\`
            ).join('');
            botsList.innerHTML = listHtml;
          } else {
            botsList.innerHTML = '<span class="text-secondary small">（尚未註冊任何 Bot）</span>';
          }

          // Script URL
          endpointText.innerText = result.scriptUrl || url;

          // Fetch Drive files and Database chats list after successful connection
          refreshDriveFiles(url, token);
          refreshDbChats(url, token);

        } else {
          throw new Error(result.error || '回傳格式不正確');
        }
      } catch (err) {
        console.error('Connection Error:', err);
        globalStatus.className = 'badge-status badge-offline';
        globalStatus.innerText = '連線失敗';
        
        emptyPanel.classList.remove('d-none');
        detailsPanel.classList.add('d-none');

        if (!silent) {
          alert('連線失敗！請檢查：\\n1. 網址輸入是否正確？\\n2. 線上 Apps Script 的 doGet 是否已發布新版本？\\n3. 瀏覽器是否遇到 Google 帳號多開的重新導向衝突（請嘗試使用 Chrome 訪客模式開啟本網頁）。');
        }
      }
    }

    // ==========================================
    // Slicer & Parser Logic
    // ==========================================
    let parsedChatLog = null; // Stores { chatName, messages }
    let selectedDates = new Set();
    let groupedByDate = {}; // Stores grouped messages

    // 1. Refresh Drive Files list via action=list_files
    async function refreshDriveFiles(url, token) {
      const selectEl = document.getElementById('driveFilesSelect');
      const loadBtn = document.getElementById('btnLoadDriveFile');
      
      selectEl.innerHTML = '<option value="">正在讀取 Drive 檔案清單...</option>';
      loadBtn.disabled = true;
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=list_files&token=\${token}\`;
      } else {
        fetchUrl += \`&action=list_files&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok) {
          // Cache files list
          cachedDriveFiles = result.files || [];
          
          // Update exports folder link
          if (result.exports_folder_url) {
            const folderLink = document.getElementById('linkExportsFolder');
            if (folderLink) folderLink.href = result.exports_folder_url;
            const modalFolderLink = document.getElementById('modalExportsFolderLink');
            if (modalFolderLink) modalFolderLink.href = result.exports_folder_url;
          }
          
          if (result.files && result.files.length > 0) {
            let html = '<option value="">-- 請選擇 Drive 文字檔 --</option>';
            result.files.forEach(f => {
              const kbSize = Math.round(f.size / 1024);
              const formattedDate = f.created ? f.created.substring(0, 16).replace('T', ' ') : '未知';
              const label = f.isRegistered
                ? \`\${f.displayName} (上傳: \${formattedDate}) [\${kbSize} KB]\`
                : \`\${f.displayName} (更新: \${formattedDate}) [\${kbSize} KB]\`;
              html += \`<option value="\${f.id}">\${label}</option>\`;
            });
            selectEl.innerHTML = html;
            loadBtn.disabled = false;
          } else {
            selectEl.innerHTML = '<option value="">（未在雲端硬碟找到任何備份 .txt 檔案）</option>';
          }
        } else {
          selectEl.innerHTML = '<option value="">（未在雲端硬碟找到任何備份 .txt 檔案）</option>';
        }
      } catch (err) {
        console.error('Failed to list files:', err);
        selectEl.innerHTML = \`<option value="">讀取失敗: \${err.message}</option>\`;
      } finally {
        toggleDrivePreviewButton();
      }
    }

    // Global cache and handlers for cloud files manager
    let cachedDriveFiles = [];

    async function openCloudFilesManager() {
      // Show Bootstrap Modal
      const modalEl = document.getElementById('cloudFilesManagerModal');
      if (!modalEl) return;
      
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
      
      await refreshManagerFilesList();
    }

    async function refreshManagerFilesList() {
      const tableBody = document.getElementById('managerFilesTableBody');
      if (!tableBody) return;
      
      tableBody.innerHTML = \`
        <tr>
          <td colspan="5" class="text-center py-4 text-secondary">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            正在載入雲端檔案列表...
          </td>
        </tr>
      \`;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=list_files&token=\${token}\`;
      } else {
        fetchUrl += \`&action=list_files&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok && result.files && result.files.length > 0) {
          cachedDriveFiles = result.files;
          
          // Update exports folder link in modal and header
          if (result.exports_folder_url) {
            const folderLink = document.getElementById('linkExportsFolder');
            if (folderLink) folderLink.href = result.exports_folder_url;
            const modalFolderLink = document.getElementById('modalExportsFolderLink');
            if (modalFolderLink) modalFolderLink.href = result.exports_folder_url;
          }
          
          let html = '';
          result.files.forEach(f => {
            const kbSize = Math.round(f.size / 1024);
            const formattedDate = f.created ? f.created.substring(0, 16).replace('T', ' ') : '未知';
            
            // Determine display name vs original filename
            const isReg = f.isRegistered;
            const regBadge = isReg 
              ? '<span class="badge bg-success bg-opacity-20 text-success ms-2" style="font-size: 10px;">已註冊別名</span>' 
              : '<span class="badge bg-secondary bg-opacity-20 text-secondary ms-2" style="font-size: 10px;">未註冊</span>';
            
            html += \`
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td>
                  <div class="d-flex align-items-center justify-content-between">
                    <span class="fw-bold text-teal" style="color: var(--primary-teal);">\${f.displayName}</span>
                    <button class="btn btn-sm btn-link text-muted p-0" onclick="promptRenameCloudFile('\${f.id}', '\${f.displayName.replace(/'/g, "\\\\'")}')" title="編輯別名">
                      <i class="bi bi-pencil-square text-info"></i>
                    </button>
                  </div>
                </td>
                <td>
                  <div class="text-truncate" style="max-width: 320px;" title="\${f.name}">
                    <span class="text-light">\${f.name}</span>
                    <div class="small text-muted" style="font-size: 11px;">ID: \${f.id} \${regBadge}</div>
                  </div>
                </td>
                <td class="text-secondary">\${kbSize} KB</td>
                <td class="text-secondary">\${formattedDate}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-danger py-1 px-2" onclick="deleteCloudFile('\${f.id}', '\${f.displayName.replace(/'/g, "\\\\'")}')" title="將檔案移至垃圾桶並刪除資料庫紀錄">
                    <i class="bi bi-trash3-fill"></i> 刪除
                  </button>
                </td>
              </tr>
            \`;
          });
          tableBody.innerHTML = html;
        } else {
          tableBody.innerHTML = \`
            <tr>
              <td colspan="5" class="text-center py-5 text-secondary">
                <i class="bi bi-folder-x display-6 d-block mb-2 text-muted"></i>
                沒有在 exports/ 資料夾下找到備份檔案
              </td>
            </tr>
          \`;
        }
      } catch (err) {
        tableBody.innerHTML = \`
          <tr>
            <td colspan="5" class="text-center py-4 text-danger">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> 讀取雲端列表失敗: \${err.message}
            </td>
          </tr>
        \`;
      }
    }

    // Prompts user for a new alias
    window.promptRenameCloudFile = function(fileId, currentAlias) {
      const newAlias = prompt(\`修改此雲端對話備份的顯示別名：\`, currentAlias);
      if (newAlias === null) return; // Cancelled
      if (!newAlias.trim()) {
        alert('別名不能為空！');
        return;
      }
      updateCloudFileAlias(fileId, newAlias.trim());
    }

    // Sends POST to update alias in dialogue_registry
    async function updateCloudFileAlias(fileId, newAlias) {
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=update_dialogue_alias&token=\${token}\`;
      } else {
        fetchUrl += \`&action=update_dialogue_alias&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl, {
          method: 'POST',
          body: JSON.stringify({
            file_id: fileId,
            new_alias: newAlias
          })
        });
        
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok) {
          alert('別名修改成功！');
          // Refresh list inside modal
          await refreshManagerFilesList();
          // Also refresh main dropdown list
          await refreshDriveFiles(url, token);
        } else {
          throw new Error(result.error || '修改失敗');
        }
      } catch (err) {
        alert(\`修改別名失敗: \${err.message}\`);
      }
    }

    // Sends POST to trash file and remove registry
    window.deleteCloudFile = async function(fileId, displayName) {
      const confirmDelete = confirm(\`確定要將「\${displayName}」從雲端硬碟中刪除嗎？\\\\n這會將實體檔案移至 Google Drive 垃圾桶，並清除資料庫關聯註冊，此操作將無法還原！\`);
      if (!confirmDelete) return;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=delete_dialogue_file&token=\${token}\`;
      } else {
        fetchUrl += \`&action=delete_dialogue_file&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl, {
          method: 'POST',
          body: JSON.stringify({
            file_id: fileId
          })
        });
        
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok) {
          alert('檔案已成功刪除並解除註冊！');
          // Refresh list inside modal
          await refreshManagerFilesList();
          // Also refresh main dropdown list
          await refreshDriveFiles(url, token);
        } else {
          throw new Error(result.error || '刪除失敗');
        }
      } catch (err) {
        alert(\`刪除檔案失敗: \${err.message}\`);
      }
    }

    // 2. Load drive file content via action=get_file_content
    async function loadSelectedDriveFile() {
      const selectEl = document.getElementById('driveFilesSelect');
      const fileId = selectEl.value;
      const statusEl = document.getElementById('driveLoadStatus');
      const loadBtn = document.getElementById('btnLoadDriveFile');
      
      if (!fileId) {
        alert('請先選擇一個檔案！');
        return;
      }
      
      statusEl.className = 'small text-warning mt-2';
      statusEl.innerText = '正在從 Drive 下載檔案內容，請稍候...';
      loadBtn.disabled = true;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=get_file_content&file_id=\${fileId}&token=\${token}\`;
      } else {
        fetchUrl += \`&action=get_file_content&file_id=\${fileId}&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const text = await response.text();
        
        statusEl.className = 'small text-success mt-2';
        statusEl.innerText = '下載成功！正在解析...';
        
        processRawText(text);
        
        statusEl.innerText = \`載入成功！共解析出 \${parsedChatLog.messages.length} 筆對話。\`;
      } catch (err) {
        console.error('Failed to get file content:', err);
        statusEl.className = 'small text-danger mt-2';
        statusEl.innerText = \`下載失敗: \${err.message}\`;
      } finally {
        loadBtn.disabled = false;
      }
    }

    function toggleDrivePreviewButton() {
      const selectEl = document.getElementById('driveFilesSelect');
      const previewBtn = document.getElementById('btnPreviewDriveFile');
      if (selectEl && previewBtn) {
        previewBtn.disabled = !selectEl.value;
      }
    }

    async function previewSelectedDriveFile() {
      const selectEl = document.getElementById('driveFilesSelect');
      const fileId = selectEl.value;
      const optionText = selectEl.options[selectEl.selectedIndex].text;
      
      if (!fileId) {
        alert('請先選擇一個檔案！');
        return;
      }
      
      const previewBtn = document.getElementById('btnPreviewDriveFile');
      const originalText = previewBtn.innerHTML;
      previewBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      previewBtn.disabled = true;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=get_file_content&file_id=\${fileId}&token=\${token}\`;
      } else {
        fetchUrl += \`&action=get_file_content&file_id=\${fileId}&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const text = await response.text();
        
        openPreviewWindow(\`雲端檔案預覽：\${optionText}\`, text);
      } catch (err) {
        alert(\`預覽讀取失敗: \${err.message}\`);
      } finally {
        previewBtn.innerHTML = originalText;
        previewBtn.disabled = false;
      }
    }

    function openPreviewWindow(title, content) {
      const win = window.open("", "_blank", "width=900,height=750,scrollbars=yes,resizable=yes");
      if (!win) {
        alert("彈出視窗被瀏覽器封鎖，請允許此網頁的彈出視窗以進行預覽！");
        return;
      }
      
      win.document.write(\`
        <!DOCTYPE html>
        <html>
        <head>
          <title>\${title}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
          <style>
            body {
              background-color: #0b0f19;
              color: #f3f4f6;
              font-family: system-ui, -apple-system, sans-serif;
              padding: 20px;
            }
            pre {
              background-color: #111827;
              border: 1px solid #374151;
              border-radius: 8px;
              padding: 15px;
              color: #f3f4f6;
              font-family: monospace;
              white-space: pre-wrap;
              word-wrap: break-word;
              height: calc(100vh - 100px);
              overflow-y: auto;
              font-size: 13px;
            }
            .header-bar {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              border-bottom: 1px solid #1f2937;
              padding-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <h5 class="m-0 text-purple font-weight-bold" style="color: #a78bfa;"><i class="bi bi-file-earmark-text"></i> \${title}</h5>
            <div>
              <button class="btn btn-sm btn-outline-light me-2" id="copyBtn"><i class="bi bi-clipboard"></i> 複製內容</button>
              <button class="btn btn-sm btn-outline-danger" onclick="window.close()"><i class="bi bi-x-lg"></i> 關閉</button>
            </div>
          </div>
          <pre id="contentContainer"></pre>
        </body>
        </html>
      \`);
      win.document.close();
      
      // Helper function to format and escape HTML for preview with custom syntax coloring
      function formatPreviewHtml(text) {
        const lines = text.split('\\n');
        return lines.map(line => {
          // Escape HTML characters to prevent XSS
          const escaped = line
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
            
          // Check if it's a date header line, e.g., 2026/07/05(週日) or 2021/6/19（週六）
          if (/^\\d{4}[\\/\\-]\\d{1,2}[\\/\\-]\\d{1,2}\\s*(?:\\([^)]+\\)|（[^）]+）)?$/.test(escaped.trim())) {
            return \`<span style="color: #fbbf24; font-weight: bold; font-size: 14px; display: inline-block; margin-top: 12px; margin-bottom: 4px;">\${escaped}</span>\`;
          }
          
          // Check if it's the main file header, e.g., [LINE] ...
          if (escaped.startsWith('[LINE]')) {
            return \`<span style="color: #a78bfa; font-weight: bold; font-size: 15px; display: inline-block; margin-bottom: 5px;">\${escaped}</span>\`;
          }
          
          // Check if it's the file metadata, e.g., 儲存日期：...
          if (escaped.startsWith('儲存日期：')) {
            return \`<span style="color: #9ca3af; font-style: italic; display: inline-block; margin-bottom: 10px;">\${escaped}</span>\`;
          }
          
          // Otherwise, it's normal chat log text. Try formatting as timestamp + sender + message content
          const parts = escaped.split('\\t');
          if (parts.length >= 3) {
            const time = parts[0];
            const sender = parts[1];
            const content = parts.slice(2).join('\\t');
            return \`<span style="color: #6b7280; font-size: 11px;">\${time}</span>\\t<span style="color: #38bdf8; font-weight: 500;">\${sender}</span>\\t<span style="color: #f3f4f6;">\${content}</span>\`;
          }
          
          return \`<span style="color: #f3f4f6;">\${escaped}</span>\`;
        }).join('\\n');
      }
      
      // Populate content and set up clipboard copy directly from parent context
      try {
        win.document.getElementById('contentContainer').innerHTML = formatPreviewHtml(content);
        win.document.getElementById('copyBtn').onclick = function() {
          win.navigator.clipboard.writeText(content).then(() => {
            win.alert('已複製到剪貼簿！');
          }).catch(err => {
            win.alert('複製失敗: ' + err);
          });
        };
      } catch (e) {
        console.error('Failed to populate preview window:', e);
      }
    }

    // 3. Setup local file Drag & Drop
    const dropZone = document.getElementById('dropZone');
    const localInput = document.getElementById('localFileInput');

    // Dragover class
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
      }, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleLocalFile(files[0]);
      }
    });

    localInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleLocalFile(e.target.files[0]);
      }
    });

    let lastLoadedLocalFileName = '';
    let lastLoadedLocalFileContent = '';

    function handleLocalFile(file) {
      if (!file.name.endsWith('.txt')) {
        alert('請上傳 LINE 備份產生的 .txt 檔案格式！');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        
        lastLoadedLocalFileName = file.name;
        lastLoadedLocalFileContent = text;
        
        processRawText(text);
        
        document.getElementById('localFileNameSpan').textContent = file.name;
        document.getElementById('localUploadContainer').style.display = 'block';
        
        alert(\`本機載入成功！共解析出 \${parsedChatLog.messages.length} 筆對話記錄。\`);
      };
      reader.readAsText(file);
    }

    async function uploadLocalFileToCloud() {
      if (!lastLoadedLocalFileName || !lastLoadedLocalFileContent) {
        alert('無效的本機載入檔案內容，請先拖放或選擇本機文字檔！');
        return;
      }
      
      const chatName = parsedChatLog ? (parsedChatLog.chatName || '未命名對話') : '對話備份';
      
      // Format YYYYMMDD date suffix for suggestion alias
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const dateStr = \`\${yyyy}\${mm}\${dd}\`;
      const defaultAlias = \`\${chatName}_\${dateStr}_備份\`;
      
      const alias = prompt('請輸入此對話備份在雲端大腦中的「顯示別名」：', defaultAlias);
      if (alias === null) return; // User cancelled
      
      const uploadBtn = document.getElementById('btnUploadLocalToCloud');
      const originalText = uploadBtn.innerHTML;
      uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 上傳中...';
      uploadBtn.disabled = true;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=upload_file&token=\${token}\`;
      } else {
        fetchUrl += \`&action=upload_file&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl, {
          method: 'POST',
          body: JSON.stringify({
            filename: lastLoadedLocalFileName,
            alias: alias.trim() || lastLoadedLocalFileName,
            content: lastLoadedLocalFileContent
          })
        });
        
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok) {
          alert(\`上傳並註冊成功！\\n雲端別名：\${result.alias}\\n上傳時間：\${result.uploaded_at}\`);
          
          // Switch to Cloud sync panel
          const driveTabBtn = document.querySelector('#slicerTabs button[data-bs-target="#drive-panel"]');
          if (driveTabBtn) {
            const bsTab = new bootstrap.Tab(driveTabBtn);
            bsTab.show();
          }
          
          // Refresh list and select the uploaded file
          await refreshDriveFiles(url, token);
          
          const selectEl = document.getElementById('driveFilesSelect');
          if (selectEl) {
            selectEl.value = result.file_id;
            toggleDrivePreviewButton();
            // Load file content instantly so dates checklist is populated
            loadSelectedDriveFile();
          }
        } else {
          throw new Error(result.error || '上傳失敗');
        }
      } catch (err) {
        alert(\`上傳失敗: \${err.message}\`);
      } finally {
        uploadBtn.innerHTML = originalText;
        uploadBtn.disabled = false;
      }
    }

    // 4. Process raw text and group
    function processRawText(text) {
      parsedChatLog = parseLineChatLog(text);
      groupMessagesByDate();
      
      // Auto-set the Date Range picker inputs to min and max dates
      initDateRangePickerInputs();
      
      renderDateSlices();
      updateUnifiedCompiledContext();
    }

    // 4.1 Initialize date range inputs from parsed data
    function initDateRangePickerInputs() {
      const dates = Object.keys(groupedByDate).sort();
      if (dates.length === 0) return;
      
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      
      const startInput = document.getElementById('filterStartDate');
      const endInput = document.getElementById('filterEndDate');
      
      startInput.min = minDate;
      startInput.max = maxDate;
      endInput.min = minDate;
      endInput.max = maxDate;
      
      // Default to end at maxDate
      endInput.value = maxDate;
      
      // Default range: select last 7 days of the log
      const maxDateObj = new Date(maxDate);
      const startDateObj = new Date(maxDateObj.getTime() - (7 - 1) * 24 * 60 * 60 * 1000);
      
      const y = startDateObj.getFullYear();
      const m = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const d = String(startDateObj.getDate()).padStart(2, '0');
      const startDateStr = \`\${y}-\${m}-\${d}\`;
      
      startInput.value = startDateStr >= minDate ? startDateStr : minDate;
      
      // Default: Unchecked on load
      selectedDates.clear();
    }

    // 4.2 Apply the custom date range filter
    function applyDateRangeFilter() {
      const startVal = document.getElementById('filterStartDate').value;
      const endVal = document.getElementById('filterEndDate').value;
      
      if (!startVal || !endVal) return;
      
      selectedDates.clear();
      Object.keys(groupedByDate).forEach(d => {
        if (d >= startVal && d <= endVal) {
          selectedDates.add(d);
        }
      });
      
      // Sync checkboxes
      const checkboxes = document.querySelectorAll('#dateSlicesList input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.checked = selectedDates.has(cb.value);
      });
      
      updateUnifiedCompiledContext();
    }

    // 4.3 Preset selector (Last X days relative to dataset latest date)
    function applyPresetRange(days) {
      const dates = Object.keys(groupedByDate).sort();
      if (dates.length === 0) return;
      
      const startInput = document.getElementById('filterStartDate');
      const endInput = document.getElementById('filterEndDate');
      
      if (days === 'year') {
        const currentYear = new Date().getFullYear();
        startInput.value = \`\${currentYear}-01-01\`;
        endInput.value = \`\${currentYear}-12-31\`;
      } else {
        const minDate = dates[0];
        const maxDate = dates[dates.length - 1];
        endInput.value = maxDate;
        
        const maxDateObj = new Date(maxDate);
        const startDateObj = new Date(maxDateObj.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
        
        const y = startDateObj.getFullYear();
        const m = String(startDateObj.getMonth() + 1).padStart(2, '0');
        const d = String(startDateObj.getDate()).padStart(2, '0');
        const startDateStr = \`\${y}-\${m}-\${d}\`;
        
        startInput.value = startDateStr >= minDate ? startDateStr : minDate;
      }
      
      applyDateRangeFilter();
    }

    // 5. LINE chat log text parser implementing Falo Spec
    function parseLineChatLog(text) {
      const lines = text.split(/\\r?\\n/);
      if (lines.length === 0) return { chatName: "LINE Chat", messages: [] };
      
      // Parse chat name from first line
      const firstLine = lines[0];
      let chatName = "LINE Chat";
      if (firstLine.startsWith("[LINE]")) {
        chatName = firstLine.replace("[LINE]", "").replace("的聊天記錄", "").replace("的聊天", "").trim();
      }
      
      // Find export date or use current system date + 1 day
      let maxAllowedDateObj = new Date();
      maxAllowedDateObj.setDate(maxAllowedDateObj.getDate() + 1); // fallback tomorrow
      
      const exportDateRegex = /(?:儲存日期|Saved date)[：:\\s]*(\\d{4})[/\\-.年](\\d{1,2})[/\\-.月](\\d{1,2})/;
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const match = lines[i].match(exportDateRegex);
        if (match) {
          const y = match[1];
          const m = match[2].padStart(2, '0');
          const d = match[3].padStart(2, '0');
          const parsedExportDate = new Date(\`\${y}-\${m}-\${d}\`);
          if (!isNaN(parsedExportDate.getTime())) {
            maxAllowedDateObj = parsedExportDate;
            break;
          }
        }
      }

      const messages = [];
      let currentDateStr = "2020-01-01";
      let lastParsedDateObj = null;
      let isNextLineNewDate = false;
      
      const dateRegex = /^(\\d{4})[/\\-.年](\\d{1,2})[/\\-.月](\\d{1,2})(?:日)?(?:\\s*（[^）]+）|\\s*\\([^)]+\\)|\\s*星期[一二三四五六日]|\\s*[a-zA-Z]+)?\\s*$/;
      const msgRegex = /^((?:上午|下午)?\\d{2}:\\d{2})\\t([^\\t]+)\\t(.*)$/;
      
      function isValidDateHeader(y, m, d) {
        const year = parseInt(y, 10);
        if (year < 2011) return false; // LINE launched in 2011
        
        const candidateStr = \`\${y}-\${m}-\${d}\`;
        const candidateDateObj = new Date(candidateStr);
        if (isNaN(candidateDateObj.getTime())) return false;
        
        // 1. Exceeds export/system date check
        if (maxAllowedDateObj && candidateDateObj > maxAllowedDateObj) {
          return false;
        }
        
        // 2. Progression check (Must be >= last parsed date)
        if (lastParsedDateObj && candidateDateObj < lastParsedDateObj) {
          return false;
        }
        
        return true;
      }
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim() === "") {
          isNextLineNewDate = true;
          continue;
        }
        
        if (isNextLineNewDate) {
          const dateMatch = line.match(dateRegex);
          if (dateMatch) {
            const y = dateMatch[1];
            const m = dateMatch[2].padStart(2, '0');
            const d = dateMatch[3].padStart(2, '0');
            
            if (isValidDateHeader(y, m, d)) {
              currentDateStr = \`\${y}-\${m}-\${d}\`;
              lastParsedDateObj = new Date(currentDateStr);
              isNextLineNewDate = false;
              continue;
            }
          }
        }
        
        const msgMatch = line.match(msgRegex);
        if (msgMatch) {
          isNextLineNewDate = false;
          const rawTime = msgMatch[1];
          const sender = msgMatch[2];
          const content = msgMatch[3];
          
          // Normalize 12-hour (下午/上午) to 24-hour style
          let hourMin = rawTime;
          const isPm = rawTime.includes("下午");
          const isAm = rawTime.includes("上午");
          let cleanTime = rawTime.replace("下午", "").replace("上午", "").trim();
          const timeParts = cleanTime.split(":");
          if (timeParts.length === 2) {
            let h = parseInt(timeParts[0]);
            const m = timeParts[1];
            if (isPm && h < 12) h += 12;
            if (isAm && h === 12) h = 0;
            hourMin = \`\${String(h).padStart(2, '0')}:\${m}\`;
          }
          
          let type = "text";
          if (content === "[圖片]" || content === "[Photo]") type = "image";
          else if (content === "[貼圖]" || content === "[Sticker]") type = "sticker";
          else if (content === "[檔案]" || content === "[File]") type = "file";
          else if (content.startsWith("☎ 通話時間") || content.startsWith("☎ Call time")) type = "call";
          else if (content.includes("unsent a message") || content.includes("收回訊息")) type = "unsent";
          
          messages.push({
            date: currentDateStr,
            time: hourMin,
            sender: sender,
            content: content,
            type: type
          });
        } else {
          // Continuation line
          if (messages.length > 0 && !line.startsWith("儲存日期：")) {
            const lastMsg = messages[messages.length - 1];
            lastMsg.content += "\\n" + line;
          }
        }
      }
      
      return { chatName, messages };
    }

    // 6. Group messages by date
    function groupMessagesByDate() {
      groupedByDate = {};
      if (!parsedChatLog || !parsedChatLog.messages) return;
      
      parsedChatLog.messages.forEach(msg => {
        const d = msg.date;
        if (!groupedByDate[d]) {
          groupedByDate[d] = {
            date: d,
            messages: [],
            senders: new Set(),
            media: { image: 0, file: 0, sticker: 0, call: 0 }
          };
        }
        groupedByDate[d].messages.push(msg);
        groupedByDate[d].senders.add(msg.sender);
        if (groupedByDate[d].media.hasOwnProperty(msg.type)) {
          groupedByDate[d].media[msg.type]++;
        }
      });
    }

    // 7. Render interactive checkable slices
    function renderDateSlices() {
      const container = document.getElementById('dateSlicesList');
      if (Object.keys(groupedByDate).length === 0) {
        container.innerHTML = \`
          <div class="text-center py-5 text-secondary small">
            <i class="bi bi-calendar-x-fill display-6 d-block mb-2 text-muted"></i>
            無對話資料。請重試。
          </div>\`;
        return;
      }
      
      let html = '';
      
      // Sort dates descending (newest first) to see recent conversations first
      const sortedDates = Object.keys(groupedByDate).sort().reverse();
      
      sortedDates.forEach(dateStr => {
        const group = groupedByDate[dateStr];
        const isChecked = selectedDates.has(dateStr) ? 'checked' : '';
        const sendersList = Array.from(group.senders).slice(0, 3).map(s => \`<span class="sender-pill">\${s}</span>\`).join('');
        const sendersMore = group.senders.size > 3 ? \`<span class="text-muted small">+\${group.senders.size - 3}</span>\` : '';
        
        let mediaHtml = '';
        if (group.media.image > 0) mediaHtml += \`<span class="badge bg-dark border border-secondary text-info me-1">📷 \${group.media.image}</span>\`;
        if (group.media.file > 0) mediaHtml += \`<span class="badge bg-dark border border-secondary text-warning me-1">📁 \${group.media.file}</span>\`;
        if (group.media.call > 0) mediaHtml += \`<span class="badge bg-dark border border-secondary text-danger me-1">📞 \${group.media.call}</span>\`;
        
        html += \`
          <div class="date-slice-item">
            <div class="d-flex align-items-center gap-3" style="flex: 1; min-width: 0;">
              <input type="checkbox" class="form-check-input" value="\${dateStr}" \${isChecked} onchange="handleDateCheckboxChange(this)" style="width: 18px; height: 18px; cursor: pointer; border-color: rgba(255,255,255,0.2);">
              <div style="min-width: 0; flex: 1;">
                <div class="fw-bold small text-light">\${dateStr}</div>
                <div class="text-truncate mt-1">\${sendersList}\${sendersMore}</div>
              </div>
            </div>
            <div class="text-end ms-3">
              <span class="badge bg-secondary p-2 mb-1" style="font-size: 11px;">共 \${group.messages.length} 筆</span>
              <div class="d-flex justify-content-end">\${mediaHtml}</div>
            </div>
          </div>\`;
      });
      
      container.innerHTML = html;
    }

    function handleDateCheckboxChange(cb) {
      const dateStr = cb.value;
      if (cb.checked) {
        selectedDates.add(dateStr);
      } else {
        selectedDates.delete(dateStr);
      }
      updateUnifiedCompiledContext();
    }

    function toggleSelectAllDates(select) {
      const checkboxes = document.querySelectorAll('#dateSlicesList input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.checked = select;
        if (select) selectedDates.add(cb.value);
        else selectedDates.delete(cb.value);
      });
      updateUnifiedCompiledContext();
    }

    function clearParsedData() {
      parsedChatLog = null;
      selectedDates.clear();
      groupedByDate = {};
      
      document.getElementById('dateSlicesList').innerHTML = \`
        <div class="text-center py-5 text-secondary small">
          <i class="bi bi-calendar-x-fill display-6 d-block mb-2 text-muted"></i>
          請先載入對話紀錄以產生日格清單
        </div>\`;
      
      const startInput = document.getElementById('filterStartDate');
      const endInput = document.getElementById('filterEndDate');
      startInput.value = '';
      startInput.removeAttribute('min');
      startInput.removeAttribute('max');
      endInput.value = '';
      endInput.removeAttribute('min');
      endInput.removeAttribute('max');
      
      document.getElementById('driveLoadStatus').innerText = '';
      document.getElementById('localFileInput').value = '';
      
      // Reset local file upload state
      lastLoadedLocalFileName = '';
      lastLoadedLocalFileContent = '';
      const uploadContainer = document.getElementById('localUploadContainer');
      if (uploadContainer) uploadContainer.style.display = 'none';
      
      updateUnifiedCompiledContext();
    }

    // ==========================================
    // Database Official Account Slicer & Parser Logic
    // ==========================================
    let dbParsedEvents = null; // Array of event objects from database query
    let dbSelectedDates = new Set();
    let dbGroupedByDate = {}; // Stores grouped messages for db

    // 1. Load active bots/chats into dropdown selector
    async function refreshDbChats(url, token) {
      const selectEl = document.getElementById('dbChatsSelect');
      const loadBtn = document.getElementById('btnLoadDbChat');
      
      selectEl.innerHTML = '<option value="">正在讀取官方帳號清單...</option>';
      loadBtn.disabled = true;
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=get_chats&token=\${token}\`;
      } else {
        fetchUrl += \`&action=get_chats&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok && result.data && result.data.length > 0) {
          let html = '<option value="">-- 請選擇官方帳號 / 對話群組 --</option>';
          result.data.forEach(c => {
            const hasCustom = c.custom_name && c.custom_name !== c.default_name;
            const labelName = hasCustom 
              ? \`\${c.custom_name} (原名: \${c.default_name})\` 
              : c.default_name;
            html += \`<option value="\${c.bot_alias}|\${c.chat_id}" data-default-name="\${c.default_name.replace(/"/g, '&quot;')}" data-custom-name="\${c.custom_name.replace(/"/g, '&quot;')}">助手: \${c.bot_alias} | \${labelName}</option>\`;
          });
          selectEl.innerHTML = html;
          loadBtn.disabled = false;
        } else {
          selectEl.innerHTML = '<option value="">（未在資料庫中找到任何對話紀錄）</option>';
        }
      } catch (err) {
        console.error('Failed to list db chats:', err);
        selectEl.innerHTML = \`<option value="">讀取失敗: \${err.message}</option>\`;
      } finally {
        toggleDbPreviewButton();
      }
    }

    // 2. Fetch events from database for selected bot & chat
    async function loadDbChatEvents() {
      const selectEl = document.getElementById('dbChatsSelect');
      const selectedVal = selectEl.value;
      const statusEl = document.getElementById('dbEventsLoadStatus');
      const loadBtn = document.getElementById('btnLoadDbChat');
      
      if (!selectedVal) {
        alert('請先選擇官方帳號！');
        return;
      }
      
      const [botAlias, chatId] = selectedVal.split('|');
      
      statusEl.className = 'small text-warning mb-4';
      statusEl.innerText = '正在從試算表資料庫載入對話歷史紀錄，請稍候...';
      loadBtn.disabled = true;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=query&table=chat_events&bot_alias=\${botAlias}&chat_id=\${chatId}&token=\${token}\`;
      } else {
        fetchUrl += \`&action=query&table=chat_events&bot_alias=\${botAlias}&chat_id=\${chatId}&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok && result.data) {
          statusEl.className = 'small text-success mb-4';
          statusEl.innerText = \`成功載入！共取得 \${result.data.length} 筆對話記錄。\`;
          
          processDbRawEvents(result.data);
        } else {
          throw new Error(result.error || '未取得對話資料');
        }
      } catch (err) {
        console.error('Failed to get db events:', err);
        statusEl.className = 'small text-danger mb-4';
        statusEl.innerText = \`載入失敗: \${err.message}\`;
      } finally {
        loadBtn.disabled = false;
      }
    }

    function handleDbChatsSelectChange() {
      toggleDbPreviewButton();
      
      const selectEl = document.getElementById('dbChatsSelect');
      const nicknameBtn = document.getElementById('btnEditDbChatNickname');
      if (selectEl && nicknameBtn) {
        nicknameBtn.disabled = !selectEl.value;
      }
    }

    function toggleDbPreviewButton() {
      const selectEl = document.getElementById('dbChatsSelect');
      const previewBtn = document.getElementById('btnPreviewDbChat');
      if (selectEl && previewBtn) {
        previewBtn.disabled = !selectEl.value;
      }
    }

    async function promptEditDbChatNickname() {
      const selectEl = document.getElementById('dbChatsSelect');
      const selectedVal = selectEl.value;
      if (!selectedVal) {
        alert('請先選擇官方帳號！');
        return;
      }
      
      const [botAlias, chatId] = selectedVal.split('|');
      const selectedOption = selectEl.options[selectEl.selectedIndex];
      const currentCustomName = selectedOption.getAttribute('data-custom-name') || '';
      const currentDefaultName = selectedOption.getAttribute('data-default-name') || '';
      
      const newNickname = prompt(\`修改此官方帳號對話的自訂別名（暱稱）：\`, currentCustomName || currentDefaultName);
      if (newNickname === null) return; // User cancelled
      if (!newNickname.trim()) {
        alert('暱稱不能為空！');
        return;
      }
      
      const nicknameBtn = document.getElementById('btnEditDbChatNickname');
      const originalText = nicknameBtn.innerHTML;
      nicknameBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      nicknameBtn.disabled = true;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=update_chat_nickname&token=\${token}\`;
      } else {
        fetchUrl += \`&action=update_chat_nickname&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl, {
          method: 'POST',
          body: JSON.stringify({
            chat_id: chatId,
            bot_alias: botAlias,
            custom_name: newNickname.trim()
          })
        });
        
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const result = await response.json();
        
        if (result.ok) {
          alert('自訂別名修改成功！');
          
          // Update selected option data attributes locally instantly
          selectedOption.setAttribute('data-custom-name', result.custom_name);
          const hasCustom = result.custom_name !== currentDefaultName;
          const labelName = hasCustom 
            ? \`\${result.custom_name} (原名: \${currentDefaultName})\` 
            : currentDefaultName;
          
          selectedOption.text = \`助手: \${botAlias} | \${labelName}\`;
        } else {
          throw new Error(result.error || '修改失敗');
        }
      } catch (err) {
        alert(\`修改暱稱失敗: \${err.message}\`);
      } finally {
        nicknameBtn.innerHTML = originalText;
        nicknameBtn.disabled = false;
      }
    }

    async function previewSelectedDbChat() {
      const selectEl = document.getElementById('dbChatsSelect');
      const selectedVal = selectEl.value;
      const optionText = selectEl.options[selectEl.selectedIndex].text;
      
      if (!selectedVal) {
        alert('請先選擇官方帳號！');
        return;
      }
      
      const [botAlias, chatId] = selectedVal.split('|');
      
      const previewBtn = document.getElementById('btnPreviewDbChat');
      const originalText = previewBtn.innerHTML;
      previewBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
      previewBtn.disabled = true;
      
      const url = document.getElementById('gasUrlInput').value.trim();
      const token = document.getElementById('tokenInput').value.trim();
      
      let fetchUrl = url;
      if (fetchUrl.indexOf('?') === -1) {
        fetchUrl += \`?action=get_raw_file&bot_alias=\${botAlias}&chat_id=\${chatId}&token=\${token}\`;
      } else {
        fetchUrl += \`&action=get_raw_file&bot_alias=\${botAlias}&chat_id=\${chatId}&token=\${token}\`;
      }
      
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const text = await response.text();
        
        openPreviewWindow(\`雲端對話備份預覽：\${optionText}\`, text);
      } catch (err) {
        alert(\`預覽讀取失敗: \\\${err.message} (可能尚無上傳此對話的備份文字檔)\`);
      } finally {
        previewBtn.innerHTML = originalText;
        previewBtn.disabled = false;
      }
    }

    // 3. Process raw database event objects and group by date
    function processDbRawEvents(events) {
      dbParsedEvents = events;
      groupDbEventsByDate();
      
      // Auto-set the date range picker input values
      initDbDateRangePickerInputs();
      
      renderDbDateSlices();
      updateUnifiedCompiledContext();
    }

    // 4. Group db events by date
    function groupDbEventsByDate() {
      dbGroupedByDate = {};
      if (!dbParsedEvents) return;
      
      dbParsedEvents.forEach(evt => {
        let dateStr = "2020-01-01";
        let timeStr = "00:00";
        
        if (evt.captured_at) {
          try {
            const parts = evt.captured_at.split('T');
            if (parts.length >= 1) dateStr = parts[0];
            if (parts.length >= 2) {
              const tParts = parts[1].split(':');
              if (tParts.length >= 2) timeStr = \`\${tParts[0]}:\${tParts[1]}\`;
            }
          } catch (e) {
            console.error("Error parsing date:", evt.captured_at);
          }
        }
        
        const d = dateStr;
        if (!dbGroupedByDate[d]) {
          dbGroupedByDate[d] = {
            date: d,
            messages: [],
            senders: new Set(),
            media: { image: 0, file: 0, sticker: 0, call: 0 }
          };
        }
        
        let type = evt.message_type || "text";
        if (type === "image" || type === "sticker" || type === "file" || type === "call") {
          dbGroupedByDate[d].media[type]++;
        }
        
        dbGroupedByDate[d].messages.push({
          time: timeStr,
          sender: evt.sender_name || (evt.sender_role === "host" ? "官方助手" : "使用者"),
          content: evt.text_content || \`[\${evt.message_type}]\`,
          role: evt.sender_role
        });
        
        dbGroupedByDate[d].senders.add(evt.sender_name || (evt.sender_role === "host" ? "官方助手" : "使用者"));
      });
    }

    // 5. Initialize date range inputs for database slicer
    function initDbDateRangePickerInputs() {
      const dates = Object.keys(dbGroupedByDate).sort();
      if (dates.length === 0) return;
      
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];
      
      const startInput = document.getElementById('dbFilterStartDate');
      const endInput = document.getElementById('dbFilterEndDate');
      
      startInput.min = minDate;
      startInput.max = maxDate;
      endInput.min = minDate;
      endInput.max = maxDate;
      
      endInput.value = maxDate;
      
      // Default select last 7 days of db log
      const maxDateObj = new Date(maxDate);
      const startDateObj = new Date(maxDateObj.getTime() - (7 - 1) * 24 * 60 * 60 * 1000);
      
      const y = startDateObj.getFullYear();
      const m = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const d = String(startDateObj.getDate()).padStart(2, '0');
      const startDateStr = \`\${y}-\${m}-\${d}\`;
      
      startInput.value = startDateStr >= minDate ? startDateStr : minDate;
      
      // Default: Unchecked on load
      dbSelectedDates.clear();
    }

    function applyDbDateRangeFilter() {
      const startVal = document.getElementById('dbFilterStartDate').value;
      const endVal = document.getElementById('dbFilterEndDate').value;
      
      if (!startVal || !endVal) return;
      
      dbSelectedDates.clear();
      Object.keys(dbGroupedByDate).forEach(d => {
        if (d >= startVal && d <= endVal) {
          dbSelectedDates.add(d);
        }
      });
      
      const checkboxes = document.querySelectorAll('#dbDateSlicesList input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.checked = dbSelectedDates.has(cb.value);
      });
      
      updateUnifiedCompiledContext();
    }

    function applyDbPresetRange(days) {
      const dates = Object.keys(dbGroupedByDate).sort();
      if (dates.length === 0) return;
      
      const startInput = document.getElementById('dbFilterStartDate');
      const endInput = document.getElementById('dbFilterEndDate');
      
      if (days === 'year') {
        const currentYear = new Date().getFullYear();
        startInput.value = \`\${currentYear}-01-01\`;
        endInput.value = \`\${currentYear}-12-31\`;
      } else {
        const minDate = dates[0];
        const maxDate = dates[dates.length - 1];
        endInput.value = maxDate;
        
        const maxDateObj = new Date(maxDate);
        const startDateObj = new Date(maxDateObj.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
        
        const y = startDateObj.getFullYear();
        const m = String(startDateObj.getMonth() + 1).padStart(2, '0');
        const d = String(startDateObj.getDate()).padStart(2, '0');
        const startDateStr = \`\${y}-\${m}-\${d}\`;
        
        startInput.value = startDateStr >= minDate ? startDateStr : minDate;
      }
      
      applyDbDateRangeFilter();
    }

    // 6. Render database checkable slices
    function renderDbDateSlices() {
      const container = document.getElementById('dbDateSlicesList');
      if (Object.keys(dbGroupedByDate).length === 0) {
        container.innerHTML = \`
          <div class="text-center py-5 text-secondary small">
            <i class="bi bi-calendar-x-fill display-6 d-block mb-2 text-muted"></i>
            無對話資料。請重試。
          </div>\`;
        return;
      }
      
      let html = '';
      const sortedDates = Object.keys(dbGroupedByDate).sort().reverse();
      
      sortedDates.forEach(dateStr => {
        const group = dbGroupedByDate[dateStr];
        const isChecked = dbSelectedDates.has(dateStr) ? 'checked' : '';
        const sendersList = Array.from(group.senders).slice(0, 3).map(s => \`<span class="sender-pill">\${s}</span>\`).join('');
        const sendersMore = group.senders.size > 3 ? \`<span class="text-muted small">+\${group.senders.size - 3}</span>\` : '';
        
        let mediaHtml = '';
        if (group.media.image > 0) mediaHtml += \`<span class="badge bg-dark border border-secondary text-info me-1">📷 \${group.media.image}</span>\`;
        if (group.media.file > 0) mediaHtml += \`<span class="badge bg-dark border border-secondary text-warning me-1">📁 \${group.media.file}</span>\`;
        if (group.media.call > 0) mediaHtml += \`<span class="badge bg-dark border border-secondary text-danger me-1">📞 \${group.media.call}</span>\`;
        
        html += \`
          <div class="date-slice-item">
            <div class="d-flex align-items-center gap-3" style="flex: 1; min-width: 0;">
              <input type="checkbox" class="form-check-input" value="\${dateStr}" \${isChecked} onchange="handleDbDateCheckboxChange(this)" style="width: 18px; height: 18px; cursor: pointer; border-color: rgba(255,255,255,0.2);">
              <div style="min-width: 0; flex: 1;">
                <div class="fw-bold small text-light">\${dateStr}</div>
                <div class="text-truncate mt-1">\${sendersList}\${sendersMore}</div>
              </div>
            </div>
            <div class="text-end ms-3">
              <span class="badge bg-secondary p-2 mb-1" style="font-size: 11px;">共 \${group.messages.length} 筆</span>
              <div class="d-flex justify-content-end">\${mediaHtml}</div>
            </div>
          </div>\`;
      });
      
      container.innerHTML = html;
    }

    function handleDbDateCheckboxChange(cb) {
      const dateStr = cb.value;
      if (cb.checked) {
        dbSelectedDates.add(dateStr);
      } else {
        dbSelectedDates.delete(dateStr);
      }
      updateUnifiedCompiledContext();
    }

    // Toggle Select All Db Dates
    function toggleSelectAllDbDates(select) {
      const checkboxes = document.querySelectorAll('#dbDateSlicesList input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.checked = select;
        if (select) dbSelectedDates.add(cb.value);
        else dbSelectedDates.delete(cb.value);
      });
      updateUnifiedCompiledContext();
    }

    function clearDbParsedData() {
      dbParsedEvents = null;
      dbSelectedDates.clear();
      dbGroupedByDate = {};
      
      document.getElementById('dbDateSlicesList').innerHTML = \`
        <div class="text-center py-5 text-secondary small">
          <i class="bi bi-calendar-x-fill display-6 d-block mb-2 text-muted"></i>
          請先選取官方帳號並載入對話以產生日格清單
        </div>\`;
      
      const startInput = document.getElementById('dbFilterStartDate');
      const endInput = document.getElementById('dbFilterEndDate');
      startInput.value = '';
      startInput.removeAttribute('min');
      startInput.removeAttribute('max');
      endInput.value = '';
      endInput.removeAttribute('min');
      endInput.removeAttribute('max');
      
      document.getElementById('dbEventsLoadStatus').innerText = '';
      updateUnifiedCompiledContext();
    }

    // ==========================================
    // Webhook Endpoint Display Logic
    // ==========================================
    function updateWebhookDisplay() {
      const gasUrl = document.getElementById('gasUrlInput').value.trim();
      const el = document.getElementById('cfWebhookEndpoint');
      if (el) {
        el.innerText = gasUrl || '尚未輸入 GAS Web App URL';
      }
    }

    // ==========================================
    // UNIFIED AI Execution and Storage Logic
    // ==========================================
    
    // Toggle Provider Visibility
    function toggleUnifiedAiProviderVisibility() {
      const provider = document.getElementById('unifiedAiProvider').value;
      const builtinCol = document.getElementById('builtinModelCol');
      const geminiCol = document.getElementById('geminiModelCol');
      const geminiKeyCol = document.getElementById('geminiKeyCol');
      
      if (provider === 'builtin') {
        builtinCol.style.display = 'block';
        geminiCol.style.display = 'none';
        geminiKeyCol.style.display = 'none';
      } else {
        builtinCol.style.display = 'none';
        geminiCol.style.display = 'block';
        geminiKeyCol.style.display = 'block';
      }
    }

    // Save key to localStorage
    function saveGeminiKey(prefix) {
      const keyInput = document.getElementById('unifiedGeminiKey');
      const val = keyInput.value.trim();
      
      if (!val) {
        alert('請先輸入 API Key 再進行儲存！');
        return;
      }
      
      localStorage.setItem('falo_gemini_key', val);
      alert('Gemini API Key 已成功安全地儲存至您本地瀏覽器快取 (LocalStorage)！');
    }

    // Load API Keys from localStorage
    function loadGeminiKeys() {
      const savedKey = localStorage.getItem('falo_gemini_key') || '';
      const keyInput = document.getElementById('unifiedGeminiKey');
      if (savedKey && keyInput) {
        keyInput.value = savedKey;
      }
    }

    // Automatically call key loading
    window.addEventListener('DOMContentLoaded', () => {
      loadGeminiKeys();
      toggleUnifiedAiProviderVisibility(); // align UI
    });

    // 8. Compile Unified Markdown output preview in real-time
    function updateUnifiedCompiledContext() {
      const previewEl = document.getElementById('unifiedCompiledContextPreview');
      const statsEl = document.getElementById('unifiedPreviewStats');
      const promptText = document.getElementById('unifiedAiPromptInput').value;
      
      let markdownParts = [];
      let totalLineMsgs = 0;
      let totalDbMsgs = 0;
      let hasKm = false;
      let statsStr = "";
      
      if (analysisBasket && analysisBasket.length > 0) {
        // Build from Basket
        let enabledCount = 0;
        analysisBasket.forEach(item => {
          if (item.enabled) {
            markdownParts.push(item.content);
            enabledCount++;
            if (item.type === 'line') totalLineMsgs++;
            if (item.type === 'db') totalDbMsgs++;
            if (item.type === 'km') hasKm = true;
          }
        });
        
        statsStr = \`購物車: 啟用 \${enabledCount}/\${analysisBasket.length} 個區塊\`;
      } else {
        // Fallback: Build from active slicers (LINE, DB, KM)
        // 1. Process LINE segment
        if (parsedChatLog && selectedDates.size > 0) {
          let lineContent = [];
          lineContent.push(\`## 💬 LINE 歷史群組對話紀錄 - \${parsedChatLog.chatName || '未命名對話'}\`);
          lineContent.push(\`* **資料來源**: LINE 歷史匯出備份檔案\`);
          lineContent.push(\`* **選取天數**: \${selectedDates.size} 天\`);
          lineContent.push('\\n');
          
          const sortedSelected = Array.from(selectedDates).sort();
          sortedSelected.forEach(d => {
            const group = groupedByDate[d];
            if (!group) return;
            lineContent.push(\`### 📅 \${d}\`);
            group.messages.forEach(msg => {
              lineContent.push(\`- **[\${msg.time}] \${msg.sender}**: \${msg.content}\`);
              totalLineMsgs++;
            });
            lineContent.push('');
          });
          lineContent.push('---\\n');
          markdownParts.push(lineContent.join('\\n'));
        }
        
        // 2. Process Database segment
        if (dbParsedEvents && dbSelectedDates.size > 0) {
          let dbContent = [];
          const selectEl = document.getElementById('dbChatsSelect');
          const chatInfo = selectEl.options[selectEl.selectedIndex] ? selectEl.options[selectEl.selectedIndex].text : '官方帳號對話';
          
          dbContent.push(\`## 📱 官方助手對話紀錄 - \${chatInfo}\`);
          dbContent.push(\`* **資料來源**: Google Sheets chat_events 資料表\`);
          dbContent.push(\`* **選取天數**: \${dbSelectedDates.size} 天\`);
          dbContent.push('\\n');
          
          const sortedSelected = Array.from(dbSelectedDates).sort();
          sortedSelected.forEach(d => {
            const group = dbGroupedByDate[d];
            if (!group) return;
            dbContent.push(\`### 📅 \${d}\`);
            group.messages.forEach(msg => {
              const roleLabel = msg.role === "host" ? "[官方助手]" : "[使用者]";
              dbContent.push(\`- **[\${msg.time}] \${msg.sender}\${roleLabel}**: \${msg.content}\`);
              totalDbMsgs++;
            });
            dbContent.push('');
          });
          dbContent.push('---\\n');
          markdownParts.push(dbContent.join('\\n'));
        }

        // 3. Process KM segment
        const kmInclude = document.getElementById('kmIncludeCheck').checked;
        const kmText = document.getElementById('kmTextInput').value.trim();
        if (kmInclude && kmText) {
          let kmContent = [];
          kmContent.push(\`## 📚 知識庫參考資料 (KM)\`);
          kmContent.push(\`* **資料來源**: 知識庫文字導入器 (KM)\`);
          kmContent.push('\\n');
          kmContent.push(kmText);
          kmContent.push('\\n---\\n');
          markdownParts.push(kmContent.join('\\n'));
          hasKm = true;
        }
        
        statsStr = \`LINE: \${selectedDates.size}天(\${totalLineMsgs}筆) | 官方助手: \${dbSelectedDates.size}天(\${totalDbMsgs}筆)\`;
        if (hasKm) {
          statsStr += \` | 知識庫: 啟用\`;
        }
      }
      
      const dialogueText = markdownParts.join('\\n');
      
      let finalContent = promptText;
      if (dialogueText.trim() !== '') {
        finalContent = \`\${promptText}\\n\\n以下是合併組裝的實際對話對談與背景參考紀錄：\\n\\n\${dialogueText}\`;
      }
      
      previewEl.value = finalContent;
      
      statsStr += \` | 總字數: \${finalContent.length}\`;
      statsEl.innerText = statsStr;
    }

    function copyUnifiedCompiledContext() {
      const previewEl = document.getElementById('unifiedCompiledContextPreview');
      if (!previewEl.value.trim()) {
        alert('無內容可複製！');
        return;
      }
      
      navigator.clipboard.writeText(previewEl.value).then(() => {
        alert('綜合分析 Context 已成功複製到剪貼簿！');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        previewEl.select();
        document.execCommand('copy');
        alert('綜合分析 Context 已複製！');
      });
    }

    // Run Unified AI analysis query via backend API
    async function runUnifiedAiAnalysis() {
      const provider = document.getElementById('unifiedAiProvider').value;
      const key = localStorage.getItem('falo_gemini_key') || '';
      
      const model = (provider === 'builtin')
        ? document.getElementById('unifiedBuiltinModel').value
        : document.getElementById('unifiedGeminiModel').value;
        
      const promptText = document.getElementById('unifiedCompiledContextPreview').value;
      const kmInclude = document.getElementById('kmIncludeCheck').checked;
      const kmText = document.getElementById('kmTextInput').value.trim();

      if (!promptText || promptText.trim() === '' || (!selectedDates.size && !dbSelectedDates.size && !(kmInclude && kmText))) {
        alert('請先載入對話資料或知識庫，並勾選/啟用以產出對話上下文！');
        return;
      }

      const reportBox = document.getElementById('unifiedAiReportBox');
      const mdView = document.getElementById('unifiedAiReportMdView');
      const htmlView = document.getElementById('unifiedAiReportHtmlView');
      const analyzeBtn = document.getElementById('btnUnifiedAnalyze');

      // Show box, set loading status
      reportBox.classList.remove('d-none');
      document.getElementById('unifiedAiUsageStats').classList.add('d-none');
      mdView.value = "AI 正在努力分析整合對話中，請稍候... (約需 5-15 秒)";
      htmlView.innerHTML = \`
        <div class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-info me-2" role="status"></div>
          <span class="small text-muted">AI 正在努力分析整合對話中，請稍候...</span>
        </div>\`;
      
      // Keep correct view display during loading
      if (currentReportFormat === 'md') {
        mdView.classList.remove('d-none');
        htmlView.classList.add('d-none');
      } else {
        mdView.classList.add('d-none');
        htmlView.classList.remove('d-none');
      }
      
      analyzeBtn.disabled = true;
      const originalText = analyzeBtn.innerHTML;
      analyzeBtn.innerHTML = \`<i class="bi bi-hourglass-split"></i> AI 正在分析中...\`;

      // Resolve endpoint relative to worker domain
      const endpoint = window.location.origin + '/api/ai/analyze';
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            provider: provider,
            prompt: promptText,
            gemini_key: provider === 'gemini' ? key : '',
            model: model
          })
        });

        const result = await response.json();
        
        if (result.ok && result.result) {
          rawAiReportText = result.result;
          
          // Populate both views
          mdView.value = rawAiReportText;
          const parsedHtml = marked.parse(rawAiReportText);
          htmlView.innerHTML = \`<div class="ai-report-markdown-content">\${parsedHtml}</div>\`;
          
          // Render usage stats if available
          displayTokenCosts(result.usage, model);
          
          // Align format visibility
          setReportFormat(currentReportFormat);
          
          // Scroll box to top
          reportBox.scrollTop = 0;
        } else {
          throw new Error(result.error || 'AI 無法產生回應');
        }
      } catch (err) {
        console.error('AI Analysis failed:', err);
        const errMsg = \`AI 綜合分析發生錯誤！\\n錯誤原因: \${err.message}\`;
        mdView.value = errMsg;
        htmlView.innerHTML = \`
          <div class="alert alert-danger mb-0 p-2 small" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-1"></i> AI 綜合分析發生錯誤！<br>
            錯誤原因: \${err.message}
          </div>\`;
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = originalText;
      }
    }

    // Calculate and display Gemini Token usage and cost estimations
    function displayTokenCosts(usage, model) {
      const statsEl = document.getElementById('unifiedAiUsageStats');
      const detailsEl = document.getElementById('usageStatsDetails');
      
      if (!usage || !usage.promptTokenCount) {
        statsEl.classList.add('d-none');
        return;
      }
      
      const inputTokens = usage.promptTokenCount || 0;
      const outputTokens = usage.candidatesTokenCount || 0;
      const totalTokens = usage.totalTokenCount || 0;
      
      // Define rates per 1M tokens
      let inputRate = 0.075; // Default for Flash
      let outputRate = 0.30;
      let modelLabel = "Gemini Flash";
      
      if (model.includes('lite')) {
        inputRate = 0.0375;
        outputRate = 0.15;
        modelLabel = "Gemini Flash-Lite";
      } else if (model.includes('pro')) {
        inputRate = 1.25;
        outputRate = 5.00;
        modelLabel = "Gemini Pro";
      }
      
      const usdCost = (inputTokens / 1000000 * inputRate) + (outputTokens / 1000000 * outputRate);
      const ntdCost = usdCost * 30;
      
      detailsEl.innerHTML = \`
        <span class="badge bg-primary me-1">\${modelLabel}</span> 
        輸入: <strong class="text-light">\${inputTokens.toLocaleString()}</strong> tokens | 
        輸出: <strong class="text-light">\${outputTokens.toLocaleString()}</strong> tokens | 
        總計: <strong class="text-light">\${totalTokens.toLocaleString()}</strong> | 
        預估成本: <strong class="text-warning" style="font-size: 12px;">NT$ \${ntdCost.toFixed(4)}</strong> (約 US$ \${usdCost.toFixed(5)})
      \`;
      statsEl.classList.remove('d-none');
    }

    // Set active report format (md / html)
    function setReportFormat(format) {
      currentReportFormat = format;
      const btnMd = document.getElementById('btnFormatMd');
      const btnHtml = document.getElementById('btnFormatHtml');
      const mdView = document.getElementById('unifiedAiReportMdView');
      const htmlView = document.getElementById('unifiedAiReportHtmlView');
      
      if (format === 'md') {
        btnMd.classList.add('active');
        btnHtml.classList.remove('active');
        mdView.classList.remove('d-none');
        htmlView.classList.add('d-none');
      } else {
        btnMd.classList.remove('active');
        btnHtml.classList.add('active');
        mdView.classList.add('d-none');
        htmlView.classList.remove('d-none');
      }
    }

    // Download AI report as file (.md or .html)
    function downloadAiReport() {
      const text = rawAiReportText || '';
      if (!text || text.includes('AI 正在努力分析') || text.includes('AI 綜合分析發生錯誤')) {
        alert('無有效分析報告可下載！');
        return;
      }
      
      let blob, filename;
      if (currentReportFormat === 'md') {
        blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
        filename = \`Falo_AI_Report_\${new Date().toISOString().slice(0,10)}.md\`;
      } else {
        const parsedHtml = marked.parse(text);
        const fullHtml = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FALO AI 綜合分析報告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 40px;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      background-color: #f9fafb;
    }
    .container {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border: 1px solid #e5e7eb;
    }
    h1, h2, h3 {
      color: #111827;
      margin-top: 28px;
      margin-bottom: 12px;
      font-weight: 700;
    }
    h1 { font-size: 28px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    h2 { font-size: 20px; border-left: 4px solid #10b981; padding-left: 10px; }
    h3 { font-size: 16px; }
    p { margin-bottom: 16px; color: #374151; }
    code {
      background-color: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
      color: #ef4444;
    }
    pre {
      background-color: #1e293b;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 20px;
    }
    pre code {
      background-color: transparent;
      padding: 0;
      color: #f8fafc;
      font-size: 14px;
    }
    blockquote {
      border-left: 4px solid #10b981;
      padding: 12px 16px;
      color: #4b5563;
      background-color: #f0fdf4;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 24px 0;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      color: #111827;
      font-weight: 600;
    }
    tr:nth-child(even) { background-color: #f9fafb; }
    ul, ol { margin-bottom: 16px; padding-left: 24px; color: #374151; }
    li { margin-bottom: 6px; }
    hr { border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0; }
  </style>
</head>
<body>
  <div class="container">
    \${parsedHtml}
  </div>
</body>
</html>\`;
        blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
        filename = \`Falo_AI_Report_\${new Date().toISOString().slice(0,10)}.html\`;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // Copy formatted report to clipboard (Support Rich Text copying in HTML mode)
    function copyAiReport() {
      const text = rawAiReportText || '';
      if (!text || text.includes('AI 正在努力分析') || text.includes('AI 綜合分析發生錯誤')) {
        alert('無有效分析報告可複製！');
        return;
      }

      if (currentReportFormat === 'md') {
        // Copy raw markdown plain text
        navigator.clipboard.writeText(text).then(() => {
          alert('AI 原始 Markdown 報告已複製到剪貼簿！');
        }).catch(err => {
          console.error('Failed to copy report:', err);
          alert('複製失敗！');
        });
      } else {
        // Smart rich text copying (combines html format & plain text fallback)
        try {
          const parsedHtml = marked.parse(text);
          const richHtml = \`<div style="font-family: -apple-system, sans-serif; line-height: 1.6; color: #333;">\\\${parsedHtml}</div>\`;
          
          const htmlBlob = new Blob([richHtml], { type: 'text/html' });
          const textBlob = new Blob([text], { type: 'text/plain' });
          
          const clipboardData = [
            new ClipboardItem({
              'text/html': htmlBlob,
              'text/plain': textBlob
            })
          ];
          
          navigator.clipboard.write(clipboardData).then(() => {
            alert('AI 網頁預覽格式已複製！貼至 Word/Google Docs/Gmail 時將自動保留標題與粗體排版！');
          }).catch(err => {
            console.error('Clipboard API failed, fallback to plain text copy:', err);
            // Fallback to plain text copy
            navigator.clipboard.writeText(text).then(() => {
              alert('AI 報告已複製 (純文字)！');
            });
          });
        } catch (err) {
          console.error('Copy Rich Text Error:', err);
          navigator.clipboard.writeText(text).then(() => {
            alert('AI 報告已複製 (純文字)！');
          });
        }
      }
    }

    // ==========================================
    // KM Knowledge Base Logic
    // ==========================================
    function handleKmFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        const textInput = document.getElementById('kmTextInput');
        
        if (file.name.toLowerCase().endsWith('.html')) {
          textInput.value = convertHtmlToMarkdown(content);
        } else {
          textInput.value = content;
        }
        
        document.getElementById('kmIncludeCheck').checked = true;
        updateUnifiedCompiledContext();
        alert(\`知識庫檔案「\${file.name}」匯入成功！已自動勾選併入分析。\`);
      };
      reader.readAsText(file);
    }

    function triggerKmHtmlConversion() {
      const textInput = document.getElementById('kmTextInput');
      const rawText = textInput.value;
      if (!rawText.trim()) {
        alert('請先貼入 HTML 內容再進行轉換！');
        return;
      }
      
      const md = convertHtmlToMarkdown(rawText);
      textInput.value = md;
      updateUnifiedCompiledContext();
      alert('已成功將貼入之 HTML 轉換為 Markdown！');
    }

    function convertHtmlToMarkdown(html) {
      if (!html) return '';
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue;
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return '';
        }
        
        const tagName = node.tagName.toLowerCase();
        let childrenContent = '';
        
        for (let i = 0; i < node.childNodes.length; i++) {
          childrenContent += processNode(node.childNodes[i]);
        }
        
        switch (tagName) {
          case 'h1':
            return \`\\n# \${childrenContent.trim()}\\n\`;
          case 'h2':
            return \`\\n## \${childrenContent.trim()}\\n\`;
          case 'h3':
            return \`\\n### \${childrenContent.trim()}\\n\`;
          case 'h4':
            return \`\\n#### \${childrenContent.trim()}\\n\`;
          case 'h5':
            return \`\\n##### \${childrenContent.trim()}\\n\`;
          case 'h6':
            return \`\\n###### \${childrenContent.trim()}\\n\`;
          case 'p':
            return \`\\n\${childrenContent.trim()}\\n\`;
          case 'br':
            return '\\n';
          case 'strong':
          case 'b':
            return \`**\${childrenContent}**\`;
          case 'em':
          case 'i':
            return \`*\${childrenContent}*\`;
          case 'code':
            return \`\\\`\${childrenContent}\\\`\`;
          case 'pre':
            return \`\\n\\\`\\\`\\\`\\n\${childrenContent}\\n\\\`\\\`\\\`\\n\`;
          case 'a':
            const href = node.getAttribute('href') || '';
            return href ? \`[\${childrenContent}](\${href})\` : childrenContent;
          case 'li':
            return \`* \${childrenContent.trim()}\\n\`;
          case 'ul':
            return \`\\n\${childrenContent}\\n\`;
          case 'ol':
            return \`\\n\${childrenContent}\\n\`;
          case 'blockquote':
            return \`\\n> \${childrenContent.trim().replace(/\\n/g, '\\n> ')}\\n\`;
          case 'hr':
            return '\\n---\\n';
          case 'script':
          case 'style':
          case 'head':
          case 'title':
            return '';
          default:
            return childrenContent;
        }
      }
      
      const targetElement = doc.body || doc.documentElement;
      let md = processNode(targetElement);
      md = md.replace(/\\n{3,}/g, '\\n\\n');
      return md.trim();
    }

    function clearKmData() {
      document.getElementById('kmTextInput').value = '';
      document.getElementById('kmIncludeCheck').checked = false;
      document.getElementById('kmFileInput').value = '';
      updateUnifiedCompiledContext();
    }

    function handleKmCheckboxChange(cb) {
      updateUnifiedCompiledContext();
    }

    // Auto check if user types text
    function handleKmTextInput() {
      const textVal = document.getElementById('kmTextInput').value.trim();
      const includeCheck = document.getElementById('kmIncludeCheck');
      
      if (textVal && !includeCheck.checked) {
        includeCheck.checked = true;
      } else if (!textVal && includeCheck.checked) {
        includeCheck.checked = false;
      }
      updateUnifiedCompiledContext();
    }

    // ==========================================
    // FALO Analysis Context Basket Logic
    // ==========================================
    function addSelectedLineToBasket() {
      if (!parsedChatLog || selectedDates.size === 0) {
        alert('請先載入 LINE 對話並勾選至少一天的對話紀錄！');
        return;
      }
      
      const chatName = parsedChatLog.chatName || '未命名對話';
      const daysCount = selectedDates.size;
      let totalLineMsgs = 0;
      let lineContent = [];
      
      lineContent.push(\`## 💬 LINE 歷史群組對話紀錄 - \${chatName}\`);
      lineContent.push(\`* **資料來源**: LINE 歷史匯出備份檔案\`);
      lineContent.push(\`* **選取天數**: \${daysCount} 天\`);
      lineContent.push('\\n');
      
      const sortedSelected = Array.from(selectedDates).sort();
      sortedSelected.forEach(d => {
        const group = groupedByDate[d];
        if (!group) return;
        lineContent.push(\`### 📅 \${d}\`);
        group.messages.forEach(msg => {
          lineContent.push(\`- **[\${msg.time}] \${msg.sender}**: \${msg.content}\`);
          totalLineMsgs++;
        });
        lineContent.push('');
      });
      lineContent.push('---\\n');
      
      const contentString = lineContent.join('\\n');
      
      const minSelectedDate = sortedSelected[0];
      const maxSelectedDate = sortedSelected[sortedSelected.length - 1];
      const dateRangeStr = (minSelectedDate === maxSelectedDate) 
        ? minSelectedDate 
        : \`\${minSelectedDate} ~ \${maxSelectedDate}\`;
      
      analysisBasket.push({
        id: "basket_item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        type: "line",
        title: \`💬 LINE - \${chatName}\`,
        info: \`時間: \${dateRangeStr} (\${daysCount} 天, 共 \${totalLineMsgs} 筆對話)\`,
        content: contentString,
        charCount: contentString.length,
        enabled: true
      });
      
      renderBasketUI();
      updateUnifiedCompiledContext();
      alert(\`已成功將 \${chatName} (\${daysCount} 天, \${totalLineMsgs} 筆對話) 存入分析清單！\`);
    }

    function addSelectedDbToBasket() {
      if (!dbParsedEvents || dbSelectedDates.size === 0) {
        alert('請先選取官方助手對話並勾選至少一天的紀錄！');
        return;
      }
      
      const selectEl = document.getElementById('dbChatsSelect');
      const chatInfo = selectEl.options[selectEl.selectedIndex] ? selectEl.options[selectEl.selectedIndex].text : '官方帳號對話';
      const daysCount = dbSelectedDates.size;
      let totalDbMsgs = 0;
      let dbContent = [];
      
      dbContent.push(\`## 📱 官方助手對話紀錄 - \${chatInfo}\`);
      dbContent.push(\`* **資料來源**: Google Sheets chat_events 資料表\`);
      dbContent.push(\`* **選取天數**: \${daysCount} 天\`);
      dbContent.push('\\n');
      
      const sortedSelected = Array.from(dbSelectedDates).sort();
      sortedSelected.forEach(d => {
        const group = dbGroupedByDate[d];
        if (!group) return;
        dbContent.push(\`### 📅 \${d}\`);
        group.messages.forEach(msg => {
          const roleLabel = msg.role === "host" ? "[官方助手]" : "[使用者]";
          dbContent.push(\`- **[\${msg.time}] \${msg.sender}\${roleLabel}**: \${msg.content}\`);
          totalDbMsgs++;
        });
        dbContent.push('');
      });
      dbContent.push('---\\n');
      
      const contentString = dbContent.join('\\n');
      
      const minSelectedDate = sortedSelected[0];
      const maxSelectedDate = sortedSelected[sortedSelected.length - 1];
      const dateRangeStr = (minSelectedDate === maxSelectedDate) 
        ? minSelectedDate 
        : \`\${minSelectedDate} ~ \${maxSelectedDate}\`;
      
      analysisBasket.push({
        id: "basket_item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        type: "db",
        title: \`📱 助手 - \${chatInfo}\`,
        info: \`時間: \${dateRangeStr} (\${daysCount} 天, 共 \${totalDbMsgs} 筆對話)\`,
        content: contentString,
        charCount: contentString.length,
        enabled: true
      });
      
      renderBasketUI();
      updateUnifiedCompiledContext();
      alert(\`已成功將 \${chatInfo} (\${daysCount} 天, \${totalDbMsgs} 筆對話) 存入分析清單！\`);
    }

    function addKmToBasket() {
      const kmText = document.getElementById('kmTextInput').value.trim();
      if (!kmText) {
        alert('請先在知識庫輸入框貼入或匯入文字內容！');
        return;
      }
      
      let kmContent = [];
      kmContent.push(\`## 📚 知識庫參考資料 (KM)\`);
      kmContent.push(\`* **資料來源**: 知識庫文字導入器 (KM)\`);
      kmContent.push('\\n');
      kmContent.push(kmText);
      kmContent.push('\\n---\\n');
      
      const contentString = kmContent.join('\\n');
      
      analysisBasket.push({
        id: "basket_item_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        type: "km",
        title: \`📚 知識庫 - 參考資料\`,
        info: \`文字長度 \${kmText.length} 字\`,
        content: contentString,
        charCount: contentString.length,
        enabled: true
      });
      
      renderBasketUI();
      updateUnifiedCompiledContext();
      alert(\`已成功將知識庫參考資料存入分析清單！\`);
    }

    function renderBasketUI() {
      const emptyState = document.getElementById('analysisBasketEmptyState');
      const container = document.getElementById('analysisBasketContainer');
      const tableBody = document.getElementById('analysisBasketTableBody');
      
      if (!analysisBasket || analysisBasket.length === 0) {
        emptyState.classList.remove('d-none');
        container.classList.add('d-none');
        return;
      }
      
      emptyState.classList.add('d-none');
      container.classList.remove('d-none');
      
      let html = '';
      analysisBasket.forEach((item, index) => {
        const typeBadge = item.type === 'line' 
          ? '<span class="badge bg-primary text-light">LINE</span>'
          : item.type === 'db'
            ? '<span class="badge bg-success text-light">助手</span>'
            : '<span class="badge bg-purple text-light">知識庫</span>';
            
        const isChecked = item.enabled ? 'checked' : '';
        
        html += \`
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 8px;">
              <input type="checkbox" class="form-check-input" \${isChecked} onchange="toggleBasketItem('\${item.id}')" style="cursor: pointer;">
            </td>
            <td style="padding: 8px;">\${typeBadge}</td>
            <td style="padding: 8px;">
              <div class="fw-bold text-light">\${item.title}</div>
              <div class="text-muted small">\${item.info}</div>
            </td>
            <td style="padding: 8px;" class="text-muted">\${item.charCount} 字</td>
            <td style="padding: 8px; text-align: center;">
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary btn-xs py-0" onclick="moveBasketItem(\${index}, -1)" \${index === 0 ? 'disabled' : ''} title="上移">▲</button>
                <button class="btn btn-outline-secondary btn-xs py-0" onclick="moveBasketItem(\${index}, 1)" \${index === analysisBasket.length - 1 ? 'disabled' : ''} title="下移">▼</button>
                <button class="btn btn-outline-danger btn-xs py-0 ms-2" onclick="deleteBasketItem('\${item.id}')" title="刪除"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>\`;
      });
      
      tableBody.innerHTML = html;
    }

    function toggleBasketItem(id) {
      const item = analysisBasket.find(x => x.id === id);
      if (item) {
        item.enabled = !item.enabled;
        updateUnifiedCompiledContext();
        renderBasketUI();
      }
    }

    function deleteBasketItem(id) {
      analysisBasket = analysisBasket.filter(x => x.id !== id);
      renderBasketUI();
      updateUnifiedCompiledContext();
    }

    function moveBasketItem(index, direction) {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= analysisBasket.length) return;
      
      // Swap elements
      const temp = analysisBasket[index];
      analysisBasket[index] = analysisBasket[targetIndex];
      analysisBasket[targetIndex] = temp;
      
      renderBasketUI();
      updateUnifiedCompiledContext();
    }

    function exportSelectedLineToTxt(mode) {
      if (!parsedChatLog || selectedDates.size === 0) {
        alert('請先載入 LINE 對話並勾選至少一天的對話紀錄！');
        return;
      }
      
      const chatName = parsedChatLog.chatName || '未命名對話';
      const sortedSelected = Array.from(selectedDates).sort();
      const prefix = document.getElementById('lineFilePrefix').value.trim() || 'LN';
      
      function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      if (mode === 'each') {
        // Export day-by-day (each date in a separate file)
        sortedSelected.forEach((d, idx) => {
          setTimeout(() => {
            const group = groupedByDate[d];
            if (!group) return;
            
            let textContent = [];
            textContent.push(\`[LINE] \${chatName}的聊天記錄\`);
            textContent.push(\`儲存日期：\${new Date().toLocaleDateString('zh-TW')}\\n\`);
            
            const dateObj = new Date(d);
            const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
            const weekdayStr = weekdays[dateObj.getDay()];
            
            textContent.push(\`\${d.replace(/-/g, '/')}(\${weekdayStr})\`);
            group.messages.forEach(msg => {
              textContent.push(\`\${msg.time}\\t\${msg.sender}\\t\${msg.content}\`);
            });
            
            const filename = \`\${prefix}_\${chatName}_\${d}.txt\`;
            downloadFile(textContent.join('\\n'), filename);
          }, idx * 200); // 200ms delay between downloads to prevent browser blocking
        });
      } else {
        // Range export (all merged in one file)
        const minSelectedDate = sortedSelected[0];
        const maxSelectedDate = sortedSelected[sortedSelected.length - 1];
        const dateRangeStr = (minSelectedDate === maxSelectedDate) 
          ? minSelectedDate 
          : \`\${minSelectedDate}_\${maxSelectedDate}\`;
          
        const filename = \`\${prefix}_\${chatName}_\${dateRangeStr}.txt\`;
        
        let textContent = [];
        textContent.push(\`[LINE] \${chatName}的聊天記錄\`);
        textContent.push(\`儲存日期：\${new Date().toLocaleDateString('zh-TW')}\\n\`);
        
        sortedSelected.forEach(d => {
          const group = groupedByDate[d];
          if (!group) return;
          
          const dateObj = new Date(d);
          const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
          const weekdayStr = weekdays[dateObj.getDay()];
          
          textContent.push(\`\${d.replace(/-/g, '/')}(\${weekdayStr})\`);
          group.messages.forEach(msg => {
            textContent.push(\`\${msg.time}\\t\${msg.sender}\\t\${msg.content}\`);
          });
          textContent.push('');
        });
        
        downloadFile(textContent.join('\\n'), filename);
      }
    }

    function exportSelectedDbToTxt(mode) {
      if (!dbParsedEvents || dbSelectedDates.size === 0) {
        alert('請先選取官方助手對話並勾選至少一天的紀錄！');
        return;
      }
      
      const selectEl = document.getElementById('dbChatsSelect');
      const chatInfo = selectEl.options[selectEl.selectedIndex] ? selectEl.options[selectEl.selectedIndex].text : '官方帳號對話';
      const sortedSelected = Array.from(dbSelectedDates).sort();
      const prefix = document.getElementById('dbFilePrefix').value.trim() || 'DB';
      
      function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      if (mode === 'each') {
        // Export day-by-day (each date in a separate file)
        sortedSelected.forEach((d, idx) => {
          setTimeout(() => {
            const group = dbGroupedByDate[d];
            if (!group) return;
            
            let textContent = [];
            textContent.push(\`[LINE] 官方助手對話 - \${chatInfo}\`);
            textContent.push(\`儲存日期：\${new Date().toLocaleDateString('zh-TW')}\\n\`);
            
            const dateObj = new Date(d);
            const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
            const weekdayStr = weekdays[dateObj.getDay()];
            
            textContent.push(\`\${d.replace(/-/g, '/')}(\${weekdayStr})\`);
            group.messages.forEach(msg => {
              const roleLabel = msg.role === "host" ? "[官方助手]" : "[使用者]";
              textContent.push(\`\${msg.time}\\t\${msg.sender}\${roleLabel}\\t\${msg.content}\`);
            });
            
            const filename = \`\${prefix}_\${chatInfo}_\${d}.txt\`;
            downloadFile(textContent.join('\\n'), filename);
          }, idx * 200); // 200ms delay between downloads to prevent browser blocking
        });
      } else {
        // Range export (all merged in one file)
        const minSelectedDate = sortedSelected[0];
        const maxSelectedDate = sortedSelected[sortedSelected.length - 1];
        const dateRangeStr = (minSelectedDate === maxSelectedDate) 
          ? minSelectedDate 
          : \`\${minSelectedDate}_\${maxSelectedDate}\`;
          
        const filename = \`\${prefix}_\${chatInfo}_\${dateRangeStr}.txt\`;
        
        let textContent = [];
        textContent.push(\`[LINE] 官方助手對話 - \${chatInfo}\`);
        textContent.push(\`儲存日期：\${new Date().toLocaleDateString('zh-TW')}\\n\`);
        
        sortedSelected.forEach(d => {
          const group = dbGroupedByDate[d];
          if (!group) return;
          
          const dateObj = new Date(d);
          const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
          const weekdayStr = weekdays[dateObj.getDay()];
          
          textContent.push(\`\${d.replace(/-/g, '/')}(\${weekdayStr})\`);
          group.messages.forEach(msg => {
            const roleLabel = msg.role === "host" ? "[官方助手]" : "[使用者]";
            textContent.push(\`\${msg.time}\\t\${msg.sender}\${roleLabel}\\t\${msg.content}\`);
          });
          textContent.push('');
        });
        
        downloadFile(textContent.join('\\n'), filename);
      }
    }

    function previewSelectedLineExport() {
      if (!parsedChatLog || selectedDates.size === 0) {
        alert('請先載入 LINE 對話並勾選至少一天的對話紀錄！');
        return;
      }
      
      const chatName = parsedChatLog.chatName || '未命名對話';
      const sortedSelected = Array.from(selectedDates).sort();
      const prefix = document.getElementById('lineFilePrefix').value.trim() || 'LN';
      
      const minSelectedDate = sortedSelected[0];
      const maxSelectedDate = sortedSelected[sortedSelected.length - 1];
      const dateRangeStr = (minSelectedDate === maxSelectedDate) 
        ? minSelectedDate 
        : \`\${minSelectedDate}_\${maxSelectedDate}\`;
        
      const filename = \`\${prefix}_\${chatName}_\${dateRangeStr}.txt\`;
      
      let textContent = [];
      textContent.push(\`[LINE] \${chatName}的聊天記錄\`);
      textContent.push(\`儲存日期：\${new Date().toLocaleDateString('zh-TW')}\\n\`);
      
      sortedSelected.forEach(d => {
        const group = groupedByDate[d];
        if (!group) return;
        
        const dateObj = new Date(d);
        const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
        const weekdayStr = weekdays[dateObj.getDay()];
        
        textContent.push(\`\${d.replace(/-/g, '/')}(\${weekdayStr})\`);
        group.messages.forEach(msg => {
          textContent.push(\`\${msg.time}\\t\${msg.sender}\\t\${msg.content}\`);
        });
        textContent.push('');
      });
      
      openPreviewWindow(\`匯出檔案預覽：\${filename}\`, textContent.join('\\n'));
    }

    function previewSelectedDbExport() {
      if (!dbParsedEvents || dbSelectedDates.size === 0) {
        alert('請先選取官方助手對話並勾選至少一天的紀錄！');
        return;
      }
      
      const selectEl = document.getElementById('dbChatsSelect');
      const chatInfo = selectEl.options[selectEl.selectedIndex] ? selectEl.options[selectEl.selectedIndex].text : '官方帳號對話';
      const sortedSelected = Array.from(dbSelectedDates).sort();
      const prefix = document.getElementById('dbFilePrefix').value.trim() || 'DB';
      
      const minSelectedDate = sortedSelected[0];
      const maxSelectedDate = sortedSelected[sortedSelected.length - 1];
      const dateRangeStr = (minSelectedDate === maxSelectedDate) 
        ? minSelectedDate 
        : \`\${minSelectedDate}_\${maxSelectedDate}\`;
        
      const filename = \`\${prefix}_\${chatInfo}_\${dateRangeStr}.txt\`;
      
      let textContent = [];
      textContent.push(\`[LINE] 官方助手對話 - \${chatInfo}\`);
      textContent.push(\`儲存日期：\${new Date().toLocaleDateString('zh-TW')}\\n\`);
      
      sortedSelected.forEach(d => {
        const group = dbGroupedByDate[d];
        if (!group) return;
        
        const dateObj = new Date(d);
        const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
        const weekdayStr = weekdays[dateObj.getDay()];
        
        textContent.push(\`\${d.replace(/-/g, '/')}(\${weekdayStr})\`);
        group.messages.forEach(msg => {
          const roleLabel = msg.role === "host" ? "[官方助手]" : "[使用者]";
          textContent.push(\`\${msg.time}\\t\${msg.sender}\${roleLabel}\\t\${msg.content}\`);
        });
        textContent.push('');
      });
      
      openPreviewWindow(\`匯出檔案預覽：\${filename}\`, textContent.join('\\n'));
    }

    // ==========================================
    // FALO Prompt Template Manager Logic
    // ==========================================
     const defaultPrompts = [
      {
        name: "📌 預設: 對話摘要與待辦 (Falo Default)",
        content: "請分析以下對話紀錄，摘要雙方討論重點、已達成的決議以及待辦事項 (Task, Owner, Due Date)。\\n（提示：請使用結構清晰的 Markdown 格式輸出，前端會自動將其渲染為 HTML 好讀版，請在輸出時同時考慮 MD 原始碼與 HTML 網頁版之閱讀美感，善用標題、粗體、清單與表格排版。）"
      },
      {
        name: "🎯 任務待辦與專案里程碑稽核",
        content: "請扮演專案經理 (PM)，徹底掃描以下對話：\\n1. 萃取出所有提及的具體工作任務 (Action Items)。\\n2. 明確標示出負責人 (Owner) 與預計完成時間 (Due Date)，若無明確指派則標記為「未指派」。\\n3. 梳理出目前專案的主要里程碑 (Milestones) 或是關鍵交期。\\n4. 請以表格形式整理待辦清單，並依急迫性由高到低排序。"
      },
      {
        name: "🔍 客服回覆品質與滿意度檢測",
        content: "請扮演客服主管，審查以下官方助手與客戶的對話：\\n1. 客服人員 (官方助手) 的回覆語氣是否專業禮貌、是否精確解答了客戶痛點？\\n2. 客戶是否展現焦慮、生氣或不耐煩等負面情緒？請給出客戶情緒溫度 (冷靜/急躁/憤怒)。\\n3. 標記出客服應對中是否有答非所問或超時回覆的情形。\\n4. 提供客服應對質檢分數 (0-100)，並給出 3 點具體的應對優化建議。"
      },
      {
        name: "💡 銷售商機與用戶痛點需求挖掘",
        content: "請扮演業務行銷總監，分析對話以挖掘商業機會：\\n1. 識別出哪些客戶在對話中表達了明確的購買意願、興趣或諮詢？\\n2. 整理出客戶目前面臨的最大「痛點需求」與「預算/考量點」。\\n3. 客戶對產品功能或服務條款有哪些疑問或抗拒點 (Objections)？\\n4. 建議業務經理後續的最佳跟進 (Follow-up) 行動方案。"
      },
      {
        name: "⚠️ 爭議客訴與公關危機風險預警",
        content: "請扮演風控法務官，審查對話中的潛在風險：\\n1. 掃描是否有包含可能引發「法律訴訟」、「客訴退款爭議」或「公關危機」的言論。\\n2. 評估當前危機等級 (紅燈-高危/黃燈-中危/綠燈-安全)。\\n3. 指出最關鍵的衝突對話片段與原因。\\n4. 提供一份緊急的緩和對策與標準公關回覆口徑 (Draft Response)。"
      },
      {
        name: "🧠 團隊知識萃取與 FAQ 整理",
        content: "請扮演知識庫管理員 (Knowledge Manager)，從歷史對話中提煉有價值的 FAQ：\\n1. 找出群組成員最常詢問的 3-5 個常規技術/商務問題。\\n2. 結合對話中專家或官方給出的正確解答，整理成清晰的「Q&A 常見問答對」。\\n3. 提取對話中提及的專業術語、流程步驟或操作規範。\\n4. 這些問答將用來擴充系統 RAG 知識庫，請確保內容正確、步驟詳實。"
      },
      {
        name: "👥 成員參與度與活躍角色審計",
        content: "請扮演組織行為專家，評估群組成員的互動動態：\\n1. 統計或分析誰是群組中的「意見領袖 (Leader)」、「技術解惑者」與「提問者」。\\n2. 有無成員長時間處於被邊緣化或回覆冷淡的狀態？\\n3. 評估團隊內部的協作默契與共識凝聚力。\\n4. 針對提升群組互動活躍度，給出管理者的建議。"
      },
      {
        name: "📈 競品分析與客戶決策心智動向",
        content: "請扮演市場研究經理，分析對話中客戶的決策考量：\\n1. 客戶在對話中是否有提及其他競品公司或替代方案？(如比較價格、規格、售後等)\\n2. 客戶對我們產品的品牌形象 (Brand Perception) 評價為何？\\n3. 客戶最終決定下單（或流失）的核心決策因子是什麼？\\n4. 提出我們相較於競品的核心優勢與應改進的弱點。"
      },
      {
        name: "💬 情感傾向與團隊氛圍健康度量",
        content: "請扮演心靈導師或 HR 關懷專員，分析這段期間 of 對話氛圍：\\n1. 判斷對話的整體基調 (樂觀支持、焦慮緊繃、冷淡敷衍、互推職責)。\\n2. 分析有無特定成員出現工作壓力過載、情緒瀕臨崩潰或溝通衝突的跡象？\\n3. 評估團隊目前的「心理安全感」指數 (高/中/低)。\\n4. 提供 HR 或主管如何介入關懷、舉辦團建或調整分工的具體建議。"
      },
      {
        name: "📜 商業承諾與合約口頭協議稽核",
        content: "請扮演稽核專員，追蹤對話中對外承諾的合規性：\\n1. 找出業務或客服在對話中對客戶做出的任何口頭承諾 (如特批折扣、加贈好禮、特定交期、客製化開發等)。\\n2. 檢查這些承諾是否符合公司常規合約規範，有無「過度承諾 (Over-promise)」風險？\\n3. 列出需要向主管呈報審批的特批項目清單。\\n4. 建議後續應如何在正式合約或報價單中落實這些承諾條款。"
      }
    ];

    let customPrompts = [];
    try {
      customPrompts = JSON.parse(localStorage.getItem('faloCustomPrompts') || '[]');
    } catch(e) {
      customPrompts = [];
    }

    let selectedPromptKey = "default_0";

    function renderPromptTemplates() {
      const listEl = document.getElementById('promptTemplateList');
      if (!listEl) return;
      listEl.innerHTML = '';
      
      // Add default prompts
      defaultPrompts.forEach((p, idx) => {
        const itemKey = \`default_\${idx}\`;
        const isActive = (selectedPromptKey === itemKey) ? 'active' : '';
        
        const item = document.createElement('a');
        item.href = 'javascript:void(0)';
        item.className = \`list-group-item list-group-item-action prompt-list-item text-light border-0 py-2 px-3 small \${isActive}\`;
        item.style.background = 'transparent';
        item.style.fontSize = '12.5px';
        item.innerHTML = \`<i class="bi bi-file-earmark-text text-muted me-2"></i> \${p.name}\`;
        item.onclick = () => selectPromptTemplate(itemKey);
        listEl.appendChild(item);
      });
      
      // Add custom prompts
      customPrompts.forEach((p, idx) => {
        const itemKey = \`custom_\${idx}\`;
        const isActive = (selectedPromptKey === itemKey) ? 'active' : '';
        
        const item = document.createElement('a');
        item.href = 'javascript:void(0)';
        item.className = \`list-group-item list-group-item-action prompt-list-item text-light border-0 py-2 px-3 small d-flex justify-content-between align-items-center \${isActive}\`;
        item.style.background = 'transparent';
        item.style.fontSize = '12.5px';
        item.innerHTML = \`
          <span><i class="bi bi-star-fill text-warning me-2" style="font-size: 10px;"></i> \${p.name}</span>
          <button class="btn btn-link btn-xs p-0 text-danger" onclick="deleteCustomPromptItem(\${idx}, event)" title="刪除">
            <i class="bi bi-trash"></i>
          </button>
        \`;
        item.onclick = (e) => {
          if (e.target.closest('.btn')) return; // skip if delete button clicked
          selectPromptTemplate(itemKey);
        };
        listEl.appendChild(item);
      });
    }

    function selectPromptTemplate(key) {
      selectedPromptKey = key;
      const promptInput = document.getElementById('unifiedAiPromptInput');
      
      if (key.startsWith('default_')) {
        const idx = parseInt(key.split('_')[1], 10);
        if (promptInput) promptInput.value = defaultPrompts[idx].content;
      } else if (key.startsWith('custom_')) {
        const idx = parseInt(key.split('_')[1], 10);
        if (promptInput) promptInput.value = customPrompts[idx].content;
      }
      
      renderPromptTemplates();
      updateUnifiedCompiledContext();
    }

    function deleteCustomPromptItem(idx, event) {
      event.stopPropagation();
      const pName = customPrompts[idx].name;
      if (confirm(\`確定要刪除自訂提示詞「\${pName}」嗎？\`)) {
        customPrompts.splice(idx, 1);
        localStorage.setItem('faloCustomPrompts', JSON.stringify(customPrompts));
        
        if (selectedPromptKey === \`custom_\${idx}\`) {
          selectedPromptKey = 'default_0';
        } else if (selectedPromptKey.startsWith('custom_')) {
          const currentIdx = parseInt(selectedPromptKey.split('_')[1], 10);
          if (currentIdx > idx) {
            selectedPromptKey = \`custom_\${currentIdx - 1}\`;
          } else if (currentIdx === idx) {
            selectedPromptKey = 'default_0';
          }
        }
        
        selectPromptTemplate(selectedPromptKey);
      }
    }

    function showAddPromptForm() {
      document.getElementById('addPromptForm').classList.remove('d-none');
      document.getElementById('newPromptName').value = '';
      document.getElementById('newPromptContent').value = '';
      document.getElementById('newPromptName').focus();
    }

    function hideAddPromptForm() {
      document.getElementById('addPromptForm').classList.add('d-none');
    }

    function saveNewPromptTemplate() {
      const name = document.getElementById('newPromptName').value.trim();
      const content = document.getElementById('newPromptContent').value.trim();
      
      if (!name || !content) {
        alert('請填寫提示詞名稱與完整的提示詞內容！');
        return;
      }
      
      const isDuplicate = customPrompts.some(p => p.name === name) || defaultPrompts.some(p => p.name === name);
      if (isDuplicate) {
        alert('已存在同名的提示詞範本，請更換名稱！');
        return;
      }
      
      customPrompts.push({ name, content });
      localStorage.setItem('faloCustomPrompts', JSON.stringify(customPrompts));
      
      selectedPromptKey = \`custom_\${customPrompts.length - 1}\`;
      selectPromptTemplate(selectedPromptKey);
      
      hideAddPromptForm();
      alert(\`已成功儲存提示詞「\${name}」！\`);
    }

    function exportPromptsToCsv() {
      let csvContent = [];
      csvContent.push("Name,Content");
      
      // Export all templates
      const all = [...defaultPrompts, ...customPrompts];
      all.forEach(p => {
        const nameEscaped = '"' + p.name.replace(/"/g, '""') + '"';
        const contentEscaped = '"' + p.content.replace(/"/g, '""') + '"';
        csvContent.push(\`\${nameEscaped},\${contentEscaped}\`);
      });
      
      const fullCsv = csvContent.join('\\n');
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), fullCsv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', \`Falo_Prompts_Backup_\${new Date().toISOString().slice(0,10)}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function parseCsvString(csvText) {
      const lines = [];
      let row = [""];
      let inQuotes = false;
      
      for (let i = 0; i < csvText.length; i++) {
        const c = csvText[i];
        const next = csvText[i + 1];
        
        if (c === '"') {
          if (inQuotes && next === '"') {
            row[row.length - 1] += '"';
            i++; // skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          row.push("");
        } else if ((c === '\\r' || c === '\\n') && !inQuotes) {
          if (c === '\\r' && next === '\\n') {
            i++; // skip LF
          }
          lines.push(row);
          row = [""];
        } else {
          row[row.length - 1] += c;
        }
      }
      if (row.length > 1 || row[0] !== "") {
        lines.push(row);
      }
      return lines;
    }

    function importPromptsFromCsv(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        const rows = parseCsvString(text);
        
        if (rows.length < 2) {
          alert('CSV 格式錯誤或無資料！');
          return;
        }
        
        const header = rows[0];
        const nameIdx = header.findIndex(h => h.trim().toLowerCase() === 'name');
        const contentIdx = header.findIndex(h => h.trim().toLowerCase() === 'content');
        
        if (nameIdx === -1 || contentIdx === -1) {
          alert('CSV 標頭必須包含 "Name" 與 "Content" 兩個欄位名稱！');
          return;
        }
        
        let importedCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length <= Math.max(nameIdx, contentIdx)) continue;
          
          const name = row[nameIdx].trim();
          const content = row[contentIdx].trim();
          
          if (name && content) {
            const isDuplicate = customPrompts.some(p => p.name === name) || defaultPrompts.some(p => p.name === name);
            if (!isDuplicate) {
              customPrompts.push({ name, content });
              importedCount++;
            }
          }
        }
        
        if (importedCount > 0) {
          localStorage.setItem('faloCustomPrompts', JSON.stringify(customPrompts));
          renderPromptTemplates();
          alert(\`成功匯入 \${importedCount} 個自訂提示詞！\`);
        } else {
          alert('未匯入任何新提示詞（可能名稱重複或檔案內容為空）。');
        }
        
        event.target.value = '';
      };
      reader.readAsText(file, 'utf-8');
    }

    // ==========================================
    // FALO Prompt Textareas Font-Size and Height Controllers
    // ==========================================
    let currentPromptFontSize = 13;
    let currentPromptHeight = 300;
    let isSyncingHeight = false;

    function adjustPromptTextareasFontSize(delta) {
      currentPromptFontSize = Math.max(10, Math.min(24, currentPromptFontSize + delta));
      const textareaPrompt = document.getElementById('unifiedAiPromptInput');
      const textareaPreview = document.getElementById('unifiedCompiledContextPreview');
      
      if (textareaPrompt) textareaPrompt.style.fontSize = currentPromptFontSize + 'px';
      if (textareaPreview) textareaPreview.style.fontSize = currentPromptFontSize + 'px';
      
      const label = document.getElementById('promptTextareaFontSizeLabel');
      if (label) label.innerText = currentPromptFontSize + 'px';
      localStorage.setItem('faloPromptFontSize', currentPromptFontSize);
    }

    function adjustPromptTextareasHeight(delta) {
      currentPromptHeight = Math.max(150, Math.min(1200, currentPromptHeight + delta));
      const textareaPrompt = document.getElementById('unifiedAiPromptInput');
      const textareaPreview = document.getElementById('unifiedCompiledContextPreview');
      
      isSyncingHeight = true;
      if (textareaPrompt) textareaPrompt.style.height = currentPromptHeight + 'px';
      if (textareaPreview) textareaPreview.style.height = currentPromptHeight + 'px';
      isSyncingHeight = false;
      
      const label = document.getElementById('promptTextareasHeightLabel');
      if (label) label.innerText = currentPromptHeight + 'px';
      localStorage.setItem('faloPromptHeight', currentPromptHeight);
    }

    // Initialize ResizeObserver to synchronize native resize drags
    window.addEventListener('DOMContentLoaded', () => {
      // Load saved font size and height
      const savedFontSize = localStorage.getItem('faloPromptFontSize');
      if (savedFontSize) {
        currentPromptFontSize = parseInt(savedFontSize, 10);
        adjustPromptTextareasFontSize(0);
      }
      
      const savedHeight = localStorage.getItem('faloPromptHeight');
      if (savedHeight) {
        currentPromptHeight = parseInt(savedHeight, 10);
        adjustPromptTextareasHeight(0);
      } else {
        adjustPromptTextareasHeight(0); // Default 300px
      }

      const textareaPrompt = document.getElementById('unifiedAiPromptInput');
      const textareaPreview = document.getElementById('unifiedCompiledContextPreview');
      
      if (textareaPrompt && textareaPreview && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(entries => {
          if (isSyncingHeight) return;
          for (let entry of entries) {
            const newHeight = entry.target.offsetHeight;
            if (newHeight <= 0) continue; // Skip hidden elements
            
            const otherTextarea = (entry.target === textareaPrompt) ? textareaPreview : textareaPrompt;
            // Only sync if the height difference is significant (> 4px) to prevent circular feedback loops
            if (Math.abs(otherTextarea.offsetHeight - newHeight) > 4) {
              isSyncingHeight = true;
              otherTextarea.style.height = newHeight + 'px';
              currentPromptHeight = newHeight;
              
              const label = document.getElementById('promptTextareasHeightLabel');
              if (label) label.innerText = newHeight + 'px';
              localStorage.setItem('faloPromptHeight', newHeight);
              isSyncingHeight = false;
            }
          }
        });
        observer.observe(textareaPrompt);
        observer.observe(textareaPreview);
      }
    });

    // Global event listener to add btn-clicked class for click visual feedback
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (btn) {
        btn.classList.add('btn-clicked');
        setTimeout(() => {
          btn.classList.remove('btn-clicked');
        }, 150);
      }
    });
  </script>

  <!-- Modal: Cloud Files Manager -->
  <div class="modal fade" id="cloudFilesManagerModal" tabindex="-1" aria-labelledby="cloudFilesManagerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content" style="background: #0f172a; color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        <div class="modal-header border-secondary border-opacity-20">
          <h5 class="modal-title fw-bold text-teal d-flex align-items-center gap-2" id="cloudFilesManagerModalLabel" style="color: var(--primary-teal);">
            <i class="bi bi-clouds-fill"></i> ☁️ 雲端備份檔案管理器
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4">
          <!-- Exports Folder Direct Link Alert -->
          <div class="alert alert-info py-3 px-4 border border-info border-opacity-25 rounded mb-4" style="background: rgba(14, 165, 233, 0.1);">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div class="text-light">
                <i class="bi bi-folder-symlink-fill text-info me-2 fs-5"></i>
                <span>Google Drive 雲端實體備份資料夾目錄：</span>
              </div>
              <a class="btn btn-sm btn-outline-info text-decoration-none fw-bold" id="modalExportsFolderLink" href="https://drive.google.com" target="_blank">
                <i class="bi bi-box-arrow-up-right"></i> 在網頁中開啟 Google Drive 資料夾
              </a>
            </div>
          </div>

          <!-- Files Table -->
          <div class="table-responsive border border-secondary border-opacity-20 rounded" style="max-height: 450px; overflow-y: auto; background: rgba(15, 23, 42, 0.6);">
            <table class="table table-dark table-striped table-hover align-middle mb-0" style="font-size: 13px;">
              <thead class="sticky-top" style="z-index: 10;">
                <tr class="table-dark" style="border-bottom: 2px solid rgba(255, 255, 255, 0.1);">
                  <th style="background: #1e293b; color: #a78bfa;">別名 (雙擊或點右側圖示編輯)</th>
                  <th style="background: #1e293b; color: #9ca3af;">原始檔案名稱 / 雲端 ID</th>
                  <th style="background: #1e293b; color: #9ca3af; width: 100px;">大小</th>
                  <th style="background: #1e293b; color: #9ca3af; width: 160px;">上傳時間</th>
                  <th style="background: #1e293b; color: #f43f5e; width: 120px;" class="text-center">操作</th>
                </tr>
              </thead>
              <tbody id="managerFilesTableBody">
                <!-- Dynamically populated by JS -->
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer border-secondary border-opacity-20 p-3">
          <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>

  <!-- JS: Marked.js for Markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <!-- JS: Bootstrap 5 Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;
const MOBILE_HTML = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Falo IM 快捷手機版</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-teal: #0ea5e9;
      --primary-purple: #8b5cf6;
      --bg-slate: #0f172a;
      --border-color: rgba(255, 255, 255, 0.08);
    }
    
    body {
      background-color: #05070f;
      color: #f8fafc;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
    
    /* Mobile portrait viewport layout on desktop, full screen on mobile */
    .mobile-container {
      max-width: 500px;
      min-height: 100vh;
      margin: 0 auto;
      background-color: var(--bg-slate);
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 16px 16px 30px 16px;
    }
    
    .header {
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 16px;
    }
    
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      background: linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
    }
    
    .status-badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 20px;
      background: rgba(14, 165, 233, 0.1);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.2);
    }
    
    .glass-box {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .card-title-custom {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .group-header {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      margin: 12px 0 6px 0;
      padding-bottom: 4px;
      border-bottom: 1px dashed rgba(255,255,255,0.05);
    }
    
    .chat-checkbox-item {
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 10px;
      transition: all 0.2s;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    .chat-checkbox-item:hover, .chat-checkbox-item:active {
      border-color: var(--primary-teal);
      background: rgba(14, 165, 233, 0.05);
    }
    
    .chat-checkbox-item.selected {
      border-color: var(--primary-teal) !important;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%) !important;
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.15);
    }
    
    .chat-checkbox-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-teal);
      flex-shrink: 0;
    }

    /* LINE Simulation CSS */
    .line-chat-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 20px;
    }
    
    .chat-date-header {
      text-align: center;
      margin: 16px 0;
    }
    
    .chat-date-badge {
      background: rgba(0, 0, 0, 0.25);
      color: #cbd5e1;
      font-size: 10px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
    
    .chat-msg-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 6px;
      max-width: 85%;
    }
    
    .chat-msg-row.left-msg {
      align-self: flex-start;
    }
    
    .chat-msg-row.right-msg {
      align-self: flex-end;
      flex-direction: row-reverse;
      max-width: 85%;
    }
    
    .chat-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: #ffffff;
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-msg-content-wrapper {
      margin-left: 8px;
      margin-right: 8px;
      display: flex;
      flex-direction: column;
    }
    
    .chat-sender-name {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 3px;
    }
    
    .chat-bubble-container {
      display: flex;
      align-items: flex-end;
    }
    
    .chat-bubble-left {
      background: rgba(30, 41, 59, 0.9);
      color: #f1f5f9;
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 0 12px 12px 12px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .chat-bubble-right {
      background: #0d9488;
      color: #ffffff;
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 12px 0 12px 12px;
      white-space: pre-wrap;
      word-break: break-all;
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.2);
    }
    
    .chat-bubble-time {
      font-size: 9px;
      color: #64748b;
      margin: 0 6px;
      white-space: nowrap;
    }
    
    .chat-system-msg {
      align-self: center;
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.02);
      margin: 8px 0;
    }
    
    .preview-btn-mobile {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    
    .preview-btn-mobile:hover, .preview-btn-mobile:active {
      background: var(--primary-teal);
      border-color: var(--primary-teal);
      color: #ffffff;
    }
    
    .badge-source {
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .badge-db {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .badge-file {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
    
    /* Segmented Time Range Controller */
    .range-selector-row {
      display: flex;
      gap: 6px;
      margin-bottom: 12px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .range-pill {
      flex: 1;
      text-align: center;
      padding: 8px 4px;
      border-radius: 8px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-color);
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .range-pill.active {
      background: var(--primary-teal);
      border-color: var(--primary-teal);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
    }
    
    .form-control-custom {
      background: rgba(15, 23, 42, 0.8) !important;
      border: 1px solid var(--border-color) !important;
      color: #f8fafc !important;
      border-radius: 8px !important;
    }
    
    .form-control-custom:focus {
      border-color: var(--primary-teal) !important;
      box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
    }
    
    .btn-purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%) !important;
      color: #ffffff !important;
      border: none !important;
      font-weight: 700 !important;
      border-radius: 8px !important;
      padding: 12px !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
      transition: all 0.2s !important;
    }
    
    .btn-purple:active {
      transform: scale(0.98);
      box-shadow: 0 2px 6px rgba(99, 102, 241, 0.2) !important;
    }
    
    .btn-purple:disabled {
      background: #334155 !important;
      box-shadow: none !important;
      opacity: 0.6;
    }
    
    #reportOutput pre {
      background: #0f172a;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      color: #e2e8f0;
      white-space: pre-wrap;
      font-size: 13px;
    }
    
    #reportOutput .report-rendered {
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.6;
    }
    #reportOutput .report-rendered h1, #reportOutput .report-rendered h2, #reportOutput .report-rendered h3 {
      color: #fbbf24;
      font-weight: 700;
      margin-top: 16px;
    }
    #reportOutput .report-rendered ul, #reportOutput .report-rendered ol {
      padding-left: 20px;
    }
    
    .collapsible-header {
      cursor: pointer;
      display: flex;
      align-items: center;
      user-select: none;
      padding: 6px 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .collapsible-header:hover, .collapsible-header:active {
      background: rgba(255, 255, 255, 0.05);
    }
    .transition-transform {
      transition: transform 0.2s;
    }
    .icon-rotated {
      transform: rotate(-90deg);
    }
    .collapse-content {
      padding-top: 4px;
    }
    .back-link {
      font-size: 12px;
      color: #64748b;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: color 0.2s;
    }
    .back-link:hover {
      color: #38bdf8;
    }

    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }
      .mobile-container > *:not(#reportCard),
      #reportCard .card-title-custom,
      .mt-auto {
        display: none !important;
      }
      .mobile-container {
        max-width: 100% !important;
        border: none !important;
        box-shadow: none !important;
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #reportCard {
        display: block !important;
        background: transparent !important;
        border: none !important;
      }
      #reportOutput {
        max-height: none !important;
        overflow: visible !important;
        color: #000000 !important;
      }
      #reportOutput .report-rendered {
        color: #000000 !important;
      }
      #reportOutput .report-rendered h1, 
      #reportOutput .report-rendered h2, 
      #reportOutput .report-rendered h3 {
        color: #000000 !important;
        border-bottom: 1px solid #dddddd;
        padding-bottom: 4px;
      }
    /* File Preview Modal Styles */
    .preview-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    
    .preview-content-box {
      width: 100%;
      max-width: 480px;
      height: 85vh;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }
    
    .preview-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
      background: rgba(15, 23, 42, 0.4);
    }
    
    .preview-scroll-body {
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px;
      background: #090d16;
      font-family: monospace;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.5;
    }
    
    .preview-text-content {
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .preview-line-loading-badge {
      text-align: center;
      font-size: 10px;
      color: var(--primary-teal);
      background: rgba(14, 165, 233, 0.1);
      border: 1px dashed rgba(14, 165, 233, 0.2);
      border-radius: 6px;
      padding: 6px;
      margin-bottom: 12px;
    }
    
    /* Touch friendly preview icon styles */
    .preview-icon-btn {
      color: #64748b;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.02);
      transition: all 0.2s;
      cursor: pointer;
    }
    .preview-icon-btn:hover, .preview-icon-btn:active {
      color: var(--primary-teal);
      background: rgba(14, 165, 233, 0.1);
      border-color: rgba(14, 165, 233, 0.2);
    }
    }
  </style>
</head>
<body>

  <div class="mobile-container">
    <!-- Header -->
    <div class="header d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-2">
        <i class="bi bi-cpu-fill text-teal fs-4" style="color: var(--primary-teal);"></i>
        <span class="logo-text">Falo IM Mobile</span>
      </div>
      <span class="status-badge" id="connStatus"><i class="bi bi-wifi"></i> 連線中...</span>
    </div>

    <!-- Step 1: Select Chats (Official Accounts + Uploaded Files) -->
    <div class="glass-box">
      <div class="card-title-custom">
        <i class="bi bi-chat-left-text-fill text-teal" style="color: var(--primary-teal);"></i>
        1. 選擇對話資料來源 (可多選)
      </div>
      <div id="chatsListContainer" style="max-height: 220px; overflow-y: auto; padding-right: 4px;">
        <div class="text-center text-muted py-3 small">正在載入雲端對話與檔案清單...</div>
      </div>
    </div>

    <!-- Step 2: Time Range Filter Presets -->
    <div class="glass-box">
      <div class="card-title-custom">
        <i class="bi bi-calendar-event text-warning"></i>
        2. 篩選時間範圍
      </div>
      <div class="range-selector-row">
        <div class="range-pill" id="pill_today" onclick="selectTimeRange('today')">今天</div>
        <div class="range-pill active" id="pill_week" onclick="selectTimeRange('week')">本週</div>
        <div class="range-pill" id="pill_month" onclick="selectTimeRange('month')">本月</div>
        <div class="range-pill" id="pill_all" onclick="selectTimeRange('all')">全部</div>
        <div class="range-pill" id="pill_custom" onclick="selectTimeRange('custom')">自訂天數</div>
      </div>
      
      <!-- Custom Days Input (Hidden by default) -->
      <div id="customDaysWrapper" class="mb-3" style="display: none;">
        <label class="form-label text-muted small fw-bold mb-1">自訂篩選天數 (包含今天)</label>
        <div class="input-group input-group-sm">
          <input type="number" id="customDaysInput" class="form-control form-control-custom text-center" value="3" min="1" max="180" onchange="autoSelectSourcesByTimeRange()" oninput="autoSelectSourcesByTimeRange()">
          <span class="input-group-text bg-dark border-secondary text-light small">天內</span>
        </div>
      </div>
    </div>

    <!-- Step 3: Prompt & Model -->
    <div class="glass-box">
      <div class="card-title-custom">
        <i class="bi bi-cpu-fill text-indigo" style="color: #8b5cf6;"></i>
        3. 設定分析參數
      </div>
      
      <!-- Model Provider Select -->
      <div class="row g-2 mb-3">
        <div class="col-6">
          <label class="form-label text-muted small fw-bold mb-1">模型來源</label>
          <select id="modelProviderSelect" class="form-select form-control-custom" onchange="toggleMobileModelProvider()">
            <option value="builtin" selected>☁️ 內建 AI (CF)</option>
            <option value="gemini">✨ Google Gemini</option>
          </select>
        </div>
        
        <div class="col-6" id="builtinModelCol">
          <label class="form-label text-muted small fw-bold mb-1">內建 AI 模型</label>
          <select id="builtinModelSelect" class="form-select form-control-custom">
            <option value="@cf/meta/llama-3.3-70b-instruct-fp8-fast">Llama 3.3 70B (進階高智能)</option>
            <option value="@cf/mistralai/mistral-small-3.1-24b-instruct" selected>Mistral Small 24B (中型長文本)</option>
            <option value="@cf/meta/llama-3.2-3b-instruct">Llama 3.2 3B (輕量對話極速)</option>
          </select>
        </div>
        
        <div class="col-6" id="geminiModelCol" style="display: none;">
          <label class="form-label text-muted small fw-bold mb-1">Gemini 模型</label>
          <select id="geminiModelSelect" class="form-select form-control-custom">
            <option value="gemini-3.1-flash-lite" selected>Gemini 3.1 Flash-Lite (預設)</option>
            <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
            <option value="gemini-3.1-flash">Gemini 3.1 Flash</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite</option>
          </select>
        </div>
      </div>

      <!-- Gemini Key Input -->
      <div id="geminiKeyCol" class="mb-3" style="display: none;">
        <label class="form-label text-muted small fw-bold mb-1"><i class="bi bi-key"></i> Gemini API Key (可選)</label>
        <div class="d-flex gap-1">
          <input type="password" id="geminiKeyInput" class="form-control form-control-custom py-1 px-2" style="font-size: 12px; height: 32px;" placeholder="輸入 API Key">
          <button class="btn btn-outline-success btn-sm px-2" style="font-size: 11px; height: 32px;" onclick="saveMobileGeminiKey()"><i class="bi bi-save"></i> 儲存</button>
        </div>
      </div>

      <!-- Prompt Input -->
      <div class="mb-2">
        <label class="form-label text-muted small fw-bold mb-1">分析指令 / 問題 (Prompt)</label>
        <textarea id="promptInput" class="form-control form-control-custom" rows="3" placeholder="請輸入您想問 AI 的問題...">摘要最近的對話重點與代辦事項</textarea>
      </div>
    </div>

    <!-- Action Button -->
    <button class="btn btn-purple w-100 mb-3" id="btnAnalyze" onclick="startMobileAnalysis()" disabled>
      <i class="bi bi-lightning-fill"></i> ⚡ 開始 AI 分析
    </button>

    <!-- Step 4: Analysis Report -->
    <div class="glass-box flex-grow-1 d-flex flex-column" id="reportCard" style="display: none !important;">
      <div class="card-title-custom justify-content-between align-items-center">
        <span class="d-flex align-items-center gap-2">
          <i class="bi bi-file-earmark-bar-graph-fill text-warning"></i> 4. 系統分析報告
        </span>
        <div class="d-flex align-items-center gap-1">
          <!-- Font size controls -->
          <div class="btn-group" role="group" style="height: 22px;">
            <button class="btn btn-xs btn-outline-light py-0 px-2" style="font-size: 10px; line-height: 1.2;" onclick="adjustFontSize(-2)" title="縮小字體"><i class="bi bi-dash"></i>A</button>
            <button class="btn btn-xs btn-outline-light py-0 px-2" style="font-size: 10px; line-height: 1.2;" onclick="adjustFontSize(2)" title="放大字體"><i class="bi bi-plus"></i>A</button>
          </div>
          <!-- Copy and PDF buttons -->
          <button class="btn btn-sm btn-outline-light py-0 px-2" style="font-size: 11px; height: 22px; line-height: 1.8;" id="copyBtn" onclick="copyReport()"><i class="bi bi-clipboard"></i> 複製</button>
          <button class="btn btn-sm btn-outline-light py-0 px-2" style="font-size: 11px; height: 22px; line-height: 1.8;" onclick="exportToPdf()"><i class="bi bi-file-pdf"></i> PDF</button>
        </div>
      </div>
      <div id="reportOutput" class="flex-grow-1 overflow-y-auto" style="max-height: 350px;"></div>
    </div>



    <!-- Footer Links -->
    <div class="mt-auto pt-3 text-center border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
      <a href="/mvp" class="back-link"><i class="bi bi-arrow-left"></i> 返回電腦版控制台</a>
      <span class="text-muted" style="font-size: 11px;">Falo IM 3.03 © 2026</span>
    </div>
  </div>

  <!-- JS: Bootstrap 5 Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- JS: Marked.js for Markdown rendering -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <script>
    let registeredChats = [];
    let driveFiles = [];
    let selectedTimeRangePreset = 'week'; // default week
    let currentFontSize = 14;

    document.addEventListener('DOMContentLoaded', () => {
      loadAllSources();
      
      // Load saved font size preference
      const savedSize = localStorage.getItem('faloReportFontSize');
      if (savedSize) {
        currentFontSize = parseInt(savedSize, 10);
        const reportOutput = document.getElementById('reportOutput');
        if (reportOutput) {
          reportOutput.style.fontSize = currentFontSize + 'px';
        }
      }
    });

    function selectTimeRange(preset) {
      selectedTimeRangePreset = preset;
      
      // Update pills UI
      const presets = ['today', 'week', 'month', 'all', 'custom'];
      presets.forEach(p => {
        const pill = document.getElementById(\`pill_\${p}\`);
        if (p === preset) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
      
      // Toggle custom days input wrapper
      const wrapper = document.getElementById('customDaysWrapper');
      if (preset === 'custom') {
        wrapper.style.display = 'block';
      } else {
        wrapper.style.display = 'none';
      }

      // Auto check dialogue files according to selected time range boundary
      autoSelectSourcesByTimeRange();
    }

    async function loadAllSources() {
      const container = document.getElementById('chatsListContainer');
      const connStatus = document.getElementById('connStatus');
      
      try {
        // Parallel fetch for active chats list and uploaded drive files
        const [chatsRes, filesRes] = await Promise.all([
          fetch('/api/chats'),
          fetch('/api/dialogue-files')
        ]);
        
        if (!chatsRes.ok) throw new Error('Chats list HTTP ' + chatsRes.status);
        if (!filesRes.ok) throw new Error('Files list HTTP ' + filesRes.status);
        
        const chatsJson = await chatsRes.json();
        const filesJson = await filesRes.json();
        
        registeredChats = chatsJson.ok ? chatsJson.data : [];
        driveFiles = filesJson.ok ? filesJson.files : [];
        
        if (registeredChats.length === 0 && driveFiles.length === 0) {
          container.innerHTML = '<div class="text-center text-secondary py-3 small">（無對話資料庫或備份紀錄）</div>';
          connStatus.innerHTML = '<i class="bi bi-wifi-off text-warning"></i> 無資料';
          return;
        }
        
        let html = '';
        let chkIndex = 0;
        
        // A. Render Active Bot Chats
        if (registeredChats.length > 0) {
          html += \`
            <div class="group-header collapsible-header d-flex justify-content-between align-items-center" onclick="toggleGroupCollapse('group_db')">
              <span><i class="bi bi-cpu-fill text-teal me-1"></i> 官方帳號即時對話 (\${registeredChats.length})</span>
              <i class="bi bi-chevron-down ms-auto transition-transform icon-rotated" id="icon_group_db"></i>
            </div>
            <div id="group_db" class="collapse-content" style="display: none;">
          \`;
          registeredChats.forEach(c => {
            const hasCustom = c.custom_name && c.custom_name !== c.default_name;
            const labelName = hasCustom 
              ? \`\${c.custom_name} <span class="text-muted" style="font-size:11px;">(\${c.default_name})</span>\` 
              : c.default_name;
            
            html += \`
              <div class="chat-checkbox-item d-flex justify-content-between align-items-center" onclick="toggleCheckbox('chk_\${chkIndex}')">
                <div class="d-flex align-items-center gap-2 text-truncate" style="flex-grow: 1;">
                  <input type="checkbox" id="chk_\${chkIndex}" data-type="db" data-bot-alias="\${c.bot_alias}" data-chat-id="\${c.chat_id}" data-display-name="\${c.custom_name || c.default_name}" onclick="event.stopPropagation(); toggleAnalyzeBtnState();">
                  <div class="text-truncate">
                    <div class="fw-bold small text-light text-truncate">\${labelName} <span class="badge-source badge-db ms-1">官方對話</span></div>
                    <div class="text-muted" style="font-size:10px; font-family:monospace;">\${c.bot_alias} | \${c.chat_id.slice(0, 12)}...</div>
                  </div>
                </div>
                <!-- 👁️ Preview button -->
                <button class="preview-btn-mobile ms-2" onclick="openDbChatPreview(event, '\${c.chat_id}', '\${c.bot_alias}', '\${c.custom_name || c.default_name}')">
                  <i class="bi bi-eye"></i> 預覽
                </button>
              </div>
            \`;
            chkIndex++;
          });
          html += \`</div>\`;
        }
        
        // B. Render Uploaded Backup Files
        if (driveFiles.length > 0) {
          html += \`
            <div class="group-header collapsible-header d-flex justify-content-between align-items-center" onclick="toggleGroupCollapse('group_file')">
              <span><i class="bi bi-file-earmark-text-fill text-warning me-1"></i> 已上傳備份檔案 (\${driveFiles.length})</span>
              <i class="bi bi-chevron-down ms-auto transition-transform icon-rotated" id="icon_group_file"></i>
            </div>
            <div id="group_file" class="collapse-content" style="display: none;">
          \`;
          driveFiles.forEach(f => {
            html += \`
              <div class="chat-checkbox-item d-flex justify-content-between align-items-center" onclick="toggleCheckbox('chk_\${chkIndex}')">
                <div class="d-flex align-items-center gap-2 text-truncate" style="flex-grow: 1;">
                  <input type="checkbox" id="chk_\${chkIndex}" data-type="file" data-file-id="\${f.id}" data-created="\${f.created}" data-display-name="\${f.displayName}" onclick="event.stopPropagation(); toggleAnalyzeBtnState();">
                  <div class="text-truncate">
                    <div class="fw-bold small text-light text-truncate">\${f.displayName} <span class="badge-source badge-file ms-1">備份檔案</span></div>
                    <div class="text-muted" style="font-size:10px; font-family:monospace;">\${(f.size / 1024).toFixed(1)} KB | \${f.created.substring(0, 16)}</div>
                  </div>
                </div>
                <!-- 👁️ Preview button -->
                <button class="preview-btn-mobile ms-2" onclick="openFilePreview(event, '\${f.id}', '\${f.displayName}')">
                  <i class="bi bi-eye"></i> 預覽
                </button>
              </div>
            \`;
            chkIndex++;
          });
          html += \`</div>\`;
        }
        
        container.innerHTML = html;
        connStatus.innerHTML = '<i class="bi bi-wifi text-success"></i> 已連線';
        connStatus.className = 'status-badge text-success';
        
        // Initialize checkboxes as unchecked by default
        toggleAnalyzeBtnState();
        
      } catch (err) {
        console.error('Failed to load sources list:', err);
        container.innerHTML = \`<div class="text-center text-danger py-3 small">載入失敗: \${err.message}</div>\`;
        connStatus.innerHTML = '<i class="bi bi-x-circle text-danger"></i> 連線失敗';
        connStatus.className = 'status-badge text-danger';
      }
    }

    function toggleCheckbox(id) {
      const chk = document.getElementById(id);
      if (chk) {
        chk.checked = !chk.checked;
        toggleAnalyzeBtnState();
      }
    }

    function toggleAnalyzeBtnState() {
      const checkboxes = document.querySelectorAll('#chatsListContainer input[type="checkbox"]');
      const analyzeBtn = document.getElementById('btnAnalyze');
      let checkedCount = 0;
      checkboxes.forEach(cb => {
        // Highlight parent card when checked
        const card = cb.closest('.chat-checkbox-item');
        if (card) {
          if (cb.checked) {
            card.classList.add('selected');
          } else {
            card.classList.remove('selected');
          }
        }
        if (cb.checked) checkedCount++;
      });
      analyzeBtn.disabled = (checkedCount === 0);
    }

    // Auto select backup files if their creation/upload date falls inside selected time range
    function autoSelectSourcesByTimeRange() {
      const todayStr = getTaipeiDateString(new Date());
      const todayMs = new Date(todayStr + 'T00:00:00+08:00').getTime();
      
      const checkboxes = document.querySelectorAll('#chatsListContainer input[type="checkbox"]');
      checkboxes.forEach(cb => {
        const type = cb.getAttribute('data-type');
        if (type === 'file') {
          const createdStr = cb.getAttribute('data-created'); // ISO string e.g. "2026-07-05T21:07:41..."
          if (!createdStr) return;
          
          const fileDateStr = createdStr.substring(0, 10);
          const fileMs = new Date(fileDateStr + 'T00:00:00+08:00').getTime();
          
          let shouldCheck = false;
          if (selectedTimeRangePreset === 'today') {
            shouldCheck = (fileDateStr === todayStr);
          } else if (selectedTimeRangePreset === 'week') {
            const weekAgoMs = todayMs - 6 * 24 * 60 * 60 * 1000;
            shouldCheck = (fileMs >= weekAgoMs);
          } else if (selectedTimeRangePreset === 'month') {
            const currentYear = new Date().getFullYear();
            const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
            const startOfMonthMs = new Date(\`\${currentYear}-\${currentMonth}-01T00:00:00+08:00\`).getTime();
            shouldCheck = (fileMs >= startOfMonthMs);
          } else if (selectedTimeRangePreset === 'custom') {
            const days = parseInt(document.getElementById('customDaysInput').value || '3', 10);
            const customAgoMs = todayMs - (days - 1) * 24 * 60 * 60 * 1000;
            shouldCheck = (fileMs >= customAgoMs);
          } else if (selectedTimeRangePreset === 'all') {
            shouldCheck = true;
          }
          
          cb.checked = shouldCheck;
        } else if (type === 'db') {
          // Do not check database chats by default
          cb.checked = false;
        }
      });
      toggleAnalyzeBtnState();
    }

    function getTaipeiDateString(date) {
      const taipeiOffset = 8 * 60 * 60 * 1000;
      const localTime = date.getTime();
      const taipeiTime = new Date(localTime + taipeiOffset);
      return taipeiTime.toISOString().split('T')[0];
    }

    // LINE chat log text parser implementing Falo Spec
    function parseLineChatLog(text, filename = "backup.txt") {
      const lines = text.split(/\\r?\\n/);
      if (lines.length === 0) return [];
      
      let maxAllowedDateObj = new Date();
      maxAllowedDateObj.setDate(maxAllowedDateObj.getDate() + 1); // tomorrow fallback
      
      const exportDateRegex = /(?:儲存日期|Saved date)[：:\\s]*(\\d{4})[/\\-.年](\\d{1,2})[/\\-.月](\\d{1,2})/;
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const match = lines[i].match(exportDateRegex);
        if (match) {
          const y = match[1];
          const m = match[2].padStart(2, '0');
          const d = match[3].padStart(2, '0');
          const parsedExportDate = new Date(\`\${y}-\${m}-\${d}\`);
          if (!isNaN(parsedExportDate.getTime())) {
            maxAllowedDateObj = parsedExportDate;
            break;
          }
        }
      }

      const messages = [];
      let currentDateStr = "2020-01-01";
      let lastParsedDateObj = null;
      let isNextLineNewDate = false;
      
      const dateRegex = /^(\\d{4})[/\\-.年](\\d{1,2})[/\\-.月](\\d{1,2})(?:日)?(?:\\s*（[^）]+）|\\s*\\([^)]+\\)|\\s*星期[一二三四五六日]|\\s*[a-zA-Z]+)?\\s*$/;
      const msgRegex = /^((?:上午|下午)?\\d{2}:\\d{2})\\t([^\\t]+)\\t(.*)$/;
      
      function isValidDateHeader(y, m, d) {
        const year = parseInt(y, 10);
        if (year < 2011) return false;
        
        const candidateStr = \`\${y}-\${m}-\${d}\`;
        const candidateDateObj = new Date(candidateStr);
        if (isNaN(candidateDateObj.getTime())) return false;
        
        if (maxAllowedDateObj && candidateDateObj > maxAllowedDateObj) return false;
        if (lastParsedDateObj && candidateDateObj < lastParsedDateObj) return false;
        return true;
      }
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === "") {
          isNextLineNewDate = true;
          continue;
        }
        
        if (isNextLineNewDate) {
          const dateMatch = line.match(dateRegex);
          if (dateMatch) {
            const y = dateMatch[1];
            const m = dateMatch[2].padStart(2, '0');
            const d = dateMatch[3].padStart(2, '0');
            if (isValidDateHeader(y, m, d)) {
              currentDateStr = \`\${y}-\${m}-\${d}\`;
              lastParsedDateObj = new Date(currentDateStr);
              isNextLineNewDate = false;
              continue;
            }
          }
        }
        
        const msgMatch = line.match(msgRegex);
        if (msgMatch) {
          isNextLineNewDate = false;
          const rawTime = msgMatch[1];
          const sender = msgMatch[2];
          const content = msgMatch[3];
          
          let hourMin = rawTime;
          const isPm = rawTime.includes("下午");
          const isAm = rawTime.includes("上午");
          let cleanTime = rawTime.replace("下午", "").replace("上午", "").trim();
          const timeParts = cleanTime.split(":");
          if (timeParts.length === 2) {
            let h = parseInt(timeParts[0]);
            const m = timeParts[1];
            if (isPm && h < 12) h += 12;
            if (isAm && h === 12) h = 0;
            hourMin = \`\${String(h).padStart(2, '0')}:\${m}\`;
          }
          
          let type = "text";
          if (content === "[圖片]" || content === "[Photo]") type = "image";
          else if (content === "[貼圖]" || content === "[Sticker]") type = "sticker";
          else if (content === "[檔案]" || content === "[File]") type = "file";
          else if (content.startsWith("☎ 通話時間") || content.startsWith("☎ Call time")) type = "call";
          else if (content.includes("unsent a message") || content.includes("收回訊息")) type = "unsent";
          
          messages.push({
            date: currentDateStr,
            time: hourMin,
            sender: sender,
            content: content,
            type: type
          });
        } else {
          if (messages.length > 0 && !line.startsWith("儲存日期：")) {
            const lastMsg = messages[messages.length - 1];
            lastMsg.content += "\\n" + line;
          }
        }
      }
      return messages;
    }

    async function startMobileAnalysis() {
      const checkboxes = document.querySelectorAll('#chatsListContainer input[type="checkbox"]');
      const selectedDb = [];
      const selectedFiles = [];
      
      checkboxes.forEach(cb => {
        if (cb.checked) {
          const type = cb.getAttribute('data-type');
          const displayName = cb.getAttribute('data-display-name');
          if (type === 'db') {
            selectedDb.push({
              botAlias: cb.getAttribute('data-bot-alias'),
              chatId: cb.getAttribute('data-chat-id'),
              displayName: displayName
            });
          } else if (type === 'file') {
            selectedFiles.push({
              fileId: cb.getAttribute('data-file-id'),
              displayName: displayName
            });
          }
        }
      });

      if (selectedDb.length === 0 && selectedFiles.length === 0) {
        alert('請至少選擇一個資料來源！');
        return;
      }

      // Double confirmation for All history to prevent token explosion
      if (selectedTimeRangePreset === 'all') {
        const confirmAll = confirm('⚠️ 您選擇了「全部歷史紀錄」！\\n這將會抓取並分析對話的所有內容，載入與分析速度會較慢，且會消耗較多 AI Token。確定要繼續嗎？');
        if (!confirmAll) return;
      }

      const promptText = document.getElementById('promptInput').value.trim();
      if (!promptText) {
        alert('請輸入分析指令！');
        return;
      }

      const provider = document.getElementById('modelProviderSelect').value;
      const model = (provider === 'builtin')
        ? document.getElementById('builtinModelSelect').value
        : document.getElementById('geminiModelSelect').value;
        
      const analyzeBtn = document.getElementById('btnAnalyze');
      const reportCard = document.getElementById('reportCard');
      const reportOutput = document.getElementById('reportOutput');
      
      const originalText = analyzeBtn.innerHTML;
      analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 載入數據中...';
      analyzeBtn.disabled = true;
      
      reportCard.style.setProperty('display', 'flex', 'important');
      reportOutput.innerHTML = '<div class="text-center py-5 text-secondary"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>正在並行抓取與解析雲端對話數據...</div>';

      try {
        let allMessages = [];

        // 1. Fetch DB Chat Events in Parallel
        const dbPromises = selectedDb.map(item => {
          return fetch(\`/api/chat-events?chat_id=\${item.chatId}&bot_alias=\${item.botAlias}\`)
            .then(res => {
              if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
              return res.json();
            })
            .then(resJson => {
              if (resJson.ok && resJson.data) {
                resJson.data.forEach(ev => {
                  const timeVal = ev.captured_at ? new Date(ev.captured_at).getTime() : 0;
                  allMessages.push({
                    timestamp: timeVal,
                    dateStr: ev.captured_at ? ev.captured_at.substring(0, 10) : '未知日期',
                    timeStr: ev.captured_at ? ev.captured_at.substring(11, 16) : '00:00',
                    sender: ev.sender_name || (ev.sender_role === 'host' ? '官方助手' : '使用者'),
                    role: ev.sender_role,
                    content: String(ev.text_content || (ev.message_type ? \`[\${ev.message_type}]\` : '')),
                    chatInfo: \`官方:\${item.displayName}\`
                  });
                });
              }
            })
            .catch(e => console.error(\`Failed to fetch db events for \${item.chatId}\`, e));
        });

        // 2. Fetch File Contents in Parallel & Parse
        const filePromises = selectedFiles.map(item => {
          return fetch(\`/api/dialogue-content?file_id=\${item.fileId}\`)
            .then(res => {
              if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
              return res.text();
            })
            .then(textContent => {
              const fileMsgs = parseLineChatLog(textContent, item.displayName);
              fileMsgs.forEach(m => {
                const timestampVal = new Date(\`\${m.date}T\${m.time}:00+08:00\`).getTime();
                allMessages.push({
                  timestamp: timestampVal,
                  dateStr: m.date,
                  timeStr: m.time,
                  sender: m.sender,
                  role: m.type === 'sticker' || m.type === 'image' || m.type === 'file' ? 'client' : '',
                  content: String(m.content),
                  chatInfo: \`檔案:\${item.displayName}\`
                });
              });
            })
            .catch(e => console.error(\`Failed to fetch file content for \${item.fileId}\`, e));
        });

        await Promise.all([...dbPromises, ...filePromises]);

        if (allMessages.length === 0) {
          reportOutput.innerHTML = '<div class="text-center py-4 text-warning"><i class="bi bi-exclamation-triangle-fill"></i> 勾選的資料來源無任何對話紀錄！</div>';
          return;
        }

        // 3. Sort Chronologically
        allMessages.sort((a, b) => a.timestamp - b.timestamp);

        // 4. Apply Time Range Filter Presets (Taipei Standard)
        const todayStr = getTaipeiDateString(new Date());
        const todayMs = new Date(todayStr + 'T00:00:00+08:00').getTime();
        
        let filteredMessages = allMessages;
        let rangeLabel = '全部歷史';
        
        if (selectedTimeRangePreset === 'today') {
          filteredMessages = allMessages.filter(m => m.dateStr === todayStr);
          rangeLabel = \`今天 (\${todayStr})\`;
        } else if (selectedTimeRangePreset === 'week') {
          const weekAgoMs = todayMs - 6 * 24 * 60 * 60 * 1000;
          filteredMessages = allMessages.filter(m => m.timestamp >= weekAgoMs);
          rangeLabel = '本週 (最近 7 天)';
        } else if (selectedTimeRangePreset === 'month') {
          const currentYear = new Date().getFullYear();
          const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
          const startOfMonthMs = new Date(\`\${currentYear}-\${currentMonth}-01T00:00:00+08:00\`).getTime();
          filteredMessages = allMessages.filter(m => m.timestamp >= startOfMonthMs);
          rangeLabel = \`本月 (\${currentYear}-\${currentMonth} 至今)\`;
        } else if (selectedTimeRangePreset === 'custom') {
          const days = parseInt(document.getElementById('customDaysInput').value || '3', 10);
          const customAgoMs = todayMs - (days - 1) * 24 * 60 * 60 * 1000;
          filteredMessages = allMessages.filter(m => m.timestamp >= customAgoMs);
          rangeLabel = \`自訂天數 (最近 \${days} 天內)\`;
        }

        if (filteredMessages.length === 0) {
          reportOutput.innerHTML = \`<div class="text-center py-4 text-warning"><i class="bi bi-exclamation-triangle-fill"></i> 選定時間範圍：<b>\${rangeLabel}</b> 內查無任何對話訊息！</div>\`;
          return;
        }

        // 5. Format Context Text Block with clean date markdown segments (Falo SPEC)
        let textContent = [];
        textContent.push(\`## 💬 Falo IM 手機版對話上下文 - 分析時間段：\${rangeLabel}\\n\`);
        let lastDate = "";
        
        filteredMessages.forEach(msg => {
          if (msg.dateStr !== lastDate) {
            textContent.push(\`\\n### 📅 日期: \${msg.dateStr}\`);
            lastDate = msg.dateStr;
          }
          const roleLabel = msg.role === 'host' ? '[官方助手]' : '[使用者]';
          textContent.push(\`- **[\${msg.timeStr}] \${msg.sender}\${roleLabel}**: \${msg.content}\`);
        });

        const finalContext = textContent.join('\\n');
        
        // 6. Call AI Analyze Route
        analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> AI 正在分析中...';
        reportOutput.innerHTML = \`<div class="text-center py-5 text-secondary"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>數據已過濾並編譯 (共 \${filteredMessages.length} 條)，正在呼叫 AI 模型進行分析...</div>\`;
        
        const finalPrompt = \`分析指令：\\n\${promptText}\\n\\n=== 整合對話內容 ===\\n\${finalContext}\`;
        
        const aiBody = {
          provider: provider,
          prompt: finalPrompt,
          model: model
        };

        if (provider === 'gemini') {
          const cachedKey = localStorage.getItem('faloGeminiApiKey') || '';
          if (cachedKey) {
            aiBody.gemini_key = cachedKey;
          }
        }

        const aiResponse = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(aiBody)
        });

        if (!aiResponse.ok) throw new Error('HTTP ' + aiResponse.status);
        const aiResult = await aiResponse.json();

        if (aiResult.ok && aiResult.result) {
          const htmlContent = marked.parse(aiResult.result);
          reportOutput.innerHTML = \`<div class="report-rendered" style="font-size: \${currentFontSize}px;">\${htmlContent}</div>\`;
          reportOutput.setAttribute('data-raw-report', aiResult.result);
        } else {
          throw new Error(aiResult.error || 'AI 無回應');
        }
      } catch (err) {
        console.error('Failed to run AI analysis:', err);
        reportOutput.innerHTML = \`<div class="text-center py-4 text-danger"><i class="bi bi-exclamation-triangle-fill"></i> 分析失敗: \${err.message}</div>\`;
      } finally {
        analyzeBtn.innerHTML = originalText;
        analyzeBtn.disabled = false;
      }
    }

    function copyReport() {
      const reportOutput = document.getElementById('reportOutput');
      const rawReport = reportOutput.getAttribute('data-raw-report');
      if (!rawReport) return;
      
      navigator.clipboard.writeText(rawReport).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check-lg"></i> 已複製';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 1500);
      }).catch(err => {
        alert('複製失敗: ' + err);
      });
    }

    // Toggle between Builtin and Gemini model providers in mobile view
    function toggleMobileModelProvider() {
      const provider = document.getElementById('modelProviderSelect').value;
      const builtinCol = document.getElementById('builtinModelCol');
      const geminiCol = document.getElementById('geminiModelCol');
      const geminiKeyCol = document.getElementById('geminiKeyCol');
      
      if (provider === 'builtin') {
        builtinCol.style.display = 'block';
        geminiCol.style.display = 'none';
        geminiKeyCol.style.display = 'none';
      } else {
        builtinCol.style.display = 'none';
        geminiCol.style.display = 'block';
        geminiKeyCol.style.display = 'block';
        
        // Load cached key if exists
        const cachedKey = localStorage.getItem('faloGeminiApiKey') || '';
        document.getElementById('geminiKeyInput').value = cachedKey;
      }
    }

    // Save Gemini Key to localStorage in mobile view
    function saveMobileGeminiKey() {
      const key = document.getElementById('geminiKeyInput').value.trim();
      localStorage.setItem('faloGeminiApiKey', key);
      alert(key ? 'Gemini API Key 已儲存至瀏覽器！' : 'Gemini API Key 已清除！');
    }

    // Toggle collapse/expand for database or file checklist groups
    function toggleGroupCollapse(id) {
      const el = document.getElementById(id);
      const icon = document.getElementById('icon_' + id);
      if (el.style.display === 'none') {
        el.style.display = 'block';
        icon.classList.remove('icon-rotated');
      } else {
        el.style.display = 'none';
        icon.classList.add('icon-rotated');
      }
    }

    // Adjust analysis report text font size dynamically
    function adjustFontSize(diff) {
      currentFontSize = Math.max(10, Math.min(24, currentFontSize + diff));
      const reportOutput = document.getElementById('reportOutput');
      if (reportOutput) {
        reportOutput.style.fontSize = currentFontSize + 'px';
      }
      localStorage.setItem('faloReportFontSize', currentFontSize);
    }

    // Export report to PDF via print dialog
    function exportToPdf() {
      const reportOutput = document.getElementById('reportOutput');
      const rawReport = reportOutput.getAttribute('data-raw-report');
      if (!rawReport) {
        alert('無分析報告可匯出！');
        return;
      }
      window.print();
    }

    // Unified Preview Launchers directing to standalone preview pages
    function openFilePreview(evt, fileId, displayName) {
      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }
      window.open(\`/mobile/preview?file_id=\${fileId}&displayName=\${encodeURIComponent(displayName)}\`, '_blank');
    }

    // Unified DB Chat Preview directing to standalone preview pages
    function openDbChatPreview(evt, chatId, botAlias, displayName) {
      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }
      window.open(\`/mobile/preview?chat_id=\${chatId}&bot_alias=\${botAlias}&displayName=\${encodeURIComponent(displayName)}\`, '_blank');
    }
  </script>
</body>
</html>
`;
const PRODUCT_INTRO_HTML = `<!-- 天勳 x Force Cheng 2026/7/3 -->
<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attn LINE AI 資訊管理系統 企業進階版 | 智慧轉型方案</title>
  
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  
  <!-- Google Fonts: Inter & Noto Sans TC -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">

  <style>
    :root {
      --primary-color: #0f766e;
      --primary-hover: #115e59;
      --accent-soft: #ccfbf1;
      --bg-light: #f8fafc;
      --text-dark: #0f172a;
      --text-muted: #475569;
      --border-color: #e2e8f0;
    }

    body {
      background-color: var(--bg-light);
      color: var(--text-dark);
      font-family: 'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
    }

    /* Top Bar & Navbar Styles */
    .top-header {
      background-color: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 15px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .brand-logo {
      font-weight: 900;
      font-size: 24px;
      color: var(--primary-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Breadcrumbs */
    .breadcrumb-nav {
      padding: 16px 0;
    }
    .breadcrumb-item a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    .breadcrumb-item a:hover {
      text-decoration: underline;
    }

    /* Page Titles */
    .solution-title-block {
      background-color: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
    }
    .solution-title {
      font-weight: 900;
      font-size: 28px;
      color: var(--text-dark);
      margin-bottom: 12px;
    }
    .stitle-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    .badge-category {
      background-color: var(--primary-color);
      color: white;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
    }
    .badge-industry {
      background-color: #e2e8f0;
      color: var(--text-muted);
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
    }

    /* Main Grid Layout */
    .price-side-card {
      background-color: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 90px;
    }
    .price-label {
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .price-value {
      font-size: 32px;
      font-weight: 900;
      color: var(--primary-color);
      margin-bottom: 8px;
    }
    .price-term {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }
    .btn-contact {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 20px;
      font-weight: 700;
      border-radius: 8px;
      width: 100%;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background-color 0.2s ease;
    }
    .btn-contact:hover {
      background-color: var(--primary-hover);
      color: white;
    }

    /* Content Box */
    .content-box {
      background-color: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary-color);
      border-left: 4px solid var(--primary-color);
      padding-left: 10px;
      margin-top: 30px;
      margin-bottom: 16px;
    }
    .section-title:first-of-type {
      margin-top: 0;
    }

    /* Diagram Styling */
    .diagram-container {
      background-color: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 10px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .diagram-img {
      width: 100%;
      height: auto;
      border-radius: 6px;
      display: block;
    }

    /* Success Case Styles */
    .case-card {
      background-color: var(--bg-light);
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid var(--primary-color);
      margin-top: 12px;
    }

    /* Footer styling */
    footer {
      background-color: #1e293b;
      color: #94a3b8;
      padding: 40px 0 20px;
      font-size: 14px;
      border-top: 1px solid #334155;
      margin-top: 60px;
    }
    footer a {
      color: #cbd5e1;
      text-decoration: none;
    }
    footer a:hover {
      color: #ffffff;
      text-decoration: underline;
    }
    .footer-note {
      border-top: 1px solid #334155;
      padding-top: 20px;
      margin-top: 30px;
      text-align: center;
      font-size: 12px;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="top-header">
    <div class="container d-flex justify-content-between align-items-center">
      <a class="brand-logo" href="#">
        <i class="bi bi-robot"></i> 商業服務業數位轉型專區
      </a>
      <div class="d-none d-md-flex gap-3">
        <span class="text-secondary fw-semibold">首頁</span>
        <span class="text-secondary fw-semibold">計畫說明</span>
        <span class="text-secondary fw-semibold">智慧轉型方案</span>
        <span class="text-secondary fw-semibold">轉型全攻略</span>
      </div>
    </div>
  </header>

  <div class="container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">首頁</a></li>
        <li class="breadcrumb-item"><a href="#">智慧轉型方案</a></li>
        <li class="breadcrumb-item active" aria-current="page" id="crumbTitle">Attn LINE AI 資訊管理系統 企業標準版</li>
      </ol>
    </nav>

    <!-- Title Block -->
    <div class="solution-title-block">
      <h2 class="solution-title" id="pageTitle">Attn LINE AI 資訊管理系統 企業標準版</h2>
      <div class="stitle-group">
        <span class="badge-category">AI對話分析與專案智慧</span>
        <span class="badge-industry">G 批發及零售業</span>
        <span class="badge-industry">I 住宿及餐飲業</span>
        <span class="badge-industry">M 專業、科學及技術服務業</span>
        <span class="badge-industry">S 其他服務業</span>
      </div>
    </div>

    <!-- Main Grid Content -->
    <div class="row g-4">
      
      <!-- Left sidebar card -->
      <div class="col-lg-3 col-md-12 order-lg-1 order-2">
        <div class="price-side-card">
          <div class="price-label">115年方案價格</div>
          <div class="price-value" id="sidePriceValue">$100,000</div>
          <div class="price-term" id="sidePriceTerm">(方案期程為 6 個月)</div>
          
          <a class="btn-contact" id="contactBtn" href="mailto:service@tianxun.com.tw?subject=【智慧轉型】洽詢AI解決方案(Attn LINE AI資訊管理系統)導入事宜">
            <i class="bi bi-envelope-fill"></i> 聯絡服務提供者
          </a>
        </div>
      </div>

      <!-- Right main columns -->
      <div class="col-lg-9 col-md-12 order-lg-2 order-1">
        <div class="content-box">
          
          <!-- System Model Image -->
          <div class="section-title">AI 元件模型架構</div>
          <div class="diagram-container">
            <img class="diagram-img" src="ChatGPT_Image.png" alt="LINE AI 資訊管理 元件模型 v1.0 架構圖">
          </div>

          <!-- Provider details -->
          <div class="section-title">服務提供者</div>
          <p class="fw-semibold">天勳資訊有限公司</p>

          <!-- Solution Intro -->
          <div class="section-title">方案介紹</div>
          <p class="fw-bold text-success mb-2" style="font-size: 16px;">💡 對知識工程＋繁體中文最友善強大的 AI 服務方案</p>
          <p>
            Attn LINE AI 資訊管理系統是一套專為企業打造的智能化對話歸檔與戰情分析方案。本系統無縫整合 LINE 官方帳號 (LINE Bot)、地端同步事件歸檔器與生成式 AI (Gemini) 推理大模型，協助業者將雜亂的客戶諮詢、群組討論及檔案轉化為具備商業洞察的專案智慧。透過彈性時間區間、Prompt 小幫手與知識庫 (KM) 交叉比對，企業可一鍵產出日誌摘要、待辦事項、趨勢分析與風險提醒，大幅降低人工文書整理負擔。<strong>本系統全系列提供「雲端託管 (SaaS)」與「地端專屬部署 (On-Premise)」雙重部署方案，靈活契合企業不同的系統環境與資安規章；而地端部署的獨特優勢，在於其能更便利地與本地 AI Agent（如 NotebookLM）進行無感安全對接與本地化協同分析。</strong>
          </p>

          <!-- Solution Specs -->
          <div class="section-title">方案規格說明</div>
          <p id="specIntro"><strong>本服務針對企業轉型提供專業配置，方案規格詳情如下：</strong></p>

          <!-- Standard Solution Container -->
          <div id="standardSpecsSection">
            <h5 id="standard" class="fw-bold mt-3" style="color: var(--primary-color);">💎 企業標準版 ($100,000 / 6個月) —— 「專案與客服團隊的 AI 智慧助理」</h5>
            <ul>
              <li><strong>預載 AI 運作額度 (20,000 點)</strong>：預設提供 **20,000 點 AI 運算額度**。採「輸入 + 輸出雙軌計量扣點」，折合可分析高達 **4,000 萬字** 的對話輸入，或產生約 **1,000 萬字** 的生成式 AI 戰情報告（每次標準分析扣除 10~25 點，使用天勳預設推理核心）。</li>
              <li><strong>單一帳號與多終端協作</strong>：可彈性選擇「雲端 SaaS 託管版」或「地端快速部署版」。<strong>本版本支援對接「<span style="color: #b45309; font-weight: bold;">單一</span> LINE 官方帳號」，但該帳號可供「多個瀏覽器視窗與多台管理裝置」同時登入登出使用，並同步歸檔與分析該帳號下多個聊天視窗與對話紀錄</strong>，最快 5 分鐘內即可完成設定。</li>
              <li><strong>資料永不過期與多模態備份</strong>：即時且自動地將 LINE 群組中的重要對話、客戶回傳的照片與檔案進行安全儲存，徹底解決 LINE 檔案因逾期而無法下載的痛點。</li>
              <li><strong>智慧 Prompt 範本與戰情分析</strong>：免寫 Prompt，提供直覺式操作介面，內建「今日摘要、待辦整理」等一鍵產出範本，秒級生成結構化待辦任務與決策日誌。</li>
              <li><strong>額度續用彈性</strong>：額度扣減完畢後，可隨時向天勳加購超值點數包續用，服務不中斷。</li>
            </ul>

            <!-- Video Demo -->
            <div class="video-container my-3 text-center">
              <video class="w-100 rounded shadow" controls loop muted autoplay playsinline style="max-width: 100%; border: 2px solid var(--border-color); max-height: 400px; background: #000;">
                <source src="standard_demo.mp4" type="video/mp4">
                您的瀏覽器不支援 HTML5 影片播放。
              </video>
              <div class="small text-muted mt-2">📺 企業標準版（10萬版）功能操作全自動展示影片</div>
            </div>

            <!-- Security Commitment Callout -->
            <div class="card p-3 my-4" style="border-left: 5px solid #dc3545; background-color: #fdf2f2; border-radius: 8px;">
              <h5 class="fw-bold text-danger mb-2"><i class="bi bi-shield-lock-fill"></i> 🛡️ 企業級資安防護與資料隱私承諾</h5>
              <p class="mb-2" style="font-size: 14px; color: var(--ink);">
                本系統之 AI 推理核心<strong>全面採用雲端大廠 Google (Gemini) 官方企業級管道，或地端 100% 離線之 Ollama 平台並搭配業界推薦開源模型（如 Meta Llama 3、Google Gemma 等）</strong>。資料絕不用於任何大模型的公開二次訓練，確保企業專案決策、內部機密與客戶隱私絕對不落地、不外洩。
              </p>
              <p class="mb-0 text-danger" style="font-size: 13px; font-weight: bold;">
                ⚠️ 警示與提醒：坊間部分服務廠商為降低建置成本，可能採用未經安全驗證之便宜 AI 模型或運作平台，甚至使用不知名的第三方雲端中轉服務，此舉極易導致企業之核心商業機密、合約數據與客戶對話隱私，在無意間被收集並挪作模型訓練，造成不可挽回的資安漏洞與商譽損失。
              </p>
            </div>
          </div>

          <!-- Advanced Solution Container -->
          <div id="advancedSpecsSection">
            <h5 id="advanced" class="fw-bold mt-3" style="color: #0d9488;">💎 企業進階版 ($200,000 / 6個月) —— 🌟 推薦自控與高資安首選</h5>
          <ul>
            <li><strong>AI 運作點數 (50,000 點)</strong>：方案預設提供 **50,000 點 AI 運作點數** (強大高階配置)。折合可分析高達 **1 億字** 的對話輸入，或產生約 **2,500 萬字** 的生成式 AI 戰情報告（每次標準分析扣除 10~25 點，使用天勳進階推理核心）。</li>
            <li><strong>多個帳號與規模化整合</strong>：可彈性選擇「雲端專屬託管版」或「地端獨立安全部署版（採用二進位機器碼編譯與混淆技術，防範代碼與 API 密鑰逆向洩漏，確保核心智慧財產權）」。<strong>本版本支援同時對接「<span style="color: #0284c7; font-weight: bold;">多個</span> LINE 官方帳號」，並能流暢整合跨帳號的多個聊天視窗與海量對話紀錄，進行統一的 AI 戰情分析</strong>，最快 5 分鐘內即可完成設定。</li>
            <li><strong>資料永不過期與多模態備份</strong>：即時且自動地將 LINE 群組中的重要對話、客戶回傳的照片與檔案進行安全儲存，徹底解決 LINE 檔案因逾期而無法下載的痛點。</li>
            <li><strong>智慧 Prompt 範本與戰情分析</strong>：免寫 Prompt，提供直覺式操作介面，內建「今日摘要、待辦整理」等一鍵產出範本，秒級生成結構化待辦任務與決策日誌。</li>
            <li><strong>支援導入個人與企業 KM 知識規章</strong>：支援交叉比對企業內部的 Knowledge Base (KM)，大幅提昇答詢與分析的精準度。</li>
            <li><strong>「三大進階解鎖」自主控管機制</strong>：
              <ol>
                <li><strong>自備金鑰 (Own API Key) 續用</strong>：預設點數扣減完畢後，客戶可無縫於前台面板填入自己申請之 Gemini API Key 進行無限次分析，系統不中斷，免加購點數。</li>
                <li><strong>地端開源大模型 (Ollama) 對接</strong>：支援地端離線部署之開源大模型（如 Meta Llama 3、Google Gemma 等），資料 100% 留在企業內網，符合最高規格資安。</li>
                <li><strong>Agent 協作與專用 MD / Prompt 導出</strong>：解鎖「匯出 MD 給 Agent 分析」功能，一鍵打包去敏感化的結構化對話與 KM 知識日誌 (.md)，可完美導入並對接 **NotebookLM** 及 **主流通用 AI Agent (如 ChatGPT, Gemini, Claude, Perplexity 等)** 進行深度二次分析、智慧問答與資料探勘（扣減 0 點）。</li>
              </ol>
            </li>
          </ul>

          <!-- Video Demo -->
          <div class="video-container my-3 text-center">
            <video class="w-100 rounded shadow" controls loop muted autoplay playsinline style="max-width: 100%; border: 2px solid var(--border-color); max-height: 400px; background: #000;">
              <source src="standard_demo.mp4" type="video/mp4">
              您的瀏覽器不支援 HTML5 影片播放。
            </video>
            <div class="small text-muted mt-2">📺 企業進階版（20萬版）功能操作全自動展示影片</div>
          </div>
          
          <!-- Mobile Features Highlights Callout (v3.04) -->
          <div class="card p-3 my-4" style="border-left: 5px solid #0284c7; background-color: #f0f9ff; border-radius: 8px;">
            <h5 class="fw-bold" style="color: #0369a1;"><i class="bi bi-phone-fill"></i> 📱 Falo IM v3.04 行動端革命性亮點升級</h5>
            <p class="mb-2" style="font-size: 14px; color: var(--text-dark);">
              專為企業高階決策者與老闆設計的手機專屬操作體驗，全面優化觸控、閱讀與稽核效率：
            </p>
            <ul style="font-size: 13px; padding-left: 20px;" class="mb-0">
              <li class="mb-2"><strong>💬 模擬 LINE 對話氣泡預覽 (Standalone WebView Preview)</strong>：點選對話或備份即可在 LINE 內開獨立的浮動預覽視窗。AI 自動解析並渲染為擬真 LINE 泡泡聊天室（包含彩色頭像、時間、置中日期線），使審查對話像讀日常聊天般親切。</li>
              <li class="mb-2"><strong>🔄 逆向無限滾動與定位錨定</strong>：預覽自動跳至最底端顯示最新對話，往上滑動時無縫延遲載入歷史資料，且視角保持穩定無跳動。</li>
              <li class="mb-2"><strong>📁 預設折疊清爽面板</strong>：官方即時對話與備份檔案群組預設折疊，為手機小螢幕留出最大空間。</li>
              <li class="mb-2"><strong>🔍 報告區字體自主縮放</strong>：首創報告區獨立 \`A-\` / \`A+\` 縮放按鈕，僅微調 AI 報告字級並自動儲存偏好，不影響其他版面。</li>
              <li class="mb-0"><strong>📄 乾淨高保真 PDF 匯出</strong>：支援一鍵列印 PDF，系統自動剔除控制台選項，僅保留乾淨且排版精美的 Markdown 分析報告本體。</li>
            </ul>
          </div>
          </div>

          <!-- Success Scenarios -->
          <div class="section-title">情境導入與應用案例</div>
          
          <!-- Scenario 1 -->
          <div class="case-card mb-3">
            <h5 class="fw-bold" style="color: var(--primary-color);"><i class="bi bi-briefcase-fill"></i> 情境一：高階管理者 — 每日下班前一鍵掌握各部門重要事情</h5>
            <p class="mb-2 text-secondary" style="font-size: 13px;"><em>痛點：管理者時間有限，難以追蹤多個部門群組的複雜對話。</em></p>
            <p class="mb-2"><strong>應用情境</strong>：總經理或專案總監需要隨時掌握「研發、業務、客服」等跨部門今日最新動態與突發事件（如連線超時、故障排除、金流對接故障）。</p>
            <p class="mb-0"><strong>解決成效</strong>：管理者只需勾選當天的對話群組與各部門工作規範，AI 將於秒級內彙整當日「關鍵決策、問題排除與跨部門協調成果」，並特別標示「潛在風險（如異地備份依賴單一人力）」，讓決策者不用爬文即可精準掌控全盤局勢。</p>
          </div>

          <!-- Scenario 2 -->
          <div class="case-card">
            <h5 class="fw-bold" style="color: #0d9488;"><i class="bi bi-person-check-fill"></i> 情境二：專案執行成員 — 快速整理並聚焦自己該做的作業與待辦</h5>
            <p class="mb-2 text-secondary" style="font-size: 13px;"><em>痛點：群組討論訊息洗版，成員容易遺漏屬於自己的指派工作。</em></p>
            <p class="mb-2"><strong>應用情境</strong>：專案成員（如工程師 Jerry、窗口窗口）需要明確知道今天討論中「誰被指派了什麼工作、哪一天要交付、對照哪些 SOP 規章」。</p>
            <p class="mb-0"><strong>解決成效</strong>：專案成員點選 Prompt 範本中的「待辦整理」，系統即自動從海量對話中萃取出結構化的表格，列明「待辦事項、負責人、預計完成日與關聯文件」，並支援一鍵複製 Markdown 或匯出為乾淨的 PDF，直接作為個人今日的工作指引與追蹤依據。</p>
          </div>

          <!-- Workflow Integration Addon Card -->
          <div class="card p-3 my-4" style="border-left: 5px solid #0d9488; background-color: #f2fbf9; border-radius: 8px;">
            <h5 class="fw-bold mb-2" style="color: #0f766e;"><i class="bi bi-patch-plus-fill"></i> ➕ 系統工作流整合加值包 (選購, +$100,000 / 6個月) <a href="workflow-addon.html" style="font-size: 13px; font-weight: bold; text-decoration: underline; color: #0f766e; margin-left: 8px;">[詳情介紹]</a></h5>
            <p class="mb-2" style="font-size: 14px; color: var(--ink);">
              專為追求極致效率的專案團隊設計。本加值包可與本系統之方案完美結合（例如：企業標準版 10萬 + 加值包 10萬 = 完整工作流自動化方案），<strong>加購即可加碼贈送額外 50,000 點 AI 運算額度 (合購後標準版達 70,000 點額度，進階版達 100,000 點額度！)</strong>，解鎖以下三大內建自動化模組（均可在系統後台一鍵開啟或關閉）：
            </p>
            <ul style="font-size: 13px; padding-left: 20px;" class="mb-0">
              <li class="mb-2"><strong>✈️ Telegram 訊息橋接與自動推送開關</strong>：開啟後，<strong>系統會同步將 LINE 官方帳號的對話與事件訊息，即時傳送並橋接至指定的 Telegram 機器人群組。相較於 LINE，Telegram 具備更強大且靈活的整合與通知功能：支援訊息永久雲端保存、大檔案傳輸無過期失效痛點、對話完整歷史導出，且機器人傳輸幾乎無頻寬與推播頻率上限，非常適合專案團隊作為即時監控與協同戰情中心。</strong></li>
              <li class="mb-2"><strong>⚡ AI 群組即時分析指令開關</strong>：開啟後，團隊成員免登入網頁，直接在 LINE 或 Telegram 群組內輸入指令（如 <code>/summary</code> 摘要、<code>/todo</code> 待辦事項），AI 機器人便會即時在群組內回覆當日的專案報告與任務列表。</li>
              <li class="mb-0"><strong>📖 智慧 KM 知識庫與 AI 即時回覆建議開關</strong>：開啟後，當群組成員在對話中提問時，<strong>系統會自動比對並檢索後台勾選的 KM 企業知識庫（如產品規格、SOP 流程），並由 AI 即時參與分析、提供精準的回覆建議與處置方向。</strong></li>
            </ul>
          </div>

          <!-- Divider -->
          <hr class="my-4" style="color: var(--border-color);">

          <!-- Company info -->
          <div class="service-content-box-data text-secondary" style="font-size: 13px;">
            <p class="mb-1">公司名稱：天勳資訊有限公司</p>
            <p class="mb-1">統一編號：12781944</p>
            <p class="mb-1">聯絡電話：06-2980272</p>
            <p class="mb-1">聯絡地址：臺南市官田區二鎮里工業路21號1樓</p>
            <p class="mb-1">電子郵件：<a href="mailto:service@tianxun.com.tw" style="color: var(--primary-color);">service@tianxun.com.tw</a></p>
            <p class="mb-0">公司網站：<a href="http://www.tianxun.com.tw" target="_blank" style="color: var(--primary-color);">連結</a></p>
          </div>

        </div>
      </div>

    </div>
  </div>

  <!-- Footer -->
  <footer>
    <div class="container text-center">
      <div class="row g-3 justify-content-center text-md-start">
        <div class="col-md-4">
          <p class="fw-bold text-white mb-2">主辦單位</p>
          <p class="small mb-1">中華民國資訊軟體服務商業同業公會 (CISA)</p>
          <p class="small">經濟部商業發展署</p>
        </div>
        <div class="col-md-4">
          <p class="fw-bold text-white mb-2">聯絡諮詢</p>
          <p class="small mb-1">週一至週五 9:00 - 17:00</p>
          <p class="small">電話: (02)7702-2252</p>
        </div>
      </div>
      <div class="footer-note">
        資安聲明：本網站全程無使用任何中國大陸產品或元件，建議以 Chrome 或 Edge 瀏覽器開啟。<br>
        &copy; 2026 經濟部商業發展署 版權所有。
      </div>
    </div>
  </footer>

  <!-- Bootstrap 5 JS Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  <script>
    function updateTierContent() {
      const hash = window.location.hash;
      const isAdvanced = (hash === '#advanced');
      
      const crumbTitle = document.getElementById('crumbTitle');
      const pageTitle = document.getElementById('pageTitle');
      const sidePriceValue = document.getElementById('sidePriceValue');
      const sidePriceTerm = document.getElementById('sidePriceTerm');
      const contactBtn = document.getElementById('contactBtn');
      
      const standardSection = document.getElementById('standardSpecsSection');
      const advancedSection = document.getElementById('advancedSpecsSection');
      const specIntro = document.getElementById('specIntro');
      
      if (isAdvanced) {
        if (crumbTitle) crumbTitle.innerText = "Attn LINE AI 資訊管理系統 企業進階版";
        if (pageTitle) pageTitle.innerText = "Attn LINE AI 資訊管理系統 企業進階版";
        if (sidePriceValue) sidePriceValue.innerText = "$200,000";
        if (sidePriceTerm) sidePriceTerm.innerText = "(方案期程為 6 個月)";
        if (contactBtn) contactBtn.href = "mailto:service@tianxun.com.tw?subject=【智慧轉型】洽詢AI解決方案(Attn LINE AI資訊管理系統 企業進階版)導入事宜";
        
        if (standardSection) standardSection.style.display = 'none';
        if (advancedSection) advancedSection.style.display = 'block';
        if (specIntro) specIntro.style.display = 'none'; // Hide general intro line for advanced
      } else {
        // Default to Standard
        if (crumbTitle) crumbTitle.innerText = "Attn LINE AI 資訊管理系統 企業標準版";
        if (pageTitle) pageTitle.innerText = "Attn LINE AI 資訊管理系統 企業標準版";
        if (sidePriceValue) sidePriceValue.innerText = "$100,000";
        if (sidePriceTerm) sidePriceTerm.innerText = "(方案期程為 6 個月)";
        if (contactBtn) contactBtn.href = "mailto:service@tianxun.com.tw?subject=【智慧轉型】洽詢AI解決方案(Attn LINE AI資訊管理系統 企業標準版)導入事宜";
        
        if (standardSection) standardSection.style.display = 'block';
        if (advancedSection) advancedSection.style.display = 'none';
        if (specIntro) specIntro.style.display = 'block';
      }
    }
    
    // Listen for hash changes and page load
    window.addEventListener('hashchange', updateTierContent);
    window.addEventListener('DOMContentLoaded', updateTierContent);
  </script>

  <!-- 天勳 x Force Cheng 2026/7/3 -->
  <div class="no-print" style="position: fixed; bottom: 8px; right: 8px; font-size: 10px; color: rgba(15, 23, 42, 0.04); pointer-events: none; z-index: 9999; font-weight: bold; font-family: monospace;">天勳 x Force Cheng 2026/7/3</div>
</body>
</html>
`;
const PRODUCT_ANALYSIS_HTML = `<!-- Claude Fable 5 (Anthropic) 第三方分析報告 2026/7/4 -->
<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Attn LINE AI 三產品文案分析報告 | 第三方 AI 視角</title>
<style>
  :root {
    --teal: #0f766e;
    --teal-soft: #ccfbf1;
    --ink: #0f172a;
    --muted: #64748b;
    --border: #e2e8f0;
    --bg: #f8fafc;
    --good: #059669;
    --star: #b45309;
    --warn: #dc2626;
    --warn-bg: #fef2f2;
    --good-bg: #f0fdf4;
    --star-bg: #fffbeb;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.75;
    font-size: 15px;
  }
  .container { max-width: 960px; margin: 0 auto; padding: 0 20px; }

  /* Header */
  .report-header {
    background: linear-gradient(135deg, #134e4a 0%, #0f766e 60%, #0d9488 100%);
    color: #fff;
    padding: 48px 0 40px;
  }
  .report-header .tag {
    display: inline-block;
    background: rgba(255,255,255,.15);
    border: 1px solid rgba(255,255,255,.3);
    border-radius: 50px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .report-header h1 { margin: 0 0 10px; font-size: 30px; font-weight: 900; letter-spacing: .5px; }
  .report-header .meta { font-size: 13px; opacity: .85; }
  .report-header .meta span { margin-right: 18px; }
  .report-header a { color: #fff; text-decoration: underline; text-underline-offset: 3px; }
  .disclaimer {
    background: rgba(255,255,255,.1);
    border-left: 3px solid rgba(255,255,255,.5);
    padding: 10px 14px;
    font-size: 13px;
    margin-top: 20px;
    border-radius: 0 6px 6px 0;
  }

  /* Sections */
  section { padding: 36px 0 8px; }
  h2 {
    font-size: 22px;
    font-weight: 900;
    color: var(--teal);
    border-left: 5px solid var(--teal);
    padding-left: 12px;
    margin: 0 0 20px;
  }
  h3 { font-size: 17px; font-weight: 700; margin: 24px 0 10px; }
  p { margin: 0 0 14px; }
  .card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 26px 28px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(15,23,42,.04);
  }

  /* Verdict cards */
  .verdict-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 8px; }
  @media (max-width: 720px) { .verdict-grid { grid-template-columns: 1fr; } }
  .verdict {
    background: #fff;
    border: 1px solid var(--border);
    border-top: 4px solid var(--teal);
    border-radius: 10px;
    padding: 18px 20px;
  }
  .verdict .v-name { font-weight: 900; font-size: 15px; margin-bottom: 6px; }
  .verdict .v-line { font-size: 13.5px; color: var(--muted); }

  /* Score table */
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { padding: 10px 12px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
  th { background: var(--bg); font-weight: 700; white-space: nowrap; }
  td.score { font-family: monospace; letter-spacing: 2px; color: var(--teal); white-space: nowrap; }
  .score-note { font-size: 12.5px; color: var(--muted); margin-top: 10px; }

  /* Product analysis blocks */
  .product-title {
    display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .product-title .p-name { font-size: 19px; font-weight: 900; }
  .product-title .p-price { font-size: 13px; color: var(--muted); font-weight: 600; }
  .positioning {
    font-size: 14px; color: var(--teal); font-weight: 700;
    background: var(--teal-soft); border-radius: 6px;
    padding: 8px 14px; display: inline-block; margin-bottom: 18px;
  }
  .tri { display: grid; grid-template-columns: 1fr; gap: 14px; }
  .tri-block { border-radius: 8px; padding: 16px 18px; }
  .tri-block.good { background: var(--good-bg); border-left: 4px solid var(--good); }
  .tri-block.star { background: var(--star-bg); border-left: 4px solid var(--star); }
  .tri-block.warn { background: var(--warn-bg); border-left: 4px solid var(--warn); }
  .tri-block h4 { margin: 0 0 8px; font-size: 14.5px; font-weight: 900; }
  .tri-block.good h4 { color: var(--good); }
  .tri-block.star h4 { color: var(--star); }
  .tri-block.warn h4 { color: var(--warn); }
  .tri-block ul { margin: 0; padding-left: 20px; }
  .tri-block li { margin-bottom: 8px; font-size: 14px; }
  .tri-block li:last-child { margin-bottom: 0; }
  .tri-block li strong { font-weight: 700; }

  /* Priority badges */
  .prio {
    display: inline-block; font-size: 11px; font-weight: 900;
    border-radius: 4px; padding: 1px 7px; margin-right: 6px;
    vertical-align: 1px; white-space: nowrap;
  }
  .p0 { background: #dc2626; color: #fff; }
  .p1 { background: #f59e0b; color: #fff; }
  .p2 { background: #94a3b8; color: #fff; }

  /* Footer */
  footer {
    margin-top: 40px;
    background: #1e293b; color: #94a3b8;
    padding: 28px 0; font-size: 12.5px; text-align: center;
  }
  footer a { color: #cbd5e1; text-decoration: underline; text-underline-offset: 3px; }
  footer a:hover { color: #ffffff; }
  @media print {
    .report-header { background: #0f766e !important; -webkit-print-color-adjust: exact; }
    .card { box-shadow: none; break-inside: avoid; }
    .tri-block { break-inside: avoid; }
  }
</style>
</head>
<body>

<header class="report-header">
  <div class="container">
    <div class="tag">🤖 第三方 AI 視角 · 產品文案評析</div>
    <h1>Attn LINE AI 資訊管理系統<br>三產品文案分析報告</h1>
    <div class="meta">
      <span>分析者：<strong>Claude Fable 5</strong> — Anthropic 新一代 Mythos 級 AI 模型</span>
      <span>基準日：2026-07-04</span>
      <span>分析對象：<a href="https://falo-taiwan.github.io/line_bot/" target="_blank">falo-taiwan.github.io/line_bot</a> 全站四頁（主頁／提案文案／加值包／互動 POC）</span>
    </div>
    <div class="disclaimer">
      本報告為 AI 依據公開頁面文案所做的獨立分析，立場中性：優點據實肯定、不足直接指出。目的是供 <strong>Falo / Force 的團隊夥伴</strong>在正式送件前對齊認知，非行銷文件。
    </div>
  </div>
</header>

<div class="container">

  <!-- ===== AI 工作流揭露 ===== -->
  <section>
    <h2>一、產出方式揭露：全 AI 工作流</h2>
    <div class="card">
      <p>
        本提案（含程式碼與全部文案）與本報告，均由 AI 深度參與產出，且<strong>開發與檢核由不同陣營的 AI 分別執行</strong>：
      </p>
      <table>
        <thead>
          <tr><th style="width:140px;">角色</th><th>執行者</th><th>範圍</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>開發</strong></td>
            <td>ChatGPT Codex（OpenAI）＋ Google Antigravity（Google）</td>
            <td>提案網站全部程式碼與文案的產出與迭代</td>
          </tr>
          <tr>
            <td><strong>檢核</strong></td>
            <td>Claude Fable 5（Anthropic）</td>
            <td>本分析報告——基於公開頁面獨立評審，未接觸開發過程與內部資料</td>
          </tr>
          <tr>
            <td><strong>決策與最終判斷</strong></td>
            <td>Force（人類）</td>
            <td>方向設定、需求定義、採納與否的最終裁量</td>
          </tr>
        </tbody>
      </table>
      <p style="margin: 14px 0 0;">
        這個分工不是巧合，而是刻意設計：<strong>評審 AI 與開發 AI 分屬三家互不隸屬的公司（Anthropic ／ OpenAI ／ Google），彼此沒有利益重疊</strong>，因此本報告的批評不需要留情面，肯定也不涉及自我背書。分析全程僅依據任何人都能開啟的公開頁面進行——你可以把同樣四個網址交給任何一個 AI 或人類專家，重現並檢驗這份分析的結論。這也是 Falo / Force 團隊日常工作流的實際樣貌：AI 負責產出與互相稽核，人類保留判斷權。
      </p>
    </div>
  </section>

  <!-- ===== 總評 ===== -->
  <section>
    <h2>二、總評</h2>
    <div class="card">
      <p>
        這是一套<strong>完成度明顯高於一般補助案送件水準</strong>的提案：三個產品的價格階梯（10萬 → 20萬 → +10萬）形成清楚的升級路徑，版本差異化走「控制權與資安治理」而非「功能數量」，這是成熟的 SaaS 定價思路。互動 POC 具備自動導覽播放，等於把「送審展示」這件事產品化了——這在同類提案中極少見，是最強的一張牌。
      </p>
      <p style="margin-bottom:0;">
        主要的改善空間不在架構、而在<strong>細節一致性與信任證據</strong>：品牌名稱尚未統一、案例是情境推演而非實績、少數文案存在會被嚴格審查者挑戰的絕對化表述。這些都屬於送件前可在短時間內修完的項目。
      </p>
    </div>
    <div class="verdict-grid">
      <div class="verdict">
        <div class="v-name">💎 企業標準版</div>
        <div class="v-line">一句話評語：<strong>痛點切得準、門檻夠低</strong>的入門款，「LINE 檔案過期救星」的敘事有效，但點數制對非技術買家仍偏抽象。</div>
      </div>
      <div class="verdict">
        <div class="v-name">🚀 企業進階版</div>
        <div class="v-line">一句話評語：<strong>差異化敘事最強</strong>的主力產品，「三大解鎖」賣的是控制權，方向正確；但價格翻倍的價值論述需要更明確的錨點。</div>
      </div>
      <div class="verdict">
        <div class="v-name">➕ 工作流整合加值包</div>
        <div class="v-line">一句話評語：<strong>誘因設計最聰明</strong>（贈點超過標準版本體），但 Telegram 在台灣市場需要教育成本，且有一句文案自相矛盾。</div>
      </div>
    </div>
  </section>

  <!-- ===== 評分表 ===== -->
  <section>
    <h2>三、五維快速評分</h2>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>評估維度</th>
            <th>💎 標準版</th>
            <th>🚀 進階版</th>
            <th>➕ 加值包</th>
            <th>說明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>文案完成度</strong></td>
            <td class="score">●●●●○</td>
            <td class="score">●●●●○</td>
            <td class="score">●●●●●</td>
            <td>加值包頁最完整（含後台開關展示）；前兩者受品牌名不一致拖累。</td>
          </tr>
          <tr>
            <td><strong>差異化強度</strong></td>
            <td class="score">●●●○○</td>
            <td class="score">●●●●●</td>
            <td class="score">●●●●○</td>
            <td>進階版「三大解鎖」與「Agent 匯出接 NotebookLM」在台灣市場罕見。</td>
          </tr>
          <tr>
            <td><strong>信任證據力</strong></td>
            <td class="score">●●○○○</td>
            <td class="score">●●●○○</td>
            <td class="score">●●○○○</td>
            <td>共同弱項：案例為情境模擬、無實績數據、進階版影片仍為標準版檔案。</td>
          </tr>
          <tr>
            <td><strong>資訊透明度</strong></td>
            <td class="score">●●●○○</td>
            <td class="score">●●●○○</td>
            <td class="score">●●●○○</td>
            <td>點數換算有具體字數（好），但地端硬體需求、續約機制、資料退場未揭露。</td>
          </tr>
          <tr>
            <td><strong>轉換設計</strong></td>
            <td class="score">●●●●○</td>
            <td class="score">●●●●○</td>
            <td class="score">●●●●●</td>
            <td>雙 CTA（提案文案＋互動 POC）配置佳；加值包的贈點誘因是全站最強轉換鉤子。</td>
          </tr>
        </tbody>
      </table>
      <div class="score-note">※ 評分為分析者基於文案本身的相對評價（滿分 5），用於凸顯相對強弱，非絕對優劣。</div>
    </div>
  </section>

  <!-- ===== 標準版 ===== -->
  <section>
    <h2>四、逐產品分析</h2>

    <div class="card">
      <div class="product-title">
        <span class="p-name">💎 企業標準版</span>
        <span class="p-price">$100,000 / 6個月 · 20,000 點 · 單一官方帳號</span>
      </div>
      <div class="positioning">定位：專案與客服團隊的開箱即用 AI 助理 —— 補助案的「甜蜜點」產品</div>
      <div class="tri">
        <div class="tri-block good">
          <h4>✅ 優點</h4>
          <ul>
            <li><strong>痛點選得精準</strong>：「LINE 檔案逾期無法下載」是台灣中小企業每天都在痛的真實問題，「資料永不過期與多模態備份」直接對症，一句話就能讓買方點頭。</li>
            <li><strong>導入門檻敘事到位</strong>：「最快 5 分鐘完成設定」「免寫 Prompt、一鍵範本」都在降低非技術決策者的心理門檻。</li>
            <li><strong>定價貼合補助級距</strong>：10 萬元恰好落在數位轉型補助方案常見的申請區間，買方自付額壓力小，天然適合作為進門磚。</li>
            <li><strong>額度講得具體</strong>：「20,000 點 ≈ 4,000 萬字輸入」給了可感知的量級，比只寫點數負責任。</li>
          </ul>
        </div>
        <div class="tri-block star">
          <h4>⭐ 特點（市場區隔）</h4>
          <ul>
            <li><strong>單一帳號、多終端協作</strong>：一個官方帳號可多視窗、多裝置同時登入使用，對小團隊夠用且好理解。</li>
            <li><strong>對話＋圖片即時備份</strong>：多模態歸檔在同價位帶的 LINE 工具中並不常見。</li>
          </ul>
        </div>
        <div class="tri-block warn">
          <h4>⚠️ 不足與風險</h4>
          <ul>
            <li><strong>「強綁天勳預設 Key」的用詞觀感</strong>：對照表直接寫「強綁」，這是內部視角的詞；買方讀到的是「被鎖定」。建議改為「內建天勳託管金鑰，免申請免設定」——同一件事，敘事從限制變成服務。</li>
            <li><strong>點數耗盡後只有單一出路</strong>（加購點數包），可能引發「額度焦慮」。可考慮在文案中給出典型用量參考（例如「一般 20 人團隊約可使用 N 個月」）來消解。</li>
            <li><strong>點數制對非技術買家仍抽象</strong>：「每次分析扣 10~25 點」需要買方自行心算，建議補一張「常見操作 × 扣點 × 每月估算」的簡表。</li>
            <li><strong>缺少歷史訊息限制的預期管理</strong>：機器人只能收錄加入之後的訊息，過往紀錄需手動匯出——這個限制未在文案揭露，交付時容易變成客訴點，建議以 FAQ 形式提前說明。</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== 進階版 ===== -->
    <div class="card">
      <div class="product-title">
        <span class="p-name">🚀 企業進階版</span>
        <span class="p-price">$200,000 / 6個月 · 50,000 點 · 多官方帳號</span>
      </div>
      <div class="positioning">定位：自控與高資安需求首選 —— 賣的是「控制權」而非「更多功能」</div>
      <div class="tri">
        <div class="tri-block good">
          <h4>✅ 優點</h4>
          <ul>
            <li><strong>差異化邏輯正確</strong>：三大解鎖（自備金鑰／Ollama 地端模型／Agent 匯出）全是治理與控制層面的差異，與標準版不形成功能競食，是教科書等級的版本切分。</li>
            <li><strong>資安承諾具體可查證</strong>：點名「Google Gemini 官方企業級管道」「Ollama＋Llama 3／Gemma」，比空泛的「銀行級加密」有說服力得多。</li>
            <li><strong>「點數用罄可切自備金鑰免扣點」</strong>：直接化解標準版的額度焦慮，本身就是升級的最強理由，文案有把這點講出來。</li>
            <li><strong>IP 保護有著墨</strong>：「二進位機器碼編譯與混淆」同時回應了客戶資安與自家智財兩層需求。</li>
          </ul>
        </div>
        <div class="tri-block star">
          <h4>⭐ 特點（市場區隔）</h4>
          <ul>
            <li><strong>Agent MD 匯出對接 NotebookLM／ChatGPT／Claude</strong>：「去敏感化打包、扣 0 點、餵給任何 AI 二次分析」——這是全站最具前瞻性的功能，台灣市場目前幾乎沒有同類產品這樣做，建議在銷售時放大。</li>
            <li><strong>跨官方帳號統一戰情分析</strong>：對連鎖品牌、多品牌經營者是剛需，也是未來規模化推廣的接口。</li>
            <li><strong>100% 地端內網部署選項</strong>：直接打開政府機關與資安敏感產業的門。</li>
          </ul>
        </div>
        <div class="tri-block warn">
          <h4>⚠️ 不足與風險</h4>
          <ul>
            <li><strong>價格翻倍的價值錨點不夠直白</strong>：買方會心算「價格 ×2 但點數只 ×2.5」，若他用點數單價理解這個產品就會覺得不划算。文案需要一句定錨：「進階版買的不是更多點數，是資料主權」。</li>
            <li><strong>展示影片仍是標準版檔案</strong>（product-intro.html 進階版區塊引用 standard_demo.mp4）：送件前必須換成進階版實錄，否則「三大解鎖」只有文字沒有畫面。</li>
            <li><strong>地端部署的責任邊界未揭露</strong>：Ollama 跑 Llama 3 需要什麼等級的硬體（GPU？RAM？）、由誰維運、故障 SLA 為何——高資安買方一定會問，文案完全沒有著墨。</li>
            <li><strong>「去敏感化」缺乏定義</strong>：匯出 MD 給外部 Agent 時，去敏感化的規則（去識別化範圍、可否自訂）沒有說明，恰好是最在意資安的這群買方會追問的細節。</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== 加值包 ===== -->
    <div class="card">
      <div class="product-title">
        <span class="p-name">➕ 工作流整合加值包</span>
        <span class="p-price">+$100,000 / 6個月 · 加贈 50,000 點 · 需搭配主方案</span>
      </div>
      <div class="positioning">定位：把 AI 產出直接送進工作群組 —— 全站轉換誘因最強的產品</div>
      <div class="tri">
        <div class="tri-block good">
          <h4>✅ 優點</h4>
          <ul>
            <li><strong>贈點設計極聰明</strong>：加購 10 萬送 50,000 點——贈點量是標準版本體（20,000 點）的 2.5 倍，讓「合購」在數學上幾乎無法拒絕，同時墊高整單金額至 20~30 萬。</li>
            <li><strong>經銷商視角完整</strong>：「當場輸入 /summary 秒回、銷售成功率大增」「5 分鐘開通、免代碼」——這頁不只寫給終端客戶，也把經銷夥伴的演示劇本寫好了，是通路化布局的正確起手式。</li>
            <li><strong>三開關的產品化程度高</strong>：後台一鍵開關的呈現（含模擬 toggle UI）讓「免開發」這個承諾看得見。</li>
          </ul>
        </div>
        <div class="tri-block star">
          <h4>⭐ 特點（市場區隔）</h4>
          <ul>
            <li><strong>LINE → Telegram 橋接</strong>：市場上極少見的組合，對已有跨國團隊或受不了 LINE 檔案過期的團隊有真實吸引力。</li>
            <li><strong>群組內斜線指令（/summary、/todo）</strong>：免登入後台、在對話現場即時取得 AI 分析，是「最短路徑交付價值」的體現。</li>
            <li><strong>KM 自動答詢</strong>：讓知識庫從「被動查詢」變成「主動參與對話」，是三模組中天花板最高的一個。</li>
          </ul>
        </div>
        <div class="tri-block warn">
          <h4>⚠️ 不足與風險</h4>
          <ul>
            <li><strong>文案自相矛盾（建議優先修正）</strong>：「數據絕不會經過非受信任之第三方雲端中轉」與 Telegram 橋接並存——Telegram 本身就是第三方雲端。嚴格的資安審查者或懂技術的買方會抓這一句。建議收斂為「僅透過 LINE 與 Telegram 官方加密 API 傳輸，不經任何非官方中轉服務」。</li>
            <li><strong>Telegram 的市場教育成本</strong>：台灣企業主流通訊仍是 LINE，Telegram 滲透率有限。「為什麼 TG 更強大」的說服區塊寫得不錯，但建議補一個真實使用情境（例如「工程團隊戰情頻道」）讓買方能代入。</li>
            <li><strong>獨立價值敘事弱</strong>：作為選購包，它的價值完全依附主方案。若買方只買標準版＋加值包（總價 20 萬），與直接買進階版（20 萬）如何取捨？文案沒有給出指引，第一線銷售會被問倒。</li>
            <li><strong>KM 自動答詢的邊界未說明</strong>：AI 主動在客戶群組中提供建議，答錯的責任與「僅建議、不自動發送」的機制設計需要講清楚，否則資安與商譽風險敏感的買方會卻步。</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== 跨產品觀察 ===== -->
  <section>
    <h2>五、跨產品整體觀察</h2>

    <div class="card">
      <h3 style="margin-top:0;">共同優勢（值得在提案時放大）</h3>
      <ul>
        <li><strong>互動 POC 是全案最強資產</strong>：三分頁工作台＋自動導覽播放，把抽象的「AI 資訊管理」變成看得到、點得動的東西。送審與銷售場景都應該以 POC 為主角。</li>
        <li><strong>頁面形態直接模擬補助方案目錄</strong>（115年方案價格、行業別標籤、CISA 版式），讓審查方與買方「預先看見上架後的樣子」，是聰明的心理設計。</li>
        <li><strong>價格階梯完整</strong>：10 萬（進門）→ 20 萬（主力）→ 合購 30 萬（完整方案），每一階都有明確的升級理由，銷售路徑清晰。</li>
        <li><strong>「雲端 SaaS ＋ 地端私有化」雙部署貫穿全線</strong>，一套產品同時覆蓋預算敏感型與資安敏感型兩類客群。</li>
      </ul>

      <h3>共同待補強（送件前檢查清單）</h3>
      <table>
        <thead>
          <tr><th style="width:90px;">優先級</th><th>項目</th><th>說明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="prio p0">P0 送件前必修</span></td>
            <td><strong>品牌名稱統一</strong></td>
            <td>目前並存三種稱呼：「天勳 x Force Cheng LINE AI」（主頁）、「Attn LINE AI」（提案頁）、「Attn IM AI」（POC 歡迎語）。送審文件中名稱不一致會直接扣分。</td>
          </tr>
          <tr>
            <td><span class="prio p0">P0 送件前必修</span></td>
            <td><strong>進階版展示影片</strong></td>
            <td>進階版區塊目前引用標準版影片（standard_demo.mp4），「三大解鎖」缺乏對應畫面佐證。</td>
          </tr>
          <tr>
            <td><span class="prio p0">P0 送件前必修</span></td>
            <td><strong>「不經第三方中轉」表述</strong></td>
            <td>與 Telegram 橋接功能矛盾（見加值包分析），一句話修正即可，但不修會成為審查與資安盡調的攻擊點。</td>
          </tr>
          <tr>
            <td><span class="prio p1">P1 強烈建議</span></td>
            <td><strong>信任證據升級</strong></td>
            <td>兩個應用情境目前是推演式的（虛構人物 Jerry），建議至少放入一個真實試用者的量化成效（「每日整理時間從 40 分鐘降至 3 分鐘」這類數字），沒有也可標明「試點進行中」。</td>
          </tr>
          <tr>
            <td><span class="prio p1">P1 強烈建議</span></td>
            <td><strong>揭露事項補齊</strong></td>
            <td>歷史訊息無法回溯收錄、地端部署硬體需求、合約到期後的資料匯出與退場機制。主動揭露反而是信任加分項——尤其「資料可攜、隨時可走」對 SME 是強賣點。</td>
          </tr>
          <tr>
            <td><span class="prio p1">P1 強烈建議</span></td>
            <td><strong>競品攻擊性文案的語氣</strong></td>
            <td>「坊間部分服務廠商……造成不可挽回的資安漏洞」的警示區塊有效但語氣偏重，放在政府審查語境可能顯得攻擊性強，建議改為中性比較表（本方案 vs 一般做法）。</td>
          </tr>
          <tr>
            <td><span class="prio p2">P2 可排程處理</span></td>
            <td><strong>官方版式的誤認風險</strong></td>
            <td>提案頁 footer 標示「© 經濟部商業發展署」且公開於 GitHub Pages，建議加註「提案示意頁面」浮水印，避免被誤認為官方頁面。</td>
          </tr>
          <tr>
            <td><span class="prio p2">P2 可排程處理</span></td>
            <td><strong>續約與長期定價路徑</strong></td>
            <td>全線只有「6 個月」單一期程，期滿後的續約價、年約優惠、點數結轉規則皆未提及，影響買方的長期採用決策。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- ===== 結論 ===== -->
  <section>
    <h2>六、給夥伴的結論</h2>
    <div class="card">
      <p>
        <strong>這套提案的骨架是對的，火力也夠。</strong>版本切分邏輯成熟、定價貼合補助情境、POC 的展示力在同類提案中屬於頂規。三個 P0 項目（品牌名統一、進階版影片、一句矛盾文案）都是小時級的修正量，修完即具備送件水準。
      </p>
      <p>
        銷售時建議的主打順序：<strong>先讓客戶看 POC 自動導覽</strong>（30 秒內看懂產品）→ 用「LINE 檔案過期」痛點帶入標準版 → 對有資安意識或多帳號需求的客戶直上進階版（用「資料主權」定錨，不比點數單價）→ 加值包以「合購贈 5 萬點」收尾墊高客單。
      </p>
      <p style="margin-bottom:0;">
        中長期最值得投資的兩個方向：一是把「Agent 匯出對接 NotebookLM／ChatGPT／Claude」從功能清單升格為獨立賣點頁（這是目前市場上最稀缺的能力）；二是盡快累積 1~2 個可具名的試點實績，把情境式案例換成真實數據——這是目前全案唯一買不到、只能用時間換的東西。
      </p>
    </div>
  </section>

</div>

<footer>
  <div class="container">
    本報告由 <strong>Claude Fable 5</strong>（Anthropic）於 2026-07-04 基於公開頁面文案獨立產出，供 Falo / Force 的團隊夥伴參考。<br>
    提案開發：ChatGPT Codex（OpenAI）＋ Google Antigravity（Google）｜獨立檢核：Claude Fable 5（Anthropic）｜決策：Force（人類）<br>
    分析範圍：
    <a href="https://falo-taiwan.github.io/line_bot/" target="_blank">index</a> ·
    <a href="https://falo-taiwan.github.io/line_bot/product-intro.html" target="_blank">product-intro</a> ·
    <a href="https://falo-taiwan.github.io/line_bot/workflow-addon.html" target="_blank">workflow-addon</a> ·
    <a href="https://falo-taiwan.github.io/line_bot/poc-demo.html" target="_blank">poc-demo</a>
  </div>
</footer>

</body>
</html>
`;
const LINE_PARSER_SPEC_HTML = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Falo LINE 對話解析規格與開發指南</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <style>
    :root {
      --primary: #0f766e;
      --primary-light: #0d9488;
      --primary-bg: #f0fdfa;
      --dark: #0f172a;
      --light: #f8fafc;
      --gray: #64748b;
      --border: #e2e8f0;
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --indigo: #4f46e5;
      --indigo-bg: #e0e7ff;
      --glass: rgba(255, 255, 255, 0.85);
      --shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
      --gradient: linear-gradient(135deg, #115e59 0%, #0f766e 50%, #0d9488 100%);
      --indigo-gradient: linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%);
    }

    * {
      box-sizing: border-box;
      transition: all 0.2s ease-in-out;
    }

    body {
      margin: 0;
      background: var(--light);
      color: var(--dark);
      font-family: 'Outfit', 'Noto Sans TC', sans-serif;
      line-height: 1.8;
      font-size: 15px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header Styling */
    header {
      background: var(--gradient);
      color: #ffffff;
      padding: 64px 0 48px;
      border-bottom: 5px solid #0f766e;
      position: relative;
      overflow: hidden;
    }
    
    header::after {
      content: "";
      position: absolute;
      bottom: -50px;
      right: -50px;
      width: 250px;
      height: 250px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 50%;
    }

    header h1 {
      margin: 0 0 12px;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
      font-weight: 300;
    }

    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }

    /* Sections */
    section {
      padding: 48px 0 16px;
    }

    h2 {
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
      border-left: 5px solid var(--primary);
      padding-left: 14px;
      margin: 0 0 28px;
    }

    h3 {
      font-size: 18px;
      font-weight: 700;
      color: var(--dark);
      margin: 24px 0 12px;
    }

    p {
      margin: 0 0 16px;
      color: #334155;
    }

    /* Cards */
    .card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: var(--shadow);
      position: relative;
    }

    .card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--border);
      border-radius: 16px 0 0 16px;
    }

    .card-primary::before { background: var(--primary); }
    .card-success::before { background: var(--success); }
    .card-warning::before { background: var(--warning); }
    .card-indigo::before { background: var(--indigo); }

    .card h3 {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Code Blocks */
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 16px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      overflow-x: auto;
      margin: 18px 0;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }

    /* Callout */
    .callout {
      border-left: 4px solid var(--indigo);
      background: #f5f3ff;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 0 10px 10px 0;
    }

    /* Comparison Table */
    .table-container {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow-x: auto;
      box-shadow: var(--shadow);
      margin: 24px 0 40px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }

    th, td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    th {
      background: #f1f5f9;
      color: var(--dark);
      font-weight: 700;
      white-space: nowrap;
    }

    /* Bullet list */
    ul {
      padding-left: 24px;
      margin-bottom: 16px;
    }
    li {
      margin-bottom: 8px;
    }

  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="container">
      <div class="badge">開發設計規範 (v2.x)</div>
      <h1>Falo LINE 對話解析規格與開發指南</h1>
      <p>結合兩大成熟開源套件的共通解析規格與 Falo SQL Gateway 核心演進策略</p>
    </div>
  </header>

  <main class="container">
    
    <!-- Core Strategy -->
    <section>
      <h2>一、 Falo 核心策略：SQL 作為資料交換網關</h2>
      <div class="callout">
        <h4>💡 SQL 是一種資料交換 Gateway 抽象概念，而非綁定實體 DB</h4>
        <p>在 v2.x 設計中，解析層與大腦層完全解耦。對話解析器（不管是 JS 在前端執行，還是地端 Python 在背景執行）在讀取 <code>.txt</code> 歷史對話檔後，<strong>一律輸出符合 SQL 欄位的標準 JSON 物件陣列</strong>。</p>
        <p>這使得 AI 能夠在語意層以 SQL 的形式精準查詢歷史（如篩選特定群組與時間區間的對話），且未來底層儲存從 Google Sheets 升級到 SQLite 或 Cloudflare D1 時，解析與前台程式碼完全不需要改動。</p>
      </div>
    </section>

    <!-- Upstream Packages -->
    <section>
      <h2>二、 借鏡之上游開源套件說明</h2>
      <p>為了避免在處理 LINE 匯出檔的多種 Edge Cases（如不同手機作業系統、不同語言語系、多行對話換行等）走冤枉路，我們將以下兩個專案最新代碼備份於本機庫，作為 Falo 解析演算法的上游基石：</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <div class="card card-primary">
          <h3><i class="bi bi-filetype-js text-teal"></i> 1. line-message-analyzer (JS)</h3>
          <p><strong>專案連結</strong>：chonyy/line-message-analyzer</p>
          <p><strong>備份路徑</strong>：<code>backup/parsers/line-message-analyzer.zip</code></p>
          <p><strong>核心價值</strong>：以 JavaScript/React 撰寫，完美處理瀏覽器端文字檔分行、AM/PM 時間切換、以及繁體中文環境下所有日期變體。適合 Falo 前端上傳解析器參考。</p>
        </div>
        <div class="card card-indigo">
          <h3><i class="bi bi-filetype-py text-indigo"></i> 2. linelog2py (Python)</h3>
          <p><strong>專案連結</strong>：jyu0414/linelog2py</p>
          <p><strong>備份路徑</strong>：<code>backup/parsers/linelog2py.zip</code></p>
          <p><strong>核心價值</strong>：Python 社群中專門將 LINE 文字歷史轉換成結構化物件的封裝庫。定義了乾淨的訊息實體與類別，適合作為地端後台解析參考。</p>
        </div>
      </div>
    </section>

    <!-- Common Rules -->
    <section>
      <h2>三、 共通性解析規則與特徵判定</h2>
      <p>通過分析兩大套件，我們歸納出以下四大共通性解析原則：</p>

      <h3>1. 日期狀態機 (Date State Tracker)</h3>
      <p>LINE 導出的文字檔中，日期通常是獨立一行的標頭（如 <code>2026/06/25 (Mon)</code> 或 <code>2026年6月25日 星期一</code>），而每條具體對話只有標記時間（如 <code>10:30</code>）。</p>
      <p><strong>實作對策</strong>：解析器內部維持一個 <code>date_string</code> 狀態。遇到空行後的下一行若匹配日期格式，則更新該狀態，其餘對話行均結合此 <code>date_string</code> 拼湊出完整 ISO 8601 時間戳記。</p>

      <h3>2. 多行累加緩衝器 (Multi-line Accumulator)</h3>
      <p>使用者在 LINE 發送訊息常會按 Shift+Enter 換行。文字檔中的這些換行行**不帶有時間與人名標頭**。</p>
      <p><strong>實作對策</strong>：一行的第一個元素若不符合新對話起點的判定條件，解析器必須將該行文字作為 <code>\\n</code> 連接字串，直接追加累加到上一則訊息物件的內容末端。</p>

      <h3>3. 特殊事件分類 (Message Categorization)</h3>
      <p>對話中的特殊圖片、貼圖與通話事件，兩大套件皆有以下共通的 Regex 與特徵字串檢索轉換機制：</p>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>LINE 原始特徵字串</th>
              <th>對應類別</th>
              <th>SQL event_type 映射</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>[圖片]</code> / <code>[Photo]</code> / <code>[写真]</code></td>
              <td>圖片媒體</td>
              <td><code>image</code></td>
            </tr>
            <tr>
              <td><code>[貼圖]</code> / <code>[Sticker]</code> / <code>[スタンプ]</code></td>
              <td>貼圖物件</td>
              <td><code>sticker</code></td>
            </tr>
            <tr>
              <td><code>[檔案]</code> / <code>[File]</code> / <code>[ファイル]</code></td>
              <td>文件附件</td>
              <td><code>file</code></td>
            </tr>
            <tr>
              <td><code>☎ 通話時間</code> / <code>☎ Call time</code> / <code>☎ 通話時間</code></td>
              <td>語音通話紀錄</td>
              <td><code>call_event</code></td>
            </tr>
            <tr>
              <td><code>收回訊息</code> / <code>unsent a message</code></td>
              <td>訊息收回通知</td>
              <td><code>unsent_event</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Algorithm Blueprint -->
    <section>
      <h2>四、 Falo 統一解析演算法藍圖</h2>
      <p>以下為 Falo 設計之統一對話解析演算法偽代碼，地端 Python 與 CF 前端 JS 均需照此實作：</p>
      <pre><code>function parseLineLog(rawText) {
  const lines = rawText.split('\\n');
  let dateString = "2020/01/01";
  let isNextNewDate = false;
  const messages = [];

  // 跳過前兩行標頭 (匯出群組名稱與時間)
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      isNextNewDate = true;
      continue;
    }
    
    // 偵測日期行
    if (isNextNewDate && /^\\d{4}\\/\\d{2}\\/\\d{2}/.test(line)) {
      dateString = line.substring(0, 10);
      isNextNewDate = false;
      continue;
    }

    const splitted = line.split('\\t');
    // 偵測新對話列 (時間 \\t 姓名 \\t 內容)
    if (splitted.length >= 3 && /^\\d{2}:\\d{2}$/.test(splitted[0])) {
      const timeStr = \`\${dateString} \${splitted[0]}\`;
      const username = splitted[1];
      const text = splitted.slice(2).join('\\t');
      
      messages.push({
        captured_at: new Date(timeStr).toISOString(),
        sender_name: username,
        text_content: text,
        message_type: detectType(text) // 貼圖/圖片分類識別
      });
    } else if (messages.length > 0) {
      // 處理換行訊息
      messages[messages.length - 1].text_content += '\\n' + line;
    }
  }
  return messages;
}</code></pre>
    </section>

    <!-- Google Drive Restoration and Mapping Registry -->
    <section>
      <h2>五、 Google Drive 雲端架構隔離與 Mapping 機制 (v2.1)</h2>
      <p>自 v2.1 版起，專案引入了嚴格的檔案結構隔離以及對話 Mapping 對照機制，以解決多個 LINE 帳號管理時的雜亂問題。</p>
      
      <h3>1. 三層隔離目錄架構</h3>
      <ul>
        <li><strong><code>exports/</code></strong>：存放使用者手動上傳的對話備份文字檔。控制台只掃描此資料夾。</li>
        <li><strong><code>system_raw/Bot_[botAlias]/</code></strong>：Webhook 自動備份產生的 <code>raw_</code> 對話文字檔收納區。</li>
        <li><strong><code>system_media/</code></strong>：Webhook 抓回的圖片、語音等系統附件。</li>
      </ul>

      <h3>2. 智慧名稱提取與對照註冊表 (Registry)</h3>
      <p>GAS 調用 <code>list_files</code> 時，會自動讀取 <code>exports/</code> 底下各文字檔的首行提取群組名稱，並與試算表中的 <code>chat_registry</code> 對比，在控制台選單直接顯示好讀名稱（如 <code>FALO 核心研發群</code>），而非無意義的檔名。</p>

      <h3>3. 增量對齊策略 (Incremental Sync)</h3>
      <p>支援增量與覆蓋兩種同步資料庫方式。增量模式下，系統會查詢該對話的最大時間戳，自動過濾並僅寫入新收到的訊息，確保資料庫內容沒有重疊與重複。</p>
    </section>

    <!-- FALO Analysis Basket Spec Section -->
    <section>
      <h2>六、 FALO 綜合分析購物車與上下文積木編譯機制 (v2.2)</h2>
      <p>自 v2.2 版起，控制台導入了 <strong>「FALO 綜合分析購物車 (Analysis Context Basket)」</strong> 機制，實現多來源資料積木的隨選組合與排序。</p>
      
      <h3>1. 資料積木化 (Data Blocks Packaging)</h3>
      <p>LINE、官方助手、KM 卡片底部均配備「存入分析清單」按鈕。點擊時，當前所勾選切片之資料（或文字內容）會立即冷凍並組裝成獨立的 Block 物件，追加存入全域清單 <code>analysisBasket</code> 中。</p>

      <h3>2. 隨選啟用與上下排序</h3>
      <p>積木清單中，使用者可單獨啟用/關閉某個積木。同時，可使用 <code>▲</code> 與 <code>▼</code> 按鈕自由搬移積木，AI 最終閱讀 Prompt 上下文的先後順序將嚴格按照使用者的自訂排序，大幅提升比對的準確性。</p>

      <h3>3. 智慧編譯串接</h3>
      <p>編譯器 <code>updateUnifiedCompiledContext</code> 會優先抓取購物車中已啟用的 Block 內容，依索引順序由上而下串接，並在各 Block 區段間插入 Markdown <code>---</code> 分割線，實現多來源上下文的智慧編譯與字數即時累加。</p>
    </section>

    <!-- FALO Auditing and Foolproofing Spec Section -->
    <section>
      <h2>七、 資料分析與防呆審計機制 (v2.3)</h2>
      <p>在非結構化對話分析中，防止 inline 垃圾資料或內文日期被誤判為系統日期分隔線，是確保分析結果精準度的重要防禦工程。</p>
      
      <h3>1. 正規表示式行尾嚴格錨定</h3>
      <p><code>dateRegex</code> 加入行尾錨定 <code>$</code>，並且嚴格限制僅能有如 <code>（週六）</code> 或 <code>(Sat)</code> 等合規星期標誌。任何包含 <code>~</code> 波浪號或額外文字之內文日程，正規表示式將直接拒絕判定為日期分隔線。</p>

      <h3>2. 匯出日期上限稽核 (Export Date Audit)</h3>
      <p>物理邏輯上，訊息發送時間絕不可能晚於檔案儲存/匯出時間。解析器在讀取首部時，會先提取出例如 <code>儲存日期：2026/7/5</code>。解析出的日期若大於此限，一律自動否決。</p>

      <h3>3. 時間單向遞增稽核 (Progression Audit)</h3>
      <p>對話歷史是單向遞增的。若新匹配的日期早於前一個有效日期（例如已經到 2020 年卻出現 2018 年），表示為內文中引用的歷史時間。系統會直接稽核否決該日期分隔，回退為上一則訊息的換行文字追加。</p>
    </section>

  </main>
</body>
</html>
`;
const GOOGLE_SHEETS_ACCESS_METHODS_HTML = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Google Sheets 存取技術大解析：SQL 作為資料交換 Gateway 的抽象思想</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <style>
    :root {
      --primary: #0f766e;
      --primary-light: #0d9488;
      --primary-bg: #f0fdfa;
      --dark: #0f172a;
      --light: #f8fafc;
      --gray: #64748b;
      --border: #e2e8f0;
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --indigo: #4f46e5;
      --indigo-bg: #e0e7ff;
      --glass: rgba(255, 255, 255, 0.85);
      --shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
      --gradient: linear-gradient(135deg, #115e59 0%, #0f766e 50%, #0d9488 100%);
      --indigo-gradient: linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #6366f1 100%);
    }

    * {
      box-sizing: border-box;
      transition: all 0.2s ease-in-out;
    }

    body {
      margin: 0;
      background: var(--light);
      color: var(--dark);
      font-family: 'Outfit', 'Noto Sans TC', sans-serif;
      line-height: 1.8;
      font-size: 15px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header Styling */
    header {
      background: var(--gradient);
      color: #ffffff;
      padding: 64px 0 48px;
      border-bottom: 5px solid #0f766e;
      position: relative;
      overflow: hidden;
    }
    
    header::after {
      content: "";
      position: absolute;
      bottom: -50px;
      right: -50px;
      width: 250px;
      height: 250px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 50%;
    }

    header h1 {
      margin: 0 0 12px;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
      font-weight: 300;
    }

    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    }

    /* Sections */
    section {
      padding: 48px 0 16px;
    }

    h2 {
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
      border-left: 5px solid var(--primary);
      padding-left: 14px;
      margin: 0 0 28px;
    }

    p {
      margin: 0 0 16px;
      color: #334155;
    }

    /* Comparison Table */
    .table-container {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow-x: auto;
      box-shadow: var(--shadow);
      margin-bottom: 40px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: left;
    }

    th, td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    th {
      background: #f1f5f9;
      color: var(--dark);
      font-weight: 700;
      white-space: nowrap;
    }

    tr:last-child td {
      border-bottom: none;
    }

    /* Badges */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 50px;
    }

    .status-good {
      background: #d1fae5;
      color: var(--success);
    }

    .status-warn {
      background: #fef3c7;
      color: var(--warning);
    }

    .status-bad {
      background: #fee2e2;
      color: var(--danger);
    }

    /* Cards */
    .card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: var(--shadow);
      position: relative;
    }

    .card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--border);
      border-radius: 16px 0 0 16px;
    }

    .card-primary::before { background: var(--primary); }
    .card-success::before { background: var(--success); }
    .card-warning::before { background: var(--warning); }
    .card-danger::before { background: var(--danger); }
    .card-indigo::before { background: var(--indigo); }

    .card h3 {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card h3 i {
      font-size: 24px;
    }

    /* Code Blocks */
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 16px 20px;
      border-radius: 10px;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      overflow-x: auto;
      margin: 18px 0;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
    }

    /* Grid for Pros and Cons */
    .pro-con-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 18px;
    }

    @media (max-width: 768px) {
      .pro-con-grid {
        grid-template-columns: 1fr;
      }
    }

    .pro-box, .con-box {
      border-radius: 10px;
      padding: 18px 20px;
      font-size: 13.5px;
    }

    .pro-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    }

    .con-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .pro-box h4, .con-box h4 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pro-box h4 { color: var(--success); }
    .con-box h4 { color: var(--danger); }

    .pro-box ul, .con-box ul {
      margin: 0;
      padding-left: 20px;
    }

    .pro-box li, .con-box li {
      margin-bottom: 6px;
    }
    
    .pro-box li:last-child, .con-box li:last-child {
      margin-bottom: 0;
    }

    /* Highlight Banner */
    .concept-banner {
      background: var(--indigo-gradient);
      color: #ffffff;
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 40px;
      box-shadow: var(--shadow);
    }
    .concept-banner h3 {
      margin: 0 0 12px;
      font-size: 22px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .concept-banner p {
      color: rgba(255,255,255,0.9);
      font-size: 15px;
      margin: 0 0 16px;
    }
    .concept-banner code {
      background: rgba(255,255,255,0.15);
      color: #ffffff;
    }

  </style>
</head>
<body>

  <!-- Header -->
  <header>
    <div class="container">
      <div class="badge">架構師思維與技術分享</div>
      <h1>Google Sheets 存取技術大解析</h1>
      <p>探討 SQL 作為「資料交換 Gateway」的抽象化核心思想，及 7 種試算表資料庫化的實作評估</p>
    </div>
  </header>

  <!-- Content Section -->
  <main class="container">
    
    <!-- SQL Abstraction Concept Section -->
    <section style="padding-top: 48px;">
      <div class="concept-banner">
        <h3><i class="bi bi-cpu-fill"></i> 核心思想：SQL 只是一種「資料交換 Gateway」的抽象協議</h3>
        <p>在傳統開發中，我們常把 SQL 窄化地理解為「對實體資料庫檔案（如 MySQL/PostgreSQL）進行的查詢」。但在現代雲地協同與 AI 開發時代，<strong>SQL 代表的是一種高度標準化、宣告式（Declarative）的「資料交換 Gateway 契約」</strong>。</p>
        <p>不論底層的實體儲存媒體是 Google Sheets、地端 CSV、甚至是雲端 JSON 檔案；只要我們在中間包裝一層 **SQL API Gateway**，讓呼叫端預設使用 <code>SELECT</code>, <code>WHERE</code>, <code>LIMIT</code> 等 SQL 邏輯進行溝通，就能在架構上實現<strong>資料庫技術細節的完全隱藏</strong>：</p>
        <ul>
          <li><strong>對 AI Coding 與 Agent 極度友善</strong>：AI Agent 自然懂 SQL，只要介面是 SQL 規格，AI 就能在不需要了解 Google 特有 API 與限制的情況下，進行 100% 正確的檢索與操作。</li>
          <li><strong>儲存媒介隨時無痛升級</strong>：今天用 Google Sheets (GAS 封裝 SQL API) 作為 $0 成本資料庫；明天想升級到 Cloudflare D1，地端與前端的程式碼 **完全不用改寫任何一行**，因為底層都是說著相同的 SQL Gateway 語言！</li>
        </ul>
      </div>
    </section>

    <section style="padding-top: 16px;">
      <h2>一、 各種存取 Google Sheets 方案總覽</h2>
      <p>基於上述 SQL Gateway 的抽象思想，我們評估了 7 種將 Google Sheets 當作資料庫存取的主流架構：</p>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>方案名稱</th>
              <th>存取速度</th>
              <th>資安隱私等級</th>
              <th>查詢能力 (SQL)</th>
              <th>開發複雜度</th>
              <th>最適合場景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1. 官方 API v4</strong></td>
              <td><span class="status-badge status-warn">中 (約 200-500ms)</span></td>
              <td><span class="status-badge status-good">極高 (OAuth/金鑰)</span></td>
              <td><span class="status-badge status-bad">無 (需手動篩選)</span></td>
              <td><span class="status-badge status-warn">中高 (OAuth/SDK)</span></td>
              <td>大型企業系統整合</td>
            </tr>
            <tr>
              <td><strong>2. GAS Web App 封裝</strong></td>
              <td><span class="status-badge status-warn">中 (約 300-800ms)</span></td>
              <td><span class="status-badge status-good">極高 (Token 校驗)</span></td>
              <td><span class="status-badge status-good">極佳 (JS 記憶體過濾)</span></td>
              <td><span class="status-badge status-warn">中等 (JS)</span></td>
              <td>SME MVP / FALO v2.x</td>
            </tr>
            <tr>
              <td><strong>3. Google GViz API</strong></td>
              <td><span class="status-badge status-good">快 (約 100-300ms)</span></td>
              <td><span class="status-badge status-bad">低 (需公開連結)</span></td>
              <td><span class="status-badge status-good">原生支援 SQL 語法</span></td>
              <td><span class="status-badge status-good">極低 (HTTP)</span></td>
              <td>公開數據展示 / 簡易看板</td>
            </tr>
            <tr>
              <td><strong>4. 第三方 NoCode 轉 API</strong></td>
              <td><span class="status-badge status-good">快 (CDN 快取)</span></td>
              <td><span class="status-badge status-warn">中等 (依賴第三方)</span></td>
              <td><span class="status-badge status-good">支援 API 參數篩選</span></td>
              <td><span class="status-badge status-good">極低 (免代碼)</span></td>
              <td>原型快速開發 / 簡易網站</td>
            </tr>
            <tr>
              <td><strong>5. 本地 SQLite 快取同步</strong></td>
              <td><span class="status-badge status-good">極速 (0-1ms)</span></td>
              <td><span class="status-badge status-good">極高 (資料完全落地)</span></td>
              <td><span class="status-badge status-good">100% 相容實體 SQL</span></td>
              <td><span class="status-badge status-bad">高 (需寫背景同步)</span></td>
              <td>離線運作 / 地端 AI Agent</td>
            </tr>
            <tr>
              <td><strong>6. DuckDB + CSV 直連</strong></td>
              <td><span class="status-badge status-good">極速 (本機執行)</span></td>
              <td><span class="status-badge status-warn">中等 (CSV 連結暴露)</span></td>
              <td><span class="status-badge status-good">超強 DuckDB 分析 SQL</span></td>
              <td><span class="status-badge status-good">低 (Pandas/DuckDB)</span></td>
              <td>大數據離線分析 / 報表產出</td>
            </tr>
            <tr>
              <td><strong>7. BigQuery 聯邦查詢</strong></td>
              <td><span class="status-badge status-warn">慢 (約數秒延遲)</span></td>
              <td><span class="status-badge status-good">最高 (GCP IAM 權限)</span></td>
              <td><span class="status-badge status-good">完整企業級 SQL-92</span></td>
              <td><span class="status-badge status-bad">極高 (GCP 管理)</span></td>
              <td>企業內部商業智慧 (BI)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2>二、 核心方案深度解析與實作範例</h2>

      <!-- 1. Google Apps Script Web App (API Wrapper) -->
      <div class="card card-primary">
        <h3><i class="bi bi-code-slash text-teal"></i> 1. GAS Web App (自建 API 代理)</h3>
        <p>這是最被推薦的「先求有，再求好」的彈性設計。在 Google 試算表內部署 Apps Script 並發布為 Web App，負責接收 HTTP GET/POST 請求，在 Google 的伺服器端運行 JavaScript 來讀寫與篩選 Sheets 內容。</p>
        
        <div class="pro-con-grid">
          <div class="pro-box">
            <h4><i class="bi bi-plus-circle"></i> 優點</h4>
            <ul>
              <li><strong>絕對的安全隱私</strong>：試算表無需對外公開，GAS 會以「部署者帳號」的身分執行存取，只需自訂 API Key 即可防盜。</li>
              <li><strong>自定義 Schema</strong>：可以在 GAS 中處理好資料轉換、去重、資料格式清洗，直接回傳最乾淨的 JSON，地端無負擔。</li>
              <li><strong>API 限制分散化</strong>：程式部署在客戶端，資源與頻率配額由客戶帳號自行負擔。</li>
            </ul>
          </div>
          <div class="con-box">
            <h4><i class="bi bi-dash-circle"></i> 缺點</h4>
            <ul>
              <li><strong>執行時間限制</strong>：單次 HTTP 執行最多 30 秒至 6 分鐘，不適合處理極大流量的寫入。</li>
              <li><strong>冷啟動時間 (Cold Start)</strong>：有時 Google 容器初始化需要 1-2 秒，會造成些許延遲。</li>
            </ul>
          </div>
        </div>

        <pre><code>// GAS Web App doGet 簡易實作：模擬 SQL Filtering 接口
function doGet(e) {
  var action = e.parameter.action;
  var targetId = e.parameter.chat_id;
  
  if (action === 'query') {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("events");
    var values = sheet.getDataRange().getValues();
    var headers = values[0];
    
    // 在 Google 雲端記憶體中進行 JS Array 過濾
    var results = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      if (row[2] === targetId) { // 假設第三欄為 chat_id
        results.push({ id: row[0], text: row[8] });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify(results))
      .setMimeType(ContentService.MimeType.JSON);
  }
}</code></pre>
      </div>

      <!-- 2. Google Sheets GViz API (SQL Endpoint) -->
      <div class="card card-success">
        <h3><i class="bi bi-database-fill-check text-success"></i> 2. Google GViz API (Google 原生 SQL 查詢端點)</h3>
        <p>Google 試算表內部有提供一個給 Google Visualization API 使用的端點，允許外部程式直接下 SQL-like 的 Query String。Google 伺服器會在雲端解析並篩選完畢後才將資料回傳。</p>
        
        <div class="pro-con-grid">
          <div class="pro-box">
            <h4><i class="bi bi-plus-circle"></i> 優點</h4>
            <ul>
              <li><strong>原生 SQL 支援</strong>：支持 <code>SELECT</code>, <code>WHERE</code>, <code>GROUP BY</code>, <code>ORDER BY</code>, <code>LIMIT</code> 等關鍵字。</li>
              <li><strong>免自寫代碼</strong>：不需要部署任何 Apps Script 程式碼，直接打特定 HTTP 網址就能撈資料。</li>
            </ul>
          </div>
          <div class="con-box">
            <h4><i class="bi bi-dash-circle"></i> 缺點</h4>
            <ul>
              <li><strong>資安隱憂</strong>：試算表通常需要設定為「公開檢視」，否則外部發送 GET 請求時會回傳 403 Forbidden（雖然可以用 OAuth 2.0 處理，但程式開發複雜度會暴增）。</li>
              <li><strong>格式極難解析</strong>：回傳的是一段 JS 程式碼而非乾淨的 JSON，地端需要做正則切片過濾。</li>
            </ul>
          </div>
        </div>

        <pre><code># Python 呼叫 GViz 原生 SQL 示範
import requests
import json
import re

spreadsheet_id = "your_sheet_id_here"
sql_query = "SELECT A, B, C WHERE D = 'group_test' LIMIT 10"
url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tq={sql_query}"

response = requests.get(url)
# 必須用 Regex 去除 google.visualization.Query.setResponse() 包裝字串
json_str = re.search(r"google\\.visualization\\.Query\\.setResponse\\((.*)\\);", response.text).group(1)
data = json.loads(json_str)</code></pre>
      </div>

      <!-- 3. Local SQLite Sync + Cache -->
      <div class="card card-warning">
        <h3><i class="bi bi-cloud-arrow-down-fill text-warning"></i> 3. Local SQLite Sync + Cache (本地同步快取)</h3>
        <p>這是最適合對效能、離線運用與 AI 本地隱私要求極高時採用的架構。地端 Python 後台僅在背景「非同步」地將 Google Sheets 下載同步到本地 SQLite 中，前台的查詢則 100% 走本地 SQLite。</p>
        
        <div class="pro-con-grid">
          <div class="pro-box">
            <h4><i class="bi bi-plus-circle"></i> 優點</h4>
            <ul>
              <li><strong>0 毫秒極速查詢</strong>：前台搜尋、時間篩選直接下 SQLite 查詢，流暢度領先所有雲端直接讀取方案。</li>
              <li><strong>離線斷網高可用</strong>：即使 Google 伺服器掛掉或辦公室斷網，地端系統運作完全不受影響。</li>
              <li><strong>解放 AI 效率</strong>：地端 AI Agent 可以直接物理讀取本地 SQLite 資料庫與下載落地的圖片、PDF 文件，進行高速的 RAG 向量切片。</li>
            </ul>
          </div>
          <div class="con-box">
            <h4><i class="bi bi-dash-circle"></i> 缺點</h4>
            <ul>
              <li><strong>存在同步時間差 (Sync Lag)</strong>：本地資料不是 100% 的即時即刻（Real-time），除非每次 LINE Webhook 進來都發送 Signal 通知地端 Pull 數據。</li>
              <li><strong>開發成本高</strong>：必須編寫去重 (Deduplicate)、Checkpoint、以及資料衝突處理機制。</li>
            </ul>
          </div>
        </div>

        <pre><code># Python 背景執行 SQLite 增量同步虛擬碼
def sync_worker():
    # 1. 取得本地資料庫最新的最後一筆 timestamp
    last_sync_time = db.execute("SELECT MAX(captured_at) FROM chat_events").fetchone()[0]
    
    # 2. 向 GAS 網關發送請求，只拉取該時間點之後的新訊息
    url = f"https://script.google.com/macros/s/.../exec?action=query&start_date={last_sync_time}"
    new_events = requests.get(url).json()["data"]
    
    # 3. 寫入本地 SQLite，並非同步下載實體媒體檔案落地
    for event in new_events:
        db.execute("INSERT INTO chat_events VALUES (?, ?, ?, ...)", event)
        if event["message_type"] == "image":
            download_media_to_local_disk(event["message_id"])</code></pre>
      </div>

      <!-- 4. DuckDB / Pandas with CSV Export -->
      <div class="card card-danger">
        <h3><i class="bi bi-pie-chart-fill text-danger"></i> 4. DuckDB / Pandas + CSV 直連 (大數據分析專用)</h3>
        <p>Google 試算表原生支援直接導出 CSV 格式。如果對話紀錄累積到數萬筆，我們可以用 DuckDB (極速嵌入式 SQL 分析引擎) 或 Python Pandas，直接在內存中對 Google Sheets 匯出的實體 CSV 網址進行 SQL 查詢。</p>
        
        <div class="pro-con-grid">
          <div class="pro-box">
            <h4><i class="bi bi-plus-circle"></i> 優點</h4>
            <ul>
              <li><strong>分析效能極強</strong>：DuckDB 執行複雜的 Group By、Joins、Window functions 的速度比 SQLite 更快數倍，極適合做戰情中心的大量報表分析。</li>
              <li><strong>程式碼超簡潔</strong>：幾乎只需一行指令就能把線上 CSV 當作 SQL table 查詢。</li>
            </ul>
          </div>
          <div class="con-box">
            <h4><i class="bi bi-dash-circle"></i> 缺點</h4>
            <ul>
              <li><strong>高頻率呼叫頻寬開銷大</strong>：因為每次下 SQL 查詢，DuckDB 都必須向 Google 伺服器重新下載一次完整的 CSV 檔案，不適合做即時性高頻查詢，只適合做每日/每週批次報表分析。</li>
            </ul>
          </div>
        </div>

        <pre><code># Python + DuckDB 直接將 Google Sheet 當 SQL Table 查詢示範
import duckdb

spreadsheet_id = "your_sheet_id_here"
gid = "0" # 第一張分頁的 GID
csv_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"

# DuckDB 可以直接用 SQL 查詢網路上的 CSV 網址！
query = f"""
  SELECT sender_name, COUNT(*) as count 
  FROM read_csv_auto('{csv_url}') 
  GROUP BY sender_name 
  ORDER BY count DESC
"""
result = duckdb.query(query).to_df()
print(result)</code></pre>
      </div>
    </section>

    <section>
      <h2>三、 架構師深度建議與選型策略</h2>
      <p>對於 **Force** 與 **Falo 開發團隊** 而言，我們將這一套 SQL Gateway 的抽象思想融入架構規劃，並提供以下演進路徑：</p>
      
      <div class="callout" style="border-left-color: var(--indigo); background: #f5f3ff;">
        <h4 style="color: var(--indigo);"><i class="bi bi-rocket-takeoff-fill"></i> 給 Falo 產品線的黃金演進組合提案：</h4>
        <ul>
          <li><strong>MVP 階段（先求有，SME 轉型補助首選）</strong>：<br>
            採用 **「GAS Web App 封裝 (模擬 SQL API)」**。
            這能做到對話隱私 100% 安全、部署 $0 元、客戶有 Sheets 當做實體備份安全感，且地端 Python 程式開發速度最快。
          </li>
          <li><strong>Agent 落地 / 離線應用階段（再求好，高價值分析）</strong>：<br>
            升級為 **「本地 SQLite 快取同步」**。
            大腦依然在 Cloudflare，但客戶地端 Python 背景非同步同步資料與實體檔案。本地 AI Agent 讀取本地路徑，進行毫秒級 RAG 檢索與離線運作，效能與資安防線達到商業旗艦級別。
          </li>
          <li><strong>大數據戰情報表（分析層）</strong>：<br>
            採用 **「DuckDB + CSV / SQLite」**。
            對於複雜的每日發言趨勢圖表與指標統計，不用手寫長迴圈，交給 DuckDB SQL 直接高速運算。
          </li>
        </ul>
      </div>
    </section>
  </main>

</body>
</html>
`;
const MOBILE_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>LINE 對話預覽 | Falo IM</title>
  <!-- CSS: Bootstrap 5, Icons, Google Fonts -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-dark: #0f172a;
      --bg-card: #1e293b;
      --primary-teal: #0ea5e9;
      --border-color: rgba(255, 255, 255, 0.08);
    }
    
    body {
      background: var(--bg-dark);
      color: #f1f5f9;
      font-family: 'Inter', -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    /* Sticky Header */
    .preview-header {
      padding: 12px 16px;
      background: rgba(30, 41, 59, 0.95);
      border-bottom: 1px solid var(--border-color);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }
    
    .back-btn {
      color: #e2e8f0;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      transition: all 0.2s;
    }
    
    .back-btn:active, .back-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Scroll Body */
    .preview-scroll-body {
      flex-grow: 1;
      overflow-y: auto;
      padding: 16px;
      background: #090d16;
      display: flex;
      flex-direction: column;
    }
    
    /* LINE Simulation CSS */
    .line-chat-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 40px;
    }
    
    .chat-date-header {
      text-align: center;
      margin: 16px 0;
    }
    
    .chat-date-badge {
      background: rgba(0, 0, 0, 0.25);
      color: #cbd5e1;
      font-size: 10px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
    
    .chat-msg-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 6px;
      max-width: 85%;
    }
    
    .chat-msg-row.left-msg {
      align-self: flex-start;
    }
    
    .chat-msg-row.right-msg {
      align-self: flex-end;
      flex-direction: row-reverse;
      max-width: 85%;
    }
    
    .chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .chat-msg-content-wrapper {
      margin-left: 8px;
      margin-right: 8px;
      display: flex;
      flex-direction: column;
    }
    
    .chat-sender-name {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    
    .chat-bubble-container {
      display: flex;
      align-items: flex-end;
    }
    
    .chat-bubble-left {
      background: rgba(30, 41, 59, 0.9);
      color: #f1f5f9;
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 13px;
      padding: 8px 12px;
      border-radius: 0 12px 12px 12px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .chat-bubble-right {
      background: #0d9488;
      color: #ffffff;
      font-size: 13px;
      padding: 8px 12px;
      border-radius: 12px 0 12px 12px;
      white-space: pre-wrap;
      word-break: break-all;
      box-shadow: 0 2px 8px rgba(13, 148, 136, 0.2);
    }
    
    .chat-bubble-time {
      font-size: 9px;
      color: #64748b;
      margin: 0 6px;
      white-space: nowrap;
    }
    
    .chat-system-msg {
      align-self: center;
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.02);
      margin: 8px 0;
    }
    
    .preview-line-loading-badge {
      text-align: center;
      font-size: 11px;
      color: var(--primary-teal);
      background: rgba(14, 165, 233, 0.08);
      border: 1px dashed rgba(14, 165, 233, 0.2);
      border-radius: 8px;
      padding: 8px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>

  <!-- Sticky Header -->
  <div class="preview-header">
    <a href="/mobile" class="back-btn"><i class="bi bi-chevron-left"></i> 返回</a>
    <div class="text-center text-truncate flex-grow-1 mx-2">
      <div class="fw-bold text-truncate" style="font-size: 15px;" id="previewTitle">載入中...</div>
      <div class="text-muted" style="font-size: 10px;" id="previewStats">已載入 0 / 0 筆</div>
    </div>
    <div style="width: 60px;"></div> <!-- placeholder to center title -->
  </div>

  <!-- Scroll Body -->
  <div id="previewScrollBody" class="preview-scroll-body" onscroll="handlePreviewScroll()">
    <div id="previewLoadingSpinner" class="text-center my-auto py-5 text-secondary">
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>正在下載對話紀錄並解析中...
    </div>
    <div id="previewTextContent"></div>
  </div>

  <script>
    let previewFullMessages = [];
    let previewLoadedStartIndex = 0;
    let previewLoadedEndIndex = 0;
    let isPreviewLoadingMore = false;
    const PREVIEW_PAGE_SIZE = 100;

    function getSenderColor(name) {
      if (!name) return '#64748b';
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800', '#795548', '#0ea5e9', '#8b5cf6'];
      return colors[Math.abs(hash) % colors.length];
    }

    function escapeHtml(text) {
      if (!text) return "";
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Line log parser from Spec
    function parseLineChatLog(text, filename = "backup.txt") {
      const lines = text.split(/\\r?\\n/);
      if (lines.length === 0) return [];
      
      let maxAllowedDateObj = new Date();
      maxAllowedDateObj.setDate(maxAllowedDateObj.getDate() + 1);
      
      const exportDateRegex = /(?:儲存日期|Saved date)[：:\\s]*(\\d{4})[/\\-.年](\\d{1,2})[/\\-.月](\\d{1,2})/;
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const match = lines[i].match(exportDateRegex);
        if (match) {
          const y = match[1];
          const m = match[2].padStart(2, '0');
          const d = match[3].padStart(2, '0');
          const parsedExportDate = new Date(\`\${y}-\${m}-\${d}\`);
          if (!isNaN(parsedExportDate.getTime())) {
            maxAllowedDateObj = parsedExportDate;
            break;
          }
        }
      }

      const messages = [];
      let currentDateStr = "2020-01-01";
      let lastParsedDateObj = null;
      let isNextLineNewDate = false;
      
      const dateRegex = /^(\\d{4})[/\\-.年](\\d{1,2})[/\\-.月](\\d{1,2})(?:日)?(?:\\s*（[^）]+）|\\s*\\([^)]+\\)|\\s*星期[一二三四五六日]|\\s*[a-zA-Z]+)?\\s*$/;
      const msgRegex = /^((?:上午|下午)?\\d{2}:\\d{2})\\t([^\\t]+)\\t(.*)$/;
      
      function isValidDateHeader(y, m, d) {
        const year = parseInt(y, 10);
        if (year < 2011) return false;
        const candidateStr = \`\${y}-\${m}-\${d}\`;
        const candidateDateObj = new Date(candidateStr);
        if (isNaN(candidateDateObj.getTime())) return false;
        if (maxAllowedDateObj && candidateDateObj > maxAllowedDateObj) return false;
        if (lastParsedDateObj && candidateDateObj < lastParsedDateObj) return false;
        return true;
      }
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === "") {
          isNextLineNewDate = true;
          continue;
        }
        
        if (isNextLineNewDate) {
          const dateMatch = line.match(dateRegex);
          if (dateMatch) {
            const y = dateMatch[1];
            const m = dateMatch[2].padStart(2, '0');
            const d = dateMatch[3].padStart(2, '0');
            if (isValidDateHeader(y, m, d)) {
              currentDateStr = \`\${y}-\${m}-\${d}\`;
              lastParsedDateObj = new Date(currentDateStr);
              isNextLineNewDate = false;
              continue;
            }
          }
        }
        
        const msgMatch = line.match(msgRegex);
        if (msgMatch) {
          isNextLineNewDate = false;
          const rawTime = msgMatch[1];
          const sender = msgMatch[2];
          const content = msgMatch[3];
          
          let hourMin = rawTime;
          const isPm = rawTime.includes("下午");
          const isAm = rawTime.includes("上午");
          let cleanTime = rawTime.replace("下午", "").replace("上午", "").trim();
          const timeParts = cleanTime.split(":");
          if (timeParts.length === 2) {
            let h = parseInt(timeParts[0]);
            const m = timeParts[1];
            if (isPm && h < 12) h += 12;
            if (isAm && h === 12) h = 0;
            hourMin = \`\${String(h).padStart(2, '0')}:\${m}\`;
          }
          
          let type = "text";
          if (content === "[圖片]" || content === "[Photo]") type = "image";
          else if (content === "[貼圖]" || content === "[Sticker]") type = "sticker";
          else if (content === "[檔案]" || content === "[File]") type = "file";
          else if (content.startsWith("☎ 通話時間") || content.startsWith("☎ Call time")) type = "call";
          else if (content.includes("unsent a message") || content.includes("收回訊息")) type = "unsent";
          
          messages.push({
            date: currentDateStr,
            time: hourMin,
            sender: sender,
            content: content,
            type: type
          });
        } else {
          if (messages.length > 0 && !line.startsWith("儲存日期：")) {
            const lastMsg = messages[messages.length - 1];
            lastMsg.content += "\\n" + line;
          }
        }
      }
      return messages;
    }

    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fileId = urlParams.get('file_id');
      const chatId = urlParams.get('chat_id');
      const botAlias = urlParams.get('bot_alias');
      const displayName = urlParams.get('displayName') || '對話預覽';
      
      document.getElementById('previewTitle').innerText = displayName;
      
      if (fileId) {
        loadFilePreview(fileId, displayName);
      } else if (chatId && botAlias) {
        loadDbPreview(chatId, botAlias, displayName);
      } else {
        document.getElementById('previewLoadingSpinner').style.display = 'none';
        document.getElementById('previewTextContent').innerHTML = "<div class='text-center py-5 text-muted'>缺少有效的預覽參數</div>";
      }
    });

    async function loadFilePreview(fileId, displayName) {
      const spinner = document.getElementById('previewLoadingSpinner');
      const content = document.getElementById('previewTextContent');
      
      try {
        const res = await fetch(\`/api/dialogue-content?file_id=\${fileId}\`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        
        const parsedList = parseLineChatLog(text, displayName);
        previewFullMessages = parsedList.map(m => ({
          date: m.date,
          time: m.time,
          sender: m.sender,
          content: m.content,
          role: m.type === 'sticker' || m.type === 'image' || m.type === 'file' ? 'client' : ''
        }));
        
        spinner.style.display = "none";
        
        const total = previewFullMessages.length;
        if (total === 0) {
          content.innerHTML = "<div class='text-center py-5 text-muted'>此檔案無任何有效對話內容</div>";
          return;
        }
        
        previewLoadedStartIndex = Math.max(0, total - PREVIEW_PAGE_SIZE);
        previewLoadedEndIndex = total;
        
        renderPreviewChunk(false);
      } catch (err) {
        console.error(err);
        spinner.style.display = "none";
        content.innerHTML = \`<div class='text-center py-5 text-danger'><i class='bi bi-exclamation-triangle-fill'></i> 載入失敗: \${err.message}</div>\`;
      }
    }

    async function loadDbPreview(chatId, botAlias, displayName) {
      const spinner = document.getElementById('previewLoadingSpinner');
      const content = document.getElementById('previewTextContent');
      
      try {
        const res = await fetch(\`/api/chat-events?chat_id=\${chatId}&bot_alias=\${botAlias}\`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const resJson = await res.json();
        
        if (!resJson.ok || !resJson.data) throw new Error(resJson.error || '無對話紀錄');
        
        resJson.data.sort((a, b) => {
          const tA = a.captured_at ? new Date(a.captured_at).getTime() : 0;
          const tB = b.captured_at ? new Date(b.captured_at).getTime() : 0;
          return tA - tB;
        });
        
        previewFullMessages = resJson.data.map(ev => ({
          date: ev.captured_at ? ev.captured_at.substring(0, 10) : '未知日期',
          time: ev.captured_at ? ev.captured_at.substring(11, 16) : '00:00',
          sender: ev.sender_name || (ev.sender_role === 'host' ? '官方助手' : '使用者'),
          content: ev.text_content || \`[\${ev.message_type || '訊息'}]\`,
          role: ev.sender_role
        }));
        
        spinner.style.display = "none";
        
        const total = previewFullMessages.length;
        if (total === 0) {
          content.innerHTML = "<div class='text-center py-5 text-muted'>此對話無任何歷史紀錄</div>";
          return;
        }
        
        previewLoadedStartIndex = Math.max(0, total - PREVIEW_PAGE_SIZE);
        previewLoadedEndIndex = total;
        
        renderPreviewChunk(false);
      } catch (err) {
        console.error(err);
        spinner.style.display = "none";
        content.innerHTML = \`<div class='text-center py-5 text-danger'><i class='bi bi-exclamation-triangle-fill'></i> 載入失敗: \${err.message}</div>\`;
      }
    }

    function renderPreviewChunk(isPrepend = false) {
      const content = document.getElementById('previewTextContent');
      const stats = document.getElementById('previewStats');
      const scrollBody = document.getElementById('previewScrollBody');
      
      const chunk = previewFullMessages.slice(previewLoadedStartIndex, previewLoadedEndIndex);
      
      let html = '<div class="line-chat-container">';
      let lastDate = "";
      
      chunk.forEach(msg => {
        if (msg.date !== lastDate) {
          html += \`
            <div class="chat-date-header">
              <span class="chat-date-badge">— \${msg.date} —</span>
            </div>
          \`;
          lastDate = msg.date;
        }
        
        if (msg.content === '[圖片]' || msg.content === '[貼圖]' || msg.content === '[檔案]' || msg.content.startsWith('☎ 通話')) {
          html += \`<div class="chat-system-msg">\${msg.sender}: \${escapeHtml(msg.content)}</div>\`;
          return;
        }
        
        const isRight = (msg.role === 'host');
        if (isRight) {
          html += \`
            <div class="chat-msg-row right-msg">
              <div class="chat-msg-content-wrapper">
                <div class="chat-bubble-container">
                  <span class="chat-bubble-time">\${msg.time}</span>
                  <div class="chat-bubble-right">\${escapeHtml(msg.content)}</div>
                </div>
              </div>
            </div>
          \`;
        } else {
          const initials = msg.sender ? msg.sender.substring(0, 1) : '?';
          const avatarColor = getSenderColor(msg.sender);
          html += \`
            <div class="chat-msg-row left-msg">
              <div class="chat-avatar" style="background: \${avatarColor}">\${initials}</div>
              <div class="chat-msg-content-wrapper">
                <div class="chat-sender-name">\${msg.sender}</div>
                <div class="chat-bubble-container">
                  <div class="chat-bubble-left">\${escapeHtml(msg.content)}</div>
                  <span class="chat-bubble-time">\${msg.time}</span>
                </div>
              </div>
            </div>
          \`;
        }
      });
      html += '</div>';
      
      const total = previewFullMessages.length;
      const loadedCount = total - previewLoadedStartIndex;
      stats.innerText = \`已載入最新 \${loadedCount} / \${total} 筆 (\${((loadedCount/total)*100).toFixed(0)}%)\`;
      
      if (isPrepend) {
        const oldScrollHeight = scrollBody.scrollHeight;
        const oldScrollTop = scrollBody.scrollTop;
        
        const oldBadge = document.getElementById('loadingMoreBadge');
        if (oldBadge) oldBadge.remove();
        
        let loaderHtml = "";
        if (previewLoadedStartIndex > 0) {
          loaderHtml = \`<div id="loadingMoreBadge" class="preview-line-loading-badge"><span class="spinner-border spinner-border-sm me-1" style="width: 10px; height: 10px;" role="status"></span>往下滑動載入更早的對話...</div>\`;
        }
        
        content.innerHTML = loaderHtml + html;
        scrollBody.scrollTop = oldScrollTop + (scrollBody.scrollHeight - oldScrollHeight);
      } else {
        let loaderHtml = "";
        if (previewLoadedStartIndex > 0) {
          loaderHtml = \`<div id="loadingMoreBadge" class="preview-line-loading-badge"><span class="spinner-border spinner-border-sm me-1" style="width: 10px; height: 10px;" role="status"></span>往下滑動載入更早的對話...</div>\`;
        }
        content.innerHTML = loaderHtml + html;
        
        setTimeout(() => {
          scrollBody.scrollTop = scrollBody.scrollHeight;
        }, 50);
      }
    }

    function handlePreviewScroll() {
      const scrollBody = document.getElementById('previewScrollBody');
      
      if (scrollBody.scrollTop <= 10 && previewLoadedStartIndex > 0 && !isPreviewLoadingMore) {
        isPreviewLoadingMore = true;
        
        const badge = document.getElementById('loadingMoreBadge');
        if (badge) {
          badge.innerHTML = \`<span class="spinner-border spinner-border-sm me-1" style="width: 10px; height: 10px;" role="status"></span>正在載入歷史對話...\`;
        }
        
        setTimeout(() => {
          previewLoadedStartIndex = Math.max(0, previewLoadedStartIndex - PREVIEW_PAGE_SIZE);
          renderPreviewChunk(true);
          isPreviewLoadingMore = false;
        }, 300);
      }
    }
  </script>
</body>
</html>
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Helper: Return HTML Response
    const htmlResponse = (html) => {
      return new Response(html, {
        headers: { "content-type": "text/html;charset=UTF-8" }
      });
    };

    // Helper: Proxy request to GAS
    const proxyToGas = async (queryParams, method = "GET", bodyData = null) => {
      const gasUrl = new URL(env.GAS_WEB_APP_URL);
      // Append query parameters
      for (const [key, val] of queryParams.entries()) {
        gasUrl.searchParams.set(key, val);
      }
      // Add secure token
      gasUrl.searchParams.set("token", env.VIEWER_TOKEN);

      const fetchOptions = {
        method: method,
        headers: {
          "Accept": "application/json"
        }
      };

      if (method === "POST" && bodyData) {
        fetchOptions.headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(bodyData);
      }

      try {
        const gasResponse = await fetch(gasUrl.toString(), fetchOptions);
        const data = await gasResponse.text();
        return new Response(data, {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }
    };

    // 1. Static Routes
    if (path === "/" || path === "/index.html") {
      return htmlResponse(INDEX_HTML);
    }
    if (path === "/poc-demo" || path === "/poc-demo.html") {
      return htmlResponse(POC_DEMO_HTML);
    }
    if (path === "/mvp" || path === "/mvp.html") {
      return htmlResponse(MVP_HTML);
    }
    if (path === "/product-intro" || path === "/product-intro.html") {
      return htmlResponse(PRODUCT_INTRO_HTML);
    }
    if (path === "/product-analysis" || path === "/product-analysis.html") {
      return htmlResponse(PRODUCT_ANALYSIS_HTML);
    }
    if (path === "/line-parser-spec" || path === "/line-parser-spec.html" || path === "/docs/tutorials/line_parser_spec.html") {
      return htmlResponse(LINE_PARSER_SPEC_HTML);
    }
    if (path === "/google-sheets-access-methods" || path === "/google-sheets-access-methods.html") {
      return htmlResponse(GOOGLE_SHEETS_ACCESS_METHODS_HTML);
    }
    if (path === "/mobile" || path === "/mobile.html") {
      return htmlResponse(MOBILE_HTML);
    }
    if (path === "/mobile/preview" || path === "/mobile/preview.html") {
      return htmlResponse(MOBILE_PREVIEW_HTML);
    }

    // 2. API Proxy Routes
    if (path === "/api/chats") {
      // Fetch active chats list from GAS
      const params = new URLSearchParams();
      params.set("action", "get_chats");
      return proxyToGas(params);
    }

    if (path === "/api/chat-events") {
      // Query specific chat history log from GAS in SQL-like format
      const params = new URLSearchParams(url.search);
      params.set("action", "query");
      params.set("table", "chat_events");
      return proxyToGas(params);
    }

    if (path === "/api/dialogue-files") {
      const params = new URLSearchParams();
      params.set("action", "list_files");
      return proxyToGas(params);
    }

    if (path === "/api/dialogue-content") {
      const params = new URLSearchParams(url.search);
      params.set("action", "get_file_content");
      return proxyToGas(params);
    }

    // 3. API Upload / Save Routes
    if (path === "/api/upload" && request.method === "POST") {
      try {
        const body = await request.json();
        // Body expected: { chat_id: "...", bot_alias: "...", raw_text: "...", parsed_events: [...] }
        // Forward raw text to GAS to save in Google Drive, and parsed events to Sheets
        const params = new URLSearchParams();
        params.set("action", "upload_logs");
        return proxyToGas(params, "POST", body);
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid JSON payload" }), {
          status: 400,
          headers: { "content-type": "application/json" }
        });
      }
    }

    // 4. API Gemini Query Route
    if (path === "/api/query" && request.method === "POST") {
      try {
        const body = await request.json();
        // Body expected: { prompt: "...", chat_id: "...", start_date: "...", end_date: "..." }
        // Step 1: Fetch events from GAS for this time range
        const gasUrl = new URL(env.GAS_WEB_APP_URL);
        gasUrl.searchParams.set("action", "query");
        gasUrl.searchParams.set("table", "chat_events");
        gasUrl.searchParams.set("chat_id", body.chat_id);
        if (body.start_date) gasUrl.searchParams.set("start_date", body.start_date);
        if (body.end_date) gasUrl.searchParams.set("end_date", body.end_date);
        gasUrl.searchParams.set("token", env.VIEWER_TOKEN);

        const gasResponse = await fetch(gasUrl.toString());
        const gasJson = await gasResponse.json();

        if (!gasJson.ok) {
          return new Response(JSON.stringify({ ok: false, error: "Failed to fetch events from database" }), {
            status: 500,
            headers: { "content-type": "application/json" }
          });
        }

        // Format conversation context for Gemini
        const events = gasJson.data || [];
        let context = "";
        events.forEach(evt => {
          const roleLabel = evt.sender_role === "host" ? "[主/服務方]" : "[從/客戶]";
          context += `${evt.captured_at} ${evt.sender_name}${roleLabel}: ${evt.text_content}\n`;
        });

        // Step 2: Call Gemini API using GEMINI_API_KEY from environment vars
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`;
        const geminiPayload = {
          contents: [
            {
              parts: [
                {
                  text: `${body.prompt}\n\n以下是雙方的實際對話紀錄，請依據主從角色關係進行分析摘要：\n${context}`
                }
              ]
            }
          ]
        };

        const geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiPayload)
        });

        const geminiJson = await geminiResponse.json();
        
        // Extract text response
        let textResult = "AI 分析失敗，無法取得回應。";
        try {
          textResult = geminiJson.candidates[0].content.parts[0].text;
        } catch (e) {}

        return new Response(JSON.stringify({ ok: true, result: textResult }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }
    }

    // 4.5 Universal AI Analyze Route (supports Built-in Workers AI and custom Gemini Key)
    if (path === "/api/ai/analyze" && request.method === "POST") {
      try {
        const body = await request.json();
        const provider = body.provider || "builtin";
        const prompt = body.prompt || "";
        const customGeminiKey = body.gemini_key || "";

        if (!prompt.trim()) {
          return new Response(JSON.stringify({ ok: false, error: "Prompt context cannot be empty" }), {
            status: 400,
            headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        let aiResultText = "";

        if (provider === "builtin") {
          if (!env.AI) {
            return new Response(JSON.stringify({ ok: false, error: "Cloudflare Workers AI binding [ai] is missing in wrangler.toml!" }), {
              status: 500,
              headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
          }
          // Whitelist built-in models
          const allowedBuiltinModels = [
            "@cf/mistralai/mistral-small-3.1-24b-instruct",
            "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
            "@cf/meta/llama-3.2-3b-instruct"
          ];
          const selectedModel = allowedBuiltinModels.includes(body.model) ? body.model : "@cf/mistralai/mistral-small-3.1-24b-instruct";
          
          // Call Workers AI with selected model
          const response = await env.AI.run(selectedModel, {
            messages: [
              { role: "system", content: "You are a helpful AI assistant. Please respond in Traditional Chinese (zh-TW)." },
              { role: "user", content: prompt }
            ]
          });
          
          if (response && response.response) {
            aiResultText = response.response;
          } else {
            throw new Error("Empty response from Workers AI model");
          }
        } else if (provider === "gemini") {
          const apiKey = customGeminiKey.trim() || env.GEMINI_API_KEY;
          if (!apiKey || apiKey === "AIzaSyxxxx") {
            return new Response(JSON.stringify({ ok: false, error: "Gemini API key is not configured!" }), {
              status: 400,
              headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
          }

          // Whitelist Gemini models
          const allowedGeminiModels = [
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash",
            "gemini-3.1-flash",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite"
          ];
          const selectedModel = allowedGeminiModels.includes(body.model) ? body.model : "gemini-3.1-flash-lite";

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
          const geminiPayload = {
            contents: [
              {
                parts: [
                  { text: prompt }
                ]
              }
            ]
          };

          const geminiResponse = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload)
          });

          if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            throw new Error(`Gemini API error (Status ${geminiResponse.status}): ${errorText}`);
          }

          const geminiJson = await geminiResponse.json();
          try {
            aiResultText = geminiJson.candidates[0].content.parts[0].text;
            globalThis.geminiLastUsage = geminiJson.usageMetadata || null;
          } catch (e) {
            throw new Error("Failed to parse response content from Gemini API JSON");
          }
        } else {
          return new Response(JSON.stringify({ ok: false, error: "Unsupported AI provider: " + provider }), {
            status: 400,
            headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        const usagePayload = (provider === "gemini") ? globalThis.geminiLastUsage : null;

        return new Response(JSON.stringify({ ok: true, result: aiResultText, usage: usagePayload }), {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // 5. LINE Webhook Proxy Route (converts GAS 302 Found to direct 200 OK for LINE verification)
    if ((path === "/webhook" || path === "/api/webhook") && request.method === "POST") {
      try {
        const bodyText = await request.text();
        const signature = request.headers.get("X-Line-Signature") || "";

        // Forward to GAS Web App URL (support dynamic ?gas query parameter)
        const urlObj = new URL(request.url);
        const queryGas = urlObj.searchParams.get("gas");
        const gasUrl = queryGas ? new URL(decodeURIComponent(queryGas)) : new URL(env.GAS_WEB_APP_URL);
        
        const fetchOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Line-Signature": signature
          },
          body: bodyText,
          redirect: "follow" // Let fetch follow the 302 redirect automatically!
        };

        const gasResponse = await fetch(gasUrl.toString(), fetchOptions);
        const data = await gasResponse.text();
        
        return new Response(data, {
          status: 200, // Return a clean 200 OK back to LINE!
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }
    }

    // CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
