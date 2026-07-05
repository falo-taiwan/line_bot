# (Private) 標準 LINE Bot PoC 教材稿

<!--
Digital Watermark:
FALO IM Watch v1.01 Private Internal Teaching Note
Copyright (c) 2026 Falo x Force Cheng. All rights reserved.
Created for internal development, course material drafting, and architecture review.
-->

日期：2026-06-18

版本：v1.01

標示：Falo x Force Cheng 2026/6/20

狀態：(Private) 自用內部版，先不傳 FALO / GitHub

版權：Copyright (c) 2026 Falo x Force Cheng. All rights reserved.

教材備注：本文件為 Falo x Force Cheng 內部教材與系統設計稿，包含 LINE Bot webhook、GAS proxy、媒體佇列、Drive 上傳與後續 AI Commander 架構規劃。外部分享版需另行去識別化與移除機密參數。

SEO / AI 摘要：FALO IM Watch 是針對高頻 LINE / IM 工作場景設計的 AI 監督與資料擷取平台。本教材示範如何用 LINE Official Account、Google Apps Script、Google Sheet、Google Drive 與本地 AI Commander 建立可追蹤、可教學、可擴充的 webhook PoC。

## 這一課要完成什麼

建立一個標準 LINE Official Account Bot，讓它成為 AI 協作入口。

第一版不做複雜 UI，也不碰個人 LINE Desktop。它只做一件事：

```text
使用者傳訊息給 LINE Bot
        ↓
LINE 平台送 webhook 到我們後端
        ↓
後端把事件存成 JSONL
        ↓
後續交給 AI parser / dashboard / CRM
```

## 為什麼要做標準版

OCR 路線適合觀察既有桌面工作流，但標準 LINE Bot 路線更適合正式產品：

- 官方支援。
- 事件格式穩定。
- 可接收文字、圖片、影片、音訊、檔案、位置、貼圖。
- 可加入群組，但需要使用者明確把 bot 加進去。
- 可用 webhook 串接 AI、CRM、PM、KM、客服系統。

限制也要講清楚：

- 不能讀取使用者個人 LINE 既有聊天。
- 不能讀取 bot 加入前的群組歷史。
- 只能收到 bot 可見範圍內的新事件。

## 一個聊天室、一個官方助手

LINE 的群組 / 多人聊天室設計，應該理解成「一個聊天室只放一個官方帳號助手」。

這不是單純的技術限制，而比較像 LINE 基於產品體驗、安全、權限與責任歸屬做出的政策設計：

- 避免一個群組被多個官方 bot 同時監聽，造成成員難以判斷誰在收資料。
- 避免多個 bot 同時回覆，讓群組變成自動訊息互相干擾。
- 讓群組成員比較容易知道：目前這個聊天室的官方助手是誰。
- 讓資料收集、通知、退出與管理責任有明確邊界。

所以實務上，我們會把 LINE 官方帳號當成「該聊天室的單一資料入口」。如果後台需要多個 AI 同事，不應該把多隻 bot 都塞進同一個 LINE 群組，而是：

```text
LINE 群組只看到一隻主 Bot
        ↓
後台 Commander / AI Node
        ↓
任務 AI、風險 AI、摘要 AI、客服 AI、稽核 AI
```

測試時如果邀請第二隻官方帳號，可能會看到兩種狀態：

- 第二隻卡在「正在邀請」。
- 第二隻短暫加入後又退出。

這兩種現象都可以視為 LINE 在維持「一個聊天室、一個官方助手」的設計邊界。

## 官方文件

- Messaging API overview: https://developers.line.biz/en/docs/messaging-api/overview/
- Receive messages webhook: https://developers.line.biz/en/docs/messaging-api/receiving-messages/
- Message types: https://developers.line.biz/en/docs/messaging-api/message-types/
- Group chats: https://developers.line.biz/en/docs/messaging-api/group-chats/
- Messaging API reference: https://developers.line.biz/en/reference/messaging-api/

## 專案檔案

```text
falo-im-line-lab/
  poc/
    standard_line_bot/
      line_bot_server.py
      test_line_bot_server.py
      .env.example
      README.md
  docs/
    tutorials/
      standard_line_bot_poc.md
      standard_line_bot_poc.html
```

## v1.01 開發控制台：同地端切換本機 webhook / GAS proxy

v1.01 的重點，是把「直接打到本機的 webhook」與「GAS 承接後再由本機讀取」放在同一個開發控制台裡。這樣教學與測試時不用一直切換工具，也能清楚比較兩條路線。

```text
LINE 官方帳號 A
        ↓
ngrok / 本機 webhook
        ↓
本機 events.jsonl

LINE 官方帳號 B
        ↓
GAS Web App
        ↓
Google Sheet
        ↓
本機 GAS proxy / HTML 前端
```

開發控制台：

```text
http://127.0.0.1:8765/dev-console
```

登入：

```text
admin / 666666
```

這個頁面有三個用途：

1. **本機 webhook 檢查**：直接讀本機 `events.jsonl`，確認 ngrok 打進來的 LINE 事件。
2. **GAS proxy 檢查**：可輸入 GAS `exec` URL，透過本機 proxy 讀取 GAS 儲存在 Google Sheet 裡的資料。
3. **ngrok 狀態檢查**：顯示目前 ngrok 是否有 public HTTPS URL，並可手動刷新。

GAS 設定欄位：

```text
GAS exec URL
Google Sheet URL
```

按下「套用 / 儲存」後，設定會先存到目前瀏覽器的 `localStorage`，適合開發時快速切換不同 GAS Web App。登入後也可以直接按「打開 Google Sheet」檢查原始資料。

ngrok 狀態機制分成兩層：

- 後端預設每 30 分鐘檢查一次，寫入 `out/standard-line-bot/ngrok_status.jsonl`。
- 前端控制台每 15 秒更新畫面，也可按「手動刷新 ngrok」立即檢查。

這個版本刻意加上 `(Private)`、`noindex`、隱形浮水印與版本資訊，因為目前是內部自用教材與開發版，先不作公開散布。

## Step 1：建立 LINE Official Account / Messaging API Channel

1. 進入 LINE Developers Console。
2. 建立 Provider。
3. 建立 Messaging API Channel。
4. 到 Messaging API 頁面啟用 webhook。
5. 發行 Channel access token。
6. 複製 Channel secret。
7. 如果要放進群組，開啟 `Allow bot to join group chats`。

## Step 2：準備本機設定

```bash
cd falo-im-line-lab/poc/standard_line_bot
cp .env.example .env
```

編輯 `.env`：

```text
LINE_CHANNEL_SECRET=你的 Channel secret
LINE_CHANNEL_ACCESS_TOKEN=你的 Channel access token
LINE_BOT_HOST=127.0.0.1
LINE_BOT_PORT=8765
LINE_BOT_OUTPUT_DIR=out/standard-line-bot
LINE_BOT_AUTO_REPLY=false
LINE_BOT_DOWNLOAD_MEDIA=true
LINE_BOT_SKIP_SIGNATURE=false
LINE_ADMIN_USER=admin
LINE_ADMIN_PASSWORD=666666
LINE_ADMIN_SESSION_SECRET=請換成自己的本地管理密鑰
```

## Step 3：啟動 webhook server

建議使用一鍵啟動檔：

```bash
open poc/standard_line_bot/Start_STANDARD_LINE_BOT.command
```

這個啟動檔會自動做四件事：

1. 讀取 `.env` 裡的 `LINE_BOT_PORT`，若沒有設定就使用 `8765`。
2. 檢查該 port 是否已被舊 server 佔用。
3. 若該 port 已被佔用，先停止舊 listener，再啟動新的 `line_bot_server.py`。
4. 啟動後自動打開本地控制介面：

