# 標準 LINE Bot PoC 截圖清單

日期：2026-06-18

本文件用來配合現場操作，把每一步需要截圖的畫面先記下來，後續可整理進正式教材或 HTML。

## Step 1：建立或確認 LINE Official Account

截圖建議：

- LINE Official Account Manager 首頁或帳號列表。
- 進入指定 Official Account 後的帳號設定畫面。
- 若是新建帳號，截建立表單完成前後畫面。

本次紀錄：

- 已建立帳號：`FALO IM Bot Test`。
- 已截圖：建立帳號表單畫面。
- 已截圖：申請完成畫面。
- 基本 ID：`@145qjpih`。

備註：

- 目前 LINE 官方文件建議先建立 LINE Official Account，再啟用 Messaging API。
- Messaging API channel 不再適合從 Developers Console 直接新建，需從 Official Account 啟用流程進入。

## Step 2：啟用 Messaging API

截圖建議：

- Official Account 設定中的 Messaging API 頁。
- Enable Messaging API 按鈕或啟用後狀態。
- Provider 選擇畫面。
- 條款或資料使用同意畫面。

本次紀錄：

- 已截圖：`同意我們使用您的資訊`。
- 已截圖：`LINE官方帳號使用條款更新啟事`。
- 已截圖：Official Account Manager 設定中的 `Messaging API` 頁面，狀態為 `未使用`。
- 已截圖：啟用 Messaging API 時的 `選擇服務提供者` 對話框。

## Step 3：進入 LINE Developers Console

截圖建議：

- Provider 列表。
- Messaging API channel 頁面。
- Basic settings 頁面。

本次紀錄：

- 已截圖：LINE Developers Console Provider 列表。
- 已看到 Provider：`FALO IM Lab`。
- 已截圖：`FALO IM Lab` Provider 中的 Channels 列表。
- 已截圖：`FALO IM Bot Test` Channel 的 Basic settings 頁。
- 已截圖：Basic settings 底部，包含 Channel secret 與 Your user ID 區塊。

## Step 4：取得 Channel Secret 與 Channel Access Token

截圖建議：

- Channel secret 位置。
- Messaging API 分頁。
- Channel access token 發行區塊。

注意：

- 截圖時請遮住完整 secret / token。
- 教材可保留前後 4 碼作為示意。
- 若完整 secret / token 曾被截圖或貼到對話中，後續正式使用前應重新發行或更換。

本次紀錄：

- 已截圖：Messaging API 啟用完成頁。
- 已看到：Channel ID、Channel secret、Webhook URL 欄位。
- 注意：本次原始截圖包含完整 Channel secret，教材整理時必須遮罩。
- 已截圖：LINE Developers Console 的 Messaging API 分頁。
- 已截圖：Webhook settings 與 LINE Official Account features 區塊。
- 已截圖：`Channel access token (long-lived)` 尚未發行，顯示 `Issue` 按鈕。
- 已截圖：`Channel access token (long-lived)` 發行完成。
- 已複製：Channel secret。
- 已複製：Channel access token。

## Step 5：啟動本機 webhook server

截圖建議：

- Terminal 啟動 `python3 line_bot_server.py`。
- `/health` 回應畫面。

本次紀錄：

- 已建立 `.env`。
- 已設定本機 `.gitignore` 忽略 `.env` 與 `out/`。
- 已啟動 webhook server：`http://127.0.0.1:8088/webhook`。
- 已完成 `/health` 檢查。
- 已送出一筆帶簽章的本機假 webhook。
- 已確認 `events.jsonl` 寫入 `task_candidate`。

## Step 6：建立 HTTPS tunnel

截圖建議：

- tunnel 啟動成功畫面。
- 公開 HTTPS URL。

本次紀錄：

- 使用既有 ngrok endpoint。
- 公開 HTTPS URL：`https://conclude-reapply-backhand.ngrok-free.dev`
- 本機 server port 改用 `8765`。
- 已確認公開 `/health` 可回應。

## Step 7：設定 Webhook URL

截圖建議：

- LINE Developers Console 的 Webhook settings。
- 填入 `https://.../webhook`。
- Verify 成功。
- Use webhook 開啟。

本次紀錄：

- 已填入 Webhook URL：`https://conclude-reapply-backhand.ngrok-free.dev/webhook`。
- 第一次 Verify 回 `403 Forbidden`，原因是 Channel secret 不一致。
- 已重新發行並更新 Channel secret。
- 已重新啟動本機 webhook server。
- 已重新 Verify 成功。
- 已截圖：`Use webhook` 已開啟。
- 已截圖：啟用 `Webhook redelivery` 前的注意事項視窗。
- 已截圖：Webhook settings 的 `Success` 視窗。
- 已截圖：`Webhook redelivery` 已開啟。

## Step 8：手機實測文字與圖片

截圖建議：

