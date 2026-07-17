# Falo IM / LINE Lab 本地端 (NB) 執行與開發指南

本說明書協助您將此專案解壓至您的筆記型電腦 (Notebook) 後，在本地環境快速啟動、偵錯與開發。

---

## 🏗️ 方案一：使用 Cloudflare Wrangler 本地模擬執行 (推薦 🌟)

Cloudflare Workers 支援完整的本地端開發模擬（Wrangler Dev）。您可以在完全不修改雲端代碼的前提下，在筆電上模擬執行與測試所有 API 代理路由與 HTML 控制台。

### 步驟 1：安裝 Node.js 與 Wrangler
確保您的筆電已安裝 [Node.js](https://nodejs.org/)。接著在終端機中，切換至 `cf_worker` 目錄並安裝相依套件：
```bash
cd cf_worker
npm install
```

### 步驟 2：修改本地環境變數 (選用)
您可以打開 `cf_worker/wrangler.toml`，在 `[vars]` 區塊下配置您要本地測試的環境變數：
- `GAS_WEB_APP_URL`：主要 Google Sheets 網關網址。
- `GEMINI_API_KEY`：Google Gemini API 密鑰。
- `VIEWER_TOKEN`：本地安全存取權杖。

### 步驟 3：編譯並打包 HTML 模板
專案中的靜態網頁（如 `mobile.html`、`mvp.html` 等）是透過 Python 編譯指令嵌入 Worker 的。每次您修改了 HTML 檔案後，請在 `cf_worker` 目錄下執行以下指令進行編譯：
```bash
python3 build.py
```
*(此指令會自動將根目錄下的 `.html` 檔案讀取、轉義並寫入至 `cf_worker/src/index.js` 中。)*

### 步驟 4：啟動 Wrangler 本地開發伺服器
在 `cf_worker` 目錄下執行：
```bash
npx wrangler dev
```
啟動後，控制台會顯示本地連結（通常為 `http://localhost:8787`）。您可以在筆電瀏覽器中開啟：
- 📱 手機控制台：`http://localhost:8787/mobile`
- 💬 LINE 泡泡對話預覽：`http://localhost:8787/mobile/preview`
- 💻 電腦版控制台：`http://localhost:8787/mvp`
- 💡 方案介紹說明頁：`http://localhost:8787/product-intro`

---

## 🐍 方案二：啟動 Python Flask 本地後台

如果您需要測試地端同步或本地 OCR/分析，可以啟動根目錄下的 Python 伺服器。

### 步驟 1：安裝 Python 依賴
在專案根目錄下，使用 pip 安裝 Flask 等相依套件：
```bash
pip install flask requests
```

### 步驟 2：執行 Flask 伺服器
執行以下指令：
```bash
python3 app.py
```
預設會於 `http://localhost:5000` 啟動本地 Python Web 服務。

---

## 🌐 方案三：純靜態網頁展示

如果您只想檢查或展示 HTML 介面與排版（不包含與後台對接的動態 API）：
1. 確保您的筆電裝有 Python 3。
2. 在專案**根目錄**下執行：
   ```bash
   python3 -m http.server 8080
   ```
3. 在瀏覽器打開 `http://localhost:8080`，即可直接瀏覽所有的 `.html` 網頁檔。

---

## 🛠️ 常見問題與偵錯 (Troubleshooting)

1. **API 跨網域錯誤 (CORS)**：
   在本地 localhost 測試時，若向雲端 `/api/...` 發送請求可能遇到跨網域問題。建議一律透過 `npx wrangler dev`（方案一）啟動，因為 Worker 內部已整合了 API 代理網關，能自動解決 CORS 限制。
2. **HTML 修改沒有生效**：
   請記得在修改任何 HTML 檔案後，**重新執行 `python3 build.py`** 重新編譯 Worker 代碼，否則 Worker 模擬器將繼續讀取舊版的網頁。