```text
http://127.0.0.1:8765/admin/login
http://127.0.0.1:8765/dev-console
```

也可以手動啟動：

```bash
python3 line_bot_server.py --port 8765
```

成功時會看到：

```text
[info] LINE bot webhook listening on http://127.0.0.1:8765/webhook
[info] health check: http://127.0.0.1:8765/health
```

瀏覽器或 curl 測健康檢查：

```bash
curl http://127.0.0.1:8765/health
```

## Step 4：把本機 webhook 暴露成 HTTPS

LINE webhook 需要公開 HTTPS。

本機測試可以使用：

- ngrok
- Cloudflare Tunnel
- localtunnel
- 自己的 VPS reverse proxy

假設 tunnel 給你的網址是：

```text
https://example-tunnel.ngrok-free.app
```

那 LINE Developers Console 的 webhook URL 填：

```text
https://example-tunnel.ngrok-free.app/webhook
```

本機 server 預設每 30 分鐘檢查一次 ngrok 本機 API：

```text
http://127.0.0.1:4040/api/tunnels
```

檢查結果會寫入：

```text
out/standard-line-bot/ngrok_status.jsonl
```

這份 log 用來觀察 ngrok 長時間穩定度：是否仍有 HTTPS public URL、public URL 是否變動、ngrok API 是否回應、回應速度與錯誤訊息。

可調整的 `.env`：

```bash
NGROK_MONITOR_ENABLED=true
NGROK_API_URL=http://127.0.0.1:4040/api/tunnels
NGROK_MONITOR_INTERVAL_SECONDS=1800
```

### 同一個 ngrok 接兩組 LINE webhook

一個 LINE Official Account 只能設定一個 webhook URL，但多個官方帳號可以指向同一個 webhook URL。

例如兩組官方帳號都填：

```text
https://example-tunnel.ngrok-free.app/webhook
```

本機 server 會用 `X-Line-Signature` 逐一比對已設定的 Channel secret，判斷事件來自哪一隻 bot。這代表：

- 第一組 `FALO IM Bot Test` 可以走本機 webhook。
- 第二組 `FALO IM Bot GAS Test` 也可以先走同一個本機 webhook。
- 等 GAS 版完成後，再把第二組 webhook URL 改成 GAS Web App URL。

這樣可以先測「同一個地端 AI Node 接多個官方帳號」的能力，再切換成 GAS 輕 gateway。

## Step 5：用 LINE App 測試

1. 掃描 bot 的 QR code，把 Official Account 加好友。
2. 傳一段文字：

```text
任務 owner=Force due=明天下午 確認報價單
```

3. 後端會寫入：

```text
out/standard-line-bot/events.jsonl
```

4. 預設 `LINE_BOT_AUTO_REPLY=false`，bot 只收集資料、不回覆前端。
5. 若教學 demo 需要確認訊息，可暫時改成 `LINE_BOT_AUTO_REPLY=true`。

## Step 6：打開本地管理者後台

啟動 server 後，開啟：

```text
http://127.0.0.1:8765/admin/login
```

預設登入資訊：

```text
帳號：admin
密碼：666666
```

登入後可以看到目前收集到的 webhook 事件流，包含：

- 本機收到時間。
- LINE 原始事件時間。
- 來源類型：`user` / `group` / `room`。
- 群組或聊天室 key。
- 發訊者 display name / userId。
- 訊息類型與文字內容。
- 處理狀態。

這個頁面是本地 PoC 後台，用來展示「監督過程」與事件欄位。正式多人版還需要角色權限、audit log、HTTPS 與資料庫。

## Step 7：測圖片與檔案

傳一張圖片給 bot。

LINE webhook 會先送事件與 message ID。後端再用 Channel access token 下載內容，放到：

```text
out/standard-line-bot/media/
```

這代表後續可以接：

- 圖片 OCR。
- 報價單解析。
- 發票解析。
- 截圖內容理解。
- 商品圖辨識。

## Step 8：本機假資料測試

如果還沒有設定 LINE Console，可以先做假資料測試。

Terminal 1：

```bash
LINE_BOT_SKIP_SIGNATURE=true python3 line_bot_server.py
```

Terminal 2：

```bash
curl -X POST http://127.0.0.1:8765/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "type": "message",
        "mode": "active",
        "timestamp": 1710000000000,
        "source": {"type": "user", "userId": "U_TEST"},
        "message": {
          "id": "msg-text-001",
          "type": "text",
          "text": "任務 owner=Force due=明天下午 確認報價單"
        }
      }
    ]
  }'
```

## GAS 版：先手動跑一次

在把 GAS Web App URL 貼到 LINE Developers 之前，建議先手動跑一次 GAS。

目的不是測 LINE，而是先確認：

- `Code.gs` 沒有語法錯誤。
- Script Properties 能正常讀取。
- Google Sheet 可以被建立或開啟。
- 假事件可以寫入 `line_events` 工作表。

操作方式：

1. 到 Google Apps Script 貼上 `poc/gas_line_bot/Code.gs`。
2. 先設定 Script Properties：

```text
LINE_CHANNEL_ACCESS_TOKEN = GAS Test 這隻的 long-lived token
AUTO_REPLY = false
MEDIA_SAVE_MODE = metadata
```

3. 在函式下拉選單選：

```text
manualTestTextEvent
```

4. 按 `Run`。
5. 第一次執行會要求授權，允許它建立 / 寫入 Google Sheet。
6. 成功後，Apps Script 的 Log 應該會看到：

```json
{"ok":true,"received":1,"skipped_duplicate":0}
```

7. Google Drive 會出現一份新的 Sheet：

```text
FALO GAS LINE Bot Events
```

8. 裡面應該有 `line_events` 工作表，並寫入一筆：

```text
manual gas test
```

這一步成功後，才進入 LINE webhook URL 設定。這樣如果後面 LINE Verify 失敗，就可以確定問題多半在 webhook URL、部署權限或 LINE 端設定，而不是 GAS 寫入邏輯。

## GAS 版：用 clasp pull / push 管理程式碼

先求有的版本，可以先手動貼 `Code.gs`。但只要開始反覆修改，就建議改用 `clasp` 做 pull / push。

直覺理解：

```text
本機資料夾
  Code.gs
  appsscript.json
        ↓ push
Google Apps Script 專案
        ↓ deploy
LINE Webhook URL
```

`clasp push` 只負責把本機程式碼同步到 Apps Script 專案；它不等於重新部署 Web App。正式讓 LINE 用到新版程式時，還是要到 Apps Script 裡面重新部署新版本。

### 第一次設定

本專案已準備好：

```text
poc/gas_line_bot/Code.gs
poc/gas_line_bot/appsscript.json
poc/gas_line_bot/GAS_PUSH.command
poc/gas_line_bot/GAS_PULL.command
poc/gas_line_bot/.gas.env.example
```

先確認本機有 `clasp`：

```bash
clasp --version
```

如果尚未登入，執行：

```bash
clasp login
```

接著把範例設定複製成私人設定檔：

```bash
cd poc/gas_line_bot
cp .gas.env.example .gas.env
```

在 `.gas.env` 裡填入 Apps Script 的 Script ID：

```text
GAS_SCRIPT_ID=貼上 Apps Script 專案的 Script ID
```

Script ID 可以從 Apps Script 編輯器網址找到：

```text
https://script.google.com/home/projects/<SCRIPT_ID>/edit
```

也可以從 Apps Script：

```text
Project Settings -> Script ID
```

### 推送本機程式到 GAS

```bash
cd poc/gas_line_bot
./GAS_PUSH.command
```

用途：

