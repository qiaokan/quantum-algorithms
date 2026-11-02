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
 for(const route of ['/lessons/deutsch/','/lessons/qft/','/lessons/singular-value-transformation/','/lessons/formula-evaluation/','/lessons/hallgren/','/coverage/','/prerequisites/']){await page.goto(route);const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));expect(widths.scroll,route).toBeLessThanOrEqual(widths.width+1)}
 await page.goto('/lessons/deutsch/');await page.locator('#full-detail').click();expect(await page.locator('main details:not([open])').count()).toBe(0);await page.emulateMedia({media:'print'});await expect(page.locator('#sidebar')).not.toBeVisible();
});

test('reading-layout screenshots for visual inspection',async({page},info)=>{
 await page.goto('/lessons/deutsch/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`docs/screenshots/deutsch-${info.project.name}.png`,fullPage:false});
 await page.goto('/lessons/grover/#interactive-example');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('[data-operation]')).toContainText('Step 0');
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const demo=document.querySelector('[data-demo]')!;window.scrollTo({top:demo.getBoundingClientRect().top+scrollY-90,behavior:'instant'})});
 await expect(page.locator('[data-demo]')).toBeInViewport();await page.screenshot({path:`docs/screenshots/grover-demo-${info.project.name}.png`,fullPage:false});
});
