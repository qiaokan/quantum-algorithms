import{test,expect}from'@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('lesson, stable anchors, sidebar order and equation rendering',async({page,isMobile})=>{
 await page.goto('/lessons/deutsch/#interference-and-final-output');await expect(page.locator('h1')).toHaveText('Deutsch’s algorithm');await expect(page.locator('#interference-and-final-output')).toBeInViewport();await expect(page.locator('.katex').first()).toBeAttached();expect(await page.locator('.katex-error').count()).toBe(0);
 if(isMobile)await page.locator('#menu-toggle').click();
 const seq=await page.locator('#sidebar [data-sequence]').evaluateAll(nodes=>nodes.map(n=>Number(n.getAttribute('data-sequence'))));expect(seq[0]).toBe(1);expect(seq[1]).toBe(2);expect(seq).toEqual([...seq].sort((a,b)=>a-b));await expect(page.locator('#sidebar [aria-current="page"]')).toContainText('Deutsch');
 if(isMobile)await page.getByRole('button',{name:'Close contents'}).click();
 await page.locator('.prev-next').getByRole('link',{name:/NEXT LESSON/}).click();await expect(page.locator('h1')).toHaveText('Grover’s algorithm');
});
test('nested prerequisite stack restores the exact lesson and scroll position',async({page})=>{
 await page.goto('/lessons/deutsch/');const link=page.locator('main a[href="/definitions/matrices/"]').first();await link.scrollIntoViewIfNeeded();const y=await page.evaluate(()=>scrollY);await link.click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#definition-title')).toHaveText('Matrices as operations');await page.locator('#definition-body a[href="/definitions/matrix-multiplication/"]').click();await expect(page.locator('#definition-title')).toHaveText('Matrix multiplication');await page.getByRole('button',{name:'Return to previous explanation'}).click();await expect(page.locator('#definition-title')).toHaveText('Matrices as operations');await page.locator('#definition-back').click();await expect(page.getByRole('dialog')).not.toBeVisible();expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(3);await expect(link).toBeFocused();expect(page.url()).toContain('/lessons/deutsch/');
});
test('searches aliases, symbols and full lesson text with section links',async({page})=>{
 await page.goto('/search/?q=postselection');await expect(page.locator('.search-result').first()).toBeVisible();await page.getByRole('searchbox').fill('dagger');await expect(page.locator('#search-results')).toContainText('Conjugate transpose');await page.getByRole('searchbox').fill('function-dependent');await expect(page.locator('.search-result').first()).toBeVisible();await page.locator('.search-result a').first().click();expect(page.url()).toContain('/lessons/');
});
test('demos calculate next previous reset changes and sampled counts',async({page})=>{
 await page.goto('/lessons/grover/#interactive-example');const demo=page.locator('[data-demo]');await expect(demo.locator('[data-operation]')).toContainText('Step 0');await demo.locator('[data-instance]').selectOption('2');for(let i=0;i<4;i++)await demo.getByRole('button',{name:'Next step',exact:false}).click();await expect(demo.locator('[data-state]')).toContainText('10');await expect(demo.locator('[data-state]')).toContainText('100.000%');await demo.getByRole('button',{name:'Sample 256 measurements'}).click();await expect(demo.locator('[data-samples]')).toContainText('10: 256');await demo.getByRole('button',{name:'Previous step',exact:false}).click();await expect(demo.locator('[data-operation]')).toContainText('Oracle 1');await demo.getByRole('button',{name:'Reset',exact:true}).click();await expect(demo.locator('[data-operation]')).toContainText('Step 0');await expect(demo.getByRole('button',{name:'Previous step',exact:false})).toBeDisabled();
});
test('all seven demonstrations have working controls and no runtime exceptions',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));for(const id of ['deutsch','grover','bernstein-vazirani','deutsch-jozsa','simon','qft','phase-estimation']){await page.goto(`/lessons/${id}/#interactive-example`);const demo=page.locator('[data-demo]');await expect(demo.locator('[data-state] tr').first()).toBeAttached();const next=demo.locator('[data-next]');while(await next.isEnabled())await next.click();await expect(demo.locator('[data-operation]')).not.toBeEmpty();await demo.locator('[data-sample]').click();await expect(demo.locator('[data-samples]')).toContainText('256');if(id==='simon')await expect(demo.locator('[data-simon-equations]')).toContainText('011');}expect(errors).toEqual([]);
});
test('progress is explicit and persists without equating scrolling with learning',async({page})=>{
 await page.goto('/lessons/deutsch/');await page.evaluate(()=>localStorage.clear());await page.reload();await expect(page.locator('[data-progress-status]')).toHaveText('No learning status selected.');await page.locator('[data-progress="practiced"]').click();await page.reload();await expect(page.locator('[data-progress="practiced"]')).toHaveAttribute('aria-pressed','true');await page.goto('/progress/');await expect(page.locator('[data-status-for="deutsch"]')).toHaveText('practiced');await page.goto('/');await expect(page.locator('#resume-reading')).toContainText('Deutsch');
});
test('keyboard focus, theme persistence and accessible page structure',async({page,isMobile})=>{
 await page.goto('/lessons/deutsch/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to lesson'})).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();await page.locator('#theme-toggle').click();await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');if(isMobile){await page.locator('#menu-toggle').click();await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded','false')}
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});
test('full detail and print expose actual derivations; no horizontal viewport overflow',async({page})=>{
 for(const route of ['/lessons/deutsch/','/lessons/qft/','/lessons/singular-value-transformation/','/lessons/formula-evaluation/','/lessons/hallgren/','/coverage/','/prerequisites/']){await page.goto(route);const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));expect(widths.scroll,route).toBeLessThanOrEqual(widths.width+1)}
 await page.goto('/lessons/grover/');await page.locator('#full-detail').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);expect(await page.locator('main details[data-derivation]:not([open])').count()).toBe(0);expect(await page.locator('#practice details[open]').count()).toBe(0);await page.reload();expect(await page.locator('#practice details[open]').count()).toBe(0);await page.locator('#theme-toggle').click();await page.emulateMedia({media:'print'});await expect(page.locator('#sidebar')).not.toBeVisible();await expect(page.locator('.context-box').first()).toHaveCSS('background-color','rgb(243, 243, 243)');
});

