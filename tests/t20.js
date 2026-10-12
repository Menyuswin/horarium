const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const ctx=await b.newContext({viewport:{width:1280,height:800}});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,10,0,0)});
await pg.goto(require('./env').URL);
// intro: setup step comes after the pet choice and applies the weekday template
await pg.click('[data-act="intro"][data-s="1"]');await pg.click('[data-act="intro"][data-s="2"]');
ok((await pg.textContent('#app')).includes('Mikor kezdődik a napod'),'setup step shown');
await pg.fill('#r-wake','06:30');await pg.fill('#r-ws','08:00');await pg.fill('#r-we','15:00');
await pg.click('[data-act="intro"][data-s="3"]');
const wd=await pg.evaluate(()=>S.settings.templates.wd.map(x=>x.start+'-'+x.end+' '+x.title));
ok(wd[0].startsWith('06:30-07:30')&&wd.some(x=>x.startsWith('08:00-11:00 Munka'))&&wd.some(x=>x.includes('Ebéd')),'template built from the three times: '+wd.join(' | '));
const ov=await pg.evaluate(()=>{const a=S.settings.templates.wd.map(x=>[tm(x.start),tm(x.end)]);return a.some((x,i)=>i&&x[0]<a[i-1][1])});ok(!ov,'no overlapping blocks');
// invalid order blocks the step
await pg.evaluate(()=>{introStep=2;render()});await pg.fill('#r-ws','05:00');await pg.click('[data-act="intro"][data-s="3"]');
ok((await pg.textContent('#app')).includes('sorrendje')&&(await pg.evaluate(()=>introStep))===2,'bad order stays on the step');
await pg.fill('#r-ws','08:00');await pg.click('[data-act="introdone"]');
ok(await pg.evaluate(()=>S.onboarded&&S.settings.rhythm.done),'intro finished, rhythm done');
// left menu on a wide screen
const box=await pg.$eval('nav',e=>{const r=e.getBoundingClientRect();return[r.left,r.width,r.height]});
ok(box[0]<20&&box[1]>200&&box[2]>400,'left menu column on wide screen '+box.map(Math.round));
const mb=await pg.$eval('main',e=>e.getBoundingClientRect().left);ok(mb>=250,'content sits right of the menu: '+Math.round(mb));
// day band: current block
const cap=await pg.textContent('#band .bcap');ok(/10:00/.test(cap)&&/Munka/.test(cap),'band caption: '+cap);
const x1=await pg.$eval('.bnow',e=>parseFloat(e.style.left));
await pg.clock.setFixedTime(new Date(2026,9,12,12,0,0));await pg.waitForTimeout(1500);
const x2=await pg.$eval('.bnow',e=>parseFloat(e.style.left));ok(x2>x1&&(await pg.textContent('#band .bcap')).includes('12:00'),'band marker moves on its own '+x1+' -> '+x2);
await pg.click('#band .band');ok(await pg.evaluate(()=>view)==='nap','band opens the day plan');
// "+" from another view
await pg.click('[data-v="het"]');await pg.click('nav .newbtn');ok(await pg.isVisible('#q-title'),'quick add opens from Hét');
await pg.fill('#q-title','Gyors teszt');await pg.click('[data-act="qaday"][data-o="1"]');await pg.click('[data-act="qamode"][data-k="tanulas"]');await pg.click('[data-act="qaplan"][data-m="25"]');
await pg.click('[data-act="qasave"]');
const t=await pg.evaluate(()=>S.tasks.find(x=>x.title==='Gyors teszt'));
ok(t&&t.mode==='tanulas'&&t.plan===25&&t.date==='2026-10-13','task saved with day, mode, length');
ok(!(await pg.$('#q-title'))&&(await pg.textContent('.qtoast')).includes('Felvettük')&&(await pg.evaluate(()=>view))==='het','panel closes, toast, stays on view');
await pg.click('[data-v="beall"]');await pg.keyboard.press('Escape');await pg.click('nav .newbtn');await pg.keyboard.press('Escape');ok(!(await pg.$('#q-title')),'Esc closes');
await pg.click('nav .newbtn');await pg.fill('#q-title','Enterrel');await pg.press('#q-title','Enter');ok(await pg.evaluate(()=>S.tasks.some(x=>x.title==='Enterrel')),'Enter saves');
// settings: apply rhythm
await pg.click('[data-v="beall"]');await pg.evaluate(()=>{openSecs.add('ritmus');render()});
await pg.fill('#r-we','17:00');await pg.click('[data-act="rhythmsave"]');
ok(await pg.evaluate(()=>S.settings.templates.wd.some(x=>x.title==='Munka'&&x.end==='17:00'||x.end>'16:59'&&x.title==='Munka')),'settings apply updates the template');
// phone width: bottom bar + FAB, no side column
const pp=await b.newPage({viewport:{width:390,height:800}});await pp.addInitScript(()=>{});
await pp.goto(require('./env').URL);await pp.evaluate(()=>{S.onboarded=true;save();render()});
ok(await pp.isVisible('.fab')&&!(await pp.isVisible('nav .newbtn')),'phone: FAB shown, no menu button');
const nb=await pp.$eval('nav',e=>e.getBoundingClientRect().top);ok(nb>600,'phone: nav at the bottom '+Math.round(nb));
ok(await pp.isVisible('#band .band'),'phone: band on top');
await pp.click('.fab');ok(await pp.isVisible('#q-title'),'phone: panel opens');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