- 把本機 `Code.gs` 推到 Google Apps Script。
- 把 `appsscript.json` 一起推上去。
- 若沒有 `.clasp.json`，會用 `.gas.env` 裡的 `GAS_SCRIPT_ID` 自動建立本機綁定。

推送後，如果要讓 LINE webhook 使用新版，還要到 Apps Script：

```text
Deploy -> Manage deployments -> Edit -> New version -> Deploy
```

### 從 GAS 拉回本機

```bash
cd poc/gas_line_bot
./GAS_PULL.command
```

用途：

- 從雲端 Apps Script 拉回目前版本。
- 拉回前會先備份本機檔案到：

```text
poc/gas_line_bot/backups/gas-YYYYMMDD-HHMMSS/
```

教學口徑：

```text
push = 我本機寫好了，要送上雲端。
pull = 雲端可能有人改過，我要拉回來比對。
deploy = 讓 Web App 對外使用最新版本。
```

## Event JSONL 範例

```json
{
  "event_id": "line_1710000000000_message",
  "event_type": "task_candidate",
  "source_type": "line_messaging_api",
  "source": {
    "type": "user",
    "key": "U_TEST",
    "user_id": "U_TEST",
    "group_id": null,
    "room_id": null
  },
  "sender": {
    "user_id": "U_TEST",
    "display_name": "測試使用者",
    "picture_url": null,
    "profile_source": "line_profile_api"
  },
  "line": {
    "event_type": "message",
    "message_id": "msg-text-001",
    "message_type": "text"
  },
  "content_kind": "text",
  "text": "任務 owner=Force due=明天下午 確認報價單",
  "privacy_level": "official_account_webhook_authorized",
  "processing_status": "received"
}
```

## 群組事件要保存什麼

正式做資料收集時，每筆 webhook event 至少保存：

- `source.type`：判斷是一對一、群組、多人聊天室。
- `source.group_id` / `source.room_id`：判斷是哪個群或聊天室。
- `sender.user_id`：判斷是哪個 LINE 使用者。
- `sender.display_name`：透過 LINE profile API 補上的顯示名稱，方便人工閱讀。
- `text` / `media`：訊息內容或媒體索引。
- `line_timestamp`：LINE 原始事件時間戳（毫秒），保存原值不改寫。
- `captured_at`：本機 server 收到 webhook 的時間，統一以台灣/台北時區（Asia/Taipei, UTC+8）記錄。

截圖可以輔助教學，但系統判斷要以 webhook event 為準。

## 正式高流量版定位

本地後台是功能驗證與教材實驗場，不是最終承載架構。

如果目標是純雲端版，且要承受多群組、多視窗、高頻工作訊息，正式架構應演進為：

```text
LINE Webhook
  ↓
Cloud Run webhook receiver
  ↓
Pub/Sub event queue
  ↓
Cloud Run worker
  ↓
Firestore / Cloud Storage / BigQuery
  ↓
雲端管理後台與本地衛星程式
```

教學版可先用 GAS + Sheet 讓初學者理解事件承接；高級版則應使用 Cloud Run + Pub/Sub + Firestore，避免把 GAS 當成高頻 API server。

## 內部私人版策略：FALO IM Watch / AI Cowork

這份教材目前是內部私人版，可以保留較完整的產品判斷、架構假設與營運策略。等內部版穩定後，再另外產出「去機敏對外版」，移除 token、實際 webhook URL、群組資訊、客戶名稱與內部部署細節。

這個專案不只是做一隻 LINE Bot，而是要做：

```text
FALO IM Watch
高頻訊息工作場的 AI 監督與任務萃取平台
```

核心價值不是「聊天機器人會回話」，而是：

- 多群組、多視窗不漏重要訊息。
- 自動整理任務、風險、客戶需求與待追蹤事項。
- 老闆 / 主管可以看戰情中心。
- 不要求員工換工具，LINE 照常使用，AI 在後面幫忙看。
- 後台 AI 同事根據戰情中心做事，而不是直接打擾群組。

## 為什麼不把 LINE 當 AI 對話主介面

LINE Official Account 很適合做「工作場資料入口」，但不一定適合做 AI cowork 的主要操作介面。

原因如下：

- LINE 群組是人類原本工作的地方，AI 不應該頻繁插話或洗版。
- 官方帳號主動推播、群發、廣播會受到方案訊息數限制。
- 後台 AI cowork 需要任務列表、風險清單、跨群組摘要、權限控管，聊天框不夠好用。
- 機密資料要分層：LINE 是原始工作場，AI 指揮中心應該在 Web 後台、Telegram 或 FALO 客製 IM。
- 未來不只 LINE，Telegram、Email、WhatsApp、WeChat、客製 IM 都可以成為資料來源。

因此內部版採用這個定位：

```text
LINE：接收真實工作場事件
Web 後台：顯示戰情中心
Telegram / FALO IM：與 AI cowork 對話、下指令、收提醒
後台專職 AI：負責整理、判斷、派工、摘要與風險提示
```

## 地端 Sender 的定位：FALO LINE Local Sender

LINE Official Account 的訊息方案限制，主要限制的是官方帳號主動送出的訊息數，例如 broadcast、push、multicast、narrowcast 等。這和 AI token 是兩件不同的事。

因此，如果目標是「內部群組少量精準提醒」或「老闆 / 業務助理場景」，可以把地端 Sender 當成另一條路線：

```text
FALO 產生建議訊息
        ↓
排程 / 任務佇列
        ↓
地端 LINE Sender
        ↓
貼到指定群組文字框
        ↓
HITL 人工確認，或在明確授權下自動發送
        ↓
本地 Audit Log
```

這條路線的核心不是 spam bot，而是：

```text
節省 OA 額度的地端 LINE 助理。
```

第一版建議定位為：

```text
代填不代送。
```

也就是系統可以把建議回覆、提醒內容、任務追蹤文字填到 LINE Desktop 指定聊天室的輸入框，但最後送出由人類確認。這樣能把產品風險壓低，也更符合 AI cowork 的精神：輔助人類，而不是取代人類亂發訊息。

| 路線 | 限制 | 適合用途 |
|---|---|---|
| LINE OA / Bot | 受官方帳號方案訊息數限制 | 正式客服、公告、訂閱通知、官方互動 |
| 地端 LINE Sender | 不走 OA 配額，但依賴個人帳號、桌面環境與授權操作 | 內部群組、少量精準通知、老闆 / 業務助理場景 |

這也讓 OCR 與 UI Automation 的分工更清楚：

```text
讀取：OCR / Webhook / Local Observer
輸入：UI Automation / Local Sender
判斷：AI cowork / Rule Engine / Task Queue
紀錄：Local Audit Log / Dashboard / Portable Chat Folder
```

安全防火牆必須一開始就寫進產品規格：

- 不可群發陌生人。
- 不可爆量洗訊息。
- 不可繞過使用者授權。
- 不可偽裝成使用者做高風險承諾。
- 高風險訊息一定要人工確認。
- 所有代填、送出、取消、修改都要寫入本地 audit log。
- 預設只允許 allowlist 群組與 allowlist 使用者。

這條路線適合當成內部版高價值功能，但對外說法要謹慎。它不是為了規避平台規則，而是為了在授權範圍內，讓 AI 幫忙整理、代填、提醒與保留稽核紀錄。

## 一隻主 Bot，後台多個專職 AI 同事

對使用者與群組來說，最好只看到一隻主要 bot。這也符合 LINE「一個聊天室、一個官方助手」的設計邏輯：前台單純、權限清楚、成員容易理解；後台則可以拆成多個專職 AI 同事。

但後台可以拆成多個專職 AI 同事：

