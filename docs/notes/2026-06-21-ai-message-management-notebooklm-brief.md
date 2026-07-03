# AI Message Management × NotebookLM 架構備忘

版本：2026-06-21  
用途：給 AI / NotebookLM / 協作者閱讀的 source-of-truth 草案  
對象：smf、後續協作 AI、FALO IM / LINE Lab 開發者  

---

## 1. 一句話定位

本架構的目標，是把 LINE Monitor、LINE Official Account、LINE 匯出檔等來源取得的訊息，整理成本地可保存、可查核、可人工接手的資料倉庫，再產出適合 NotebookLM 使用的來源文件。

NotebookLM 不是資料倉庫本身，而是「可問答的知識副本」。

核心原則：

```text
LINE 資料來源
  ↓
本地中控 ETL
  ↓
本地資料倉庫
  ↓
NotebookLM source files
  ↓
NotebookLM 問答 / 摘要 / 教材化
```

---

## 2. 目前討論到的資料來源

目前先承認三種資料來源都有效：

| 資料來源 | 說明 | 適合用途 |
|---|---|---|
| LINE Official Account / Bot | 官方帳號進駐群組後收到的訊息 | 即時監控、單群 / 多群摘要 |
| LINE Monitor | 本地授權觀察或其他合法監控來源 | 本地事件化、PoC、教學展示 |
| LINE 匯出 txt | 使用者手動匯出的歷史對話紀錄 | 歷史補資料、測試 parser、建立案例 |

重要邊界：

- Receive / Store 可以自動。
- Analyze / Classify 可以自動。
- Reply / Push 初期應由人工確認。

本系統第一階段不是自動客服，而是「AI 訊息管理助理」。

---

## 3. 本地中控程式的角色

本地中控程式不是單純上傳工具，而是：

> ETL + Local Data Warehouse + 操作中控台

它負責：

| 職責 | 說明 |
|---|---|
| Extract | 從 LINE Monitor、官方帳號 webhook、LINE 匯出 txt 取得資料 |
| Transform | 解析、標準化、依日期拆檔、產生 latest memo |
| Load | 放進本地倉庫、NotebookLM incoming folder、或 command package |
| Audit | 保留原始檔、處理紀錄、hash、manifest、upload log |
| Recovery | 程式故障時，人工仍可打開檔案手動操作 |
| Governance | 決定哪些資料能送 AI，哪些要遮蔽或人工覆核 |

關鍵原則：

> Automation optional, data durable.  
> 自動化可以停，但資料必須耐用、可讀、可搬移、可人工接手。

---

## 4. 本地資料倉庫建議

本地倉庫是 source of truth。NotebookLM 只是從這裡產生的可問答副本。

建議目錄：

```text
line_data_warehouse/
  raw/
    exports/
      [LINE]Formosa-寶島四公子.txt
    monitor/
      2026-06-21.jsonl

  normalized/
    Formosa-寶島四公子/
      messages.jsonl
      messages.csv

  notebook_sources/
    Formosa-寶島四公子/
      00_LINE_Formosa_instruction.md
      01_LINE_Formosa_latest_memo.md
      LINE_Formosa_2026-06-19.md
      LINE_Formosa_2026-06-20.md
      LINE_Formosa_2026-06-21.md

  command_packages/
    cmd_upload_Formosa_2026-06-21.json

  evidence/
    Formosa-寶島四公子/
      2026-06-21/
        manifest.json
        source_files/

  logs/
    etl_log.jsonl
    upload_log.csv
```

後續可再設計一份 Google Drive / Google Cloud 備份，但那是下一層備援 topic，不混入第一階段 MVP。

---

## 5. NotebookLM 資料本策略

NotebookLM 裡面建議放三類來源：

| 檔案類型 | 角色 | 替換策略 |
|---|---|---|
| `00_*_instruction.md` | 固定指示檔，告訴 NotebookLM 如何理解資料 | 少改，必要時替換 |
| `01_*_latest_memo.md` | 最新狀態、待辦、目前重點與 AI 回答指令 | 永遠同名替換 |
| `LINE_*_YYYY-MM-DD.md` | 每日訊息紀錄與摘要 | 當日可替換，過去逐步凍結 |

建議命名：

```text
00_LINE_Formosa_instruction.md
01_LINE_Formosa_latest_memo.md
LINE_Formosa_2026-06-19.md
LINE_Formosa_2026-06-20.md
LINE_Formosa_2026-06-21.md
```

如果是重要群組，建議：

```text
每個重要 LINE 群 = 一個 NotebookLM 資料本
每日跨群摘要 = 另一個總覽 NotebookLM 資料本
```

---

## 6. Latest Memo + Daily Source Strategy

本架構目前採用：

> Latest Memo + Daily Source Strategy  
> 最新狀態 Memo + 每日來源檔策略

兩種檔案回答不同問題：

| 檔案 | 回答的問題 |
|---|---|
| `latest_memo.md` | 現在狀態是什麼？哪些事情待處理？AI 回答要遵守什麼？ |
| `daily_YYYY-MM-DD.md` | 那一天發生了什麼？誰說了什麼？細節在哪裡？ |

替換規則：

| 檔案 | 是否替換 | 說明 |
|---|---|---|
| latest memo | 永遠替換 | 永遠代表最新狀態 |
| 今天的 daily file | 可反覆替換 | 今日訊息持續增加 |
| 昨天的 daily file | 可短期修正 | 補資料或校正 |
| 更早日期檔 | 盡量凍結 | 保持歷史穩定 |
| weekly / monthly summary | 可週期性結算 | 作為高階摘要 |

