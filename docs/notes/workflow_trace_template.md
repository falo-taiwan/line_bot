# LINE Workflow Trace Template

## 目的

用使用者明確操作的 LINE 工作流，反推 macOS LINE 本機資料變化。

這不是封包破解，也不是修改 LINE，而是：

```text
使用者操作
        ↓
外部 read-only snapshot
        ↓
差異比對
        ↓
推測資料流與事件位置
```

## 安全邊界

- 原始 LINE 資料夾只讀。
- 解密或格式實驗只對 clone / snapshot 執行。
- 不寫回 LINE DB。
- 不修改、更新、刪除 LINE 檔案。
- 不攔截 TLS。
- 不做 MITM。
- 不讀 Token / Cookie / Session。
- 不冒充 LINE client。

## 工作流基本資料

- Trace ID：
- 日期：
- LINE 版本：
- macOS 版本：
- 操作者：
- 工作流類型：

## 工作流步驟

請用很小的步驟描述。

範例：

1. 開啟 LINE Desktop。
2. 進入指定測試聊天室。
3. 傳送一則文字：`FALO_TRACE_001 hello`。
4. 等待 10 秒。
5. 不做其他 LINE 操作。

## 前置快照

- Snapshot path：
- Snapshot time：
- 指令或工具：
- 備註：

## 後置快照

- Snapshot path：
- Snapshot time：
- 指令或工具：
- 備註：

## 差異觀察

| 路徑 | 變化 | 初步推測 |
|---|---|---|
| `Data/db/qw*.edb-wal` | size / mtime changed | 可能寫入訊息或索引事件 |
| `Data/db/qw*.edb` | size / mtime changed | 可能 checkpoint 或主資料更新 |
| `Real/Library/Data/Caches/...` | new files | 可能媒體或縮圖快取 |

## 推測資料流

```text
LINE UI action
        ↓
Local DB WAL
        ↓
Main EDB / cache
        ↓
Media cache / metadata
```

## 下一步

- 是否需要更小粒度的 workflow？
- 是否需要只測文字？
- 是否需要只測圖片？
- 是否需要比對 WAL？
- 是否需要對 clone 做 schema / encryption experiment？