| 後台角色 | 工作內容 |
|---|---|
| Collector | 收 webhook、去重、記錄文字與媒體 |
| Memory | 整理群組、使用者、事件索引 |
| Task Agent | 抽任務、owner、期限、待確認事項 |
| Risk Agent | 偵測客訴、逾期、價格、合約、資安等風險 |
| Summary Agent | 產生每日 / 每群 / 每客戶摘要 |
| Workflow Agent | 串 CRM、PM、ERP、Google Sheet、通知系統 |
| Admin Agent | 幫管理者看權限、群組狀態、異常事件 |

這樣前台保持單純，後台可以逐步擴充能力。

## Win365 版本的定位

Win365 不是為了取代正式雲端，而是先用較低成本做出接近私有部署的高價值能力。

它的優勢是：

- 高度模仿地端環境：可跑 Python、Node、瀏覽器、自動化與檔案同步。
- 成本比完整私有雲部署低很多。
- LINE webhook 本身不需要很強的 server。
- AI 不一定要跑在 Win365，本機節點可以呼叫 OpenAI、Gemini、Claude 或其他雲端 API。
- 適合先做「中心 + 衛星程式」模式：雲 gateway 收事件，Win365 AI node 做整理、分析、展示與人工輔助。

內部版可以先用 Win365 擋住純雲端版：

```text
LINE Webhook
  ↓
公開安全入口
  ↓
本地 / Win365 AI node
  ↓
戰情中心 dashboard
  ↓
AI cowork 慢慢分析、提醒、整理任務
```

## 即時層與高價值分析層要分開

不是每一則訊息都需要立刻丟給大型模型。即時監督可以先用低成本技術處理：

- 關鍵字偵測。
- 群組 / 使用者 / 時間判斷。
- 任務語句解析。
- 風險詞標記。
- 重複事件去重。
- 簡單優先級分類。

高價值分析則可以非同步慢慢跑：

- 每小時摘要。
- 客戶需求整理。
- 任務池歸納。
- 風險報告。
- 跨群組脈絡分析。
- 老闆戰情中心。

因此產品架構可以分三層：

```text
即時層：低成本監聽、記錄、分類、標記
戰情中心層：整理群組、任務、風險與待追蹤狀態
AI 同事層：根據戰情中心做延遲型高價值分析
```

## 公開入口與機密資料：不只比較 ngrok

這個專案涉及客戶與公司內部訊息，所以不能只問「ngrok 免費版夠不夠」。真正要評估的是：資料從 LINE 進來後，經過哪些入口、通道、儲存與分析節點。

| 方案 | 適合階段 | 優點 | 風險 / 限制 |
|---|---|---|---|
| ngrok 免費版 | 本機 PoC、文字測試 | 快速、教學容易、幾分鐘能跑 | 網址不穩、流量與請求有限，不適合正式機密場景 |
| ngrok 付費版 | 內部 demo、固定測試 | 固定網域、限制較少、設定簡單 | 仍偏開發隧道，不是最終平台治理 |
| Cloudflare Tunnel | 內部版、Win365 節點 | 不需開 inbound port，可接自有網域、可搭 Zero Trust | 需要網域與 Cloudflare 設定，教學門檻較高 |
| Cloudflare Zero Trust | 機密後台、管理介面 | 可做身份驗證、存取控管、裝置政策 | 要設計使用者與角色權限 |
| Tailscale / WireGuard | 私有節點互連 | 適合中心與衛星節點私網連線 | LINE webhook 仍需要公開 HTTPS 入口 |
| Cloud Run Gateway | 正式雲端入口 | 可擴展、可觀測、可接 Pub/Sub | 需要雲端部署與 IAM 管理 |
| 私有部署 / 專屬雲 | Enterprise | 資料邊界清楚、可客製加密與權限 | 成本高，應列高價方案 |

內部建議路線：

```text
開發期：ngrok / Cloudflare Tunnel
內部驗證：Cloudflare Tunnel + 自有網域 + Zero Trust
正式 SaaS：Cloud Run Gateway + Pub/Sub + Firestore / Cloud Storage
企業私有：專屬 Cloud Run / Win365 / 私有雲節點 + 客戶自帶 API key
```

## 地端中控時，ngrok 帳號是否要升級

前提：如果中控先不放 GAS，而是放在本機 / Win365，ngrok 的角色就是：

```text
LINE / Telegram / 外部 webhook
        ↓
公開 HTTPS URL
        ↓
ngrok tunnel
        ↓
本機 / Win365 FALO AI node
        ↓
戰情中心 / AI cowork / audit log
```

這時候要評估的不是「能不能連」，而是：

- webhook URL 是否穩定。
- 每月 HTTP request 夠不夠。
- 圖片、影片、檔案是否會讓傳輸量變大。
- 是否需要自己的網域。
- 是否有多個 endpoint：LINE webhook、Telegram webhook、admin、內部 API、media preview。
- 管理後台是否要 OAuth / OIDC / IP allowlist / audit log。
- 是否能接受 ngrok 成為機密資料進入地端 node 的入口。

### ngrok 方案能力比較（官方價格，2026-06-20 查詢）

| 方案 | 月費 | 主要限制 / 能力 | 適合 FALO 場景 | 建議 |
|---|---:|---|---|---|
| Free | US$0 | 3 個 online endpoints、1GB data transfer、20k HTTP/S requests、HTTP/S endpoint 會有 interstitial page、assigned dev domain、1 team member | 本機 PoC、教材 demo、低量文字測試 | 可用，但不適合長期中控 |
| Hobbyist | US$8/月（年繳）或 US$10/月（月繳） | 3 個 online endpoints、5GB data transfer、100k HTTP/S requests、無 interstitial page、ngrok-branded domains、1 team member | 個人開發、長時間 demo、小型內部測試 | 如果只是先玩穩定版，這是最低可買方案 |
| Pay-as-you-go | US$20/月起 + 超量計費 | unlimited online endpoints、可自帶 custom domain、100k requests / 5GB included，超過後 HTTP/S requests 約 US$1 / 100k、data transfer 約 US$0.10 / GB；含 3 team members，可加 SSO/RBAC/SCIM 等 | 地端中控、Win365 node、多 webhook、多 agent 內部版 | 若要認真做內部運作，建議從這級開始 |
| Enterprise / add-ons | 客製 | SLA、BAA、on-call、on-prem、合規、更多安全與支援 | 金融、醫療、政府、大型企業私有部署 | 不是 MVP 階段，但可列入 Enterprise 報價 |

官方參考：

- ngrok Pricing: https://ngrok.com/pricing
- ngrok Free Plan Limits: https://ngrok.com/docs/pricing-limits/free-plan-limits/

### 對 FALO 的實務建議

如果只是文字版 PoC：

```text
Free 可以先用。
```

原因是 LINE webhook 文字事件很小，20k requests / 月對單人 demo 通常夠用。

### 文字、圖片、影音、檔案的流量差異

如果只是「接收文字 webhook」，ngrok 的主要壓力通常是 request 數，而不是 data transfer。

```text
文字訊息：
  LINE → webhook 的 payload 很小。
  主要看每月 request 數。
```

但如果開始處理圖片、影音、檔案，就要分清楚資料怎麼走：

```text
LINE webhook：
  通常只送事件與 message id。

本機 / Win365 server：
  再用 Channel access token 從 LINE Content API 下載媒體。

管理後台 / AI 分析 / 外部預覽：
  如果透過 ngrok 對外提供媒體預覽或檔案下載，才會明顯吃 ngrok data transfer。
```

因此升級 ngrok 的理由可以分兩種：

| 升級理由 | 說明 |
|---|---|
| 入口數 / endpoint / port 不夠 | LINE webhook、Telegram webhook、admin、media preview、internal API 應分開，不適合全部擠在同一入口 |
| 傳輸量不夠 | 開始透過 tunnel 看圖片、下載檔案、展示影音、讓外部 agent 讀媒體時，data transfer 才會變成問題 |

