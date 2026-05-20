#!/usr/bin/env python3
"""Tiny local server for grill-with-html.

Serves grill.html and the current questions, and accepts posted answers so the
agent can pick them up automatically. Stdlib only.

  GET  /                -> grill.html
  GET  /questions.json  -> current questions (written by the agent)
  POST /responses       -> writes grill-responses.json (read by the agent)

Run from the directory holding grill.html. Files are read/written there.
"""
import datetime
import http.server
import json
import os
import shutil
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765

# Per-session cache: every round's questions + answers are archived here.
SESSION = os.path.join(
    DIR, "tmp", "session-" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
)
os.makedirs(SESSION, exist_ok=True)
_round = 0


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIR, **kw)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.path = "/grill.html"
        elif self.path.startswith("/questions.json"):
            return self._serve_questions()
        return super().do_GET()

    def _serve_questions(self):
        path = os.path.join(DIR, "grill-questions.json")
        if not os.path.exists(path):
            self.send_error(404, "no questions yet")
            return
        with open(path, "rb") as f:
            body = f.read()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/responses":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            self.send_error(400, "invalid JSON")
            return
        # Canonical file the agent's Monitor watches.
        out = os.path.join(DIR, "grill-responses.json")
        with open(out, "w") as f:
            json.dump(data, f, indent=2)

        # Archive this round (questions + answers) into the session cache.
        global _round
        _round += 1
        questions = os.path.join(DIR, "grill-questions.json")
        if os.path.exists(questions):
            shutil.copy(questions, os.path.join(SESSION, f"round-{_round}-questions.json"))
        with open(os.path.join(SESSION, f"round-{_round}-responses.json"), "w") as f:
            json.dump(data, f, indent=2)

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def log_message(self, *a):
        pass  # quiet


if __name__ == "__main__":
    print(f"grill server on http://localhost:{PORT} (serving {DIR})")
    print(f"session cache: {SESSION}")
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
