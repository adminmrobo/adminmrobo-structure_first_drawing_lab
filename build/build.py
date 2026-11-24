# -*- coding: utf-8 -*-
"""구조 먼저 보는 캐릭터 그리기 연구실 — 페이지 빌드.
python3 build/build.py 로 index.html, 01~06 페이지, practice/index.html 을 다시 만든다.
그림 파일(assets/img/{키}.webp)이 있으면 넣고, 없으면 '그림 준비 중' 자리만 둔다."""
import json, os, html, sys
sys.path.insert(0, os.path.dirname(__file__))
from content_a import P1, P2, P3
from content_b import P4, P5, P6, STYLES
from content_try import TRY
from content_ex import EX
import re as _re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VER = "v1.0"
DATE = "2026-11-22"
SITE = "https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/"
REPO = "https://github.com/adminmrobo/adminmrobo-structure_first_drawing_lab"
AUTHOR_URL = "https://adminmrobo.github.io/who_am_i/who_am_i.html"
RENDER = "https://adminmrobo.github.io/ai_rendering/"
FISH = "https://adminmrobo.github.io/unsupervised_fish_lab/"
CHARREPO = "https://github.com/adminmrobo/fruitfly-lab-expressions"
SERIES = "구조 먼저 보는 캐릭터 그리기 연구실"
E = html.escape
PARTS = [P1, P2, P3, P4, P5, P6]

CH = {
 "doctor": ("박사", "해설. 단계마다 현장 질문으로 열고 해석 문장으로 닫는다"),
 "haru": ("조수 하루", "모델(1·4부) + 수식 상자 담당. 어려운 식을 대신 묻는다"),
 "sia": ("시아", "인턴1 · 모델(2부). 검은 메이드복이라 빛 실험에 딱 맞다"),
 "moa": ("모아", "인턴2 · 모델(3부). 카디건 주름의 주인공"),
 "jupanbot": ("주판봇", "화가 A. 성급하게 결과부터 그린다 — 흔한 실수 담당"),
 "fruitfly": ("초파리 연구원", "화가 B. 구조부터 의심한다. \"이걸 눌러 봐\""),
 "x1": ("X1", "평가단. 닮음을 본다"),
 "x2": ("X2", "평가단. 입체감을 본다"),
 "x3": ("X3", "평가단. 자연스러움을 본다"),
}
COLOR = {"doctor": "doc", "haru": "asst", "fruitfly": "fly", "jupanbot": "robo", "sia": "sia", "moa": "moa", "x1": "x", "x2": "x", "x3": "x"}

def face(k, e="e13", pre="", cls=""):
    n = CH[k][0]
    return f'<img src="{pre}assets/chars/{k}_{e}.webp" alt="{E(n)}" width="96" height="96" loading="lazy"{(" class=%s" % cls) if cls else ""}>'

def has_img(key):
    return os.path.exists(os.path.join(ROOT, "assets", "img", key + ".webp"))

def art(key, alt, ar="16/9", cap=None, pre="", cls=""):
    cap_html = f"<figcaption>{E(cap)}</figcaption>" if cap else ""
    if has_img(key):
        return f'<figure class="art {cls}" data-img="{key}"><img src="{pre}assets/img/{key}.webp" alt="{E(alt)}" loading="lazy" decoding="async">{cap_html}</figure>'
    return (f'<figure class="art {cls}" data-img="{key}"><div class="ph-art" style="--ar:{ar}" role="img" aria-label="{E(alt)}">'
            f'<b>그림 준비 중 · {key}</b><span>{E(alt)}</span></div>{cap_html}</figure>')

def head(title, desc, og, path, pre=""):
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:type" content="article"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{SITE}assets/og/{og}"><meta property="og:url" content="{SITE}{path}"><meta name="twitter:card" content="summary_large_image">
<meta name="author" content="안상선">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{pre}assets/lab.css">
</head>
<body data-root="{pre}">
<div id="prog"></div>
"""

def nav(links, pre=""):
    a = "".join(f'<a href="{h}">{E(t)}</a>' for h, t in links)
    return f'<nav class="top"><div class="row"><a class="logo" href="{pre}index.html">구조 먼저 <i>그리기 연구실</i></a><div class="links">{a}</div></div></nav>\n'

def cover(key, cap, cast, pre=""):
    if has_img(key):
        return f'<div class="cover"><div class="frame" data-img="{key}"><img class="art" src="{pre}assets/img/{key}.webp" alt="{E(cap)}" width="1600" height="900" fetchpriority="high" decoding="async"></div></div>\n'
    # 그림이 오기 전 픽셀 대체 표지: 네모 격자 + 상자·원기둥 마네킹(픽셀 블록) + 픽셀 캐릭터
    cells = []
    for x in range(0, 1600, 40):
        for y in range(0, 900, 40):
            if (x // 40 + y // 40) % 2 == 0:
                cells.append(f'<rect x="{x}" y="{y}" width="40" height="40" fill="#f3f6fa"/>')
    blocks = [(1180, 140, 80, 100, "#c9d3e6"), (1200, 240, 40, 30, "#d8dfeb"), (1150, 270, 140, 140, "#b9c6df"), (1160, 410, 120, 90, "#a9b8d6"),
              (1110, 280, 40, 120, "#cdd6e8"), (1290, 280, 40, 120, "#cdd6e8"), (1100, 400, 40, 100, "#dfe5ef"), (1300, 400, 40, 100, "#dfe5ef"),
              (1170, 500, 50, 170, "#b9c6df"), (1230, 500, 50, 170, "#b9c6df"), (1170, 670, 50, 130, "#a9b8d6"), (1230, 670, 50, 130, "#a9b8d6")]
    bl = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}" stroke="#1e2f6e" stroke-width="6"/>' for x, y, w, h, c in blocks)
    easel = '<rect x="240" y="180" width="300" height="380" fill="#ffffff" stroke="#8a5a2b" stroke-width="12"/><rect x="270" y="560" width="20" height="260" fill="#8a5a2b"/><rect x="490" y="560" width="20" height="260" fill="#8a5a2b"/>' + \
            "".join(f'<rect x="{300+i*40}" y="{240+j*40}" width="40" height="40" fill="{c}"/>' for i, j, c in [(1,0,"#e9909a"),(2,0,"#e9909a"),(1,1,"#f6d3b8"),(2,1,"#f6d3b8"),(0,2,"#a99ac8"),(1,2,"#a99ac8"),(2,2,"#a99ac8"),(3,2,"#a99ac8"),(1,3,"#fbfbfd"),(2,3,"#fbfbfd"),(1,4,"#5b7fb8"),(2,4,"#5b7fb8")])
    imgs = "".join(face(k, e, pre) for k, e in cast)
    return f"""<div class="cover"><div class="frame" data-img="{key}"><svg class="grid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" shape-rendering="crispEdges">{''.join(cells)}{easel}{bl}</svg>
<span class="cap">{E(cap)}</span><span class="badge">표지 그림 준비 중 · {key}</span><div class="cast" style="image-rendering:pixelated">{imgs}</div></div></div>
"""

def three(a, b, c, abbr):
    dl = "".join(f"<dt>{E(x)}</dt><dd>{E(y)}</dd>" for x, y in abbr)
    return f"""<div class="three"><h2>처음 오신 분께 — 세 줄로 먼저 보기</h2><ul>