- LINE App 加好友 QR code。
- 傳文字給 bot。
- bot 回覆已收到。
- 傳圖片給 bot。
- 後端 terminal / events.jsonl / media 資料夾結果。

本次紀錄：

- 已截圖：Developers Console 的 bot QR code。
- 已截圖：手機 LINE 掃描後的 `FALO IM Bot Test` 加好友頁。
- 已截圖：手機 LINE 進入 bot 聊天室。
- 已收到 `follow` webhook event。
- 已確認地端 server 對 `follow` 事件回覆：`已收到事件，後端已記錄。`
- 已截圖：手機傳送 `Hi` 給 bot。
- 已收到 `message_text` webhook event。
- 已確認地端 server 回覆：`已收到文字：Hi`。
- 注意：LINE OA 內建自動回覆也有回覆長訊息，後續正式測試建議關閉 OA 內建自動回覆，只保留後端 webhook 回覆。
- 已完成 Push API 測試：後端主動發送 `AI message test` 給剛剛加好友的 user。
- Push API 回應成功，message id：`618999145889530397`。
- 已截圖：手機收到 `AI message test` 主動推播。
- 已截圖：手機傳送任務測試文字。
- 已收到 `task_candidate` webhook event。
- 已確認地端 server 回覆：`已收到文字：任務 owner=Force due=明天下午 確認報價單`。
- 後續調整：本專案目標以資料收集為主，地端 server 改成預設不回覆前端，只回 HTTP 200 給 LINE webhook。
- 教材說明：接收 webhook 不消耗 LINE 官方帳號方案訊息數；主動送出的 push / multicast / broadcast / narrowcast 會列入方案訊息數。Reply message 依 LINE Developers 文件不列入 Messaging API 方案訊息數，但本 PoC 仍預設關閉，以降低干擾。

## Step 8B：關閉 LINE OA 內建自動回覆

截圖建議：

- Official Account Manager 的 `自動回應訊息` 頁。
- `回應設定` 頁，顯示 `自動回應訊息` 開啟狀態。
- 關閉後狀態。

本次紀錄：

- 已截圖：`自動回應訊息` 原本為使用中。
- 已截圖：`回應設定` 中 `自動回應訊息` 開啟。
- 已關閉：`自動回應訊息`。
- 已截圖：`自動回應訊息` 顯示停止中。
- 已同步調整地端 server：`LINE_BOT_AUTO_REPLY=false`，避免測試群組時對前端洗版。

## Step 9：群組加入與安全原則

截圖建議：

- LINE Developers Console 的 `Allow bot to join group chats` 設定位置。
- LINE Official Account Manager 的 `帳號設定` / `功能切換`。
- 切換為 `接受邀請加入群組或多人聊天室` 的確認視窗。
- 群組成員列表中 bot 顯示為成員的畫面。
- 點入 bot 個人頁後，顯示官方帳號 / bot 形態的畫面。
- LINE App 中將 bot 邀請進測試群組的畫面。
- 測試群組中的告知訊息。
- 群組內傳測試文字。
- 後端 `events.jsonl` 中 source type 為 `group` 的事件。

本次紀錄：

- 已截圖：Developers Console 顯示 `Allow bot to join group chats` 原本為 `Disabled`。
- 已截圖：Official Account Manager `帳號設定` 中，`加入群組或多人聊天室` 原本為不接受邀請。
- 已點選：`接受邀請加入群組或多人聊天室`。
- 已截圖：變更設定確認視窗。
- 已觀察：群組成員列表中 bot 會列為一名成員，但差異不一定非常醒目；點入 bot 頁面後較能看出它是官方帳號 / bot。
- 已收到第一筆群組 `join` event，source type 為 `group`。
- 已收到群組文字測試：`test 1`，source type 為 `group`，group id 為 `C3f176d059bd5871cd34bc9ec7c84a0d0`，sender user id 為 `U184e1758bd653e1b21319e803af1a445`。
- 已用 LINE profile API 反查群組 sender，display name 為 `鄭Force`。
- 已收到另一筆文字：`Test 2`，但 source type 為 `user`，不是群組事件；profile display name 為 `小火花`。
- 教材重點：判斷訊息來源必須看 webhook event 的 `source.type`，不能只靠手機畫面直覺判斷。正式保存時需存 userId、display name、groupId、文字內容、LINE timestamp、captured timestamp。

群組安全原則：

- 只加入明確指定的測試群組。
- 群組成員需知道 bot 存在。
- 不應假設所有新進群組成員都能一眼分辨 bot 正在接收 webhook；需用群組公告或 bot 自我介紹再次告知。
- bot 只處理加入後的新訊息，不宣稱能讀歷史。
- 先用測試群，不直接放進真實客戶或正式工作群。
- 教材截圖若包含群組成員名稱、頭像、訊息內容，需先確認可內部使用或遮罩。
- 若未來接 AI，需明確標示資料是否會送到雲端模型。
