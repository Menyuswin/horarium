const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,9,0,0)});
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;const d=today();
  S.tasks=[{id:uid(),date:d,title:'Nagy fejezet',mode:'tanulas',plan:120,done:0,star:false,completed:false,postponed:0,start:null}];
  save();render()});
const id=await pg.evaluate(()=>S.tasks[0].id);
await pg.click('[data-act="open"][data-id="'+id+'"]');
await pg.click('[data-act="split"][data-id="'+id+'"]');
const sid=await pg.evaluate(()=>S.tasks[0].splitId);
ok(!!sid&&await pg.evaluate(s=>S.tasks.length===2&&S.tasks[1].splitId===s,sid),'splitting creates a linked sibling sharing a splitId');
ok((await pg.textContent('#app')).includes('1/2. rész')&&(await pg.textContent('#app')).includes('2/2. rész'),'both occurrences show their part label');
// give the new occurrence its own date and time, independent of the original
await pg.fill('#e-date','2026-10-14');await pg.fill('#e-start','16:00');
const second=await pg.evaluate(()=>S.tasks[1].id);
await pg.click('[data-act="esave"][data-id="'+second+'"]');
const parts=await pg.evaluate(()=>S.tasks.map(t=>({date:t.date,start:t.start})));
ok(parts[0].date!==parts[1].date&&parts[1].date==='2026-10-14'&&parts[1].start==='16:00','second occurrence scheduled on its own day: '+JSON.stringify(parts));
// splitting again adds a third occurrence to the same group
await pg.click('[data-act="open"][data-id="'+id+'"]');await pg.click('[data-act="split"][data-id="'+id+'"]');
ok(await pg.evaluate(s=>S.tasks.filter(t=>t.splitId===s).length===3,sid),'splitting again grows the same group');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
