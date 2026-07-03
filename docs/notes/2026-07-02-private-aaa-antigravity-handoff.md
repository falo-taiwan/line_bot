# (Private) FALO IM Watch / LINE Lab - aaa Antigravity 交接說明

Copyright (c) 2026 Falo x Force Cheng. Internal private build.

> 本文件是給 Force 與 aaa / Antigravity 參考開發用的內部交接文件。此版本可以保留實驗參數、架構判斷與商業思路；日後若要對外分享，需再做去機敏版本。

## 1. 目前專案定位

FALO IM Watch 的核心不是「做一隻聊天機器人」，而是把高頻訊息工作場中的 LINE / Telegram / FALO IM 等輸入來源，整理成可以被 AI 協作、任務追蹤、風險偵測與知識管理使用的資料層。

目前 LINE 是最重要的資料來源之一，但不是唯一來源。LINE 的角色更接近「不得不接的現場資料搜集器」；真正的指揮調度、AI cowork 與後續工作流，可以放到 Telegram、FALO 自建 IM、後台戰情中心或其他更彈性的介面。

目前已經跑通並相對穩定的版本是 GAS 版官方帳號 webhook，因此 aaa 接手時請優先以現有 GAS 程式碼為基礎，不要重新發明同一條路。

## 2. 目前穩定基礎：GAS 官方帳號接收層

目前 GAS 版的任務是接第二組 LINE Official Account webhook，將事件標準化後寫入 Google Sheet，並提供 HTML 監看頁與 JSON proxy。

核心檔案：

- `poc/gas_line_bot/Code.gs`
- `poc/gas_line_bot/Index.html`
- `poc/gas_line_bot/README.md`
- `poc/gas_line_bot/GAS_PUSH.command`
- `poc/gas_line_bot/GAS_PULL.command`

目前內部測試資訊：

| 項目 | 值 |
|---|---|
| Bot basic ID | `@415taurm` |
| Sheet ID | `1VWP34oZeUqcYdOfI042SDeHXNNhLKi2vQCYDzAOaDyo` |
| Drive folder ID | `1YMudlXzJYuBgK3gtJt2sPAUvcOc3kQwC` |
| GAS Script ID | `1NJz55_sp90mYwltbbT0vHVCZAPaT3ueBgTjedx3doLpFrDdIRZx2_WwE` |

直覺流程：

```text
LINE Official Account webhook
  -> Google Apps Script Web App /exec
  -> 立即回 200 OK 給 LINE
  -> 事件寫入 Google Sheet
  -> 媒體事件排入處理佇列
  -> 由 worker / trigger 後續抓 LINE media content
  -> 存到 Google Drive
  -> HTML monitor / JSON proxy 提供查詢
  -> 地端 AI Commander 可同步資料
```

重要原則：

- webhook 收到事件後要快速回 `200 OK`，避免 LINE 判定 timeout 或重送。
- 圖片、影片、檔案等媒體不應在 webhook 主流程中慢慢抓，應拆成後續 worker / trigger。
- LINE media content API 可能涉及重新導向與權限檢查，抓檔案時要分清楚「webhook 200 成功」與「媒體下載成功」是兩件事。
- 所有時間顯示與紀錄，專案預設以 `Asia/Taipei` / 台灣時間為主。

## 3. 地端版：Local AI Node / Local Commander

地端版已可做為本機 AI node 與戰情中心的雛形。它的價值是讓使用者可以用本機 Python、Win/Mac、ngrok 與本地儲存先跑出高價值功能，不必一開始就上完整雲平台。

核心檔案：

- `poc/standard_line_bot/line_bot_server.py`
- `poc/standard_line_bot/Start_STANDARD_LINE_BOT.command`
- `poc/standard_line_bot/README.md`

地端版目前概念：

```text
LINE webhook / ngrok
  -> local Python server
  -> events.jsonl
  -> per-chat folder
  -> media files
  -> local admin dashboard
  -> AI Parser / task extraction / KM
```

地端版與 GAS 版未來要保持「資料格式相容」，也就是地端 AI Commander 可以選擇接：

- 本機 webhook
- GAS Sheet / GAS JSON proxy
- 匯入的 LINE 對話紀錄
- 未來 Cloudflare Gateway

## 4. 新增需求：LINE 對話紀錄匯入 + 官方助手整合 KM

這是本次補充的重點。

LINE 官方帳號 webhook 只能接到「Bot 在場且 webhook 啟用後」的新事件。若要補歷史資料、指定群組的過往討論、或某些沒有 Bot 在場的既有資料，就需要支援 LINE 對話紀錄匯入。

建議把資料入口分成三條：

| 入口 | 用途 | 資料特性 |
|---|---|---|
| LINE Official Account webhook | 收新訊息、正式可維護 | 結構化、事件即時、受 LINE 官方限制 |
| 本機 OCR / Local observation | 看使用者原本正在看的畫面 | 適合桌面輔助與特殊情境 |
| LINE 對話紀錄匯入 | 補歷史資料與指定群組長期知識 | 批次匯入、可重跑、適合 KM |

LINE 對話紀錄匯入建議使用 GitHub 上已有的 LINE 訊息解析套件或社群 parser，不要一開始自己手刻全部格式。aaa 接手時可先研究下列方向：

