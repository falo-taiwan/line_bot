#!/usr/bin/env python3
"""
FALO IM Standard LINE Bot PoC

Observer-safe official route:
- Receives LINE Messaging API webhook events.
- Validates LINE signatures when LINE_CHANNEL_SECRET is configured.
- Normalizes message events into local JSONL records.
- Optionally downloads user-sent media with LINE_CHANNEL_ACCESS_TOKEN.
- Can optionally reply with a small acknowledgement, but collection-only mode is
  the default to avoid unnecessary outgoing LINE messages during PoC tests.

This script does not read personal LINE Desktop data. It only handles events
delivered by LINE to this Official Account webhook.
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import hashlib
import html
import hmac
import json
import mimetypes
import os
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover - Python 3.8+ normally has zoneinfo.
    ZoneInfo = None  # type: ignore[assignment]


DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8088
DEFAULT_OUTPUT_DIR = "out/standard-line-bot"
DEFAULT_AUTO_REPLY = "false"
DEFAULT_DOWNLOAD_MEDIA = "true"
DEFAULT_NGROK_MONITOR = "true"
DEFAULT_NGROK_API_URL = "http://127.0.0.1:4040/api/tunnels"
DEFAULT_NGROK_MONITOR_INTERVAL_SECONDS = 30 * 60
DEFAULT_ADMIN_USER = "admin"
DEFAULT_ADMIN_PASSWORD = "666666"
DEFAULT_ADMIN_SESSION_TTL_SECONDS = 12 * 60 * 60
DEFAULT_GAS_PROXY_URL = (
    "https://script.google.com/macros/s/"
    "AKfycbxlGJBeITEwcXHRRoi1k2yZfbb-y1PkoNw61aABB6I8qB0StweTImMT8ohL3KJmLt_X/exec"
)
DEFAULT_GAS_PROXY_SHEET_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "1VWP34oZeUqcYdOfI042SDeHXNNhLKi2vQCYDzAOaDyo/edit?gid=0#gid=0"
)
DEFAULT_GAS_PROXY_TIMEOUT_SECONDS = 20
ADMIN_SESSION_COOKIE_NAME = "falo_admin_session"
LINE_REPLY_ENDPOINT = "https://api.line.me/v2/bot/message/reply"
LINE_CONTENT_ENDPOINT = "https://api-data.line.me/v2/bot/message/{message_id}/content"
LINE_USER_PROFILE_ENDPOINT = "https://api.line.me/v2/bot/profile/{user_id}"
LINE_GROUP_MEMBER_PROFILE_ENDPOINT = "https://api.line.me/v2/bot/group/{group_id}/member/{user_id}"
LINE_ROOM_MEMBER_PROFILE_ENDPOINT = "https://api.line.me/v2/bot/room/{room_id}/member/{user_id}"
TAIPEI_TIME_ZONE_NAME = "Asia/Taipei"
TAIPEI_TIME_ZONE = (
    ZoneInfo(TAIPEI_TIME_ZONE_NAME)
    if ZoneInfo is not None
    else dt.timezone(dt.timedelta(hours=8), name=TAIPEI_TIME_ZONE_NAME)
)


def now_local_iso() -> str:
    return dt.datetime.now(TAIPEI_TIME_ZONE).isoformat(timespec="seconds")


def env_bool(name: str, default: str = "false") -> bool:
    value = os.environ.get(name, default).strip().lower()
    return value in {"1", "true", "yes", "y", "on"}


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def env_key_component(value: str) -> str:
    return "".join(char if char.isalnum() else "_" for char in value.strip().upper()).strip("_")


def load_channel_configs_from_env() -> List[Dict[str, str]]:
    aliases = [
        alias.strip()
        for alias in os.environ.get("LINE_BOT_CHANNELS", "").split(",")
        if alias.strip()
    ]
    channels: List[Dict[str, str]] = []

    for alias in aliases:
        key = env_key_component(alias)
        if not key:
            continue
        channels.append(
            {
                "alias": alias,
                "name": os.environ.get(f"LINE_BOT_CHANNEL_{key}_NAME", alias),
                "destination": os.environ.get(f"LINE_BOT_CHANNEL_{key}_DESTINATION", ""),
                "channel_secret": os.environ.get(f"LINE_BOT_CHANNEL_{key}_SECRET", ""),
                "channel_access_token": os.environ.get(f"LINE_BOT_CHANNEL_{key}_ACCESS_TOKEN", ""),
                "basic_id": os.environ.get(f"LINE_BOT_CHANNEL_{key}_BASIC_ID", ""),
            }
        )

    legacy_secret = os.environ.get("LINE_CHANNEL_SECRET", "")
    legacy_token = os.environ.get("LINE_CHANNEL_ACCESS_TOKEN", "")
    if legacy_secret or legacy_token or not channels:
        channels.append(
            {
                "alias": "default",
                "name": os.environ.get("LINE_BOT_CHANNEL_NAME", "Default LINE Bot"),
                "destination": os.environ.get("LINE_BOT_CHANNEL_DESTINATION", ""),
                "channel_secret": legacy_secret,
                "channel_access_token": legacy_token,
                "basic_id": os.environ.get("LINE_BOT_BASIC_ID", ""),
            }
        )

    return channels


def html_escape(value: object) -> str:
    return html.escape("" if value is None else str(value), quote=True)


def safe_slug(value: str) -> str:
    keep = []
    for char in value.lower():
        if char.isalnum():
            keep.append(char)
        elif char in ("-", "_", " ", "."):
            keep.append("-")
    slug = "".join(keep).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug or "line-content"


def verify_line_signature(channel_secret: str, body: bytes, signature: str) -> bool:
    if not channel_secret or not signature:
        return False
    digest = hmac.new(channel_secret.encode("utf-8"), body, hashlib.sha256).digest()
    expected = base64.b64encode(digest).decode("utf-8")
    return hmac.compare_digest(expected, signature)


def verify_any_channel_signature(
    channels: Iterable[Dict[str, str]],
    body: bytes,
    signature: str,
) -> Optional[Dict[str, str]]:
    for channel in channels:
        if verify_line_signature(channel.get("channel_secret", ""), body, signature):
            return channel
    return None


def select_channel_config(
    channels: Iterable[Dict[str, str]],
    *,
    destination: object = "",
    verified_channel: Optional[Dict[str, str]] = None,
) -> Dict[str, str]:
    if verified_channel:
        return verified_channel

    destination_text = str(destination or "")
    channel_list = list(channels)
    if destination_text:
        for channel in channel_list:
            if channel.get("destination") == destination_text:
                return channel

    return channel_list[0] if len(channel_list) == 1 else {}


def public_bot_info(channel: Dict[str, str], destination: object = "") -> Dict[str, str]:
    if not channel and not destination:
        return {}
    return {
        "alias": channel.get("alias", ""),
        "name": channel.get("name", ""),
        "basic_id": channel.get("basic_id", ""),
        "destination": channel.get("destination") or str(destination or ""),
    }


def append_jsonl(path: Path, payload: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False) + "\n")


def check_ngrok_status(api_url: str) -> Dict[str, object]:
    started_at = time.time()
    status: Dict[str, object] = {
        "checked_at": now_local_iso(),
        "api_url": api_url,
        "ok": False,
        "http_status": None,
        "tunnel_count": 0,
        "https_tunnel_count": 0,
        "public_urls": [],
        "tunnels": [],
        "error": "",
        "latency_ms": 0,
    }

    try:
        request = urllib.request.Request(api_url, headers={"Accept": "application/json"}, method="GET")
        with urllib.request.urlopen(request, timeout=10) as response:
            body = response.read()
            status["http_status"] = response.getcode()
        payload = json.loads(body.decode("utf-8") or "{}")
        tunnels = payload.get("tunnels", [])
        if not isinstance(tunnels, list):
            tunnels = []

        normalized_tunnels: List[Dict[str, object]] = []
        public_urls: List[str] = []
        https_count = 0
        for tunnel in tunnels:
            if not isinstance(tunnel, dict):
                continue
            public_url = str(tunnel.get("public_url") or "")
            proto = str(tunnel.get("proto") or "")
            config = tunnel.get("config") if isinstance(tunnel.get("config"), dict) else {}
            if proto == "https" or public_url.startswith("https://"):
                https_count += 1
            if public_url:
                public_urls.append(public_url)
            normalized_tunnels.append(
                {
                    "name": tunnel.get("name", ""),
                    "proto": proto,
                    "public_url": public_url,
                    "local_addr": config.get("addr", "") if isinstance(config, dict) else "",
                }
            )

        status["tunnel_count"] = len(normalized_tunnels)
        status["https_tunnel_count"] = https_count
        status["public_urls"] = public_urls
        status["tunnels"] = normalized_tunnels
        status["ok"] = bool(https_count)
    except Exception as exc:
        status["error"] = f"{type(exc).__name__}: {exc}"
    finally:
        status["latency_ms"] = int((time.time() - started_at) * 1000)

    return status


def read_last_jsonl(path: Path) -> Dict[str, object]:
    if not path.exists():
        return {}
    for line in reversed(path.read_text(encoding="utf-8").splitlines()):
        line = line.strip()
        if not line:
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(payload, dict):
            return payload
    return {}


def latest_ngrok_status(output_dir: Path, api_url: str, *, refresh: bool = False) -> Dict[str, object]:
    log_path = output_dir / "ngrok_status.jsonl"
    if refresh:
        status = check_ngrok_status(api_url)
        append_jsonl(log_path, status)
        return status

    cached = read_last_jsonl(log_path)
    if cached:
        cached = dict(cached)
        cached["from_cache"] = True
        return cached

    status = check_ngrok_status(api_url)
    append_jsonl(log_path, status)
    return status


def validate_gas_exec_url(url: str) -> str:
    url = url.strip()
    parts = urllib.parse.urlsplit(url)
    if (
        parts.scheme != "https"
        or parts.netloc != "script.google.com"
        or "/macros/s/" not in parts.path
        or not parts.path.endswith("/exec")
    ):
        raise ValueError("Only Google Apps Script /macros/s/.../exec URLs are allowed in dev proxy mode.")
    return url


def build_gas_proxy_url(
    base_url: str,
    api_name: str,
    *,
    incoming_query: str = "",
    viewer_token: str = "",
) -> str:
    incoming = dict(urllib.parse.parse_qsl(incoming_query, keep_blank_values=True))
    selected_base_url = validate_gas_exec_url(incoming.get("url") or base_url)
    base_parts = urllib.parse.urlsplit(selected_base_url)
    query = dict(urllib.parse.parse_qsl(base_parts.query, keep_blank_values=True))
    query["api"] = api_name
    if viewer_token:
        query["token"] = viewer_token

    if api_name == "events":
        query["limit"] = incoming.get("limit", query.get("limit", "200"))
    elif "limit" in query:
        query.pop("limit", None)

    encoded_query = urllib.parse.urlencode(query)
    return urllib.parse.urlunsplit(
        (base_parts.scheme, base_parts.netloc, base_parts.path, encoded_query, base_parts.fragment)
    )


def fetch_json_url(url: str, *, timeout_seconds: int = DEFAULT_GAS_PROXY_TIMEOUT_SECONDS) -> Tuple[int, Dict[str, object]]:
    started_at = time.time()
    request = urllib.request.Request(url, headers={"Accept": "application/json"}, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=timeout_seconds) as response:
            body = response.read()
            status = response.getcode()
        payload = json.loads(body.decode("utf-8") or "{}")
        if not isinstance(payload, dict):
            payload = {"ok": False, "error": "upstream JSON root is not an object", "data": payload}
        payload.setdefault("ok", 200 <= status < 300)
        payload["_proxy"] = {
            "http_status": status,
            "latency_ms": int((time.time() - started_at) * 1000),
        }
        return status, payload
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        return exc.code, {
            "ok": False,
            "error": f"upstream HTTPError: {exc.code}",
            "body": raw[:1000],
            "_proxy": {
                "http_status": exc.code,
                "latency_ms": int((time.time() - started_at) * 1000),
            },
        }
    except Exception as exc:
        return 502, {
            "ok": False,
            "error": f"{type(exc).__name__}: {exc}",
            "_proxy": {
                "http_status": None,
                "latency_ms": int((time.time() - started_at) * 1000),
            },
        }


def start_ngrok_monitor(settings: Dict[str, object]) -> None:
    if not settings.get("ngrok_monitor"):
        return

    api_url = str(settings.get("ngrok_api_url") or DEFAULT_NGROK_API_URL)
    interval_seconds = max(60, int(settings.get("ngrok_monitor_interval_seconds") or 0))
    output_dir = Path(str(settings["output_dir"]))
    log_path = output_dir / "ngrok_status.jsonl"

    def monitor_loop() -> None:
        while True:
            status = check_ngrok_status(api_url)
            append_jsonl(log_path, status)
            public_urls = status.get("public_urls")
            if status.get("ok"):
                print(f"[ngrok] ok public_urls={public_urls} log={log_path}", flush=True)
            else:
                print(f"[ngrok] not_ready error={status.get('error')} log={log_path}", file=sys.stderr, flush=True)
            time.sleep(interval_seconds)

    thread = threading.Thread(target=monitor_loop, name="ngrok-status-monitor", daemon=True)
    thread.start()


def parse_form_urlencoded(body: bytes) -> Dict[str, str]:
    parsed = urllib.parse.parse_qs(body.decode("utf-8"), keep_blank_values=True)
    return {key: values[-1] if values else "" for key, values in parsed.items()}


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode((value + padding).encode("ascii"))


def create_admin_session_cookie(username: str, secret: str, *, now: Optional[int] = None) -> str:
    issued_at = int(time.time() if now is None else now)
    payload = json.dumps({"u": username, "iat": issued_at}, separators=(",", ":")).encode("utf-8")
    payload_part = _b64url_encode(payload)
    signature = hmac.new(secret.encode("utf-8"), payload_part.encode("ascii"), hashlib.sha256).digest()
    return f"{payload_part}.{_b64url_encode(signature)}"


def verify_admin_session_cookie(
    cookie_value: str,
    secret: str,
    *,
    now: Optional[int] = None,
    ttl_seconds: int = DEFAULT_ADMIN_SESSION_TTL_SECONDS,
) -> Optional[str]:
    if not cookie_value or "." not in cookie_value or not secret:
        return None
    payload_part, signature_part = cookie_value.split(".", 1)
    expected = hmac.new(secret.encode("utf-8"), payload_part.encode("ascii"), hashlib.sha256).digest()
    if not hmac.compare_digest(_b64url_encode(expected), signature_part):
        return None
    try:
        payload = json.loads(_b64url_decode(payload_part).decode("utf-8"))
    except (ValueError, json.JSONDecodeError):
        return None
    username = payload.get("u")
    issued_at = payload.get("iat")
    if not isinstance(username, str) or not isinstance(issued_at, int):
        return None
    current = int(time.time() if now is None else now)
    if issued_at > current + 60 or current - issued_at > ttl_seconds:
        return None
    return username


def load_recent_events(events_path: Path, *, limit: int = 200) -> List[Dict[str, object]]:
    if not events_path.exists():
        return []
    records: List[Dict[str, object]] = []
    for raw_line in events_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError:
            payload = {
                "event_id": "jsonl_parse_error",
                "event_type": "jsonl_parse_error",
                "captured_at": now_local_iso(),
                "text": line[:500],
                "processing_status": "parse_failed",
            }
        if isinstance(payload, dict):
            records.append(payload)
    return list(reversed(records[-limit:]))


def format_line_timestamp(timestamp: object) -> str:
    if not isinstance(timestamp, (int, float)):
        return ""
    try:
        return dt.datetime.fromtimestamp(timestamp / 1000, tz=dt.timezone.utc).astimezone(
            TAIPEI_TIME_ZONE
        ).isoformat(timespec="minutes")
    except (OverflowError, OSError, ValueError):
        return ""


def source_key(source: Dict[str, object]) -> str:
    source_type = str(source.get("type", "unknown"))
    if source_type == "user":
        return str(source.get("userId", "unknown-user"))
    if source_type == "group":
        return str(source.get("groupId", "unknown-group"))
    if source_type == "room":
        return str(source.get("roomId", "unknown-room"))
    return "unknown-source"


def sender_profile_url(source: Dict[str, object]) -> str:
    source_type = str(source.get("type", ""))
    user_id = str(source.get("userId") or "")
    if not user_id:
        return ""
    if source_type == "group" and source.get("groupId"):
        return LINE_GROUP_MEMBER_PROFILE_ENDPOINT.format(group_id=source["groupId"], user_id=user_id)
    if source_type == "room" and source.get("roomId"):
        return LINE_ROOM_MEMBER_PROFILE_ENDPOINT.format(room_id=source["roomId"], user_id=user_id)
    if source_type == "user":
        return LINE_USER_PROFILE_ENDPOINT.format(user_id=user_id)
    return ""


def fetch_sender_profile(channel_access_token: str, source: Dict[str, object]) -> Dict[str, object]:
    url = sender_profile_url(source)
    if not channel_access_token or not url:
        return {}
    request = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {channel_access_token}"},
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def apply_sender_profile(
    normalized: Dict[str, object],
    profile: Dict[str, object],
    *,
    source_label: str,
) -> None:
    sender = normalized.get("sender")
    if not isinstance(sender, dict) or not profile:
        return
    sender["user_id"] = profile.get("userId", sender.get("user_id"))
    sender["display_name"] = profile.get("displayName")
    sender["picture_url"] = profile.get("pictureUrl")
    sender["status_message"] = profile.get("statusMessage")
    sender["language"] = profile.get("language")
    sender["profile_source"] = source_label


def classify_message(message: Dict[str, object]) -> Tuple[str, str]:
    message_type = str(message.get("type", "unknown"))
    if message_type == "text":
        text = str(message.get("text", ""))
        normalized = " ".join(text.strip().split())
        if normalized.startswith(("#task", "task", "任務", "待辦")):
            return "task_candidate", "text"
        if normalized.startswith(("#risk", "risk", "風險")):
            return "risk_candidate", "text"
        if normalized.startswith(("#note", "note", "知識", "筆記")):
            return "knowledge_candidate", "text"
        return "message_text", "text"
    if message_type in {"image", "video", "audio", "file"}:
        return f"message_{message_type}", "media"
    return f"message_{message_type}", message_type


def normalize_event(event: Dict[str, object]) -> Dict[str, object]:
    source = event.get("source") if isinstance(event.get("source"), dict) else {}
    message = event.get("message") if isinstance(event.get("message"), dict) else {}
    assert isinstance(source, dict)
    assert isinstance(message, dict)

    event_type = str(event.get("type", "unknown"))
    line_message_type = str(message.get("type", "")) if message else ""
    internal_type, content_kind = classify_message(message) if message else (event_type, event_type)
    event_timestamp = event.get("timestamp")
    captured_at = now_local_iso()

    normalized: Dict[str, object] = {
        "event_id": f"line_{event_timestamp or int(time.time() * 1000)}_{event_type}",
        "event_type": internal_type,
        "source_type": "line_messaging_api",
        "source": {
            "type": source.get("type", "unknown"),
            "key": source_key(source),
            "user_id": source.get("userId"),
            "group_id": source.get("groupId"),
            "room_id": source.get("roomId"),
        },
        "sender": {
            "user_id": source.get("userId"),
            "display_name": None,
            "picture_url": None,
            "status_message": None,
            "language": None,
            "profile_source": None,
        },
        "line": {
            "event_type": event_type,
            "mode": event.get("mode"),
            "webhook_event_id": event.get("webhookEventId"),
            "delivery_context": event.get("deliveryContext", {}),
            "reply_token_present": bool(event.get("replyToken")),
            "message_id": message.get("id"),
            "message_type": line_message_type,
        },
        "content_kind": content_kind,
        "captured_at": captured_at,
        "line_timestamp": event_timestamp,
        "text": "",
        "media": {},
        "privacy_level": "official_account_webhook_authorized",
        "processing_status": "received",
    }

    if line_message_type == "text":
        normalized["text"] = str(message.get("text", ""))
    elif line_message_type == "location":
        normalized["location"] = {
            "title": message.get("title"),
            "address": message.get("address"),
            "latitude": message.get("latitude"),
            "longitude": message.get("longitude"),
        }
    elif line_message_type == "sticker":
        normalized["sticker"] = {
            "package_id": message.get("packageId"),
            "sticker_id": message.get("stickerId"),
            "sticker_resource_type": message.get("stickerResourceType"),
        }
    elif line_message_type in {"image", "video", "audio", "file"}:
        normalized["media"] = {
            "message_id": message.get("id"),
            "type": line_message_type,
            "file_name": message.get("fileName"),
            "file_size": message.get("fileSize"),
            "duration": message.get("duration"),
            "content_provider": message.get("contentProvider"),
        }

    return normalized


def content_extension(content_type: str, fallback: str = ".bin") -> str:
    if not content_type:
        return fallback
    extension = mimetypes.guess_extension(content_type.split(";")[0].strip())
    if extension == ".jpe":
        return ".jpg"
    return extension or fallback


def short_component(value: object, *, default: str, length: int = 12) -> str:
    text = safe_slug(str(value or ""))
    return (text[:length] or default)[:length]


def media_timestamp_for_filename(timestamp: object) -> str:
    if isinstance(timestamp, (int, float)):
        try:
            return dt.datetime.fromtimestamp(timestamp / 1000, tz=dt.timezone.utc).astimezone(
                TAIPEI_TIME_ZONE
            ).strftime("%Y%m%d-%H%M%S")
        except (OverflowError, OSError, ValueError):
            pass
    return dt.datetime.now(TAIPEI_TIME_ZONE).strftime("%Y%m%d-%H%M%S")


def chat_folder_name(normalized: Dict[str, object]) -> str:
    source = normalized.get("source") if isinstance(normalized.get("source"), dict) else {}
    assert isinstance(source, dict)
    source_type = short_component(source.get("type"), default="source", length=20)
    source_key_value = source.get("key") or source.get("group_id") or source.get("room_id") or source.get("user_id")
    return f"{source_type}_{short_component(source_key_value, default='unknown', length=16)}"


def build_media_filename(
    *,
    normalized: Dict[str, object],
    message_type: str,
    message_id: str,
    digest: str,
    extension: str,
) -> str:
    source = normalized.get("source") if isinstance(normalized.get("source"), dict) else {}
    sender = normalized.get("sender") if isinstance(normalized.get("sender"), dict) else {}
    assert isinstance(source, dict)
    assert isinstance(sender, dict)
    timestamp = media_timestamp_for_filename(normalized.get("line_timestamp"))
    source_type = short_component(source.get("type"), default="source", length=20)
    source_key_part = short_component(source.get("key"), default="unknown", length=12)
    sender_part = short_component(sender.get("user_id"), default="nouser", length=12)
    media_part = short_component(message_type, default="media", length=16)
    message_part = short_component(message_id, default="nomsg", length=32)
    hash_part = short_component(digest, default="nohash", length=12)
    return f"{timestamp}_{source_type}_{source_key_part}_{sender_part}_{media_part}_{message_part}_{hash_part}{extension}"


def ensure_chat_manifest(chat_dir: Path, normalized: Dict[str, object]) -> None:
    manifest_path = chat_dir / "manifest.json"
    if manifest_path.exists():
        return
    source = normalized.get("source") if isinstance(normalized.get("source"), dict) else {}
    assert isinstance(source, dict)
    manifest = {
        "schema_version": "portable-chat-v1",
        "chat_folder": chat_dir.name,
        "source_type": source.get("type"),
        "source_key": source.get("key"),
        "folder_created_at": now_local_iso(),
        "coverage_start_at": normalized.get("captured_at"),
        "coverage_start_line_timestamp": normalized.get("line_timestamp"),
        "coverage_start_source": "first_event_seen",
        "data_files": ["manifest.json", "events.jsonl", "media_index.jsonl", "media_index.csv", "media/"],
        "note": "Portable local mirror for this LINE source. Main database may contain additional derived state.",
    }
    chat_dir.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def append_csv_row(path: Path, fieldnames: List[str], row: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    needs_header = not path.exists()
    line_values = []
    for field in fieldnames:
        value = "" if row.get(field) is None else str(row.get(field))
        line_values.append('"' + value.replace('"', '""') + '"')
    with path.open("a", encoding="utf-8") as handle:
        if needs_header:
            handle.write(",".join(fieldnames) + "\n")
        handle.write(",".join(line_values) + "\n")


def get_chat_dir(output_dir: Path, normalized: Dict[str, object]) -> Path:
    source = normalized.get("source") if isinstance(normalized.get("source"), dict) else {}
    assert isinstance(source, dict)
    
    # If the source is line_export (imported via import_adapter)
    if source.get("type") == "line_export":
        slug_name = safe_slug(str(normalized.get("source_key") or "imported"))
        return output_dir / "chats" / "imported" / slug_name
        
    bot = normalized.get("bot") if isinstance(normalized.get("bot"), dict) else {}
    assert isinstance(bot, dict)
    bot_alias = safe_slug(bot.get("alias") or bot.get("basic_id") or "default")
    return output_dir / "chats" / bot_alias / chat_folder_name(normalized)


def write_portable_chat_record(output_dir: Path, normalized: Dict[str, object]) -> None:
    chat_dir = get_chat_dir(output_dir, normalized)
    ensure_chat_manifest(chat_dir, normalized)
    append_jsonl(chat_dir / "events.jsonl", normalized)
    media = normalized.get("media") if isinstance(normalized.get("media"), dict) else {}
    if not isinstance(media, dict) or not media.get("downloaded"):
        return

    source = normalized.get("source") if isinstance(normalized.get("source"), dict) else {}
    sender = normalized.get("sender") if isinstance(normalized.get("sender"), dict) else {}
    line = normalized.get("line") if isinstance(normalized.get("line"), dict) else {}
    assert isinstance(source, dict)
    assert isinstance(sender, dict)
    assert isinstance(line, dict)
    index_record = {
        "event_id": normalized.get("event_id"),
        "file_name": media.get("stored_file_name"),
        "relative_path": media.get("relative_path"),
        "path": media.get("path"),
        "message_id": line.get("message_id") or media.get("message_id"),
        "source_type": source.get("type"),
        "source_key": source.get("key"),
        "sender_user_id": sender.get("user_id"),
        "sender_display_name": sender.get("display_name"),
        "line_timestamp": normalized.get("line_timestamp"),
        "captured_at": normalized.get("captured_at"),
        "media_type": media.get("type"),
        "content_type": media.get("content_type"),
        "size": media.get("size"),
        "sha256": media.get("sha256"),
    }
    append_jsonl(chat_dir / "media_index.jsonl", index_record)
    append_csv_row(
        chat_dir / "media_index.csv",
        [
            "captured_at",
            "line_timestamp",
            "source_type",
            "source_key",
            "sender_user_id",
            "sender_display_name",
            "media_type",
            "message_id",
            "file_name",
            "relative_path",
            "content_type",
            "size",
            "sha256",
        ],
        index_record,
    )


def download_line_content(
    *,
    channel_access_token: str,
    message_id: str,
    output_dir: Path,
    normalized: Dict[str, object],
    message_type: str,
) -> Dict[str, object]:
    url = LINE_CONTENT_ENDPOINT.format(message_id=message_id)
    request = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {channel_access_token}"},
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        content_type = response.headers.get("Content-Type", "application/octet-stream")
        body = response.read()

    digest = hashlib.sha256(body).hexdigest()
    extension = content_extension(content_type)
    filename = build_media_filename(
        normalized=normalized,
        message_type=message_type,
        message_id=message_id,
        digest=digest,
        extension=extension,
    )
    chat_dir = get_chat_dir(output_dir, normalized)
    path = chat_dir / "media" / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(body)
    return {
        "downloaded": True,
        "path": str(path),
        "relative_path": str(path.relative_to(output_dir)),
        "stored_file_name": filename,
        "content_type": content_type,
        "size": len(body),
        "sha256": digest,
    }


def reply_text(channel_access_token: str, reply_token: str, text: str) -> None:
    payload = {
        "replyToken": reply_token,
        "messages": [{"type": "text", "text": text[:5000]}],
    }
    request = urllib.request.Request(
        LINE_REPLY_ENDPOINT,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {channel_access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=20):
        return


def acknowledgement_text(normalized: Dict[str, object]) -> str:
    message_type = str(normalized.get("line", {}).get("message_type", "event"))  # type: ignore[union-attr]
    if normalized.get("text"):
        preview = str(normalized["text"]).replace("\n", " ")[:80]
        return f"已收到文字：{preview}"
    if message_type in {"image", "video", "audio", "file"}:
        return f"已收到 {message_type}，後端會保存並交給 AI 流程。"
    return "已收到事件，後端已記錄。"


def render_admin_login(*, error: str = "") -> str:
    error_html = f'<div class="alert">{html_escape(error)}</div>' if error else ""
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FALO LINE Bot Admin Login</title>
  <style>
    :root {{
      color-scheme: light;
      --line-green: #06c755;
      --ink: #25313b;
      --muted: #687785;
      --border: #d8e0e7;
      --panel: #ffffff;
      --bg: #f5f7f9;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
    }}
    main {{
      width: min(420px, calc(100vw - 32px));
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 28px;
      box-shadow: 0 12px 30px rgba(32, 45, 58, .08);
    }}
    h1 {{ margin: 0 0 8px; font-size: 24px; }}
    p {{ margin: 0 0 24px; color: var(--muted); line-height: 1.5; }}
    label {{ display: block; margin: 16px 0 6px; font-weight: 700; }}
    input {{
      width: 100%;
      min-height: 44px;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 16px;
    }}
    button {{
      width: 100%;
      min-height: 44px;
      border: 0;
      border-radius: 6px;
      margin-top: 22px;
      background: var(--line-green);
      color: white;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
    }}
    .alert {{
      border: 1px solid #f2b8b5;
      background: #fff0ef;
      color: #9f241c;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 14px;
      font-weight: 700;
    }}
    code {{ background: #eef3f6; border-radius: 4px; padding: 2px 5px; }}
  </style>
</head>
<body>
  <main>
    <h1>LINE Bot 監督後台</h1>
    <p>本地 PoC 管理頁。預設帳號 <code>admin</code>，密碼依環境變數設定。</p>
    {error_html}
    <form method="post" action="/admin/login">
      <label for="username">帳號</label>
      <input id="username" name="username" autocomplete="username" autofocus>
      <label for="password">密碼</label>
      <input id="password" name="password" type="password" autocomplete="current-password">
      <button type="submit">登入</button>
    </form>
  </main>
</body>
</html>"""


