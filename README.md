# FALO IM / LINE Lab

本專案是「LINE & IM AI 運用」的初始研究骨架。

它不是單純做 LINE Bot，也不是嘗試破解 LINE。核心目標是研究：在台灣中小企業高度依賴 LINE 溝通、但 ERP / CRM / PM / KM 系統不完整的情境下，如何把即時通訊資料轉成可治理、可追溯、可審計的 AI 工作流入口。

## 一句話定位

FALO IM / LINE Lab 是一個「授權地端觀察 + 事件化 + AI 萃取」研究專案，用來把 LINE 溝通轉成任務、知識、專案、稽核與客戶互動線索。

## 本階段刻意測試非標準版

本階段不是要先做最標準的 LINE Bot，而是刻意測試「非標準但授權」的地端路線。

原因是：Force 想驗證 LINE 這類 IM 討論能不能進一步整合到 AI Note / NotebookLM 類工作流，成為可整理、可回讀、可教學、可追溯的知識素材。

因此本階段的核心假設是：

```text
LINE Desktop 可見訊息
        ↓
授權地端觀察
        ↓
事件化 JSON
        ↓
AI 萃取任務 / 決策 / 風險 / 知識
        ↓
AI Note / Markdown / Dashboard
```

標準 LINE Bot 路線仍保留為合規與商用參考。2026-06-18 起，已新增獨立標準版 PoC，和 OCR 路線並行驗證。

## 為什麼不是只做 LINE Bot

標準 LINE Bot / Official Account 是官方、穩定、合規的做法，適合正式商用服務。

但 SME 的真實問題常常是：

- 工作討論已經散落在既有 LINE 個人帳號、群組與桌面操作流程中。
- 使用者不一定願意改成「全部都丟給 Bot」。
- 老闆、會計、業務、PM、現場人員常用 LINE 當臨時 ERP。
- 真正有價值的是「討論中的任務、決策、風險與證據」，不只是聊天文字本身。

因此本階段先研究三條資料進入路線：

| 路線 | 角色 | 優先度 | 說明 |
|---|---|---:|---|
| OCR / 畫面辨識 | 非標準授權地端觀察 | 高 | 從使用者本機畫面觀察 LINE Desktop 狀態，先做 PoC |
| 本機合法資料來源 | 非標準授權事件來源研究 | 高 | 研究匯出、通知、Accessibility、檔案監看等合法來源 |
| 標準 LINE Bot / OA | 官方入口 | 中 | 穩定、合規、適合商用，但不是本階段主軸 |

## 系統總圖

```text
LINE Desktop / LINE OA / Exported Chat
        ↓
Local Capture Layer
        ↓
Event Normalization
        ↓
FALO IM Inbox
        ↓
AI Parser
        ↓
AI Note / Task / KM / PM / Audit / CRM
```

## 初期交付範圍

本版只建立規劃文件與 PoC 目錄，不急著寫大量程式。

重點是先讓後續的 aaa 或其他 AI 可以接手深化：

1. 知道三條路線各自解決什麼問題。
2. 知道安全、法遵與治理邊界在哪裡。
3. 知道第一輪 PoC 應該先做什麼。
4. 知道事件資料應該如何標準化。

## 文件導覽

- [01_standard_line_bot_path.md](01_standard_line_bot_path.md)：標準 LINE Bot / Official Account 路線。
- [02a_local_line_ocr_path.md](02a_local_line_ocr_path.md)：授權地端 OCR / 畫面辨識路線。
- [02b_local_line_underlayer_path.md](02b_local_line_underlayer_path.md)：合法本機事件來源與底層資料研究路線。
- [03_falo_im_architecture.md](03_falo_im_architecture.md)：FALO IM Intelligence 總架構。
- [04_risk_and_governance.md](04_risk_and_governance.md)：風險、治理、法遵與稽核邊界。
- [05_poc_backlog.md](05_poc_backlog.md)：第一階段 PoC backlog。

## 目前 PoC 狀態

