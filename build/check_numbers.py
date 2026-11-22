# -*- coding: utf-8 -*-
"""본문 '숫자로 한 번 해 보기'와 평가 점수 검산. python3 build/check_numbers.py"""
import math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from content_a import P1, P2, P3
from content_b import P4, P5, P6
ok = True
def chk(name, got, want, tol=0.01):
    global ok
    good = abs(got - want) <= tol
    ok &= good
    print(("OK " if good else "XX "), name, round(got, 4), "기대", want)
s = math.sin; r = math.radians
chk("1-2 sin30", s(r(30)), 0.5); chk("1-2 지름8×0.5", 8 * s(r(30)), 4)
chk("1-4 가운데 줄", s(r(30)) - s(0), 0.5); chk("1-4 둘째 줄", s(r(60)) - s(r(30)), 0.366, 0.001); chk("1-4 가장자리", 1 - s(r(60)), 0.134, 0.001)
chk("2-1 cos60", math.cos(r(60)), 0.5)
chk("2-4 높이10", 20 * 10 / 200, 1); chk("2-4 높이50", 20 * 50 / 200, 5)
chk("3-4 90°", 5 * math.pi / 2, 7.9, 0.06); chk("3-4 45°", 5 * math.pi / 4, 3.9, 0.06); chk("3-4 120°", 5 * 2 * math.pi / 3, 10.5, 0.06); chk("3-4 반지름8", 8 * math.pi / 2, 12.6, 0.06)
chk("4-3 √0.64", math.sqrt(0.64), 0.8); chk("4-3 √0.36", math.sqrt(0.36), 0.6); chk("4-3 섞기", 0.8 * 200 + 0.6 * -50, 130); chk("4-3 제곱합", 0.8**2 + 0.6**2, 1)
chk("4-4 w1", 10 + 1 * (14 - 10), 14); chk("4-4 w7", 10 + 7 * (14 - 10), 38)
chk("5-3 0.2", 0.2 * 30, 6); chk("5-3 0.6", 0.6 * 30, 18); chk("5-3 0.9", 0.9 * 30, 27)
for P in (P1, P2, P3, P4, P5, P6):
    J = P["judge"]; print("   ", P["no"], "부 평가", sum(J["a"][1]), ":", sum(J["b"][1]), J["result"][0][2][:16])
print("전체 통과" if ok else "검산 실패"); sys.exit(0 if ok else 1)
