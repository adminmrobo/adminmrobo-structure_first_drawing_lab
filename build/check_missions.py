import asyncio
from playwright.async_api import async_playwright
async def setr(page,sc,name,v):
    await page.evaluate("([sc,n,v])=>{const e=document.querySelector('#'+sc+' [name='+n+']');if(e.type==='checkbox'){e.checked=v;}else e.value=v;e.dispatchEvent(new Event(e.type==='range'?'input':'change',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));}",[sc,name,v])
async def done(page,sc): return await page.evaluate("sc=>[...document.querySelectorAll('#'+sc+' .missions li')].map(l=>l.classList.contains('done'))",sc)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        page=await b.new_page();await page.route('**/fonts.g*/**',lambda r: r.abort())
        await page.goto("http://localhost:8765/practice/index.html#studio");await page.wait_for_timeout(800)
        print('studio before',await done(page,'studio'))
        await setr(page,'studio','az',135);await setr(page,'studio','elev',45)
        await setr(page,'studio','size',20);await setr(page,'studio','hgt',40)
        await setr(page,'studio','elev',-20)
        print('studio after',await done(page,'studio'))
        await page.click('.tabs button[data-t=wardrobe]')
        print('wardrobe before',await done(page,'wardrobe'))
        await setr(page,'wardrobe','gap',70);await page.wait_for_timeout(6000)
        await setr(page,'wardrobe','dh',6);await page.wait_for_timeout(6000)
        await setr(page,'wardrobe','gather',True);await page.wait_for_timeout(6000)
        print('wardrobe after',await done(page,'wardrobe'))
        await page.click('.tabs button[data-t=workshop]')
        for n,v in [('who','moa'),('pose','hip'),('light','ul'),('fab','soft'),('sty','photo'),('neg',True)]: await setr(page,'workshop',n,v)
        print('workshop after',await done(page,'workshop'))
        await page.click('.tabs button[data-t=desk]')
        # 정답 버튼 자동 선택: 증상 문장으로 원인 찾기
        SYM=['분홍 머리인데','리본이 오른쪽','몸은 왼쪽 빛','바람이 없는데','손가락이','옷은 같은데','큰 네모가','몸 반은']
        CA=['고정값 누락','좌우 반전','광원 모순','접점·중력 무시','작은 특징 단계 오류(손)','강도 너무 높음','늘리기만 함(강도 너무 낮음)','화풍 충돌']
        for _ in range(60):
            sym=await page.text_content('#desk .sym');k=[i for i,s in enumerate(SYM) if s in sym][0]
            await page.click(f"#desk .deskopts button:text-is('{CA[k]}')");await page.wait_for_timeout(560)
        print('desk after',await done(page,'desk'))
        await b.close()
asyncio.run(main())
