const {chromium}=require('playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
await pg.clock.install({time:new Date(2026,9,12,18,0,0)});
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
// empty day
await pg.click('[data-v="este"]');
ok((await pg.textContent('#app')).match(/Ma nem gyűlt fókuszidő|Ma más volt a fontos/)!==null,'empty-day story is kind');
// plan adherence: full block
await pg.click('[data-v="ma"]');
await pg.fill('#f-title','Olvasás');await pg.click('[data-act="add"]');
await pg.click('[data-act="start"]');await pg.fill('#s-intent','Két fejezet');await pg.click('[data-act="go"]');
await pg.evaluate(()=>{S.timer.startAt-=S.timer.durMs+1000;S.timer.began=S.timer.startAt});
await pg.clock.runFor(1200);
ok(await pg.evaluate(()=>S.petNote&&/végig kitartott/.test(S.petNote.text)),'full block -> pet cheer note');
ok((await pg.textContent('#app')).includes('büszke'),'cheer shown in pet panel');
await pg.click('[data-act="rskip"]').catch(()=>{});
// early stop at 50% -> no note
await pg.evaluate(()=>{S.petNote=null});
await pg.click('[data-act="start"]');await pg.click('[data-act="go"]');
await pg.evaluate(()=>{S.timer.startAt-=Math.round(S.timer.durMs*0.5);S.timer.began=S.timer.startAt});
await pg.click('[data-act="stop"]');
ok(await pg.evaluate(()=>!S.petNote),'half block -> no note, no scolding');
// near-plan stop at 85%
await pg.evaluate(()=>{S.reflect=null});await pg.reload();
await pg.click('[data-act="start"]');await pg.click('[data-act="go"]');
await pg.evaluate(()=>{S.timer.startAt-=Math.round(S.timer.durMs*0.85);S.timer.began=S.timer.startAt});
await pg.click('[data-act="stop"]');
ok(await pg.evaluate(()=>S.petNote&&/nagyjából a tervezett/.test(S.petNote.text)),'85% -> near-plan note');
// evening story with a rated session and a captured distraction
await pg.evaluate(()=>{const x=S.sessions[0];x.outcome='igen';x.distractions=[{type:'kulso',note:'a',at:1,taskId:'z'}];S.tasks[0].completed=true;save()});
await pg.click('[data-v="este"]');
const t=await pg.textContent('#app');
ok(/fókusz gyűlt össze 3 blokkban/.test(t)&&/A legjobb blokk: „Olvasás”/.test(t)&&/Így indította: „Két fejezet”/.test(t)&&/1 feladatot zártál le/.test(t)&&/1 zavaró gondolatot írtál le.*1 teendő lett belőle/.test(t),'evening story from own data: '+t.slice(0,260));
// pet off -> plain panel, no pet name
await pg.evaluate(()=>{S.settings.pet.on=false;save();render()});
ok(!(await pg.isVisible('#pet-svg'))&&(await pg.textContent('#app')).includes('A mai nap'),'story without pet');
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
