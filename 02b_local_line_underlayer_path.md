# 02b 合法本機事件來源與底層資料研究路線

## 路線定位

本路線研究 LINE Desktop 在使用者本機是否存在可合法使用的事件來源。

這裡的「底層」不是破解、解密或繞過權限，而是研究使用者本人裝置上，是否有已授權、可見、可匯出、可由系統 API 取得的資料來源。

## 安全前提

本路線必須遵守：

- 不破解加密資料。
- 不繞過存取控制。
- 不竊取 Token / Cookie / Session。
- 不做未授權帳號資料讀取。
- 不偽裝使用者身分操作 LINE。
- 僅研究使用者本人裝置、本人帳號、本人授權資料。

## 可能資料來源地圖

```text
LINE Desktop
  ├─ App Local Files
  ├─ Exported Chat Files
  ├─ OS Notifications
  ├─ Accessibility API
  ├─ Clipboard / User-Initiated Copy
  └─ Screen / OCR Fallback
```

## LINE Desktop 本地資料夾結構研究

研究方向：

- LINE Desktop 在 Windows / macOS 的安裝與資料目錄。
- 是否存在非敏感設定檔。
- 是否存在可公開讀取的快取資訊。
- 是否存在使用者可匯出的聊天紀錄。
- 不讀取加密資料庫內容。
- 不嘗試反向工程 LINE 私有格式。

建議研究紀錄格式：

```text
平台：
LINE Desktop 版本：
路徑：
檔案類型：
是否需特殊權限：
是否含敏感資訊：
是否可合法讀取：
是否適合 PoC：
備註：
```

## 通知中心事件

LINE 新訊息常會出現在 OS 通知中心。

可研究方向：

### Windows

- Windows Notification Platform。
- Event Log 是否有可用摘要。
- PowerShell 是否可讀取通知歷史。
- 通知是否只保留摘要，不保留完整訊息。

### macOS

- Notification Center 資料可見性。
- AppleScript / Accessibility 是否能觀察通知。
- 是否需要使用者授權。
- 通知內容是否可被合法擷取。

限制：

- 通知可能被使用者關閉。
- 通知可能只顯示摘要。
- 通知可能因隱私設定隱藏內容。
- 通知不一定有完整上下文。

## Accessibility API 取得 UI 文字

Accessibility API 的重點是：在使用者授權後，讓輔助工具讀取畫面元件資訊。

可研究內容：

- LINE Desktop 是否暴露 UI 元件文字。
- 群組名稱、訊息文字是否可被 Accessibility Tree 讀取。
- macOS Accessibility 權限流程。
- Windows UI Automation 可讀取程度。
- 和 OCR 相比是否更穩定。

優點：

- 可能比 OCR 更準。
- 不需大量圖片處理。
- 可能取得 UI 元件層級的結構。

限制：

- LINE Desktop 不一定提供完整可讀文字。
- UI 結構會隨版本改變。
- 權限申請需要清楚告知使用者。

## 合法匯出的聊天紀錄

這是最適合教學與初期 PoC 的資料來源之一。

流程：

```text
使用者在 LINE 中匯出聊天紀錄
        ↓
將匯出檔放入指定資料夾
        ↓
Folder Watcher 偵測新檔
        ↓
Parser 轉成標準事件
        ↓
AI Parser 萃取任務 / 決策 / 風險 / 知識
```

優點：

- 使用者主動匯出。
- 資料來源清楚。
- 適合離線研究。
- 適合建立 benchmark。
- 適合教學示範。

限制：

- 不是即時。
- 需要使用者操作。
- 匯出格式可能因平台不同而變化。
- 仍需處理隱私與同意。

## Folder Watcher / File Watcher

Folder Watcher 是較安全的本地事件化方式。

可監看：

- 使用者放入的聊天匯出檔。
- 手動複製的文字檔。
- OCR 輸出的 JSONL。
- AI Parser 輸出的結果。

事件例子：

```json
{
  "event_type": "file_detected",
  "source": "exported_chat",
  "path": "inbox/line_export_2026-06-18.txt",
  "detected_at": "2026-06-18T15:00:00+08:00",
  "next_step": "parse_exported_chat"
}
```

## Local Event Stream

不論資料來自 OCR、通知、Accessibility、匯出檔，都應先轉成同一種事件格式。

建議初期使用 JSONL：

```json
{
  "event_id": "evt_20260618_000001",
  "source_type": "line_desktop_ocr",
  "capture_method": "screen_ocr",
  "conversation_hint": "客戶A 專案群",
  "sender_hint": "王小明",
  "message_text": "明天下午前要補報價單",
  "message_time_hint": "14:32",
  "captured_at": "2026-06-18T15:00:00+08:00",
  "confidence": 0.82,
  "privacy_level": "local_authorized"
}
```

## 和 OCR 路線的關係

OCR 是「畫面上已顯示的資訊」。

本路線則研究「系統或使用者主動提供的合法事件來源」。

兩者可以互補：

- OCR：接近即時、低依賴、但可能有辨識誤差。
- 匯出檔：準確、可回放、但不即時。
- 通知：接近即時、但資訊可能不完整。
- Accessibility：可能準確、但依賴 App UI 結構與授權。

## 初期研究建議

優先順序：

1. 合法匯出聊天紀錄 parser。
2. Folder Watcher 監看匯出檔。
3. Accessibility API 探查可見 UI 文字。
4. 通知中心事件探查。
5. LINE Desktop 本地資料夾非敏感結構盤點。

不建議初期投入：

- 加密資料庫解析。
- 私有協定分析。
- Token / Session 研究。
- 未授權自動登入。

