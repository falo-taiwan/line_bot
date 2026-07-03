# 2026-06-18 LINE Five Message Trace

## 目的

Force 連續送出五則已知測試訊息到專屬測試帳號，用來觀察 macOS LINE 本機資料的 before / after 差異。

本 trace 目標是推測 LINE 訊息寫入位置與資料結構，不修改 LINE 原始資料。

## 安全邊界

- 原始 LINE 資料夾只讀。
- 所有實驗只對 `/private/tmp` 外部 clone 執行。
- 不修改、更新、刪除 LINE 檔案。
- 不寫回 LINE DB。
- 不讀取 Token / Cookie / Session。
- 不做 MITM 或 TLS 解密。

## 測試訊息

本次使用五則可辨識 marker：

```text
FALO_TRACE_001
FALO_TRACE_002
FALO_TRACE_003
FALO_TRACE_004
FALO_TRACE_005
```

## Snapshot

Before snapshot：

```text
/private/tmp/falo-line-readonly-snapshot-20260618-164429/db
```

After snapshot：

```text
/private/tmp/falo-line-readonly-snapshot-20260618-164700/db
```

來源目錄：

```text
/Users/force/Library/Containers/jp.naver.line.mac/Data/Library/Containers/jp.naver.line/Data/db
```

## 變動檔案

主要變動集中在：

```text
qw7c05376fc7ace69d98f032eca6b860.edb
qw7c05376fc7ace69d98f032eca6b860.edb-wal
```

未觀察到明顯變動的同層資料：

```text
album_*.edb
chatStats_*.edb
keep_*.edb
f59c00309acd23908b1254ee081d8258
```

## Metadata 結果

`qw7c...edb`：

- Before size：739,475,456 bytes
- After size：739,475,456 bytes
- Before mtime：2026-06-18 16:39:12
- After mtime：2026-06-18 16:47:06
- SHA-256 changed：yes

`qw7c...edb-wal`：

- Before size：9,780,912 bytes
- After size：9,780,912 bytes
- Before mtime：2026-06-18 16:44:27
- After mtime：2026-06-18 16:47:15
- SHA-256 changed：yes

## 明文 marker 搜尋

在 after snapshot 中搜尋下列 encoding：

- UTF-8
- UTF-16LE
- UTF-16BE

搜尋範圍：

```text
qw7c...edb
qw7c...edb-wal
qw7c...edb-shm
```

結果：

```text
FALO_TRACE_001: no hit
FALO_TRACE_002: no hit
FALO_TRACE_003: no hit
FALO_TRACE_004: no hit
FALO_TRACE_005: no hit
```

初步推論：

- 訊息沒有以簡單 UTF-8 / UTF-16 明文直接落在主 DB 或 WAL。
- 可能經過加密、壓縮、二進位封裝或頁級資料結構轉換。

## Binary Diff 結果

`qw7c...edb`：

- changed bytes：約 1,619,957
- changed ranges：6,479
- assumed page size：4096 bytes
- changed pages：409 / 180,536 pages

`qw7c...edb-wal`：

- changed bytes：約 2,743,936
- changed ranges：11,989
- WAL page size：4096 bytes
- WAL frame count：2,374
- changed frames：671
- changed frame ranges：

```text
1-310
682-1042
```

## 初步結論

五則已知文字訊息造成的主要變化在 `qw7c...edb` 與 `qw7c...edb-wal`。

這表示目前最可能的訊息資料入口是：

```text
Data/db/qw7c05376fc7ace69d98f032eca6b860.edb
Data/db/qw7c05376fc7ace69d98f032eca6b860.edb-wal
```

但 marker 沒有明文命中，所以後續不能用單純 grep / strings 解析訊息。下一步應往 clone-only 解密研究、WAL frame mapping、以及更小粒度的一則一 trace 前進。

## 下一步建議

1. 做 single-message trace。
   - before snapshot。
   - Force 只送 `FALO_TRACE_006` 一則文字。
   - after snapshot。
   - 比對 changed pages / frames。

補充：後續已執行 `FALO_TRACE_006`，但因為送出前未即時建立新的 before snapshot，所以該輪只能視為近似 single-message trace。詳細紀錄見 `2026-06-18-line-single-message-trace-006.md`。

2. 建立 page / frame 對應表。
   - 觀察每一則文字是否固定影響某些 frame range。
   - 分離 message content、索引、conversation metadata、sync metadata。

3. 研究 clone-only 解密開啟方式。
   - 不對 LINE 原始資料夾操作。
   - 不輸出 Token / Cookie / Session。
   - 若需要 key material，只記錄「可取得/不可取得」與用途，不印出秘密值。
