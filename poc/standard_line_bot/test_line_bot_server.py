import base64
import hashlib
import hmac
import json
import tempfile
import urllib.parse
import unittest
from pathlib import Path

import line_bot_server as bot


def sample_text_event(text="任務 owner=Force due=明天下午 確認報價單"):
    return {
        "type": "message",
        "mode": "active",
        "timestamp": 1710000000000,
        "webhookEventId": "test-webhook-event-id",
        "deliveryContext": {"isRedelivery": False},
        "replyToken": "test-reply-token",
        "source": {"type": "user", "userId": "U_TEST"},
        "message": {"id": "msg-text-001", "type": "text", "text": text},
    }


class LineBotServerTest(unittest.TestCase):
    def test_start_command_closes_port_starts_server_and_opens_admin(self):
        command_path = Path(__file__).with_name("Start_STANDARD_LINE_BOT.command")
        script = command_path.read_text(encoding="utf-8")

        self.assertIn("lsof -tiTCP", script)
        self.assertIn("kill", script)
        self.assertIn("line_bot_server.py", script)
        self.assertIn("--port \"$PORT\"", script)
        self.assertIn("/admin/login", script)
        self.assertIn("/dev-console", script)
        self.assertIn("/gas-monitor", script)
        self.assertIn('open "$ADMIN_URL"', script)
        self.assertIn('open "$DEV_CONSOLE_URL"', script)
        self.assertIn('open "$GAS_MONITOR_URL"', script)

    def test_verify_line_signature(self):
        secret = "channel-secret"
        body = b'{"events":[]}'
        digest = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).digest()
        signature = base64.b64encode(digest).decode("utf-8")

        self.assertTrue(bot.verify_line_signature(secret, body, signature))
        self.assertFalse(bot.verify_line_signature(secret, body + b"!", signature))

    def test_verify_any_channel_signature_selects_matching_bot(self):
        body = b'{"destination":"U_BOT_GAS","events":[]}'
        secret = "gas-secret"
        signature = base64.b64encode(hmac.new(secret.encode("utf-8"), body, hashlib.sha256).digest()).decode("utf-8")
        channels = [
            {"alias": "local", "name": "Local Bot", "channel_secret": "local-secret"},
            {"alias": "gas", "name": "GAS Bot", "channel_secret": secret},
        ]

        matched = bot.verify_any_channel_signature(channels, body, signature)

        self.assertIsNotNone(matched)
        self.assertEqual(matched["alias"], "gas")

    def test_select_channel_config_uses_destination_when_signature_skipped(self):
        channels = [
            {"alias": "local", "destination": "U_LOCAL"},
            {"alias": "gas", "destination": "U_GAS"},
        ]

        selected = bot.select_channel_config(channels, destination="U_GAS")

        self.assertEqual(selected["alias"], "gas")

    def test_normalize_text_event(self):
        normalized = bot.normalize_event(sample_text_event())

        self.assertEqual(normalized["event_type"], "task_candidate")
        self.assertEqual(normalized["content_kind"], "text")
        self.assertEqual(normalized["text"], "任務 owner=Force due=明天下午 確認報價單")
        self.assertEqual(normalized["source"]["key"], "U_TEST")
        self.assertEqual(normalized["sender"]["user_id"], "U_TEST")
        self.assertIsNone(normalized["sender"]["display_name"])
        self.assertEqual(normalized["line"]["message_type"], "text")

    def test_normalize_group_image_event(self):
        event = {
            "type": "message",
            "timestamp": 1710000000001,
            "source": {"type": "group", "groupId": "G_TEST", "userId": "U_TEST"},
            "message": {"id": "msg-image-001", "type": "image", "contentProvider": {"type": "line"}},
        }
        normalized = bot.normalize_event(event)

        self.assertEqual(normalized["event_type"], "message_image")
        self.assertEqual(normalized["content_kind"], "media")
        self.assertEqual(normalized["source"]["key"], "G_TEST")
        self.assertEqual(normalized["sender"]["user_id"], "U_TEST")
        self.assertEqual(normalized["sender"]["display_name"], None)
        self.assertEqual(normalized["media"]["message_id"], "msg-image-001")

    def test_handle_events_writes_jsonl(self):
        with tempfile.TemporaryDirectory() as tmp:
            output_dir = Path(tmp)
            records = bot.handle_events(
                [sample_text_event("hello")],
                output_dir=output_dir,
                download_media=False,
                auto_reply=False,
                bot_info={"alias": "gas", "name": "FALO IM Bot GAS Test", "basic_id": "@415taurm"},
            )

            self.assertEqual(len(records), 1)
            events_path = output_dir / "events.jsonl"
            self.assertTrue(events_path.exists())
            saved = json.loads(events_path.read_text(encoding="utf-8").strip())
            self.assertEqual(saved["text"], "hello")
            self.assertEqual(saved["processing_status"], "received")
            self.assertEqual(saved["bot"]["alias"], "gas")

    def test_content_extension(self):
        self.assertEqual(bot.content_extension("image/jpeg"), ".jpg")
        self.assertEqual(bot.content_extension("application/octet-stream"), ".bin")

    def test_build_media_filename_contains_required_context(self):
        normalized = {
            "line_timestamp": 1781794202123,
            "source": {"type": "group", "key": "C3f176d059bd5871cd34bc9ec7c84a0d0"},
            "sender": {"user_id": "U184e1758bd653e1b21319e803af1a445"},
        }

        filename = bot.build_media_filename(
            normalized=normalized,
            message_type="image",
            message_id="537258944123456789",
            digest="a8f3c91d22ab99ff",
            extension=".jpg",
        )

        self.assertEqual(
            filename,
            "20260618-225002_group_c3f176d059bd_u184e1758bd6_image_537258944123456789_a8f3c91d22ab.jpg",
        )

    def test_default_mode_collects_without_auto_reply(self):
        self.assertEqual(bot.DEFAULT_AUTO_REPLY, "false")

    def test_sender_profile_url_for_group_sender(self):
        source = {"type": "group", "groupId": "G_TEST", "userId": "U_TEST"}

        self.assertEqual(
            bot.sender_profile_url(source),
            "https://api.line.me/v2/bot/group/G_TEST/member/U_TEST",
        )

    def test_apply_sender_profile(self):
        normalized = bot.normalize_event(sample_text_event())

        bot.apply_sender_profile(
            normalized,
            {"userId": "U_TEST", "displayName": "小火花", "pictureUrl": "https://example.test/p.png"},
            source_label="line_profile_api",
        )

        self.assertEqual(normalized["sender"]["display_name"], "小火花")
        self.assertEqual(normalized["sender"]["profile_source"], "line_profile_api")
        self.assertEqual(normalized["sender"]["picture_url"], "https://example.test/p.png")

    def test_parse_form_urlencoded_decodes_utf8(self):
        form = bot.parse_form_urlencoded(b"username=admin&password=666666&note=%E6%B8%AC%E8%A9%A6")

        self.assertEqual(form["username"], "admin")
        self.assertEqual(form["password"], "666666")
        self.assertEqual(form["note"], "測試")

    def test_admin_session_cookie_round_trip_and_tamper_rejected(self):
        cookie = bot.create_admin_session_cookie("admin", "dev-secret", now=1710000000)

        self.assertEqual(bot.verify_admin_session_cookie(cookie, "dev-secret", now=1710000010), "admin")
        self.assertIsNone(bot.verify_admin_session_cookie(cookie + "x", "dev-secret", now=1710000010))
        self.assertIsNone(bot.verify_admin_session_cookie(cookie, "other-secret", now=1710000010))

    def test_load_recent_events_returns_newest_records(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "events.jsonl"
            for index in range(3):
                bot.append_jsonl(path, {"event_id": f"e{index}", "text": f"msg {index}"})

            events = bot.load_recent_events(path, limit=2)

            self.assertEqual([event["event_id"] for event in events], ["e2", "e1"])

    def test_render_admin_dashboard_contains_event_context(self):
        html = bot.render_admin_dashboard(
            [
                {
                    "captured_at": "2026-06-18T20:10:00+08:00",
                    "line_timestamp": 1781794200000,
                    "event_type": "message_text",
                    "source": {"type": "group", "key": "G_TEST"},
                    "sender": {"display_name": "鄭Force", "user_id": "U_TEST"},
                    "line": {"message_type": "text"},
                    "text": "Test 2",
                    "processing_status": "received",
                }
            ],
            {"admin_user": "admin", "output_dir": "/tmp/out"},
        )

        self.assertIn("鄭Force", html)
        self.assertIn("group", html)
        self.assertIn("Test 2", html)
        self.assertIn("/admin/logout", html)

    def test_build_gas_proxy_url_sets_api_and_limit(self):
        url = bot.build_gas_proxy_url(
            "https://script.google.com/macros/s/DEPLOYMENT_ID/exec?existing=1",
            "events",
            incoming_query="limit=50",
            viewer_token="viewer-token",
        )

        parsed = urllib.parse.urlsplit(url)
        query = dict(urllib.parse.parse_qsl(parsed.query))
        self.assertEqual(query["existing"], "1")
        self.assertEqual(query["api"], "events")
        self.assertEqual(query["limit"], "50")
        self.assertEqual(query["token"], "viewer-token")

    def test_build_gas_proxy_url_accepts_exec_url_override(self):
        default_url = "https://script.google.com/macros/s/DEFAULT/exec"
        override_url = "https://script.google.com/macros/s/OVERRIDE/exec"
        incoming_query = urllib.parse.urlencode({"url": override_url, "limit": "25"})

        url = bot.build_gas_proxy_url(default_url, "events", incoming_query=incoming_query)

        parsed = urllib.parse.urlsplit(url)
        query = dict(urllib.parse.parse_qsl(parsed.query))
        self.assertEqual(parsed.path, "/macros/s/OVERRIDE/exec")
        self.assertEqual(query["api"], "events")
        self.assertEqual(query["limit"], "25")

    def test_build_gas_proxy_url_rejects_non_gas_url(self):
        with self.assertRaises(ValueError):
            bot.build_gas_proxy_url(
                "https://script.google.com/macros/s/DEFAULT/exec",
                "events",
                incoming_query="url=https%3A%2F%2Fevil.test%2Fexec",
            )

    def test_render_gas_monitor_contains_proxy_endpoints(self):
        html = bot.render_gas_monitor(
            {
                "gas_proxy_url": "https://script.google.com/macros/s/DEPLOYMENT_ID/exec",
                "gas_proxy_sheet_url": "https://docs.google.com/spreadsheets/d/SHEET_ID/edit",
            }
        )

        self.assertIn("/gas-proxy/health", html)
        self.assertIn("/gas-proxy/events?limit=200", html)
        self.assertIn("FALO GAS Proxy Monitor", html)

    def test_render_dev_console_contains_v101_controls(self):
        html = bot.render_dev_console(
            [
                {
                    "captured_at": "2026-06-20T14:10:00+08:00",
                    "line_timestamp": 1781794200000,
                    "event_type": "message_text",
                    "source": {"type": "group", "key": "G_TEST"},
                    "sender": {"display_name": "Force", "user_id": "U_TEST"},
                    "line": {"message_type": "text", "message_id": "M_TEST"},
                    "bot": {"name": "FALO IM Bot GAS Test", "basic_id": "@415taurm"},
                    "text": "hello",
                    "processing_status": "received",
                }
            ],
            {
                "admin_user": "admin",
                "output_dir": "/tmp/out",
                "gas_proxy_url": "https://script.google.com/macros/s/DEPLOYMENT_ID/exec",
                "gas_proxy_sheet_url": "https://docs.google.com/spreadsheets/d/SHEET_ID/edit",
                "ngrok_monitor_interval_seconds": 1800,
            },
        )

        self.assertIn("FALO IM Watch 開發控制台 v1.01", html)
        self.assertIn("/ngrok-status", html)
        self.assertIn("gasExecUrl", html)
        self.assertIn("Google Sheet", html)
        self.assertIn("Falo x Force Cheng", html)
        self.assertIn("noindex", html)

    def test_latest_ngrok_status_reads_cached_jsonl(self):
        with tempfile.TemporaryDirectory() as tmp:
            output_dir = Path(tmp)
            bot.append_jsonl(
                output_dir / "ngrok_status.jsonl",
                {
                    "ok": True,
                    "checked_at": "2026-06-20T14:00:00+08:00",
                    "public_urls": ["https://demo.ngrok-free.app"],
                },
            )

            status = bot.latest_ngrok_status(output_dir, "http://127.0.0.1:1/api/tunnels")

            self.assertTrue(status["ok"])
            self.assertTrue(status["from_cache"])
            self.assertEqual(status["public_urls"][0], "https://demo.ngrok-free.app")

    def test_get_chat_dir_for_line_export(self):
        output_dir = Path("/tmp/out")
        normalized = {
            "source": {"type": "line_export"},
            "source_key": "my-chat-room"
        }
        chat_dir = bot.get_chat_dir(output_dir, normalized)
        self.assertEqual(chat_dir, output_dir / "chats" / "imported" / "my-chat-room")

    def test_get_chat_dir_for_multi_bot(self):
        output_dir = Path("/tmp/out")
        normalized = {
            "source": {"type": "group", "key": "G123"},
            "bot": {"alias": "Assistant-A"}
        }
        chat_dir = bot.get_chat_dir(output_dir, normalized)
        self.assertEqual(chat_dir, output_dir / "chats" / "assistant-a" / "group_g123")

    def test_scan_chat_sources_and_km_files_empty(self):
        with tempfile.TemporaryDirectory() as tmp:
            output_dir = Path(tmp)
            sources = bot.scan_chat_sources(output_dir)
            self.assertEqual(sources, [])
            
            km_files = bot.scan_km_files(output_dir)
            self.assertEqual(km_files, [])


if __name__ == "__main__":
    unittest.main()