test('reading-layout screenshots for visual inspection',async({page},info)=>{
 await page.goto('/lessons/deutsch/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`docs/screenshots/deutsch-${info.project.name}.png`,fullPage:false});
 await page.goto('/lessons/grover/#interactive-example');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('[data-operation]')).toContainText('Step 0');
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const demo=document.querySelector('[data-demo]')!;window.scrollTo({top:demo.getBoundingClientRect().top+scrollY-90,behavior:'instant'})});
 await expect(page.locator('[data-demo]')).toBeInViewport();await page.screenshot({path:`docs/screenshots/grover-demo-${info.project.name}.png`,fullPage:false});
});

test('malformed saved progress cannot disable definitions or progress controls',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('qa-progress','null'));
 await page.goto('/lessons/deutsch/');
 await expect(page.locator('[data-progress-status]')).toHaveText('No learning status selected.');
 await page.locator('[data-progress="read"]').click();await expect(page.locator('[data-progress="read"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('main a[href="/definitions/matrices/"]').first().click();await expect(page.getByRole('dialog')).toBeVisible();
 await page.goto('/progress/');await expect(page.locator('[data-status-for="deutsch"]')).toHaveText('Not marked');
 expect(errors).toEqual([]);
});

test('Simon only treats final measurements as hidden-mask equations',async({page})=>{
 await page.goto('/lessons/simon/#interactive-example');const demo=page.locator('[data-demo]');
 await expect(demo.locator('[data-operation]')).toContainText('Step 0');
 await demo.locator('[data-sample]').click();await expect(demo.locator('[data-simon-equations]')).toContainText('not hidden-mask equations');
 await demo.locator('[data-circuit] button').last().click();await demo.locator('[data-sample]').click();
 await expect(demo.locator('[data-simon-equations]')).toContainText('011');
 await expect(demo.locator('[data-query-count]')).toContainText('per circuit run');await expect(demo.locator('[data-samples]')).toContainText('256 base-oracle calls in total');
 await expect(demo.locator('[data-simon-equations]')).not.toContainText('not hidden-mask equations');
});

test('circuit-step buttons retain keyboard focus after changing the state',async({page})=>{
 await page.goto('/lessons/deutsch/#interactive-example');const step=page.locator('[data-circuit] button').nth(2);
 await step.focus();await page.keyboard.press('Enter');await expect(step).toBeFocused();
 await expect(page.locator('[data-operation]')).toContainText('Step 2');
});

test('search failures remain actionable when a new query is entered',async({page})=>{
 await page.route('**/search-index.json',route=>route.abort());await page.goto('/search/');
 await expect(page.locator('#search-status')).toContainText('could not be loaded');
 await page.getByRole('searchbox').fill('Shor');await page.getByRole('button',{name:'Search',exact:true}).click();
 await expect(page.locator('#search-status')).toContainText('could not be loaded');
});