<li><b>무엇을</b>: {E(a)}</li><li><b>왜 중요한가</b>: {E(b)}</li><li><b>작업에서는</b>: {E(c)}</li></ul>
<p>그림 실력·코드·수식을 몰라도 됩니다. 실험을 눌러 보며 따라오세요.</p>
<details class="abbr"><summary>낱말·약어 풀이 (펼치기)</summary><dl>{dl}</dl></details></div>\n"""

ABBR = [("접점", "천이 몸에 걸리거나 붙잡힌 곳"), ("입체 그림자", "빛을 등진 면에 생기는 그림자(陰)"), ("떨어지는 그림자", "다른 물체가 빛을 가려 생기는 그림자(影)"),
        ("섬 그림자", "선에 붙지 않고 떠 있는 작은 그림자(애니 채색 용어)"), ("로폴리곤", "면 수가 적은 거친 3D 모형"), ("렌더 패스(층)", "VFX에서 빛·그림자 종류별로 따로 계산한 그림"),
        ("VFX", "영화·영상의 시각 효과(Visual Effects)"), ("잠재공간", "AI가 그림을 점으로 놓는 작은 지도"), ("확산 모델", "잡음을 조금씩 걷어 내며 그림을 만드는 AI"),
        ("CFG(안내 강도)", "프롬프트를 얼마나 세게 따를지 정하는 값"), ("img2img 강도", "원본 그림을 얼마나 다시 그릴지 정하는 값"), ("프롬프트", "AI에게 주는 글 지시문")]

def talk(lines, pre=""):
    out = []
    for k, e, t in lines:
        side = " r" if k in ("moa", "sia") else ""
        out.append(f'<div class="line{side}">{face(k, e, pre)}<div class="bub"><b style="color:var(--c-{COLOR[k]})">{E(CH[k][0])}</b>{E(t)}</div></div>')
    return '<div class="talk">' + "".join(out) + "</div>"

def quiz(q, opts, ans, ok, no):
    b = "".join(f'<button type="button">{E(o)}</button>' for o in opts)
    return f'<div class="quiz" data-ans="{ans}"><div class="qq">확인 퀴즈 — {E(q)}</div><div class="opts">{b}</div><div class="fb" aria-live="polite"></div><span class="qok" hidden>{E(ok)}</span><span class="qno" hidden>{E(no)}</span></div>'

def panel(no, i, p):
    return (f'<div class="panel"><div class="ph"><b>실험 {no}-{i}</b><small>{E(p["note"])}</small></div>'
            f'<div id="pp-{p["key"]}" data-panel="{p["key"]}"></div><div class="ctrl">{p["ctrl"]}</div><div class="readout" aria-live="polite"></div></div>')

def mathbox(m):
    tries = "".join(f"<div>{E(t)}</div>" for t in m["tries"])
    pcs = "".join(f"<tr><td class='m'>{E(a)}</td><td>{E(b)}</td></tr>" for a, b in m["pieces"])
    return f"""<div class="box mathbox"><h4>수학 수식을 어려워하는 조수가 대신 물어봅니다</h4>
<div class="q">{face('haru','e04')}<div><b>조수</b> {E(m['ask'])}</div></div>
<div class="easy"><b>말로 하면</b> — {E(m['words'])}</div>
<p><b>학교 수학으로 보면</b> — {E(m['school'])}</p>
<div class="fx">{E(m['formula'])}</div>
<table><thead><tr><th>식 조각</th><th>뜻</th></tr></thead><tbody>{pcs}</tbody></table>
<div class="try"><b>숫자로 한 번 해 보기</b>{tries}</div>
<div class="q">{face('haru','e16')}<div><b>조수</b> {E(m['comment'])}</div></div></div>"""

def gallery():
    rows = []
    for who, nm in [("haru", "하루"), ("sia", "시아"), ("moa", "모아")]:
        cells = "".join(art(f"p5_{who}_{st}", f"{nm}의 {sn} 전신 — 같은 자세, 왼쪽 위 빛", "2/3", sn) for st, sn in STYLES)
        rows.append(f'<h4 style="margin:14px 0 6px">{nm}</h4><div class="artrow">{cells}</div>')
    return '<div class="box" style="background:#fff">' + "".join(rows) + '<p class="hint" style="margin-top:8px">실사풍은 이 캐릭터를 코스프레한 가상의 성인 모델 사진으로 만든 것입니다. 실존 인물이 아닙니다.</p></div>'

EXAMPLE_PROMPT = """Full body character illustration, vertical 2:3.
High-quality anime illustration, clean confident lineart, two-tone cel shading with soft highlights, natural proportions of a young adult woman in her early twenties.
Character (match the attached reference sheet exactly): Haru, a cheerful lab assistant, long straight pink hair reaching the waist with navy blue streaks, including a thick navy streak down the center of the bangs, two round slightly messy hair buns on top of the head, a small ahoge, big bright blue eyes, lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up blue jeans, lavender sneakers. Modest outfit exactly as described.
Pose: standing upright in a three-quarter view turned slightly to the right, left arm relaxed at her side, right hand resting on her hip.
Lighting: soft daylight from the upper left, form shadows on the right side of the body, a soft cast shadow on the floor toward the lower right.
Background: plain off-white studio background.
No text, no letters, no logos, no watermark, no revealing clothing, not resembling any famous anime character, no pixel art."""

def step(P, i, s):
    no = P["no"]
    labels = ["무엇이 문제인가", "그냥 하면 막히는 곳", "그래서 이렇게"]
    why = "".join(f"<li><b>{labels[k]}</b> — {E(x)}</li>" for k, x in enumerate(s["why"]))
    whybox = f'<div class="box why"><h4>왜 이 방법을 쓰나</h4><ol>{why}</ol><div class="easy"><b>쉽게 말하면</b> — {E(s["easy"])}</div></div>'
    calm = talk([("doctor", "e08", "여기서 한 번 멈춰도 괜찮아요. 식이 낯설면 건너뛰고 아래 실험부터 눌러 보세요. 숫자는 실험이 대신 계산해 줍니다.")])
    duo = f'<div class="duo">{whybox}{mathbox(s["math"])}</div>{calm}' if s.get("math") else f'<div style="margin:16px 0">{whybox}</div>'
    solve = "".join(f"<p>{E(x)}</p>" for x in s["solve"])
    extra = ""
    if s.get("gallery"):
        extra += gallery()
    if s.get("prompts"):
        extra += f'<div class="promptbox"><b>예시 — 이 시리즈의 그림 요청문(하루, 애니풍 기준 전신)</b><p class="hint">고정값 → 자세 → 빛(그림자 방향까지) → 화풍 → 금지 순서입니다.</p><pre>{E(EXAMPLE_PROMPT)}</pre></div>'
    img = art(s["img"][0], s["img"][1], s["img"][2], s["img"][1], cls="tall" if s["img"][2] == "2/3" else "") if s.get("img") else ""
    q = s["quiz"]
    return f"""<section class="room" id="{s['id']}"><div class="wrap">
<div class="roomno">{no}부 · {i}단계</div>
<h2>{E(s['title'])}</h2><p class="muted">{E(s['sub'])}</p>
<div class="tags"><span class="tag how">{E(s['how'])}</span><span class="tag day">{E(s['day'])}</span></div>
{duo}
<div class="pair"><div class="box"><h4>일상으로 치면</h4><p>{E(s['daily'])}</p></div><div class="box ml"><h4>그림·VFX 현장에서는</h4><p>{E(s['field'])}</p></div></div>
{talk(s['talk'])}
{panel(no, i, s['panel'])}
<div class="solve"><h4>풀이</h4>{solve}</div>
{extra}{img}
<div class="solve"><h4>AI 판단 코너 — 그대로 믿어도 될까?</h4><p>{E(s['ai'][0])}</p><details class="code"><summary>확인해 보기</summary><p>{E(s['ai'][1])}</p></details></div>
<div class="limit"><b>이 단계가 다루지 않은 것</b> — {E(s['limit'])}</div>
{quiz(q[0], q[1], q[2], q[3], q[4])}
</div></section>
"""

def tryit(no, pre=""):
    T = TRY.get(no)
    if not T: return ""
    steps = ""
    for st in T["steps"]:
        steps += (f'<div class="trystep"><h3>{E(st["label"])}</h3><p>{E(st["note"])} <span class="chip">첨부: {E(st["attach"])}</span></p>'
                  f'<div class="trygrid{" wide" if st["ar"]=="16/9" else ""}">{art(st["key"], st["alt"], st["ar"], "이 프롬프트로 실제로 만든 첫 결과", pre=pre, cls="tall" if st["ar"]=="2/3" else "")}<div>'
                  + (f'<div class="box" style="margin:0 0 10px"><span class="chip">결과 점검</span>{E(st["result"])}</div>' if st.get("result") and has_img(st["key"]) else "")
                  + f'<div class="promptbox" style="margin:0"><b>프롬프트 (영어로 넣습니다)</b><pre>{E(st["prompt"])}</pre><button type="button" class="btn copybtn">복사하기</button> <span class="hint"></span></div></div></div></div>')
    checks = "".join(f'<li><label><input type="checkbox"> {E(c)}</label></li>' for c in T["check"])
    return f"""<section class="room" id="try"><div class="wrap"><div class="roomno">{no}부 · 직접 만들어 보기</div>
