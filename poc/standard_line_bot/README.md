# Standard LINE Bot PoC

本資料夾是標準 LINE Official Account / Messaging API 路線的第一版 PoC。

它不讀取個人 LINE Desktop，也不監控本機視窗。它只接收 LINE 官方平台送到 webhook 的事件，適合正式商用、客服、群組協作、任務收件與 AI 助理入口。

## 目標

```text
LINE user / group / room
        ↓
LINE Messaging API webhook
        ↓
line_bot_server.py
        ↓
events.jsonl
        ↓
AI Parser / Task / CRM / Dashboard
```

第一版先做到：

- 收 LINE webhook。
- 驗證 `X-Line-Signature`。
- 接收文字、圖片、影片、音訊、檔案、貼圖、位置。
- 文字直接保存成 JSONL event。
- 保存 sender userId，並在有 access token 時嘗試查詢 LINE profile，補上 display name / picture URL。
- 圖片/影片/音訊/檔案可下載到本機。
- 預設只收集資料、不回覆前端；必要時才可選擇自動回覆「已收到」。
- 所有結果先落地到 `out/standard-line-bot/`，方便後續教材、AI parser、dashboard 接上。
- 提供本地管理者後台，先用 `admin / 666666` 登入查看監督事件流。

## 檔案

```text
standard_line_bot/
  line_bot_server.py
  test_line_bot_server.py
  .env.example
  README.md
```

## 設定 LINE Official Account

1. 到 LINE Developers Console 建立 Provider。
2. 建立 Messaging API Channel。
3. 在 Messaging API 頁面啟用 webhook。
4. 複製：
   - Channel secret
   - Channel access token
5. 若要讓 bot 進群組，啟用 `Allow bot to join group chats`。
6. 將 webhook URL 設為：

```text
https://你的公開網址/webhook
```

本機開發時可以用 ngrok、Cloudflare Tunnel 或其他 HTTPS tunnel，把 `http://127.0.0.1:8765` 暴露成公開 HTTPS。

官方文件：

- Messaging API overview: https://developers.line.biz/en/docs/messaging-api/overview/
- Receive messages webhook: https://developers.line.biz/en/docs/messaging-api/receiving-messages/
- Message types: https://developers.line.biz/en/docs/messaging-api/message-types/
- Group chats: https://developers.line.biz/en/docs/messaging-api/group-chats/

## 本機啟動

先設定環境變數：

```bash
cd falo-im-line-lab/poc/standard_line_bot
cp .env.example .env
```

把 `.env` 裡的值填好後，可以手動 export：

```bash
export LINE_CHANNEL_SECRET="你的 Channel secret"
export LINE_CHANNEL_ACCESS_TOKEN="你的 Channel access token"
```

啟動 server：

建議用一鍵啟動檔：

```bash
open Start_STANDARD_LINE_BOT.command
```

它會先檢查 `.env` 裡的 `LINE_BOT_PORT`，若該 port 已被舊 server 佔用，會先停止舊 listener，再啟動新的 server，最後自動打開：

```text
http://127.0.0.1:8765/admin/login
```

也可以手動啟動：

```bash
python3 line_bot_server.py --port 8765
```

預設：

```text
http://127.0.0.1:8765/health
http://127.0.0.1:8765/webhook
http://127.0.0.1:8765/admin/login
```

## ngrok 穩定度監測

本機 server 會預設每 30 分鐘讀一次 ngrok 的本機 inspector API：

```text
http://127.0.0.1:4040/api/tunnels
```

每次檢查會寫入：

```text
out/standard-line-bot/ngrok_status.jsonl
```

這份 log 用來長時間觀察：

- ngrok 是否還活著。
- 是否仍有 HTTPS public URL。
- public URL 是否有變動。
- ngrok 本機 API 回應速度。
- 發生錯誤時的錯誤訊息。

相關 `.env` 設定：

```bash
NGROK_MONITOR_ENABLED=true
NGROK_API_URL=http://127.0.0.1:4040/api/tunnels
NGROK_MONITOR_INTERVAL_SECONDS=1800
```

如果只是短時間測試，也可以暫時改成 300 秒；若是長時間穩定度觀察，建議維持 1800 秒。

## 本地管理者後台

啟動 server 後，開啟：

```text
http://127.0.0.1:8765/admin/login
```

預設登入資訊：

```text
帳號：admin
密碼：666666
```

登入後會看到最近的 webhook 事件，包含：

- 本機收到時間。
- LINE 原始事件時間。
- 來源類型：`user` / `group` / `room`。
- 群組或聊天室 key。
- 發訊者 display name / userId。
- 訊息類型與文字內容。
- 處理狀態。

這個後台是本地 PoC 管理頁，不是正式權限系統。正式版應改用更強的密碼、HTTPS、角色權限與 audit log。

## 本機假資料測試

開發時可以跳過簽章驗證：

```bash
LINE_BOT_SKIP_SIGNATURE=true python3 line_bot_server.py --port 8765
```

另開一個 terminal：

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

輸出會寫到：

```text
out/standard-line-bot/events.jsonl
```

## 圖片與檔案

