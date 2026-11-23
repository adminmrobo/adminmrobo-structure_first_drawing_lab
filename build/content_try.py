# -*- coding: utf-8 -*-
"""부마다 '프롬프트로 직접 만들어 보기' — 페이지에 싣는 프롬프트와 Genspark 요청 프롬프트가 같은 문장이다.
결과 그림은 이 프롬프트를 실제로 넣어 만든 그림을 assets/img/{key}.webp 로 넣는다."""

HARU = ("Haru, a cheerful lab assistant, a young adult woman in her early twenties, long straight pink hair reaching the waist with navy blue streaks, "
        "including a thick navy streak down the center of the bangs, two round slightly messy hair buns on top of the head, a small ahoge, big bright blue eyes, "
        "lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up blue jeans, lavender sneakers")
SIA = ("Sia, a calm maid intern, a young adult woman in her early twenties, long straight jet-black hair reaching the waist with side-swept bangs, calm gray eyes, "
       "small silver drop earrings, long-sleeved charcoal-black maid dress with puffed shoulders and white lace cuffs, white high collar with a large soft gray bow, "
       "long white frilled apron reaching the ankles, white socks, black flat shoes, no headdress")
MOA = ("Moa, a gentle cheerful maid intern, a young adult woman in her early twenties, long ash-beige hair with soft wavy ends and neat bangs, "
       "white frilled maid headband with a thin white ribbon over the LEFT ear, big round amber-brown eyes, white shirt with a red and navy plaid bow tie, "
       "camel knit cardigan with ribbed cuffs, white frilled apron, black knee-length skirt, white socks, brown loafers")
ANIME = "High-quality anime illustration, clean lineart, two-tone cel shading with soft highlights"
NEG = "No text, no letters, no logos, no watermark, no revealing clothing, not resembling any famous anime character, five fingers on each hand."