<h2>프롬프트로 직접 만들어 보기 — {E(T['title'])}</h2><p class="muted">{E(T['goal'])}</p>
<div class="box"><b>준비물</b> — 그림 생성 도구 하나(이 시리즈는 Genspark로 만들었습니다)와 캐릭터 설정 시트(<a href="{CHARREPO}">fruitfly-lab-expressions</a>의 refs 폴더). <b>순서</b> — 프롬프트 복사 → 설정 시트 첨부 → 생성 → 아래 점검표로 확인.</div>
{talk([("doctor","e08","결과 그림은 이 문장을 실제로 넣어 나온 첫 결과다. 같은 문장이라도 여러분이 만든 결과는 조금씩 다를 수 있다. 다르게 나오면 점검표로 어디가 다른지 찾아보자."),("jupanbot","e16","복사해서 붙이기만 하면 되니 이번엔 제가 제일 빠르겠군요!")], pre)}
{steps}
<div class="panel trycheck"><div class="ph"><b>점검표</b><small>내가 만든 그림을 보며 맞는 항목에 표시하세요</small></div><ul class="missions" style="list-style:none;padding:0">{checks}</ul><div class="readout" aria-live="polite"></div></div>
<div class="limit"><b>알아 둘 점</b> — {E(T['tip'])}</div>
</div></section>
"""

def exercises(no, pre=""):
    L = EX.get(no)
    if not L: return ""
    md = lambda t: _re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", E(t))
    cards = ""
    for i, e in enumerate(L, 1):
        steps = "".join(f"<li>{md(x)}</li>" for x in e["steps"])
        exp = "".join(f"<li>{E(x)}</li>" for x in e["expect"])
        same = e["change"].startswith("Same image")
        kind = "바꿀 문장 (출발 그림에 이어서 넣습니다)" if same else "새 대화에 넣을 문장"
        cards += f"""<div class="failcard excard" id="ex{no}-{i}"><h3>연습 {no}-{i} · {E(e['title'])}</h3>
<p>{E(e['why'])}</p>
<div class="exgrid"><div><div class="artrow"{' style="grid-template-columns:1fr"' if e['ar']=='16/9' else ''}>{art(e['start'], '출발 그림 — 직접 만들어 보기에서 만든 그림', '2/3' if e['ar']=='2/3' else '16/9', '출발 그림', pre=pre)}{art(e['key'], e['alt'], e['ar'], '실제 결과 — 이 문장을 그대로 넣은 첫 결과', pre=pre)}</div></div>
<div><div class="promptbox" style="margin-top:0"><b>{kind}</b><pre>{E(e['change'])}</pre><button type="button" class="btn copybtn">복사하기</button> <span class="hint"></span><p class="hint" style="margin:8px 0 0"><b>이 문장의 뜻</b> — {E(e['ko'])}</p></div>
<h4>순서</h4><ol>{steps}</ol>
<h4>이렇게 보이면 성공</h4><ul>{exp}</ul>
{'<div class="limit" style="background:#f3f8ff;border-color:#9bb8e0"><b>실제로 해 보니</b> — '+E(e['actual'])+'</div>' if has_img(e['key']) and e.get('actual') else ''}
<div class="limit"><b>잘 안 될 때</b> — {md(e['trouble'])}</div>
<p><span class="chip">다시 볼 원리</span><a href="{e['link'][0]}">{E(e['link'][1])}</a></p></div></div></div>"""
    return f"""<section class="room" id="ex"><div class="wrap"><div class="roomno">{no}부 · 연습 과제</div>
<h2>연습 과제 — 원리 하나만 바꿔 보기</h2>
<p class="muted">'직접 만들어 보기'에서 나온 그림을 출발 그림으로 삼아, 문장 하나로 원리 하나만 바꿉니다. 한 번에 하나만 바꿔야 무엇 때문에 달라졌는지 알 수 있습니다. 오른쪽 그림은 같은 문장을 고치지 않고 넣어 얻은 첫 결과이며, 여러분의 결과는 조금씩 다를 수 있습니다. 예상과 달랐던 점도 '실제로 해 보니'에 그대로 적었습니다.</p>
{talk([("doctor","e07","한 번에 두 가지를 바꾸면 무엇 때문에 달라졌는지 알 수 없다. 바꿀 문장은 하나만 넣자."),("fruitfly","e09","결과가 예상과 다르면 그게 더 좋은 공부야. 어디가 다른지 점검표로 찾아봐.")], pre)}
{cards}</div></section>
"""

def judge(J):
    rows = ""
    for idx, item in enumerate(J["items"]):
        a, b = J["a"][1][idx], J["b"][1][idx]
        mx = 8 if "8개" in item else 10
        rows += f'<span>{E(item)}</span><span class="bar" title="{J["a"][0]} {a}"><i style="width:{a/mx*100:.0f}%"></i></span><span class="bar" title="{J["b"][0]} {b}"><i style="width:{b/mx*100:.0f}%;background:var(--teal)"></i></span>'
    sa, sb = sum(J["a"][1]), sum(J["b"][1])
    tbl = "".join(f"<tr><td>{E(it)}</td><td>{J['a'][1][k]}</td><td>{J['b'][1][k]}</td></tr>" for k, it in enumerate(J["items"]))
    return f"""<section class="room" id="judge"><div class="wrap"><div class="roomno">평가단 채점</div><h2>{E(J['title'])}</h2>
{talk(J['setup'])}
<div class="judge"><h4>평가단 X1·X2·X3이 매긴 점수</h4>
<div class="score"><span></span><b>{E(J['a'][0])}</b><b>{E(J['b'][0])}</b>{rows}</div>
<div class="tbl" style="margin-top:10px"><table><thead><tr><th>항목</th><th>{E(J['a'][0])}</th><th>{E(J['b'][0])}</th></tr></thead><tbody>{tbl}<tr><th>합계</th><th>{sa}</th><th>{sb}</th></tr></tbody></table></div>
{talk(J['comments'])}</div>
{talk(J['result'])}
<p class="hint">점수는 이야기 속 예시입니다. 실제 그림을 평가한 값이 아닙니다.</p>
</div></section>
"""

def summary(P):
    rows = "".join(f"<tr><td>{E(a)}</td><td>{E(b)}</td><td>{E(c)}</td></tr>" for a, b, c in P["summary"])
    return f"""<section id="sum"><div class="wrap"><h2>{P['no']}부 정리</h2>
<div class="tbl"><table><thead><tr><th>주제</th><th>한 줄</th><th>작업에서는</th></tr></thead><tbody>{rows}</tbody></table></div></div></section>
"""

def outro(P):
    return f"""<section id="outro"><div class="wrap"><h2>다음으로</h2>{talk(P['outro'])}
