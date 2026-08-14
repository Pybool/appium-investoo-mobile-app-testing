import json
import os

LOG_FILE = os.path.join(os.path.dirname(__file__), "requests.jsonl")
ALLOWED_PREFIX = "https://expensive-niece-unethical.ngrok-free.dev"


def response(flow):
    if not flow.request.pretty_url.startswith(ALLOWED_PREFIX):
        return

    entry = {
        "method": flow.request.method,
        "url": flow.request.pretty_url,
        "path": flow.request.path.split("?")[0],
        "status": flow.response.status_code,
        "requestBody": flow.request.get_text(strict=False),
        "responseBody": flow.response.get_text(strict=False),
        "timestamp": flow.request.timestamp_start,
    }
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
