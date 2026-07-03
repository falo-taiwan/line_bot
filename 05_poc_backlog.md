# 05 PoC Backlog

## Backlog 目的

本文件把 FALO IM / LINE Lab 的第一階段工作拆成可執行的小任務。

原則是先做最小可行版本，證明「LINE 可見訊息 → 事件 → AI 萃取 → 可覆核輸出」這條鏈路成立。

本階段會刻意優先測試非標準版，也就是授權地端觀察與本機事件化。2026-06-18 起，標準 LINE Bot 也新增為獨立 PoC 線，方便比較「官方入口」與「地端觀察」兩種資料進入方式。

## PoC 優先順序總覽

1. OCR 讀取 LINE Desktop 指定區域。
2. 偵測新訊息事件。
3. 將訊息轉成 JSON event。
4. AI 萃取 action item / owner / due date / risk。
5. 輸出到 SQLite / Markdown / HTML dashboard / AI Note-ready Markdown。
6. 標準 LINE Bot webhook 接收文字與媒體事件。

## P0：專案基礎

### P0-1 建立資料夾與設定

目標：

- 建立 `poc/ocr_capture/`。
- 建立 `poc/event_stream/`。
- 建立 `poc/ai_parser/`。
- 建立 `docs/notes/` 保存研究紀錄。

完成標準：

- 新 AI 接手時可以看 README 知道要從哪裡開始。

### P0-2 建立事件 schema 草案

目標：

- 定義 `event_id`、`source_type`、`capture_method`、`message_text` 等欄位。
- 確認哪些欄位是必要、哪些是選填。

完成標準：

- 至少有 3 筆 sample JSON event。

## P1：OCR Capture PoC

### P1-1 手動指定截圖區域

目標：

- 使用者手動輸入或設定一個畫面區域。
- 程式擷取該區域圖片。

完成標準：

- 能在 Windows 或 macOS 任一平台保存截圖。
- 截圖只包含使用者指定區域。

### P1-2 OCR 辨識文字

目標：

- 對截圖做 OCR。
- 取得最近幾則可見訊息文字。

完成標準：

- 能輸出純文字結果。
- 能記錄 OCR 信心分數或簡易品質標記。

### P1-3 LINE 視窗偵測

目標：

- 偵測 LINE Desktop 是否開啟。
- 取得視窗位置，減少手動調整。

完成標準：

- 找不到 LINE 時顯示清楚訊息。
- 找到 LINE 時可顯示視窗座標。

## P1B：Standard LINE Bot PoC

### P1B-1 建立 webhook receiver

目標：

- 建立 `poc/standard_line_bot/`。
- 接收 LINE Messaging API webhook。
- 驗證 `X-Line-Signature`。

完成標準：

- `GET /health` 可回應。
- `POST /webhook` 可接收事件。
- 本機假資料可寫入 `events.jsonl`。

狀態：

- 已完成第一版：`poc/standard_line_bot/line_bot_server.py`。

### P1B-2 文字與媒體事件標準化

目標：

- 將文字、圖片、影片、音訊、檔案、貼圖、位置轉成內部 event。
- 文字直接保存。
- 媒體保存 message ID 與 metadata。

完成標準：

- 文字事件可分類為 `message_text`、`task_candidate`、`risk_candidate`、`knowledge_candidate`。
- 圖片/影片/音訊/檔案可保存為 `message_image` 等事件。

狀態：

- 已完成第一版。

### P1B-3 下載 LINE 媒體內容

目標：

- 使用 Channel access token 依 message ID 下載圖片、影片、音訊或檔案。
- 保存到本機 `media/`。

完成標準：

- 媒體檔案保存本機路徑、content type、size、sha256。

狀態：

- 已完成第一版，需接真實 LINE webhook 驗證。

### P1B-4 教材化

目標：

- 把標準 LINE Bot 操作步驟整理成 Markdown 與 HTML。

完成標準：

- 有工程 README。
- 有教學 Markdown。
- 有可展示 HTML。

狀態：

- 已完成第一版：`docs/tutorials/standard_line_bot_poc.md` 與 `docs/tutorials/standard_line_bot_poc.html`。

## P2：Event Stream PoC

### P2-1 文字正規化

目標：

- 去除 OCR 多餘空白。
- 合併破碎行。
- 保留原始 OCR 文字與正規化文字。

完成標準：

- 同一段訊息可以產生穩定文字。

### P2-2 新訊息偵測

目標：

- 使用圖片 hash 或文字 hash 判斷是否有新內容。
- 避免同一畫面一直重複輸出。

