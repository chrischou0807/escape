#!/usr/bin/env python3
"""把 src/games_*.js 裡的每個機關套進 shell.html，輸出成 out/<編號>-<slug>/index.html。"""
import re, sys, pathlib, json
src = pathlib.Path(__file__).parent
out = src.parent / "out"
shell = (src / "shell.html").read_text(encoding="utf-8")
games = []
for f in sorted(src.glob("games_*.js")):
    for chunk in f.read_text(encoding="utf-8").split("//==GAME==")[1:]:
        body = chunk.strip().rstrip(";")
        no = re.search(r"no:\s*'(\d+)'", body).group(1)
        slug = re.search(r"slug:\s*'([\w-]+)'", body).group(1)
        title = re.search(r"title:\s*'([^']+)'", body).group(1)
        typ = re.search(r"type:\s*'([^']+)'", body).group(1)
        html = shell.replace("__NO__", no).replace("__TITLE__", title).replace("__GAME__", body)
        d = out / f"{no}-{slug}"
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(html, encoding="utf-8")
        games.append({"no": no, "slug": slug, "title": title, "type": typ})
(out / "games.json").write_text(json.dumps(games, ensure_ascii=False, indent=1), encoding="utf-8")
rows = "".join(f'<a href="{g["no"]}-{g["slug"]}/">No.{g["no"]}　{g["type"]}　{g["title"]}</a>' for g in games)
(out / "index.html").write_text('<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>機關範例 101–139</title><style>body{margin:0;padding:24px 16px;background:#1c2128;color:#e7e3da;font-family:"PingFang TC","Microsoft JhengHei",sans-serif}h1{font-size:20px;color:#d9b878}a{display:block;max-width:520px;margin:8px auto;padding:13px 16px;border-radius:11px;background:#2a3139;color:#e7e3da;text-decoration:none;border:1px solid rgba(255,255,255,.08)}h1,p{max-width:520px;margin:8px auto}p{color:#9aa1a9;font-size:13px}</style></head><body><h1>機關範例 101–139</h1><p>第十批新增 39 款。每款是獨立的單檔網頁；長按右上角齒輪進後台（預設密碼 9633）。</p>' + rows + '</body></html>', encoding="utf-8")
print(len(games), "games built")
