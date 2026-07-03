# 2026-06-18 LINE Single Message Trace 006

## 目的

Force 送出一則 `FALO_TRACE_006` 測試訊息後，建立新的外部 snapshot，並與上一輪 snapshot 比對。

本輪目標是觀察單則文字訊息對 macOS LINE 本機 DB 的影響。

注意：本輪不是完美 single-message trace，因為 `FALO_TRACE_006` 送出前沒有即時建立新的 before snapshot。因此本輪使用前一輪 after snapshot 作為 baseline，中間可能混入 LINE 背景同步或 checkpoint。

## 安全邊界

- 原始 LINE 資料夾只讀。
- 所有實驗只對 `/private/tmp` 外部 clone 執行。
- 不修改、更新、刪除 LINE 檔案。
- 不寫回 LINE DB。
- 不讀取 Token / Cookie / Session。
- 不做 MITM 或 TLS 解密。

## Snapshot

Baseline snapshot：

```text
/private/tmp/falo-line-readonly-snapshot-20260618-164700/db
```

After snapshot：

```text
/private/tmp/falo-line-readonly-snapshot-20260618-165312/db
```

來源目錄：

```text
/Users/force/Library/Containers/jp.naver.line.mac/Data/Library/Containers/jp.naver.line/Data/db
```

## 變動檔案

主要變動仍集中在：

```text
qw7c05376fc7ace69d98f032eca6b860.edb
qw7c05376fc7ace69d98f032eca6b860.edb-wal
```

同層其他候選未觀察到 metadata 變化：

```text
album_*.edb
chatStats_*.edb
keep_*.edb
f59c00309acd23908b1254ee081d8258
```

## Metadata 結果

`qw7c...edb`：

- Baseline size：739,475,456 bytes
- After size：739,475,456 bytes
- Baseline mtime：2026-06-18 16:47:06
- After mtime：2026-06-18 16:52:20
- SHA-256 changed：yes

`qw7c...edb-wal`：

- Baseline size：9,780,912 bytes
- After size：9,780,912 bytes
- Baseline mtime：2026-06-18 16:47:15
- After mtime：2026-06-18 16:53:08
- SHA-256 changed：yes

## 明文 marker 搜尋

搜尋範圍：

```text
qw7c...edb
qw7c...edb-wal
qw7c...edb-shm
```

搜尋 marker：

```text
FALO_TRACE_006
SINGLE
hello
20260618
```

結果：

```text
no hit
```

初步推論：

- `FALO_TRACE_006` 沒有以 UTF-8 / UTF-16 明文出現在主 DB、WAL 或 SHM。
- 訊息內容仍可能經過加密、壓縮、二進位封裝或頁級結構轉換。

## Page / Frame Diff

`qw7c...edb`：

- changed bytes：約 2,682,405
- assumed page size：4096 bytes
- changed pages：666 / 180,536 pages

`qw7c...edb-wal`：

- changed bytes：約 4,402,528
- WAL page size：4096 bytes
- WAL frame count：2,374
- changed frames：1,076
- changed frame range：

```text
1-1076
```

## 和五則 trace 的比較

五則 trace：

- EDB changed pages：409
- WAL changed frames：671

Trace 006：

- EDB changed pages：666
- WAL changed frames：1,076

這次單則 trace 的變化反而較大，因此推測中間可能混入：

- LINE 背景同步。
- WAL checkpoint。
- 訊息收發以外的 metadata 更新。
- 既有 pending changes 被一起寫入。

## 初步結論

雖然本輪不是乾淨的單訊息 trace，但它再次確認：

```text
文字訊息相關變化主要落在 qw7c...edb / qw7c...edb-wal
```

目前還不能用 grep / strings 從 DB 直接取得訊息內容。下一步需要更嚴格的 trace 流程：

```text
1. 先建立 before snapshot
2. Force 只送一則訊息
3. 等待固定秒數
4. 立即建立 after snapshot
5. 比對 page/frame
```

## 下一輪建議

下一輪應先由 Observer 建立 before snapshot，再請 Force 送：

```text
FALO_TRACE_007 CLEAN_SINGLE 20260618
```

送完後只等待 5 到 10 秒，不做其他 LINE 操作，立刻建立 after snapshot。

