# 02a 授權地端 OCR / 畫面辨識路線

## 路線定位

OCR / 畫面辨識是本階段主要研究方向。

目的不是破解 LINE，而是在使用者本人裝置、本人授權、本人操作的前提下，建立一個低侵入式 Local Observation Agent，觀察 LINE Desktop 畫面狀態，將畫面變化轉成事件流。

## 直覺理解

可以把這條路線想成「AI 助理坐在使用者旁邊看螢幕」。

它不拿帳密、不讀 Token、不碰 Session，也不進入 LINE 的內部加密資料。它只做一件事：在使用者允許的範圍內，讀取畫面上已經顯示給使用者看的資訊。

## 基本架構

```text
LINE Desktop Window
        ↓
Screen Capture
        ↓
Region Crop
        ↓
OCR / UI Recognition
        ↓
Change Detection
        ↓
Deduplication
        ↓
Local Event Stream
        ↓
FALO IM Inbox
```

## Windows / macOS 桌面截圖方式

### Windows

可研究方向：

- Windows Graphics Capture API。
- Win32 視窗枚舉與截圖。
- PowerShell / .NET 截圖 PoC。
- Python 套件，例如 `mss`、`pygetwindow`、`pywinauto`。
- OCR 可先研究 Tesseract、PaddleOCR 或雲端 Vision API。

初期 PoC 可先用 Python 做：

1. 找到 LINE 視窗。
2. 擷取指定座標範圍。
3. 存成圖片。
4. 對圖片做 OCR。

### macOS

可研究方向：

- ScreenCaptureKit。
- `screencapture` 指令。
- Quartz / CoreGraphics 截圖。
- Accessibility API 輔助取得視窗位置。
- Python 套件，例如 `mss`、`pyobjc`、`pytesseract`。

macOS 需注意：

- 使用者需要授權螢幕錄製權限。
- 使用者可能需要授權輔助使用權限。
- PoC 應明確告知：只處理使用者指定視窗或指定區域。

## 偵測 LINE 視窗是否開啟

PoC 可以先做三層偵測：

1. 行程偵測：檢查 LINE Desktop 是否執行。
2. 視窗偵測：檢查是否存在 LINE 視窗。
3. 位置偵測：取得視窗座標，讓截圖區域跟著視窗移動。

事件例子：

```json
{
  "event_type": "line_window_detected",
  "app": "LINE Desktop",
  "platform": "macOS",
  "window_title": "LINE",
  "detected_at": "2026-06-18T15:00:00+08:00"
}
```

## 擷取特定區域畫面

初期不要嘗試辨識整個 LINE 介面。

建議先切成幾個區域：

| 區域 | 目的 |
|---|---|
| 群組 / 聊天列表 | 偵測未讀、群組名稱、最新訊息摘要 |
| 聊天主視窗 | OCR 讀取最近訊息 |
| 輸入框附近 | 判斷使用者是否正在回覆 |
| 標題列 | 取得目前群組或對象名稱 |

PoC 最小範圍：

```text
只截取使用者手動指定的聊天主視窗區域
        ↓
OCR 最近 5 到 10 則可見訊息
        ↓
轉成 JSON event
```

## OCR 辨識目標

初期可先辨識：

- 群組名稱。
- 訊息文字。
- 發話者名稱。
- 訊息時間。
- 未讀狀態。
- 圖片或檔案提示文字。
- 可能的日期、金額、專案名稱、客戶名稱。

不建議初期處理：

- 貼圖語意。
- 語音轉文字。
- 圖片中的複雜表格。
- 長時間歷史回溯。

## 事件去重

OCR 會反覆看到同一段畫面，因此一定要去重。

建議建立 `message_fingerprint`：

```text
hash(group_name + sender + normalized_text + visible_time + region_id)
```

事件狀態可分成：

- `new_candidate`：第一次看見。
- `confirmed_new`：連續兩次截圖都存在，且非重複。
- `updated_candidate`：畫面文字疑似變化。
- `ignored_duplicate`：已處理過。

## 變更偵測

可用三種層次：

1. 畫面像素差異：判斷畫面是否有變。
2. OCR 結果差異：判斷文字是否有變。
3. 事件語意差異：判斷是否真的出現新任務或新決策。

初期建議先做：

```text
每 2 到 5 秒截圖
        ↓
比較 crop 圖片 hash
        ↓
有變化才 OCR
        ↓
OCR 結果再去重
```

## 低侵入式 Agent 架構

```text
Local Agent
  ├─ Window Detector
  ├─ Screen Capture Worker
  ├─ OCR Worker
  ├─ Dedup Engine
  ├─ Event Normalizer
  ├─ Local Queue
  └─ Export Adapter
       ├─ JSONL
       ├─ SQLite
       ├─ Markdown
       └─ HTML Dashboard
```

低侵入式原則：

- 使用者可以啟動 / 停止。
- 使用者可以選擇觀察區域。
- 預設本機處理。
- 預設保留最少資料。
- 不背景偷跑。
- 不讀取帳密或 Session。
- 不偽裝成 LINE 元件。

## PoC 成功標準

第一版成功只需做到：

1. 使用者手動開啟 LINE Desktop。
2. 使用者指定一個聊天區域。
3. Agent 擷取畫面並 OCR。
4. 系統辨識出最近幾則文字訊息。
5. 系統將新訊息轉成 JSON event。
6. 系統能避免同一則訊息重複輸出太多次。

## 安全邊界

本路線只允許：

- 使用者本人裝置。
- 使用者本人帳號。
- 使用者明確授權。
- 使用者可見畫面。
- 本機 PoC。

本路線不允許：

- 破解 LINE。
- 竊取 Token / Cookie / Session。
- 繞過 LINE 安全機制。
- 讀取未授權帳號或群組資料。
- 隱蔽式監控他人聊天。

