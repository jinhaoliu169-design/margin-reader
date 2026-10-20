"""Vercel entry point for the Margin Reader API.

The local server and Vercel use the same request handler so dictionary,
translation, book text, and article APIs stay in sync.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault("MARGIN_DATA_DIR", "/tmp/margin-data")
os.environ.setdefault("MARGIN_MULTIUSER", "1")

import server  # noqa: E402


class handler(server.LexiconHandler):
    """Vercel invokes this class for every /api/* request."""

