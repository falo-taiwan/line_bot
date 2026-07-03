import json
import tempfile
import unittest
from pathlib import Path

import ocr_window_recorder as recorder


class OcrWindowRecorderTests(unittest.TestCase):
    def test_parse_region(self):
        self.assertEqual(recorder.parse_region("10,20,300,400"), (10, 20, 300, 400))

    def test_parse_region_rejects_bad_size(self):
        with self.assertRaises(Exception):
            recorder.parse_region("10,20,0,400")

    def test_normalize_text(self):
        text = "  hello   world  \n\n中文   測試\n"
        self.assertEqual(recorder.normalize_text(text), "hello world\n中文 測試")

    def test_append_jsonl(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "events.jsonl"
            recorder.append_jsonl(path, {"message_text": "中文", "n": 1})
            payload = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(payload["message_text"], "中文")
            self.assertEqual(payload["n"], 1)

    def test_extract_added_text_prefix(self):
        previous = "OCR_STEP_001 hello"
        current = "OCR_STEP_001 hello\nOCR_STEP_002 中文測試"
        self.assertEqual(recorder.extract_added_text(previous, current), "OCR_STEP_002 中文測試")

    def test_extract_added_text_overlap(self):
        previous = "line a\nline b"
        current = "line b\nline c"
        self.assertEqual(recorder.extract_added_text(previous, current), "line c")

    def test_append_conversation_text(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "conversation.txt"
            recorder.append_conversation_text(path, "新增文字", "2026-06-18T17:00:00+08:00")
            content = path.read_text(encoding="utf-8")
            self.assertIn("新增文字", content)


if __name__ == "__main__":
    unittest.main()
