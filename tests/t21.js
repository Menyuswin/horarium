const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,9,0,0)});
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;const d=today();
  S.tasks=[{id:uid(),date:d,title:'Már ott van',mode:'munka',plan:60,done:0,star:false,completed:false,postponed:0,start:'10:00'}];
  save();render()});
// adding a second task whose time overlaps the first warns, but still saves it
await pg.fill('#f-title','Új, ütköző');await pg.fill('#f-start','10:30');
const pi=await pg.$('#f-plan');await pi.fill('30');
await pg.click('[data-act="add"]');
const saved=await pg.evaluate(()=>S.tasks.find(t=>t.title==='Új, ütköző'));
ok(!!saved&&saved.start==='10:30','overlapping task is saved anyway: '+JSON.stringify(saved));
ok((await pg.textContent('.alert')).includes('Már ott van'),'warning names the conflicting task');
ok(await pg.evaluate(id=>overlaps(today(),'10:30',30,id).length===1,saved.id),'overlaps() excludes the task itself and reports the one real conflict');
// a non-overlapping time next to it raises no warning
await pg.fill('#f-title','Később');await pg.fill('#f-start','12:00');await pg.click('[data-act="add"]');
const visible=await pg.locator('.alert').isVisible();
ok(!visible,'no warning for a non-overlapping time'+(visible?': '+(await pg.textContent('.alert')):''));
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