- LINE app 匯出的 `.txt` 對話紀錄格式。
- 不同平台、不同語系匯出格式差異。
- 文字、圖片、貼圖、檔案、語音訊息在匯出檔中的表示方式。
- 現有 GitHub parser 是否支援台灣常見格式與繁體中文時間。

匯入後不要直接混進即時 webhook 表，而是先做一層 `source_type` 標示：

```text
source_type = webhook | gas | local | line_export | manual_import
```

這樣 AI 後續分析時可以知道：

- 這是 LINE 官方 webhook 收到的新訊息。
- 這是使用者匯入的歷史紀錄。
- 這是地端觀測或 OCR 來的資料。
- 這是人工補登的資料。

## 5. 建議的共同資料欄位

不管資料來自 GAS、地端 webhook、OCR 或 LINE export，都要盡量轉成同一個事件模型。

建議欄位：

| 欄位 | 說明 |
|---|---|
| `captured_at` | 系統捕捉時間，台灣時間 |
| `line_timestamp` | LINE 事件原始時間 |
| `source_type` | `webhook` / `gas` / `local` / `line_export` |
| `bot_alias` | 內部 bot / gateway 代號 |
| `bot_name` | 官方帳號或資料來源名稱 |
| `bot_basic_id` | LINE 官方帳號 basic ID |
| `destination` | LINE webhook destination |
| `webhook_event_id` | LINE webhook event id |
| `is_redelivery` | 是否為 LINE 重送 |
| `source_key` | 使用者、群組或匯入批次的穩定 key |
| `user_id` | LINE user id |
| `group_id` | LINE group id |
| `room_id` | LINE room id |
| `message_id` | LINE message id 或匯入事件 id |
| `message_type` | `text` / `image` / `video` / `file` / `sticker` 等 |
| `text` | 文字內容或可讀描述 |
| `media_status` | 媒體下載狀態 |
| `media_drive_url` | 若有存到 Drive，放 Drive 連結 |
| `raw_json` | 原始事件 JSON 或匯入原文片段 |

## 6. KM 與 AI cowork 的理解方式

原始訊息不是知識庫本身。正確流程應該是：

```text
原始訊息
  -> 標準化事件
  -> 對話片段 / thread
  -> 任務、決策、風險、客戶需求、待追蹤事項
  -> 可搜尋 KM
  -> AI cowork / 戰情中心 / 提醒與分派
```

也就是：

- LINE 官方助手負責接新事件。
- 指定群組對話匯入負責補歷史脈絡。
- GAS / Cloudflare / Local node 負責承接與整理。
- AI Commander 負責把訊息變成任務、風險、決策與知識。

## 7. Cloudflare 後續主軸：GAS 雙版並行

後續雲端版可能改以 Cloudflare 作為主軸，GAS 保留為雙版開發。

建議分工：

| 版本 | 適合用途 | 優點 | 限制 |
|---|---|---|---|
| GAS 版 | MVP、Google 生態系、教材、低門檻部署 | 容易理解、Sheet 可直接看、適合小量與內部版 | Apps Script 額度與執行時間限制 |
| Cloudflare 版 | 正式 SaaS gateway、高頻、多租戶、多 webhook | Workers / Queues / D1 / R2 可承受更高流量 | 架構與維運門檻較高 |
| Local node 版 | 地端 AI、Win365、私有環境、桌面輔助 | 貼近使用者電腦與內部資料 | 需處理 ngrok / tunnel / local uptime |

Cloudflare 版可考慮：

- Workers：接 webhook 與 API。
- Queues：把高頻事件排隊處理。
- D1：事件索引與查詢。
- R2：圖片、影片、檔案儲存。
- Durable Objects：需要 per-tenant 狀態或單一聊天室序列化時再用。
- Pages / Zero Trust：管理後台與客戶入口。

## 8. aaa 接手開發優先順序

建議不要一次大改，先從「穩定可用」往外擴。

1. 保留並驗證目前 GAS 版 webhook。
2. 補強 GAS README / HTML 監看頁 / proxy 狀態顯示。
3. 做 LINE export import adapter，先只支援文字。
4. 將匯入事件寫入同一套 normalized schema。
5. 地端 AI Commander 支援來源切換：local / GAS / import。
6. 補 Cloudflare gateway 的最小 PoC，不急著取代 GAS。
7. 再做媒體、圖片、檔案與跨群組 KM 分析。

## 9. 不建議做的事

- 不建議使用 LINE 非官方 userbot / 逆向協議作為正式路線，封號與維護風險太高。
- 不建議把 NotebookLM 當 source-of-truth；它可以是閱讀與摘要工具，但資料主體仍應在 Sheet、local warehouse、D1/R2 或其他可控儲存。
- 不建議把 webhook 新資料與匯入歷史資料混在一起而不標示來源。
- 不建議在 webhook 主流程中做長時間媒體下載或 AI 分析。

## 10. 對外版提醒

此文件是 Private 內部版。若要對外分享，至少要移除或替換：

- Sheet ID、Drive folder ID、Script ID。
- 具體 ngrok URL、token、secret、內部部署細節。
- 商業策略、合作夥伴顧慮與私有部署定價想法。
- 任何真實客戶、群組、使用者 ID 或訊息內容。

---

Digital watermark: FALO_IM_WATCH_PRIVATE_AAA_HANDOFF_20260702_FORCE_CHENG

