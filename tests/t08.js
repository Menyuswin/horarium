const {chromium}=require('playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const pg=await b.newPage({viewport:{width:390,height:900}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
await pg.clock.install({time:new Date(2026,9,12,8,30,0)});
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
// naming
ok(await pg.isVisible('#pet-name'),'naming prompt for unnamed pet');
await pg.fill('#pet-name','Füles');await pg.click('[data-act="pname"]');
ok(await pg.evaluate(()=>S.settings.pet.name==='Füles')&&(await pg.textContent('.pet-panel h3'))==='Füles','pet named');
ok((await pg.textContent('#app')).includes('Üdvözöld Füles'),'welcome message');
await pg.click('[data-act="prename"]');await pg.fill('#pet-name','');await pg.click('[data-act="pname"]');
ok(await pg.evaluate(()=>S.settings.pet.name==='Bodri'),'empty rename falls back to default name');
// morning
ok((await pg.textContent('#app')).includes('Jó reggelt!')&&await pg.isVisible('#mo-text'),'morning question at 8:30');
await pg.fill('#mo-text','Befejezem az ajánlatot');await pg.click('[data-act="fmode"][data-k="tanulas"]');await pg.click('[data-act="mosave"]');
const t=await pg.evaluate(()=>S.tasks.find(x=>x.proud));
ok(t&&t.title==='Befejezem az ajánlatot'&&t.mode==='tanulas'&&t.star,'one-thing task created and starred');
ok((await pg.textContent('#app')).includes('Befejezem az ajánlatot')&&(await pg.textContent('#app')).includes('A mai egy dolog')&&!(await pg.isVisible('#mo-text')),'banner replaces question');
await pg.click('[data-act="done"][data-id="'+t.id+'"]');
ok((await pg.textContent('#app')).includes('kész!'),'banner shows done');
await pg.clock.setFixedTime(new Date(2026,9,12,21,0,0));
await pg.click('[data-v="este"]');ok(/Reggel ezt tűzted ki: „Befejezem az ajánlatot”\. (Sikerült|Megcsináltad)/.test(await pg.textContent('#app')),'evening mentions the one thing');
// skip on another day
await pg.evaluate(()=>{S.morning={};save()});await pg.click('[data-v="ma"]');await pg.click('[data-act="moskip"]');
ok(!(await pg.isVisible('#mo-text'))&&!(await pg.isVisible('.onething')),'skip hides for today');
// fictional pets
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));
ok((await pg.textContent('#app')).includes('Képzeletbeli')&&await pg.isVisible('[data-act="pspecies"][data-k="felho"]'),'fictional group in settings');
await pg.click('[data-act="pspecies"][data-k="felho"]');await pg.click('[data-v="ma"]');
ok(await pg.evaluate(()=>document.getElementById('pet-svg').classList.contains('fl')),'cloud cat floats');
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.click('[data-act="pspecies"][data-k="moha"]');await pg.click('[data-v="ma"]');
ok(await pg.isVisible('#pet-svg'),'moss sprite renders');
// old state still loads (no morning key)
await pg.evaluate(()=>{localStorage.setItem('horarium-v1',JSON.stringify({v:2,tasks:[],log:{},hourLog:{},plan:{},settings:{pet:{species:'nincs'}}}))});await pg.reload();
ok(await pg.evaluate(()=>S.settings.pet.species==='kutya'&&typeof S.morning==='object'),'old/bad state normalized');
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
