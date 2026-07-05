# GAS 前端只有授權 Google 帳號可看：Debug 報告

日期：2026-07-05

## 1. 這是什麼問題

目前的問題不是「LINE webhook 沒有回應」，也不是「Google Sheet 一定沒有權限」。

比較精準的描述是：

> GAS Web App 的 `/exec` 後端可以被匿名 HTTP client 取得 HTML，但某些瀏覽器、手機、私密視窗或非部署者 Google 帳號，無法穩定載入 GAS 的 HTML 前端。

也就是說，問題發生在「GAS HTML 前端被 Google 外框載入」這一層，而不是單純發生在資料庫、LINE 或 API token。

## 2. 已驗證現象

| 檢查項目 | 結果 | 代表意義 |
| --- | --- | --- |
| debug notes 內的目標 `/exec` URL | `curl -L` 可取得 `200 text/html` | 這個部署 URL 本身不是完全私有或不存在 |
| 目標 URL 回傳內容 | HTML title 是 `Falo IM v2.x Diagnostics Dashboard` | GAS 有回傳診斷前端 |
| 本機 `clasp deployments` | 沒有列出 debug notes 目標 deployment id | 本機 `clasp` 目前指向的 Apps Script 專案，可能不是正在測的那個公開部署 |
| 另一個本機 HEAD deployment | 會導向 Google 登入 | 該部署不是公開匿名可讀，或不是正式 `/exec` 公開版本 |
| 另一個本機 v2 deployment | 回 404 | 可能是舊部署、已失效部署，或部署設定不完整 |

## 3. 最可能根因

### 根因 A：GAS HtmlService 前端依賴 Google 外框與帳號狀態

Apps Script 的 HTML 前端不是普通靜態網頁。

直覺理解：

```text
使用者瀏覽器
  -> script.google.com 的 Web App 外框
  -> script.googleusercontent.com 的 iframe 內容
  -> google.script.run 呼叫 GAS 後端函式
  -> Google Sheet / Drive
```

這中間會受到下列因素影響：

- 使用者目前登入哪一個 Google 帳號。
- 瀏覽器是否阻擋第三方 cookie。
- 手機瀏覽器、LINE 內建瀏覽器、Safari 私密模式的追蹤防護。
- 公司或學校 Google Workspace 是否禁止外部 Apps Script。

所以會出現一種很迷惑的情況：

> 後端 HTTP 測試成功，但人在瀏覽器打開時失敗。

### 根因 B：本機 `clasp` 專案與目前測試 URL 不一致

目前本機 `clasp deployments` 列出的 deployment id，沒有 debug notes 裡的目標 id。

這表示至少要先釐清：

| 問題 | 為什麼重要 |
| --- | --- |
| 目前 LINE / 使用者正在打開哪一個 `/exec` URL？ | 避免修 A 專案，測 B 專案 |
| 本機 `.clasp.json` 指向哪個 Script ID？ | `clasp push` 只會推到這個專案 |
| Apps Script UI 裡正式部署是哪一個版本？ | `clasp push` 不等於重新部署 Web App |

## 4. 短期修復檢查表

先不要改程式碼，先做部署層確認。

1. 在 Apps Script 編輯器打開正在使用的專案。
2. 到 `Deploy -> Manage deployments`。
3. 編輯正式 Web App deployment。
4. 設定：

```text
Execute as: Me
Who has access: Anyone
Version: New version
```

5. 按 `Deploy` 後，複製新的 `/exec` URL。
6. 不要用 `/dev` URL 給一般使用者測試。
7. 用三種方式測：

```bash
curl -L "<WEB_APP_EXEC_URL>"
```

```text
Chrome 無痕視窗，不登入 Google 帳號
```

```text
手機瀏覽器外部開啟，不從 LINE 內建瀏覽器開
```

如果 `curl` 成功、無痕或手機失敗，代表部署已公開，但 GAS HTML 前端仍受 Google 瀏覽器外框限制。

## 5. 建議架構修正

長期不要把「公開給客戶看的前端」放在 GAS HtmlService。

比較穩定的架構是：

```text
使用者
  -> Cloudflare Pages 靜態前端
  -> Cloudflare Worker API proxy
  -> GAS Web App JSON API
  -> 私有 Google Sheet / Drive
```

模組分工：

| 模組 | 責任 | 是否公開給一般使用者 |
| --- | --- | --- |
| Cloudflare Pages | 顯示診斷頁、教學頁、操作介面 | 是 |
| Cloudflare Worker | 代理 API、保護 token、處理 CORS | 是，但 token 不外露 |
| GAS Web App | 只當 Google Sheet / Drive gateway | 不直接給一般使用者開 |
| Google Sheet / Drive | 儲存資料與附件 | 私有 |

這樣可以保留 GAS 的優點：

- 客戶可以理解 Google Sheet 是資料落點。
- GAS 可以穩定存取私有 Sheet / Drive。
- 系統不用一開始就上重型資料庫。

同時避開 GAS HtmlService 的弱點：

- 手機瀏覽器相容性。
- Google 多帳號衝突。
- 第三方 cookie / iframe 限制。
- Workspace 政策阻擋。

## 6. 最小可行版本

MVP 不需要一次重做整套系統。

建議分兩步：

### 第一步：GAS 保留 API，不當公開前端

GAS 只保留：

```text
GET /exec?action=query&token=...
GET /exec?action=get_chats&token=...
GET /exec?action=config&token=...
POST /exec?token=...
```

前端診斷頁先只給內部帳號使用。

### 第二步：新增 Cloudflare Worker proxy

Worker 負責：

- 接收前端請求。
- 從 Worker secret 讀取 GAS URL 與 token。
- server-to-server 呼叫 GAS。
- 回傳 JSON 給 Cloudflare Pages 前端。

這樣使用者看到的是 Cloudflare 頁面，不直接碰 GAS HTML。

## 7. 本次 debug 結論

目前最合理的結論是：

> 這不是 Google Sheet 沒分享，也不是 Code.gs 的 `doGet` 不會回前端；真正風險在 GAS HtmlService 前端的公開瀏覽器相容性，以及目前本機 `clasp` 指向的 deployment 與實測 URL 不一致。

短期先重新確認正式 `/exec` deployment。

長期建議把公開前端搬到 Cloudflare Pages，把 GAS 降級為私有資料 gateway。

