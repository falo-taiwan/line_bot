#!/usr/bin/env python3
"""
FALO IM Unified Local Server (app.py)
# 天勳 x Force Cheng 2026/7/3

Integrating:
1. LINE Messaging API Webhook (Bot 1: @145qjpih)
2. Historical Chat Log Imports (out/standard-line-bot/chats/imported/)
3. AI Coworker Console with Gemini 2.5 Flash & KM references
4. NotebookLM Time Partitioning Exporter & Checkable Exporter Files
"""

import os
import sys
import json
import hmac
import hashlib
import urllib.request
import urllib.parse
import datetime as dt
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Dict, List, Optional, Tuple

# Timezone Helpers
TAIPEI_TZ_OFFSET = dt.timezone(dt.timedelta(hours=8), name="Asia/Taipei")

def now_local_iso() -> str:
    return dt.datetime.now(TAIPEI_TZ_OFFSET).isoformat(timespec="seconds")

def format_line_timestamp(ms: Optional[int]) -> str:
    if ms is None:
        return ""
    try:
        seconds = ms / 1000.0
        return dt.datetime.fromtimestamp(seconds, TAIPEI_TZ_OFFSET).isoformat(timespec="seconds")
    except Exception:
        return ""

def is_media_event(evt: Dict[str, object]) -> bool:
    # Check live bot event format
    line_msg_type = evt.get("line", {}).get("message_type")
    if line_msg_type in {"image", "video", "audio", "file"}:
        return True
    # Check imported event format
    imported_msg_type = evt.get("message_type")
    if imported_msg_type in {"image", "video", "audio", "file"}:
        return True
    return False

def safe_slug(value: str) -> str:
    keep = []
    for char in value.lower():
        if char.isalnum():
            keep.append(char)
        elif char in ("-", "_", " "):
            keep.append("-")
    slug = "".join(keep).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug or "chat"

def html_escape(val: object) -> str:
    if val is None:
        return ""
    return (
        str(val)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;")
    )

# Configuration Loader
def load_dotenv(path: Path) -> Dict[str, str]:
    config = {}
    if not path.exists():
        return config
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        config[key.strip()] = value.strip().strip('"').strip("'")
    return config

# Load settings
ROOT_DIR = Path.cwd()
ENV_CONFIG = load_dotenv(ROOT_DIR / ".env")
if not ENV_CONFIG:
    ENV_CONFIG = load_dotenv(ROOT_DIR / "poc" / "standard_line_bot" / ".env")

LINE_CHANNEL_SECRET = os.environ.get("LINE_CHANNEL_SECRET") or ENV_CONFIG.get("LINE_CHANNEL_SECRET") or ""
LINE_CHANNEL_ACCESS_TOKEN = os.environ.get("LINE_CHANNEL_ACCESS_TOKEN") or ENV_CONFIG.get("LINE_CHANNEL_ACCESS_TOKEN") or ""
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or ENV_CONFIG.get("GEMINI_API_KEY") or ""
LINE_BOT_PORT = int(os.environ.get("LINE_BOT_PORT") or ENV_CONFIG.get("LINE_BOT_PORT") or "8088")
LINE_BOT_HOST = os.environ.get("LINE_BOT_HOST") or ENV_CONFIG.get("LINE_BOT_HOST") or "127.0.0.1"

# Directory configuration
CHATS_OUTPUT_DIR = ROOT_DIR / "out" / "chats"
IMPORTED_CHATS_DIR = ROOT_DIR / "out" / "standard-line-bot" / "chats" / "imported"
KM_NOTES_DIR = ROOT_DIR / "docs" / "notes"
EXPORTS_BASE_DIR = ROOT_DIR / "out" / "exports"

# Ensure dirs
CHATS_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
KM_NOTES_DIR.mkdir(parents=True, exist_ok=True)
EXPORTS_BASE_DIR.mkdir(parents=True, exist_ok=True)

def ensure_demo_data() -> None:
    # 1. Ensure KM notes exist
    sop_path = KM_NOTES_DIR / "tianxun_erp_sop.md"
    if not sop_path.exists():
        sop_path.write_text(
            "# 天勳 ERP 系統部署與權限設定標準作業流程 (SOP)\n\n"
            "## 1. 系統登入與權限指派\n"
            "* 所有新進員工須由人事部門填單申請 ERP 帳號。\n"
            "* 帳號登入網址為：`http://erp.tianxun.com.tw:9000/`。\n"
            "* 預設權限分為三種角色：\n"
            "  * **系統管理員 (Admin)**：具備最高權限，可修改系統設定、備份資料庫。\n"
            "  * **一般操作員 (User)**：可執行日常單據輸入、查詢報表。\n"
            "  * **主管簽核 (Manager)**：具備簽核請購單、出貨單之核准權限。\n\n"
            "## 2. ERP 備份規範\n"
            "* 系統將於每日凌晨 02:00 自動執行完整備份 (Full Backup) 並存於 AWS S3。\n"
            "* 系統管理員需於每週五下午 17:00 執行人工異地備份。\n\n"
            "## 3. 常見故障處理\n"
            "* 若遇到 \"DB Connection Timeout\" 錯誤，請先確認內部資料庫伺服器 (IP: 192.168.1.50) 是否正常運作。\n",
            encoding="utf-8"
        )

    milestones_path = KM_NOTES_DIR / "tianxun_project_milestones.md"
    if not milestones_path.exists():
        milestones_path.write_text(
            "# 115 年度天勳 ERP 專案時程與重要里程碑\n\n"
            "## 1. 專案各階段進度安排\n"
            "* **階段一：需求訪談與架構設計**\n"
            "  * 時程：115/05/01 ~ 115/06/15\n"
            "  * 里程碑：確認核心規格書與資料庫模型設計。\n"
            "* **階段二：系統對接與 API 開發**\n"
            "  * 時程：115/06/16 ~ 115/08/15 (進行中)\n"
            "  * 里程碑：完成第三方支付介接與 ERP 金流模組對接。\n"
            "* **階段三：測試與教育訓練**\n"
            "  * 時程：115/08/16 ~ 115/09/30\n"
            "  * 里程碑：完成使用者驗收測試 (UAT) 與主管簽核培訓。\n"
            "* **階段四：正式上線 (Go-Live)**\n"
            "  * 時程：115/10/01 正式切換系統。\n\n"
            "## 2. 目前專案重要待辦與分工\n"
            "* **API 對接工作**由研發部 `Jerry` 負責。\n"
            "* **資料庫備份規則制定**由 `主管鄭Force` 負責督導。\n"
            "* **教育訓練手冊編撰**由 `天勳服務窗口` 負責。\n",
            encoding="utf-8"
        )

    faq_path = KM_NOTES_DIR / "tianxun_faq.md"
    if not faq_path.exists():
        faq_path.write_text(
            "# 天勳 ERP 系統常見問答 (FAQ)\n\n"
            "### Q1: 忘記 ERP 密碼時該如何處理？\n"
            "* 答：請於 ERP 登入頁面點選「忘記密碼」，系統會發送重設驗證信至您的公司信箱。若信箱未收到，請聯絡天勳資訊系統管理員。\n\n"
            "### Q2: 能否透過手機瀏覽器操作 ERP 系統？\n"
            "* 答：本系統具備完全的響應式網頁設計 (Responsive Web Design)，可直接使用手機或平板瀏覽器登入進行請假單或出貨單簽核。\n\n"
            "### Q3: 匯入 CSV 出現編碼錯誤 (Encoding Error)？\n"
            "* 答：天勳 ERP 預設使用 `UTF-8` 編碼。匯入 CSV 時請確認檔案儲存格式非 `BIG5` 或 `GBK`，否則會出現亂碼或系統拒絕匯入。\n",
            encoding="utf-8"
        )

    # 2. Ensure mock LINE group import exists
    demo_chat_dir = IMPORTED_CHATS_DIR / "tianxun_demo_group"
    demo_chat_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = demo_chat_dir / "manifest.json"
    if not manifest_path.exists():
        manifest_path.write_text(
            json.dumps({
                "chat_name": "天勳 ERP 導入戰情群組 (Demo)",
                "imported_at": "2026-07-03T11:50:00+08:00"
            }, ensure_ascii=False),
            encoding="utf-8"
        )

    events_path = demo_chat_dir / "events.jsonl"
    if not events_path.exists():
        events = [
            {"line_timestamp": 1782787800000, "captured_at": "2026-06-30T10:00:00+08:00", "sender_name_hint": "Jerry", "text": "各位，我們在進行 ERP API 對接時，遇到第三方支付金流回傳 DB Connection Timeout 錯誤，能幫忙看看資料庫伺服器是否正常嗎？"},
            {"line_timestamp": 1782788100000, "captured_at": "2026-06-30T10:05:00+08:00", "sender_name_hint": "客服窗口", "text": "Jerry 你好，請先確認內部資料庫伺服器 (192.168.1.50) 是否有過載或斷線。另外，匯入 API 的 CSV 時要記得使用 UTF-8 編碼，不然會報編碼錯誤喔。"},
            {"line_timestamp": 1782788400000, "captured_at": "2026-06-30T10:10:00+08:00", "sender_name_hint": "Jerry", "text": "收到！確認是 1.50 伺服器磁碟空間滿了，清出空間後連線已經恢復正常。API 串接目前順利通暢。"},
            {"line_timestamp": 1782792000000, "captured_at": "2026-06-30T11:10:00+08:00", "sender_name_hint": "鄭Force", "text": "好的，太棒了。研發部這週能完成 ERP 第三方支付介接嗎？我們階段二的里程碑是 8/15 前要完成，希望這週可以先做完測試。"},
            {"line_timestamp": 1782792300000, "captured_at": "2026-06-30T11:15:00+08:00", "sender_name_hint": "Jerry", "text": "報告主管，這週五 (7/3) 下午前我可以完成金流模組的初步開發並上測試機。不過週五晚上需要執行人工異地備份，我會順便把測試版備份存一份。"},
            {"line_timestamp": 1782792600000, "captured_at": "2026-06-30T11:20:00+08:00", "sender_name_hint": "鄭Force", "text": "很好，那這週五下午我來確認測試。另外提醒，教育訓練手冊的編撰，天勳的窗口記得要開始啟動，配合 8/16 之後 UAT 訓練。"},
            {"line_timestamp": 1782792900000, "captured_at": "2026-06-30T11:25:00+08:00", "sender_name_hint": "客服窗口", "text": "收到，教育訓練手冊天勳資訊已開始撰寫，預計 7/15 前會先交付初版給主管審閱。"}
        ]
        with events_path.open("w", encoding="utf-8") as f:
            for ev in events:
                f.write(json.dumps(ev, ensure_ascii=False) + "\n")

ensure_demo_data()