完成標準：

- 同一則訊息最多只產生一次主要 event。

### P2-3 JSONL event 輸出

目標：

- 將訊息轉成 JSON event。
- 每行一筆事件，方便串接後續工具。

完成標準：

- 產生 `events.jsonl`。
- 每筆事件都有時間、來源、訊息文字與信心標記。

## P3：AI Parser PoC

### P3-1 Action Item 萃取

目標：

- 從訊息中萃取任務。
- 嘗試辨識 owner、due date、priority。

完成標準：

- 輸出 `action_items` 陣列。
- 不確定時標記 `needs_human_review: true`。

### P3-2 風險與決策萃取

目標：

- 判斷訊息是否包含風險、延誤、承諾或決策。

完成標準：

- 輸出 `risks` 與 `decisions`。
- 每個結果保留來源 event_id。

### P3-3 人工覆核欄位

目標：

- 讓 AI 結果可以被人工確認、拒絕或修改。

完成標準：

- 每筆萃取結果有 `status: draft / reviewed / rejected`。

## P4：Storage and Dashboard PoC

### P4-1 SQLite 儲存

目標：

- 建立 events、ai_extractions、review_logs 三張表。

完成標準：

- 可查詢某時間區間的事件與萃取結果。

### P4-2 Markdown 報告

目標：

- 產生每日 IM 工作摘要。

完成標準：

- Markdown 包含今日任務、風險、決策、待確認事項。

### P4-3 HTML Dashboard

目標：

- 以瀏覽器查看事件與 AI 萃取結果。

完成標準：

- 可看到事件列表。
- 可看到 action item / owner / due date / risk。
- 可標示哪些需要人工覆核。

## P5：AI Note Integration PoC

### P5-1 Daily AI Note Markdown

目標：

- 將一天的 IM event 與 AI extraction 整理成一份 AI Note-ready Markdown。
- 格式適合貼入或匯入 NotebookLM / AI Note 工具。

完成標準：

- 產生 `notes/YYYY-MM-DD-line-im-daily-note.md`。
- 內容包含摘要、任務、風險、決策、待確認事項。
- 每個重點保留來源 event_id。

### P5-2 Topic Notes

目標：

- 依主題產生筆記，例如客戶、專案、稽核、課程素材。

完成標準：

- 可從事件中整理出至少一份 topic note。
- 每份 topic note 有來源、時間、狀態與人工覆核欄位。

### P5-3 AI Note Handoff Package

目標：

- 把 JSONL、Markdown summary、topic notes 打包成可交給其他 AI 或 NotebookLM 使用的資料包。

完成標準：

- 產生一個 handoff 資料夾。
- 包含 `events.jsonl`、`daily-note.md`、`action-items.md`、`risk-and-decisions.md`。
- README 說明這包資料如何被 AI Note 使用。

## 建議 sample event

```json
{
  "event_id": "evt_20260618_000001",
  "source_type": "line_desktop",
  "capture_method": "screen_ocr",
  "conversation_name_hint": "客戶A 專案群",
  "sender_name_hint": "王小明",
  "message_text": "明天下午前要補報價單",
  "message_time_hint": "14:32",
  "captured_at": "2026-06-18T15:00:00+08:00",
  "confidence": 0.82,
  "privacy_level": "local_authorized"
}
```

## 建議 sample AI extraction

```json
{
  "event_id": "evt_20260618_000001",
  "summary": "客戶A報價單需於明天下午前補齊",
  "action_items": [
    {
      "task": "補齊報價單",
      "owner": "待確認",
      "due_date": "2026-06-19 下午",
      "confidence": 0.74,
      "status": "draft"
    }
  ],
  "risks": [
    {
      "risk": "若未準時補件，可能影響客戶確認進度",
      "severity": "medium",
      "status": "draft"
    }
  ],
  "decisions": [],
  "needs_human_review": true
}
```

## 建議交接給 aaa 的任務

第一輪可交給 aaa 深化：

1. 先完成 `poc/ocr_capture` 的平台選型。
2. 建立一個最小 OCR 截圖 demo。
3. 固定 JSON event schema。
4. 用 5 到 10 筆手動 sample event 測 AI Parser。
5. 產生第一版 Markdown / HTML dashboard。
6. 產生第一版 AI Note-ready Markdown，驗證是否適合 NotebookLM 類工具吸收。

## 暫不做事項

- 不做完整產品 UI。
- 不做雲端同步。
- 不做企業權限系統。
- 不做 LINE 私有資料解析。
- 不做未授權自動化。
