const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,11,9,0,0)}); // yesterday, for the app's first load
await pg.goto(require('./env').URL);
const y=await pg.evaluate(()=>{S.onboarded=true;const y=today();
  S.tasks=[{id:uid(),date:y,title:'Tegnapi, befejezetlen',mode:'munka',plan:60,done:0,star:false,completed:false,postponed:0,start:'10:00'},
    {id:uid(),date:y,title:'Tegnapi, kész',mode:'munka',plan:30,done:30,star:false,completed:true,postponed:0,start:'14:00'}];
  S.lastSeen=y;save();render();return y});
// a day passes while the app is open; reaching into tomorrow and re-rendering should trigger the carry-over
await pg.clock.setFixedTime(new Date(2026,9,12,9,0,0));
await pg.evaluate(()=>carryOver());
const open=await pg.evaluate(()=>S.tasks.find(t=>t.title==='Tegnapi, befejezetlen'));
const done=await pg.evaluate(()=>S.tasks.find(t=>t.title==='Tegnapi, kész'));
ok(open.date===await pg.evaluate(()=>today())&&open.start===null&&open.postponed===1,'unfinished task moved to today, unscheduled, postponed once: '+JSON.stringify(open));
ok(done.date===y&&done.completed,'completed task from yesterday is left where it was: '+JSON.stringify(done));
ok((await pg.textContent('.alert')).includes('1 befejezetlen feladat'),'flash message names the moved task count');
// running it again the same day is a no-op
const stamp=await pg.evaluate(()=>S.lastSeen);
await pg.evaluate(()=>carryOver());
ok(await pg.evaluate(s=>S.lastSeen===s,stamp)&&await pg.evaluate(()=>S.tasks.find(t=>t.title==='Tegnapi, befejezetlen').postponed===1),'idempotent within the same day');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
