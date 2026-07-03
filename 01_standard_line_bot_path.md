# 01 標準 LINE Bot / Official Account 路線

## 路線定位

標準 LINE Bot / Official Account 是官方、穩定、合規的 LINE 資料入口。

它適合用在正式服務、客服流程、會員互動、表單收件、通知推播與商用場景。它無法直接讀取使用者個人帳號既有聊天內容，也需要改變使用者習慣，但只要工作流可以導到 bot，它就是最乾淨、可商用、可擴充的做法。

2026-06-18 已新增可執行 PoC：

- [poc/standard_line_bot/README.md](poc/standard_line_bot/README.md)
- [docs/tutorials/standard_line_bot_poc.md](docs/tutorials/standard_line_bot_poc.md)
- [docs/tutorials/standard_line_bot_poc.html](docs/tutorials/standard_line_bot_poc.html)

## 核心架構

```text
User / Group / LINE OA
        ↓
LINE Messaging API
        ↓
Webhook Endpoint
        ↓
Event Handler
        ↓
FALO IM Inbox
        ↓
AI Parser / Workflow
```

## LINE Messaging API / Webhook 概念

LINE Messaging API 的基本模式是：

1. 使用者與 LINE Official Account 互動。
2. LINE 平台把事件送到後端 Webhook。
3. 後端接收事件，例如文字訊息、貼圖、圖片、加入好友、加入群組。
4. 系統把事件轉為內部標準格式。
5. 後續交給 AI Parser、任務系統、知識庫或稽核模組處理。

這條路線的關鍵不是「Bot 會不會回話」，而是「Webhook 事件是否能成為可信的資料入口」。

## 群組加入 Bot 的可行性

LINE Bot 可以被加入群組或多人聊天室，但要注意幾個限制：

- Bot 通常只能接收被送到它可見範圍內的事件。
- 使用者需要主動把 Bot 加入群組。
- 群組成員應清楚知道 Bot 存在。
- 群組中的資料處理應有明確告知與同意。
- 不應假設 Bot 能讀取歷史聊天紀錄。

對 SME 場景來說，這適合用在「從今天開始把特定群組事件納入 AI Workflow」的場景。

## 使用者主動轉傳訊息到 Bot

這是較低風險、較容易教育使用者的方式。

流程可以是：

```text
使用者看到重要 LINE 訊息
        ↓
轉傳給 FALO IM Bot
        ↓
Bot 收到訊息
        ↓
系統要求使用者選分類或補充上下文
        ↓
AI 萃取任務 / 決策 / 風險 / 知識
        ↓
寫入 FALO IM Inbox
```

適合處理：

- 客戶需求。
- 老闆交辦事項。
- 會議結論。
- 專案風險。
- 需要留證的決策。

## 優點

- 官方支援，技術穩定。
- 合規性較容易說明。
- 適合正式商用與客戶服務。
- Webhook 事件格式清楚。
- 容易部署在雲端。
- 可和 CRM、客服、表單、通知系統整合。

## 限制

- 無法讀取個人帳號既有聊天內容。
- 無法回溯使用者過去的 LINE 歷史。
- 需要使用者加好友、加入群組或主動轉傳。
- 會改變既有工作習慣。
- 對「已經大量存在 LINE 桌面操作中的工作資訊」支援有限。

## 適合的第一版功能

1. 建立 Official Account。
2. 建立 Webhook 接收器。
3. 將文字訊息轉為標準 JSON event。
4. 讓使用者用指令或選單標記用途，例如 `任務`、`客戶`、`風險`、`知識`。
5. 把事件送到 FALO IM Inbox。

## 第一版 PoC 實作範圍

目前 `poc/standard_line_bot/line_bot_server.py` 已做到：

- `GET /health` 健康檢查。
- `POST /webhook` 接收 LINE webhook。
- 驗證 `X-Line-Signature`。
- 文字、圖片、影片、音訊、檔案、貼圖、位置事件標準化。
- 文字寫入 `events.jsonl`。
- 圖片/影片/音訊/檔案可透過 LINE content API 下載到 `media/`。
- 可選擇自動回覆「已收到」。
- 單元測試涵蓋簽章、文字事件、群組圖片事件與 JSONL 寫入。

## 與本專案的關係

標準 LINE Bot 是可商用的穩定入口，但不是唯一答案。

本專案應同時保留官方路線與地端觀察路線：

- 官方路線：適合新流程、新群組、新客戶互動。
- 地端觀察路線：適合研究既有 LINE Desktop 工作流如何事件化。
