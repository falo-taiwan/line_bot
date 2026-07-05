# Google Apps Script Web App 存取異常診斷與架構優化報告 (Debug Report)

本報告針對 Falo IM v2.x 系統中，Google Apps Script (GAS) 網頁應用程式在部署後，部分瀏覽器或行動端出現「無法開啟檔案 (Unable to open this file)」的權限阻擋現象進行深度技術診斷，並提出短期驗證與長期架構改善方案。

---

## 一、 已驗證之事實與現象 (Verified Facts)

經由本地探針、多端瀏覽器與開發者部署路徑比對，驗證事實如下：

1. **API 連線實質已開通**：
   * 使用不帶任何 Google 登入 Cookie 的外部探針（如 `curl` 或 backend node-fetch）對目標 URL 發送 GET 請求，能夠**順利取得完整的儀表板 HTML 程式碼**，且未觸發 Google 登入導向。
   * 這證實：**GAS 伺服器端的「任何人 (Anyone)」存取設定已生效，API 傳輸層本身無權限阻礙。**

2. **瀏覽器端「外框加載 (Iframe)」失敗**：
   * 使用實體瀏覽器（如手機、無痕視窗、或登入了多重 Google 帳號的 Chrome）點開同一個 URL 時，網頁會被 Google 攔截並顯示：**「很抱歉，目前無法開啟這個檔案。請檢查網址並再試一次。」**
   * 這證實：**阻擋並非發生在後台資料傳輸，而是瀏覽器在解析 Google 的 Web App 外框渲染時被攔截。**

3. **本機環境與線上部署專案存在偏差**：
   * 本地 `clasp` 設定檔所關聯的專案（HEAD）在推送後，其預設的開發網址會引導至 Google 帳號登入；而舊有的手動部署版本甚至會傳回 404。
   * 這證實：**本地 clasp 的同步目標，與線上實際運作且成功配置好 OAuth 權限的實體專案，存在部署標記上的不一致。**

---

## 二、 最可能之根本原因分析 (Most Likely Root Causes)

經過對 Google Apps Script 底層安全沙箱機制的追查，根本原因可歸結為以下兩大層面：

### 1. 瀏覽器 ITP 隱私機制與 Google 第三方 Cookie 衝突 (主因)
* **GAS 的沙箱架構**：GAS 網頁應用程式並非直接在 `script.google.com` 渲染，而是由 Google 建立一個雙層 iframe，將使用者的 HTML 託管在獨立的網域 `script.googleusercontent.com`。
* **第三方 Cookie 依賴**：為確保安全，Google 需要在上述兩個不同網域之間傳遞 Session Cookie 來確認執行身分。
* **瀏覽器阻擋 (ITP)**：現代 iOS Safari、Android Chrome、無痕模式、以及 LINE 內建的 WebView，預設都會開啟 **「防止跨網站追蹤 (Intelligent Tracking Prevention)」** 並 **「阻擋第三方 Cookie」**。
* **連帶後果**：當瀏覽器切斷跨網站 Cookie 時，`script.googleusercontent.com` 沙箱外框無法取得主網域的登入狀態，Google 便會直接拋出「無法開啟此檔案」的安全阻擋畫面。

### 2. Google 多重帳號登入 (Multi-Account Session) 衝突
* 當瀏覽器登入了多個 Google 帳號（如個人 Gmail 與公司 Workspace 帳號），Google 會在網址中自動插入 `/u/0/` 或 `/u/1/`。
* 如果當前活動的 Session（如 Workspace 企業帳號）後台設定了「禁止存取外部 Apps Script」的安全性原則，Google 就會直接對該 Web App 實施網域級封鎖，這在跨企業協作時極易發生。

---

## 三、 短期測試與驗證方法 (Short-Term Verification)

在不改動架構的前提下，協同開發者或客戶可透過以下方式繞過瀏覽器限制進行測試：

1. **無瀏覽器驗證 (API 測試)**：
   * 直接使用 `curl` 或是 Postman 測試 API 接口。例如：
     ```bash
     curl "https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec?action=query&token=falo_secure_token_12345&limit=1"
     ```
   * 若能回傳 JSON 數據，即代表該 Web App 運作完全正常。