# Helper function to append to JSONL files
def append_jsonl(path: Path, record: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

# LINE API integrations
def verify_signature(body: bytes, secret: str, signature: str) -> bool:
    if not secret:
        return True # Dev mode fallback
    h = hmac.new(secret.encode("utf-8"), body, hashlib.sha256)
    try:
        import base64
        decoded_sig = base64.b64decode(signature.encode("utf-8"))
    except Exception:
        return False
    return hmac.compare_digest(h.digest(), decoded_sig)

def fetch_group_summary(group_id: str, access_token: str) -> Optional[Dict[str, str]]:
    if not access_token:
        return None
    url = f"https://api.line.me/v2/bot/group/{group_id}/summary"
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {access_token}"},
        method="GET"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception:
        return None

def fetch_user_profile(user_id: str, access_token: str, group_id: Optional[str] = None) -> Optional[Dict[str, str]]:
    if not access_token:
        return None
    if group_id:
        url = f"https://api.line.me/v2/bot/group/{group_id}/member/{user_id}"
    else:
        url = f"https://api.line.me/v2/bot/profile/{user_id}"
        
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {access_token}"},
        method="GET"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception:
        return None

def download_line_attachment(message_id: str, access_token: str, path: Path) -> bool:
    if not access_token:
        return False
    url = f"https://api-data.line.me/v2/bot/message/{message_id}/content"
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {access_token}"},
        method="GET"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(res.read())
            return True
    except Exception:
        return False

def load_ai_history() -> List[Dict[str, object]]:
    history_file = ROOT_DIR / "out" / "ai_history.jsonl"
    history = []
    if history_file.exists():
        try:
            with history_file.open("r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        history.append(json.loads(line))
        except Exception:
            pass
    return history[-50:]

def load_points_db() -> Dict[str, int]:
    points_file = ROOT_DIR / "out" / "user_points.json"
    points_file.parent.mkdir(parents=True, exist_ok=True)
    if not points_file.exists():
        data = {"total_points": 2500, "remaining_points": 2500}
        try:
            points_file.write_text(json.dumps(data), encoding="utf-8")
        except Exception:
            pass
        return data
    try:
        return json.loads(points_file.read_text(encoding="utf-8"))
    except Exception:
        return {"total_points": 2500, "remaining_points": 2500}

def save_points_db(data: Dict[str, int]) -> None:
    points_file = ROOT_DIR / "out" / "user_points.json"
    points_file.parent.mkdir(parents=True, exist_ok=True)
    try:
        points_file.write_text(json.dumps(data), encoding="utf-8")
    except Exception:
        pass

# Directory scanners for UI
def scan_all_chats() -> List[Dict[str, object]]:
    sources = []
    
    # 1. Scan imported chats
    if IMPORTED_CHATS_DIR.exists():
        for chat_path in IMPORTED_CHATS_DIR.iterdir():
            if not chat_path.is_dir():
                continue
            manifest_file = chat_path / "manifest.json"
            if manifest_file.exists():
                try:
                    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
                    sources.append({
                        "id": f"imported/{chat_path.name}",
                        "type": "imported",
                        "chat_name": manifest.get("chat_name") or chat_path.name,
                        "source_type": "line_export",
                        "events_file": str(chat_path / "events.jsonl")
                    })
                except Exception:
                    pass
                    
    # 2. Scan default live chats
    default_chats_dir = CHATS_OUTPUT_DIR / "default"
    if default_chats_dir.exists():
        for chat_path in default_chats_dir.iterdir():
            if not chat_path.is_dir():
                continue
            manifest_file = chat_path / "manifest.json"
            if manifest_file.exists():
                try:
                    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
                    sources.append({
                        "id": f"default/{chat_path.name}",
                        "type": "default",
                        "chat_name": manifest.get("chat_name") or chat_path.name,
                        "source_type": manifest.get("source_type") or "group",
                        "events_file": str(chat_path / "events.jsonl")
                    })
                except Exception:
                    pass
    return sorted(sources, key=lambda x: str(x["chat_name"]))

def scan_km_documents() -> List[Dict[str, str]]:
    docs = []
    if KM_NOTES_DIR.exists():
        for f in KM_NOTES_DIR.iterdir():
            if f.is_file() and f.suffix in {".md", ".txt"}:
                docs.append({
                    "filename": f.name,
                    "path": str(f)
                })
    return sorted(docs, key=lambda x: x["filename"])

def scan_exported_partitions() -> List[Dict[str, str]]:
    exports = []
    if EXPORTS_BASE_DIR.exists():
        for partition_type in {"day", "week", "month"}:
            dir_path = EXPORTS_BASE_DIR / partition_type
            if dir_path.exists():
                for f in dir_path.iterdir():
                    if f.is_file() and f.suffix == ".md":
                        exports.append({
                            "type": partition_type,
                            "filename": f.name,
                            "path": f"/exports/{partition_type}/{f.name}"
                        })
    return sorted(exports, key=lambda x: (x["type"], x["filename"]), reverse=True)

# Gemini API call
def call_gemini_with_metadata(api_key: str, system_instruction: str, prompt: str, model: str = "gemini-3.1-flash-lite") -> Tuple[str, Dict[str, int]]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"System context:\n{system_instruction}"},
                    {"text": f"User Query:\n{prompt}"}
                ]
            }
        ]
    }
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            res_body = res.read().decode("utf-8")
            response_json = json.loads(res_body)
            candidates = response_json.get("candidates", [])
            usage = response_json.get("usageMetadata") or {}
            text_result = ""
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if parts:
                    text_result = str(parts[0].get("text", ""))
            else:
                text_result = f"Error: Empty response from Gemini API. Full response: {res_body}"
            return text_result, usage
    except urllib.error.HTTPError as exc:
        err_msg = exc.read().decode("utf-8", errors="replace")
        return f"Gemini API HTTP Error {exc.code}: {err_msg}", {}
    except Exception as exc:
        return f"Failed to call Gemini API: {type(exc).__name__}: {exc}", {}

def call_gemini(api_key: str, system_instruction: str, prompt: str, model: str = "gemini-3.1-flash-lite") -> str:
    text, _ = call_gemini_with_metadata(api_key, system_instruction, prompt, model)
    return text

def calculate_gemini_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    input_rate = 0.075 / 1_000_000
    output_rate = 0.30 / 1_000_000
    
    model_lower = model.lower()
    if "pro" in model_lower:
        input_rate = 1.25 / 1_000_000
        output_rate = 5.00 / 1_000_000
    elif "flash-lite" in model_lower or "3.1-flash-lite" in model_lower:
        input_rate = 0.0375 / 1_000_000
        output_rate = 0.15 / 1_000_000
        
    return (input_tokens * input_rate) + (output_tokens * output_rate)

def render_chat_viewer(chat_id: str, chat_name: str, events: List[Dict[str, object]]) -> str:
    message_htmls = []
    current_date = ""
    for evt in events:
        captured_at = evt.get("captured_at") or format_line_timestamp(evt.get("line_timestamp"))
        date_part = captured_at[:10] if captured_at else ""
        time_part = captured_at[11:16] if captured_at and len(captured_at) >= 16 else ""
        
        if date_part != current_date:
            current_date = date_part
            message_htmls.append(f'<div class="date-separator">{html_escape(current_date)}</div>')
            
        sender = evt.get("sender", {})
        sender_name = html_escape(evt.get("sender_name_hint") or sender.get("display_name") or "未知")
        sender_pic = html_escape(sender.get("picture_url") or "")
        
        text = html_escape(evt.get("text") or "")
        
        media_html = ""
        media_info = evt.get("media")
        if media_info and media_info.get("downloaded"):
            file_name = media_info.get("stored_file_name")
            media_type = media_info.get("type")
            media_url = f"/media/{chat_id}/{file_name}"
            
            if media_type == "image":
                media_html = f'<div style="margin-top: 6px;"><img src="{media_url}" style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>'
            elif media_type == "video":
                media_html = f'<div style="margin-top: 6px;"><video src="{media_url}" controls style="max-width: 300px; max-height: 300px; border-radius: 8px;"></video></div>'
            elif media_type == "audio":
                media_html = f'<div style="margin-top: 6px;"><audio src="{media_url}" controls style="max-width: 300px;"></audio></div>'
            elif media_type == "file":
                orig_name = media_info.get("original_file_name") or file_name
                size_str = ""
                file_size = media_info.get("file_size")
                if file_size:
                    if file_size > 1024 * 1024:
                        size_str = f" ({file_size / (1024*1024):.1f} MB)"
                    else:
                        size_str = f" ({file_size / 1024:.1f} KB)"
                media_html = (
                    f'<div style="margin-top: 6px; background: #f8fafc; padding: 10px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">'
                    f'📁 <a href="{media_url}" target="_blank" download="{html_escape(orig_name)}" style="color: #0284c7; text-decoration: none; font-weight: bold; word-break: break-all;">{html_escape(orig_name)}</a>{size_str}'
                    f'</div>'
                )
        
        is_self = (sender_name == "鄭Force")
        if is_self:
            row_style = 'display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; flex-direction: row-reverse;'
            content_style = 'display: flex; flex-direction: column; align-items: flex-end;'
            bubble_style = 'background: #84e058; padding: 10px 14px; border-radius: 12px; border-top-right-radius: 2px; font-size: 14px; line-height: 1.4; word-break: break-all; box-shadow: 0 1px 2px rgba(0,0,0,0.05);'
            bubble_wrap_style = 'display: flex; align-items: flex-end; gap: 6px; flex-direction: row-reverse;'
            time_style = 'font-size: 10px; color: #555555; flex-shrink: 0; margin-bottom: 2px;'
            pic_img_html = ""
        else:
            row_style = 'display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;'
            content_style = 'display: flex; flex-direction: column;'
            bubble_style = 'background: white; padding: 10px 14px; border-radius: 12px; border-top-left-radius: 2px; font-size: 14px; line-height: 1.4; word-break: break-all; box-shadow: 0 1px 2px rgba(0,0,0,0.05);'
            bubble_wrap_style = 'display: flex; align-items: flex-end; gap: 6px;'
            time_style = 'font-size: 10px; color: #cbd5e1; flex-shrink: 0; margin-bottom: 2px;'
            pic_img_html = f'<img src="{sender_pic}" class="profile-pic" onerror="this.style.display=\'none\';">' if sender_pic else '<div class="profile-placeholder">👤</div>'

        message_htmls.append(f"""
        <div class="message-row" data-event-id="{evt.get('event_id')}" style="{row_style}">
            {pic_img_html}
            <div class="message-content" style="{content_style}">
                <div class="sender-name" style="font-size: 12px; color: #4e5e72; margin-bottom: 4px; font-weight: bold;">{sender_name}</div>
                <div class="bubble-wrap" style="{bubble_wrap_style}">
                    <div class="bubble-and-media" style="display: flex; flex-direction: column;">
                        <div class="message-bubble" style="{bubble_style}">{text}</div>
                        {media_html}
                    </div>
                    <span class="message-time" style="{time_style}">{time_part}</span>
                </div>
            </div>
        </div>
        """)
        
    messages_body = "\n".join(message_htmls)
    
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html_escape(chat_name)} - 對話紀錄檢視器</title>
  <style>
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #4e5e72;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      height: 100vh;
      align-items: center;
    }}
    header {{
      background: #2e3d50;
      color: white;
      padding: 14px 20px;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
    }}
    .header-inner {{
      max-width: 768px;
      width: 100%;
    }}
    .chat-area {{
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 768px;
      width: 100%;
      background: #7494c0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      box-sizing: border-box;
    }}
    .date-separator {{
      align-self: center;
      background: rgba(0,0,0,0.15);
      color: white;
      font-size: 11px;
      padding: 3px 10px;
      border-radius: 99px;
      margin: 15px 0;
      font-weight: bold;
    }}
    .profile-pic {{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      background: #eee;
      border: 1px solid rgba(0,0,0,0.05);
    }}
    .profile-placeholder {{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 1px solid rgba(0,0,0,0.05);
    }}
  </style>
