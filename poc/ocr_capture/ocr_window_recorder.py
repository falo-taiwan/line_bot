#!/usr/bin/env python3
"""
FALO IM OCR Window Recorder

Observer-only PoC:
- Captures a fixed screen region at an interval.
- Detects visual changes by image hash.
- Runs OCR only when the image changes.
- Writes JSONL events and Markdown notes outside LINE.

This script never modifies LINE files or sends messages.
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import platform
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Dict, Optional, Tuple

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover - Python 3.8+ normally has zoneinfo.
    ZoneInfo = None  # type: ignore[assignment]


Region = Tuple[int, int, int, int]
DEFAULT_CONFIG = "ocr_capture_config.json"
DEFAULT_SOURCE_LABEL = "LINE Desktop"
DEFAULT_OUTPUT_DIR = "out/ocr-window-recorder"
DEFAULT_CONVERSATION_FILE = "conversation.txt"
DEFAULT_INTERVAL_SECONDS = 3.0
DEFAULT_DURATION_SECONDS = 0.0
DEFAULT_OCR_LANGUAGES = "eng+chi_tra"
DEFAULT_TESSERACT_PSM = "6"
TAIPEI_TIME_ZONE_NAME = "Asia/Taipei"
TAIPEI_TIME_ZONE = (
    ZoneInfo(TAIPEI_TIME_ZONE_NAME)
    if ZoneInfo is not None
    else dt.timezone(dt.timedelta(hours=8), name=TAIPEI_TIME_ZONE_NAME)
)


def now_local_iso() -> str:
    return dt.datetime.now(TAIPEI_TIME_ZONE).isoformat(timespec="seconds")


def parse_region(value: str) -> Region:
    parts = [p.strip() for p in value.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("region must be x,y,width,height")
    try:
        x, y, width, height = [int(p) for p in parts]
    except ValueError as exc:
        raise argparse.ArgumentTypeError("region values must be integers") from exc
    if width <= 0 or height <= 0:
        raise argparse.ArgumentTypeError("region width and height must be positive")
    return x, y, width, height


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
    return slug or "capture"


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def get_screen_size() -> Optional[Tuple[int, int]]:
    system = platform.system()
    if system == "Darwin":
        result = subprocess.run(
            ["system_profiler", "SPDisplaysDataType"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            import re

            match = re.search(r"Resolution:\s+(\d+)\s+x\s+(\d+)", result.stdout)
            if match:
                return int(match.group(1)), int(match.group(2))
    if system == "Windows":
        ps_script = """
