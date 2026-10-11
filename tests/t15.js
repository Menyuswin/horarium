const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,8,0,0)});
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;S.settings.pet.name='B';const d=today();S.morning[d]={skip:true};
  S.hourLog={'2026-10-05':{14:200,9:20}}; // afternoon is best
  const mk=(title,mode,plan,ex)=>Object.assign({id:uid(),date:d,title,mode,plan,done:0,star:false,completed:false,postponed:0,blockId:null},ex||{});
  S.tasks=[mk('Kis levél','munka',15),mk('Ajánlat','munka',90,{proud:true}),mk('Elemzés','munka',50),mk('Olvasás','tanulas',50,{star:true})];save();render()});
const t=await pg.textContent('#app');
ok(t.includes('Javaslat a mai mély munkára')&&t.includes('délután megy a legjobban'),'panel with best part');
const items=await pg.$$eval('.panel li',l=>l.map(x=>x.textContent));
ok(items.length===2&&items[0].startsWith('Ajánlat → 13:30–16:30 Munka')&&items[1].startsWith('Olvasás'),'proud first, afternoon block chosen: '+JSON.stringify(items));
await pg.click('[data-act="sugok"]');
ok(await pg.evaluate(()=>{const p=S.plan[today()];const a=S.tasks.find(t=>t.title==='Ajánlat');return p.blocks.find(b=>b.id===a.blockId).start==='13:30'})&&!(await pg.textContent('#app')).includes('Javaslat a mai'),'applied and hidden');
ok(await pg.evaluate(()=>!S.tasks.find(t=>t.title==='Kis levél').blockId),'short task left alone');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
