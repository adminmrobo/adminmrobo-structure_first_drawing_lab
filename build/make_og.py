# -*- coding: utf-8 -*-
"""공유 미리보기(og) 그림을 만든다. 표지 그림(assets/img/cover_*.webp)이 들어오면 그것을 잘라 쓰고, 없으면 글자+캐릭터로 만든다."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
ITEMS = [("og_index", "cover_index", "구조 먼저 보는 캐릭터 그리기 연구실", "픽셀 캐릭터를 실사까지", ["fruitfly", "haru", "sia", "moa", "jupanbot"]),
 ("og_01", "cover_01", "1부 구조 먼저", "몸은 상자와 원기둥", ["doctor", "haru", "fruitfly"]),
 ("og_02", "cover_02", "2부 빛과 그림자", "면이 빛을 어떻게 받나", ["doctor", "sia", "fruitfly"]),
 ("og_03", "cover_03", "3부 옷 주름", "접점·힘·중력", ["doctor", "moa", "fruitfly"]),
 ("og_04", "cover_04", "4부 AI는 그림을 어떻게 배우나", "묶기·지도·확산·안내 강도", ["doctor", "haru", "jupanbot"]),
 ("og_05", "cover_05", "5부 픽셀에서 실사까지", "고정 문장·강도·가이드·조립", ["haru", "sia", "moa"]),
 ("og_06", "cover_06", "6부 실패 사례 실험실", "증상 → 원인 → 원리 → 고치기", ["jupanbot", "fruitfly", "x2"]),
 ("og_07", "cover_07", "7부 실전 연습장", "조명·천·프롬프트·진단", ["haru", "doctor", "x1"])]
os.makedirs(os.path.join(ROOT, "assets", "og"), exist_ok=True)
for key, cover, t1, t2, cast in ITEMS:
    cp = os.path.join(ROOT, "assets", "img", cover + ".webp")
    if os.path.exists(cp):
        im = Image.open(cp).convert("RGB"); w, h = im.size; nh = int(w * 630 / 1200)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh)).resize((1200, 630))
    else:
        im = Image.new("RGB", (1200, 630), "#ffffff"); d = ImageDraw.Draw(im)
        for x in range(0, 1200, 40):
            for y in range(0, 630, 40):
                if (x // 40 + y // 40) % 2 == 0: d.rectangle([x, y, x + 39, y + 39], fill="#f3f6fa")
        d.rectangle([0, 0, 1200, 8], fill="#0f8f84")
        d.text((60, 70), t1, font=ImageFont.truetype(F, 58), fill="#16212b")
        d.text((60, 160), t2, font=ImageFont.truetype(F, 36), fill="#0f8f84")
        d.text((60, 560), "안상선 · ahnboat lab", font=ImageFont.truetype(F, 24), fill="#5b6874")
        for i, c in enumerate(cast):
            f = Image.open(os.path.join(ROOT, "assets", "chars", f"{c}_e01.webp")).convert("RGBA").resize((220, 220), Image.NEAREST)
            im.paste(f, (1200 - 60 - 230 * (len(cast) - i), 330), f)
    im.save(os.path.join(ROOT, "assets", "og", key + ".jpg"), quality=82)
print("og done")