Add-Type -AssemblyName System.Windows.Forms
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
Write-Output "$($screen.Width),$($screen.Height)"
"""
        result = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0 and "," in result.stdout:
            width, height = result.stdout.strip().split(",", 1)
            return int(width), int(height)
    return None


def region_to_text(region: Region) -> str:
    return f"{region[0]},{region[1]},{region[2]},{region[3]}"


def load_config(path: Path) -> Dict[str, object]:
    if not path.exists():
        return {}
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_config(path: Path, payload: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def prompt_text(label: str, default: str) -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    return value or default


def pick_region_with_tk(parent=None) -> Optional[Region]:
    import tkinter as tk

    selection: Dict[str, Optional[Region]] = {"region": None}
    start = {"x": 0, "y": 0}
    root_offset = {"x": 0, "y": 0}
    screen_image = None
    image_tk = None
    try:
        from PIL import ImageEnhance, ImageGrab, ImageTk  # type: ignore

        screen_image = ImageGrab.grab()
    except Exception:
        ImageEnhance = None  # type: ignore
        ImageTk = None  # type: ignore

    if parent is None:
        root = tk.Tk()
        standalone = True
    else:
        root = tk.Toplevel(parent)
        standalone = False

    root.title("FALO OCR Region Selector")
    root.attributes("-fullscreen", True)
    root.attributes("-topmost", True)
    root.configure(bg="black")
    root.update_idletasks()

    canvas = tk.Canvas(root, cursor="crosshair", bg="black", highlightthickness=0)
    canvas.pack(fill="both", expand=True)

    if screen_image is not None and ImageEnhance is not None and ImageTk is not None:
        screen_w = max(1, root.winfo_screenwidth())
        screen_h = max(1, root.winfo_screenheight())
        screen_image = screen_image.resize((screen_w, screen_h))
        screen_image = ImageEnhance.Brightness(screen_image).enhance(0.42)
        image_tk = ImageTk.PhotoImage(screen_image)
        canvas.create_image(0, 0, anchor="nw", image=image_tk)
    else:
        root.attributes("-alpha", 0.82)

    rect_id = {
        "fill": None,
        "outer": None,
        "middle": None,
        "inner": None,
        "label_bg": None,
        "label_text": None,
    }
    corner_ids = []
    text_id = canvas.create_text(
        40,
        40,
        anchor="nw",
        fill="#ffff00",
        font=("Arial", 24, "bold"),
        text="Drag to select OCR capture area",
    )
    hint_id = canvas.create_text(
        40,
        82,
        anchor="nw",
        fill="#ffffff",
        font=("Arial", 16, "bold"),
        text="Release to save. Press Esc to cancel.",
    )

    def canvas_point(screen_x: int, screen_y: int) -> Tuple[int, int]:
        return screen_x - root_offset["x"], screen_y - root_offset["y"]

    def update_selection_graphics(x1: int, y1: int, x2: int, y2: int) -> None:
        left, top = min(x1, x2), min(y1, y2)
        right, bottom = max(x1, x2), max(y1, y2)
        width, height = abs(x2 - x1), abs(y2 - y1)
        c_left, c_top = canvas_point(left, top)
        c_right, c_bottom = canvas_point(right, bottom)

        for key in ("fill", "outer", "middle", "inner"):
            item_id = rect_id[key]
            if item_id is not None:
                canvas.coords(item_id, c_left, c_top, c_right, c_bottom)

        handle_size = 14
        points = (
            (c_left, c_top),
            (c_right, c_top),
            (c_left, c_bottom),
            (c_right, c_bottom),
        )
        for index, (corner_x, corner_y) in enumerate(points):
            if index >= len(corner_ids):
                break
            canvas.coords(
                corner_ids[index],
                corner_x - handle_size,
                corner_y - handle_size,
                corner_x + handle_size,
                corner_y + handle_size,
            )

        label = f"x={left}  y={top}  w={width}  h={height}"
        label_x = c_left
        label_y = max(10, c_top - 42)
        label_text = rect_id["label_text"]
        label_bg = rect_id["label_bg"]
        if label_text is not None and label_bg is not None:
            canvas.itemconfigure(label_text, text=label)
            canvas.coords(label_text, label_x + 12, label_y + 8)
            canvas.update_idletasks()
            bbox = canvas.bbox(label_text)
            if bbox:
                canvas.coords(label_bg, bbox[0] - 8, bbox[1] - 6, bbox[2] + 8, bbox[3] + 6)

        for item_id in list(rect_id.values()) + corner_ids:
            if item_id is not None:
                canvas.tag_raise(item_id)

    def on_down(event):
        root_offset["x"], root_offset["y"] = root.winfo_rootx(), root.winfo_rooty()
        start["x"], start["y"] = event.x_root, event.y_root
        for item_id in list(rect_id.values()) + corner_ids:
            if item_id is not None:
                canvas.delete(item_id)
        corner_ids.clear()
        rect_id["fill"] = canvas.create_rectangle(
            event.x,
            event.y,
            event.x,
            event.y,
            fill="#ffea00",
            stipple="gray25",
            outline="",
        )
        rect_id["outer"] = canvas.create_rectangle(
            event.x,
            event.y,
            event.x,
            event.y,
            outline="#ff3b30",
            width=14,
        )
        rect_id["middle"] = canvas.create_rectangle(
            event.x,
            event.y,
            event.x,
            event.y,
            outline="#ffff00",
            width=8,
        )
        rect_id["inner"] = canvas.create_rectangle(
            event.x,
            event.y,
            event.x,
            event.y,
            outline="#ffffff",
            width=3,
        )
        rect_id["label_bg"] = canvas.create_rectangle(0, 0, 1, 1, fill="#ff3b30", outline="#ffffff", width=2)
        rect_id["label_text"] = canvas.create_text(
            0,
            0,
            anchor="nw",
            fill="#ffffff",
            font=("Arial", 18, "bold"),
        )
        for _ in range(4):
            corner_ids.append(canvas.create_rectangle(0, 0, 1, 1, fill="#ffffff", outline="#ff3b30", width=4))
        canvas.itemconfigure(text_id, text="Selecting OCR capture area")
        canvas.itemconfigure(hint_id, text="Release mouse to confirm this rectangle.")
        update_selection_graphics(event.x_root, event.y_root, event.x_root, event.y_root)

    def on_move(event):
        if rect_id["outer"] is None:
            return
        update_selection_graphics(start["x"], start["y"], event.x_root, event.y_root)

    def on_up(event):
        x1, y1 = start["x"], start["y"]
        x2, y2 = event.x_root, event.y_root
        left, top = min(x1, x2), min(y1, y2)
        right, bottom = max(x1, x2), max(y1, y2)
        width, height = right - left, bottom - top
        if width < 20 or height < 20:
            canvas.itemconfigure(text_id, text="Selection too small. Drag again, or press Esc.")
            canvas.itemconfigure(hint_id, text="Minimum size is 20 x 20.")
            return
        selection["region"] = (left, top, width, height)
        update_selection_graphics(x1, y1, x2, y2)
        canvas.itemconfigure(text_id, text="Selected. Opening preview...")
        canvas.itemconfigure(hint_id, text=f"Saved region: {region_to_text(selection['region'])}")
        root.after(750, root.destroy)

    def on_cancel(_event=None):
        selection["region"] = None
        root.destroy()

    canvas.bind("<ButtonPress-1>", on_down)
    canvas.bind("<B1-Motion>", on_move)
    canvas.bind("<ButtonRelease-1>", on_up)
    root.bind("<Escape>", on_cancel)

    if standalone:
        root.mainloop()
    else:
        parent.wait_window(root)

    return selection["region"]


def create_region_preview(region: Region, output_dir: Path) -> Path:
    preview_path = output_dir / "selected-region-preview.png"
    capture_region(region, preview_path)
    return preview_path


def show_region_preview(parent, region: Region, preview_path: Path, modal: bool = False) -> None:
    import tkinter as tk
    from tkinter import messagebox

    owns_parent = False
    if parent is None:
        parent = tk.Tk()
        parent.withdraw()
        owns_parent = True
        modal = True

    if not preview_path.exists():
        messagebox.showwarning("Preview unavailable", f"Preview file not found:\n{preview_path}")
        if owns_parent:
            parent.destroy()
        return

    win = tk.Toplevel(parent)
    win.title("Selected OCR Region Preview")
    win.attributes("-topmost", True)

    tk.Label(
        win,
        text=f"Selected region: {region_to_text(region)}",
        font=("Arial", 13, "bold"),
    ).pack(padx=14, pady=(12, 6), anchor="w")

    try:
        from PIL import Image, ImageTk  # type: ignore

        screen_w = max(400, win.winfo_screenwidth() - 100)
        screen_h = max(300, win.winfo_screenheight() - 180)
        image_pil = Image.open(preview_path)
        image_pil.thumbnail((screen_w, screen_h))
        image = ImageTk.PhotoImage(image_pil)
    except Exception as exc:
        try:
            image = tk.PhotoImage(file=str(preview_path))
        except Exception:
            messagebox.showwarning("Preview unavailable", str(exc))
            win.destroy()
            if owns_parent:
                parent.destroy()
            return

    label = tk.Label(win, image=image, borderwidth=1, relief="solid")
    label.image = image
    label.pack(padx=14, pady=6)

    tk.Label(
        win,
        text=f"Preview saved: {preview_path}",
        fg="#555",
    ).pack(padx=14, pady=(0, 10), anchor="w")

    def close_preview() -> None:
        win.destroy()
        if owns_parent:
            parent.destroy()

    tk.Button(win, text="OK", width=12, command=close_preview).pack(pady=(0, 14))

    win.update_idletasks()
    win.lift()
    win.after(500, lambda: win.attributes("-topmost", False))
    win.protocol("WM_DELETE_WINDOW", close_preview)
    if modal:
        win.grab_set()
        parent.wait_window(win)


def write_selected_region_to_config(config_path: Path, region: Region) -> Dict[str, object]:
    current = load_config(config_path)
    payload = dict(current)
    payload["region"] = region_to_text(region)
    payload.setdefault("source_label", DEFAULT_SOURCE_LABEL)
    payload.setdefault("output_dir", DEFAULT_OUTPUT_DIR)
    payload.setdefault("conversation_file", DEFAULT_CONVERSATION_FILE)
    payload.setdefault("interval_seconds", DEFAULT_INTERVAL_SECONDS)
    payload.setdefault("duration_seconds", DEFAULT_DURATION_SECONDS)
    payload.setdefault("ocr_languages", DEFAULT_OCR_LANGUAGES)
    payload.setdefault("tesseract_psm", DEFAULT_TESSERACT_PSM)
    save_config(config_path, payload)
    return payload


def run_select_region(args: argparse.Namespace) -> int:
    try:
        region = pick_region_with_tk()
    except Exception as exc:
        print(f"[error] tkinter unavailable or failed: {exc}", file=sys.stderr)
        return 1

    if not region:
        print("[done] selection cancelled")
        return 1

    config_path = Path(args.config).resolve()
    payload = write_selected_region_to_config(config_path, region)
    try:
        preview_output_dir = Path(str(payload.get("output_dir", DEFAULT_OUTPUT_DIR))).resolve()
        preview_path = create_region_preview(region, preview_output_dir)
        show_region_preview(None, region, preview_path, modal=True)
    except Exception as exc:
        print(f"[warn] preview failed: {exc}", file=sys.stderr)

    print(f"[done] selected region: {payload['region']}")
    print(f"[done] config saved: {config_path}")
    print("[next] python3 ocr_window_recorder.py --step-mode")
    print("[next] python3 ocr_window_recorder.py --watch")
    return 0


def run_setup(args: argparse.Namespace) -> int:
    config_path = Path(args.config).resolve()
    current = load_config(config_path)
    size = get_screen_size()
    if size:
        print(f"[info] screen size: {size[0]} x {size[1]}")
    else:
        print("[info] screen size: unavailable")
    print("[info] setup uses x,y,width,height. Keep LINE fixed in a simple test scene.")

    default_region = str(current.get("region", "100,120,900,700"))
    while True:
        try:
            region = parse_region(prompt_text("Capture region", default_region))
            break
        except argparse.ArgumentTypeError as exc:
            print(f"[warn] {exc}")

    source_label = prompt_text(
        "Source label",
        str(current.get("source_label", DEFAULT_SOURCE_LABEL)),
    )
    output_dir = prompt_text(
        "Output directory",
        str(current.get("output_dir", DEFAULT_OUTPUT_DIR)),
    )
    conversation_file = prompt_text(
        "Conversation text file",
        str(current.get("conversation_file", DEFAULT_CONVERSATION_FILE)),
    )
    interval_seconds = float(
        prompt_text(
            "Interval seconds",
            str(current.get("interval_seconds", DEFAULT_INTERVAL_SECONDS)),
        )
    )
    ocr_languages = prompt_text(
        "OCR languages",
        str(current.get("ocr_languages", DEFAULT_OCR_LANGUAGES)),
    )

    payload = {
        "region": region_to_text(region),
        "source_label": source_label,
        "output_dir": output_dir,
        "conversation_file": conversation_file,
        "interval_seconds": interval_seconds,
        "duration_seconds": float(current.get("duration_seconds", DEFAULT_DURATION_SECONDS)),
        "ocr_languages": ocr_languages,
        "tesseract_psm": str(current.get("tesseract_psm", DEFAULT_TESSERACT_PSM)),
    }
    save_config(config_path, payload)
    print(f"[done] config saved: {config_path}")
    print("[next] python3 ocr_window_recorder.py --watch")
    print("[next] python3 ocr_window_recorder.py --step-mode")
    return 0


def apply_config(args: argparse.Namespace) -> argparse.Namespace:
    config = load_config(Path(args.config).resolve())

    if args.region is None and config.get("region"):
        args.region = parse_region(str(config["region"]))
    if args.source_label is None:
        args.source_label = str(config.get("source_label", DEFAULT_SOURCE_LABEL))
    if args.output_dir is None:
        args.output_dir = str(config.get("output_dir", DEFAULT_OUTPUT_DIR))
    if args.conversation_file is None:
        args.conversation_file = str(config.get("conversation_file", DEFAULT_CONVERSATION_FILE))
    if args.interval_seconds is None:
        args.interval_seconds = float(config.get("interval_seconds", DEFAULT_INTERVAL_SECONDS))
    if args.duration_seconds is None:
        args.duration_seconds = float(config.get("duration_seconds", DEFAULT_DURATION_SECONDS))
    if args.ocr_languages is None:
        args.ocr_languages = str(config.get("ocr_languages", DEFAULT_OCR_LANGUAGES))
    if args.tesseract_psm is None:
        args.tesseract_psm = str(config.get("tesseract_psm", DEFAULT_TESSERACT_PSM))
    return args


def get_windows_window_region(title_keyword: str) -> Optional[Region]:
    if platform.system() != "Windows":
        return None
    import ctypes
    from ctypes import wintypes

    user32 = ctypes.windll.user32
    matches = []

    EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)

    def callback(hwnd, _lparam):
        if not user32.IsWindowVisible(hwnd):
            return True
        length = user32.GetWindowTextLengthW(hwnd)
        if length == 0:
            return True
        buffer = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buffer, length + 1)
        title = buffer.value
        if title_keyword.lower() in title.lower():
            rect = wintypes.RECT()
            user32.GetWindowRect(hwnd, ctypes.byref(rect))
            width = rect.right - rect.left
            height = rect.bottom - rect.top
            if width > 0 and height > 0:
                matches.append((rect.left, rect.top, width, height, title))
            return False
        return True

    user32.EnumWindows(EnumWindowsProc(callback), 0)
    if not matches:
        return None
    x, y, width, height, _title = matches[0]
    return x, y, width, height


def capture_region_with_pillow(region: Region, output_path: Path) -> bool:
    try:
        from PIL import ImageGrab  # type: ignore
    except Exception:
        return False

    try:
        x, y, width, height = region
        image = ImageGrab.grab(bbox=(x, y, x + width, y + height))
        image.save(output_path)
        return output_path.exists() and output_path.stat().st_size > 0
    except Exception:
        output_path.unlink(missing_ok=True)
        return False


def capture_region_macos(region: Region, output_path: Path) -> bool:
    if platform.system() != "Darwin":
        return False
    x, y, width, height = region
    cmd = [
        "screencapture",
        "-x",
        "-R",
        f"{x},{y},{width},{height}",
        str(output_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0 and output_path.exists()


def capture_region_windows(region: Region, output_path: Path) -> bool:
    if platform.system() != "Windows":
        return False
    x, y, width, height = region
    ps_script = f"""
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms
$bitmap = New-Object System.Drawing.Bitmap {width}, {height}
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen({x}, {y}, 0, 0, $bitmap.Size)
$bitmap.Save('{str(output_path).replace("'", "''")}', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
"""
    result = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0 and output_path.exists()


def capture_region(region: Region, output_path: Path) -> str:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if capture_region_with_pillow(region, output_path):
        return "pillow_imagegrab"
    if capture_region_macos(region, output_path):
        return "macos_screencapture"
    if capture_region_windows(region, output_path):
        return "windows_powershell_screenshot"
    raise RuntimeError("No supported screenshot method worked on this platform.")


def run_tesseract(image_path: Path, languages: str, psm: str) -> Dict[str, object]:
    tesseract = shutil.which("tesseract")
    if not tesseract:
        return {
            "available": False,
            "text": "",
            "error": "tesseract not found",
        }
    cmd = [tesseract, str(image_path), "stdout", "-l", languages, "--psm", psm]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return {
        "available": True,
        "text": result.stdout.strip(),
        "error": result.stderr.strip() if result.returncode else "",
        "returncode": result.returncode,
    }


def normalize_text(text: str) -> str:
    lines = [" ".join(line.split()) for line in text.splitlines()]
    lines = [line for line in lines if line]
    return "\n".join(lines)


def extract_added_text(previous_text: str, current_text: str) -> str:
    previous = normalize_text(previous_text)
    current = normalize_text(current_text)
    if not current or current == previous:
        return ""
    if previous and current.startswith(previous):
        return current[len(previous):].strip()

    previous_lines = previous.splitlines()
    current_lines = current.splitlines()
    max_overlap = 0
    max_size = min(len(previous_lines), len(current_lines))
    for size in range(1, max_size + 1):
        if previous_lines[-size:] == current_lines[:size]:
            max_overlap = size
    if max_overlap:
        return "\n".join(current_lines[max_overlap:]).strip()

    previous_set = set(previous_lines)
    added_lines = [line for line in current_lines if line not in previous_set]
    return "\n".join(added_lines).strip()


def append_jsonl(path: Path, payload: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(payload, ensure_ascii=False) + "\n")


def append_markdown(path: Path, event: Dict[str, object]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    exists = path.exists()
    with path.open("a", encoding="utf-8") as handle:
        if not exists:
            handle.write("# OCR Window Recorder Log\n\n")
        handle.write(f"## {event['captured_at']} - {event['event_type']}\n\n")
        handle.write(f"- Event ID: `{event['event_id']}`\n")
        handle.write(f"- Source: `{event['source_label']}`\n")
        handle.write(f"- Region: `{event['region']}`\n")
        handle.write(f"- Image hash: `{event['image_sha256']}`\n")
        if event.get("screenshot_path"):
            handle.write(f"- Screenshot: `{event['screenshot_path']}`\n")
        text = str(event.get("text", "")).strip()
        if text:
            handle.write("\n```text\n")
            handle.write(text)
            handle.write("\n```\n")
        else:
            handle.write("\n_OCR text empty or OCR unavailable._\n")
        handle.write("\n")


def append_conversation_text(path: Path, added_text: str, captured_at: str) -> None:
    added_text = added_text.strip()
    if not added_text:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    exists = path.exists()
    with path.open("a", encoding="utf-8") as handle:
        if not exists:
            handle.write("# LINE OCR Conversation Text\n\n")
        handle.write(f"## {captured_at}\n\n")
        handle.write(added_text)
        handle.write("\n\n")


def build_event(
    *,
    event_id: str,
    event_type: str,
    source_label: str,
    region: Region,
    screenshot_path: Path,
    image_hash: str,
    capture_method: str,
    ocr_result: Dict[str, object],
    changed_from_previous: bool,
    added_text: str,
) -> Dict[str, object]:
    raw_text = str(ocr_result.get("text", ""))
    return {
        "event_id": event_id,
        "event_type": event_type,
        "source_type": "screen_region",
        "source_label": source_label,
        "capture_method": capture_method,
        "region": {
            "x": region[0],
            "y": region[1],
            "width": region[2],
            "height": region[3],
        },
        "captured_at": now_local_iso(),
        "screenshot_path": str(screenshot_path),
        "image_sha256": image_hash,
        "changed_from_previous": changed_from_previous,
        "ocr_available": bool(ocr_result.get("available")),
        "ocr_error": ocr_result.get("error", ""),
        "text": normalize_text(raw_text),
        "added_text": added_text,
        "raw_text": raw_text,
        "privacy_level": "local_authorized_observer_only",
        "processing_status": "ocr_recorded",
    }


def resolve_runtime(args: argparse.Namespace) -> Dict[str, object]:
    args = apply_config(args)
    output_dir = Path(args.output_dir).resolve()
    region = args.region
    if args.window_title:
        detected = get_windows_window_region(args.window_title)
        if detected:
            region = detected
            print(f"[info] detected window region for title '{args.window_title}': {region}")
        elif not region:
            raise RuntimeError(
                "--window-title did not match a visible Windows window; provide --region fallback."
            )
    if not region:
        raise RuntimeError("Provide --region x,y,width,height, or --window-title on Windows.")

    return {
        "output_dir": output_dir,
        "capture_dir": output_dir / "captures",
        "events_path": output_dir / "events.jsonl",
        "notes_path": output_dir / "ocr-notes.md",
        "conversation_path": output_dir / args.conversation_file,
        "region": region,
        "source_label": args.source_label,
        "source_slug": safe_slug(args.source_label),
        "interval_seconds": float(args.interval_seconds),
        "duration_seconds": float(args.duration_seconds),
        "ocr_languages": args.ocr_languages,
        "tesseract_psm": args.tesseract_psm,
        "record_unchanged": bool(args.record_unchanged),
        "ocr_unchanged": bool(args.ocr_unchanged),
        "delete_unchanged_screenshots": bool(args.delete_unchanged_screenshots),
    }


def capture_once(runtime: Dict[str, object], state: Dict[str, object]) -> Optional[Dict[str, object]]:
    output_dir = Path(runtime["output_dir"])
    output_dir.mkdir(parents=True, exist_ok=True)
    capture_dir = Path(runtime["capture_dir"])
    region = runtime["region"]
    assert isinstance(region, tuple)

    iteration = int(state.get("iteration", 0)) + 1
    state["iteration"] = iteration
    timestamp = dt.datetime.now(TAIPEI_TIME_ZONE).strftime("%Y%m%d-%H%M%S")
    screenshot = capture_dir / f"{timestamp}-{runtime['source_slug']}-{iteration:04d}.png"
    capture_method = capture_region(region, screenshot)
    image_hash = file_sha256(screenshot)
    last_hash = state.get("last_hash")
    changed = image_hash != last_hash

    if not changed and not runtime["record_unchanged"]:
        if runtime["delete_unchanged_screenshots"]:
            screenshot.unlink(missing_ok=True)
        state["last_hash"] = image_hash
        return None

    if changed or runtime["ocr_unchanged"]:
        ocr_result = run_tesseract(
            screenshot,
            str(runtime["ocr_languages"]),
            str(runtime["tesseract_psm"]),
        )
    else:
        ocr_result = {
            "available": bool(shutil.which("tesseract")),
            "text": "",
            "error": "unchanged frame skipped",
        }

    current_text = normalize_text(str(ocr_result.get("text", "")))
    added_text = extract_added_text(str(state.get("last_text", "")), current_text)
    event_id = f"ocr_{timestamp}_{iteration:04d}"
    event = build_event(
        event_id=event_id,
        event_type="screen_region_changed" if changed else "screen_region_unchanged",
        source_label=str(runtime["source_label"]),
        region=region,
        screenshot_path=screenshot,
        image_hash=image_hash,
        capture_method=capture_method,
        ocr_result=ocr_result,
        changed_from_previous=changed,
        added_text=added_text,
    )
    append_jsonl(Path(runtime["events_path"]), event)
    append_markdown(Path(runtime["notes_path"]), event)
    append_conversation_text(Path(runtime["conversation_path"]), added_text, str(event["captured_at"]))

    if current_text:
        state["last_text"] = current_text
    state["last_hash"] = image_hash
    return event


def run_recorder(args: argparse.Namespace) -> int:
    runtime = resolve_runtime(args)
    output_dir = Path(runtime["output_dir"])
    events_path = Path(runtime["events_path"])
    notes_path = Path(runtime["notes_path"])
    conversation_path = Path(runtime["conversation_path"])
    output_dir.mkdir(parents=True, exist_ok=True)

    state: Dict[str, object] = {"last_hash": None, "last_text": "", "iteration": 0}
    started = time.monotonic()

    print(f"[info] output_dir={output_dir}")
    print(f"[info] conversation_file={conversation_path}")
    print(f"[info] source_label={runtime['source_label']}")
    print(f"[info] region={runtime['region']}")
    print("[info] observer-only: no LINE files will be modified")

    while True:
        if runtime["duration_seconds"] and time.monotonic() - started >= runtime["duration_seconds"]:
            break
        event = capture_once(runtime, state)
        if event:
            text_preview = str(event.get("added_text", "")).replace("\n", " ")[:80]
            print(
                f"[event] {event['event_id']} "
                f"changed={event['changed_from_previous']} added='{text_preview}'"
            )
        else:
            print(f"[skip] unchanged frame at {dt.datetime.now(TAIPEI_TIME_ZONE).strftime('%Y%m%d-%H%M%S')}")

        if args.step_mode:
            answer = input("[step] Add text/change screen, then press Enter. Type q to stop: ")
            if answer.strip().lower() in {"q", "quit", "exit"}:
                break
        else:
            time.sleep(float(runtime["interval_seconds"]))

    print(f"[done] events={events_path}")
    print(f"[done] notes={notes_path}")
    print(f"[done] conversation={conversation_path}")
    return 0


def run_control_panel(args: argparse.Namespace) -> int:
    try:
        import tkinter as tk
        from tkinter import messagebox
    except Exception as exc:
        print(f"[error] tkinter unavailable: {exc}", file=sys.stderr)
        return 1

    args = apply_config(args)
    root = tk.Tk()
    root.title("FALO LINE OCR Recorder")
    root.geometry("520x260")
    root.resizable(False, False)

    running = {"value": False}
    after_id = {"value": None}
    state: Dict[str, object] = {"last_hash": None, "last_text": "", "iteration": 0}
    runtime_holder: Dict[str, object] = {}

    status = tk.StringVar(value="Stopped")
    region_text = tk.StringVar(value=region_to_text(args.region) if args.region else "not selected")
    output_text = tk.StringVar(value=str(args.output_dir or DEFAULT_OUTPUT_DIR))

    def refresh_config_labels() -> None:
        configured = apply_config(argparse.Namespace(**vars(args)))
        region_text.set(region_to_text(configured.region) if configured.region else "not selected")
        output_text.set(str(configured.output_dir or DEFAULT_OUTPUT_DIR))

    def select_region_from_panel() -> None:
        root.withdraw()
        preview_path: Optional[Path] = None
        selected_region: Optional[Region] = None
        try:
            try:
                region = pick_region_with_tk(root)
            except Exception as exc:
                messagebox.showerror("Region selector failed", str(exc))
                status.set("Region selection failed")
                return
            if not region:
                status.set("Region selection cancelled")
                return
            payload = write_selected_region_to_config(Path(args.config).resolve(), region)
            args.region = parse_region(str(payload["region"]))
            args.source_label = str(payload.get("source_label", args.source_label or DEFAULT_SOURCE_LABEL))
            args.output_dir = str(payload.get("output_dir", args.output_dir or DEFAULT_OUTPUT_DIR))
            args.conversation_file = str(
                payload.get("conversation_file", args.conversation_file or DEFAULT_CONVERSATION_FILE)
            )
            args.interval_seconds = float(
                payload.get("interval_seconds", args.interval_seconds or DEFAULT_INTERVAL_SECONDS)
            )
            args.duration_seconds = float(
                payload.get("duration_seconds", args.duration_seconds or DEFAULT_DURATION_SECONDS)
            )
            args.ocr_languages = str(
                payload.get("ocr_languages", args.ocr_languages or DEFAULT_OCR_LANGUAGES)
            )
            args.tesseract_psm = str(
                payload.get("tesseract_psm", args.tesseract_psm or DEFAULT_TESSERACT_PSM)
            )
            refresh_config_labels()
            status.set(f"Region selected: {payload['region']}")
            selected_region = args.region
            try:
                preview_output_dir = Path(str(payload.get("output_dir", DEFAULT_OUTPUT_DIR))).resolve()
                preview_path = create_region_preview(args.region, preview_output_dir)
            except Exception as exc:
                messagebox.showwarning("Preview failed", str(exc))
        finally:
            root.deiconify()
            root.lift()
            root.attributes("-topmost", True)
            root.after(300, lambda: root.attributes("-topmost", False))
            if selected_region and preview_path:
                root.after(350, lambda: show_region_preview(root, selected_region, preview_path))

    def tick() -> None:
        if not running["value"]:
            return
        try:
            event = capture_once(runtime_holder, state)
            if event:
                preview = str(event.get("added_text", "")).replace("\n", " ")[:60]
                status.set(f"Running: {event['event_id']} {preview}")
            else:
                status.set(f"Running: unchanged {now_local_iso()}")
        except Exception as exc:
            running["value"] = False
            status.set("Stopped by error")
            messagebox.showerror("OCR Recorder Error", str(exc))
            return
        after_id["value"] = root.after(int(float(runtime_holder["interval_seconds"]) * 1000), tick)

    def start() -> None:
        if running["value"]:
            return
        try:
            runtime = resolve_runtime(args)
        except Exception as exc:
            messagebox.showerror("Cannot start", str(exc))
            return
        runtime_holder.clear()
        runtime_holder.update(runtime)
        running["value"] = True
        status.set("Running")
        tick()

    def stop() -> None:
        running["value"] = False
        if after_id["value"] is not None:
            root.after_cancel(after_id["value"])
            after_id["value"] = None
        status.set("Stopped")

    def on_close() -> None:
        stop()
        root.destroy()

    tk.Label(root, text="FALO LINE OCR Recorder", font=("Arial", 16, "bold")).pack(pady=(14, 6))
    tk.Label(root, textvariable=status, fg="#0b5", font=("Arial", 12)).pack(pady=(0, 8))

    info = tk.Frame(root)
    info.pack(fill="x", padx=18)
    tk.Label(info, text="Region:", width=14, anchor="w").grid(row=0, column=0, sticky="w")
    tk.Label(info, textvariable=region_text, anchor="w").grid(row=0, column=1, sticky="w")
    tk.Label(info, text="Output:", width=14, anchor="w").grid(row=1, column=0, sticky="w")
    tk.Label(info, textvariable=output_text, anchor="w").grid(row=1, column=1, sticky="w")
    tk.Label(info, text="Conversation:", width=14, anchor="w").grid(row=2, column=0, sticky="w")
    tk.Label(info, text=args.conversation_file or DEFAULT_CONVERSATION_FILE, anchor="w").grid(
        row=2, column=1, sticky="w"
    )

    buttons = tk.Frame(root)
    buttons.pack(pady=20)
    tk.Button(buttons, text="Select Region", width=14, command=select_region_from_panel).grid(
        row=0, column=0, padx=6
    )
    tk.Button(buttons, text="Start", width=12, command=start).grid(row=0, column=1, padx=6)
    tk.Button(buttons, text="Stop", width=12, command=stop).grid(row=0, column=2, padx=6)

    tk.Label(
        root,
        text="Observer-only: captures screen text and appends new OCR text to conversation.txt",
        fg="#555",
    ).pack(pady=(2, 0))

    refresh_config_labels()
    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Observer-only OCR recorder for a fixed LINE Desktop screen region."
    )
    parser.add_argument(
        "--setup",
        action="store_true",
        help="Interactive setup for region/source/output config.",
    )
    parser.add_argument(
        "--select-region",
        action="store_true",
        help="Open a small GUI overlay to drag-select the OCR capture region.",
    )
    parser.add_argument(
        "--control-panel",
        action="store_true",
        help="Open a small GUI with Select Region, Start, and Stop buttons.",
    )
    parser.add_argument(
        "--watch",
        action="store_true",
        help="Run using config or CLI args. Optional; default action when not using --setup.",
    )
    parser.add_argument(
        "--step-mode",
        action="store_true",
        help="Manual capture mode: press Enter after adding/changing text.",
    )
    parser.add_argument(
        "--show-screen-size",
        action="store_true",
        help="Print detected screen size and exit.",
    )
    parser.add_argument(
        "--config",
        default=DEFAULT_CONFIG,
        help="Config file path created by --setup.",
    )
    parser.add_argument(
        "--region",
        type=parse_region,
        help="Capture region as x,y,width,height. Example: 100,120,900,700",
    )
    parser.add_argument(
        "--window-title",
        help="Windows only: visible window title keyword. Uses detected window rect if found.",
    )
    parser.add_argument(
        "--source-label",
        default=None,
        help="Human-readable source label stored in events.",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Directory for screenshots, events.jsonl, and Markdown notes.",
    )
    parser.add_argument(
        "--conversation-file",
        default=None,
        help="Plain text file for newly OCR-detected conversation text.",
    )
    parser.add_argument(
        "--interval-seconds",
        type=float,
        default=None,
        help="Seconds between captures.",
    )
    parser.add_argument(
        "--duration-seconds",
        type=float,
        default=None,
        help="Total run duration. 0 means run until Ctrl+C.",
    )
    parser.add_argument(
        "--ocr-languages",
        default=None,
        help="Tesseract languages, e.g. eng+chi_tra.",
    )
    parser.add_argument(
        "--tesseract-psm",
        default=None,
        help="Tesseract page segmentation mode.",
    )
    parser.add_argument(
        "--record-unchanged",
        action="store_true",
        help="Also write events when screenshot hash did not change.",
    )
    parser.add_argument(
        "--ocr-unchanged",
        action="store_true",
        help="Run OCR even when screenshot hash did not change.",
    )
    parser.add_argument(
        "--delete-unchanged-screenshots",
        action="store_true",
        default=True,
        help="Delete screenshots for unchanged frames when no event is recorded.",
    )
    return parser


def main(argv: Optional[list] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    try:
        if args.show_screen_size:
            size = get_screen_size()
            if size:
                print(f"{size[0]},{size[1]}")
                return 0
            print("screen size unavailable", file=sys.stderr)
            return 1
        if args.setup:
            return run_setup(args)
        if args.select_region:
            return run_select_region(args)
        if args.control_panel:
            return run_control_panel(args)
        return run_recorder(args)
    except KeyboardInterrupt:
        print("\n[done] stopped by user")
        return 0
    except Exception as exc:
        print(f"[error] {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
