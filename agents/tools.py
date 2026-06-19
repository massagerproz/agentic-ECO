"""Tools for agents: ERPNext, Beancount, OCR stubs."""

import os
from typing import Any


class ERPNextClient:
    """ERPNext API client stub."""

    def __init__(self, base_url: str = None, api_key: str = None):
        self.base_url = base_url or os.getenv("ERPNEXT_URL", "")
        self.api_key = api_key or os.getenv("ERPNEXT_KEY", "")

    def get(self, endpoint: str) -> Any:
        return {"status": "stub", "endpoint": endpoint}


class BeancountLedger:
    """Beancount ledger read/append stub."""

    def __init__(self, path: str = "books.beancount"):
        self.path = path

    def read(self) -> str:
        return ""

    def append(self, entry: str) -> bool:
        return True


class OCRClient:
    """OCR/extraction stub."""

    def extract(self, image_path: str) -> dict:
        return {"text": "", "amount": 0.0}
