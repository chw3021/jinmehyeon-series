# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

root = Path(r"c:\Users\chw3021\jinmehyeon-series")
data = json.loads((root / "content" / "volume-1.json").read_text(encoding="utf-8"))


def parse_chapter(path: Path):
    text = path.read_text(encoding="utf-8").strip()
    lines = text.splitlines()
    title = lines[0].strip()
    body = "\n".join(lines[1:]).strip()
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    return title, paras


# --- ch2 ---
ch2 = data["chapters"][1]
new2 = []
for p in ch2["paragraphs"]:
    if "발음이 권태감과" in p:
        continue
    if "영포티" in p:
        p = p.replace("사람들이 말하는 그 영포티, 꽃중년이라는 말이 딱 붙는 인상.  \n", "")
        p = p.replace("사람들이 말하는 그 영포티, 꽃중년이라는 말이 딱 붙는 인상.\n", "")
    new2.append(p)
data["chapters"][1]["paragraphs"] = new2

# --- ch3 draft cleanup ---
ch3_path = root / "content" / "drafts" / "ch3.txt"
ch3_text = ch3_path.read_text(encoding="utf-8")
ch3_text = ch3_text.replace(
    "“그리고 내 이름.”  \n“권태강.”  \n“네가 붙인 거암세니 뭐니 하는 유치한 이름들 사이에서, 내 이름은 사실 더 솔직하거든.”\n\n",
    "",
)
ch3_text = ch3_text.replace("“권태감.”\n\n", "")
ch3_text = ch3_text.replace("그 세 글자가 뼈 사이로 스며들었다.\n\n", "")
ch3_text = ch3_text.replace(
    "“그냥 권태를 분노로 포장한 거야.”",
    "“그냥 지친 마음을 분노로 포장한 거야.”",
)
ch3_text = ch3_text.replace(
    "그냥, 권태감을 심어 놓고 보내줬다.",
    "그냥, 싸울 이유부터 비워 놓고 보내줬다.",
)
ch3_path.write_text(ch3_text, encoding="utf-8")
title3, paras3 = parse_chapter(ch3_path)
data["chapters"][2] = {"id": 3, "slug": "ch3", "title": title3, "paragraphs": paras3}

# --- ch4 draft cleanup ---
ch4_path = root / "content" / "drafts" / "ch4.txt"
ch4_text = ch4_path.read_text(encoding="utf-8")
ch4_text = ch4_text.replace(
    "분노가 방향을 잃은 채로, 권태감 속에 빠져 있었다.",
    "분노가 방향을 잃은 채로, 허공에 걸려 있었다.",
)
ch4_text = ch4_text.replace("권태.  \n피곤함.", "지치는 감각.  \n아무것도 하기 싫어지는 감각.")
ch4_text = ch4_text.replace("나를 권태로 접었다고 생각했겠지.", "나를 접어버렸다고 생각했겠지.")
ch4_text = ch4_text.replace(
    "초대장을 기다리지 않았다.  \n미끼를 물지도 않았다.",
    "미끼를 기다리지 않았다.  \n불러주길 바라지도 않았다.",
)
ch4_path.write_text(ch4_text, encoding="utf-8")
title4, paras4 = parse_chapter(ch4_path)
data["chapters"][3] = {"id": 4, "slug": "ch4", "title": title4, "paragraphs": paras4}

# --- ch5 ---
title5, paras5 = parse_chapter(root / "content" / "drafts" / "ch5.txt")
data["chapters"][4] = {"id": 5, "slug": "ch5", "title": title5, "paragraphs": paras5}

# --- epilogue ---
ep = data["chapters"][5]
new_ep = []
seen_empty = False
for p in ep["paragraphs"]:
    if "권태강이 심어 두려 했던 권태감도" in p:
        p = (
            "가끔은 아무것도 하기 싫은 날이 왔다.  \n"
            "그래도 이제는 그 공허를 진실처럼 믿지는 않았다.  \n"
            "그건 누가 심어둔 감기 같은 것이었고, 버틸 수 있는 것이었다."
        )
    if p.startswith("가끔은 아무것도 하기 싫은 날이 왔다"):
        if seen_empty:
            continue
        seen_empty = True
    new_ep.append(p)
data["chapters"][5]["paragraphs"] = new_ep

data["synopsis"] = (
    "약함을 숨기려 했던 차현욱의 몸 안에서 진메현이 눈을 뜬다. "
    "사람을 비워버리는 적 앞에서, 붉은 인격과 합일한다."
)

blob = json.dumps(data, ensure_ascii=False)
for bad in ["권태감", "초대장", "영포티", "초대도 안", "초대장을"]:
    print(f"{bad}: {blob.count(bad)}")

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
print("ch5 paras", len(paras5))
print("done")