<div class="next"><a href="{P['prev'][0]}">{E(P['prev'][1])}</a><a href="{P['next'][0]}">{E(P['next'][1])}</a></div></div></section>
"""

def failcard(f):
    note = f'<p class="hint">{E(f["note"])}</p>' if f.get("note") else ""
    return f"""<div class="failcard" id="{f['key'][:7]}"><h3>{E(f['title'])}</h3><div class="failgrid">
{art(f['key'], f['alt'], f['ar'])}
<div><p><span class="chip">증상</span>{E(f['symptom'])}</p>
{quiz(f['q'], f['opts'], f['ans'], f['ok'], f['no'])}
<p><span class="chip">다시 볼 원리</span><a href="{f['link'][0]}">{E(f['link'][1])}</a></p>
<div class="promptbox"><b>고치는 프롬프트 조각</b><pre>{E(f['fix'])}</pre></div>{note}</div></div></div>"""

# ---------------- 지식 색인
KG = [
 ("concept/simplify-shapes", "Concept", "몸을 도형으로 단순화", "Simplifying the figure into boxes and cylinders", "01_structure.html", "#s1", "몸을 상자·원기둥으로 바꿔 면의 방향을 먼저 정한다"),
 ("concept/contour-rings", "Concept", "원기둥의 고리선", "Cross-contour rings", "01_structure.html", "#s2", "고리 세로 폭 = 가로 폭 × sin(내려다보는 각)"),
 ("concept/turnaround", "Method", "돌려 보기(턴어라운드)", "Character turnaround", "01_structure.html", "#s3", "앞·옆·뒤의 폭과 두께를 한 모형에서 맞춘다"),
 ("concept/foreshortening", "Concept", "원기둥 위 간격의 원근", "Foreshortening on a cylinder", "01_structure.html", "#s4", "보이는 폭 = 반지름 × (sin 끝각 − sin 시작각)"),
 ("method/layers", "Method", "도형→스케치→선화→색 레이어", "Construction-to-color layering", "01_structure.html", "#s5", "틀린 단계만 고칠 수 있게 단계별로 쌓는다"),
 ("concept/lambert", "Concept", "면의 방향과 밝기(cos)", "Lambertian shading", "02_light.html", "#s1", "밝기 = max(0, cos θ), 90°가 그림자 경계"),
 ("concept/form-cast-shadow", "Concept", "입체 그림자와 떨어지는 그림자", "Form shadow vs cast shadow", "02_light.html", "#s2", "빛을 등진 면 / 다른 물체가 가린 자리"),
 ("concept/island-shadow", "Concept", "섬 그림자", "Floating fold shadows", "02_light.html", "#s3", "주름 산의 빛 반대쪽 그림자만 선 없이 칠한다"),
 ("concept/penumbra", "Concept", "그림자 흐림과 반사광", "Penumbra and bounce light", "02_light.html", "#s4", "흐린 폭 = 광원 크기 × 높이 ÷ 광원 거리"),
 ("method/render-passes", "Method", "VFX 렌더 층", "Render passes", "02_light.html", "#s5", "기본 색·직접광·그림자·주변 가림을 따로 계산해 합친다"),
 ("concept/fold-types", "Concept", "주름 세 종류", "Tension, compression and drape folds", "03_folds.html", "#s1", "당김·모임·처짐 — 접점·힘·중력의 결과"),
 ("concept/fold-spots", "Concept", "주름이 생기는 자리", "Where folds form", "03_folds.html", "#s2", "관절·걸림·고임 6곳"),
 ("concept/flow-tension", "Concept", "흐름과 꺾임(소재감)", "Flow and tension in fold lines", "03_folds.html", "#s3", "S자 흐름은 부드러움, 날카로운 꺾임은 빳빳함"),
 ("concept/bend-excess", "Concept", "굽힘과 남는 천", "Excess cloth at a bent joint", "03_folds.html", "#s4", "남는 길이 = 소매 반지름 × 굽힌 각(라디안)"),
 ("method/cloth-sim", "Method", "천 시뮬레이션", "Mass-spring cloth simulation", "03_folds.html", "#s5", "점과 용수철 + 중력으로 주름을 계산한다"),
 ("concept/clustering", "Concept", "비슷한 그림끼리 묶기", "Unsupervised clustering (k-means)", "04_ai_learns.html", "#s1", "이름표 없이 가까운 것끼리 묶는다"),
 ("concept/latent-space", "Concept", "잠재공간", "Latent space", "04_ai_learns.html", "#s2", "그림 하나 = 지도 위 점 하나"),
 ("concept/diffusion", "Concept", "확산 모델", "Diffusion model", "04_ai_learns.html", "#s3", "섞인 그림 = √ᾱ 원본 + √(1−ᾱ) 잡음, 큰 구조부터"),
 ("concept/cfg", "Concept", "안내 강도", "Classifier-free guidance", "04_ai_learns.html", "#s4", "결과 = 없음 + w × (있음 − 없음)"),
 ("method/identity-tokens", "Method", "캐릭터 고정 문장", "Character identity tokens", "05_pixel_to_real.html", "#s1", "바뀌면 안 되는 특징(없음·좌우 포함)을 매번 같은 문장으로"),
 ("method/style-transfer", "Method", "화풍 바꾸기", "Style change by re-drawing", "05_pixel_to_real.html", "#s2", "늘리기가 아니라 다시 그리기"),
 ("concept/img2img-strength", "Concept", "원본 반영 정도(강도)", "Image-to-image denoising strength", "05_pixel_to_real.html", "#s3", "다시 그리는 단계 수 = 강도 × 전체 단계"),
 ("method/guide-maps", "Method", "포즈·선화·깊이 가이드", "Pose, edge and depth conditioning", "05_pixel_to_real.html", "#s4", "구조를 지도로 AI에게 건넨다"),
 ("method/prompt-assembly", "Method", "프롬프트 조립", "Structured prompt assembly", "05_pixel_to_real.html", "#s5", "고정값→자세→빛→소재→화풍→금지"),
 ("method/diagnosis", "Method", "실패 진단 순서", "Failure diagnosis checklist", "06_failure_lab.html", "#s1", "구조→빛→천→고정값→강도·화풍"),
 ("application/failure-cases", "Application", "실패 사례 8종", "Eight intentional failure cases", "06_failure_lab.html", "#fails", "번 사라짐·좌우 반전·빛 모순·떠 있는 천·손가락·다른 사람·뭉개진 네모·화풍 갈라짐"),
 ("open/famous-drift", "OpenQuestion", "유명 캐릭터 쏠림", "Drift toward well-known characters", "06_failure_lab.html", "#drift", "몰린 동네로 끌려가는 현상 — 고정 문장과 참고 그림으로 줄인다"),
 ("application/practice", "Application", "실전 연습장", "Practice simulator", "practice/index.html", "#studio", "조명·천·프롬프트·진단을 직접 운영해 본다"),
 ("application/try-1", "Application", "직접 만들어 보기 — 도형 마네킹부터", "Prompt practice: mannequin first", "01_structure.html", "#try", "도형 마네킹을 먼저 만들고 그 그림을 참고로 캐릭터를 그리게 한다"),
 ("application/try-2", "Application", "직접 만들어 보기 — 광원 문장 바꾸기", "Prompt practice: lighting sentences", "02_light.html", "#try", "광원과 그림자 방향을 함께 적어 두 장을 비교한다"),
 ("application/try-3", "Application", "직접 만들어 보기 — 천 문장 바꾸기", "Prompt practice: fabric sentences", "03_folds.html", "#try", "접점·중력 문장과 바람 문장으로 두 장을 비교한다"),
 ("application/try-4", "Application", "직접 만들어 보기 — 이름 대 특징 문장", "Prompt practice: name vs features", "04_ai_learns.html", "#try", "이름만 넣은 결과와 특징을 풀어 쓴 결과를 비교한다"),
 ("application/try-5", "Application", "직접 만들어 보기 — 조립기 문장과 단체 그림", "Prompt practice: assembled prompt and group", "05_pixel_to_real.html", "#try", "조립기 문장을 그대로 넣고, 세 사람 고정값이 섞이지 않는지 본다"),
 ("application/try-6", "Application", "직접 만들어 보기 — 고친 프롬프트로 다시", "Prompt practice: regenerate with fixes", "06_failure_lab.html", "#try", "고치는 프롬프트 조각으로 실패를 다시 만들어 점검표로 확인한다"),
 ("application/ex-1", "Application", "1부 연습 과제", "Part 1 prompt exercises", "01_structure.html", "#ex", "출발 그림에서 문장 하나로 원리 하나만 바꿔 결과를 확인한다"),
 ("application/ex-2", "Application", "2부 연습 과제", "Part 2 prompt exercises", "02_light.html", "#ex", "출발 그림에서 문장 하나로 원리 하나만 바꿔 결과를 확인한다"),
 ("application/ex-3", "Application", "3부 연습 과제", "Part 3 prompt exercises", "03_folds.html", "#ex", "출발 그림에서 문장 하나로 원리 하나만 바꿔 결과를 확인한다"),
 ("application/ex-4", "Application", "4부 연습 과제", "Part 4 prompt exercises", "04_ai_learns.html", "#ex", "출발 그림에서 문장 하나로 원리 하나만 바꿔 결과를 확인한다"),
 ("application/ex-5", "Application", "5부 연습 과제", "Part 5 prompt exercises", "05_pixel_to_real.html", "#ex", "출발 그림에서 문장 하나로 원리 하나만 바꿔 결과를 확인한다"),
 ("application/ex-6", "Application", "6부 연습 과제", "Part 6 prompt exercises", "06_failure_lab.html", "#ex", "출발 그림에서 문장 하나로 원리 하나만 바꿔 결과를 확인한다"),
 ("analogy/blocks", "Analogy", "블록 장난감", "Toy blocks", "01_structure.html", "#s1", "블록으로 만든 사람은 면의 방향이 손에 잡힌다"),
 ("analogy/mirror-fog", "Analogy", "김 서린 거울", "Fogged mirror", "04_ai_learns.html", "#s3", "닦을수록 큰 모양부터 또렷해진다"),
]
KG_EDGES = [("application/try-1","motivates","application/ex-1"),("application/try-2","motivates","application/ex-2"),("application/try-3","motivates","application/ex-3"),("application/try-4","motivates","application/ex-4"),("application/try-5","motivates","application/ex-5"),("application/try-6","motivates","application/ex-6"),("method/layers","usedIn","application/try-1"),("concept/form-cast-shadow","usedIn","application/try-2"),("concept/fold-types","usedIn","application/try-3"),("concept/latent-space","usedIn","application/try-4"),("method/prompt-assembly","usedIn","application/try-5"),("method/diagnosis","usedIn","application/try-6"),("concept/simplify-shapes","motivates","concept/contour-rings"),("concept/contour-rings","motivates","concept/turnaround"),("concept/turnaround","motivates","concept/foreshortening"),
 ("concept/foreshortening","motivates","method/layers"),("concept/simplify-shapes","motivates","concept/lambert"),("concept/lambert","motivates","concept/form-cast-shadow"),
 ("concept/form-cast-shadow","motivates","concept/island-shadow"),("concept/island-shadow","motivates","concept/penumbra"),("concept/penumbra","motivates","method/render-passes"),
 ("concept/fold-types","motivates","concept/fold-spots"),("concept/fold-spots","motivates","concept/flow-tension"),("concept/flow-tension","motivates","concept/bend-excess"),("concept/bend-excess","motivates","method/cloth-sim"),
 ("concept/clustering","motivates","concept/latent-space"),("concept/latent-space","motivates","concept/diffusion"),("concept/diffusion","motivates","concept/cfg"),
 ("concept/cfg","motivates","method/identity-tokens"),("method/identity-tokens","motivates","method/style-transfer"),("method/style-transfer","motivates","concept/img2img-strength"),
 ("concept/img2img-strength","motivates","method/guide-maps"),("method/guide-maps","motivates","method/prompt-assembly"),("method/prompt-assembly","motivates","method/diagnosis"),
 ("method/diagnosis","usedIn","application/failure-cases"),("concept/latent-space","explains","open/famous-drift"),("method/layers","explains","method/guide-maps"),
 ("concept/diffusion","explains","concept/img2img-strength"),("method/render-passes","explains","concept/island-shadow"),("analogy/blocks","explains","concept/simplify-shapes"),
 ("analogy/mirror-fog","explains","concept/diffusion"),("method/prompt-assembly","usedIn","application/practice"),("method/cloth-sim","usedIn","application/practice")]
REFS = [
 dict(id="date_2018_wrinkles", title="デジタルツールで描く！服のシワと影の描き方", author="ダテナオト", year=2018, note="マイナビ出版. 1장 기본편의 원리(접점·힘·중력, 주름 형태, 그림자 종류)를 참고. 그림·문장·도식은 옮기지 않고 연구실 캐릭터와 실험으로 새로 구성"),
 dict(id="lambert_1760", title="Photometria (Lambert's cosine law)", author="Johann Heinrich Lambert", year=1760, note="면의 밝기 = cos θ. https://en.wikipedia.org/wiki/Lambert%27s_cosine_law"),
 dict(id="ho_2020_ddpm", title="Denoising Diffusion Probabilistic Models", author="Jonathan Ho, Ajay Jain, Pieter Abbeel", year=2020, note="NeurIPS 2020. arXiv:2006.11239 — 잡음 섞기 식"),
 dict(id="ho_2022_cfg", title="Classifier-Free Diffusion Guidance", author="Jonathan Ho, Tim Salimans", year=2022, note="arXiv:2207.12598 — 안내 강도 식"),
 dict(id="meng_2021_sdedit", title="SDEdit: Guided Image Synthesis and Editing with Stochastic Differential Equations", author="Chenlin Meng et al.", year=2021, note="arXiv:2108.01073 — 원본 그림에 잡음을 넣고 다시 그리는 방식(강도)"),
 dict(id="zhang_2023_controlnet", title="Adding Conditional Control to Text-to-Image Diffusion Models", author="Lvmin Zhang, Anyi Rao, Maneesh Agrawala", year=2023, note="ICCV 2023. arXiv:2302.05543 — 포즈·선화·깊이 가이드"),
 dict(id="jakobsen_2001_verlet", title="Advanced Character Physics", author="Thomas Jakobsen", year=2001, note="GDC 2001 — 점과 막대(베를레) 천 계산"),
 dict(id="macqueen_1967_kmeans", title="Some Methods for Classification and Analysis of Multivariate Observations", author="J. MacQueen", year=1967, note="K-평균 묶기"),
]

def kg_block(page, pages):
    nodes = [dict(id="lab:" + i, type=t, label=dict(ko=ko, en=en), page=p, anchor=a, definition=dict(ko=d), source="lab:work/structure_first_drawing")
             for i, t, ko, en, p, a, d in KG if p in pages]
    ids = {n["id"] for n in nodes}
    edges = [dict(s="lab:" + s, p=p, o="lab:" + o) for s, p, o in KG_EDGES if "lab:" + s in ids and "lab:" + o in ids]
    raw = dict(version="1.3", page=page, series=SERIES, nodes=nodes, edges=edges)
    ld = {"@context": {"@vocab": "urn:lab:", "skos": "http://www.w3.org/2004/02/skos/core#", "schema": "https://schema.org/"},
          "@graph": [{"@id": "urn:" + n["id"], "@type": n["type"], "skos:prefLabel": [{"@value": n["label"]["ko"], "@language": "ko"}, {"@value": n["label"]["en"], "@language": "en"}],
                      "skos:definition": n["definition"]["ko"], "schema:url": SITE + n["page"] + n["anchor"]} for n in nodes]}
    meta = dict(title=page, series=SERIES, creator=[dict(name="안상선", role="author", affiliation="(주)M-Robo")], date=DATE, version=VER, license="캐릭터·그림 무단 사용 금지")
    J = lambda o: json.dumps(o, ensure_ascii=False).replace("</", "<\\/")
    return f"""<section id="kg"><div class="wrap"><h2>지식 색인 — 이 페이지에서 찾아보기</h2>
