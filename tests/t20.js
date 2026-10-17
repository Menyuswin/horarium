const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,9,0,0)});
await pg.goto(require('./env').URL);await pg.evaluate(()=>{S.onboarded=true;save();render()});
// a task can be given its own start time and duration on creation
await pg.fill('#f-title','Beszámoló');await pg.fill('#f-start','11:00');
const pi=await pg.$('#f-plan');await pi.fill('45');
await pg.click('[data-act="add"]');
const t=await pg.evaluate(()=>S.tasks.find(x=>x.title==='Beszámoló'));
ok(t.start==='11:00'&&t.plan===45,'task saved with its own start and duration: '+JSON.stringify(t));
// it shows up under the scheduled list on the day plan, in order
await pg.click('[data-v="nap"]');
ok((await pg.textContent('#app')).includes('Beütemezve')&&(await pg.textContent('.task .meta')).includes('11:00–11:45'),'scheduled task shows its time range');
// editing the time later also works, and can be cleared back to unscheduled
await pg.click('[data-act="open"][data-id="'+t.id+'"]');await pg.click('[data-act="edit"][data-id="'+t.id+'"]');
await pg.fill('#e-start','');await pg.click('[data-act="esave"][data-id="'+t.id+'"]');
ok(!(await pg.evaluate(id=>S.tasks.find(x=>x.id===id).start,t.id)),'clearing the time field unschedules the task');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