當使用者傳圖片、影片、音訊或檔案時，webhook 事件本身只會帶 message ID。程式會用 Channel access token 呼叫 LINE content API，把內容下載到：

```text
out/standard-line-bot/chats/<chat_folder>/media/
```

檔名會帶必要索引資訊，讓檔案離開主資料庫後，人與 AI 仍能初步判讀：

```text
YYYYMMDD-HHMMSS_sourceType_sourceKey_senderId_mediaType_messageId_hash12.ext
```

每個聊天室資料夾也會建立可攜式對應表：

```text
out/standard-line-bot/chats/
  group_c3f176d059bd/
    manifest.json
    events.jsonl
    media_index.jsonl
    media_index.csv
    media/
```

設計目的：主資料庫負責全域管理，但單一聊天室資料夾被複製出去後，也能獨立交給人、AI 或其他程式分析。

如果不想下載媒體：

```bash
python3 line_bot_server.py --no-download-media
```

## 使用者與群組來源

每筆事件會保存：

```text
source.type      user / group / room
source.group_id  群組 ID
sender.user_id   發訊者 LINE userId
sender.display_name  透過 LINE profile API 取得的顯示名稱
line_timestamp   LINE event 原始時間戳（毫秒），保存原值不改寫
captured_at      本機收到 webhook 的時間，統一以台灣/台北時區（Asia/Taipei, UTC+8）記錄
text             文字內容
```

## 多組 LINE Official Account 共用本機 webhook

一個 LINE Official Account 只能設定一個 webhook URL，但多個 LINE Official Account 可以指向同一個本機公開入口，例如：

```text
https://your-ngrok-domain.ngrok-free.app/webhook
```

本機 server 會用兩種方式辨識是哪一隻 bot：

1. 優先用 `X-Line-Signature` 對所有已設定的 channel secret 逐一驗證。
2. 若開發時跳過簽章，則可用 payload 的 `destination` 搭配 `.env` 裡的 `LINE_BOT_CHANNEL_<ALIAS>_DESTINATION` 判斷。

因此本機測試第二組官方帳號時，可以先把第二組的 Channel secret / access token 放進：

```bash
LINE_BOT_CHANNELS=GAS
LINE_BOT_CHANNEL_GAS_NAME=FALO IM Bot GAS Test
LINE_BOT_CHANNEL_GAS_BASIC_ID=@415taurm
LINE_BOT_CHANNEL_GAS_SECRET=...
LINE_BOT_CHANNEL_GAS_ACCESS_TOKEN=...
```

若第一組仍使用舊版欄位 `LINE_CHANNEL_SECRET` / `LINE_CHANNEL_ACCESS_TOKEN`，server 會同時載入第一組與 `GAS` 這組。

教學重點：手機截圖可以輔助人眼判讀，但系統應以 webhook event 的 `source.type`、`group_id`、`sender.user_id` 和 `line_timestamp` 作為保存依據。

## 回覆模式與免費額度

本 PoC 預設採用資料收集模式：

```text
LINE_BOT_AUTO_REPLY=false
```

這代表 server 仍會回 HTTP 200 給 LINE，讓 webhook 判定成功，但不會再用 Messaging API 對使用者聊天視窗送出「已收到」。

若教學或 demo 需要讓使用者看到確認訊息，可以在 `.env` 改成：

```text
LINE_BOT_AUTO_REPLY=true
```

注意：reply message 依 LINE Developers 文件不列入 Messaging API 方案訊息數，但 push / multicast / broadcast / narrowcast 會列入。此專案目前以資料收集為主，所以預設關閉前端回覆，保留最大安靜度與最低干擾。

## 測試

```bash
python3 -m unittest test_line_bot_server.py
python3 -m py_compile line_bot_server.py
```

## 目前限制

- 只能接收 bot 可見的新事件。
- 不能讀取個人 LINE 既有對話。
- 不能回溯加入 bot 前的群組歷史訊息。
- 本機開發需要 HTTPS tunnel 才能接 LINE 真實 webhook。
- AI parser 尚未接入，第一版先保存 event。

## 平台化路線

本地 PoC 是地端 AI node 的雛形，不是一般使用者要操作的最終產品。

正式服務可拆成：

```text
使用者填入 LINE 必要參數
        ↓
我們的 cloud gateway 接 LINE webhook
        ↓
事件排隊、驗證、分流
        ↓
地端 AI node / Win365 重處理中心
        ↓
管理後台、任務提醒、資料包輸出
```

一般客戶使用雲平台，不需要接觸程式碼；需要私有部署、原始碼、客製資料包格式或企業整合的客戶，才進入高階方案。

## 下一步

1. 接 AI parser，把 `task_candidate`、`risk_candidate`、`knowledge_candidate` 分類後結構化。
2. 加 SQLite / PostgreSQL 儲存。
3. 加 dashboard 查看每個 user/group/room 的事件流。
4. 加 Flex Message 選單，讓使用者標記「任務 / 客戶 / 風險 / 知識」。
5. 加 Gemini / OpenAI 圖片理解，處理報價單、截圖、發票、表單。