內部判斷：

```text
文字版：
  request quota 比 data transfer 重要。

圖文版：
  endpoint 分流 + media 儲存策略開始重要。

影音 / 檔案版：
  data transfer、storage、signed URL、權限控管都要一起設計。
```

也就是說，若只是文字監聽，ngrok 免費或低階方案多半足夠；若要做圖文影音、media preview、多 agent、多入口，才需要往 Pay-as-you-go、Cloudflare Tunnel 或正式 cloud gateway 演進。

如果要做穩定內部 demo：

```text
建議 Hobbyist。
```

原因是它移除 HTTP/S interstitial page，request / transfer 額度也比較寬。雖然 LINE webhook 通常不被 browser interstitial 影響，但 demo 給人看、重複驗證、串多工具時，少一層不確定性比較好。

如果要把 Win365 當地端中控，開始接 LINE + Telegram + 後台 API：

```text
建議 Pay-as-you-go。
```

理由：

- 可以用自己的 custom domain，例如 `line-gateway.falo.ai`。
- endpoint 數量不容易被卡住。
- 多 agent / 多 webhook / 多客戶測試比較好拆。
- team members 與後續 SSO/RBAC/add-on 比較有路可走。
- 超量後是按量計費，而不是用完就停。

但如果要處理正式客戶機密資料：

```text
不要把 ngrok 當最終正式 gateway。
```

比較好的設計是：

```text
LINE / Telegram webhook
        ↓
FALO Cloud Gateway（Cloud Run / Cloudflare Worker / API Gateway）
        ↓
Queue（Pub/Sub / Redis / Firestore trigger）
        ↓
Win365 / 私有 AI node 主動拉取或建立 outbound secure tunnel
        ↓
戰情中心與 AI cowork
```

這樣地端 / Win365 node 不必直接裸露給外部 webhook，也比較容易做權限、稽核、客戶隔離與多租戶治理。

### Webhook 與 Admin 要分開保護

地端中控最容易犯的錯，是把 webhook 與 admin dashboard 都掛在同一個公開 tunnel 下。

比較安全的切法：

```text
/webhook/line
  對 LINE 平台公開
  不加 OAuth，因為 LINE 必須能 POST
  用 LINE signature 驗證來源

/webhook/telegram
  對 Telegram 平台公開
  用 Telegram secret token / webhook secret 驗證來源

/admin
  不應裸露公開
  優先只允許 localhost / VPN / Zero Trust / OAuth

/media
  預設不公開
  若要公開預覽，必須短效 signed URL 或登入後查看
```

也就是：

```text
Webhook 是公開入口，但要驗簽。
Admin 是管理入口，必須驗身份。
Media 是機密資料，預設不公開。
```

### ngrok vs Cloudflare Tunnel：內部建議

| 階段 | 建議 |
|---|---|
| 1 人本機開發 | ngrok Free |
| 穩定 demo / 教材錄影 | ngrok Hobbyist |
| Win365 地端中控內部版 | ngrok Pay-as-you-go 或 Cloudflare Tunnel |
| 有自有網域與機密後台 | Cloudflare Tunnel + Zero Trust |
| 多客戶 SaaS | FALO Cloud Gateway |
| 企業私有部署 | 專屬 gateway + private node + 客戶 key |

Cloudflare Tunnel 的優點是可以把服務接到自有網域，並和 Zero Trust / Access policy 搭配，較適合保護 admin dashboard。ngrok 則勝在開發體驗快、debug 方便、Webhook 測試路徑短。

### 目前決策

內部版可以先這樣走：

```text
短期：ngrok Hobbyist / Pay-as-you-go
  目的：讓 LINE webhook 穩定打到 Win365 / 本地中控。

中期：Cloudflare Tunnel + 自有網域 + Zero Trust
  目的：保護後台、降低公開暴露面、建立正式網域感。

長期：FALO Cloud Gateway + Win365 / private AI node
  目的：客戶只填參數，背後由 FALO gateway 負責事件承接、安全、排隊、分發。
```

## 多 GAS 彙整到 AI Node 的設計

如果採用「一個 webhook 對應一個 GAS」或「一個客戶 / workspace 對應一個 GAS」的模式，後面的 AI Node 就不應該只是 webhook receiver，而應該是：

```text
資料彙整中心 + 戰情中心 + AI cowork 大腦
```

前面的 GAS 是分散式輕入口，後面的 AI Node 是重中心：

```text
GAS A / LINE Bot A
GAS B / Telegram Bot B
GAS C / 客戶 C
GAS D / 高機密群組
        ↓
資料彙整層
        ↓
AI Node
        ↓
戰情中心 / 任務池 / 風險池 / 客戶脈絡
        ↓
AI cowork / Dashboard / Telegram / FALO IM
```

核心原則：

```text
GAS 不做重分析。
GAS 只做接收、驗證、落地、通知或轉發。
AI Node 負責同步、去重、整理、判斷、分發與稽核。
```

### 模式一：GAS 主動 Push 到 AI Node

```text
Webhook → GAS → AI Node API
```

GAS 收到 LINE / Telegram event 後，立刻轉成 FALO event schema，POST 到 AI Node。

| 面向 | 說明 |
|---|---|
| 優點 | 延遲低、流程直覺、容易做即時提醒 |
| 缺點 | AI Node 斷線時，GAS 要 retry / buffer；GAS 的 UrlFetch 次數會增加 |
| 適合 | 重要事件、VIP 客戶、低延遲提醒、內部 demo |

這條路線最像即時 webhook gateway，但要處理 AI Node 不在線、重試、重複事件與安全驗證。

### 模式二：GAS 先寫 Sheet / Drive，AI Node 主動 Pull

```text
Webhook → GAS → Google Sheet / Drive
AI Node 定期讀取 Sheet / Drive
```

| 面向 | 說明 |
|---|---|
| 優點 | GAS 不需要知道 AI Node 是否在線；資料先落地，不容易丟；適合教學與人工檢查 |
| 缺點 | 延遲較高；Sheet 高頻會變慢；需要 cursor / last_seen / 去重 |
| 適合 | 教學版、低頻版、備援、客戶可自查資料 |

這條路線最穩、最容易教，但不是最高效。它適合當作 MVP 或 fallback。

### 模式三：GAS 寫入後送 Signal，AI Node 再 Pull

這是內部版最推薦的折衷模式：

```text
Webhook → GAS → Sheet / Drive
              ↓
          Signal AI Node：有新資料
              ↓
          AI Node 主動 Pull 差異資料
```

GAS 不一定把完整資料推給 AI Node，而是送一個很小的 signal：

```json
{
  "gas_id": "gas_line_001",
  "sheet_id": "sheet_xxx",
  "cursor": 1288,
  "event_count": 3,
  "last_event_at": "2026-06-20T10:30:00+08:00"
}
```

AI Node 收到 signal 後，依 `gas_id` 查 registry，再用 cursor 讀新增資料。

| 面向 | 說明 |
|---|---|
| 優點 | 比純定時快；比全量 push 穩；GAS 負擔較低；AI Node 保有同步主導權 |
| 缺點 | 要設計 cursor、checkpoint、signal 遺失補救 |
| 適合 | Win365 AI Node、多 GAS 彙整、內部版、可靠性高於毫秒即時性的場景 |

這個模式可以搭配 fallback scan：

```text
有 signal：立刻同步
沒 signal：每 1-5 分鐘掃一次補漏
```

因此它同時有：

- 即時性：有 signal 就快。
- 可靠性：Sheet / Drive 先落地。
- 可補漏：fallback scan 可修復斷線與 signal 遺失。

### 模式四：GAS / Cloud Gateway → Queue → AI Node