| PoC | 狀態 | 說明 |
|---|---|---|
| [OCR Capture](poc/ocr_capture/README.md) | 已建立 | 授權地端觀察 LINE Desktop 指定畫面區域 |
| [Standard LINE Bot](poc/standard_line_bot/README.md) | 已建立 | 標準 LINE Official Account / Messaging API webhook |

標準 LINE Bot 教材：

- [standard_line_bot_poc.md](docs/tutorials/standard_line_bot_poc.md)
- [standard_line_bot_poc.html](docs/tutorials/standard_line_bot_poc.html)

## 🚀 Falo IM v3.04 進階行動控制台功能發佈

本專案於 `v3.01` ~ `v3.04` 開發階段解鎖了針對手機端與 LINE 內建瀏覽器 (WebView) 的一系列優化：

1. **💬 模擬 LINE 對話泡泡預覽 (Standalone Preview - `/mobile/preview`)**：
   * 獨立的網頁路由設計，徹底解決 LINE WebView 內操作複雜彈窗容易卡死或退出頁面的痛點。
   * 自動將「官方即時對話」與「已上傳備份檔案」解析並渲染為擬真聊天泡泡（左側顯示首字彩色隨機背景頭像與名字；官方助手發言置右並呈現綠色氣泡）。
   * 開啟時自動定位至底部最新對話，往上滑動時無縫延遲載入歷史資料，且視角保持穩定無跳動。
2. **📁 清爽的折疊式面板**：
   * 官方對話即時清單與備份檔案清單預設折疊，大幅節省手機小螢幕版面空間，並加速初始載入效率。
3. **🔍 報告獨立字體縮放**：
   * 報告區右上角新增 `A-` / `A+` 縮放按鈕，僅單獨微調 AI 報告文字字級並自動儲存設定至瀏覽器，不影響控制台其餘介面。
4. **📄 高保真 PDF 匯出**：
   * 支援一鍵呼叫手機原生 PDF 列印，系統內建 `@media print` 樣式，列印時自動剔除主控台選項，僅保留乾淨且排版精美的 Markdown 分析報告本體。
5. **👆 卡片式觸控反饋**：
   * 優化手機點選反饋，點選卡片任意處即可勾選，且選取卡片背景呈現亮色漸層與天空藍外框；獨立預覽按鈕進行 `event.stopPropagation()` 處理，徹底消除觸控事件衝突。
6. **🚫 初始預設「全空」**：
   * 進入頁面時預設不勾選任何對話來源，以符合決策者「只關注特定對話或備份」的實際應用情境。

## 建議目錄結構

```text
falo-im-line-lab/
  README.md
  01_standard_line_bot_path.md
  02a_local_line_ocr_path.md
  02b_local_line_underlayer_path.md
  03_falo_im_architecture.md
  04_risk_and_governance.md
  05_poc_backlog.md
  poc/
    ocr_capture/
    standard_line_bot/
    event_stream/
    ai_parser/
  docs/
    diagrams/
    notes/
    tutorials/
```

## 第一階段 PoC 順序

1. OCR 讀取 LINE Desktop 指定區域。
2. 偵測新訊息事件。
3. 將訊息轉成 JSON event。
4. AI 萃取 action item / owner / due date / risk。
5. 輸出到 SQLite / Markdown / HTML dashboard / AI Note-ready notes。

## 非目標

本專案初期不做以下事項：

- 不破解 LINE。
- 不讀取未授權帳號資料。
- 不竊取 Token、Cookie、Session。
- 不繞過加密或存取控制。
- 不把本機觀察 Agent 包裝成監控員工工具。
- 不在未取得同意的情境下收集聊天內容。

## 成功標準

初期成功不是「做出完整產品」，而是：

- 能把一段 LINE 溝通安全地轉為事件資料。
- 能把事件資料萃取成任務、風險、決策或知識。
- 能輸出適合 AI Note / NotebookLM ingestion 的 Markdown 筆記。
- 能留下原始來源、處理時間與信心分數。
- 能讓非工程背景使用者理解系統如何運作。
- 能清楚說明哪些資料可以用、哪些資料不能碰。