<p class="muted">이 페이지에 나온 개념·방법·비유·쓰임을 모았습니다. 검색하고, "설명 보러 가기"로 본문에 돌아갑니다.</p><div id="kg-mount"></div></div></section>
<section id="export"><div class="wrap"><h2>온톨로지·서지 꾸러미 — 이 페이지 내용을 파일로 받기</h2>
<p class="muted">지식 색인을 출처와 함께 파일로 내려받습니다. 서지 관리는 BibTeX·RIS, 온톨로지 편집은 Turtle, 그래프 도구는 CSV, 여러 페이지 합치기는 kg.json입니다.</p><div id="export-mount"></div></div></section>
<script type="application/json" id="kg-raw">{J(raw)}</script>
<script type="application/ld+json" id="kg-ld">{J(ld)}</script>
<script type="application/json" id="refs-csl">{J(REFS)}</script>
<script type="application/json" id="page-meta">{J(meta)}</script>
"""

FOOT_LINKS = [("index.html", "목차")] + [(P["file"], f"{P['no']}부") for P in PARTS] + [("practice/index.html", "7부 실전 연습장")]

def footer(pre=""):
    links = " · ".join(f'<a href="{pre}{h}">{E(t)}</a>' for h, t in FOOT_LINKS) + f' · <a href="{REPO}">저장소</a>'
    refs = "".join(f"<tr><td>[{i+1}]</td><td>{E(r['author'])} ({r['year']}). {E(r['title'])}</td><td>{E(r['note'])}</td></tr>" for i, r in enumerate(REFS))
    return f"""<footer><div class="wrap">
