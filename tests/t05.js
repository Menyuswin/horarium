const {chromium}=require('playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
await pg.clock.install({time:new Date(2026,9,12,14,0,0)}); // a Monday, 14:00
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
const T=await pg.evaluate(()=>{const d=today();const bk=(s,e,t,m)=>({id:uid(),start:s,end:e,title:t,mode:m});
 const A=bk('09:00','10:00','A','munka'),B=bk('10:00','11:00','B','tanulas'),C=bk('11:30','12:30','C','munka'),D=bk('15:00','16:00','D','munka'),E=bk('17:00','18:00','E','szabad');
 S.plan[d]={blocks:[A,B,C,D,E],workout:'',workoutDone:false};
 const mk=(title,mode,blockId,done)=>({id:uid(),date:d,title,mode,plan:60,done:done||0,star:false,completed:false,postponed:0,blockId});
 S.tasks=[mk('t1','munka',A.id),mk('t2','tanulas',B.id,30),mk('t3','munka',D.id)];save();return{A:A.id,B:B.id,C:C.id,D:D.id,E:E.id,d}});
const bl=()=>pg.evaluate(()=>S.plan[today()].blocks.map(x=>x.title+' '+x.start+'-'+x.end).join(' | '));
await pg.click('[data-v="nap"]');
await pg.click('[data-act="bopen"][data-bid="'+T.A+'"]');ok(await pg.isVisible('[data-act="bdur"][data-bid="'+T.A+'"][data-m="15"]'),'duration buttons shown');
await pg.click('[data-act="bdur"][data-bid="'+T.A+'"][data-m="15"]');
ok((await bl()).startsWith('A 09:00-10:15 | B 10:15-11:15 | C 11:30-12:30'),'+15: B pushed, C untouched: '+await bl());
ok((await pg.textContent('#app')).includes('A következő 1 sáv később kezdődik'),'push message');
await pg.click('[data-act="bdur"][data-bid="'+T.A+'"][data-m="15"]');await pg.click('[data-act="bdur"][data-bid="'+T.A+'"][data-m="15"]');
ok((await bl()).startsWith('A 09:00-10:45 | B 10:45-11:45 | C 11:45-12:45 | D 15:00-16:00'),'cascade to C, gap stops at D: '+await bl());
await pg.click('[data-act="bdur"][data-bid="'+T.A+'"][data-m="-15"]');
ok((await bl()).startsWith('A 09:00-10:30 | B 10:45-11:45'),'shrink leaves gap: '+await bl());
// lower bound
await pg.evaluate(id=>{const a=S.plan[today()].blocks.find(x=>x.id===id);a.end='09:12';save();render()},T.A);
await pg.click('[data-act="bdur"][data-bid="'+T.A+'"][data-m="-5"]');
ok((await bl()).startsWith('A 09:00-09:12'),'min 10 minutes kept: '+(await pg.textContent('.alert')).slice(0,60));
// midnight limit
await pg.evaluate(id=>{const a=S.plan[today()].blocks.find(x=>x.id===id);a.start='23:00';a.end='23:50';S.plan[today()].blocks=[a];save();render()},T.E);
await pg.evaluate(id=>{bOpen=id;render()},T.E);await pg.click('[data-act="bdur"][data-bid="'+T.E+'"][data-m="15"]');
ok((await pg.textContent('.alert')).includes('éjfél'),'midnight refused');
// replan
await pg.evaluate(({T})=>{const d=today();const bk=(s,e,t,m,id)=>({id,start:s,end:e,title:t,mode:m});
 S.plan[d]={blocks:[bk('09:00','10:00','A','munka',T.A),bk('10:00','11:00','B','tanulas',T.B),bk('15:00','16:00','D','munka',T.D),bk('17:00','17:30','E','szabad',T.E)],workout:'',workoutDone:false};
 const mk=(title,mode,blockId,done)=>({id:uid(),date:d,title,mode,plan:60,done:done||0,star:false,completed:false,postponed:0,blockId});
 S.tasks=[mk('t1','munka',T.A),mk('t2','tanulas',T.B,30),mk('t3','munka',T.D)];save();render()},{T});
await pg.click('[data-act="replan"]');
const r=await pg.evaluate(()=>S.tasks.map(t=>t.title+':'+(S.plan[today()].blocks.find(b=>b.id===t.blockId)||{title:'-'}).title).join(' '));
ok(r==='t1:D t2:D t3:D','stray tasks moved to next suitable block: '+r);
const msg=await pg.textContent('.alert');
ok(/2 feladat átkerült/.test(msg)&&/2 ó 30 p/.test(msg)&&/Nem kell mindent ma megcsinálni/.test(msg),'capacity message: '+msg);
await pg.click('[data-act="replan"]');
ok((await pg.textContent('.alert')).includes('Minden a helyén van'),'idempotent second run');
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