正式高流量版應該走 queue：

```text
Webhook → GAS / Cloud Run Gateway → Pub/Sub / Queue
                                  ↓
                              AI Worker
```

| 面向 | 說明 |
|---|---|
| 優點 | 高流量可擴展；有 queue 緩衝；retry、dead-letter、worker scaling 較好設計 |
| 缺點 | 架構較雲端化；要處理 IAM、topic、subscription、部署與監控 |
| 適合 | 正式 SaaS、多客戶、高頻群組、影音與檔案事件 |

如果還想保留 GAS，GAS 也可以只做輕 gateway，把事件交給 queue，不在 GAS 裡做複雜分析。

### AI Node 需要的核心模組

| 模組 | 責任 |
|---|---|
| Connector Registry | 記錄每個 GAS / webhook / customer / sheet / secret / cursor |
| Ingestion Worker | 接收 push signal 或定期 pull 資料 |
| Normalizer | 把 LINE / Telegram / FALO IM 全部轉成 FALO event schema |
| Deduplicator | 用 event_id / message_id / source timestamp 去重 |
| Cursor Manager | 記錄每個 GAS 同步到哪一列、哪一個 event |
| Event Store | 寫入 SQLite / PostgreSQL / Firestore |
| State Builder | 更新任務池、風險池、客戶脈絡、群組狀態 |
| AI Job Queue | 把需要 AI 分析的事件丟進背景任務 |
| Notification Router | 決定要通知 Telegram、FALO IM、Email、Dashboard 或 Local Sender |
| Audit Log | 記錄誰同步、誰分析、誰通知、誰確認 |

### 建議採用路線

內部版建議採用：

```text
Signal + Pull + Fallback Scan
```

完整流程：

```text
1. LINE / Telegram event 進 GAS
2. GAS 寫入自己的 Sheet / Drive log
3. GAS 發一個很小的 signal 給 AI Node
4. AI Node 收到 signal 後，依 gas_id 找 registry
5. AI Node 用 cursor 讀取新增資料
6. AI Node normalizes / deduplicates / stores
7. AI Node 更新戰情中心
8. AI Node 把高價值任務丟給 AI cowork
9. 每 1-5 分鐘 fallback scan 一次，補漏 signal
```

一句話總結：

```text
GAS 是分散式輕入口。
AI Node 是跨入口的戰情中心與 AI cowork 大腦。
```

這個架構保留了 GAS 的便宜、好部署、好教學，也保留了 AI Node 的重中心能力。未來高流量客戶可以把某一個 GAS 分片升級成 Cloud Run / Pub/Sub，而不必推翻整個系統。

## Android 平板本人帳號觀測路線

這條路線排在 GAS 官方帳號版之後。它不是取代官方 Bot，而是補上另一個場景：

```text
官方帳號 Bot：正式、可授權、可接 webhook 的資料入口。
Android 平板觀測器：本人帳號本來就看得到的聊天室，由裝置端協助觀測與提醒。
```

直覺理解：

```text
LINE 官方帳號 = 公司放進群組的一位官方助手。
Android 平板觀測器 = 使用者自己的平板助理，幫本人看自己本來就看得到的畫面。
```

這條路線仍然不碰 LINE 私有 API、不逆向 Thrift、不模擬非官方協議。建議只走 Android 系統允許的能力：

| 技術層 | 可做什麼 | 限制 |
|---|---|---|
| Notification Listener | 讀取 LINE 通知文字、時間、來源摘要 | 只看得到通知內容；使用者如果關通知或通知被折疊，資訊會不完整 |
| Accessibility Service | 觀察目前畫面文字、輔助點擊、偵測聊天室畫面 | 需要使用者明確開啟無障礙權限；必須清楚告知用途 |
| MediaProjection + OCR | 擷取螢幕畫面後本地 OCR | 適合畫面型資料；耗電與隱私提示要處理 |
| ADB / 開發模式 | PoC 與測試自動化 | 不適合一般使用者長期使用 |

第一版 MVP 建議：

```text
專用 Android 平板
        ↓
開啟 LINE 本人帳號
        ↓
Notification Listener 先收通知摘要
        ↓
必要時 Accessibility / OCR 補畫面內容
        ↓
寫入本地事件檔或送到 AI Node
        ↓
AI Node 做任務、風險、提醒與戰情中心
```

產品邊界要清楚：

- 只觀測使用者本人帳號本來就有權限看到的內容。
- 必須由使用者在裝置上明確開啟權限。
- 不應設計成隱形監控工具。
- 高風險自動發送仍然要 HITL 人工確認。
- 觀測、解析、提醒、送出要分模組，方便稽核與關閉。

所以路線排序可以寫成：

```text
1. 地端官方 Bot webhook：先打通本機 AI Node。
2. GAS 官方 Bot webhook：先打通雲端輕入口。
3. Android 平板本人帳號觀測器：補本人帳號視角。
4. Cloud Gateway / Pub/Sub / Firestore：正式高流量版。
```

## 機密資料與客戶信任設計

要讓客戶放心把高頻 IM 訊息交給平台，需要明確說清楚：

- 我們收哪些資料。
- 資料流經哪些節點。
- 哪些資料會進 AI 分析。
- 是否可選擇不保存圖片 / 影片。
- 是否可自帶 AI API key。
- 是否可使用客戶專屬節點。
- 是否可匯出與刪除資料。
- 是否有 audit log。
- 是否能做加密保存與角色權限。

產品上可以分成兩種模式：

```text
FALO-managed mode
  FALO 管理 AI key、gateway、儲存與分析，適合快速導入。

Customer-key / private-node mode
  客戶自帶 AI key 或專屬節點，FALO 只負責 gateway、工具與流程。
  適合高機密、企業、顧問公司、法務、財務與大型客戶。
```

注意：實際的 Channel access token、Channel secret、AI API key 應該保留在 `.env` 或 secrets manager，不建議複製到教材主檔。內部教材可以記錄架構、欄位與流程，但真正密鑰仍以環境檔或密鑰管理系統為準。

## 產品分層草案

不要只用「有沒有 bot」分價格，而是用能力分層：

| 方案 | 主要能力 | 適合對象 |
|---|---|---|
| Collector | 收集、保存、搜尋、匯出 | 個人老闆、小團隊、教材 demo |
| Watch | 任務萃取、風險提示、每日摘要、戰情中心 | 多群組團隊、業務、客服、PM |
| Workflow | 任務派工、提醒、CRM / ERP / Google Workspace 串接 | 有流程管理需求的公司 |
| Private | 客戶自帶 AI key、私有節點、客製加密、資料不出域 | 有資安與法遵要求的公司 |
| Source / Partner | 原始碼、私有部署、SI 授權 | 技術夥伴、系統整合商 |

低價入口應該先賣「收集與搜尋」，真正高價值在「AI cowork」：它能看戰情中心、整理任務、提醒主管、協助團隊不漏訊息。

## 教材重點

標準 LINE Bot 不是監控使用者的 LINE 視窗，而是建立一個官方資料入口。

可以這樣講：

```text
OCR 是觀察既有桌面流程。
LINE Bot 是建立正式工作入口。
兩者不是互斥，而是服務不同場景。
```

## 第二組官方帳號：GAS webhook 接收器

第二組官方帳號 `FALO IM Bot GAS Test` 的目標，是先做一個最小可用的雲端入口：

```text
LINE Official Account webhook
        ↓
Google Apps Script doPost(e)
        ↓
Google Sheet line_events
        ↓
GAS HTML monitor / JSON proxy
        ↓
地端 AI commander pull 新資料
```

這個版本刻意先做「收資料」，不主動回覆 LINE 前端。原因是目前目標是資料搜集與相容性測試，不需要消耗官方帳號的推播 / 回覆額度，也避免群組被自動訊息干擾。

