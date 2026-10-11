const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage({viewport:{width:390,height:900}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,9,0,0)}); // Monday
await pg.goto(require('./env').URL);await pg.evaluate(()=>{S.onboarded=true;S.settings.pet.name='Bodri';S.morning[today()]={skip:true};save();render()});
// small step
await pg.click('[data-act="eqopen"]');ok(await pg.isVisible('.eqcard'),'small step card on a Monday');
const t1=await pg.textContent('.eqcard');await pg.click('[data-act="eqnext"]');const t2=await pg.textContent('.eqcard');
ok(t1!==t2&&t1.split('·')[1].slice(0,8)===t2.split('·')[1].slice(0,8),'another step, same area');
await pg.click('[data-act="eqdone"]');ok(!(await pg.isVisible('.eqcard'))&&await pg.evaluate(()=>S.eqDone===1),'step done');
ok((await pg.textContent('#app')).includes('büszke rád: ez a kis lépés is számít'),'pet reacts to step');
// feeling after a block
await pg.fill('#f-title','Írás');await pg.click('[data-act="add"]');await pg.click('[data-act="start"]');await pg.click('[data-act="go"]');
await pg.evaluate(()=>{S.timer.startAt-=40*60000});await pg.click('[data-act="stop"]');
ok(await pg.isVisible('.feels'),'feeling chips in reflection');
await pg.click('[data-act="feel"][data-w="fáradt"]');await pg.click('[data-act="refl"][data-o="igen"]');
ok(await pg.evaluate(()=>S.feel.length===1&&S.feel[0].w==='fáradt'&&S.feel[0].q==='nk'&&S.feel[0].sid===S.sessions[0].id),'feeling stored with session');
ok(/Itt vagyok|hozzád bújik/.test(await pg.textContent('#app')),'pet comforts on tired');
// feeling from pet panel
await pg.click('[data-act="feelopen"]');await pg.click('.pet-panel [data-act="feel"][data-w="nyugodt"]');await pg.click('[data-act="feelsave"]');await pg.click('[data-act="feelclose"]');ok(await pg.evaluate(()=>S.feel.length===2&&S.feel[1].q==='kk'),'feeling from pet panel');
// breathing
await pg.click('.pet-panel [data-act="breathe"]');ok(await pg.isVisible('.breath'),'breathing overlay');
await pg.clock.runFor(4500);ok((await pg.textContent('#br-txt'))==='Kilégzés…','inhale then exhale');
await pg.clock.runFor(57000);ok(!(await pg.isVisible('.breath'))&&await pg.evaluate(()=>S.breaths===1),'ends after a minute');
// weekly map + care note
await pg.evaluate(()=>{for(let i=0;i<6;i++)S.feel.push({at:Date.now()-i*3600000,w:'feszült',q:'nn',sid:''});save()});
await pg.click('[data-v="het"]');const w=await pg.textContent('#app');
ok(w.includes('Érzelmi térkép')&&w.includes('feszült'),'emotion map');ok(w.includes('itt vagyunk, és meghallgatunk')&&!w.includes('116'),'own support instead of a helpline');
// evening question and story
await pg.clock.setFixedTime(new Date(2026,9,12,20,0,0));await pg.click('[data-v="este"]');const e=await pg.textContent('#app');
ok(e.includes('Ma ezeket az érzéseket nevezted meg')&&e.includes('A mai kis lépést is megtetted'),'evening story mentions feelings and step');
ok(await pg.isVisible('#r-eq'),'evening EQ question');await pg.fill('#r-eq','A sétára a parkban');await pg.click('[data-act="review"]');
ok(await pg.evaluate(()=>S.reviews[today()].eq==='A sétára a parkban'),'evening answer saved');
// frequency: only on request
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.click('[data-act="eqfreq"][data-k="keres"]');await pg.evaluate(()=>{S.eqd={};save()});await pg.click('[data-v="ma"]');
await pg.evaluate(()=>{eqOpen=false;render()});ok(await pg.isVisible('[data-act="eqask"]')&&!(await pg.isVisible('.eqcard')),'on request: link only');
await pg.click('[data-act="eqask"]');await pg.click('[data-act="eqopen"]');ok(await pg.isVisible('.eqcard'),'asked step appears');
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.click('[data-act="eqon"]');await pg.click('[data-v="ma"]');ok(!(await pg.isVisible('.eqcard')),'EQ off hides card');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
