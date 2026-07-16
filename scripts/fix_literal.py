# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

root = Path(r"c:\Users\chw3021\jinmehyeon-series")
data = json.loads((root / "content" / "volume-1.json").read_text(encoding="utf-8"))

data["chapters"][2]["title"] = "3장. 붕괴"

reps = [
    ("그냥 권태를 분노로 포장한 거야.", "그냥 지친 마음을 분노로 포장한 거야."),
    ("허공에 떨어져 권태처럼 변해버린 감각.", "허공에 떨어져 꺼져버린 감각."),
]

for ch in data["chapters"]:
    fixed = []
    for p in ch["paragraphs"]:
        for a, b in reps:
            p = p.replace(a, b)
        fixed.append(p)
    ch["paragraphs"] = fixed

# also sync drafts
for name in ("ch3.txt", "ch4.txt"):
    path = root / "content" / "drafts" / name
    text = path.read_text(encoding="utf-8")
    if name == "ch3.txt":
        text = text.replace("3장. 권태", "3장. 붕괴", 1)
    for a, b in reps:
        text = text.replace(a, b)
    path.write_text(text, encoding="utf-8")

blob = json.dumps(data, ensure_ascii=False)
# allow 권태강 only; flag bare 권태 usages that aren't 권태강
bare = re.findall(r"권태(?!강)", blob)
print("bare 권태 hits:", bare)
for bad in ["권태감", "초대장", "영포티", "권태를", "권태처럼", "3장. 권태"]:
    print(bad, blob.count(bad))

(root / "content" / "volume-1.json").write_text(
    json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
)

src_lines = []
for ch in data["chapters"]:
    src_lines.append(ch["title"])
    src_lines.append("")
    for p in ch["paragraphs"]:
        src_lines.append(p)
        src_lines.append("")
    src_lines.append("")
full = "\n".join(src_lines).rstrip() + "\n"
Path(r"c:\Users\chw3021\Desktop\chw\진메현 시리즈\1. 진메현 라이징.txt").write_text(
    "\ufeff" + full, encoding="utf-8"
)
print("done")
