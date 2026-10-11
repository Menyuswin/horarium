const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage({viewport:{width:390,height:900}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(require('./env').URL);await pg.evaluate(()=>{S.onboarded=true;S.settings.pet.name='Bodri';S.morning[today()]={skip:true};save();render()});
await pg.click('[data-act="feelopen"]');ok(await pg.isVisible('#feel-text'),'write box opens');
await pg.click('[data-act="feelsave"]');ok(await pg.evaluate(()=>S.feel.length===0),'nothing saved when empty');
await pg.click('.pet-panel [data-act="feel"][data-w="fáradt"]');await pg.fill('#feel-text','Nagyon kimerült vagyok ma, sok volt a meeting.');await pg.click('[data-act="feelsave"]');
const r=await pg.textContent('.feelreply');ok(/fáradtság nem gyengeség|megbeszélés|beszélgetés|pihenés most/.test(r),'theme reply: '+r.slice(0,60));
ok(await pg.evaluate(()=>S.feel[0].text.startsWith('Nagyon kimerült')&&S.feel[0].q==='nk'),'text kept with feeling');
await pg.click('[data-act="feelclose"]');
await pg.click('[data-act="feelopen"]');await pg.click('.pet-panel [data-act="feel"][data-w="lelkes"]');await pg.click('[data-act="feelsave"]');
ok(/lendületet|energia a tiéd/.test(await pg.textContent('.feelreply')),'group reply for lelkes');
await pg.click('[data-act="feelclose"]');
await pg.click('[data-act="feelopen"]');await pg.fill('#feel-text','Csak le akartam írni valamit.');await pg.click('[data-act="feelsave"]');
ok(/szavakba öntötted|kiírtad magadból|bizalmat/.test(await pg.textContent('.feelreply')),'text-only reply');
// hard feelings invite in week view leads back to the box
await pg.evaluate(()=>{for(let i=0;i<7;i++)S.feel.push({at:Date.now()-i*3600000,w:'szomorú',q:'nk',sid:'',text:''});save()});
await pg.click('[data-v="het"]');ok(!(await pg.textContent('#app')).includes('116'),'no helpline');
await pg.click('[data-act="feelgo"]');ok(await pg.isVisible('#feel-text'),'invite opens the write box on Ma');
// tegező check on visible texts
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));const t=await pg.textContent('body');ok(!/\bÖn\b|Önnek|Önre|Önnel/.test(t),'no Ön in settings');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