<h3>출처·참고</h3>
<div class="tbl"><table><thead><tr><th>#</th><th>자료</th><th>이 시리즈에서 쓴 곳</th></tr></thead><tbody>{refs}</tbody></table></div>
<h3>숫자와 그림에 관한 안내</h3>
<p>소매 반지름, 광원 크기, 강도 구간, 안내 강도 값, 평가단 점수는 모두 원리를 보이기 위한 예시값입니다. 실제 도구의 알맞은 값은 모델·도구마다 다릅니다.</p>
<p>실사풍 그림은 캐릭터를 코스프레한 가상의 성인 모델로 만든 것이며 실존 인물이 아닙니다. 다른 작품의 캐릭터를 닮은 그림은 만들지 않습니다.</p>
<p>캐릭터 이름·설정·그림은 저작권자 안상선의 허락 없이 사용할 수 없습니다. 캐릭터 그림: <a href="{CHARREPO}">fruitfly-lab-expressions</a>.</p>
<p>글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p>
<p>{links}</p>
</div></footer>
<script src="{pre}assets/panels.js"></script>
</body></html>
"""

def build_part(P):
    t = f"{SERIES} {P['no']}부 — {P['title']}"
    s = head(t, P["desc"], P["og"], P["file"])
    navl = [(f"#{x['id']}", f"{k+1}단계") for k, x in enumerate(P["steps"])]
    if P.get("fails"): navl += [("#fails", "실패 8종")]
    navl += [("#try", "만들어 보기"), ("#ex", "연습 과제"), ("#judge", "평가"), ("#sum", "정리"), (P["next"][0], "다음 →")]
    s += nav(navl)
    s += cover(P["cover_key"], P["cover_cap"], P["cover_cast"])
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">{E(P['kicker'])}</span><h1>{E(P['title'])}</h1><p class="lead">{E(P['lead'])}</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section><div class="wrap">{three(*P['three'], ABBR)}</div></section>
<section><div class="wrap"><h2>오늘의 과제</h2>{talk(P['intro'])}{flow_strip(P['no'])}</div></section>
"""
    for k, st in enumerate(P["steps"]):
        s += step(P, k + 1, st)
    if P.get("fails"):
        s += '<section class="room" id="fails"><div class="wrap"><div class="roomno">6부 · 2단계</div><h2>실패 8종 진단</h2><p class="muted">그림마다 증상을 보고 원인을 고른 뒤, 연결된 원리와 고치는 프롬프트 조각을 확인합니다.</p>'
        s += "".join(failcard(f) for f in P["fails"])
        d = P["drift"]
        s += f'<div class="failcard" id="drift"><h3>{E(d["title"])}</h3>' + "".join(f"<p>{E(x)}</p>" for x in d["body"]) + '<p><span class="chip">다시 볼 원리</span><a href="04_ai_learns.html#s2">4부 2단계 잠재공간</a></p></div></div></section>'
    s += tryit(P["no"]) + exercises(P["no"]) + judge(P["judge"]) + summary(P) + outro(P)
    s += kg_block(P["file"].replace(".html", ""), [P["file"]])
    s += footer()
    open(os.path.join(ROOT, P["file"]), "w").write(s)

FLOW = [
 (1, "구조 먼저", "윤곽부터 그리면 비례·면의 방향이 흔들린다", "몸을 상자·원기둥으로"),
 (2, "빛과 그림자", "모양을 잡아도 어디가 밝고 어두운지 정해지지 않는다", "면의 방향 × 빛 = 밝기"),
 (3, "옷 주름", "빛을 알아도 옷이 무늬처럼 붙어 보인다", "접점·힘·중력"),
 (4, "AI는 어떻게 배우나", "손으로 다 그리기엔 느리다. AI는 무엇을 아는가?", "묶기·지도·확산·안내 강도"),
 (5, "픽셀에서 실사까지", "AI는 캐릭터 이름을 모르고 특징을 빠뜨린다", "고정 문장·강도·가이드·조립"),
 (6, "실패 사례 실험실", "프롬프트를 써도 결과는 틀릴 수 있다", "진단 순서와 고치는 조각"),
 (7, "실전 연습장", "배운 것을 한 화면에서 함께 다뤄 본다", "조명·천·프롬프트·진단"),
]
def flow_strip(cur=None, pre=""):
    files = {P["no"]: P["file"] for P in PARTS}
    files[7] = "practice/index.html"
    cells = []
    for n, t, _, _ in FLOW:
        mark = ' style="border-color:var(--orange);background:var(--orange-soft)"' if n == cur else ""
        cells.append(f'<a href="{pre}{files[n]}"{mark}><b>{n}부</b>{E(t)}</a>')
    return '<div class="flowgrid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:16px">' + "".join(cells) + "</div>"