TRY = {
 1: dict(title="도형 마네킹부터 시키기",
   goal="AI에게도 한 번에 완성을 시키지 않습니다. ① 상자·원기둥 마네킹으로 자세와 비례를 먼저 만들고, ② 그 그림을 참고 그림으로 붙여 하루를 그리게 합니다. 1부의 '도형 → 선화 → 색' 순서를 프롬프트 두 번으로 나눈 것입니다.",
   steps=[
    dict(key="p1_try_step1", result="첫 결과: 상자·원기둥 마네킹이 3/4 방향으로 서서 오른손을 허리에 올렸고, 팔다리에 빨간 고리선도 들어갔습니다. 키는 머리의 약 7~8배입니다.", label="① 도형 마네킹으로 자세 잡기", ar="2/3", attach="없음",
         note="얼굴·옷 없이 도형만 시킵니다. 고리선을 넣어 달라고 하면 팔다리가 둥근 통이라는 것이 보입니다.",
         alt="상자와 원기둥으로만 만든 회색 마네킹이 3/4 방향으로 서서 오른손을 허리에 올린 그림",
         prompt="Full body figure drawing reference, vertical 2:3.\nA simple low-poly 3D mannequin made only of boxes and cylinders: box head, tilted box chest and box pelvis, cylinder upper arms, forearms, thighs and shins, simple box feet. Light gray clay material with clearly visible flat planes.\nPose: standing upright in a three-quarter view turned slightly to the right, left arm relaxed at the side, right hand resting on the hip; body about 8 heads tall.\nThin red contour rings wrapped around each arm and leg cylinder to show the roundness.\nLighting: soft light from the upper left, the right-facing planes darker, a soft cast shadow on the floor toward the lower right.\nPlain white background. No face details, no clothes, no text, no letters, no logos."),
    dict(key="p1_try_step2", result="첫 결과: ①과 거의 같은 방향·비례로 하루가 그려졌고 번·남색 줄도 지켜졌습니다. 다만 손 위치는 ①과 조금 다릅니다. 참고 그림을 줘도 자세가 완전히 같아지지는 않을 수 있습니다.", label="② 마네킹을 참고로 하루 그리기", ar="2/3", attach="①의 결과 + 하루 설정 시트",
         note="①의 그림을 '자세·비례 가이드'로 붙이고, 캐릭터 고정 문장을 더합니다.",
         alt="①의 마네킹과 같은 자세·비례로 그린 애니풍 하루 전신 그림",
         prompt="Full body character illustration, vertical 2:3.\nUse the attached mannequin image as the pose and proportion guide: keep exactly the same pose, body proportions and camera angle.\nCharacter (match the attached reference sheet exactly): " + HARU + ".\n" + ANIME + ".\nLighting: soft daylight from the upper left, form shadows on the right side of the body, soft cast shadow on the floor toward the lower right.\nPlain off-white background.\n" + NEG),
   ],
   check=["①과 ②의 자세가 같은가 (3/4 방향, 오른손 허리)", "머리 길이로 재어 키가 약 8배인가", "소맷부리·바짓단의 고리가 같은 방향으로 납작한가 (1부 2단계)", "빛은 왼쪽 위, 바닥 그림자는 오른쪽 아래인가"],
   tip="①을 건너뛰고 ②의 문장만 넣어도 그림은 나옵니다. 하지만 자세를 고치고 싶을 때 ①이 있으면 도형만 다시 만들면 됩니다."),
 2: dict(title="광원 문장만 바꿔 두 장 만들기",
   goal="같은 시아, 같은 자세에서 '빛' 문장만 바꿉니다. 2부에서 배운 대로 광원 방향과 함께 그림자가 떨어지는 쪽까지 문장으로 적습니다.",
   steps=[
    dict(key="p2_try_left", result="첫 결과: 바닥 그림자가 오른쪽 아래로 떨어졌고 몸 오른쪽이 조금 어둡습니다. 리본이 드리운 그림자와 섬 그림자는 약하게만 보입니다.", label="① 왼쪽 위 45° 한 개의 빛", ar="2/3", attach="시아 설정 시트",
         note="그림자 방향, 리본이 드리우는 그림자, 바닥 반사광까지 적었습니다.",
         alt="왼쪽 위에서 빛을 받은 시아 — 오른쪽에 입체 그림자, 리본 그림자가 가슴께에, 바닥 그림자가 오른쪽 아래로 뻗은 그림",
         prompt="Full body character illustration, vertical 2:3.\nCharacter (match the attached reference sheet exactly): " + SIA + ".\nPose: standing upright in a three-quarter view, left arm relaxed, right hand resting on the hip, calm faint smile.\nLighting: one single warm light from the upper left at about 45 degrees. Form shadows on the right side of the face, body and apron folds; the hair and the large gray bow cast shadows onto the collar and chest; small floating island shadows on the sleeve folds; a darker contact shadow under the shoes and a soft cast shadow on the floor toward the lower right; a little bounce light from the bright floor inside the shadows. The black dress still shows lighter gray on the planes facing the light.\n" + ANIME + ". Plain off-white background.\n" + NEG + " No headdress."),
    dict(key="p2_try_back", result="첫 결과: 역광 문장을 넣었지만 ①과 거의 같은 앞쪽 빛처럼 나왔습니다. 머리 가장자리의 밝은 테두리가 약하고, 바닥 그림자도 앞쪽이 아니라 오른쪽으로 떨어졌습니다. 점검표 마지막 항목을 통과하지 못한 결과입니다. 빛 문장만으로는 조명이 잘 바뀌지 않을 때가 있어, 실제 작업에서는 여러 장을 만들어 고르거나 조명 참고 그림을 함께 붙입니다.", label="② 뒤에서 오는 역광", ar="2/3", attach="시아 설정 시트",
         note="빛 문장만 바꾸고 나머지는 ①과 같습니다.",
         alt="뒤에서 빛을 받은 시아 — 머리카락과 어깨 가장자리가 밝게 빛나고 앞면은 부드러운 그림자, 바닥 그림자가 앞으로 뻗은 그림",
         prompt="Full body character illustration, vertical 2:3.\nCharacter (match the attached reference sheet exactly): " + SIA + ".\nPose: standing upright in a three-quarter view, left arm relaxed, right hand resting on the hip, calm faint smile.\nLighting: one strong backlight from behind and slightly above. A bright rim light along the hair outline, shoulders and apron edges; the front of the body in soft even shadow with gentle bounce light from the floor; the cast shadow on the floor stretches toward the viewer.\n" + ANIME + ". Plain off-white background.\n" + NEG + " No headdress."),
   ],
   check=["그림자가 광원의 반대쪽에 있는가", "리본·앞머리가 드리운 떨어지는 그림자가 있는가", "발밑(닿은 곳) 그림자가 가장 진한가", "검은 옷에도 빛 쪽에 밝은 면이 있는가", "②에서 머리 가장자리가 밝게 빛나는가"],
   tip="'그림자 방향'을 빼고 광원만 적으면, 6부 f3처럼 빛과 그림자가 어긋나는 일이 잦습니다."),
 3: dict(title="천 문장만 바꿔 두 장 만들기",
   goal="같은 모아, 같은 자세에서 옷 주름 문장만 바꿉니다. ① 바람 없는 날은 접점과 중력, ② 바람 부는 날은 한 방향 흐름을 적습니다.",
   steps=[
    dict(key="p3_try_still", result="첫 결과: 치마와 앞치마가 허리에서 곧게 처졌고, 굽힌 팔꿈치 안쪽에 니트 주름이 모였습니다.", label="① 바람 없음 — 접점과 중력", ar="2/3", attach="모아 설정 시트",
         note="주름이 시작되는 곳(어깨·허리·팔꿈치)과 처지는 방향을 적었습니다.",
         alt="바람 없는 곳에 선 모아 — 카디건이 어깨에서 늘어지고 팔꿈치 안쪽에 주름이 모이며 치마와 앞치마가 허리에서 곧게 처진 그림",
         prompt="Full body character illustration, vertical 2:3.\nCharacter (match the attached reference sheet exactly): " + MOA + ".\nPose: standing still in calm air, three-quarter view, both elbows bent with the hands loosely clasped in front of the waist, warm smile.\nFabric: the soft knit cardigan hangs from the shoulders; rounded compression folds gather inside both bent elbows; the ribbed cuffs bunch slightly at the wrists; the skirt and apron hang straight down from the waist by gravity with soft vertical drape folds; no folds in places where nothing pulls or bends.\nLighting: soft daylight from the upper left, cast shadow on the floor toward the lower right.\n" + ANIME + ". Plain off-white background.\n" + NEG),
    dict(key="p3_try_wind", result="첫 결과: 머리카락·리본·앞치마 끈·치맛단이 모두 오른쪽으로 흐릅니다. 바람 문장 한 줄로 천의 방향이 통째로 바뀌었습니다.", label="② 왼쪽에서 바람 — 한 방향 흐름", ar="2/3", attach="모아 설정 시트",
         note="천 문장만 바꿨습니다. 머리·리본·치맛단이 모두 같은 쪽으로 흐르게 적었습니다.",
         alt="왼쪽에서 부는 바람에 모아의 머리카락, 앞치마 끈, 치맛단이 모두 오른쪽으로 흐르는 그림",
         prompt="Full body character illustration, vertical 2:3.\nCharacter (match the attached reference sheet exactly): " + MOA + ".\nPose: standing three-quarter view, both elbows bent with the hands loosely clasped in front of the waist, warm smile, a few leaves in the air.\nFabric: a steady gentle breeze from the left. The hair, the headband ribbon, the apron ties, the skirt hem and the apron edge all flow to the right in the same direction with S-shaped wave edges; on the left side the fabric presses lightly against the legs; the skirt stays knee length and modest.\nLighting: soft daylight from the upper left, cast shadow on the ground toward the lower right.\n" + ANIME + ". Bright plain outdoor background with a light sky.\n" + NEG),
   ],
   check=["주름이 어깨·허리·팔꿈치 같은 접점에서 시작하는가", "①에서 치마·앞치마가 아래로 곧게 처지는가", "②에서 머리·끈·치맛단이 모두 같은 방향으로 흐르는가", "굽힌 팔꿈치 안쪽에 둥근 모임 주름이 있는가 (니트 = 부드러운 꺾임)"],
   tip="6부 f4(바람 없이 떠 있는 치마)를 다시 보면, ①의 '중력으로 처진다' 한 줄이 왜 필요한지 보입니다."),
 4: dict(title="이름만 쓴 문장과 특징을 쓴 문장 비교",
   goal="4부에서 'AI는 하루라는 이름을 모른다'고 했습니다. 실제로 이름만 넣은 프롬프트와 특징을 풀어 쓴 프롬프트를 각각 넣어 봅니다. 참고 그림은 둘 다 붙이지 않습니다.",
   steps=[
    dict(key="p4_try_name_only", result="첫 결과: 갈색 올림머리에 검은 셔츠·베이지 바지를 입은 전혀 다른 연구원이 나왔습니다. 분홍 머리·번·남색 줄이 하나도 없습니다. AI가 '하루'라는 이름을 모른다는 것이 그대로 드러난 결과입니다.", label="① 이름만", ar="2/3", attach="없음 (일부러 붙이지 않음)",
         note="이름과 직업만 적었습니다. 결과는 생성할 때마다 다르지만, 하루의 특징이 거의 남지 않는 것이 보통입니다.",
         alt="'연구실 조수 하루'라고 이름만 넣어 만든 애니풍 전신 그림 — 하루의 고정 특징이 빠진 결과",
         prompt="Full body anime illustration, vertical 2:3.\nHaru, the lab assistant.\nStanding, plain white background.\nNo text, no letters, no logos, no watermark."),
    dict(key="p4_try_features", result="첫 결과: 참고 그림 없이도 분홍 머리·번 두 개·앞머리 남색 줄·라벤더 후드티·랩코트가 모두 들어갔습니다.", label="② 특징을 풀어 씀", ar="2/3", attach="없음 (일부러 붙이지 않음)",
         note="같은 조건에서 캐릭터 고정 문장만 넣었습니다.",
         alt="하루의 특징을 풀어 쓴 문장으로 만든 애니풍 전신 그림 — 번 두 개, 앞머리 남색 줄, 라벤더 후드티와 랩코트",
         prompt="Full body anime illustration, vertical 2:3.\n" + HARU + ".\nStanding upright in a three-quarter view, right hand resting on the hip.\nPlain white background.\nNo text, no letters, no logos, no watermark, no revealing clothing, not resembling any famous anime character."),
   ],
   check=["①에 정수리 번 두 개가 있는가", "①에 앞머리 가운데 남색 줄이 있는가", "②에는 둘 다 있는가", "①의 머리색·옷이 '흔한 모습'으로 바뀌었는가 (4부 2단계 몰린 동네)"],
   tip="참고 그림을 붙이면 ①도 비슷하게 나올 수 있습니다. 그래서 이 실험은 둘 다 참고 그림 없이 비교합니다. 문장만의 힘을 보기 위해서입니다."),
 5: dict(title="조립기 문장을 그대로 넣어 보기",
   goal="5부 5단계 조립기에서 '모아 · 벤치에 앉기 · 왼쪽 위 빛 · 부드러운 천 · 반실사 · 금지 목록'을 고른 문장을 그대로 넣습니다. 이어서 세 사람을 한 장에 그려, 여러 캐릭터의 고정값이 서로 섞이지 않는지 확인합니다.",
   steps=[
    dict(key="p5_try_assembled", result="첫 결과: 리본이 왼쪽 귀 위(그림에서는 오른쪽)에 있고, 빛은 왼쪽 위에서 옵니다. 다만 화풍은 반실사보다 애니풍에 가깝게 나왔습니다.", label="① 조립기 결과 그대로", ar="2/3", attach="모아 설정 시트",
         note="조립기에서 같은 항목을 고르면 이 문장이 나옵니다.",
         alt="조립기 문장으로 만든 반실사 모아 — 벤치에 앉아 두 손을 무릎에 올리고 왼쪽 위에서 빛을 받은 그림",
         prompt="Character (keep exactly): Moa, a gentle cheerful maid intern, long ash-beige hair with soft wavy ends and neat bangs, white frilled maid headband with a thin white ribbon over the LEFT ear, amber-brown eyes, white shirt with a red and navy plaid bow tie, camel knit cardigan, white frilled apron, black skirt, white socks, brown loafers.\nPose: sitting upright on a bench, both hands resting on the knees.\nLighting: soft daylight from the upper left; form shadows on the right side of the body, cast shadow on the floor toward the lower right.\nFabric: soft fabric with rounded flowing S-shaped folds and gentle sagging; folds start from contact points (shoulders, waist, bent joints) and hang by gravity.\nStyle: semi-realistic 2.5D digital painting, realistic proportions and fabric textures, slightly stylized face.\nNegative: no text, no letters, no logos, no watermark, no pixel art, no revealing clothing, no mirrored image, not resembling any famous anime character, five fingers on each hand."),
    dict(key="p5_try_group", result="첫 결과: 세 사람의 특징이 섞이지 않았습니다. 머리띠는 모아에게만, 번은 하루에게만 있고, 세 사람의 그림자도 같은 방향(오른쪽 아래)입니다.", label="② 세 사람을 한 장에", ar="16/9", attach="하루·시아·모아 설정 시트",
         note="여러 명을 한 번에 그리면 특징이 옆 사람에게 옮겨 가기 쉽습니다. 사람마다 위치를 정하고 고정 문장을 따로 적었습니다.",
         alt="하루(왼쪽), 시아(가운데), 모아(오른쪽)가 나란히 선 애니풍 단체 그림",
         prompt="Wide group illustration, horizontal 16:9.\nThree young adult women standing side by side, full body, three-quarter view, each with her own exact design (match the attached reference sheets):\nLEFT: " + HARU + ".\nCENTER: " + SIA + ".\nRIGHT: " + MOA + ".\nKeep each character's features separate: only Moa wears a headband, only Haru has hair buns, Sia has no headdress.\nLighting: one soft daylight from the upper left for all three, cast shadows on the floor toward the lower right.\n" + ANIME + ". Bright plain studio background.\n" + NEG),
   ],
   check=["①의 리본이 왼쪽 귀 위(그림에서는 오른쪽)에 있는가", "①의 빛과 그림자 방향이 조립기 설명과 같은가", "②에서 머리띠가 시아에게 옮겨 가지 않았는가", "②에서 세 사람의 그림자 방향이 같은가"],
   tip="② 같은 단체 그림에서 특징이 섞이면, 한 사람씩 따로 만든 뒤 합치거나 사람마다 참고 그림을 붙입니다."),
 6: dict(title="고친 프롬프트로 다시 만들기",
   goal="실패 카드의 '고치는 프롬프트 조각'을 넣어 f3(빛 모순)과 f4(떠 있는 천)를 다시 만듭니다. 실패 그림과 나란히 놓고 점검표로 확인합니다.",
   steps=[
    dict(key="p6_try_fix_f3", result="첫 결과: 빛은 왼쪽 위, 몸 오른쪽이 어둡고 바닥 그림자도 오른쪽 아래로 떨어졌습니다. 위의 f3 카드와 비교하면 모순이 사라졌습니다.", label="① f3 고치기 — 광원 하나, 그림자는 반대쪽", ar="2/3", attach="시아 설정 시트",
         note="빛 문장에 그림자 방향까지 적었습니다. 위의 f3 카드와 비교해 보세요.",
         alt="f3를 고친 결과 — 왼쪽 위 빛을 받은 시아의 몸 오른쪽에 그림자, 바닥 그림자도 오른쪽 아래로 뻗은 그림",
         prompt="Full body character illustration, vertical 2:3.\nCharacter (match the attached reference sheet exactly): " + SIA + ".\nPose: standing upright in a three-quarter view, right hand resting on the hip.\nLighting: a single light source from the upper left. Form shadows on the right side of the face and body; the hair highlight on the left side of the head; the cast shadow on the floor falls toward the lower right, away from the light.\n" + ANIME + ". Plain off-white background.\n" + NEG + " No headdress."),
    dict(key="p6_try_fix_f4", result="첫 결과: 치마와 앞치마가 허리에서 자연스럽게 처지고, 가슴에 엉뚱한 주름이 없습니다. 위의 f4 카드와 비교해 보세요.", label="② f4 고치기 — 중력과 접점", ar="2/3", attach="모아 설정 시트",
         note="'바람 없음'과 '허리에서 처짐', '팔꿈치 안쪽 모임 주름'을 적었습니다.",
         alt="f4를 고친 결과 — 바람 없는 곳에서 모아의 치마와 앞치마가 허리에서 자연스럽게 처진 그림",
         prompt="Full body character illustration, vertical 2:3.\nCharacter (match the attached reference sheet exactly): " + MOA + ".\nPose: standing still, three-quarter view, right hand resting on the hip so the right elbow is bent.\nFabric: still air. The skirt and apron hang naturally by gravity from the waist with soft vertical folds; soft compression folds gather inside the bent right elbow; the straight left sleeve is smooth; no decorative fold lines on the chest.\nLighting: soft daylight from the upper left, cast shadow toward the lower right.\n" + ANIME + ". Plain off-white background.\n" + NEG),
   ],
   check=["점검표 ① 구조 — 비례·자세가 자연스러운가", "점검표 ② 빛 — 그림자가 광원 반대쪽인가", "점검표 ③ 천 — 주름이 접점에서 시작하고 아래로 처지는가", "점검표 ④ 고정값 — 시아 머리 장식 없음, 모아 리본 왼쪽 귀 위", "점검표 ⑤ 화풍 — 화풍이 하나로 통일되었는가"],
   tip="고친 문장으로도 실패가 다시 나올 수 있습니다. 그럴 때는 여러 장을 만들어 점검표를 통과한 것만 씁니다."),
}

def requests():
    """Genspark 요청 대화 묶음: (대화 이름, 비율, [키...], 안내)"""
    return [
     ("C12", "2:3", ["p1_try_step1", "p1_try_step2", "p2_try_left", "p2_try_back"], "1부·2부 실습. p1_try_step2는 바로 앞에서 만든 p1_try_step1 그림을 함께 첨부하세요."),
     ("C13", "2:3", ["p3_try_still", "p3_try_wind", "p5_try_assembled"], "3부·5부 실습."),
     ("C14", "2:3", ["p4_try_name_only", "p4_try_features"], "4부 실습. **반드시 새 대화에서, 참고 그림 없이** 만드세요. 이전 대화의 하루 그림이 섞이면 실험이 성립하지 않습니다. 결과가 어떻게 나오든 고치지 말고 첫 결과를 그대로 저장해 주세요."),
     ("C15", "2:3", ["p6_try_fix_f3", "p6_try_fix_f4"], "6부 실습."),
     ("C16", "16:9", ["p5_try_group"], "5부 실습(단체 그림)."),
    ]

def step_by_key(k):
    for n in TRY:
        for st in TRY[n]["steps"]:
            if st["key"] == k:
                return n, st
