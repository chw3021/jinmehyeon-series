# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

root = Path(r"c:\Users\chw3021\jinmehyeon-series")
data = json.loads((root / "content" / "volume-1.json").read_text(encoding="utf-8"))


def parse_body(text: str):
    text = text.strip()
    # drop leading title line if present
    lines = text.splitlines()
    if lines and (lines[0].startswith("3장") or lines[0].startswith("4장") or lines[0].startswith("5장") or lines[0].startswith("#")):
        # for append file starting with #, skip comment header lines until blank then content
        if lines[0].startswith("#"):
            # skip until first blank after header
            i = 0
            while i < len(lines) and lines[i].startswith("#"):
                i += 1
            while i < len(lines) and not lines[i].strip():
                i += 1
            body = "\n".join(lines[i:]).strip()
            return [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
        body = "\n".join(lines[1:]).strip()
    else:
        body = text
    return [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]


def parse_chapter(path: Path):
    text = path.read_text(encoding="utf-8").strip()
    lines = text.splitlines()
    title = lines[0].strip()
    body = "\n".join(lines[1:]).strip()
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    return title, paras


# append rescue scenes to ch2
append_paras = parse_body((root / "content" / "drafts" / "ch2_append.txt").read_text(encoding="utf-8"))
ch2 = data["chapters"][1]
# avoid double-append
if not any("첫 집행은 그래서 악의에서 시작됐다." in p for p in ch2["paragraphs"]):
    ch2["paragraphs"].extend(append_paras)

title3, paras3 = parse_chapter(root / "content" / "drafts" / "ch3.txt")
title4, paras4 = parse_chapter(root / "content" / "drafts" / "ch4.txt")
title5, paras5 = parse_chapter(root / "content" / "drafts" / "ch5.txt")

data["chapters"][2] = {"id": 3, "slug": "ch3", "title": title3, "paragraphs": paras3}
data["chapters"][3] = {"id": 4, "slug": "ch4", "title": title4, "paragraphs": paras4}
data["chapters"][4] = {"id": 5, "slug": "ch5", "title": title5, "paragraphs": paras5}

data["synopsis"] = (
    "약함을 숨기려 했던 차현욱의 몸 안에서 진메현이 눈을 뜬다. "
    "사람을 방패로 쓰는 적 앞에서, 붉은 그림자와 같은 발밑을 찾는다."
)

blob = json.dumps(data, ensure_ascii=False)
for bad in ["합일", "권태감", "초대장", "영포티", "공포탄"]:
    print(bad, blob.count(bad))
print("발경", blob.count("발경"))
print("실탄", blob.count("실탄"))
print("ch2", len(ch2["paragraphs"]), "ch3", len(paras3), "ch4", len(paras4), "ch5", len(paras5))

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
