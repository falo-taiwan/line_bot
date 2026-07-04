# 03 FALO IM Intelligence 架構

## 架構目標

FALO IM Intelligence 的目標，是把 IM 溝通資料轉成企業可用的工作流資料。

它不是只保存聊天紀錄，而是從聊天中萃取：

- 任務：誰要做什麼、何時完成。
- 事件：發生了什麼、影響哪個專案。
- 決策：誰同意了什麼、依據是什麼。
- 風險：哪裡可能延誤、出錯或違規。
- 證據：原始訊息、時間、來源與處理紀錄。
- 知識：可重複使用的流程、問答、案例與規則。

本階段特別要驗證「非標準版」：不先要求使用者把所有訊息轉傳給 Bot，而是從使用者本機可見的 LINE Desktop 或合法匯出資料開始，轉成 AI Note 可以吸收的素材。

## 總體資料流

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

## 模組邊界

| 模組 | 責任 | 不做什麼 |
|---|---|---|
| Source Layer | 接收 LINE OA、Desktop、匯出檔等來源 | 不直接做 AI 判斷 |
| Local Capture Layer | 擷取使用者授權的本機可見資料 | 不破解、不偷 Token |
| Event Normalization | 統一事件格式與 metadata | 不決定業務結論 |
| FALO IM Inbox | 暫存、檢視、分流事件 | 不取代正式 ERP / CRM |
| AI Parser | 萃取任務、風險、決策、知識 | 不自動當成最終事實 |
| Output Adapters | 輸出到 SQLite / Markdown / HTML / AI Note / API | 不隱藏資料來源 |
| Governance Layer | 權限、留痕、覆核、風險控管 | 不放任黑箱自動化 |

## Source Layer

來源可分成三類：

1. LINE OA / Bot：官方 Webhook 事件。
2. LINE Desktop：使用者授權下的畫面觀察或 UI 事件。
3. Exported Chat：使用者主動匯出的聊天紀錄。

每個來源都要保留 `source_type` 與 `capture_method`，避免後續混淆。

## Local Capture Layer

Local Capture Layer 是本專案最重要的研究層。

它的責任是把「使用者已授權、已可見、可取得」的 LINE 資訊轉成原始事件。

可能 capture method：

- `line_messaging_api`
- `screen_ocr`
- `accessibility_api`
- `os_notification`
- `exported_chat`
- `manual_forward`
- `manual_copy_paste`

## Event Normalization

所有來源都應轉成標準事件。

初期事件 schema：

```json
{
  "event_id": "evt_20260618_000001",
  "source_type": "line_desktop",
  "capture_method": "screen_ocr",
  "conversation_id_hint": "hash_or_alias",
  "conversation_name_hint": "客戶A 專案群",
  "sender_name_hint": "王小明",
  "message_text": "明天下午前要補報價單",
  "message_time_hint": "14:32",
  "captured_at": "2026-06-18T15:00:00+08:00",
  "raw_reference": "local://captures/20260618_150000.png",
  "confidence": 0.82,
  "privacy_level": "local_authorized",
  "processing_status": "normalized"
}
```

重要欄位說明：

- `event_id`：系統內部事件 ID。
- `source_type`：資料來源類型。
- `capture_method`：資料擷取方法。
- `conversation_id_hint`：群組或對話的去識別化提示。
- `message_text`：可處理文字。
- `raw_reference`：原始來源參照，不一定保存完整圖檔。
- `confidence`：OCR 或解析信心分數。
- `privacy_level`：授權與敏感度標記。

## FALO IM Inbox

FALO IM Inbox 是事件進入 AI 前的緩衝區。

功能：

- 顯示新事件。
- 合併重複事件。
- 標記事件分類。
- 補充上下文。
- 決定是否送 AI Parser。
- 保留處理紀錄。

對非工程使用者來說，可以把它理解成「LINE 工作資訊的收件匣」。

## AI Parser

AI Parser 的任務是把訊息轉成結構化結果。

輸入：

```text
一段或多段 IM event
```

輸出：

```json
{
  "summary": "客戶A報價單需於明天下午前補齊",
  "action_items": [
    {
      "task": "補齊報價單",
      "owner": "待確認",
      "due_date": "2026-06-19 下午",
      "confidence": 0.74
    }
  ],
  "risks": [
    {
      "risk": "若未準時補件，可能影響客戶確認進度",
      "severity": "medium"
    }
  ],
  "decisions": [],
  "knowledge_candidates": [],
  "needs_human_review": true
}
```

## Output Adapters

初期可先支援：

- SQLite：本機查詢與 PoC 儲存。
- Markdown：教學、交接與人工覆核。
- HTML Dashboard：展示事件與萃取結果。
- AI Note-ready Markdown：提供 NotebookLM 或其他 AI Note 工具 ingest。
- JSONL：保留事件流，方便其他 AI 或工具接手。

未來可再接：

- CRM。
- PM 工具。
- KM 系統。
- Audit evidence repository。
- FALO / TAAT 相關治理模組。

## AI Note Integration Layer

AI Note Integration Layer 的任務，是把 IM event 與 AI Parser 結果整理成「可讀、可查、可引用」的筆記素材。

它不是單純把聊天紀錄貼進筆記，而是要保留結構：

- 原始事件摘要。
- 任務與待辦。
- 決策與理由。
- 風險與待確認事項。
- 來源 event_id。
- 擷取方法與時間。
- 人工覆核狀態。

建議第一版輸出格式：

```text
notes/
  2026-06-18-line-im-daily-note.md
  2026-06-18-action-items.md
  2026-06-18-risk-and-decisions.md
```

AI Note-ready Markdown 應避免直接堆大量原始聊天，而是用「來源可追溯的整理稿」讓 NotebookLM 或其他 AI Note 工具更容易理解。

## 人工覆核節點

AI Parser 不應直接把所有結果當成事實。

建議設計三種狀態：

- `draft`：AI 初步判斷。
- `reviewed`：人工確認。
- `rejected`：人工判定不採用。

特別需要人工覆核的內容：

- 責任歸屬。
- 截止日期。
- 客戶承諾。
- 金額。
- 法務或稽核證據。
- 可能影響人事或績效的判斷。

## MVP 架構

第一階段最小可行版本：

```text
LINE Desktop 指定區域截圖
        ↓
OCR
        ↓
JSONL event
        ↓
AI Parser
        ↓
SQLite + Markdown summary
        ↓
HTML dashboard + AI Note-ready Markdown
```

成功條件：

- 能從可見 LINE 訊息建立事件。
- 能避免大量重複事件。
- 能萃取 action item / owner / due date / risk。
- 能輸出可教學、可展示、可覆核、可進 AI Note 的結果。
