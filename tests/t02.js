const {chromium}=require('playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
await pg.fill('#f-title','Pause teszt');await pg.click('[data-act="add"]');
await pg.click('[data-act="start"]');await pg.click('[data-act="go"]');
await pg.evaluate(()=>{S.timer.startAt-=10*60000;S.timer.began=S.timer.startAt});
await pg.click('[data-act="pause"]');
const t0=await pg.textContent('#t-time');await pg.waitForTimeout(1600);
ok((await pg.textContent('#t-time'))===t0,'time frozen while paused: '+t0);
ok((await pg.textContent('#app')).includes('Szünetel'),'paused label');
await pg.click('[data-act="pwhy"][data-k="zene"]');
// simulate 5 min pause, then resume: remaining must be unchanged
await pg.evaluate(()=>{S.timer.pausedAt-=5*60000;S.timer.startAt-=5*60000;S.timer.pauses[0].at-=5*60000});
await pg.click('[data-act="resume"]');await pg.waitForTimeout(700);
const rem=await pg.textContent('#t-time');ok(rem==='40:00'||rem==='39:59','remaining ~40:00 after resume: '+rem);
// capture
await pg.click('[data-act="cap"]');await pg.fill('#c-note','Írni Marinak');await pg.selectOption('#c-type','kulso');
await pg.click('[data-act="capsave"][data-todo="1"]');
ok(await pg.evaluate(()=>S.tasks.some(t=>t.title==='Írni Marinak')),'distraction became a task');
await pg.fill('#c-note','Éhes vagyok');await pg.click('[data-act="capsave"]:not([data-todo])');
await pg.click('[data-act="stop"]');
await pg.click('[data-act="refl"][data-o="igen"]');
const x=await pg.evaluate(()=>S.sessions[0]);
ok(x.actual===10&&x.pauses.length===1&&x.pauses[0].k==='zene'&&x.pauses[0].ms>=299000,'session pause logged '+JSON.stringify(x.pauses));
ok(x.distractions.length===2&&x.distractions[0].type==='kulso'&&x.distractions[0].taskId,'distractions logged');
// reload while paused keeps pause
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
