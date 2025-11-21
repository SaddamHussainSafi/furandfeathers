from pathlib import Path
text = Path("frontend/src/components/AIMatchmaking.jsx").read_text(encoding="utf-8")
start = text.index("  const POPUP_MESSAGES")
end = text.index("  ];", start) + 4
segment = text[start:end]
import json
print(json.dumps(segment))
