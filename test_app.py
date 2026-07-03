import unittest
import urllib.request
import urllib.parse
import json
import http.cookiejar
import threading
import time
from pathlib import Path
from http.server import ThreadingHTTPServer

import app

class TestAppUnifiedServer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Run server in a background thread on port 8089
        cls.server_address = ("127.0.0.1", 8089)
        cls.httpd = ThreadingHTTPServer(cls.server_address, app.AppHandler)
        cls.server_thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.server_thread.start()
        # Give server a moment to start
        time.sleep(0.5)

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.server_thread.join()

    def test_health_endpoint(self):
        url = "http://127.0.0.1:8089/health"
        with urllib.request.urlopen(url, timeout=5) as res:
            self.assertEqual(res.getcode(), 200)
            data = json.loads(res.read().decode("utf-8"))
            self.assertTrue(data["ok"])
            self.assertEqual(data["service"], "attn-im-unified")

    def test_auth_and_login_flow(self):
        # 1. Unauthenticated request to / redirects to /login (303 -> 200 due to follow redirects)
        # Using a custom opener that doesn't follow redirects to check the 303 status
        class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, hdrs, newurl):
                return None

        opener = urllib.request.build_opener(NoRedirectHandler)
        req = urllib.request.Request("http://127.0.0.1:8089/")
        try:
            res = opener.open(req, timeout=5)
            self.assertEqual(res.getcode(), 303)
            self.assertIn("/portal", res.headers.get("Location", ""))
        except urllib.error.HTTPError as e:
            if e.code == 303:
                self.assertIn("/portal", e.headers.get("Location", ""))
            else:
                raise e

        # 2. Login POST request with incorrect credentials returns 401
        login_url = "http://127.0.0.1:8089/login"
        login_data_bad = urllib.parse.urlencode({"username": "admin", "password": "wrongpassword"}).encode("utf-8")
        req_bad = urllib.request.Request(login_url, data=login_data_bad, method="POST")
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            urllib.request.urlopen(req_bad, timeout=5)
        self.assertEqual(ctx.exception.code, 401)

        # 3. Login POST request with correct credentials redirects and sets session cookie
        login_data_good = urllib.parse.urlencode({"username": "admin", "password": "666666"}).encode("utf-8")
        cookie_jar = http.cookiejar.CookieJar()
        cookie_handler = urllib.request.HTTPCookieProcessor(cookie_jar)
        good_opener = urllib.request.build_opener(cookie_handler)
        
        req_good = urllib.request.Request(login_url, data=login_data_good, method="POST")
        res_good = good_opener.open(req_good, timeout=5)
        self.assertEqual(res_good.getcode(), 200) # followed redirect to /
        
        # Verify cookie is set
        session_cookie = None
        for cookie in cookie_jar:
            if cookie.name == "falo_session":
                session_cookie = cookie.value
        self.assertEqual(session_cookie, "admin_ok")

    def test_export_and_download_flow(self):
        # 1. Prepare dummy chat data
        chat_dir = app.CHATS_OUTPUT_DIR / "default" / "group_test"
        chat_dir.mkdir(parents=True, exist_ok=True)
        (chat_dir / "manifest.json").write_text(json.dumps({
            "chat_name": "Test Group",
            "source_type": "group",
            "source_key": "test_group"
        }), encoding="utf-8")
        
        # Write dummy event
        app.append_jsonl(chat_dir / "events.jsonl", {
            "captured_at": "2026-06-25T12:00:00+08:00",
            "line_timestamp": 1781931909000,
            "text": "hello test message",
            "sender_name_hint": "Force"
        })

        # 2. Login to get session cookie
        login_url = "http://127.0.0.1:8089/login"
        login_data = urllib.parse.urlencode({"username": "admin", "password": "666666"}).encode("utf-8")
        cookie_jar = http.cookiejar.CookieJar()
        cookie_handler = urllib.request.HTTPCookieProcessor(cookie_jar)
        opener = urllib.request.build_opener(cookie_handler)
        opener.open(login_url, data=login_data, timeout=5)

        # 3. Request /api/export_notebooklm
        export_url = "http://127.0.0.1:8089/api/export_notebooklm"
        export_payload = {
            "sources": ["default/group_test"],
            "partition_type": "day",
            "export_format": "log"
        }
        req_exp = urllib.request.Request(export_url, data=json.dumps(export_payload).encode("utf-8"), method="POST")
        req_exp.add_header("Content-Type", "application/json")
        res_exp = opener.open(req_exp, timeout=5)
        
        self.assertEqual(res_exp.getcode(), 200)
        res_data = json.loads(res_exp.read().decode("utf-8"))
        self.assertTrue(res_data["ok"])
        self.assertEqual(len(res_data["files"]), 1)
        self.assertEqual(res_data["files"][0]["file_name"], "2026-06-25-log.md")
        
        # 4. Download the generated file via GET /exports/day/2026-06-25-log.md
        download_url = f"http://127.0.0.1:8089{res_data['files'][0]['file_path']}"
        res_dl = opener.open(download_url, timeout=5)
        self.assertEqual(res_dl.getcode(), 200)
        self.assertEqual(res_dl.headers.get("Content-Type"), "text/plain; charset=utf-8")
        content = res_dl.read().decode("utf-8")
        self.assertIn("hello test message", content)
        self.assertIn("Test Group", content)

        # 5. Access the view-chat endpoint /view-chat?id=default/group_test
        view_chat_url = "http://127.0.0.1:8089/view-chat?id=default/group_test"
        res_view = opener.open(view_chat_url, timeout=5)
        self.assertEqual(res_view.getcode(), 200)
        self.assertIn("text/html", res_view.headers.get("Content-Type"))
        view_content = res_view.read().decode("utf-8")
        self.assertIn("hello test message", view_content)
        self.assertIn("Test Group", view_content)

        # 6. Test media endpoint /media/default/group_test/non_exist.jpg returns 404
        media_url = "http://127.0.0.1:8089/media/default/group_test/non_exist.jpg"
        with self.assertRaises(urllib.error.HTTPError) as ctx:
            opener.open(media_url, timeout=5)
        self.assertEqual(ctx.exception.code, 404)

        # 7. Access the /api/chat-events?id=default/group_test endpoint and verify JSON events list
        events_url = "http://127.0.0.1:8089/api/chat-events?id=default/group_test"
        res_events = opener.open(events_url, timeout=5)
        self.assertEqual(res_events.getcode(), 200)
        self.assertIn("application/json", res_events.headers.get("Content-Type"))
        events_data = json.loads(res_events.read().decode("utf-8"))
        self.assertTrue(events_data["ok"])
        self.assertGreater(len(events_data["events"]), 0)
        self.assertEqual(events_data["events"][0]["text"], "hello test message")

    def test_safe_slug(self):
        self.assertEqual(app.safe_slug("My Chat Room!!!"), "my-chat-room")
        self.assertEqual(app.safe_slug("hello__world"), "hello-world")

if __name__ == "__main__":
    unittest.main()