</head>
<body>
  <header>
    <div class="header-inner">💬 {html_escape(chat_name)} - 訊息佇列檢視 (對話共 {len(events)} 筆)</div>
  </header>
  <div class="chat-area">
    {messages_body}
  </div>
  <script>
    const chatArea = document.querySelector('.chat-area');
    chatArea.scrollTop = chatArea.scrollHeight;

    const loadedEventIds = new Set();
    document.querySelectorAll('.message-row').forEach(row => {{
      loadedEventIds.add(row.getAttribute('data-event-id'));
    }});

    const chatId = "{chat_id}";
    let lastDate = "{current_date}";

    setInterval(async () => {{
      try {{
        const res = await fetch('/api/chat-events?id=' + encodeURIComponent(chatId));
        if (!res.ok) return;
        const data = await res.json();
        if (!data.ok || !data.events) return;

        let newMessagesAdded = false;
        data.events.forEach(evt => {{
          if (loadedEventIds.has(evt.event_id)) return;
          loadedEventIds.add(evt.event_id);
          newMessagesAdded = true;

          const capturedAt = evt.captured_at || "";
          const datePart = capturedAt.substring(0, 10);
          const timePart = capturedAt.substring(11, 16);
          if (datePart && datePart !== lastDate) {{
            lastDate = datePart;
            const dateSep = document.createElement('div');
            dateSep.className = 'date-separator';
            dateSep.textContent = datePart;
            chatArea.appendChild(dateSep);
          }}

          const row = document.createElement('div');
          row.className = 'message-row';
          row.setAttribute('data-event-id', evt.event_id);
          
          const senderPic = evt.sender?.picture_url || "";
          const senderName = evt.sender_name_hint || evt.sender?.display_name || "未知";
          const text = evt.text || "";

          const isSelfMsg = (senderName === '鄭Force');
          let picHtml = '';
          let rowStyle = 'display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px;';
          let contentStyle = 'display: flex; flex-direction: column;';
          let bubbleStyle = 'background: white; padding: 10px 14px; border-radius: 12px; border-top-left-radius: 2px; font-size: 14px; line-height: 1.4; word-break: break-all; box-shadow: 0 1px 2px rgba(0,0,0,0.05);';
          let bubbleWrapStyle = 'display: flex; align-items: flex-end; gap: 6px;';
          let timeStyle = 'font-size: 10px; color: #cbd5e1; flex-shrink: 0; margin-bottom: 2px;';

          if (isSelfMsg) {{
            rowStyle += ' flex-direction: row-reverse;';
            contentStyle += ' align-items: flex-end;';
            bubbleStyle = 'background: #84e058; padding: 10px 14px; border-radius: 12px; border-top-right-radius: 2px; font-size: 14px; line-height: 1.4; word-break: break-all; box-shadow: 0 1px 2px rgba(0,0,0,0.05);';
            bubbleWrapStyle += ' flex-direction: row-reverse;';
            timeStyle = 'font-size: 10px; color: #555555; flex-shrink: 0; margin-bottom: 2px;';
          }} else {{
            if (senderPic) {{
              picHtml = '<img src="' + senderPic + '" class="profile-pic" onerror="this.style.display=&quot;none&quot;;">';
            }} else {{
              picHtml = '<div class="profile-placeholder">👤</div>';
            }}
          }}

          row.style.cssText = rowStyle;

          let mediaHtml = '';
          const mediaInfo = evt.media;
          if (mediaInfo && mediaInfo.downloaded) {{
            const fileName = mediaInfo.stored_file_name;
            const mediaType = mediaInfo.type;
            const mediaUrl = '/media/' + chatId + '/' + fileName;
            if (mediaType === 'image') {{
              mediaHtml = '<div style="margin-top: 6px;"><img src="' + mediaUrl + '" style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>';
            }} else if (mediaType === 'video') {{
              mediaHtml = '<div style="margin-top: 6px;"><video src="' + mediaUrl + '" controls style="max-width: 300px; max-height: 300px; border-radius: 8px;"></video></div>';
            }} else if (mediaType === 'audio') {{
              mediaHtml = '<div style="margin-top: 6px;"><audio src="' + mediaUrl + '" controls style="max-width: 300px;"></audio></div>';
            }} else if (mediaType === 'file') {{
              const origName = mediaInfo.original_file_name || fileName;
              let sizeStr = '';
              const fileSize = mediaInfo.file_size;
              if (fileSize) {{
                if (fileSize > 1024 * 1024) {{
                  sizeStr = ' (' + (fileSize / (1024 * 1024)).toFixed(1) + ' MB)';
                }} else {{
                  sizeStr = ' (' + (fileSize / 1024).toFixed(1) + ' KB)';
                }}
              }}
              mediaHtml = '<div style="margin-top: 6px; background: #f8fafc; padding: 10px 14px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">📁 <a href="' + mediaUrl + '" target="_blank" download="' + origName + '" style="color: #0284c7; text-decoration: none; font-weight: bold; word-break: break-all;">' + origName + '</a>' + sizeStr + '</div>';
            }}
          }}

          row.innerHTML = picHtml + '<div class="message-content" style="' + contentStyle + '"><div class="sender-name" style="font-size: 12px; color: #4e5e72; margin-bottom: 4px; font-weight: bold;">' + senderName + '</div><div class="bubble-wrap" style="' + bubbleWrapStyle + '"><div class="bubble-and-media" style="display: flex; flex-direction: column;"><div class="message-bubble" style="' + bubbleStyle + '">' + text + '</div>' + mediaHtml + '</div><span class="message-time" style="' + timeStyle + '">' + timePart + '</span></div></div>';
          chatArea.appendChild(row);
        }});

        if (newMessagesAdded) {{
          chatArea.scrollTop = chatArea.scrollHeight;
        }}
      }} catch (err) {{
        console.error("Failed to poll chat events:", err);
      }}
    }}, 2000);
  </script>
</body>
</html>"""

# HTML templates
def render_login_page(error: str = "") -> str:
    err_html = f'<div class="error-msg">{html_escape(error)}</div>' if error else ""
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attn IM - 登入</title>
  <style>
    :root {{
      --green: #06c755;
      --ink: #0f172a;
      --border: #cbd5e1;
      --bg: #f8fafc;
    }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }}
    .login-box {{
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }}
    h2 {{ margin: 0 0 20px; font-size: 22px; text-align: center; }}
    .field {{ margin-bottom: 16px; }}
    label {{ display: block; font-weight: 700; margin-bottom: 6px; font-size: 14px; }}
    input {{
      width: 100%;
      height: 40px;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      box-sizing: border-box;
    }}
    button {{
      width: 100%;
      height: 40px;
      background: var(--green);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      margin-top: 10px;
    }}
    .error-msg {{ color: #ef4444; background: #fee2e2; padding: 10px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; text-align: center; }}
  </style>
</head>
<body>
  <div class="login-box">
    <h2>Attn IM 地端戰情室</h2>
    {err_html}
    <form method="post" action="/login">
      <div class="field">
        <label>帳號</label>
        <input type="text" name="username" required autofocus>
      </div>
      <div class="field">
        <label>密碼</label>
        <input type="password" name="password" required>
      </div>
      <button type="submit">登入地端主機</button>
    </form>
  </div>
</body>
</html>"""

