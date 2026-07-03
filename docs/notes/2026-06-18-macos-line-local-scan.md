# 2026-06-18 macOS LINE Local Scan

## 目的

本筆記紀錄 macOS LINE 本機資料夾的初步 read-only 盤點。

本次研究目標不是破解 LINE，也不是修改 LINE，而是找出「Observer-only Agent」可研究的資料入口。

## 安全邊界

本次採用 Force 明確定義的安全邊界：

```text
Observer-only / Read-only / No mutation
```

具體限制：

- 不修改 LINE 檔案。
- 不更新 LINE 資料庫。
- 不刪除 LINE 快取或訊息。
- 不讀取 Token / Cookie / Session。
- 可做解密研究，但必須只針對 LINE 原始資料夾外部的 clone / snapshot。
- 不在 LINE 原始資料夾內做任何解密、修復、寫入或轉檔。
- 不寫回 LINE app 或 LINE 本機資料夾。
- 只在 LINE 外部產生研究筆記、事件資料與 AI Note 素材。

## 解密研究補充邊界

Force 允許做解密研究，但條件是：

```text
需要解密時，先 clone 一份到外部暫存區，再對 clone 實驗。
```

本次建立的外部快照：

```text
/private/tmp/falo-line-readonly-snapshot-20260618-164429/db
```

快照來源：

```text
/Users/force/Library/Containers/jp.naver.line.mac/Data/Library/Containers/jp.naver.line/Data/db
```

後續所有 schema、SQLCipher、格式辨識、差異比對都應只對 `/private/tmp/...` 的 clone 執行。

## 掃描到的主要路徑

### App Container

```text
/Users/force/Library/Containers/jp.naver.line.mac
```

觀察：

- 約 831MB。
- 包含 LINE macOS app container。
- 內部有 Preferences、WebKit、HTTPStorages、Caches、Cookies、Saved Application State。
- 其中 `Data/Library/Containers/jp.naver.line/Data/db` 是目前最值得研究的資料夾。

### Group Container

```text
/Users/force/Library/Group Containers/VUTU7AKEUR.jp.naver.line.mac
```

觀察：

- 約 7.5GB。
- 主要包含 `Real/Library/Data`、`Sticker`、`Sticon`、`Caches`、`tmp`、`share`。
- 大量內容是貼圖、sticon、媒體快取與 `.eimg` 檔。
- 目前看起來比較像媒體與資源快取，不是第一優先訊息解析入口。

## 值得研究的 db 目錄

```text
/Users/force/Library/Containers/jp.naver.line.mac/Data/Library/Containers/jp.naver.line/Data/db
```

初步檔案觀察：

```text
qw7c05376fc7ace69d98f032eca6b860.edb        約 705MB
qw7c05376fc7ace69d98f032eca6b860.edb-wal    約 9.3MB
qw7c05376fc7ace69d98f032eca6b860.edb-shm    約 32KB
qw891f6238edf34c4cd2b49fd6070ea0.edb        約 2.7MB
chatStats_*.edb                              小型統計資料候選
album_*.edb                                  相簿資料候選
keep_*.edb                                   保留或 pin 類資料候選
```

`file` 指令觀察：

- `.edb` 主檔被辨識為 generic `data`。
- `.edb-wal` 被辨識為 `SQLite Write-Ahead Log`。
- 直接用 `sqlite3` 開啟主 `.edb` 顯示 `file is not a database`。

初步推論：

- LINE macOS 的主訊息資料可能不是一般明文 SQLite。
- `.edb` 可能是加密、包裝或自訂格式。
- `.edb-wal` 顯示 SQLite WAL 特徵，但不能代表主庫可直接合法解析。

## 其他可讀但非訊息主入口

### Sticker metadata SQLite

```text
/Users/force/Library/Containers/jp.naver.line.mac/Data/Library/Containers/jp.naver.line/Data/db/f59c00309acd23908b1254ee081d8258
```

觀察：

- 可被 `sqlite3` 開啟。
- schema 顯示為 sticker / sticon metadata。
- 不像聊天訊息主資料。

### WebKit / HTTP Storage

```text
Data/Library/WebKit/WebsiteData/ResourceLoadStatistics/*.db
Data/Library/HTTPStorages/jp.naver.line.mac/httpstorages.sqlite
```

觀察：

- 這些是 WebKit 或 HTTP storage 類資料。
- 不應作為訊息解析主入口。
- 其中 Cookies / HTTP storage 涉及敏感資料，Observer-only agent 不應讀取內容。

## 初步結論

目前 macOS LINE 本機資料的路線可以分三層：

1. **安全可先做**
   - 匯出聊天紀錄 parser。
   - OCR / Accessibility 觀察可見畫面。
   - read-only 盤點資料夾結構、檔案類型、大小、修改時間。

2. **可研究但需保守**
   - `.edb` 檔案格式辨識。
   - `.edb-wal` 與主 `.edb` 的關係。
   - `chatStats_*.edb` 是否只含統計資料。

3. **暫不做**
   - 在 LINE 原始資料夾內解密、修復、轉檔或寫入。
   - 取得或輸出 Token / Cookie / Session。
   - 讀取 Token / Cookie / Session。
   - 修改、更新、刪除 LINE 本機資料。
   - 寫回 LINE DB 或快取。

## 下一步建議

優先做兩條平行 PoC：

1. **Exported Chat Parser**
   - 使用者手動從 LINE 匯出聊天紀錄。
   - Parser 轉成 JSONL event。
   - 輸出 AI Note-ready Markdown。

2. **Observer Scanner**
   - 只讀 LINE 本機資料夾。
   - 產生資料夾摘要報告。
   - 標記可研究、需避免、疑似敏感的區域。
   - 不讀取訊息內容、不修改任何 LINE 檔案。

3. **Workflow-driven Trace**
   - Force 執行一個明確 LINE 工作流，例如傳送文字、接收圖片、標記 keep、下載檔案。
   - Observer 在工作流前後各做一次外部 snapshot。
   - 比對檔案大小、mtime、WAL 變化、cache 變化。
   - 用差異來推測「哪個動作影響哪個資料區」。
   - 不攔截 TLS、不做 MITM、不偷 Token、不修改 LINE。
