# 本地 Python 伺服器配置之雙 LINE Bot 規格說明

本文件記錄目前地端 Python 伺服器 (.env 設定檔) 中配置的兩隻 LINE Bot 管道，可作為 AI 協作分析 (KM) 與系統部署之參考。

---

## 1. 機器人規格清單

### 📢 地端延伸開發主力 Bot：機器人一 (default)
> [!IMPORTANT]
> 專案延伸開發將以此預設機器人（@145qjpih）為主要開發對象。

### 🤖 機器人一：FALO IM Bot Test (預設 Bot)
* **機器人名稱**：`FALO IM Bot Test`
* **頻道別名 (Bot Alias)**：`default`
* **Basic ID**：`@145qjpih`
* **系統金鑰配置**：
  * 頻道密鑰 (Channel Secret)：`LINE_CHANNEL_SECRET`
  * 存取權杖 (Channel Access Token)：`LINE_CHANNEL_ACCESS_TOKEN`
* **地端儲存目錄**：`out/standard-line-bot/chats/default/`

### 🤖 機器人二：FALO IM Bot GAS Test (GAS 通道 Bot)
* **機器人名稱**：`FALO IM Bot GAS Test`
* **頻道別名 (Bot Alias)**：`gas`
* **Basic ID**：`@415taurm`
* **系統金鑰配置**：
  * 頻道密鑰 (Channel Secret)：`LINE_BOT_CHANNEL_GAS_SECRET`
  * 存取權杖 (Channel Access Token)：`LINE_BOT_CHANNEL_GAS_ACCESS_TOKEN`
* **地端儲存目錄**：`out/standard-line-bot/chats/gas/`

---

## 2. 目錄隔離儲架構

地端 Webhook 接收器在收到不同 LINE 機器人的事件時，會自動透過 `get_chat_dir` 進行分流：

```text
out/standard-line-bot/chats/
├── default/                  # 機器人一 (@145qjpih) 的所有對話視窗
│   └── group_xxxxx/          # 專屬群組對話記錄
│       ├── manifest.json
│       └── events.jsonl
├── gas/                      # 機器人二 (@415taurm) 的所有對話視窗
│   └── group_yyyyy/          # 專屬群組對話記錄
│       ├── manifest.json
│       └── events.jsonl
└── imported/                 # 使用者手動匯出並匯入的歷史對話
    └── force-群備份001/
        ├── manifest.json
        └── events.jsonl
```

---

## 3. 本地端服務調用資訊

* **Webhook 接收路徑**：`http://127.0.0.1:8088/webhook`
* **後台管理端點**：
  * 本機後台主網頁：`http://127.0.0.1:8088/admin`
  * 開發控制台：`http://127.0.0.1:8088/dev-console`
  * AI 協同分析頁面：`http://127.0.0.1:8088/ai-coworker` (可在此直接勾選 default、gas 與 imported 進行交叉分析與時間切片)
