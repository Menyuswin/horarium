const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage({viewport:{width:390,height:844}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,10,20,0)});
await pg.goto(require('./env').URL);await pg.evaluate(()=>{S.onboarded=true;S.settings.pet.name='Bodri';S.morning[today()]={skip:true};S.eqd[today()]={skip:true};save();render()});
// empty day: hero invites to add
ok(await pg.isVisible('.hero')&&(await pg.textContent('.hero')).includes('Vegyél fel egy feladatot'),'hero invites to add');
await pg.click('[data-act="focusadd"]');ok(await pg.evaluate(()=>document.activeElement.id==='f-title'),'focus moves to the new task field');
await pg.fill('#f-title','Ajánlat');await pg.fill('#f-start','10:20');await pg.click('[data-act="add"]');
ok((await pg.textContent('.hero .htitle'))==='Ajánlat'&&/MOST/i.test(await pg.textContent('.hero .hlab')),'hero shows the task and marks it as current');
await pg.waitForTimeout(1100);ok(/\d\d:\d\d:\d\d/.test(await pg.textContent('#cd-now')),'hero countdown runs');
await pg.click('.hero .hgo');ok(await pg.isVisible('#s-intent'),'hero button opens the start panel');
await pg.click('[data-act="go"]');ok(!(await pg.isVisible('.hero'))&&await pg.isVisible('.timer'),'timer replaces hero while focusing');
ok(!(await pg.isVisible('[data-act="deepon"]')),'deep work hidden in simple mode');
await pg.click('[data-act="stop"]');
// simple mode off from the link
ok(!(await pg.isVisible('#f-proj')),'no project field in simple mode');
await pg.click('.morelink [data-act="simpleoff"]');ok(await pg.isVisible('#f-proj')&&await pg.evaluate(()=>!S.settings.simple),'more features on: project field appears');
// settings: switch and remembered groups
await pg.click('[data-v="beall"]');ok(await pg.isVisible('.switch[aria-checked="false"]'),'switch shows off');
await pg.click('details[data-sec="pet"] > summary');await pg.click('[data-act="pspecies"][data-k="macska"]');
ok(await pg.evaluate(()=>document.querySelector('details[data-sec="pet"]').open),'group stays open after a change');
await pg.click('.switch');ok(await pg.evaluate(()=>S.settings.simple),'switch back to simple');
// day plan: the scheduled task is marked current, and opening it reveals its actions
await pg.click('[data-v="nap"]');const id=await pg.evaluate(()=>S.tasks.find(t=>t.title==='Ajánlat').id);
ok(await pg.isVisible('.task.now'),'current task marked in the day plan');
ok(!(await pg.isVisible('[data-act="edit"][data-id="'+id+'"]')),'actions hidden until opened');
await pg.click('[data-act="open"][data-id="'+id+'"]');ok(await pg.isVisible('[data-act="edit"][data-id="'+id+'"]'),'opening the task shows its actions');
// week view in simple mode
await pg.click('[data-v="het"]');ok(!(await pg.textContent('#app')).includes('Napi ráfordítás')&&(await pg.isVisible('.morelink')),'week view simple with a way to more');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
