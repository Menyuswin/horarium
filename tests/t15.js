const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,8,0,0)});
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;S.settings.pet.name='B';const d=today();S.morning[d]={skip:true};
  S.hourLog={'2026-10-05':{14:200,9:20}}; // afternoon is best
  const mk=(title,mode,plan,ex)=>Object.assign({id:uid(),date:d,title,mode,plan,done:0,star:false,completed:false,postponed:0,start:null},ex||{});
  // an already-scheduled task occupies the early afternoon, to check the suggestion steps around it
  S.tasks=[mk('Kis levél','munka',15),mk('Ajánlat','munka',90,{proud:true}),mk('Elemzés','munka',50),mk('Olvasás','tanulas',50,{star:true}),
    mk('Egyeztetés','munka',60,{start:'13:30'})];save();render()});
const t=await pg.textContent('#app');
ok(t.includes('Javaslat a mai mély munkára')&&t.includes('délután megy a legjobban'),'panel with best part');
const items=await pg.$$eval('.panel li',l=>l.map(x=>x.textContent));
ok(items.length===2&&items[0].startsWith('Ajánlat → ')&&items[1].startsWith('Olvasás'),'proud first, afternoon-leaning suggestion: '+JSON.stringify(items));
const before=await pg.evaluate(()=>({a:S.tasks.find(t=>t.title==='Ajánlat').start,k:S.tasks.find(t=>t.title==='Kis levél').start}));
ok(!before.a&&!before.k,'nothing scheduled yet');
await pg.click('[data-act="sugok"]');
const after=await pg.evaluate(()=>({a:S.tasks.find(t=>t.title==='Ajánlat').start,o:S.tasks.find(t=>t.title==='Olvasás').start}));
ok(!!after.a&&!!after.o&&after.a!==after.o,'both suggestions got distinct start times: '+JSON.stringify(after));
ok(!(await pg.textContent('#app')).includes('Javaslat a mai'),'panel hidden after applying');
ok(await pg.evaluate(()=>!S.tasks.find(t=>t.title==='Kis levél').start),'short task left alone');
// the applied time must not land inside the already-scheduled 13:30-14:30 task
ok(await pg.evaluate(()=>{const tm=s=>{const m=/^(\d\d):(\d\d)$/.exec(s);return(+m[1])*60+(+m[2])};
  const egy=[tm('13:30'),tm('13:30')+60];
  return['Ajánlat','Olvasás'].every(title=>{const x=S.tasks.find(t=>t.title===title),s=tm(x.start),e=s+x.plan;return e<=egy[0]||s>=egy[1]})}),'suggested times avoid the existing booking');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