目前本機程式位置：

```text
poc/gas_line_bot/
  Code.gs
  Index.html
  appsscript.json
  README.md
```

目前內部測試資源：

```text
Sheet:
https://docs.google.com/spreadsheets/d/1VWP34oZeUqcYdOfI042SDeHXNNhLKi2vQCYDzAOaDyo/edit

GAS Script ID:
1NJz55_sp90mYwltbbT0vHVCZAPaT3ueBgTjedx3doLpFrDdIRZx2_WwE

Bot basic ID:
@415taurm
```

目前新版 Web App deployment：

```text
https://script.google.com/macros/s/AKfycbxlGJBeITEwcXHRRoi1k2yZfbb-y1PkoNw61aABB6I8qB0StweTImMT8ohL3KJmLt_X/exec
```

第一次部署後，先開這個 URL 初始化預設設定與 Sheet 表頭：

```text
https://script.google.com/macros/s/AKfycbxlGJBeITEwcXHRRoi1k2yZfbb-y1PkoNw61aABB6I8qB0StweTImMT8ohL3KJmLt_X/exec?api=setup
```

監看頁與 JSON proxy：

```text
HTML monitor:
https://script.google.com/macros/s/AKfycbxlGJBeITEwcXHRRoi1k2yZfbb-y1PkoNw61aABB6I8qB0StweTImMT8ohL3KJmLt_X/exec

Health:
https://script.google.com/macros/s/AKfycbxlGJBeITEwcXHRRoi1k2yZfbb-y1PkoNw61aABB6I8qB0StweTImMT8ohL3KJmLt_X/exec?api=health

Events:
https://script.google.com/macros/s/AKfycbxlGJBeITEwcXHRRoi1k2yZfbb-y1PkoNw61aABB6I8qB0StweTImMT8ohL3KJmLt_X/exec?api=events&limit=200
```

LINE Developers 的 `Verify` 會送一筆測試 webhook 事件。GAS 版已特別處理這種測試事件：如果偵測到 LINE Verify 常見的全 0 `replyToken`，會立刻回 `200 OK`，不寫入 Sheet。正式使用者、群組、聊天室事件仍會正常寫入 Sheet。

### GAS exec 的「資源名片」

GAS 版的 `/exec` 不只是一個 webhook URL，也是一張給使用者看的資源名片。直接用瀏覽器打開 `/exec` 時，頁面會顯示：

- 這支 Web App / exec URL。
- 對應的 `spreadsheet_id` 與 Google Sheet 連結。
- 對應的 Drive folder ID 與檔案資料夾連結。
- 此 LINE Bot 的 Basic ID。

這樣做的目的是讓使用者後續維運更直覺：看到一支 exec，就知道資料會寫去哪個 Sheet；看到媒體檔案設定，就知道圖片、影片、語音與檔案會搬到哪個 Drive folder。

### GAS 媒體檔案處理：先排隊，再搬到 Drive

LINE 的圖片、影片、語音與檔案事件，webhook 內主要會拿到 `messageId`。真正的檔案內容要再透過 LINE Content API 下載。

為了避免 webhook 回應太慢，GAS 版採用兩段式：

```text
LINE webhook
  -> 先寫 line_events
  -> 媒體事件寫入 media_queue
  -> 立即回 200 OK

每 5 分鐘 Apps Script trigger
  -> 一次一個檔案依序下載
  -> 上傳到指定 Drive folder
  -> 成功後寫入 media_files
```

這裡要特別分清楚兩種 `200 OK`：

| 階段 | 誰打誰 | 成功條件 | 為什麼重要 |
| --- | --- | --- | --- |
| Webhook 接收 | LINE Platform -> GAS `/exec` | GAS 快速回 `200 OK` | LINE 才會判定 webhook 成功，不重送或報錯。 |
| 媒體下載 | GAS worker -> LINE Content API | LINE 回 `200` binary blob | 代表圖片、影片、語音或檔案真的被抓到，才能上傳 Drive。 |

#### 教材重點：200 回應與上傳成功不是同一件事

這是 GAS 版 LINE Bot 最重要的除錯觀念之一：

```text
LINE Verify 顯示 Success
  只代表 webhook URL 可以接到 LINE 的 POST，且 GAS 有回 200。

media_queue 狀態變成 saved
  才代表 GAS worker 已經用 messageId 抓到 LINE 媒體內容，並成功寫入 Google Drive。
```

所以測試媒體檔案時，不能只看 LINE Developers 的 `Verify`。正確的檢查順序是：

1. LINE Developers `Verify` 成功：確認 webhook 回應 `200 OK`。
2. Google Sheet `line_events` 有資料：確認事件已寫入。
3. Google Sheet `media_queue` 有資料：確認圖片、影片、語音或檔案已排隊。
4. `media_queue.status = saved`：確認 worker 已下載並上傳到 Drive。
5. `media_files` 有 Drive URL：確認後續 AI / 人工都能取用該檔案。

這個拆法的好處是：LINE webhook 不會因為下載大檔案而 timeout；媒體上傳失敗時，也可以靠 `media_queue.last_error` 重試與追蹤，不會把原始事件弄丟。

如果媒體佇列的 `last_error` 出現非 200，常見意思如下：

| 狀態碼 | 直覺解讀 | 處理方向 |
| --- | --- | --- |
| `302` | 拿到 redirect，不是檔案本體 | 確認 worker 是直接打 LINE Content API，不是瀏覽器頁面、proxy 或錯誤 URL。 |
| `401` / `403` | token 不對或沒有權限 | 確認 `LINE_CHANNEL_ACCESS_TOKEN` 屬於收到該訊息的同一隻官方帳號。 |
| `404` / `410` | 找不到或內容已不可取 | 可能是媒體已過期、被 LINE 清除，或 `messageId` 不屬於這隻 bot。 |
| `5xx` | LINE 或網路暫時異常 | 保留佇列，稍後重試。 |

預設 Drive folder (v1.x 靜態配置)：

```text
1YMudlXzJYuBgK3gtJt2sPAUvcOc3kQwC
```

#### v2.0 初始環境設定最小化：位置跟隨與自動建檔設計 (Folder Following & Auto-Creation)

為了讓使用者/客戶擁有「開箱即用」的零痛點體驗，並兼顧**資安權限管理**，Falo v2.x 引入了動態位置跟隨機制：
1. **無須手動建立資料夾**：使用者只要複製試算表範本，並在 `bot_configs` 的 `associated_drive_folder_id` 欄位保持空白即可。
2. **位置隨動偵測**：當 Bot 接收到第一筆對話或上傳請求時，GAS 會自動抓取該試算表檔案當前所處的雲端資料夾：
   ```javascript
   var parentFolder = DriveApp.getFileById(ss.getId()).getParents().next();
   ```
3. **自動繼承權限**：系統隨即在同一個資料夾下自動建立子資料夾（如 `Bot_standard`），其 Google Drive 共享權限會完全自動繼承自母資料夾，不需要額外重複共享。
4. **自動回填**：建立完成後，子資料夾的 ID 會自動填寫回 `bot_configs` 表格中，完成自動化配置。

監看頁提供四個操作：

- 啟用 / 停用媒體上傳。
- 啟用 / 停用 5 分鐘 trigger。
- 手動處理媒體佇列。
- 打開對應 Google Sheet / Drive Folder。

#### 第一次 trigger / Drive 權限怎麼打開

GAS 的 trigger 權限不能完全由網頁前端第一次自動打開。第一次必須由 GAS 擁有者進 Apps Script 編輯器手動執行一次授權函式。

請在 Apps Script 編輯器手動 Run：

```text
authorizeRuntime
```

