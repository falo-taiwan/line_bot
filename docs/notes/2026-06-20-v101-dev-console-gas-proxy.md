# (Private) v1.01 更新說明

版本：v1.01

標示：Falo x Force Cheng 2026/6/20

狀態：內部自用開發版，先不傳 FALO / GitHub。

## 本版目標

把本機 webhook 與 GAS proxy 放在同一個地端開發控制台，方便測試兩種 LINE webhook 接入模式：

```text
LINE -> ngrok -> 本機 webhook -> events.jsonl
LINE -> GAS Web App -> Google Sheet -> 本機 GAS proxy / HTML 前端
```

## 新增功能

- 新增開發控制台：`http://127.0.0.1:8765/dev-console`
- 登入後可在同一頁查看本機 webhook 事件與 GAS proxy 事件。
- 可在前端填寫 GAS `exec` URL，並透過本機 `/gas-proxy/*` 讀取該 GAS 的資料。
- 可在前端填寫 Google Sheet URL，登入後一鍵打開對應 Sheet。
- 新增 `/ngrok-status` API，可手動刷新 ngrok 狀態。
- 後端定時記錄 ngrok 狀態到 `out/standard-line-bot/ngrok_status.jsonl`。
- 前端每 15 秒刷新 GAS / ngrok 狀態，並提供手動更新全部。
- 一鍵啟動檔會同時打開登入頁、開發控制台與 GAS monitor。

## 教材與標示

- `docs/tutorials/standard_line_bot_poc.md` 已加入 v1.01 教學段落。
- `docs/tutorials/standard_line_bot_poc.html` 已加入 v1.01 展示段落。
- HTML 加入 `noindex`、版本資訊、備註與隱形浮水印。

## 使用提醒

這一版是開發環境優先，不是對外公開版。內部版可以保留完整脈絡與機密資訊；後續若要對外分享，應另做去機敏版本。
