# Falo LINE 對話解析規格與開發指南 (v2.x 核心策略)

本指南旨在確立 Falo IM Intelligence v2.x 系統中對「LINE 歷史對話紀錄 (.txt 匯出檔)」之解析規格。

本專案已對開源社群中兩個最成熟的解析套件進行了最新原始碼備份：
1. **`chonyy/line-message-analyzer` (JavaScript/React)**: 台灣開發者社群中最熱門的瀏覽器端對話分析器。
2. **`jyu0414/linelog2py` (Python)**: 專門將 LINE 日誌轉為 Python 結構化物件的開源庫。

---

## 1. Falo 核心策略：SQL 作為資料交換網關

在 v2.x 中，我們的核心策略是 **「SQL 僅作為資料交換 Gateway 抽象概念，而非綁定實體 DB」**。

* **解耦架構**：解析層（不論是用地端 Python 還是 Cloudflare 前端 JS）讀取 `.txt` 檔案後，**一律只輸出符合 SQL 欄位的標準 JSON 物件陣列**。
* **標準對應**：輸出格式必須 100% 契合我們設計的 `chat_events` 表格 Schema（包含 `id`, `captured_at`, `sender_name`, `sender_role` 等）。
* **AI 與儲存的橋樑**：透過 SQL 化資料格式，AI Agent 可以透過標準協議自由查詢，且未來底層儲存從 Google Sheets 升級到 SQLite / Cloudflare D1 時，解析與 UI 層代碼完全不需更動。

---

## 2. 兩大套件之共通性解析規則 (Upstream Design Rules)

經剖析這兩個套件，提煉出以下四個核心解析原則，這也是我們開發 Falo 解析器時的基礎規則：

### A. 日期狀態機 (Date State Tracker)
* **規則**：LINE 匯出檔中，日期通常是獨立一行的標頭（如 `2026/06/25 (Mon)` 或 `2026年6月25日 星期一`），而每一條對話僅標示時間（如 `10:30`）。
* **實作**：解析器必須維持一個 `current_date` 狀態變數。當遇到空行後的下一個日期標頭時，更新該變數。

### B. 分割定界符與時間 Token (Row Splitting)
* **規則**：對話列預設採用 Tab 字元 (`\t`) 進行分割。
* **判定**：若一行能被分割，且首個元素完全符合時間正則 `^\d{2}:\d{2}$`，則將其判定為「新對話的起點」。
* **結構**：
  * `splitted[0]` = 時間 (Time)
  * `splitted[1]` = 發言者姓名 (Sender Name)
  * `splitted[2:]` = 訊息內容 (Text Content)

### C. 多行累加緩衝區 (Multi-line Accumulator)
* **規則**：當使用者在 LINE 中按下 Shift+Enter 換行發訊，導出的文字檔會直接換行。這些換行行**不帶有時間與人名標頭**。
* **實作**：若某一行不符合「新對話起點」的判定條件，解析器必須將該行文字作為 `\n` 連接字串，**直接追加累加到上一則訊息物件的內容末端**。

### D. 特殊事件分類 (Message Categorization)
* 對話內容如果是系統行為或媒體上傳，LINE 會以特殊的括號或特徵標示。解析器應將其轉譯為標準 `message_type`：
  * `[圖片]` / `[Photo]` ➡️ `image`
  * `[貼圖]` / `[Sticker]` ➡️ `sticker`
  * `[檔案]` / `[File]` ➡️ `file`
  * `☎ 通話時間` / `Call time` ➡️ `call_event`
  * `收回訊息` / `unsent a message` ➡️ `unsent_event`

---

## 3. Falo 統一解析算法藍圖

以下為 Falo JS/Python 解析器之核心處理邏輯演算法：

```text
1. 讀取對話文字檔，按行分割
2. 跳過前兩行標頭 (匯出群組名稱與時間)
3. 初始化 date_string = "2020/01/01", is_new_date_flag = false
4. 宣告 messages = [] 空陣列
5. 迴圈處理每一行：
   A. 若此行為空行 ➡️ 標記 is_new_date_flag = true，進入下一行
   B. 若 is_new_date_flag 為真 且 此行符合日期正則 ➡️
      * 提取 date_string = 此行前10個字
      * 重設 is_new_date_flag = false，進入下一行
   C. 若此行符合新對話判定 (定界符分割且首個元素為 hh:mm) ➡️
      * 建立新對話物件：時間戳 = date_string + 元素[0]
      * 姓名 = 元素[1], 內容 = 元素[2:]
      * message_type = 依內容特徵進行分類檢索
      * 寫入 messages 陣列
   D. 否則 (不符合判定) ➡️
      * 取得 messages 陣列的最後一個物件
      * 將此行內容追加至最後物件的文字末端 (支援多行文字)
6. 回傳整個 messages 陣列 (SQL JSON 格式)
```

---

## 4. 備份專案說明

* 備份檔案路徑：
  * **LINE Message Analyzer (JS)**: `backup/parsers/line-message-analyzer.zip`
  * **Linelog2py (Python)**: `backup/parsers/linelog2py.zip`
* 當上游專案因 LINE 改版而更新解析正則表達式時，我們可以直接參考其最新的代碼修改，進行 Falo 的無痛熱修復。