def render_admin_dashboard(events: List[Dict[str, object]], settings: Dict[str, object]) -> str:
    rows = []
    for event in events:
        source = event.get("source") if isinstance(event.get("source"), dict) else {}
        sender = event.get("sender") if isinstance(event.get("sender"), dict) else {}
        line = event.get("line") if isinstance(event.get("line"), dict) else {}
        media = event.get("media") if isinstance(event.get("media"), dict) else {}
        bot_info = event.get("bot") if isinstance(event.get("bot"), dict) else {}
        source_type = source.get("type", "")
        source_key_value = source.get("key", "")
        sender_name = sender.get("display_name") or "(未取得)"
        sender_id = sender.get("user_id") or source.get("user_id") or ""
        bot_name = bot_info.get("name") or bot_info.get("alias") or "(未標記)"
        bot_hint = bot_info.get("basic_id") or bot_info.get("destination") or ""
        message_type = line.get("message_type", "")
        text = event.get("text") or media.get("file_name") or media.get("path") or ""
        rows.append(
            "<tr>"
            f"<td>{html_escape(event.get('captured_at'))}</td>"
            f"<td>{html_escape(format_line_timestamp(event.get('line_timestamp')))}</td>"
            f"<td>{html_escape(bot_name)}<br><small>{html_escape(bot_hint)}</small></td>"
            f"<td><span class=\"badge\">{html_escape(source_type)}</span><br><small>{html_escape(source_key_value)}</small></td>"
            f"<td>{html_escape(sender_name)}<br><small>{html_escape(sender_id)}</small></td>"
            f"<td>{html_escape(event.get('event_type'))}<br><small>{html_escape(message_type)}</small></td>"
            f"<td class=\"message-text\">{html_escape(text)}</td>"
            f"<td>{html_escape(event.get('processing_status'))}</td>"
            "</tr>"
        )
    rows_html = "\n".join(rows) if rows else '<tr><td colspan="8" class="empty">尚未收到事件。</td></tr>'
    output_dir = html_escape(settings.get("output_dir", ""))
    admin_user = html_escape(settings.get("admin_user", "admin"))
    event_count = len(events)
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="15">
  <title>FALO LINE Bot Admin</title>
  <style>
    :root {{
      --line-green: #06c755;
      --ink: #25313b;
      --muted: #687785;
      --border: #d8e0e7;
      --bg: #f5f7f9;
      --panel: #ffffff;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
    }}
    header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 24px;
      background: var(--panel);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
    }}
    h1 {{ margin: 0; font-size: 22px; }}
    .subtle {{ color: var(--muted); font-size: 13px; }}
    form {{ margin: 0; }}
    button, .link-button {{
      border: 1px solid var(--border);
      border-radius: 6px;
      background: white;
      color: var(--ink);
      min-height: 36px;
      padding: 0 14px;
      font-weight: 800;
      cursor: pointer;
    }}
    main {{ padding: 24px; }}
    .summary {{
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }}
    .metric {{
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }}
    .metric strong {{ display: block; font-size: 22px; margin-bottom: 4px; }}
    .table-wrap {{
      overflow-x: auto;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
    }}
    table {{ width: 100%; border-collapse: collapse; min-width: 1040px; }}
    th, td {{
      border-bottom: 1px solid var(--border);
      padding: 12px;
      text-align: left;
      vertical-align: top;
      font-size: 14px;
    }}
    th {{ background: #eef3f6; font-size: 13px; color: #465663; }}
    small {{ color: var(--muted); overflow-wrap: anywhere; }}
    .badge {{
      display: inline-block;
      background: #e7f8ee;
      color: #087d38;
      border-radius: 999px;
      padding: 2px 8px;
      font-weight: 800;
      font-size: 12px;
    }}
    .message-text {{ max-width: 340px; white-space: pre-wrap; overflow-wrap: anywhere; }}
    .empty {{ text-align: center; color: var(--muted); padding: 28px; }}
    @media (max-width: 760px) {{
      header {{ align-items: flex-start; flex-direction: column; }}
      main {{ padding: 14px; }}
      .summary {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>LINE Bot 監督後台</h1>
      <div class="subtle">登入者：{admin_user}・每 15 秒自動更新・資料來源：{output_dir}</div>
    </div>
    <div class="actions" style="display: flex; gap: 8px; align-items: center;">
      <a class="link-button" href="/dev-console" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">開發控制台</a>
      <a class="link-button primary" href="/ai-coworker" style="background: var(--line-green); color: white; border-color: var(--line-green); text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">AI 對話分析</a>
      <form method="post" action="/admin/logout" style="margin: 0;"><button type="submit">登出</button></form>
    </div>
  </header>
  <main>
    <section class="summary">
      <div class="metric"><strong>{event_count}</strong><span class="subtle">目前顯示事件</span></div>
      <div class="metric"><strong>本地</strong><span class="subtle">資料來源 JSONL</span></div>
      <div class="metric"><strong>只讀</strong><span class="subtle">此頁不主動回覆 LINE</span></div>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>收到時間</th>
            <th>LINE 時間</th>
            <th>Bot</th>
            <th>來源</th>
            <th>發訊者</th>
            <th>事件</th>
            <th>內容</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>{rows_html}</tbody>
      </table>
    </div>
  </main>
</body>
</html>"""


def render_gas_monitor(settings: Dict[str, object]) -> str:
    gas_url = html_escape(settings.get("gas_proxy_url", ""))
    sheet_url = html_escape(settings.get("gas_proxy_sheet_url", ""))
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FALO GAS Proxy Monitor</title>
  <style>
    :root {{
      --line-green: #06c755;
      --ink: #25313b;
      --muted: #687785;
      --border: #d8e0e7;
      --bg: #f5f7f9;
      --panel: #ffffff;
      --warn: #b54708;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
    }}
    header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 24px;
      background: var(--panel);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 2;
    }}
    h1 {{ margin: 0 0 4px; font-size: 22px; }}
    main {{ padding: 24px; }}
    .subtle {{ color: var(--muted); font-size: 13px; overflow-wrap: anywhere; }}
    .actions {{ display: flex; gap: 8px; flex-wrap: wrap; }}
    button, a.button {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0 14px;
      background: white;
      color: var(--ink);
      text-decoration: none;
      font-weight: 800;
      cursor: pointer;
    }}
    button.primary {{ background: var(--line-green); color: white; border-color: var(--line-green); }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 18px;
    }}
    .card {{
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }}
    .card strong {{ display: block; font-size: 22px; margin-bottom: 4px; }}
    .status-ok {{ color: #087d38; }}
    .status-bad {{ color: #b42318; }}
    .table-wrap {{
      overflow-x: auto;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
    }}
    table {{ width: 100%; border-collapse: collapse; min-width: 1160px; }}
    th, td {{
      border-bottom: 1px solid var(--border);
      padding: 12px;
      text-align: left;
      vertical-align: top;
      font-size: 14px;
    }}
    th {{ background: #eef3f6; font-size: 13px; color: #465663; }}
    small {{ color: var(--muted); overflow-wrap: anywhere; }}
    code {{ background: #eef3f6; border-radius: 4px; padding: 2px 5px; }}
    .message-text {{ max-width: 360px; white-space: pre-wrap; overflow-wrap: anywhere; }}
    .empty {{ text-align: center; color: var(--muted); padding: 28px; }}
    .notice {{
      margin-bottom: 18px;
      border: 1px solid #fedf89;
      background: #fffbeb;
      color: var(--warn);
      border-radius: 8px;
      padding: 12px 14px;
      line-height: 1.5;
    }}
    @media (max-width: 900px) {{
      header {{ align-items: flex-start; flex-direction: column; }}
      main {{ padding: 14px; }}
      .grid {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>FALO GAS Proxy Monitor</h1>
      <div class="subtle">本機 Commander 透過 proxy 讀取 GAS 收件箱，不直接讓前端碰 GAS 設定。</div>
    </div>
    <div class="actions">
      <button class="primary" id="refreshButton" type="button">手動更新</button>
      <a class="button" href="/admin">本地後台</a>
      <a class="button" href="{gas_url}" target="_blank" rel="noreferrer">GAS 頁面</a>
      <a class="button" href="{sheet_url}" target="_blank" rel="noreferrer">Google Sheet</a>
    </div>
  </header>
  <main>
    <section class="notice">
      架構定位：LINE webhook 寫入 GAS，GAS 存入 Sheet，本機頁面只透過 <code>/gas-proxy/events</code> 讀資料。
      這能讓「地端直接收」與「GAS 雲端收」保持相容，後面可接同一個 AI Commander。
    </section>
    <section class="grid">
      <div class="card"><strong id="healthStatus">檢查中</strong><span class="subtle">GAS 狀態</span></div>
      <div class="card"><strong id="eventCount">0</strong><span class="subtle">顯示事件</span></div>
      <div class="card"><strong id="storedRows">0</strong><span class="subtle">GAS 已存列數</span></div>
      <div class="card"><strong id="latency">-</strong><span class="subtle">proxy latency</span></div>
    </section>
    <section class="card" style="margin-bottom:18px">
      <div class="subtle">GAS URL</div>
      <div><code>{gas_url}</code></div>
      <div class="subtle" id="lastUpdated" style="margin-top:8px">尚未更新</div>
    </section>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>收到時間</th>
            <th>LINE 時間</th>
            <th>Bot</th>
            <th>來源</th>
            <th>使用者</th>
            <th>訊息</th>
            <th>內容</th>
            <th>媒體</th>
          </tr>
        </thead>
        <tbody id="eventsBody"><tr><td colspan="8" class="empty">讀取中...</td></tr></tbody>
      </table>
    </div>
  </main>
  <script>
    const healthStatus = document.getElementById("healthStatus");
    const eventCount = document.getElementById("eventCount");
    const storedRows = document.getElementById("storedRows");
    const latency = document.getElementById("latency");
    const lastUpdated = document.getElementById("lastUpdated");
    const eventsBody = document.getElementById("eventsBody");
    const refreshButton = document.getElementById("refreshButton");

    function text(value) {{
      return value === undefined || value === null ? "" : String(value);
    }}

    function escapeHtml(value) {{
      return text(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }}

    const TAIPEI_TIME_OPTIONS = {{
      timeZone: "Asia/Taipei",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }};

    function formatTaipeiTime(value) {{
      if (value === undefined || value === null || value === "") return "";
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return text(value);
      return date.toLocaleString("zh-TW", TAIPEI_TIME_OPTIONS);
    }}

    function formatLineTime(value) {{
      const numeric = Number(value);
      if (!numeric) return "";
      return formatTaipeiTime(numeric);
    }}

    function setError(message) {{
      healthStatus.textContent = "異常";
      healthStatus.className = "status-bad";
      eventsBody.innerHTML = `<tr><td colspan="8" class="empty">${{escapeHtml(message)}}</td></tr>`;
    }}

    function renderEvents(events) {{
      if (!events.length) {{
        eventsBody.innerHTML = '<tr><td colspan="8" class="empty">GAS 目前尚未存到事件。</td></tr>';
        return;
      }}
      eventsBody.innerHTML = events.map((event) => {{
        const mediaText = event.media_saved ? "已存" : (event.media_error || "");
        const bot = `${{escapeHtml(event.bot_name)}}<br><small>${{escapeHtml(event.bot_basic_id || event.bot_alias)}}</small>`;
        const source = `${{escapeHtml(event.source_type)}}<br><small>${{escapeHtml(event.source_key)}}</small>`;
        const user = `${{escapeHtml(event.user_id || "(未提供)")}}<br><small>${{escapeHtml(event.destination)}}</small>`;
        const msg = `${{escapeHtml(event.event_type)}}<br><small>${{escapeHtml(event.message_type)}}</small>`;
        return `<tr>
          <td>${{escapeHtml(formatTaipeiTime(event.captured_at))}}</td>
          <td>${{escapeHtml(formatLineTime(event.line_timestamp))}}</td>
          <td>${{bot}}</td>
          <td>${{source}}</td>
          <td>${{user}}</td>
          <td>${{msg}}</td>
          <td class="message-text">${{escapeHtml(event.text || event.message_id)}}</td>
          <td>${{escapeHtml(mediaText)}}<br><small>${{escapeHtml(event.media_file_url || "")}}</small></td>
        </tr>`;
      }}).join("");
    }}

    async function refresh() {{
      refreshButton.disabled = true;
      try {{
        const [healthResponse, eventsResponse] = await Promise.all([
          fetch("/gas-proxy/health", {{cache: "no-store"}}),
          fetch("/gas-proxy/events?limit=200", {{cache: "no-store"}})
        ]);
        const health = await healthResponse.json();
        const eventsPayload = await eventsResponse.json();
        if (!health.ok) throw new Error(health.error || "GAS health failed");
        if (!eventsPayload.ok) throw new Error(eventsPayload.error || "GAS events failed");

        healthStatus.textContent = "正常";
        healthStatus.className = "status-ok";
        eventCount.textContent = text(eventsPayload.count || 0);
        storedRows.textContent = text(health.stored_rows || 0);
        latency.textContent = text((eventsPayload._proxy && eventsPayload._proxy.latency_ms) || "-") + " ms";
        lastUpdated.textContent = "最後更新：" + formatTaipeiTime(new Date());
        renderEvents(Array.isArray(eventsPayload.events) ? eventsPayload.events : []);
      }} catch (error) {{
        setError(error.message || String(error));
      }} finally {{
        refreshButton.disabled = false;
      }}
    }}

    refreshButton.addEventListener("click", refresh);
    refresh();
    setInterval(refresh, 15000);
  </script>
</body>
</html>"""


def render_dev_console(events: List[Dict[str, object]], settings: Dict[str, object]) -> str:
    gas_url = html_escape(settings.get("gas_proxy_url", ""))
    sheet_url = html_escape(settings.get("gas_proxy_sheet_url", ""))
    output_dir = html_escape(settings.get("output_dir", ""))
    ngrok_interval = html_escape(settings.get("ngrok_monitor_interval_seconds", DEFAULT_NGROK_MONITOR_INTERVAL_SECONDS))
    local_rows = []
    for event in events[:120]:
        source = event.get("source") if isinstance(event.get("source"), dict) else {}
        sender = event.get("sender") if isinstance(event.get("sender"), dict) else {}
        line = event.get("line") if isinstance(event.get("line"), dict) else {}
        bot_info = event.get("bot") if isinstance(event.get("bot"), dict) else {}
        local_rows.append(
            "<tr>"
            f"<td>{html_escape(event.get('captured_at'))}</td>"
            f"<td>{html_escape(format_line_timestamp(event.get('line_timestamp')))}</td>"
            f"<td>{html_escape(bot_info.get('name') or bot_info.get('alias') or '')}<br>"
            f"<small>{html_escape(bot_info.get('basic_id') or bot_info.get('destination') or '')}</small></td>"
            f"<td>{html_escape(source.get('type'))}<br><small>{html_escape(source.get('key'))}</small></td>"
            f"<td>{html_escape(sender.get('display_name') or sender.get('user_id') or '')}</td>"
            f"<td>{html_escape(event.get('event_type'))}<br><small>{html_escape(line.get('message_type'))}</small></td>"
            f"<td class=\"message-text\">{html_escape(event.get('text') or line.get('message_id') or '')}</td>"
            f"<td>{html_escape(event.get('processing_status'))}</td>"
            "</tr>"
        )
    if not local_rows:
        local_rows.append('<tr><td colspan="8" class="empty">本機 webhook 目前尚未收到事件。</td></tr>')

    local_rows_html = "\n".join(local_rows)
    watermark = "(Private) FALO IM Watch v1.01 | Falo x Force Cheng | 2026/6/20 | internal only"
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="description" content="(Private) FALO IM Watch v1.01 development console for local LINE webhook, GAS proxy, ngrok status, and Google Sheet inspection.">
  <meta name="keywords" content="FALO IM Watch, LINE Bot, GAS proxy, ngrok, AI Commander, webhook">
  <meta name="author" content="Falo x Force Cheng">
  <meta name="version" content="v1.01">
  <meta name="falo-watermark" content="{html_escape(watermark)}">
  <title>(Private) FALO IM Watch Dev Console v1.01</title>
  <style>
    :root {{
      --green: #06c755;
      --ink: #25313b;
      --muted: #687785;
      --border: #d8e0e7;
      --bg: #f5f7f9;
      --panel: #ffffff;
      --soft: #eef6f0;
      --warn: #b54708;
      --bad: #b42318;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
    }}
    .watermark {{
      position: fixed;
      width: 1px;
      height: 1px;
      overflow: hidden;
      opacity: 0.01;
      pointer-events: none;
      user-select: none;
    }}
    header {{
      position: sticky;
      top: 0;
      z-index: 5;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 18px 24px;
      background: var(--panel);
      border-bottom: 1px solid var(--border);
    }}
    h1 {{ margin: 0 0 4px; font-size: 24px; }}
    h2 {{ margin: 0 0 12px; font-size: 18px; }}
    main {{ padding: 20px 24px 48px; }}
    .subtle {{ color: var(--muted); font-size: 13px; overflow-wrap: anywhere; }}
    .actions {{ display: flex; flex-wrap: wrap; gap: 8px; }}
    button, a.button {{
      min-height: 38px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: white;
      color: var(--ink);
      padding: 0 14px;
      font-weight: 800;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }}
    button.primary {{ background: var(--green); color: white; border-color: var(--green); }}
    button.danger {{ color: var(--bad); }}
    input {{
      width: 100%;
      min-height: 40px;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 8px 10px;
      color: var(--ink);
      font-size: 14px;
    }}
    label {{ display: block; font-weight: 800; margin-bottom: 6px; }}
    .grid {{
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }}
    .card {{
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }}
    .card strong {{ display: block; font-size: 22px; margin-bottom: 4px; }}
    .config-grid {{
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 1.35fr);
      gap: 12px;
      margin-bottom: 16px;
    }}
    .field-row {{ display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px; }}
    .tabs {{ display: flex; gap: 8px; flex-wrap: wrap; margin: 18px 0 12px; }}
    .tab-button.active {{ background: var(--green); border-color: var(--green); color: white; }}
    .panel {{ display: none; }}
    .panel.active {{ display: block; }}
    .table-wrap {{
      overflow-x: auto;
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
    }}
    table {{ width: 100%; min-width: 1100px; border-collapse: collapse; }}
    th, td {{
      border-bottom: 1px solid var(--border);
      padding: 11px;
      text-align: left;
      vertical-align: top;
      font-size: 14px;
    }}
    th {{ background: #eef3f6; color: #465663; font-size: 13px; }}
    small {{ color: var(--muted); overflow-wrap: anywhere; }}
    code {{ background: #eef3f6; border-radius: 4px; padding: 2px 5px; }}
    .message-text {{ max-width: 360px; white-space: pre-wrap; overflow-wrap: anywhere; }}
    .empty {{ text-align: center; color: var(--muted); padding: 28px; }}
    .notice {{
      border: 1px solid #b7e4c7;
      background: var(--soft);
      border-radius: 8px;
      padding: 12px 14px;
      line-height: 1.55;
      margin-bottom: 16px;
    }}
    .status-ok {{ color: #087d38; }}
    .status-bad {{ color: var(--bad); }}
    .status-warn {{ color: var(--warn); }}
    @media (max-width: 980px) {{
      header {{ flex-direction: column; }}
      main {{ padding: 14px; }}
      .grid, .config-grid {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>
  <div class="watermark">{html_escape(watermark)}</div>
  <header>
    <div>
      <h1>FALO IM Watch 開發控制台 v1.01</h1>
      <div class="subtle">Falo x Force Cheng 2026/6/20 · (Private) 自用內部版 · output: <code>{output_dir}</code></div>
    </div>
    <div class="actions">
      <button class="primary" id="refreshAllButton" type="button">手動更新全部</button>
      <a class="button" href="/admin">本機後台</a>
      <a class="button" href="/gas-monitor">GAS Monitor</a>
      <a class="button primary" href="/ai-coworker" style="background: var(--green); color: white; border-color: var(--green);">AI 對話分析</a>
      <a class="button" href="/admin/logout">登出</a>
    </div>
  </header>
  <main>
    <section class="notice">
      此頁把兩種開發模式放在同一個地端服務裡：
      <strong>本機 webhook</strong> 用來看 ngrok 直接打進本機的事件；
      <strong>GAS proxy</strong> 用來填入 GAS exec URL，讀取 Google Sheet 內的雲端收件箱。
      兩者資料格式保持相容，後續都可以接到 AI Commander。
    </section>

    <section class="grid">
      <div class="card"><strong>{len(events)}</strong><span class="subtle">本機事件</span></div>
      <div class="card"><strong id="gasEventCount">-</strong><span class="subtle">GAS 顯示事件</span></div>
      <div class="card"><strong id="ngrokStatus">檢查中</strong><span class="subtle">ngrok 狀態</span></div>
      <div class="card"><strong id="autoRefreshStatus">15s</strong><span class="subtle">前端定時更新</span></div>
    </section>

    <section class="config-grid">
      <div class="card">
        <h2>GAS Proxy 設定</h2>
        <div class="field-row">
          <label for="gasExecUrl">GAS exec URL</label>
          <input id="gasExecUrl" value="{gas_url}" placeholder="https://script.google.com/macros/s/.../exec">
        </div>
        <div class="field-row">
          <label for="sheetUrl">Google Sheet URL</label>
          <input id="sheetUrl" value="{sheet_url}" placeholder="https://docs.google.com/spreadsheets/d/.../edit">
        </div>
        <div class="actions">
          <button class="primary" id="saveConfigButton" type="button">套用 / 儲存</button>
          <button id="openGasButton" type="button">打開 GAS Web App</button>
          <button id="openSheetButton" type="button">打開 Google Sheet</button>
        </div>
        <div class="subtle" id="configHint" style="margin-top:10px">設定會先存於此瀏覽器，適合開發測試快速切換。</div>
      </div>
      <div class="card">
        <h2>ngrok 狀態</h2>
        <div class="subtle">後端預設每 <code>{ngrok_interval}</code> 秒記錄一次；此頁也可手動更新。</div>
        <p><strong id="ngrokPublicUrl">-</strong><span class="subtle"> public URL</span></p>
        <p class="subtle" id="ngrokDetail">尚未取得狀態</p>
        <div class="actions">
          <button id="refreshNgrokButton" type="button">手動刷新 ngrok</button>
        </div>
      </div>
    </section>

    <div class="tabs">
      <button class="tab-button active" type="button" data-target="localPanel">本機 webhook</button>
      <button class="tab-button" type="button" data-target="gasPanel">HTML / GAS proxy</button>
    </div>

    <section id="localPanel" class="panel active">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>收到時間</th><th>LINE 時間</th><th>Bot</th><th>來源</th><th>使用者</th><th>訊息</th><th>內容</th><th>狀態</th></tr>
          </thead>
          <tbody>{local_rows_html}</tbody>
        </table>
      </div>
    </section>

    <section id="gasPanel" class="panel">
      <div class="card" style="margin-bottom:12px">
        <div class="subtle" id="gasHealth">GAS 尚未讀取</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>收到時間</th><th>LINE 時間</th><th>Bot</th><th>來源</th><th>使用者</th><th>訊息</th><th>內容</th><th>媒體</th></tr>
          </thead>
          <tbody id="gasEventsBody"><tr><td colspan="8" class="empty">讀取中...</td></tr></tbody>
        </table>
      </div>
    </section>
  </main>

  <script>
    const defaultGasUrl = {json.dumps(str(settings.get("gas_proxy_url", "")))};
    const defaultSheetUrl = {json.dumps(str(settings.get("gas_proxy_sheet_url", "")))};
    const gasExecUrl = document.getElementById("gasExecUrl");
    const sheetUrl = document.getElementById("sheetUrl");
    const gasEventCount = document.getElementById("gasEventCount");
    const gasEventsBody = document.getElementById("gasEventsBody");
    const gasHealth = document.getElementById("gasHealth");
    const ngrokStatus = document.getElementById("ngrokStatus");
    const ngrokPublicUrl = document.getElementById("ngrokPublicUrl");
    const ngrokDetail = document.getElementById("ngrokDetail");
    const configHint = document.getElementById("configHint");

    function text(value) {{
      return value === undefined || value === null ? "" : String(value);
    }}

    function escapeHtml(value) {{
      return text(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }}

    const TAIPEI_TIME_OPTIONS = {{
      timeZone: "Asia/Taipei",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }};

    function formatTaipeiTime(value) {{
      if (value === undefined || value === null || value === "") return "";
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return text(value);
      return date.toLocaleString("zh-TW", TAIPEI_TIME_OPTIONS);
    }}

    function loadConfig() {{
      gasExecUrl.value = localStorage.getItem("faloGasExecUrl") || defaultGasUrl;
      sheetUrl.value = localStorage.getItem("faloGasSheetUrl") || defaultSheetUrl;
    }}

    function saveConfig() {{
      localStorage.setItem("faloGasExecUrl", gasExecUrl.value.trim());
      localStorage.setItem("faloGasSheetUrl", sheetUrl.value.trim());
      configHint.textContent = "已套用：" + formatTaipeiTime(new Date());
      refreshGas();
    }}

    function gasProxyQuery(limit) {{
      const params = new URLSearchParams();
      params.set("url", gasExecUrl.value.trim());
      if (limit) params.set("limit", String(limit));
      return params.toString();
    }}

    function formatLineTime(value) {{
      const numeric = Number(value);
      if (!numeric) return "";
      return formatTaipeiTime(numeric);
    }}

    function renderGasEvents(events) {{
      if (!events.length) {{
        gasEventsBody.innerHTML = '<tr><td colspan="8" class="empty">GAS 目前尚未存到事件。</td></tr>';
        return;
      }}
      gasEventsBody.innerHTML = events.map((event) => {{
        const bot = escapeHtml(event.bot_name) + "<br><small>" + escapeHtml(event.bot_basic_id || event.bot_alias) + "</small>";
        const source = escapeHtml(event.source_type) + "<br><small>" + escapeHtml(event.source_key) + "</small>";
        const user = escapeHtml(event.user_id || "(未提供)") + "<br><small>" + escapeHtml(event.destination) + "</small>";
        const msg = escapeHtml(event.event_type) + "<br><small>" + escapeHtml(event.message_type) + "</small>";
        const mediaText = event.media_saved ? "已存" : (event.media_error || "");
        return "<tr>"
          + "<td>" + escapeHtml(formatTaipeiTime(event.captured_at)) + "</td>"
          + "<td>" + escapeHtml(formatLineTime(event.line_timestamp)) + "</td>"
          + "<td>" + bot + "</td>"
          + "<td>" + source + "</td>"
          + "<td>" + user + "</td>"
          + "<td>" + msg + "</td>"
          + "<td class=\\"message-text\\">" + escapeHtml(event.text || event.message_id) + "</td>"
          + "<td>" + escapeHtml(mediaText) + "<br><small>" + escapeHtml(event.media_file_url || "") + "</small></td>"
          + "</tr>";
      }}).join("");
    }}

    async function refreshGas() {{
      try {{
        const [healthResponse, eventsResponse] = await Promise.all([
          fetch("/gas-proxy/health?" + gasProxyQuery(), {{cache: "no-store"}}),
          fetch("/gas-proxy/events?" + gasProxyQuery(200), {{cache: "no-store"}})
        ]);
        const health = await healthResponse.json();
        const eventsPayload = await eventsResponse.json();
        if (!health.ok) throw new Error(health.error || "GAS health failed");
        if (!eventsPayload.ok) throw new Error(eventsPayload.error || "GAS events failed");
        const events = Array.isArray(eventsPayload.events) ? eventsPayload.events : [];
        gasEventCount.textContent = text(eventsPayload.count || events.length || 0);
        gasHealth.innerHTML = "GAS 正常 · stored_rows="
          + escapeHtml(health.stored_rows || 0)
          + " · latency="
          + escapeHtml((eventsPayload._proxy && eventsPayload._proxy.latency_ms) || "-")
          + "ms · "
          + escapeHtml(formatTaipeiTime(new Date()));
        gasHealth.className = "subtle status-ok";
        renderGasEvents(events);
      }} catch (error) {{
        gasEventCount.textContent = "異常";
        gasHealth.textContent = "GAS 讀取失敗：" + (error.message || String(error));
        gasHealth.className = "subtle status-bad";
        gasEventsBody.innerHTML = '<tr><td colspan="8" class="empty">' + escapeHtml(error.message || String(error)) + '</td></tr>';
      }}
    }}

    async function refreshNgrok(force) {{
      try {{
        const response = await fetch("/ngrok-status" + (force ? "?refresh=1" : ""), {{cache: "no-store"}});
        const payload = await response.json();
        const status = payload.ngrok || payload;
        const publicUrls = Array.isArray(status.public_urls) ? status.public_urls : [];
        ngrokStatus.textContent = status.ok ? "正常" : "未就緒";
        ngrokStatus.className = status.ok ? "status-ok" : "status-warn";
        ngrokPublicUrl.textContent = publicUrls[0] || "-";
        ngrokDetail.textContent = "checked_at=" + text(status.checked_at)
          + " · tunnels=" + text(status.tunnel_count || 0)
          + " · latency=" + text(status.latency_ms || "-") + "ms"
          + (status.from_cache ? " · cache" : "")
          + (status.error ? " · " + status.error : "");
      }} catch (error) {{
        ngrokStatus.textContent = "異常";
        ngrokStatus.className = "status-bad";
        ngrokDetail.textContent = error.message || String(error);
      }}
    }}

    document.querySelectorAll(".tab-button").forEach((button) => {{
      button.addEventListener("click", () => {{
        document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
        document.querySelectorAll(".panel").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(button.dataset.target).classList.add("active");
      }});
    }});

    document.getElementById("saveConfigButton").addEventListener("click", saveConfig);
    document.getElementById("openGasButton").addEventListener("click", () => window.open(gasExecUrl.value.trim(), "_blank", "noopener"));
    document.getElementById("openSheetButton").addEventListener("click", () => window.open(sheetUrl.value.trim(), "_blank", "noopener"));
    document.getElementById("refreshAllButton").addEventListener("click", () => {{
      refreshGas();
      refreshNgrok(true);
    }});
    document.getElementById("refreshNgrokButton").addEventListener("click", () => refreshNgrok(true));

    loadConfig();
    refreshGas();
    refreshNgrok(false);
    setInterval(refreshGas, 15000);
    setInterval(() => refreshNgrok(false), 15000);
  </script>
</body>
</html>"""


def handle_events(
    events: Iterable[Dict[str, object]],
    *,
    output_dir: Path,
    channel_access_token: str = "",
    bot_info: Optional[Dict[str, str]] = None,
    download_media: bool = True,
    auto_reply: bool = False,
) -> List[Dict[str, object]]:
    records: List[Dict[str, object]] = []
    events_path = output_dir / "events.jsonl"

    for event in events:
        normalized = normalize_event(event)
        if bot_info:
            normalized["bot"] = dict(bot_info)
        message_id = str(normalized.get("line", {}).get("message_id") or "")  # type: ignore[union-attr]
        message_type = str(normalized.get("line", {}).get("message_type") or "")  # type: ignore[union-attr]

        if download_media and channel_access_token and message_type in {"image", "video", "audio", "file"}:
            try:
                media_info = download_line_content(
                    channel_access_token=channel_access_token,
                    message_id=message_id,
                    output_dir=output_dir,
                    normalized=normalized,
                    message_type=message_type,
                )
                media = normalized.get("media")
                if isinstance(media, dict):
                    media.update(media_info)
                normalized["processing_status"] = "media_downloaded"
            except Exception as exc:
                media = normalized.get("media")
                if isinstance(media, dict):
                    media["downloaded"] = False
                    media["download_error"] = str(exc)
                normalized["processing_status"] = "media_download_failed"

        source = event.get("source") if isinstance(event.get("source"), dict) else {}
        if channel_access_token and isinstance(source, dict) and source.get("userId"):
            try:
                profile = fetch_sender_profile(channel_access_token, source)
                apply_sender_profile(normalized, profile, source_label="line_profile_api")
            except Exception as exc:
                sender = normalized.get("sender")
                if isinstance(sender, dict):
                    sender["profile_source"] = "line_profile_api_error"
                    sender["profile_error"] = str(exc)

        write_portable_chat_record(output_dir, normalized)
        append_jsonl(events_path, normalized)
        records.append(normalized)

        reply_token = str(event.get("replyToken") or "")
        if auto_reply and channel_access_token and reply_token:
            try:
                reply_text(channel_access_token, reply_token, acknowledgement_text(normalized))
            except Exception as exc:
                error_record = {
                    "event_id": f"{normalized['event_id']}_reply_error",
                    "event_type": "line_reply_error",
                    "captured_at": now_local_iso(),
                    "error": str(exc),
                    "source_event_id": normalized["event_id"],
                }
                append_jsonl(events_path, error_record)

    return records


def scan_chat_sources(output_dir: Path) -> List[Dict[str, object]]:
    chats_dir = output_dir / "chats"
    if not chats_dir.exists():
        return []
    
    sources = []
    for bot_path in chats_dir.iterdir():
        if not bot_path.is_dir():
            continue
        bot_alias = bot_path.name
        if bot_alias == "imported":
            for chat_path in bot_path.iterdir():
                if not chat_path.is_dir():
                    continue
                manifest_file = chat_path / "manifest.json"
                if manifest_file.exists():
                    try:
                        manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
                        sources.append({
                            "id": f"imported/{chat_path.name}",
                            "bot_alias": "imported",
                            "chat_name": manifest.get("chat_name") or chat_path.name,
                            "source_type": "line_export",
                            "source_key": manifest.get("source_key", chat_path.name),
                            "manifest": manifest
                        })
                    except Exception:
                        pass
        else:
            for chat_path in bot_path.iterdir():
                if not chat_path.is_dir():
                    continue
                manifest_file = chat_path / "manifest.json"
                if manifest_file.exists():
                    try:
                        manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
                        sources.append({
                            "id": f"{bot_alias}/{chat_path.name}",
                            "bot_alias": bot_alias,
                            "chat_name": manifest.get("chat_name") or chat_path.name,
                            "source_type": manifest.get("source_type", "unknown"),
                            "source_key": manifest.get("source_key", chat_path.name),
                            "manifest": manifest
                        })
                    except Exception:
                        pass
    return sources


def scan_km_files(workspace_dir: Path) -> List[Dict[str, str]]:
    notes_dir = workspace_dir / "docs" / "notes"
    if not notes_dir.exists():
        return []
    
    files = []
    for f in notes_dir.iterdir():
        if f.is_file() and f.suffix in {".md", ".txt"}:
            files.append({
                "filename": f.name,
                "path": str(f)
            })
    return sorted(files, key=lambda x: x["filename"])


def call_gemini_api(api_key: str, system_instruction: str, prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
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
            if candidates:
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                if parts:
                    return str(parts[0].get("text", ""))
            return f"Error: Empty response from Gemini API. Full response: {res_body}"
    except urllib.error.HTTPError as exc:
        err_msg = exc.read().decode("utf-8", errors="replace")
        return f"Gemini API HTTP Error {exc.code}: {err_msg}"
    except Exception as exc:
        return f"Failed to call Gemini API: {type(exc).__name__}: {exc}"


def render_ai_coworker(
    sources: List[Dict[str, object]],
    km_files: List[Dict[str, str]],
    settings: Dict[str, object]
) -> str:
    sources_html = []
    by_bot = {}
    for src in sources:
        bot = str(src.get("bot_alias") or "default")
        by_bot.setdefault(bot, []).append(src)
        
    for bot, items in by_bot.items():
        bot_label = "手動匯入紀錄 (Imported)" if bot == "imported" else f"官方助手 ({bot})"
        sources_html.append(f'<div class="source-group"><h3>{html_escape(bot_label)}</h3>')
        for item in items:
            chat_id = html_escape(str(item["id"]))
            chat_name = html_escape(str(item["chat_name"]))
            source_type = html_escape(str(item["source_type"]))
            sources_html.append(
                '<label class="checkbox-card">'
                f'<input type="checkbox" name="source" value="{chat_id}" checked>'
                f'<div class="card-info"><strong>{chat_name}</strong>'
                f'<small>{source_type}</small></div>'
                '</label>'
            )
        sources_html.append('</div>')
    sources_list_html = "\n".join(sources_html)

    km_html = []
    for km in km_files:
        fn = html_escape(km["filename"])
        km_html.append(
            '<label class="checkbox-card">'
            f'<input type="checkbox" name="km_file" value="{fn}">'
            f'<div class="card-info"><strong>{fn}</strong></div>'
            '</label>'
        )
    km_list_html = "\n".join(km_html) if km_html else '<p class="empty-text">無可用之 KM 參考檔 (請存放於 docs/notes/)</p>'

    output_dir = html_escape(settings.get("output_dir", ""))
    admin_user = html_escape(settings.get("admin_user", "admin"))

    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FALO IM - AI 對話分析</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    :root {{
      --green: #06c755;
      --green-hover: #05b04b;
      --ink: #0f172a;
      --muted: #475569;
      --border: #cbd5e1;
      --bg: #f1f5f9;
      --panel: rgba(255, 255, 255, 0.9);
      --glass-blur: blur(10px);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.5;
    }}
    header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
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
      height: calc(100vh - 69px);
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
    .date-inputs input {{
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
  </style>
</head>
<body>
  <header>
    <div>
      <h1>FALO IM - AI 對話與 KM 協同分析</h1>
      <div class="subtle">登入者：{admin_user}・目錄：<code>{output_dir}</code></div>
    </div>
    <div class="actions">
      <a class="button" href="/admin">本機後台</a>
      <a class="button" href="/dev-console">開發控制台</a>
      <a class="button" href="/gas-monitor">GAS Monitor</a>
    </div>
  </header>
  <main>
    <div class="sidebar">
      <div class="sidebar-section">
        <h2>對話資料來源</h2>
        {sources_list_html}
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
        </div>
      </div>
      
      <div class="sidebar-section">
        <h2>個人 KM 參考</h2>
        {km_list_html}
      </div>
    </div>
    
    <div class="chat-container">
      <div class="chat-messages" id="chatMessages">
        <div class="empty" style="text-align: center; color: var(--muted); padding: 48px 0;" id="welcomeMsg">
          <h3>歡迎使用 AI 協同分析</h3>
          <p>請在左側勾選對話來源、設定時間範圍及 KM 文件，然後在下方輸入問題發起對話。</p>
        </div>
      </div>
      
      <div class="chat-input-area">
        <div class="chat-input-wrapper">
          <textarea id="promptInput" placeholder="請輸入對話分析問題... (例如：幫我彙整上週的所有待辦事項與負責人)"></textarea>
          <button class="primary" id="sendBtn" style="height: auto; align-self: stretch; width: 120px;">
            送出分析 <span class="loading-spinner" id="spinner"></span>
          </button>
        </div>
      </div>
    </div>
  </main>

  <script>
    const sendBtn = document.getElementById('sendBtn');
    const spinner = document.getElementById('spinner');
    const promptInput = document.getElementById('promptInput');
    const chatMessages = document.getElementById('chatMessages');
    const welcomeMsg = document.getElementById('welcomeMsg');

    sendBtn.addEventListener('click', async () => {{
      const prompt = promptInput.value.trim();
      if (!prompt) return;

      // Disable inputs
      sendBtn.disabled = true;
      promptInput.disabled = true;
      spinner.style.display = 'inline-block';

      // Collect checked sources
      const checkedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
        .map(el => el.value);

      // Collect checked KM files
      const checkedKMs = Array.from(document.querySelectorAll('input[name="km_file"]:checked'))
        .map(el => el.value);

      // Get dates
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;

      // Add user message to UI
      if (welcomeMsg) welcomeMsg.style.display = 'none';
      
      const userCard = document.createElement('div');
      userCard.className = 'response-card';
      userCard.style.background = '#eef6f0';
      userCard.innerHTML = `
        <div class="response-header">
          <span>問題發問</span>
          <span>${{new Date().toLocaleTimeString()}}</span>
        </div>
        <div class="response-body"><strong>${{escapeHtml(prompt)}}</strong></div>
      `;
      chatMessages.appendChild(userCard);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      promptInput.value = '';

      // Create placeholder card for AI reply
      const aiCard = document.createElement('div');
      aiCard.className = 'response-card';
      aiCard.innerHTML = `
        <div class="response-header">
          <span>AI 協作分析中...</span>
          <span>${{new Date().toLocaleTimeString()}}</span>
        </div>
        <div class="response-body" id="loadingText">正在調度地端資料庫，呼叫 AI 進行分析...</div>
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
            start_date: startDate,
            end_date: endDate,
            prompt: prompt
          }})
        }});
        
        const data = await response.json();
        const bodyDiv = aiCard.querySelector('.response-body');
        const headerSpan = aiCard.querySelector('.response-header span');
        
        if (data.ok) {{
          headerSpan.innerText = 'AI 協作分析結果';
          bodyDiv.id = '';
          bodyDiv.innerHTML = marked.parse(data.response);
        }} else {{
          headerSpan.innerText = '分析出錯';
          bodyDiv.innerHTML = `<span style="color: red;">發生錯誤: ${{data.error}}</span>`;
        }}
      }} catch (err) {{
        const bodyDiv = aiCard.querySelector('.response-body');
        bodyDiv.innerHTML = `<span style="color: red;">連線錯誤: ${{err.message}}</span>`;
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
</body>
</html>"""


class LineBotHandler(BaseHTTPRequestHandler):
    server_version = "FaloLineBotPoC/0.1"

    def log_message(self, format: str, *args: object) -> None:
        sys.stderr.write(f"[http] {self.address_string()} - {format % args}\n")

    @property
    def settings(self) -> Dict[str, object]:
        return self.server.settings  # type: ignore[attr-defined]

    def send_json(self, status: int, payload: Dict[str, object]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, status: int, body_text: str, *, extra_headers: Optional[Dict[str, str]] = None) -> None:
        body = body_text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location: str, *, extra_headers: Optional[Dict[str, str]] = None) -> None:
        self.send_response(303)
        self.send_header("Location", location)
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()

    def cookie_value(self, name: str) -> str:
        cookie_header = self.headers.get("Cookie", "")
        for part in cookie_header.split(";"):
            if "=" not in part:
                continue
            key, value = part.strip().split("=", 1)
            if key == name:
                return value
        return ""

    def authenticated_admin(self) -> Optional[str]:
        return verify_admin_session_cookie(
            self.cookie_value(ADMIN_SESSION_COOKIE_NAME),
            str(self.settings.get("admin_session_secret", "")),
            ttl_seconds=int(self.settings.get("admin_session_ttl_seconds", DEFAULT_ADMIN_SESSION_TTL_SECONDS)),
        )

    def require_admin(self) -> Optional[str]:
        username = self.authenticated_admin()
        if not username:
            self.redirect("/admin/login")
            return None
        return username

    def send_gas_proxy_json(self, api_name: str, query: str) -> None:
        if not self.authenticated_admin():
            self.send_json(401, {"ok": False, "error": "admin login required"})
            return

        try:
            upstream_url = build_gas_proxy_url(
                str(self.settings.get("gas_proxy_url", "")),
                api_name,
                incoming_query=query,
                viewer_token=str(self.settings.get("gas_proxy_viewer_token", "")),
            )
        except ValueError as exc:
            self.send_json(400, {"ok": False, "error": str(exc)})
            return
        status, payload = fetch_json_url(
            upstream_url,
            timeout_seconds=int(self.settings.get("gas_proxy_timeout_seconds", DEFAULT_GAS_PROXY_TIMEOUT_SECONDS)),
        )
        payload.setdefault("_proxy", {})
        proxy_info = payload.get("_proxy")
        if isinstance(proxy_info, dict):
            proxy_info["api"] = api_name
            proxy_info["upstream_url"] = upstream_url
        self.send_json(200 if 200 <= status < 500 else 502, payload)

    def do_GET(self) -> None:
        parsed_url = urllib.parse.urlsplit(self.path)
        path = parsed_url.path
        if path in {"/", "/health"}:
            self.send_json(
                200,
                {
                    "ok": True,
                    "service": "falo-standard-line-bot",
                    "time": now_local_iso(),
                    "output_dir": str(self.settings["output_dir"]),
                },
            )
            return
        if path == "/admin/login":
            if self.authenticated_admin():
                self.redirect("/dev-console")
                return
            self.send_html(200, render_admin_login())
            return
        if path == "/dev-console":
            username = self.require_admin()
            if not username:
                return
            events_path = Path(str(self.settings["output_dir"])) / "events.jsonl"
            events = load_recent_events(events_path, limit=200)
            console_settings = dict(self.settings)
            console_settings["admin_user"] = username
            self.send_html(200, render_dev_console(events, console_settings))
            return
        if path == "/ai-coworker":
            username = self.require_admin()
            if not username:
                return
            output_dir = Path(str(self.settings["output_dir"]))
            sources = scan_chat_sources(output_dir)
            km_files = scan_km_files(Path.cwd())
            dashboard_settings = dict(self.settings)
            dashboard_settings["admin_user"] = username
            self.send_html(200, render_ai_coworker(sources, km_files, dashboard_settings))
            return
        if path == "/admin":
            username = self.require_admin()
            if not username:
                return
            events_path = Path(str(self.settings["output_dir"])) / "events.jsonl"
            events = load_recent_events(events_path, limit=200)
            dashboard_settings = dict(self.settings)
            dashboard_settings["admin_user"] = username
            self.send_html(200, render_admin_dashboard(events, dashboard_settings))
            return
        if path == "/gas-monitor":
            username = self.require_admin()
            if not username:
                return
            self.send_html(200, render_gas_monitor(self.settings))
            return
        if path == "/gas-proxy/health":
            self.send_gas_proxy_json("health", parsed_url.query)
            return
        if path == "/gas-proxy/events":
            self.send_gas_proxy_json("events", parsed_url.query)
            return
        if path == "/gas-proxy/config":
            self.send_gas_proxy_json("config", parsed_url.query)
            return
        if path == "/ngrok-status":
            if not self.authenticated_admin():
                self.send_json(401, {"ok": False, "error": "admin login required"})
                return
            query = dict(urllib.parse.parse_qsl(parsed_url.query, keep_blank_values=True))
            status = latest_ngrok_status(
                Path(str(self.settings["output_dir"])),
                str(self.settings.get("ngrok_api_url", DEFAULT_NGROK_API_URL)),
                refresh=query.get("refresh", "").lower() in {"1", "true", "yes", "on"},
            )
            self.send_json(200, {"ok": True, "ngrok": status})
            return
        self.send_json(404, {"ok": False, "error": "not found"})

    def do_POST(self) -> None:
        path = urllib.parse.urlsplit(self.path).path
        if path == "/admin/login":
            length = int(self.headers.get("Content-Length", "0") or "0")
            form = parse_form_urlencoded(self.rfile.read(length))
            username = form.get("username", "")
            password = form.get("password", "")
            admin_user = str(self.settings.get("admin_user", DEFAULT_ADMIN_USER))
            admin_password = str(self.settings.get("admin_password", DEFAULT_ADMIN_PASSWORD))
            if username == admin_user and hmac.compare_digest(password, admin_password):
                cookie = create_admin_session_cookie(username, str(self.settings.get("admin_session_secret", "")))
                self.redirect(
                    "/dev-console",
                    extra_headers={
                        "Set-Cookie": (
                            f"{ADMIN_SESSION_COOKIE_NAME}={cookie}; Path=/; "
                            f"Max-Age={DEFAULT_ADMIN_SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax"
                        )
                    },
                )
                return
            self.send_html(401, render_admin_login(error="帳號或密碼不正確"))
            return

        if path == "/admin/logout":
            self.redirect(
                "/admin/login",
                extra_headers={
                    "Set-Cookie": f"{ADMIN_SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
                },
            )
            return

        if path == "/api/query_ai":
            if not self.authenticated_admin():
                self.send_json(401, {"ok": False, "error": "admin login required"})
                return
            length = int(self.headers.get("Content-Length", "0") or "0")
            try:
                post_data = json.loads(self.rfile.read(length).decode("utf-8"))
            except Exception as exc:
                self.send_json(400, {"ok": False, "error": f"invalid JSON: {exc}"})
                return
                
            sources = post_data.get("sources", [])
            start_date = post_data.get("start_date", "")
            end_date = post_data.get("end_date", "")
            prompt = post_data.get("prompt", "")
            km_files = post_data.get("km_files", [])
            
            output_dir = Path(str(self.settings["output_dir"]))
            events = []
            for src in sources:
                src_path = output_dir / "chats" / src / "events.jsonl"
                if src_path.exists():
                    try:
                        with src_path.open("r", encoding="utf-8") as f:
                            for line in f:
                                if not line.strip():
                                    continue
                                evt = json.loads(line)
                                events.append(evt)
                    except Exception:
                        pass
            
            filtered_events = []
            for evt in events:
                captured_at = evt.get("captured_at")
                if not captured_at:
                    filtered_events.append(evt)
                    continue
                date_str = captured_at[:10]
                if start_date and date_str < start_date:
                    continue
                if end_date and date_str > end_date:
                    continue
                filtered_events.append(evt)
                
            filtered_events.sort(key=lambda x: str(x.get("captured_at") or ""))
            context_events = filtered_events[-1000:]
            
            chat_context_lines = []
            for evt in context_events:
                captured_at = evt.get("captured_at", "")
                sender = evt.get("sender_name_hint") or evt.get("sender", {}).get("display_name") or "(未知)"
                text = evt.get("text") or ""
                time_part = captured_at[:16].replace("T", " ")
                chat_context_lines.append(f"[{time_part}] {sender}: {text}")
                
            chat_context = "\n".join(chat_context_lines)
            
            km_context_lines = []
            workspace_dir = Path.cwd()
            for km_file in km_files:
                safe_name = os.path.basename(km_file)
                km_path = workspace_dir / "docs" / "notes" / safe_name
                if km_path.exists() and km_path.is_file():
                    try:
                        content = km_path.read_text(encoding="utf-8")
                        km_context_lines.append(f"=== KM FILE: {safe_name} ===\n{content}\n")
                    except Exception as e:
                        km_context_lines.append(f"=== KM FILE: {safe_name} (Failed to read: {e}) ===\n")
            km_context = "\n".join(km_context_lines)
            
            system_instruction = (
                "You are FALO IM Coworker, an agentic AI coding assistant. You analyze chat logs and KM references.\\n"
                "Here is the context of selected LINE chat rooms (last 1000 messages matching filters):\\n"
                "------ CHAT HISTORY START ------\\n"
                f"{chat_context}\\n"
                "------ CHAT HISTORY END ------\\n\\n"
                "Here are the referenced Knowledge Management (KM) notes:\\n"
                "------ KM REFERENCE START ------\\n"
                f"{km_context}\\n"
                "------ KM REFERENCE END ------\\n\\n"
                "Guidelines:\\n"
                "- Rely strictly on the chat history and KM reference provided.\\n"
                "- Answer the user query comprehensively in Traditional Chinese.\\n"
                "- Format the output beautifully using Markdown tables, lists, and headers."
            )
            
            gemini_key = os.environ.get("GEMINI_API_KEY", "")
            if not gemini_key:
                gemini_key = self.settings.get("gemini_api_key", "")
                
            if not gemini_key:
                self.send_json(200, {"ok": False, "error": "地端尚未配置 GEMINI_API_KEY，請在環境變數或 .env 中設定。"})
                return
                
            ai_response = call_gemini_api(gemini_key, system_instruction, prompt)
            self.send_json(200, {"ok": True, "response": ai_response})
            return

        if path != "/webhook":
            self.send_json(404, {"ok": False, "error": "not found"})
            return

        length = int(self.headers.get("Content-Length", "0") or "0")
        body = self.rfile.read(length)
        signature = self.headers.get("X-Line-Signature", "")
        channels = self.settings.get("channels", [])
        if not isinstance(channels, list):
            channels = []
        skip_signature = bool(self.settings.get("skip_signature", False))
        verified_channel: Optional[Dict[str, str]] = None

        if channels and not skip_signature:
            configured_secret_count = sum(1 for channel in channels if channel.get("channel_secret"))
            if configured_secret_count:
                verified_channel = verify_any_channel_signature(channels, body, signature)
            if configured_secret_count and not verified_channel:
                self.send_json(403, {"ok": False, "error": "invalid LINE signature for all configured channels"})
                return

        try:
            payload = json.loads(body.decode("utf-8"))
        except json.JSONDecodeError as exc:
            self.send_json(400, {"ok": False, "error": f"invalid JSON: {exc}"})
            return

        events = payload.get("events", [])
        if not isinstance(events, list):
            self.send_json(400, {"ok": False, "error": "events must be a list"})
            return

        channel = select_channel_config(
            channels,
            destination=payload.get("destination"),
            verified_channel=verified_channel,
        )
        channel_access_token = channel.get("channel_access_token", "") if channel else ""
        bot_info = public_bot_info(channel, payload.get("destination"))

        records = handle_events(
            events,
            output_dir=Path(str(self.settings["output_dir"])),
            channel_access_token=channel_access_token,
            bot_info=bot_info,
            download_media=bool(self.settings.get("download_media", True)),
            auto_reply=bool(self.settings.get("auto_reply", False)),
        )
        self.send_json(200, {"ok": True, "received": len(records)})


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Standard LINE Messaging API webhook PoC.")
    parser.add_argument("--env-file", default=".env", help="Optional dotenv-style env file.")
    parser.add_argument("--host", default=os.environ.get("LINE_BOT_HOST", DEFAULT_HOST))
    parser.add_argument("--port", type=int, default=int(os.environ.get("LINE_BOT_PORT", DEFAULT_PORT)))
    parser.add_argument(
        "--output-dir",
        default=os.environ.get("LINE_BOT_OUTPUT_DIR", DEFAULT_OUTPUT_DIR),
        help="Directory for events.jsonl and downloaded media.",
    )
    parser.add_argument(
        "--skip-signature",
        action="store_true",
        default=env_bool("LINE_BOT_SKIP_SIGNATURE", "false"),
        help="Development only: skip X-Line-Signature validation.",
    )
    parser.add_argument(
        "--no-auto-reply",
        action="store_true",
        help="Disable acknowledgement replies.",
    )
    parser.add_argument(
        "--no-download-media",
        action="store_true",
        help="Disable downloading image/video/audio/file message content.",
    )
    parser.add_argument(
        "--no-ngrok-monitor",
        action="store_true",
        help="Disable periodic ngrok local API health checks.",
    )
    parser.add_argument(
        "--ngrok-api-url",
        default=os.environ.get("NGROK_API_URL", DEFAULT_NGROK_API_URL),
        help="Local ngrok inspector API URL.",
    )
    parser.add_argument(
        "--ngrok-monitor-interval",
        type=int,
        default=int(os.environ.get("NGROK_MONITOR_INTERVAL_SECONDS", str(DEFAULT_NGROK_MONITOR_INTERVAL_SECONDS))),
        help="Seconds between ngrok status checks. Default: 1800.",
    )
    parser.add_argument(
        "--gas-proxy-url",
        default=os.environ.get("GAS_PROXY_URL", DEFAULT_GAS_PROXY_URL),
        help="GAS Web App URL used by the local gas_proxy viewer.",
    )
    parser.add_argument(
        "--gas-proxy-sheet-url",
        default=os.environ.get("GAS_PROXY_SHEET_URL", DEFAULT_GAS_PROXY_SHEET_URL),
        help="Google Sheet URL shown in the local gas_proxy viewer.",
    )
    parser.add_argument(
        "--gas-proxy-viewer-token",
        default=os.environ.get("GAS_PROXY_VIEWER_TOKEN", ""),
        help="Optional viewer token appended to GAS ?api=events/config requests.",
    )
    parser.add_argument(
        "--gas-proxy-timeout",
        type=int,
        default=int(os.environ.get("GAS_PROXY_TIMEOUT_SECONDS", str(DEFAULT_GAS_PROXY_TIMEOUT_SECONDS))),
        help="Seconds to wait for GAS proxy requests.",
    )
    return parser


def run_server(args: argparse.Namespace) -> int:
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    channels = load_channel_configs_from_env()
    settings = {
        "output_dir": output_dir,
        "channels": channels,
        "skip_signature": bool(args.skip_signature),
        "auto_reply": (not args.no_auto_reply) and env_bool("LINE_BOT_AUTO_REPLY", DEFAULT_AUTO_REPLY),
        "download_media": (not args.no_download_media)
        and env_bool("LINE_BOT_DOWNLOAD_MEDIA", DEFAULT_DOWNLOAD_MEDIA),
        "ngrok_monitor": (not args.no_ngrok_monitor) and env_bool("NGROK_MONITOR_ENABLED", DEFAULT_NGROK_MONITOR),
        "ngrok_api_url": args.ngrok_api_url,
        "ngrok_monitor_interval_seconds": args.ngrok_monitor_interval,
        "admin_user": os.environ.get("LINE_ADMIN_USER", DEFAULT_ADMIN_USER),
        "admin_password": os.environ.get("LINE_ADMIN_PASSWORD", DEFAULT_ADMIN_PASSWORD),
        "admin_session_secret": os.environ.get("LINE_ADMIN_SESSION_SECRET")
        or next((channel.get("channel_secret", "") for channel in channels if channel.get("channel_secret")), "")
        or "local-dev-admin-session-secret",
        "admin_session_ttl_seconds": int(
            os.environ.get("LINE_ADMIN_SESSION_TTL_SECONDS", str(DEFAULT_ADMIN_SESSION_TTL_SECONDS))
        ),
        "gas_proxy_url": args.gas_proxy_url,
        "gas_proxy_sheet_url": args.gas_proxy_sheet_url,
        "gas_proxy_viewer_token": args.gas_proxy_viewer_token,
        "gas_proxy_timeout_seconds": args.gas_proxy_timeout,
    }

    httpd = ThreadingHTTPServer((args.host, args.port), LineBotHandler)
    httpd.settings = settings  # type: ignore[attr-defined]

    print(f"[info] LINE bot webhook listening on http://{args.host}:{args.port}/webhook")
    print(f"[info] health check: http://{args.host}:{args.port}/health")
    print(f"[info] dev console: http://{args.host}:{args.port}/dev-console")
    print(f"[info] gas monitor: http://{args.host}:{args.port}/gas-monitor")
    print(f"[info] output_dir={output_dir}")
    print(f"[info] signature_validation={'off' if settings['skip_signature'] else 'on when secret is set'}")
    print(f"[info] configured_channels={len(channels)}")
    print(f"[info] auto_reply={settings['auto_reply']}")
    print(f"[info] download_media={settings['download_media']}")
    print(f"[info] gas_proxy_url={settings['gas_proxy_url']}")
    print(f"[info] ngrok_monitor={settings['ngrok_monitor']}")
    if settings["ngrok_monitor"]:
        print(f"[info] ngrok_api_url={settings['ngrok_api_url']}")
        print(f"[info] ngrok_status_log={output_dir / 'ngrok_status.jsonl'}")
        start_ngrok_monitor(settings)
    try:
        httpd.serve_forever()
    finally:
        httpd.server_close()
    return 0


def main(argv: Optional[List[str]] = None) -> int:
    pre_parser = argparse.ArgumentParser(add_help=False)
    pre_parser.add_argument("--env-file", default=".env")
    pre_args, _unknown = pre_parser.parse_known_args(argv)
    load_env_file(Path(pre_args.env_file))

    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        return run_server(args)
    except KeyboardInterrupt:
        print("\n[done] stopped by user")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