def build_index():
    t = f"{SERIES} — 픽셀 캐릭터를 실사까지"
    d = "캐릭터를 한 번에 그리지 않고 구조 → 빛 → 주름 순서로 잡는 원리를 실험으로 익히고, 그 원리로 연구실 픽셀 캐릭터를 애니풍·실사풍으로 옮기는 프롬프트를 실습합니다. 실패 사례 8종 진단까지."
    s = head(t, d, "og_index.jpg", "index.html")
    s += nav([("#howto", "읽는 법"), ("#parts", "편 목록"), ("#map", "큰 그림"), ("#cast", "등장인물"), ("#source", "원리와 출처")])
    s += cover("cover_index", "연구실 아틀리에 · 화가 둘, 모델 셋, 평가단 셋", [("fruitfly", "e09"), ("haru", "e01"), ("sia", "e13"), ("moa", "e19"), ("jupanbot", "e16")])
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">연구실 특별편 · 그리기와 렌더링</span>
<h1>구조 먼저 보는<br>캐릭터 그리기 연구실</h1>
<p class="lead">사람은 그림을 한 번에 그리지 않습니다. 상자와 원기둥으로 <b>구조</b>를 잡고, <b>빛</b>을 정하고, <b>천</b>을 얹습니다. 3D 렌더링도, 그림 생성 AI도 같은 순서로 움직입니다. 이 원리로 연구실의 픽셀 캐릭터 하루·시아·모아를 애니풍과 실사풍으로 데려가 봅니다.</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section><div class="wrap">{three("몸을 도형으로 단순화하고, 빛과 그림자, 옷 주름의 원리를 실험으로 익힌 뒤, 그 원리를 AI 그림 프롬프트로 옮깁니다.", "AI가 그림을 대신 그려 줘도, 어디가 틀렸는지 알아보고 고치려면 원리를 알아야 합니다.", "캐릭터 시트·홍보 그림을 여러 그림체로 만들거나, AI 그림을 검수하고 다시 요청할 때 씁니다.", ABBR)}</div></section>
<section id="howto"><div class="wrap"><h2>읽는 순서와 시간</h2><div class="box"><ul style="margin:0;padding-left:20px">
<li><b>처음부터 차례로</b>(권장): 부마다 실험을 눌러 보며 20~30분, 전체 3~4시간입니다.</li>
<li><b>그림 원리만</b>: 1~3부. AI 이야기 없이 손 그림의 원리만 봅니다.</li>
<li><b>AI 그림만 급하다면</b>: 5부 → 6부 → 7부. 막히는 낱말은 각 단계의 링크로 1~3부를 되짚어 보세요.</li>
<li>각 부 끝의 <b>프롬프트로 직접 만들어 보기</b>에서는 복사한 프롬프트로 그림 도구에서 실제 그림을 만들고, 점검표로 확인합니다. 페이지에는 같은 프롬프트로 실제로 만든 결과 그림이 함께 있습니다.</li>
<li>이어서 <b>연습 과제</b> 두 개에서 그 그림을 출발점으로 문장 하나만 바꿔 원리를 확인합니다. 순서·성공 기준·잘 안 될 때를 자세히 적었고, 예상 결과 그림도 함께 있습니다.</li>
<li>각 부 끝의 <b>평가단 채점</b>은 이야기 속 예시 점수입니다. 확인 퀴즈와 실전 연습장 미션으로 스스로 점검하세요.</li></ul></div></div></section>
<section id="parts"><div class="wrap"><h2>편 목록</h2>
<p class="muted">모델은 하루·시아·모아, 화가는 주판봇과 초파리, 평가단은 X1·X2·X3, 해설은 박사입니다. 부마다 두 화가가 겨루고 평가단이 점수를 매깁니다.</p>
<div class="cards">
<a class="card" href="01_structure.html">{face("haru","e01")}<span class="n">1부 · 모델 하루</span><h3>구조 먼저</h3><p>몸은 상자와 원기둥. 고리선·돌려 보기·원근 간격·레이어 쌓기.</p></a>
<a class="card" href="02_light.html">{face("sia","e13")}<span class="n">2부 · 모델 시아</span><h3>빛과 그림자</h3><p>밝기 = cos θ, 두 가지 그림자, 섬 그림자, 반사광, VFX 렌더 층.</p></a>
<a class="card" href="03_folds.html">{face("moa","e01")}<span class="n">3부 · 모델 모아</span><h3>옷 주름</h3><p>당김·모임·처짐, 생기는 자리, 소재감, 굽힘, 천 시뮬레이션.</p></a>
<a class="card" href="04_ai_learns.html">{face("haru","e04")}<span class="n">4부 · 모델 하루</span><h3>AI는 그림을 어떻게 배우나</h3><p>비슷한 그림 묶기, 잠재공간, 확산 모델, 안내 강도.</p></a>
<a class="card" href="05_pixel_to_real.html">{face("moa","e19")}<span class="n">5부 · 모델 셋 모두</span><h3>픽셀에서 실사까지</h3><p>고정 문장, 화풍 바꾸기, 원본 반영 정도, 가이드 지도, 프롬프트 조립 실습.</p></a>
<a class="card" href="06_failure_lab.html">{face("jupanbot","e20")}<span class="n">6부 · 의도적 실패 8종</span><h3>실패 사례 실험실</h3><p>증상 → 원인 → 원리 → 고치는 프롬프트. 진단 순서 점검표.</p></a>
<a class="card" href="practice/index.html">{face("x2","e16")}<span class="n">7부 · 마지막 장</span><h3>실전 연습장</h3><p>촬영 스튜디오·의상실·프롬프트 공방·진단 데스크를 직접 운영합니다.</p></a>
</div></div></section>
<section id="map"><div class="wrap"><h2>큰 그림 — 앞에서 막힌 곳을 다음 부에서 풉니다</h2>{flow_strip()}
<div class="tbl" style="margin-top:16px"><table><thead><tr><th>부</th><th>제목</th><th>앞에서 막힌 곳 → 이 부에서 푸는 것</th><th>핵심</th></tr></thead><tbody>
{''.join(f"<tr><td>{n}</td><td>{E(t)}</td><td>{E(a)}</td><td>{E(b)}</td></tr>" for n, t, a, b in FLOW)}</tbody></table></div>
<p class="muted" style="margin-top:12px">기초 개념을 먼저 보고 싶다면: <a href="{RENDER}">AI 렌더링 연구실(비지도학습 → 렌더링 → DLSS)</a> · <a href="{FISH}">비지도학습 물고기 연구실</a></p></div></section>
<section id="cast"><div class="wrap"><h2>등장인물</h2><div class="cast-grid">{''.join(f'<div class="who">{face(k, "e01" if k in ("haru","sia","moa") else "e13")}<b>{E(CH[k][0])}</b><span>{E(CH[k][1])}</span></div>' for k in ["doctor","haru","sia","moa","jupanbot","fruitfly","x1","x2","x3"])}</div></div></section>
<section id="source"><div class="wrap"><h2>원리와 출처</h2>
<p>1~3부의 그리기 원리(접점·힘·중력으로 생기는 주름, 그림자의 종류, 도형으로 구조 잡기)는 일반적인 드로잉 원리이며, 다테 나오토의 작법서 『デジタルツールで描く！服のシワと影の描き方』(マイナビ) 1장 기본편을 참고해 정리했습니다. 책의 그림·문장·도식은 옮기지 않았고, 연구실 캐릭터와 직접 움직이는 실험으로 새로 구성했습니다.</p>
<p>4~5부의 AI 원리는 확산 모델·안내 강도·원본 반영 강도·조건 가이드 논문을 바탕으로 쉽게 풀었습니다(아래 출처). 그림 속 그림은 Genspark로 만들 예정이며, 그림이 오기 전에는 '그림 준비 중' 자리로 둡니다. 페이지는 그림 없이도 모든 실험이 동작합니다.</p></div></section>
"""
    s += kg_block("index", [P["file"] for P in PARTS] + ["practice/index.html"])
    s += footer()
    open(os.path.join(ROOT, "index.html"), "w").write(s)

def build_practice():
    pre = "../"
    t = f"{SERIES} 7부 — 실전 연습장"
    d = "촬영 스튜디오(조명), 의상실(천), 프롬프트 공방(조립), 진단 데스크(실패 맞히기) 네 곳을 직접 운영하며 1~6부를 함께 연습합니다."
    s = head(t, d, "og_07.jpg", "practice/index.html", pre)
    s += nav([("#studio", "스튜디오"), ("#wardrobe", "의상실"), ("#workshop", "공방"), ("#desk", "진단 데스크"), ("#wrap", "마무리")], pre)
    s += cover("cover_07", "연구실 조종 책상 · 실전 연습장", [("haru", "e19"), ("doctor", "e16"), ("fruitfly", "e09"), ("jupanbot", "e16")], pre)
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">7부 · 마지막 장</span><h1>실전 연습장</h1>
<p class="lead">네 곳의 작업장을 직접 운영합니다. <span style="color:var(--green)">초록 조작판</span>은 주어진 환경, <span style="color:var(--blue)">파랑 조작판</span>은 내 결정입니다. 미션은 직접 조작해야 판정됩니다.</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section id="practice"><div class="wrap">
<div class="tabs" role="tablist"><button type="button" data-t="studio">촬영 스튜디오</button><button type="button" data-t="wardrobe">의상실</button><button type="button" data-t="workshop">프롬프트 공방</button><button type="button" data-t="desk">진단 데스크</button></div>
"""
    def sc(id_, title, situ, env, me, missions, back, extra_g1=""):
        ms = "".join(f"<li>{E(m)}</li>" for m in missions)
        bk = " · ".join(f'<a href="{pre}{h}">{E(t)}</a>' for h, t in back)
        return f"""<div class="scene" id="{id_}"><h2>{E(title)}</h2><div class="box"><b>상황</b> — {E(situ)}</div>
<div class="panel"><div class="ph"><b>조작판</b><small>초록 = 환경 · 파랑 = 내 결정</small></div>
<div class="ctrl ctl-env">{env}</div><div class="ctrl ctl-me">{me}</div>
<div class="board" aria-live="polite"></div>
<div class="pair"><div class="g1">{extra_g1}</div><div class="g2"></div></div>
<div class="talk"></div>
<h4>미션</h4><ol class="missions">{ms}</ol></div>
<p class="muted">배운 곳 다시 보기: {bk}</p></div>
"""
    s += sc("studio", "촬영 스튜디오 — 조명 세우기", "모델 공 하나를 조명으로 찍습니다. 광원 방위·높이·크기를 정해 그림자 방향과 부드러움을 맞춥니다.",
            '<label>바닥 밝기 <input type="range" name="floor" min="0" max="100" step="10" value="60"></label><label>모델이 뜬 높이(cm) <input type="range" name="hgt" min="0" max="80" step="5" value="20"></label>',
            '<label>광원 방위 <input type="range" name="az" min="0" max="180" step="5" value="90"></label><label>광원 높이 <input type="range" name="elev" min="-40" max="80" step="5" value="30"></label><label>광원 지름(cm) <input type="range" name="size" min="5" max="60" step="5" value="20"></label>',
            ["왼쪽 위 조명 만들기: 방위 120~150°, 높이 35~60°", "부드러운 그림자: 흐린 폭을 3~5cm로", "아래 조명(높이 0 아래)을 켜서 그림자가 위로 가는 것 보기"],
            [("02_light.html#s1", "2부 1단계 밝기"), ("02_light.html#s4", "2부 4단계 그림자 거리")])
    s += sc("wardrobe", "의상실 — 천 걸기", "천 한 장을 고리에 걸어 원하는 주름을 만듭니다. 천의 무게·바람은 주어지고, 고정점과 뻣뻣함은 내가 정합니다.",
            '<label>천 무게 <input type="range" name="wt" min="10" max="100" step="10" value="50"></label><label>바람 <input type="range" name="wind" min="0" max="100" step="10" value="0"></label>',
            '<label>고정점 간격 <input type="range" name="gap" min="40" max="100" step="10" value="70"></label><label>높이 차 <input type="range" name="dh" min="0" max="8" step="1" value="0"></label><label>뻣뻣함 <input type="range" name="stiff" min="0" max="100" step="10" value="20"></label><label><input type="checkbox" name="gather"> 양쪽에서 모으기</label>',
            ["두 점으로 걸어 가운데 처짐 4 이상 만들기", "높이 차 6 이상으로 비스듬한 당김 주름 만들기", "모으기로 주름 굴곡 3개 이상 만들기"],
            [("03_folds.html#s1", "3부 1단계 주름 세 종류"), ("03_folds.html#s5", "3부 5단계 천 시뮬레이션")])
    s += sc("workshop", "프롬프트 공방 — 요청서 조립", "요청 상황에 맞춰 그림 요청 프롬프트를 조립합니다. 점검표 6항목을 채우고, 상황에 꼭 필요한 항목을 넣습니다.",
            '<label>요청 상황 <select name="job"><option value="poster">홍보 포스터(빛·화풍 중요)</option><option value="sheet">설정 시트(자세·고정값 중요)</option><option value="goods">굿즈 그림(화풍·금지 목록 중요)</option></select></label>',
            '<label>캐릭터 <select name="who"><option value="">(고르기)</option><option value="haru">하루</option><option value="sia">시아</option><option value="moa">모아</option></select></label><label>자세 <select name="pose"><option value="">(고르기)</option><option value="hip">서서 한 손 허리</option><option value="up">두 팔 위로</option><option value="sit">벤치에 앉기</option><option value="walk">걷기</option></select></label><label>빛 <select name="light"><option value="">(고르기)</option><option value="ul">왼쪽 위</option><option value="ur">오른쪽 위</option><option value="below">아래에서</option><option value="back">뒤에서</option></select></label><label>소재 <select name="fab"><option value="none">(정하지 않음)</option><option value="crisp">빳빳한 천</option><option value="soft">부드러운 천</option></select></label><label>화풍 <select name="sty"><option value="">(고르기)</option><option value="pixel">픽셀</option><option value="anime">애니풍</option><option value="semireal">반실사</option><option value="photo">실사풍</option></select></label><label><input type="checkbox" name="neg"> 금지 목록</label>',
            ["점검표 6 / 6 채우기", "실사풍 + 금지 목록 함께 넣기", "모아로 바꿔도 '리본 왼쪽 귀 위'가 문장에 남는지 확인"],
            [("05_pixel_to_real.html#s1", "5부 1단계 고정 문장"), ("05_pixel_to_real.html#s5", "5부 5단계 조립")],
            '<div class="promptbox"><b>조립된 프롬프트</b><pre aria-live="polite"></pre><button type="button" class="btn copy">복사하기</button><p class="hint" style="margin-top:8px"><b>실제로 만들어 보기</b> — ① 복사 ② 그림 도구에 붙이고 캐릭터 설정 시트를 첨부 ③ 결과를 <a href="#desk">진단 데스크</a>의 순서(구조 → 빛 → 천 → 고정값 → 강도·화풍)로 확인. 각 부 끝의 \'프롬프트로 직접 만들어 보기\'에 실제 결과 예시가 있습니다.</p></div>')
    s += sc("desk", "진단 데스크 — 원인 맞히기", "실패 그림의 증상이 하나씩 들어옵니다. 원인을 고르세요. 큰 것부터: 구조 → 빛 → 천 → 고정값 → 강도·화풍.",
            '<span class="hint">환경: 증상은 무작위로 들어옵니다.</span>',
            '<div style="width:100%"><p class="sym" style="font-weight:600"></p><div class="opts deskopts"></div></div>',
            ["3개 연속 정답", "8종 원인을 모두 한 번 이상 맞히기", "틀리지 않고 5개 맞히기"],
            [("06_failure_lab.html#s1", "6부 진단 순서"), ("06_failure_lab.html#fails", "6부 실패 8종")])
    s += f"""</div></section>
<section id="wrap"><div class="wrap"><h2>마무리 — 네 작업장을 한 질문으로 묶으면</h2>
<div class="box"><p>스튜디오에서 정한 빛의 방향은 공방의 프롬프트에서 '그림자 방향' 문장이 되고, 의상실에서 만든 주름은 '접점과 중력' 문장이 됩니다. 진단 데스크에서 틀린 원인은 대부분 앞의 세 곳 중 하나가 빠진 경우입니다. 결국 하나로 잇는 질문은 이것입니다: <b>"구조·빛·천을 먼저 정했는가, 그리고 그것을 말로 전했는가?"</b></p>
<p class="hint">한계: 이 연습장의 조명·천 계산은 원리를 보이기 위해 크게 단순화했습니다. 숫자는 교육용 예시이며, 실제 그림 도구·렌더러의 값과 다릅니다.</p></div>
<div class="next"><a href="{pre}06_failure_lab.html">← 6부 실패 사례 실험실</a><a href="{pre}index.html">목차로</a></div></div></section>
"""
    s += kg_block("practice_index", ["practice/index.html"])
    s += footer(pre)
    open(os.path.join(ROOT, "practice", "index.html"), "w").write(s)

if __name__ == "__main__":
    build_index()
    for P in PARTS:
        build_part(P)
    build_practice()
    print("built", len(PARTS) + 2, "pages")


# ── 분야 뼈대 다시 걸기 (kg/rehang.json, ai-lab-retrofit 15장) ──
# 빌드가 페이지를 다시 쓴 뒤, 덧씌우기를 kg-raw·kg-ld에 다시 적용한다. 파일이 없으면 아무것도 하지 않는다.
if __name__ == "__main__":
    import os as _os, sys as _sys, subprocess as _sp
    _r = _os.path.dirname(_os.path.abspath(__file__))
    for _i in range(3):
        if _os.path.exists(_os.path.join(_r, "kg", "rehang.json")): break
        _r = _os.path.dirname(_r)
    if _os.path.exists(_os.path.join(_r, "kg", "rehang.json")):
        _sp.run([_sys.executable, _os.path.join(_r, "kg", "rehang.py"), "apply", _r])