def render_console_dashboard(
    chats: List[Dict[str, object]], 
    km_docs: List[Dict[str, str]],
    exports: List[Dict[str, str]],
    history: List[Dict[str, object]] = None
) -> str:
    if history is None:
        history = []

    points_data = load_points_db()
    rem_pts = points_data["remaining_points"]
    points_html = f'<span id="pointsDisplayHeader" style="background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: bold; border: 1px solid #cbd5e1; margin-right: 12px;">AI 點數餘額：<strong>{rem_pts} 點 / 2500 點</strong></span>'

    history_htmls = []
    for item in history:
        prompt_val = item.get("prompt", "")
        response_val = item.get("response", "")
        time_val = item.get("timestamp") or ""
        usage = item.get("usage") or {}
        
        # User card
        history_htmls.append(f"""
        <div class="response-card" style="background: #eef6f0;">
          <div class="response-header">
            <span>提問</span>
            <span>{html_escape(time_val)}</span>
          </div>
          <div class="response-body"><strong>{html_escape(prompt_val)}</strong></div>
        </div>
        """)
        
        # AI card
        usage_html = ""
        if usage:
            try:
                tot_t = int(float(usage.get("total_tokens", 0)))
                in_t = int(float(usage.get("input_tokens", 0)))
                out_t = int(float(usage.get("output_tokens", 0)))
            except Exception:
                tot_t = in_t = out_t = 0
            usage_html = (
                f'<div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">'
                f'<span>模型: <strong>{html_escape(usage.get("model"))}</strong></span>'
                f'<span>Tokens: <strong>{tot_t:,}</strong> (輸入: {in_t:,} | 輸出: {out_t:,})</span>'
                f'<span>花費: <strong>${usage.get("usd_cost")} USD</strong> (約 <strong>NT$ {usage.get("ntd_cost")}</strong>)</span>'
                f'</div>'
            )
            
        action_buttons = (
            f'<div class="no-print" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; justify-content: flex-end;">'
            f'  <button type="button" onclick="copyCardHTML(this)" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 10px; background: white; border-radius: 4px; cursor: pointer; font-weight: normal; border: 1px solid #cbd5e1;">📄 複製 HTML</button>'
            f'  <button type="button" onclick="downloadCardMD(this)" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 10px; background: white; border-radius: 4px; cursor: pointer; font-weight: normal; border: 1px solid #cbd5e1;">📥 下載 MD</button>'
            f'  <button type="button" onclick="printCardPDF(this)" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 10px; background: white; border-radius: 4px; cursor: pointer; font-weight: normal; border: 1px solid #cbd5e1;">🖨️ 匯出 PDF</button>'
            f'</div>'
        )

        history_htmls.append(f"""
        <div class="response-card">
          <div class="response-header">
            <span>AI 戰情分析回覆</span>
            <span>{html_escape(time_val)}</span>
          </div>
          <div class="response-body markdown-content" style="white-space: pre-wrap;">{html_escape(response_val)}</div>
          {usage_html}
          {action_buttons}
        </div>
        """)
    history_body = "\\n".join(history_htmls)

    # Build list of sources
    imported_items = []
    live_items = []
    
    for c in chats:
        c_id = html_escape(str(c["id"]))
        c_name = html_escape(str(c["chat_name"]))
        c_type = html_escape(str(c["source_type"]))
        
        checkbox_html = f"""<div class="checkbox-card-wrap" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <label class="checkbox-card" style="flex: 1; margin-bottom: 0;">
            <input type="checkbox" name="source" value="{c_id}">
            <div class="card-info">
              <strong>{c_name}</strong>
              <small>{c_type}</small>
            </div>
          </label>
          <a href="/view-chat?id={c_id}" target="_blank" class="button" style="min-height: 28px; height: 28px; padding: 0 8px; font-size: 11px; text-decoration: none;">💬 佇列</a>
        </div>"""
        
        if c["type"] == "imported":
            imported_items.append(checkbox_html)
        else:
            live_items.append(checkbox_html)
            
    imported_list = "\n".join(imported_items) if imported_items else '<p class="empty-text">無匯入對話 (請執行 import_adapter.py)</p>'
    live_list = "\n".join(live_items) if live_items else '<p class="empty-text">尚無即時 Webhook 對話 (Bot @145qjpih)</p>'

    # Build KM docs list
    km_items = []
    for km in km_docs:
        fn = html_escape(km["filename"])
        km_items.append(f"""<label class="checkbox-card">
          <input type="checkbox" name="km_file" value="{fn}">
          <div class="card-info">
            <strong>{fn}</strong>
          </div>
        </label>""")
    km_list = "\n".join(km_items) if km_items else '<p class="empty-text">無可用之 KM 文件 (請存放在 docs/notes/)</p>'

    # Group exported files by Year -> Month -> Files (three tiers)
    by_year_month = {}
    for exp in exports:
        fn = exp["filename"]
        year_key = "其他"
        month_key = "其他"
        if len(fn) >= 7 and fn[4] == "-" and fn[5:7].isdigit():
            year_key = f"{fn[:4]} 年"
            month_key = f"{fn[5:7]} 月"
        elif len(fn) >= 4 and fn[:4].isdigit():
            year_key = f"{fn[:4]} 年"
            month_key = "週報/其他"
            
        by_year_month.setdefault(year_key, {}).setdefault(month_key, []).append(exp)
        
    sorted_years = sorted(by_year_month.keys(), reverse=True)
    year_groups_html = []
    is_first_year = True
    for yk in sorted_years:
        months_dict = by_year_month[yk]
        sorted_months = sorted(months_dict.keys(), reverse=True)
        
        month_groups_html = []
        is_first_month = is_first_year
        for mk in sorted_months:
            items = months_dict[mk]
            items.sort(key=lambda x: x["filename"], reverse=True)
            
            item_rows = []
            for exp in items:
                fn = html_escape(exp["filename"])
                path = html_escape(exp["path"])
                t = html_escape(exp["type"])
                t_label = "日" if t == "day" else ("週" if t == "week" else "月")
                
                item_rows.append(
                    f'<div class="checkbox-card-wrap" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">'
                    f'  <label class="checkbox-card" style="flex: 1; margin-bottom: 0; display: flex; align-items: center;">'
                    f'    <input type="checkbox" name="exported_file" value="{fn}" style="margin: 0 8px 0 0;">'
                    f'    <div class="card-info" style="line-height: 1.2;">'
                    f'      <a href="{path}" target="_blank" style="text-decoration: none; color: var(--ink); font-weight: 600; font-size: 13px;">{fn}</a>'
                    f'      <span style="font-size: 10px; background: #e2e8f0; border-radius: 4px; padding: 1px 4px; margin-left: 6px; color: var(--muted); font-weight: bold;">{t_label}</span>'
                    f'    </div>'
                    f'  </label>'
                    f'  <a href="{path}?dl=1" class="button" style="min-height: 26px; height: 26px; padding: 0 8px; font-size: 11px; text-decoration: none;" download>下載</a>'
                    f'</div>'
                )
                
            items_html = "\n".join(item_rows)
            month_open_attr = "open" if is_first_month else ""
            is_first_month = False
            
            month_groups_html.append(
                f'<details class="partition-month-group" {month_open_attr} style="margin: 6px 0; border: 1px solid #cbd5e1; border-radius: 4px; background: white; margin-left: 10px;">'
                f'  <summary style="font-weight: 700; cursor: pointer; font-size: 12px; padding: 6px 8px; color: var(--muted); background: #f8fafc; border-radius: 2px; list-style: none; display: flex; align-items: center; justify-content: space-between;">'
                f'    <span>📂 {mk}</span>'
                f'    <div style="display: flex; align-items: center; gap: 6px;">'
                f'      <a href="javascript:void(0)" onclick="toggleMonthCheckboxes(this, true); event.stopPropagation();" style="color: var(--green); text-decoration: none; font-size: 10px; font-weight: bold;">全選</a>'
                f'      <span style="color: #cbd5e1; font-size: 10px;">|</span>'
                f'      <a href="javascript:void(0)" onclick="toggleMonthCheckboxes(this, false); event.stopPropagation();" style="color: var(--muted); text-decoration: none; font-size: 10px; font-weight: bold;">全清</a>'
                f'      <span style="font-size: 10px; background: #e2e8f0; border-radius: 99px; padding: 1px 4px; color: var(--muted); margin-left: 4px;">{len(items)} 個</span>'
                f'    </div>'
                f'  </summary>'
                f'  <div style="padding: 8px 8px 4px;">'
                f'    {items_html}'
                f'  </div>'
                f'</details>'
            )
            
        months_html = "\n".join(month_groups_html)
        year_open_attr = "open" if is_first_year else ""
        is_first_year = False
        
        year_groups_html.append(
            f'<details class="partition-year-group" {year_open_attr} style="margin-bottom: 10px; border: 1px solid var(--border); border-radius: 6px; background: #e2e8f0;">'
            f'  <summary style="font-weight: 700; cursor: pointer; font-size: 13px; padding: 8px 10px; color: var(--ink); background: #cbd5e1; border-radius: 4px; list-style: none; display: flex; align-items: center; justify-content: space-between;">'
            f'    <span>📅 {yk}</span>'
            f'    <span style="font-size: 11px; background: white; border-radius: 99px; padding: 1px 6px; color: var(--muted); font-weight: bold;">{sum(len(v) for v in months_dict.values())} 個</span>'
            f'  </summary>'
            f'  <div style="padding: 6px;">'
            f'    {months_html}'
            f'  </div>'
            f'</details>'
        )
        
    exports_accordion_html = "\n".join(year_groups_html) if year_groups_html else '<p class="empty-text">尚無任何歷史分割檔</p>'

    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attn IM - 地端 AI 對話分析與戰情室</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    :root {{
      --green: #06c755;
      --green-hover: #05b04b;
      --ink: #0f172a;
      --muted: #475569;
      --border: #cbd5e1;
      --bg: #f1f5f9;
      --panel: rgba(255, 255, 255, 0.95);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.5;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }}
    header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      z-index: 10;
    }}
    h1 {{ margin: 0; font-size: 20px; font-weight: 700; }}
    .subtle {{ color: var(--muted); font-size: 13px; }}
    .actions {{ display: flex; gap: 8px; }}
    button, a.button {{
      min-height: 36px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: white;
      color: var(--ink);
      padding: 0 14px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }}
    button:hover, a.button:hover {{
      background: #f8fafc;
      transform: translateY(-1px);
    }}
    button.primary {{
      background: var(--green);
      color: white;
      border-color: var(--green);
    }}
    button.primary:hover {{
      background: var(--green-hover);
    }}
    main {{
      display: grid;
      grid-template-columns: 350px 1fr;
      flex: 1;
      overflow: hidden;
    }}
    .sidebar {{
      border-right: 1px solid var(--border);
      background: #f8fafc;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-height: 0;
    }}
    .sidebar-section {{
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }}
    .sidebar-section h2 {{
      margin: 0 0 10px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }}
    .source-group {{
      margin-bottom: 12px;
    }}
    .source-group h3 {{
      margin: 8px 0 6px;
      font-size: 13px;
      color: var(--ink);
      border-left: 3px solid var(--green);
      padding-left: 6px;
    }}
    .checkbox-card {{
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px;
      border: 1px solid #f1f5f9;
      border-radius: 6px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }}
    .checkbox-card:hover {{
      background: #f8fafc;
    }}
    .checkbox-card input {{
      margin-top: 4px;
    }}
    .card-info {{ display: block; }}
    .card-info strong {{
      display: block;
      font-size: 13px;
      color: var(--ink);
    }}
    .card-info small {{
      font-size: 11px;
      color: var(--muted);
    }}
    .date-inputs {{
      display: flex;
      flex-direction: column;
      gap: 8px;
    }}
    .date-inputs input, .date-inputs select {{
      width: 100%;
      height: 34px;
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 13px;
    }}
    .chat-container {{
      display: flex;
      flex-direction: column;
      background: white;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }}
    .chat-messages {{
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: #fafafb;
    }}
    .chat-input-area {{
      border-top: 1px solid var(--border);
      padding: 16px 24px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }}
    .chat-input-wrapper {{
      display: flex;
      gap: 12px;
    }}
    textarea {{
      flex: 1;
      min-height: 80px;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
      resize: vertical;
      font-family: inherit;
      font-size: 14px;
      color: var(--ink);
    }}
    textarea:focus {{
      outline: none;
      border-color: var(--green);
    }}
    .loading-spinner {{
      display: none;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
      margin-left: 6px;
    }}
    @keyframes spin {{
      to {{ transform: rotate(360deg); }}
    }}
    .response-card {{
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }}
    .response-header {{
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 12px;
      color: var(--muted);
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }}
    .response-body table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
    }}
    .response-body th, .response-body td {{
      border: 1px solid var(--border);
      padding: 8px 12px;
      font-size: 13px;
      text-align: left;
    }}
    .response-body th {{ background: #f8fafc; }}
    .response-body code {{
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 13px;
      font-family: monospace;
    }}
    .response-body pre code {{
      display: block;
      padding: 12px;
      overflow-x: auto;
    }}
    .empty-text {{
      font-size: 12px;
      color: var(--muted);
      margin: 0;
    }}
    @media print {{
      body {{
        background: white !important;
        color: black !important;
        height: auto !important;
        overflow: visible !important;
      }}
      header, main .sidebar, .chat-input-area, .no-print, #welcomeMsg, .response-card:not(.printing-target) {{
        display: none !important;
      }}
      main {{
        display: block !important;
        height: auto !important;
        overflow: visible !important;
      }}
      .chat-container {{
        display: block !important;
        height: auto !important;
        overflow: visible !important;
        width: 100% !important;
      }}
      .chat-messages {{
        display: block !important;
        overflow: visible !important;
        height: auto !important;
        padding: 0 !important;
        background: white !important;
      }}
      .response-card.printing-target {{
        display: block !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        background: white !important;
        overflow: visible !important;
      }}
    }}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Attn IM - 雙資料源 AI 戰情室</h1>
      <div class="subtle">指定機器人：@145qjpih | 即時 Webhook 與歷史紀錄分析</div>
    </div>
    <div class="actions" style="display: flex; align-items: center;">
      {points_html}
      <form method="post" action="/logout" style="margin:0;"><button type="submit">登出</button></form>
    </div>
  </header>
  <main>
    <div class="sidebar">
      <div class="sidebar-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin:0;">對話資料來源</h2>
          <div style="font-size: 11px; font-weight: bold;">
            <a href="javascript:void(0)" onclick="toggleAllCheckboxes('source', true)" style="color: var(--green); text-decoration: none; margin-right: 8px;">全選</a>
            <a href="javascript:void(0)" onclick="toggleAllCheckboxes('source', false)" style="color: var(--muted); text-decoration: none;">全清</a>
          </div>
        </div>
        <div class="source-group">
          <h3>即時對話 (Live Bot Webhook)</h3>
          {live_list}
        </div>
        <div class="source-group">
          <h3>手動匯入歷史 (Imported logs)</h3>
          {imported_list}
        </div>
      </div>
      
      <div class="sidebar-section">
        <h2>時間區間篩選</h2>
        <div class="date-inputs">
          <label>開始時間 (含):
            <input type="date" id="startDate" name="start_date">
          </label>
          <label>結束時間 (含):
            <input type="date" id="endDate" name="end_date">
          </label>
          <div style="font-size: 11px; font-weight: bold; margin-top: 4px; display: flex; gap: 8px; justify-content: flex-end;">
            <a href="javascript:void(0)" onclick="quickSelectDate('today')" style="color: var(--green); text-decoration: none;">今天</a>
            <a href="javascript:void(0)" onclick="quickSelectDate('week')" style="color: var(--green); text-decoration: none;">本週</a>
            <a href="javascript:void(0)" onclick="quickSelectDate('month')" style="color: var(--green); text-decoration: none;">本月</a>
            <a href="javascript:void(0)" onclick="quickSelectDate('clear')" style="color: var(--muted); text-decoration: none;">清除</a>
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin:0; font-size:14px; font-weight:bold; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">已生成歷史分割檔 (可複選/下載)</h2>
          <div style="font-size: 11px; font-weight: bold;">
            <a href="javascript:void(0)" onclick="toggleAllCheckboxes('exported_file', true)" style="color: var(--green); text-decoration: none; margin-right: 8px;">全選</a>
            <a href="javascript:void(0)" onclick="toggleAllCheckboxes('exported_file', false)" style="color: var(--muted); text-decoration: none;">全清</a>
          </div>
        </div>
        {exports_accordion_html}
      </div>

      <div class="sidebar-section">
        <h2>NotebookLM 實體分割導出</h2>
        <div class="date-inputs" style="gap: 10px;">
          <label>分割方式:
            <select id="partitionType">
              <option value="day">按日 (By Day)</option>
              <option value="week">按週 (By Week)</option>
              <option value="month">按月 (By Month)</option>
            </select>
          </label>
          <label>導出格式:
            <select id="exportFormat">
              <option value="log">結構化對話紀錄 (.md)</option>
              <option value="summary">AI 自動摘要報告 (.md)</option>
            </select>
          </label>
          <button class="primary" id="exportBtn" style="width: 100%; margin-top: 6px;">
            生成實體分割檔案 <span class="loading-spinner" id="exportSpinner"></span>
          </button>
        </div>
      </div>
      
      <div class="sidebar-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin:0; font-size:14px; font-weight:bold; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">個人 KM 參考</h2>
          <div style="font-size: 11px; font-weight: bold;">
            <a href="javascript:void(0)" onclick="toggleAllCheckboxes('km_file', true)" style="color: var(--green); text-decoration: none; margin-right: 8px;">全選</a>
            <a href="javascript:void(0)" onclick="toggleAllCheckboxes('km_file', false)" style="color: var(--muted); text-decoration: none;">全清</a>
          </div>
        </div>
        {km_list}
      </div>
    </div>
    
    <div class="chat-container">
      <div class="chat-messages" id="chatMessages">
        <div class="empty" style="text-align: center; color: var(--muted); padding: 48px 0;" id="welcomeMsg">
          <h3>歡迎使用 Attn IM AI 協作</h3>
          <p>請在左側勾選要交叉分析的對話源（全文或歷史分割檔均可複選）與時間區間，然後在下方輸入您的問題。</p>
        </div>
        {history_body}
      </div>
      
      <div class="chat-input-area">
        <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 13px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: bold; color: var(--ink);">AI 協作模型：</span>
            <select id="modelSelect" style="width: auto; min-height: 32px; padding: 4px 8px; font-size: 13px; border-radius: 6px; border: 1px solid var(--border); font-weight: bold; background: white; cursor: pointer;">
              <option value="gemini-3.1-flash-lite" selected>gemini-3.1-flash-lite (預設 / 高性價比)</option>
              <option value="gemini-3.5-flash">gemini-3.5-flash (新版高精度)</option>
              <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite (極速省量)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash (經典對比)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (深度分析推理)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash (經典輕量)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (高推理 pro 版)</option>
              <option value="custom" disabled>其他特定 LLM 模型 (可客製化對接開發)</option>
            </select>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; flex-grow: 1; max-width: 480px;">
            <span style="font-weight: bold; color: var(--ink); white-space: nowrap;">Gemini API Key：</span>
            <input id="geminiApiKeyInput" type="password" placeholder="（選填，預設使用地端金鑰）" style="flex-grow: 1; height: 32px; min-height: auto; padding: 4px 8px; font-size: 13px; border-radius: 6px; border: 1px solid var(--border); box-sizing: border-box; background: white;">
            <button id="saveKeyBtn" class="primary" style="height: 32px; padding: 0 12px; font-size: 13px; font-weight: bold; border-radius: 6px; cursor: pointer; white-space: nowrap; width: auto; align-self: center;">儲存</button>
          </div>
        </div>
        <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; background: #f1f5f9; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border); width: 100%; box-sizing: border-box;">
          <span style="font-weight: bold; color: var(--muted); white-space: nowrap;">💡 Prompt 範本：</span>
          <button type="button" onclick="applyPromptTemplate('summary')" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 11px; font-weight: bold; background: white; border-radius: 4px; cursor: pointer; border: 1px solid #cbd5e1;">📋 摘要待辦整理</button>
          <button type="button" onclick="applyPromptTemplate('risk')" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 11px; font-weight: bold; background: white; border-radius: 4px; cursor: pointer; border: 1px solid #cbd5e1;">⚠️ 評估潛在風險</button>
          <button type="button" onclick="applyPromptTemplate('km')" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 11px; font-weight: bold; background: white; border-radius: 4px; cursor: pointer; border: 1px solid #cbd5e1;">🔍 交叉比對 KM 落差</button>
        </div>
        <div class="chat-input-wrapper">
          <textarea id="promptInput" placeholder="輸入要問的問題... (例如：彙整上週的待辦清單或做特定人的言論摘要)"></textarea>
          <button class="primary" id="sendBtn" style="height: auto; align-self: stretch; width: 120px;">
            送出分析 <span class="loading-spinner" id="spinner"></span>
          </button>
        </div>
      </div>
    </div>
  </main>

  <script>
    function toggleAllCheckboxes(name, state) {{
      const list = document.querySelectorAll('input[name="' + name + '"]');
      list.forEach(el => {{ el.checked = state; }});
    }}

    function toggleMonthCheckboxes(el, state) {{
      const details = el.closest('details');
      if (details) {{
        const checkboxes = details.querySelectorAll('input[name="exported_file"]');
        checkboxes.forEach(cb => {{ cb.checked = state; }});
      }}
    }}

    function quickSelectDate(type) {{
      const startInput = document.getElementById('startDate');
      const endInput = document.getElementById('endDate');
      const today = new Date();
      
      const formatDate = (date) => {{
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${{y}}-${{m}}-${{d}}`;
      }};

      if (type === 'today') {{
        const dateStr = formatDate(today);
        startInput.value = dateStr;
        endInput.value = dateStr;
      }} else if (type === 'week') {{
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        startInput.value = formatDate(monday);
        endInput.value = formatDate(sunday);
      }} else if (type === 'month') {{
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        startInput.value = formatDate(firstDay);
        endInput.value = formatDate(lastDay);
      }} else if (type === 'clear') {{
        startInput.value = '';
        endInput.value = '';
      }}
    }}

    function applyPromptTemplate(type) {{
      const input = document.getElementById('promptInput');
      if (type === 'summary') {{
        input.value = '請為我彙整以上所選對話的時程節點、主要討論決策，並以 Markdown 表格列出所有指派的待辦事項與負責人。';
      }} else if (type === 'risk') {{
        input.value = '請分析對話中是否存在進度延遲、溝通誤會、技術瓶頸或尚未解決的潛在風險，並提供具體的改善建議。';
      }} else if (type === 'km') {{
        input.value = '請比對 LINE 對話中提及的系統操作問題，與我們上傳的天勳 ERP SOP/FAQ 進行對照，分析目前是否有超出 SOP 的例外狀況或需更新的知識落差。';
      }}
      input.focus();
    }}

    function copyCardHTML(btn) {{
      const card = btn.closest('.response-card');
      const bodyDiv = card ? card.querySelector('.response-body') : null;
      if (bodyDiv) {{
        const clone = bodyDiv.cloneNode(true);
        const usageBlock = clone.querySelector('div[style*="border-top: 1px dashed"]');
        if (usageBlock) usageBlock.remove();
        const actionBlock = clone.querySelector('.no-print');
        if (actionBlock) actionBlock.remove();
        
        navigator.clipboard.writeText(clone.innerHTML).then(() => {{
          const oldText = btn.innerText;
          btn.innerText = '已複製！';
          setTimeout(() => {{ btn.innerText = oldText; }}, 1500);
        }}).catch(err => {{
          alert('複製失敗: ' + err);
        }});
      }}
    }}

    function downloadCardMD(btn) {{
      const card = btn.closest('.response-card');
      const mdText = card ? card.dataset.markdown : '';
      if (mdText) {{
        const blob = new Blob([mdText], {{ type: 'text/markdown;charset=utf-8;' }});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AI_戰情分析報告_' + new Date().toISOString().slice(0,10) + '.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }} else {{
        alert('找不到可下載的 Markdown 內容');
      }}
    }}

    function printCardPDF(btn) {{
      const card = btn.closest('.response-card');
      if (card) {{
        card.classList.add('printing-target');
        window.print();
        setTimeout(() => {{
          card.classList.remove('printing-target');
        }}, 500);
      }}
    }}

    const sendBtn = document.getElementById('sendBtn');
    const spinner = document.getElementById('spinner');
    const promptInput = document.getElementById('promptInput');
    const chatMessages = document.getElementById('chatMessages');
    const welcomeMsg = document.getElementById('welcomeMsg');
    
    const exportBtn = document.getElementById('exportBtn');
    const exportSpinner = document.getElementById('exportSpinner');
    const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');

    const saveKeyBtn = document.getElementById('saveKeyBtn');

    // Load from localStorage
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (savedKey) {{
      geminiApiKeyInput.value = savedKey;
    }}

    // Parse historical markdown and scroll to bottom
    document.querySelectorAll('.markdown-content').forEach(el => {{
      const mdText = el.textContent;
      const card = el.closest('.response-card');
      if (card) {{
        card.dataset.markdown = mdText;
      }}
      el.innerHTML = marked.parse(mdText);
    }});

    if (document.querySelectorAll('.response-card').length > 0) {{
      if (welcomeMsg) welcomeMsg.style.display = 'none';
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }}
    // Save on button click
    saveKeyBtn.addEventListener('click', () => {{
      localStorage.setItem('gemini_api_key', geminiApiKeyInput.value.trim());
      const originalText = saveKeyBtn.textContent;
      saveKeyBtn.textContent = '已儲存';
      saveKeyBtn.style.background = '#059669';
      setTimeout(() => {{
        saveKeyBtn.textContent = originalText;
        saveKeyBtn.style.background = '';
      }}, 1500);
    }});

    // Export Functionality
    exportBtn.addEventListener('click', async () => {{
      const checkedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
        .map(el => el.value);

      if (checkedSources.length === 0) {{
        alert('請至少選擇一個對話來源進行分割導出！');
        return;
      }}

      exportBtn.disabled = true;
      exportSpinner.style.display = 'inline-block';

      const partitionType = document.getElementById('partitionType').value;
      const exportFormat = document.getElementById('exportFormat').value;

      try {{
        const response = await fetch('/api/export_notebooklm', {{
          method: 'POST',
          headers: {{
            'Content-Type': 'application/json'
          }},
          body: JSON.stringify({{
            sources: checkedSources,
            partition_type: partitionType,
            export_format: exportFormat,
            model: document.getElementById('modelSelect').value,
            api_key: geminiApiKeyInput.value.trim()
          }})
        }});
        
        const data = await response.json();
        if (data.ok) {{
          alert(`成功生成 ${{data.files.length}} 個分割檔案！頁面將自動重整更新列表。`);
          window.location.reload();
        }} else {{
          alert('生成失敗: ' + data.error);
        }}
      }} catch (err) {{
        alert('連線失敗: ' + err.message);
      }} finally {{
        exportBtn.disabled = false;
        exportSpinner.style.display = 'none';
      }}
    }});

    // Query Functionality
    sendBtn.addEventListener('click', async () => {{
      const prompt = promptInput.value.trim();
      if (!prompt) return;

      const modelVal = document.getElementById('modelSelect').value;
      const isPro = modelVal.toLowerCase().includes('pro');
      if (prompt.length > 2000 || isPro) {{
        let msg = "";
        if (prompt.length > 2000 && isPro) {{
          msg = "您的提問輸入字數較長（共 " + prompt.length + " 字）且選用了 Pro 高階模型（" + modelVal + "），這將會消耗大量且單價較高的 Token。您確定要繼續送出分析嗎？";
        }} else if (prompt.length > 2000) {{
          msg = "您的提問輸入字數較長（共 " + prompt.length + " 字，已超過建議的 2000 字限制）。這可能會消耗較多 API Token。您確定要繼續送出分析嗎？";
        }} else {{
          msg = "您選用的是 Pro 高階推理模型（" + modelVal + "），其 API 單價較高（約為 Flash 系列的 16 倍）。您確定要繼續送出分析嗎？";
        }}
        const confirmSend = confirm(msg);
        if (!confirmSend) {{
          return;
        }}
      }}

      sendBtn.disabled = true;
      promptInput.disabled = true;
      spinner.style.display = 'inline-block';

      const checkedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
        .map(el => el.value);
      const checkedKMs = Array.from(document.querySelectorAll('input[name="km_file"]:checked'))
        .map(el => el.value);
      const checkedExported = Array.from(document.querySelectorAll('input[name="exported_file"]:checked'))
        .map(el => el.value);
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;

      if (welcomeMsg) welcomeMsg.style.display = 'none';
      
      const userCard = document.createElement('div');
      userCard.className = 'response-card';
      userCard.style.background = '#eef6f0';
      userCard.innerHTML = `
        <div class="response-header">
          <span>提問</span>
          <span>${{new Date().toLocaleTimeString()}}</span>
        </div>
        <div class="response-body"><strong>${{escapeHtml(prompt)}}</strong></div>
      `;
      chatMessages.appendChild(userCard);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      promptInput.value = '';

      const aiCard = document.createElement('div');
      aiCard.className = 'response-card';
      aiCard.innerHTML = `
        <div class="response-header">
          <span>AI 分析中...</span>
          <span>${{new Date().toLocaleTimeString()}}</span>
        </div>
        <div class="response-body">正在載入勾選的對話及參考 KM，請稍候...</div>
      `;
      chatMessages.appendChild(aiCard);
      chatMessages.scrollTop = chatMessages.scrollHeight;



      try {{
        const response = await fetch('/api/query_ai', {{
          method: 'POST',
          headers: {{
            'Content-Type': 'application/json'
          }},
          body: JSON.stringify({{
            sources: checkedSources,
            km_files: checkedKMs,
            exported_files: checkedExported,
            start_date: startDate,
            end_date: endDate,
            prompt: prompt,
            model: modelVal,
            api_key: geminiApiKeyInput.value.trim()
          }})
        }});
        
        const data = await response.json();
        const bodyDiv = aiCard.querySelector('.response-body');
        const headerSpan = aiCard.querySelector('.response-header span');
        
        if (data.ok) {{
          headerSpan.innerText = 'AI 戰情分析回覆';
          aiCard.dataset.markdown = data.response;
          
          let warningHtml = '';
          if (data.warning) {{
            warningHtml = '<div style="background: #fffbeb; color: #b45309; border: 1px solid #fcd34d; padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 12px; font-weight: bold;">' + data.warning + '</div>';
          }}
          
          let usageHtml = '';
          if (data.usage) {{
            usageHtml = '<div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">' +
              '<span>模型: <strong>' + data.usage.model + '</strong></span>' +
              '<span>Tokens: <strong>' + data.usage.total_tokens.toLocaleString() + '</strong> (輸入: ' + data.usage.input_tokens.toLocaleString() + ' | 輸出: ' + data.usage.output_tokens.toLocaleString() + ')</span>' +
              '<span>花費: <strong>$' + parseFloat(data.usage.usd_cost).toFixed(6) + ' USD</strong> (約 <strong>NT$ ' + parseFloat(data.usage.ntd_cost).toFixed(4) + '</strong>)</span>' +
              '</div>';
          }}
          
          let pointsHtml = '';
          if (data.points_info) {{
            let remainingText = data.points_info.remaining;
            if (typeof remainingText === 'number') {{
              remainingText = remainingText.toLocaleString() + ' 點';
            }}
            pointsHtml = '<div style="font-size: 11px; color: var(--muted); margin-top: 4px; display: flex; justify-content: space-between;">' +
              '<span>本次任務消耗: <strong>' + data.points_info.deducted + ' 點</strong></span>' +
              '<span>剩餘額度: <strong>' + remainingText + '</strong></span>' +
              '</div>';
              
            const displayHeader = document.getElementById('pointsDisplayHeader');
            if (displayHeader) {{
              if (data.points_info.using_custom_key) {{
                displayHeader.innerHTML = 'AI 點數餘額：<strong>無限 (自備金鑰)</strong>';
              }} else {{
                displayHeader.innerHTML = 'AI 點數餘額：<strong>' + data.points_info.remaining + ' 點 / 2500 點</strong>';
              }}
            }}
          }}
          
          let actionHtml = '<div class="no-print" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; justify-content: flex-end;">' +
            '<button type="button" onclick="copyCardHTML(this)" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 10px; background: white; border-radius: 4px; cursor: pointer; font-weight: normal; border: 1px solid #cbd5e1;">📄 複製 HTML</button>' +
            '<button type="button" onclick="downloadCardMD(this)" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 10px; background: white; border-radius: 4px; cursor: pointer; font-weight: normal; border: 1px solid #cbd5e1;">📥 下載 MD</button>' +
            '<button type="button" onclick="printCardPDF(this)" style="min-height: 24px; height: 24px; padding: 0 8px; font-size: 10px; background: white; border-radius: 4px; cursor: pointer; font-weight: normal; border: 1px solid #cbd5e1;">🖨️ 匯出 PDF</button>' +
            '</div>';
          bodyDiv.innerHTML = warningHtml + marked.parse(data.response) + usageHtml + pointsHtml + actionHtml;
        }} else {{
          headerSpan.innerText = '系統錯誤';
          bodyDiv.innerHTML = `<span style="color: #ef4444;">${{data.error}}</span>`;
        }}
      }} catch (err) {{
        const bodyDiv = aiCard.querySelector('.response-body');
        bodyDiv.innerHTML = `<span style="color: #ef4444;">連線錯誤: ${{err.message}}</span>`;
      }} finally {{
        sendBtn.disabled = false;
        promptInput.disabled = false;
        spinner.style.display = 'none';
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }}
    }});

    function escapeHtml(text) {{
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }}
  </script>
  <!-- 天勳 x Force Cheng 2026/7/3 -->
  <div class="no-print" style="position: fixed; bottom: 8px; right: 8px; font-size: 10px; color: rgba(15, 23, 42, 0.04); pointer-events: none; z-index: 9999; font-weight: bold; font-family: monospace;">天勳 x Force Cheng 2026/7/3</div>
</body>
</html>"""

def render_product_intro() -> str:
    intro_path = ROOT_DIR / "product_intro.html"
    if intro_path.exists():
        return intro_path.read_text(encoding="utf-8")
    return "<h1>Product Intro Page Not Found</h1>"

def render_poc_demo() -> str:
    poc_path = ROOT_DIR / "poc_demo.html"
    if poc_path.exists():
        return poc_path.read_text(encoding="utf-8")
    return "<h1>POC Demo Page Not Found</h1>"

def render_portal() -> str:
    portal_path = ROOT_DIR / "portal.html"
    if portal_path.exists():
        return portal_path.read_text(encoding="utf-8")
    return "<h1>Portal Hub Page Not Found</h1>"

# HTTP Request Router
class AppHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        sys.stderr.write(f"[http] {self.address_string()} - {format % args}\n")

    def parse_cookie(self) -> Dict[str, str]:
        cookies = {}
        cookie_header = self.headers.get("Cookie", "")
        if cookie_header:
            for item in cookie_header.split(";"):
                item = item.strip()
                if "=" in item:
                    k, v = item.split("=", 1)
                    cookies[k.strip()] = v.strip()
        return cookies

    def is_authenticated(self) -> bool:
        cookies = self.parse_cookie()
        return cookies.get("falo_session") == "admin_ok"

    def redirect(self, path: str, extra_headers: Optional[Dict[str, str]] = None) -> None:
        self.send_response(303)
        self.send_header("Location", path)
        if extra_headers:
            for k, v in extra_headers.items():
                self.send_header(k, v)
        self.end_headers()

    def send_html(self, status: int, html: str) -> None:
        body = html.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, status: int, payload: Dict[str, object]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed_url = urllib.parse.urlsplit(self.path)
        path = parsed_url.path

        # Health endpoint (open to all)
        if path == "/health":
            self.send_json(200, {
                "ok": True,
                "service": "attn-im-unified",
                "time": now_local_iso()
            })
            return

        # Serve exported files (starts with /exports/)
        if path.startswith("/exports/"):
            relative_path = path.replace("/exports/", "")
            parts = relative_path.split("/")
            if len(parts) == 2 and parts[0] in {"day", "week", "month"}:
                safe_dir = parts[0]
                safe_file = urllib.parse.unquote(parts[1])
                target_file = EXPORTS_BASE_DIR / safe_dir / safe_file
                if target_file.exists() and target_file.is_file():
                    content = target_file.read_bytes()
                    query_params = urllib.parse.parse_qs(parsed_url.query)
                    is_download = "dl" in query_params or "download" in query_params
                    
                    self.send_response(200)
                    if is_download:
                        self.send_header("Content-Type", "application/octet-stream")
                        self.send_header("Content-Disposition", f'attachment; filename="{urllib.parse.quote(safe_file)}"')
                    else:
                        self.send_header("Content-Type", "text/plain; charset=utf-8")
                    self.send_header("Content-Length", str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                    return
            self.send_json(404, {"ok": False, "error": "file not found or unsafe path"})
            return

        # Serve chat media (images/videos/audios)
        if path.startswith("/media/"):
            relative_path = path.replace("/media/", "")
            parts = relative_path.split("/")
            if len(parts) == 3 and parts[0] in {"default", "imported"}:
                safe_source = parts[0]
                safe_folder = os.path.basename(parts[1])
                safe_file = urllib.parse.unquote(parts[2])
                
                if safe_source == "default":
                    base_dir = CHATS_OUTPUT_DIR / "default"
                else:
                    base_dir = IMPORTED_CHATS_DIR
                
                target_file = base_dir / safe_folder / "media" / safe_file
                if target_file.exists() and target_file.is_file():
                    content = target_file.read_bytes()
                    ext = target_file.suffix.lower()
                    mime = "application/octet-stream"
                    if ext in {".jpg", ".jpeg"}:
                        mime = "image/jpeg"
                    elif ext == ".png":
                        mime = "image/png"
                    elif ext == ".gif":
                        mime = "image/gif"
                    elif ext == ".mp4":
                        mime = "video/mp4"
                    elif ext == ".m4a":
                        mime = "audio/mp4"
                        
                    self.send_response(200)
                    self.send_header("Content-Type", mime)
                    self.send_header("Content-Length", str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                    return
            self.send_json(404, {"ok": False, "error": "media not found or unsafe path"})
            return

        # View Chat Queue
        if path == "/view-chat":
            if not self.is_authenticated():
                self.redirect("/login")
                return
            query_params = urllib.parse.parse_qs(parsed_url.query)
            chat_id = query_params.get("id", [""])[0]
            if not chat_id:
                self.send_html(400, "<h1>Bad Request: Missing chat ID</h1>")
                return
                
            if chat_id.startswith("imported/"):
                filename = chat_id.replace("imported/", "")
                src_file = IMPORTED_CHATS_DIR / filename / "events.jsonl"
                manifest_file = IMPORTED_CHATS_DIR / filename / "manifest.json"
            elif chat_id.startswith("default/"):
                filename = chat_id.replace("default/", "")
                src_file = CHATS_OUTPUT_DIR / "default" / filename / "events.jsonl"
                manifest_file = CHATS_OUTPUT_DIR / "default" / filename / "manifest.json"
            else:
                self.send_html(400, "<h1>Bad Request: Invalid chat ID type</h1>")
                return
                
            chat_name = filename
            if manifest_file.exists():
                try:
                    m = json.loads(manifest_file.read_text(encoding="utf-8"))
                    chat_name = m.get("chat_name") or filename
                except Exception:
                    pass
                    
            events = []
            if src_file.exists():
                try:
                    with src_file.open("r", encoding="utf-8") as f:
                        for line in f:
                            if not line.strip():
                                continue
                            events.append(json.loads(line))
                except Exception:
                    pass
                    
            events.sort(key=lambda x: x.get("line_timestamp") or 0)
            html = render_chat_viewer(chat_id, chat_name, events)
            self.send_html(200, html)
            return

        # Get Chat Events JSON (AJAX Polling Endpoint)
        if path == "/api/chat-events":
            if not self.is_authenticated():
                self.send_json(401, {"ok": False, "error": "admin login required"})
                return
            query_params = urllib.parse.parse_qs(parsed_url.query)
            chat_id = query_params.get("id", [""])[0]
            if not chat_id:
                self.send_json(400, {"ok": False, "error": "Missing chat ID"})
                return
                
            if chat_id.startswith("imported/"):
                filename = chat_id.replace("imported/", "")
                src_file = IMPORTED_CHATS_DIR / filename / "events.jsonl"
            elif chat_id.startswith("default/"):
                filename = chat_id.replace("default/", "")
                src_file = CHATS_OUTPUT_DIR / "default" / filename / "events.jsonl"
            else:
                self.send_json(400, {"ok": False, "error": "Invalid chat ID type"})
                return
                
            events = []
            if src_file.exists():
                try:
                    with src_file.open("r", encoding="utf-8") as f:
                        for line in f:
                            if not line.strip():
                                continue
                            events.append(json.loads(line))
                except Exception:
                    pass
            events.sort(key=lambda x: x.get("line_timestamp") or 0)
            self.send_json(200, {"ok": True, "events": events})
            return

        # Serve ChatGPT_Image.png (open to all)
        if path == "/ChatGPT_Image.png":
            img_path = ROOT_DIR / "ChatGPT_Image.png"
            if img_path.exists() and img_path.is_file():
                content = img_path.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "image/png")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
            self.send_json(404, {"ok": False, "error": "image not found"})
            return

        # Serve Product Intro Page (open to all)
        if path == "/product-intro":
            html = render_product_intro()
            self.send_html(200, html)
            return

        # Serve POC Demo Page (open to all)
        if path == "/poc-demo":
            html = render_poc_demo()
            self.send_html(200, html)
            return

        # Serve Portal Hub Page (open to all)
        if path == "/portal":
            html = render_portal()
            self.send_html(200, html)
            return

        if path == "/login":
            if self.is_authenticated():
                self.redirect("/")
                return
            self.send_html(200, render_login_page())
            return

        # Restrict remaining pages to authenticated admins
        if not self.is_authenticated():
            self.redirect("/portal")
            return

        if path == "/":
            chats = scan_all_chats()
            km_docs = scan_km_documents()
            exports = scan_exported_partitions()
            history = load_ai_history()
            self.send_html(200, render_console_dashboard(chats, km_docs, exports, history))
            return

        self.send_json(404, {"ok": False, "error": "not found"})

    def do_POST(self) -> None:
        parsed_url = urllib.parse.urlsplit(self.path)
        path = parsed_url.path

        # 1. Handle Login
        if path == "/login":
            length = int(self.headers.get("Content-Length", "0") or "0")
            body = self.rfile.read(length)
            form = urllib.parse.parse_qs(body.decode("utf-8"))
            username = form.get("username", [""])[0]
            password = form.get("password", [""])[0]

            if username == "admin" and password == "666666":
                self.redirect("/", extra_headers={
                    "Set-Cookie": "falo_session=admin_ok; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax"
                })
                return
            self.send_html(401, render_login_page(error="帳號或密碼錯誤"))
            return

        # 2. Handle Logout
        if path == "/logout":
            self.redirect("/login", extra_headers={
                "Set-Cookie": "falo_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
            })
            return

        # 3. LINE Messaging API Webhook (Open endpoint, requires Signature Validation)
        if path == "/webhook":
            length = int(self.headers.get("Content-Length", "0") or "0")
            body = self.rfile.read(length)
            signature = self.headers.get("X-Line-Signature", "")

            # Validate signature
            if LINE_CHANNEL_SECRET and not verify_signature(body, LINE_CHANNEL_SECRET, signature):
                self.send_json(403, {"ok": False, "error": "invalid signature"})
                return

            try:
                payload = json.loads(body.decode("utf-8"))
                sys.stderr.write(f"[webhook] Received payload: {json.dumps(payload)}\n")
            except Exception as e:
                self.send_json(400, {"ok": False, "error": f"invalid JSON: {e}"})
                return

            events = payload.get("events", [])
            if not isinstance(events, list):
                self.send_json(400, {"ok": False, "error": "invalid payload schema"})
                return

            # Process Webhook Events
            processed = 0
            for event in events:
                source = event.get("source", {})
                source_type = source.get("type", "")
                
                # Determine room/chat identity
                room_key = ""
                if source_type == "group":
                    room_key = source.get("groupId") or ""
                elif source_type == "room":
                    room_key = source.get("roomId") or ""
                elif source_type == "user":
                    room_key = source.get("userId") or ""

                if not room_key:
                    continue

                folder_name = f"{source_type}_{room_key}"
                chat_dir = CHATS_OUTPUT_DIR / "default" / folder_name
                chat_dir.mkdir(parents=True, exist_ok=True)

                # Sender profile
                sender_name = ""
                sender_pic = ""
                user_id = source.get("userId")
                if user_id and LINE_CHANNEL_ACCESS_TOKEN:
                    profile = fetch_user_profile(user_id, LINE_CHANNEL_ACCESS_TOKEN, room_key if source_type == "group" else None)
                    if profile:
                        sender_name = profile.get("displayName") or ""
                        sender_pic = profile.get("pictureUrl") or ""

                # Ensure manifest.json exists
                manifest_path = chat_dir / "manifest.json"
                if not manifest_path.exists():
                    chat_name = "群組對話" if source_type == "group" else "單聊視窗"
                    if source_type == "group" and LINE_CHANNEL_ACCESS_TOKEN:
                        summary = fetch_group_summary(room_key, LINE_CHANNEL_ACCESS_TOKEN)
                        if summary and summary.get("groupName"):
                            chat_name = summary["groupName"]
                    elif source_type == "user" and sender_name:
                        chat_name = sender_name
                            
                    manifest = {
                        "schema_version": "portable-chat-v1",
                        "chat_folder": folder_name,
                        "chat_name": chat_name,
                        "source_type": source_type,
                        "source_key": room_key,
                        "folder_created_at": now_local_iso()
                    }
                    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
                else:
                    # Update manifest chat_name dynamically if it was generic
                    try:
                        m = json.loads(manifest_path.read_text(encoding="utf-8"))
                        if m.get("chat_name") in {"單聊視窗", "群組對話", ""} and sender_name:
                            m["chat_name"] = sender_name
                            manifest_path.write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding="utf-8")
                    except Exception:
                        pass

                # Normalize event
                message = event.get("message", {})
                message_type = message.get("type", "")
                message_id = message.get("id", "")
                
                text_content = ""
                if message_type == "text":
                    text_content = message.get("text") or ""
                else:
                    text_content = f"[{message_type}]"

                normalized = {
                    "event_id": f"line_{event.get('timestamp')}_{message_id or event.get('type')}",
                    "event_type": event.get("type") or "message",
                    "source_type": "line_messaging_api",
                    "source": source,
                    "sender": {
                        "user_id": user_id,
                        "display_name": sender_name,
                        "picture_url": sender_pic
                    },
                    "line": {
                        "message_id": message_id,
                        "message_type": message_type
                    },
                    "text": text_content,
                    "captured_at": now_local_iso(),
                    "line_timestamp": event.get("timestamp")
                }

                # Download media attachments
                if LINE_CHANNEL_ACCESS_TOKEN and message_id and message_type in {"image", "video", "audio", "file"}:
                    ext = "bin"
                    if message_type == "image":
                        ext = "jpg"
                    elif message_type == "video":
                        ext = "mp4"
                    elif message_type == "audio":
                        ext = "m4a"
                    elif message_type == "file":
                        orig_name = message.get("fileName") or ""
                        if "." in orig_name:
                            ext = orig_name.split(".")[-1].lower()
                        else:
                            ext = "bin"
                    
                    media_file = chat_dir / "media" / f"{message_id}.{ext}"
                    success = download_line_attachment(message_id, LINE_CHANNEL_ACCESS_TOKEN, media_file)
                    if success:
                        normalized["media"] = {
                            "downloaded": True,
                            "path": str(media_file),
                            "stored_file_name": f"{message_id}.{ext}",
                            "type": message_type
                        }
                        if message_type == "file":
                            normalized["media"]["original_file_name"] = message.get("fileName") or f"{message_id}.bin"
                            normalized["media"]["file_size"] = message.get("fileSize")

                # Save event
                append_jsonl(chat_dir / "events.jsonl", normalized)
                processed += 1

            self.send_json(200, {"ok": True, "processed": processed})
            return

        # 4. Exporter to split LINE chat logs into markdown files (NotebookLM ready)
        if path == "/api/export_notebooklm":
            if not self.is_authenticated():
                self.send_json(401, {"ok": False, "error": "admin login required"})
                return

            length = int(self.headers.get("Content-Length", "0") or "0")
            try:
                post_data = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception as exc:
                self.send_json(400, {"ok": False, "error": f"invalid JSON: {exc}"})
                return

            sources = post_data.get("sources", [])
            partition_type = post_data.get("partition_type", "day")
            export_format = post_data.get("export_format", "log")
            selected_model = post_data.get("model", "gemini-3.1-flash-lite")
            req_api_key = post_data.get("api_key", "").strip()

            events = []
            source_names = []
            for src in sources:
                if src.startswith("imported/"):
                    filename = src.replace("imported/", "")
                    src_file = IMPORTED_CHATS_DIR / filename / "events.jsonl"
                    manifest_file = IMPORTED_CHATS_DIR / filename / "manifest.json"
                elif src.startswith("default/"):
                    filename = src.replace("default/", "")
                    src_file = CHATS_OUTPUT_DIR / "default" / filename / "events.jsonl"
                    manifest_file = CHATS_OUTPUT_DIR / "default" / filename / "manifest.json"
                else:
                    continue

                if manifest_file.exists():
                    try:
                        m = json.loads(manifest_file.read_text(encoding="utf-8"))
                        source_names.append(m.get("chat_name") or filename)
                    except Exception:
                        source_names.append(filename)

                if src_file.exists():
                    try:
                        with src_file.open("r", encoding="utf-8") as f:
                            for line in f:
                                if not line.strip():
                                    continue
                                events.append(json.loads(line))
                    except Exception:
                        pass

            if not events:
                self.send_json(200, {"ok": False, "error": "所選來源無任何對話事件。"})
                return

            # Group events by partition key
            grouped_events = {}
            for evt in events:
                if is_media_event(evt):
                    continue
                captured_at = evt.get("captured_at") or format_line_timestamp(evt.get("line_timestamp"))
                if not captured_at or len(captured_at) < 10:
                    continue
                date_str = captured_at[:10]
                
                group_key = ""
                if partition_type == "day":
                    group_key = date_str
                elif partition_type == "month":
                    group_key = date_str[:7]
                elif partition_type == "week":
                    try:
                        dt_obj = dt.date.fromisoformat(date_str)
                        iso_year, iso_week, _ = dt_obj.isocalendar()
                        group_key = f"{iso_year}-W{iso_week:02d}"
                    except Exception:
                        continue
                else:
                    continue
                
                grouped_events.setdefault(group_key, []).append(evt)

            # Ensure partition subdirs
            partition_exports_dir = EXPORTS_BASE_DIR / partition_type
            partition_exports_dir.mkdir(parents=True, exist_ok=True)

            generated_files = []
            sources_str = ", ".join(source_names)

            for group_key, group_list in grouped_events.items():
                group_list.sort(key=lambda x: x.get("line_timestamp") or 0)
                file_name = f"{group_key}-{export_format}.md"
                file_path = partition_exports_dir / file_name

                # Format dialogue
                log_lines = []
                for evt in group_list:
                    captured_at = evt.get("captured_at") or format_line_timestamp(evt.get("line_timestamp"))
                    time_part = captured_at[:16].replace("T", " ") if captured_at else ""
                    sender = evt.get("sender_name_hint") or evt.get("sender", {}).get("display_name") or "(未知)"
                    text = evt.get("text") or ""
                    log_lines.append(f"- **[{time_part}] {sender}**: {text}")
                
                chat_log_text = "\n".join(log_lines)

                if export_format == "log":
                    content = (
                        f"# LINE 對話紀錄 - {group_key}\n\n"
                        f"* **資料來源**: {sources_str}\n"
                        f"* **分割類型**: 按{partition_type}分割\n"
                        f"* **總計訊息**: {len(group_list)} 筆\n"
                        f"* **產出時間**: {now_local_iso()}\n\n"
                        "---\n\n"
                        f"{chat_log_text}\n"
                    )
                    file_path.write_text(content, encoding="utf-8")
                else:
                    system_instruction = (
                        "You are FALO IM Coworker, an agentic AI assistant.\n"
                        "Please analyze and summarize the following chat logs. Focus on extracting:\n"
                        "1. Summary of discussions\n"
                        "2. Action items (Task, Owner, Due Date)\n"
                        "3. Decisions made\n"
                        "4. Risks identified\n"
                        "Format the report beautifully in Traditional Chinese with Markdown tables, bold headers, and lists."
                    )
                    prompt = f"Here is the chat log for {group_key}:\n\n{chat_log_text}"
                    
                    api_key = req_api_key or GEMINI_API_KEY
                    if not api_key:
                        summary_result = "（無法生成 AI 摘要報告：本地尚未配置 GEMINI_API_KEY 且未提供自訂 API Key）"
                    else:
                        summary_result = call_gemini(api_key, system_instruction, prompt, model=selected_model)
                    
                    content = (
                        f"# LINE 對話摘要報告 - {group_key}\n\n"
                        f"* **資料來源**: {sources_str}\n"
                        f"* **分割類型**: 按{partition_type}分割\n"
                        f"* **總計原始訊息**: {len(group_list)} 筆\n"
                        f"* **產出時間**: {now_local_iso()}\n\n"
                        "---\n\n"
                        f"{summary_result}\n"
                    )
                    file_path.write_text(content, encoding="utf-8")
                
                generated_files.append({
                    "partition_type": partition_type,
                    "file_name": file_name,
                    "file_path": f"/exports/{partition_type}/{file_name}"
                })

            self.send_json(200, {"ok": True, "files": generated_files})
            return

        # 5. AI query endpoint (Handles both raw sources and exported partitioned files)
        if path == "/api/query_ai":
            if not self.is_authenticated():
                self.send_json(401, {"ok": False, "error": "admin login required"})
                return

            length = int(self.headers.get("Content-Length", "0") or "0")
            try:
                post_data = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception as exc:
                self.send_json(400, {"ok": False, "error": f"invalid JSON: {exc}"})
                return

            sources = post_data.get("sources", [])
            km_files = post_data.get("km_files", [])
            exported_files = post_data.get("exported_files", [])
            start_date = post_data.get("start_date", "")
            end_date = post_data.get("end_date", "")
            prompt = post_data.get("prompt", "")
            selected_model = post_data.get("model", "gemini-3.1-flash-lite")
            req_api_key = post_data.get("api_key", "").strip()

            # A. Load raw source events
            events = []
            for src in sources:
                if src.startswith("imported/"):
                    filename = src.replace("imported/", "")
                    src_file = IMPORTED_CHATS_DIR / filename / "events.jsonl"
                elif src.startswith("default/"):
                    filename = src.replace("default/", "")
                    src_file = CHATS_OUTPUT_DIR / "default" / filename / "events.jsonl"
                else:
                    continue

                if src_file.exists():
                    try:
                        with src_file.open("r", encoding="utf-8") as f:
                            for line in f:
                                if not line.strip():
                                    continue
                                events.append(json.loads(line))
                    except Exception:
                        pass

            # Filter raw events by date range
            filtered_events = []
            for evt in events:
                captured_at = evt.get("captured_at") or format_line_timestamp(evt.get("line_timestamp"))
                if not captured_at:
                    filtered_events.append(evt)
                    continue
                date_str = captured_at[:10]
                if start_date and date_str < start_date:
                    continue
                if end_date and date_str > end_date:
                    continue
                filtered_events.append(evt)

            # Sort and cap raw events (last 1000 messages)
            filtered_events.sort(key=lambda x: x.get("line_timestamp") or 0)
            context_events = filtered_events[-1000:]

            # Format raw chat context
            chat_context_lines = []
            for evt in context_events:
                if is_media_event(evt):
                    continue
                captured_at = evt.get("captured_at") or format_line_timestamp(evt.get("line_timestamp"))
                sender = evt.get("sender_name_hint") or evt.get("sender", {}).get("display_name") or "(未知)"
                text = evt.get("text") or ""
                time_part = captured_at[:16].replace("T", " ") if captured_at else ""
                chat_context_lines.append(f"[{time_part}] {sender}: {text}")
            chat_context = "\n".join(chat_context_lines)

            # B. Load exported partition files
            exported_context_lines = []
            for exp_file in exported_files:
                safe_name = os.path.basename(exp_file)
                found_path = None
                for subdir in {"day", "week", "month"}:
                    candidate = EXPORTS_BASE_DIR / subdir / safe_name
                    if candidate.exists() and candidate.is_file():
                        found_path = candidate
                        break
                
                if found_path:
                    try:
                        content = found_path.read_text(encoding="utf-8")
                        exported_context_lines.append(f"=== EXPORTED PARTITION FILE: {safe_name} ===\n{content}\n")
                    except Exception as e:
                        exported_context_lines.append(f"=== EXPORTED PARTITION FILE: {safe_name} (Failed to read: {e}) ===\n")
            exported_context = "\n".join(exported_context_lines)

            # C. Load KM context
            km_context_lines = []
            for km_file in km_files:
                safe_name = os.path.basename(km_file)
                km_path = KM_NOTES_DIR / safe_name
                if km_path.exists() and km_path.is_file():
                    try:
                        content = km_path.read_text(encoding="utf-8")
                        km_context_lines.append(f"=== KM FILE: {safe_name} ===\n{content}\n")
                    except Exception as e:
                        km_context_lines.append(f"=== KM FILE: {safe_name} (Failed to read: {e}) ===\n")
            km_context = "\n".join(km_context_lines)

            # System prompt instruction
            system_instruction = (
                "You are FALO IM Coworker, an agentic AI coding assistant. You analyze chat logs, pre-partitioned export summaries, and KM references.\n"
                "Here is the context of selected LINE chat rooms (last 1000 messages matching filters):\n"
                "------ CHAT HISTORY START ------\n"
                f"{chat_context}\n"
                "------ CHAT HISTORY END ------\n\n"
                "Here are the referenced pre-partitioned daily/weekly/monthly reports:\n"
                "------ EXPORTED PARTITION START ------\n"
                f"{exported_context}\n"
                "------ EXPORTED PARTITION END ------\n\n"
                "Here are the referenced Knowledge Management (KM) notes:\n"
                "------ KM REFERENCE START ------\n"
                f"{km_context}\n"
                "------ KM REFERENCE END ------\n\n"
                "Guidelines:\n"
                "- Rely strictly on the chat history, exported partition summaries, and KM reference provided.\n"
                "- Answer the user query comprehensively in Traditional Chinese.\n"
                "- Format the output beautifully using Markdown tables, lists, and headers."
            )

            # Calculate points deduction and check limits
            total_input_chars = len(system_instruction) + len(prompt)
            warning_msg = None
            if total_input_chars > 120000:
                system_instruction = system_instruction[:120000]
                total_input_chars = 120000
                warning_msg = "⚠️ 您的輸入分析內容長度已超出系統 AI 智能限制上限（120,000 字元）。系統已自動為您裁切至最優容量進行分析。"

            if total_input_chars <= 40000:
                deducted_points = 1
            elif total_input_chars <= 80000:
                deducted_points = 2
            else:
                deducted_points = 3

            using_custom_key = bool(req_api_key)
            points_data = load_points_db()
            
            if not using_custom_key and points_data["remaining_points"] <= 0:
                self.send_json(200, {"ok": False, "error": "您的預設 AI 點數額度已扣減完畢。請聯絡天勳資訊加值充值，或在右上角填入您個人的 Gemini API Key 即可續用！"})
                return

            api_key = req_api_key or GEMINI_API_KEY
            if not api_key:
                self.send_json(200, {"ok": False, "error": "地端尚未配置 GEMINI_API_KEY，且未提供自訂 API Key。"})
                return

            ai_response, usage = call_gemini_with_metadata(api_key, system_instruction, prompt, model=selected_model)
            
            # Deduct points if using default key
            if not using_custom_key:
                points_data["remaining_points"] = max(0, points_data["remaining_points"] - deducted_points)
                save_points_db(points_data)
                
            remaining_points = points_data["remaining_points"]
            
            input_tokens = usage.get("promptTokenCount", 0)
            output_tokens = usage.get("candidatesTokenCount", 0)
            total_tokens = usage.get("totalTokenCount", 0)
            
            usd_cost = calculate_gemini_cost(selected_model, input_tokens, output_tokens)
            ntd_cost = usd_cost * 30.0

            history_record = {
                "timestamp": now_local_iso(),
                "prompt": prompt,
                "response": ai_response,
                "usage": {
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens,
                    "total_tokens": total_tokens,
                    "usd_cost": f"{usd_cost:.6f}",
                    "ntd_cost": f"{ntd_cost:.4f}",
                    "model": selected_model
                }
            }
            history_file = ROOT_DIR / "out" / "ai_history.jsonl"
            append_jsonl(history_file, history_record)

            self.send_json(200, {
                "ok": True,
                "response": ai_response,
                "warning": warning_msg,
                "points_info": {
                    "deducted": deducted_points if not using_custom_key else 0,
                    "remaining": remaining_points if not using_custom_key else "無限 (自備金鑰)",
                    "using_custom_key": using_custom_key
                },
                "usage": {
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens,
                    "total_tokens": total_tokens,
                    "usd_cost": f"{usd_cost:.6f}",
                    "ntd_cost": f"{ntd_cost:.4f}",
                    "model": selected_model
                }
            })
            return

        self.send_json(404, {"ok": False, "error": "not found"})

# Main Runner
def run_server() -> None:
    server_address = (LINE_BOT_HOST, LINE_BOT_PORT)
    httpd = ThreadingHTTPServer(server_address, AppHandler)
    httpd.settings = {  # type: ignore[attr-defined]
        "host": LINE_BOT_HOST,
        "port": LINE_BOT_PORT
    }
    print(f"[success] FALO IM Server running at http://{LINE_BOT_HOST}:{LINE_BOT_PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[info] Server stopping...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
