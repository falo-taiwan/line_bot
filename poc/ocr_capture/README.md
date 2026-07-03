# OCR Capture PoC

本資料夾預留給 LINE Desktop 指定區域截圖與 OCR 辨識 PoC。

初期目標：

1. 偵測或手動指定 LINE Desktop 視窗區域。
2. 擷取指定區域畫面。
3. 對畫面做 OCR。
4. 將新增文字追加到對話檔。

## v0：OCR Window Recorder

`ocr_window_recorder.py` 是 observer-only 的第一版工具：

```text
固定畫面區域
        ↓
定時截圖
        ↓
圖片 hash 變化偵測
        ↓
有變化才 OCR
        ↓
新增文字追加到 conversation.txt
```

它不會修改 LINE、不會寫回 LINE DB、不會送訊息，只會在 LINE 外部產生觀察紀錄。

## 輕量 MVP 原則

第一版先刻意做簡單：

- 只做文字 OCR。
- 只看固定區域。
- 只在畫面變化時處理。
- 只輸出對話文字，不急著做完整 UI。
- 不先做複雜視覺模型。
- 不先做底層 DB 解密。
- 不先做跨平台安裝包。

核心目標是先證明：

```text
LINE 畫面變化
        ↓
OCR 文字
        ↓
新增文字
        ↓
conversation.txt
```

跑通這條鏈路後，再加視窗自動定位、OCR 品質優化與 Dashboard。

## 建議第一輪測試場景

先不要測高速滑動，也不要測很多人同時刷訊息。

第一輪只測：

```text
固定 LINE 視窗
固定聊天區域
慢慢增加文字
每次增加後截一次
```

建議測試內容：

```text
OCR_STEP_001 hello
OCR_STEP_002 今天下午確認報價單
OCR_STEP_003 owner=Force due=明天下午 risk=資料格式待確認
OCR_STEP_004 第一行
第二行
第三行
```

這樣可以先確認：

- 區域抓得準不準。
- OCR 能不能讀中文。
- 多行文字會不會被合併壞掉。
- `conversation.txt` 是否能留下每一步新增文字。

## 最輕使用流程

### 1. 打開控制面板

最簡單方式是直接打開小視窗：

```bash
python3 ocr_window_recorder.py --control-panel
```

視窗按鈕：

```text
Select Region：框選 LINE 對話文字區
Start：開始定期截圖 OCR
Stop：停止截圖 OCR
```

框選時會出現明顯紅色框線與即時座標提示。放開滑鼠後，控制面板會顯示已選區域，並跳出一張預覽圖，方便確認 OCR 會看的畫面範圍。

輸出文字會追加到：

```text
out/ocr-window-recorder/conversation.txt
```

### 2. 看螢幕尺寸

```bash
python3 ocr_window_recorder.py --show-screen-size
```

### 3. 設定截取區域

最輕鬆方式是直接用滑鼠框選：

```bash
python3 ocr_window_recorder.py --select-region
```

操作方式：

```text
出現半透明全螢幕
        ↓
用滑鼠框住 LINE 對話文字區，畫面會顯示紅色框線與尺寸提示
        ↓
放開滑鼠
        ↓
座標自動寫入 ocr_capture_config.json
```

如果不想用圖形框選，也可以用問答設定：

```bash
python3 ocr_window_recorder.py --setup
```

它會建立：

```text
ocr_capture_config.json
```

### 4. 一步一步增加文字測試

```bash
python3 ocr_window_recorder.py --step-mode
```

流程：

```text
畫面放好
        ↓
程式截一次
        ↓
你在 LINE 測試帳號新增一段文字
        ↓
按 Enter
        ↓
程式再截一次並記錄變化
```

這個模式最適合第一版測試，因為不用處理高速滑動或複雜訊息流。

### 5. 穩定後再定時監控

```bash
python3 ocr_window_recorder.py --watch
```

或指定時間：

```bash
python3 ocr_window_recorder.py --duration-seconds 60
```

## 輸出

預設輸出到：

```text
out/ocr-window-recorder/
  captures/
  conversation.txt
  events.jsonl
  ocr-notes.md
```

第一版最重要的是：

```text
conversation.txt
```

它會追加每次 OCR 判斷出的新增文字，適合後續交給 AI 做摘要或分析。

`events.jsonl` 是輔助紀錄，可接到後續：

- AI Parser
- AI Note / NotebookLM
- SQLite
- HTML dashboard

## macOS 範例

先固定 LINE 視窗位置，再指定一塊聊天區域：

```bash
python3 ocr_window_recorder.py \
  --region 100,120,900,700 \
  --source-label "LINE Desktop test room" \
  --interval-seconds 3 \
  --duration-seconds 60 \
  --conversation-file conversation.txt \
  --output-dir out/line-test-room
```

macOS 會優先嘗試 Pillow `ImageGrab`，若沒有 Pillow，會使用系統 `screencapture`。

## Windows 範例

固定區域：

```powershell
python ocr_window_recorder.py `
  --region 100,120,900,700 `
  --source-label "LINE Desktop test room" `
  --interval-seconds 3 `
  --duration-seconds 60 `
  --conversation-file conversation.txt `
  --output-dir out/line-test-room
```

Windows 可嘗試用視窗標題偵測：

```powershell
python ocr_window_recorder.py `
  --window-title "LINE" `
  --source-label "LINE Desktop window" `
  --interval-seconds 3 `
  --duration-seconds 60 `
  --conversation-file conversation.txt `
  --output-dir out/line-window
```

若視窗標題偵測不穩，先用 `--region` 比較可靠。

## OCR

本工具使用外部 `tesseract` 指令做 OCR。

若沒有安裝 tesseract：

- 仍會截圖。
- 仍會偵測畫面變化。
- `events.jsonl` 會記錄 `ocr_available: false`。
- 之後可補裝 OCR 後再重新處理截圖。

建議語言：

```text
eng+chi_tra
```

## 測試

```bash
python3 -m unittest test_ocr_window_recorder.py
```

## 第一版限制

- OCR 品質取決於畫面縮放、字體大小、截圖區域與 tesseract 語言包。
- 固定區域比自動找視窗穩定，適合第一版 PoC。
- Windows 的 `--window-title` 只做基本視窗座標偵測，後續可升級成 UI Automation。
- 這不是 LINE DB parser，而是使用者授權的畫面觀察器。