2. **使用 Chrome「訪客模式 (Guest Mode)」測試網頁**：
   * 在電腦上開啟 Chrome，點選右上角頭像 ➡️ 選擇 **「訪客」**（此模式下完全不帶任何 Google 帳號快取與 Session 記憶），直接貼上網址，通常可繞過帳號衝突順利開啟。

3. **手動指定帳號索引**：
   * 將網址中的 `/s/` 前方手動插入對應擁有者帳號的 `/u/0/`，例如：
     `https://script.google.com/macros/u/0/s/[DEPLOYMENT_ID]/exec`

4. **調整 iOS Safari 設定**：
   * 在 iPhone 上進入「設定」➡️「Safari」➡️ **關閉「防止跨網站追蹤」**，即可在手機上直接點開。

---

## 四、 長期架構改造方案 (Long-Term Architecture)

為了徹底根除 Google 的 iframe 沙箱與 Cookie 限制，提供客戶 100% 穩定、無痛（無需調整任何瀏覽器設定）且具備企業級美感的前端介面，建議採用 **「前後端徹底分離」** 的長期架構：

```mermaid
sequenceDiagram
    actor User as 使用者 (瀏覽器/手機)
    participant CF_Pages as Cloudflare Pages/Worker (託管前端)
    participant GAS as Google Apps Script (純 JSON API)
    database Sheets as Google Sheets (私有資料庫)

    User->>CF_Pages: 1. 存取診斷大腦網頁 (直接加載，無 iframe)
    CF_Pages-->>User: 2. 回傳 Premium 前端網頁與 JS 邏輯
    User->>GAS: 3. 發送 API 請求 (Fetch JSON)
    Note over GAS: 僅做數據中轉與 SQL 驅動，不返回網頁
    GAS->>Sheets: 4. 讀寫私有試算表 (Execute as Me)
    Sheets-->>GAS: 5. 回傳資料
    GAS-->>User: 6. 回傳純 JSON 數據 (無網頁沙箱限制)
    Note over User: 前端 JS 解析 JSON 並渲染漂亮 UI
```

### 具體改造步驟：

1. **GAS 轉型為「純粹的 API Gateway」**：
   * 廢除 `doGet` 回傳 HTML 網頁的機制（不使用 `HtmlService`）。
   * 所有的 `doGet` 與 `doPost` 一律只接收參數，並以 `ContentService.createTextOutput` 回傳 **純 JSON 格式**。
   * **優勢**：純 JSON API 完全不涉及 `googleusercontent` 的網頁沙箱，因此 **100% 免疫** 所有第三方 Cookie 與 ITP 阻擋！

2. **前端託管移至 Cloudflare (CF Pages / CF Worker)**：
   * 將目前的 `Index.html` 儀表板面板，部署在 Cloudflare Pages 或直接由我們的 Cloudflare Worker 進行靜態網頁託管。
   * 使用者直接瀏覽 `https://your-domain.cloudflare.com/dashboard`。
   * **優勢**：
     * **載入極速**：全球 CDN 快取，免去 Google Apps Script 緩慢的冷啟動時間。
     * **體驗完美**：無外框 iframe 限制，網頁可以自由響應行動端佈局，完全不會跳出 Google 登入或權限錯誤。
     * **隱私安全**：試算表依然保持 100% 私有，外部使用者完全接觸不到 Sheet，僅透過 CF 驗證金鑰來讀取 JSON。

---

## 五、 結論與建議

本專案的 GAS 代碼邏輯與試算表配置目前已處於正確狀態。短期內為方便協作者測試，請以「**本機正常 Google 帳號點擊**」或「**curl API 檢測**」為主。

長期來看，若系統要交付給最終客戶使用，**「將網頁前端移出 GAS，改由 Cloudflare 託管，並將 GAS 限縮為純 JSON API 接口」** 是唯一能夠確保 100% 跨平台相容性與企業級資安設定的黃金標準架構。