---

## 7. 指示檔範本

```md
# LINE 群組資料本使用指示

本資料本用來管理 LINE 群組「Formosa-寶島四公子」的訊息紀錄。

## 檔案類型說明

1. 最新狀態檔
   - 檔名通常包含 `latest_memo`
   - 代表目前最新狀態、待處理事項、重要判斷與 AI 回答原則
   - 回答問題時應優先參考

2. 日期記錄檔
   - 檔名格式通常為 `LINE_Formosa_YYYY-MM-DD.md`
   - 代表特定日期的群組對話整理
   - 用來查證細節、時間、人物與原始脈絡

## 回答優先順序

1. 先閱讀 `latest_memo`，確認目前狀態與待辦。
2. 再回查相關日期檔案，確認細節與來源。
3. 如果 latest memo 與日期檔案看起來不一致，請說明差異，並以 latest memo 作為目前狀態。
4. 若問題涉及「今天、最近、目前」，請優先使用 latest memo。
5. 若問題涉及「某一天發生什麼事」，請優先使用對應日期檔案。

## 注意事項

本資料本是訊息管理用途，不是自動回覆系統。
若需要對 LINE 群組回覆，請只提供建議草稿，不要假設已經自動送出。
```

---

## 8. Latest Memo 範本

```md
# LINE 群組最新 Memo：Formosa-寶島四公子

更新時間：2026-06-21 20:00
資料範圍：2026-06-19 至 2026-06-21
狀態：持續更新中

## 目前重點

- 本群近期主要是日常互動、圖片分享、連結分享與輕鬆聊天。
- 曾出現與 LINE 技術限制、官方帳號運用、AI coding 有關的討論。
- 這些內容可作為「LINE 訊息管理與 AI 整合」的教學案例。

## 尚未處理事項

| 狀態 | 事項 | 來源日期 |
|---|---|---|
| open | 設計 LINE 匯出檔解析流程 | 2026-06-21 |
| open | 設計每日檔案替換策略 | 2026-06-21 |
| open | 設計 latest memo + daily source 的 NotebookLM 問答邏輯 | 2026-06-21 |

## 重要判斷

- 每日日期檔案適合保存歷史細節。
- latest memo 應作為 NotebookLM 回答「目前狀態」時的優先依據。
- AI 可以做摘要、分類與建議，但不應直接自動代表官方帳號回覆 LINE 群。
```

---

## 9. Prepared Prompt 範本

這段 prompt 是拿來問 NotebookLM 的，不是 source file。

```text
請你依照本資料本中的檔案邏輯回答問題。

請先閱讀指示檔案，理解：
1. latest_memo 是最新狀態與目前指令。
2. 日期檔案是每日歷史紀錄與細節來源。
3. 回答目前狀態時，請優先參考 latest_memo。
4. 回答特定日期事件時，請回查對應日期檔案。
5. 如果 latest_memo 與日期檔案有差異，請明確說明差異。

現在請幫我整理：

「Formosa-寶島四公子」這個 LINE 群在目前資料範圍內的最新狀態、主要討論主題、待處理事項，以及哪些內容適合整理成 AI Message Management 的教學案例。

請用以下格式回答：

一、最新狀態
二、主要討論主題
三、待處理事項
四、可轉成教材的內容
五、需要人工判斷或補充的地方
六、你參考了哪些檔案
```

---

## 10. 和 AI_NotebookLM 專案的接法

可參考：

```text
/Users/force/Google_Antigravity/AI_NotebookLM/v2
```

它已有的能力：

| AI_NotebookLM 模組 | 可用於本架構 |
|---|---|
| `runtime_server.py` | 本地 runtime、queue、log、NotebookLM CLI 包裝 |
| `file_pipeline.py` | 檔案掃描、Excel / CSV 整理 |
| Command Package | 用 JSON 指定上傳資料夾與目標 project |
| incoming watcher | 監看 incoming folder，產生上傳任務 |
| evidence copy | 上傳前保留證據副本 |
| `/api/multichat/ask` | 對指定 NotebookLM 資料本提問 |

LINE 端只要產生乾淨的 NotebookLM source files，放進 incoming folder 或透過 command package 指定資料夾，就能接上 NotebookLM runtime。

---

## 11. 人工備援流程

即使中控程式壞掉，人工也要能接手：

```text
1. 打開本地資料倉庫。
2. 進入 notebook_sources/群名/。
3. 找到 00 instruction、01 latest memo、今天的 daily file。
4. 手動上傳或替換到 NotebookLM。
5. 在 upload_log.csv 或人工紀錄補上操作時間與操作者。
```

這代表資料格式必須人類可讀：

- `.md`：給人與 NotebookLM 讀。
- `.csv`：給 Excel / Google Sheets 讀。
- `.jsonl`：給系統與 AI pipeline 讀。
- `manifest.json`：給 audit / recovery 追蹤。

---

## 12. 下一步 MVP

建議下一段一段模擬：

1. 建立一組模擬 NotebookLM source files。
2. 先寫 `00_instruction.md`。
3. 再寫 `01_latest_memo.md`。
4. 再寫 2 到 3 天的 `LINE_*_YYYY-MM-DD.md`。
5. 準備一組固定 prompt。
6. 用 NotebookLM 測試是否能正確理解「指示檔 + latest memo + 日期檔」邏輯。
7. 再回頭設計 parser / ETL / command package。

第一階段成功標準：

- smf 能看懂整體邏輯。
- AI 能根據 source files 理解目前狀態與歷史日期紀錄的差別。
- 人工在沒有程式的情況下，也能手動上傳、替換與提問。
