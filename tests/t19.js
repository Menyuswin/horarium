const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,10,0,0)});
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;S.settings.pet.name='B';const d=today(),tmw=ymd(addDays(new Date(),1));
  const mk=(title,mode,plan,start,date)=>({id:uid(),date:date||d,title,mode,plan,done:0,star:false,completed:false,postponed:0,start});
  S.tasks=[mk('Reggeli levelek','munka',60,'07:00'),mk('Jelenlegi','munka',60,'09:30'),mk('Esti olvasás','tanulas',30,'19:00'),mk('Holnapi','munka',30,'08:00',tmw)];
  save();view='nap';render()});
// scheduled tasks are listed in start-time order under "Beütemezve"
ok((await pg.$$eval('.task .meta b',l=>l.map(x=>x.textContent))).join(' ').indexOf('07:00')<(await pg.$$eval('.task .meta b',l=>l.map(x=>x.textContent))).join(' ').indexOf('19:00'),'scheduled tasks sorted by start time');
// the task whose window covers "now" (10:00) is marked current
ok(await pg.evaluate(()=>document.querySelector('.task.now .title').textContent.includes('Jelenlegi')),'current task marked');
await pg.clock.setFixedTime(new Date(2026,9,12,20,0,0));await pg.evaluate(()=>render());
ok(!(await pg.$('.task.now')),'nothing current once the day is past its last window');
// a different day shows its own tasks
await pg.click('[data-act="pday"][data-d="2026-10-13"]');
ok((await pg.textContent('#app')).includes('Holnapi')&&!(await pg.textContent('#app')).includes('Reggeli levelek'),'another day shows only its own tasks');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