test('rapid definition requests keep only the last chosen explanation',async({page})=>{
 let requests=0;
 let release!:()=>void;const pending=new Promise<void>(resolve=>release=resolve);
 await page.route('**/definitions.json',async route=>{requests++;await pending;await route.continue()});
 await page.goto('/lessons/deutsch/');
 const first=page.locator('main a[href="/definitions/matrices/"]').first();
 const last=page.locator('main a[href="/definitions/tensor-products/"]').first();
 await first.click();await expect.poll(()=>requests).toBe(1);await last.click();release();
 await expect(page.locator('#definition-title')).toHaveText('Tensor products');
 await expect(page.locator('#definition-stack')).toHaveText('Lesson → Tensor products');
 expect(requests).toBe(1);
 await page.locator('#definition-back').click();await expect(page.getByRole('dialog')).not.toBeVisible();await expect(last).toBeFocused();
});

test('reading still works when browser storage is unavailable',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage disabled')}}));
 await page.goto('/lessons/deutsch/');await page.locator('[data-progress="read"]').click();await expect(page.locator('[data-progress-status]')).toHaveText('Your status: read');
 await page.locator('main a[href="/definitions/matrices/"]').first().click();await expect(page.getByRole('dialog')).toBeVisible();
 expect(errors).toEqual([]);
});

test('320-pixel reading layout reflows and remains accessible in dark mode',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 for(const route of ['/','/lessons/deutsch/','/lessons/singular-value-transformation/','/search/','/coverage/']){
  await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth),route).toBeLessThanOrEqual(321);
 }
 await page.goto('/lessons/deutsch/');await page.locator('#theme-toggle').click();
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});


test('practice math, bibliography ordering and full-text search include supporting content',async({page})=>{
 await page.goto('/lessons/bernstein-vazirani/');
 await expect(page.locator('#practice .katex').first()).toBeAttached();
 expect(await page.evaluate(()=>Boolean(document.getElementById('interactive-example')!.compareDocumentPosition(document.getElementById('references')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
 const records=await (await page.request.get('/search-index.json')).json();
 expect(records.some((r:{kind:string;text:string})=>r.kind==='Exercise'&&r.text.includes('repeated row adds no rank'))).toBe(true);
 expect(records.some((r:{kind:string;text:string})=>r.kind==='Module revisit'&&r.text.includes('output contracts differ'))).toBe(true);
 expect(records.some((r:{section:string})=>r.section==='Overview')).toBe(true);
});

test('single character typing does not navigate and nonlesson dialogs identify the page',async({page})=>{
 await page.goto('/definitions/density-matrices/');
 await page.keyboard.press('/');expect(new URL(page.url()).pathname).toBe('/definitions/density-matrices/');
 await page.locator('main a[href="/definitions/outer-products/"]').first().click();
 await expect(page.locator('#definition-stack')).toHaveText('Page → Outer products and projectors');
 await expect(page.locator('#definition-back')).toHaveText('← Return to page');
 await page.keyboard.press('/');await expect(page.getByRole('dialog')).toBeVisible();
 await page.locator('#definition-back').click();expect(new URL(page.url()).pathname).toBe('/definitions/density-matrices/');
});


test('every authored chapter reflows with all worked answers expanded',async({page})=>{
 test.setTimeout(90000);
 const curriculum=await (await page.request.get('/curriculum.json')).json();
 for(const lesson of curriculum.lessons){
  if(lesson.editorial==='planned')continue;
  await page.goto(`/lessons/${lesson.id}/`);
  await page.evaluate(()=>{document.querySelectorAll<HTMLDetailsElement>('main details').forEach(d=>d.open=true)});
  await page.evaluate(()=>document.fonts.ready);
  const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
  const longMath=await page.locator('.katex').evaluateAll(nodes=>nodes.filter(e=>!e.closest('.katex-display')&&e.getBoundingClientRect().width>document.documentElement.clientWidth-46).map(e=>e.querySelector('annotation')?.textContent));
  expect.soft(widths.scroll,`${lesson.id}: ${longMath.join('; ')}`).toBeLessThanOrEqual(widths.width+1);
 }
});

test('phone lessons open with the title on screen and the section list collapsed',async({page,isMobile})=>{
 await page.goto('/lessons/deutsch/');const toc=page.locator('.toc-details');
 if(!isMobile){await expect(toc).toHaveAttribute('open','');await page.locator('.toc-details > summary').click({force:true});await expect(toc).toHaveAttribute('open','');return}
 await expect(toc).not.toHaveAttribute('open','');await expect(page.locator('h1')).toBeInViewport();
 await page.locator('.toc-details > summary').click();await page.locator('[data-section-link="interference-and-final-output"]').click();
 await expect(toc).not.toHaveAttribute('open','');await expect(page.locator('#interference-and-final-output')).toBeInViewport();
});

test('inline math inside disclosure labels and exercise answers is typeset',async({page})=>{
 await page.goto('/lessons/hallgren/');expect(await page.locator('summary .katex').count()).toBeGreaterThan(0);
 await page.goto('/lessons/amplitude-amplification/');await expect(page.locator('#practice')).not.toContainText('A-dagger');
});
