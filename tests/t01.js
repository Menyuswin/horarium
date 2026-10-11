const {chromium}=require('playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
// old state without sessions must still load
await pg.addInitScript(()=>{if(!localStorage.getItem('horarium-v1'))localStorage.setItem('horarium-v1',JSON.stringify({v:2,tasks:[],log:{},hourLog:{},plan:{}}))});
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
await pg.fill('#f-title','Teszt feladat');await pg.click('[data-act="add"]');
await pg.click('[data-act="start"]');
ok(await pg.isVisible('#s-intent'),'intent panel shows');
await pg.fill('#s-intent','Fejezet átolvasása');await pg.fill('#s-done','3 jegyzetpont');
await pg.click('[data-act="go"]');
ok((await pg.textContent('#app')).includes('Fejezet átolvasása'),'intent shown on timer');
// fake 12 minutes elapsed, then stop
await pg.evaluate(()=>{S.timer.startAt-=12*60000;});
await pg.click('[data-act="stop"]');
ok(await pg.isVisible('#r-dist'),'reflection panel shows');
await pg.selectOption('#r-dist','kulso');await pg.click('[data-act="refl"][data-o="reszben"]');
const s=await pg.evaluate(()=>JSON.parse(localStorage.getItem('horarium-v1')).sessions);
ok(s.length===1&&s[0].actual===12&&s[0].outcome==='reszben'&&s[0].distraction==='kulso'&&s[0].intent==='Fejezet átolvasása','session saved '+JSON.stringify(s[0]));
ok(!(await pg.isVisible('#r-dist')),'reflection closed');
// natural end
await pg.click('[data-act="start"]');await pg.click('[data-act="go"]');
await pg.evaluate(()=>{S.timer.startAt-=S.timer.durMs+1000;});await pg.waitForTimeout(900);
ok(await pg.isVisible('#r-dist'),'reflection after natural end');
await pg.click('[data-act="rskip"]');
const n=await pg.evaluate(()=>S.sessions.length);ok(n===2,'two sessions');
await pg.reload();ok((await pg.evaluate(()=>S.sessions.length))===2,'persists after reload');
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