這個函式的用途是「授權暖機」，不是直接啟動背景排程。它會碰到三個必要服務：

1. `SpreadsheetApp`：確認可以讀寫指定 Google Sheet。
2. `DriveApp`：確認可以讀寫指定 Drive Folder。
3. `ScriptApp`：確認可以讀取 / 建立 Apps Script triggers。

授權完成後，日常才透過監看頁按鈕控制：

- `啟用媒體上傳`：修改 `MEDIA_SAVE_ENABLED`。
- `啟用 5 分鐘 trigger`：建立 `processMediaQueue` 的 time trigger。
- `手動處理媒體佇列`：立即跑一次 `processMediaQueue`。

保留這個分層很重要：第一次授權是 Google 帳號安全流程；後續開關是系統管理流程。

官方參考：LINE Messaging API 的「Get content」說明指出，媒體內容會在一段時間後自動刪除，且不保證保存時間。因此實務上不要只存 `messageId` 後很久才下載，應該盡快搬到自己的儲存空間。

參考來源：<https://developers.line.biz/en/reference/messaging-api/#get-content>

如果瀏覽器點擊 Web App 連結看到 Google 的「很抱歉，目前無法開啟這個檔案。請檢查網址並再試一次。」（Sorry, unable to open this file at this time）或是「存取遭拒」，通常不是程式碼錯誤，而是 Google 的帳號 Session 衝突或未完成 API 授權。

#### 🚨 避坑與除錯指南 (Troubleshooting)

##### 1. 多帳號 Session 衝突 (最常見的坑)
* **現象**：在電腦或手機的常用瀏覽器中點開連結，會被自動重新導向並顯示「無法開啟檔案」，但透過 `curl` 等 API 請求或用沒有登入 Google 的訪客模式點開卻完全正常。
* **原因**：因為瀏覽器同時登入多重 Google 帳號（例如個人 Gmail 與公司 Workspace 帳號），Google 會在網址中自動插入 `/u/1/` 或 `/u/0/` 進行識別。如果當下預設的 Session（如公司 Workspace 帳號）有安全限制，Google 門神會在「執行程式碼前」直接把連線掐斷，程式根本沒有執行的機會。
* **解法**：
  - 電腦端測試：使用 Chrome **「訪客模式 (Guest Profile)」** 或是開啟完全未登入 Google 的乾淨無痕視窗開啟連結。
  - 網址手動對齊：若個人主要開發帳號是 `/u/0/`，在瀏覽器開啟時確保網址寫的是 `/u/0/s/...` 而非 `/u/1/s/...`。
  - 行動端測試：避免直接在 LINE 聊天室內點開連結，應複製網址在乾淨的 Safari/Chrome 訪客頁面中打開。

##### 2. 獨立專案 (Standalone) 與容器綁定 (Container-bound) 的權限牽連
* **容器綁定限制**：若 Apps Script 專案是綁定在私有試算表（Sheet）內部，即使 Web App 設定為「所有人（Anyone）可存取」，只要該試算表本身沒有開啟「知道連結的任何人皆可檢視」共享，外部匿名使用者訪問網頁時，Google 就會連帶封鎖 Web App，直接顯示無法開啟檔案。
* **安全性解法**：**強烈建議改用「獨立指令碼專案 (Standalone Project)」**！獨立專案與特定 Sheet 脫鉤，試算表可以保持 **100% 絕對私有（限制）**，而獨立專案的 Web App 依然可以被任何人匿名點開（其在背景會以開發人員的擁有者權限安全地用 `SpreadsheetApp.openById(ID)` 讀寫私有試算表）。

##### 3. 首次部署與多服務授權
* **原因**：如果程式碼中使用了 `DriveApp`（雲端硬碟）或 `UrlFetchApp`（外部連線），而擁有者在首次手動執行時（例如只跑了僅使用 `SpreadsheetApp` 的 `runSetup` 暖機）沒有完整授予這些權限，Web App 載入時就會因為伺服器端缺少授權而直接崩潰。
* **解法**：
  1. 在 `setup.gs` 中寫一個暖機函數 `authorizeAllScopes`，在其中主動呼叫 `DriveApp.getRootFolder()`、`SpreadsheetApp.openById(...)` 與 `UrlFetchApp.fetch(...)`。
  2. 擁有者在 GAS 編輯器中手動執行一次 `authorizeAllScopes`，完成所有權限授予。
  3. 進入 **Deploy -> Manage deployments**，編輯現有部署，選擇 **「建立新版本」 (New Version)**（執行身分設為「我本人」，誰可以存取設為「所有人」），然後按部署發布。

## v2.0 雲地架構與 Falo 核心產品線演進 (Claude Fable 評審意見)

在進行 v2.x 版本架構重構時，我們將產品的主軸定位從單純的「LINE 輔助備份工具」提升為 **Falo 公司旗艦級的對話工作流產品線**。

基於此定位，以下是 Claude Fable 針對本系統提出的核心優化建議與發展路線：

### 1. 核心觀點：長春的是「管線」，不是「LINE」
本系統真正具備長遠商業價值的，是以下對話處理管線：
`對話流接入 → 歸檔（永不過期）→ 時間切片 → KM 交叉 → AI 提煉 → 結構化輸出`

LINE 只是其中一個接入源。因此，架構上必須將**「通道」「儲存」「提煉」「輸出」四層徹底解耦**，每一層均為可替換之插槽。

### 2. 產品功能線延伸與優先級 (Roadmap)
* **P0：契約層先行 (Contract-First)**：先定義好 API 與統一訊息 Schema (SQLite/GAS/D1 共用)，後續不論是 GAS 訊息網關還是 Cloudflare D1，均只對接該契約。
* **P1：MCP (Model Context Protocol) Server 化**：把備份對話與 KM 查詢包裝成 MCP tools，讓使用者的 Desktop AI Agent (如 Claude/ChatGPT) 能**即時查詢** Falo 資料庫，提供極致的 AI 記憶庫延伸，這是最關鍵的市場差異化。
* **P1：個人版 (Falo Personal)**：以 Local-first (GAS + SQLite) 提供給個人工作者，作為功能沙盒與漏斗入口。
* **P1~P2：垂直業務包 (插件化)**：將客服客訴、政府補助結案留痕、房仲保險等打包為獨立的業務插件 (manifest + Prompt 組合)，依 Cloudflare 授權開關解鎖，核心管線完全不動。

### 3. AI 工作流開發制度
* **Spec 先行**：每條功能線開工前先撰寫一頁規格 (Spec)，作為開發 AI (Antigravity) 與檢核 AI (Fable) 的唯一事實來源。
* **黃金對話資料集 (Golden Dataset)**：建立去敏感化的對話測試樣本，防止因 LLM 模型升級導致 AI 提煉品質下降，進行持續回歸測試。
* **核心慢、外圍快**：核心管線版本控制保守，垂直業務包與通道組件快速迭代，嚴禁垂直包 fork 核心代碼。

## 版權與內部使用聲明

Copyright (c) 2026 Falo x Force Cheng. All rights reserved.

本文件為 `(Private)` 內部開發與教學素材，包含 FALO IM Watch、LINE Bot、GAS webhook、Google Sheet / Drive 儲存與 AI Commander 架構設計。可作為內部教材、開發記錄、產品策略討論與後續對外版教材的基礎。對外公開前，需移除或替換所有機密參數、實際 Sheet / Drive / webhook URL、使用者識別資訊與內部策略描述。

## 下一堂課

下一步可以把 `events.jsonl` 接到 AI parser：

```text
文字事件
        ↓
AI 萃取 owner / due date / risk / customer / project
        ↓
寫入 task inbox
        ↓
用 LINE 回覆確認卡片
```
