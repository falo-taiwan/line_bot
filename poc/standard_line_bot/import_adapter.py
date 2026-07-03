#!/usr/bin/env python3
"""
FALO IM LINE Chat Export Parser & Import Adapter

Parses Traditional Chinese LINE export text files (both space-separated and tab-separated formats)
and normalizes them into the standard portable-chat-v1 event format.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

TAIPEI_TIME_ZONE_NAME = "Asia/Taipei"
TAIPEI_TIME_ZONE = dt.timezone(dt.timedelta(hours=8), name=TAIPEI_TIME_ZONE_NAME)


def now_local_iso() -> str:
    return dt.datetime.now(TAIPEI_TIME_ZONE).isoformat(timespec="seconds")


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


def parse_line_file(file_path: Path) -> Tuple[str, List[Dict[str, object]]]:
    """
    Parses a LINE export text file.
    Returns:
        Tuple[chat_name, List[normalized_events]]
    """
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    # Read all lines
    raw_content = file_path.read_text(encoding="utf-8")
    lines = raw_content.splitlines()

    # Detect Chat Name from first line or filename
    chat_name = file_path.stem
    if lines and (lines[0].startswith("[LINE]") or "聊天記錄" in lines[0]):
        first_line = lines[0].strip()
        # Extract title between [LINE] and 聊天記錄
        match = re.search(r"\[LINE\]\s*(.*?)(?:的聊天記錄)?$", first_line)
        if match and match.group(1):
            chat_name = match.group(1).strip()

    current_date: Optional[dt.date] = None
    current_sender: Optional[str] = None
    messages: List[Dict[str, object]] = []

    # Matches date lines like "2026.06.25 星期四" or "2021/6/19（週六）" or "2021/10/05(週二)"
    date_pattern = re.compile(
        r"^\s*(\d{4})[./](\d{1,2})[./](\d{1,2})(?:\s*星期.|(?:（|\()週.(?:）|\)))?\s*$"
    )

    # Time format "HH:MM"
    time_pattern = re.compile(r"^\d{2}:\d{2}$")

    # Space-separated message lines like "15:20 鄭Force key是..."
    msg_start_space_pattern = re.compile(r"^(\d{2}):(\d{2})\s+(.*)$")

    # Categories for special message tags
    keywords = {
        "圖片", "影片", "已收回訊息", "[圖片]", "[影片]", "[檔案]", "[貼圖]", "[照片]", "[語音]",
        "[聯絡資訊]", "[位置資訊]", "相簿建立成功"
    }

    # Helper function to append to previous message
    def append_continuation(text_line: str) -> None:
        if messages:
            last_msg = messages[-1]
            last_msg["_textlines"].append(text_line)  # type: ignore

    for idx, line in enumerate(lines):
        line_str = line.strip("\r\n")

        # Skip header metadata lines
        if idx < 3 and (line_str.startswith("[LINE]") or line_str.startswith("儲存日期：")):
            continue

        if not line_str:
            append_continuation("")
            continue

        # Check if it's a date line
        date_match = date_pattern.match(line_str)
        if date_match:
            year, month, day = date_match.groups()
            current_date = dt.date(int(year), int(month), int(day))
            continue

        # Try parsing as a message line
        is_msg = False

        # Tab-separated check
        if "\t" in line_str:
            splitted = line_str.split("\t")
            if len(splitted) >= 3 and time_pattern.match(splitted[0]):
                is_msg = True
                time_str = splitted[0]
                hour, minute = time_str.split(":")
                sender = splitted[1].strip()
                msg_text = "\t".join(splitted[2:])

                if not current_date:
                    current_date = dt.date(2021, 6, 19)
                time_obj = dt.datetime.combine(current_date, dt.time(int(hour), int(minute)))
                current_sender = sender

                messages.append(
                    {
                        "time": time_obj,
                        "username": sender,
                        "_textlines": [msg_text],
                    }
                )

        # Space-separated check (if not already matched by tab)
        if not is_msg:
            msg_match = msg_start_space_pattern.match(line_str)
            if msg_match:
                hour_str, minute_str, rest = msg_match.groups()
                if not current_date:
                    current_date = dt.date(2021, 6, 19)
                time_obj = dt.datetime.combine(current_date, dt.time(int(hour_str), int(minute_str)))

                # Parse sender and text
                if rest.strip() in keywords:
                    sender = current_sender or "System"
                    msg_text = rest.strip()
                else:
                    matched_keyword = None
                    for kw in keywords:
                        if rest.endswith(" " + kw):
                            matched_keyword = kw
                            break
                    if matched_keyword:
                        sender = rest[:-len(matched_keyword)].strip()
                        msg_text = matched_keyword
                    else:
                        if " " in rest:
                            sender, msg_text = rest.split(" ", 1)
                        else:
                            sender = current_sender or "System"
                            msg_text = rest

                current_sender = sender
                messages.append(
                    {
                        "time": time_obj,
                        "username": sender,
                        "_textlines": [msg_text],
                    }
                )
                is_msg = True

        if not is_msg:
            # Continuation line
            append_continuation(line_str)

    # Post-process messages: join lines, assign message type, format normalized fields
    normalized_events: List[Dict[str, object]] = []
    file_sha256 = hashlib.sha256(raw_content.encode("utf-8")).hexdigest()[:16]

    for i, msg in enumerate(messages):
        time_val: dt.datetime = msg["time"]  # type: ignore
        taipei_time = time_val.replace(tzinfo=TAIPEI_TIME_ZONE)
        captured_at_str = taipei_time.isoformat()

        text = "\n".join(msg["_textlines"]).strip()  # type: ignore
        username = str(msg["username"])

        # Determine message type
        msg_type = "text"
        if text in {"[照片]", "[圖片]", "圖片", "[Photo]", "[写真]"}:
            msg_type = "image"
        elif text in {"[影片]", "影片", "[Video]", "[動画]"}:
            msg_type = "video"
        elif text in {"[貼圖]", "貼圖", "[Sticker]", "[スタンプ]"}:
            msg_type = "sticker"
        elif text in {"[檔案]", "檔案", "[File]", "[ファイル]"}:
            msg_type = "file"
        elif text in {"[語音]", "語音", "[Audio]", "[Voice]"}:
            msg_type = "audio"
        elif text == "已收回訊息" or text.endswith("unsent a message."):
            msg_type = "unsent"

        # Unique event ID based on file hash and index
        event_id = f"evt_import_{file_sha256}_{i+1:06d}"

        normalized_events.append(
            {
                "event_id": event_id,
                "captured_at": captured_at_str,
                "line_timestamp": captured_at_str,
                "source_type": "line_export",
                "bot_alias": "imported",
                "source_key": safe_slug(chat_name),
                "sender_name_hint": username,
                "message_type": msg_type,
                "text": text,
                "raw_json": json.dumps(
                    {
                        "original_time": time_val.strftime("%Y-%m-%d %H:%M:%S"),
                        "original_username": username,
                        "original_text": text,
                        "original_type": msg_type,
                    },
                    ensure_ascii=False,
                ),
            }
        )

    return chat_name, normalized_events


def import_chat_history(file_path: Path, output_dir: Path) -> None:
    print(f"[info] Parsing file: {file_path}")
    chat_name, events = parse_line_file(file_path)
    print(f"[info] Found {len(events)} messages from chat room: '{chat_name}'")

    if not events:
        print("[warn] No messages found to import.")
        return

    # Set up destination folders
    slug_name = safe_slug(chat_name)
    chat_folder = output_dir / "chats" / "imported" / slug_name
    chat_folder.mkdir(parents=True, exist_ok=True)

    events_file = chat_folder / "events.jsonl"
    manifest_file = chat_folder / "manifest.json"

    # Write events.jsonl (Overwrite to avoid duplicates on re-import)
    with events_file.open("w", encoding="utf-8") as f:
        for ev in events:
            f.write(json.dumps(ev, ensure_ascii=False) + "\n")

    # Create and write manifest.json
    first_event = events[0]
    manifest = {
        "schema_version": "portable-chat-v1",
        "chat_folder": f"imported/{slug_name}",
        "source_type": "line_export",
        "source_key": slug_name,
        "chat_name": chat_name,
        "folder_created_at": now_local_iso(),
        "coverage_start_at": first_event.get("captured_at"),
        "coverage_start_line_timestamp": first_event.get("line_timestamp"),
        "coverage_start_source": "imported_file",
        "data_files": ["manifest.json", "events.jsonl"],
        "note": f"Imported LINE chat backup file: {file_path.name}",
    }
    manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"[success] Import completed!")
    print(f"[success] events.jsonl: {events_file}")
    print(f"[success] manifest.json: {manifest_file}")


def main() -> None:
    parser = argparse.ArgumentParser(description="LINE Chat Export Text File Import Adapter")
    parser.add_argument("--file", required=True, help="Path to the LINE export .txt file")
    parser.add_argument(
        "--output-dir",
        default="out/standard-line-bot",
        help="Target output root directory of the local server (default: out/standard-line-bot)",
    )
    args = parser.parse_args()

    file_path = Path(args.file)
    output_dir = Path(args.output_dir)

    try:
        import_chat_history(file_path, output_dir)
    except Exception as exc:
        print(f"[error] Failed to import: {exc}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
