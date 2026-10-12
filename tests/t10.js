const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage({viewport:{width:390,height:844}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,12,8,30,0)});
await pg.goto(require('./env').URL);
ok((await pg.textContent('#app')).includes('Üdvözöl a Horárium')&&(await pg.textContent('#tabs'))==='','fresh visitor sees welcome, no tabs');
await pg.click('[data-act="intro"][data-s="1"]');
ok(await pg.locator('.ipick button').count()===6,'six pets to pick');
await pg.click('[data-act="introPick"][data-k="felho"]');await pg.fill('#intro-name','Bárányfelhő');
await pg.click('[data-act="intro"][data-s="2"]');
ok(await pg.evaluate(()=>S.settings.pet.species==='felho'&&S.settings.pet.name==='Bárányfelhő'),'pick + name saved');
await pg.click('[data-act="intro"][data-s="3"]');
const moods=[];for(let s=3;s<=7;s++){moods.push(await pg.evaluate(()=>document.querySelector('.ipet svg').outerHTML.includes('class="tw"')));const t=await pg.textContent('#app');
  if(s===5)ok(t.includes('Bárányfelhő együtt fejlődik veled'),'pet page uses the name');
  await pg.click('[data-act="intro"][data-s="'+(s+1)+'"]')}
ok(!moods[0]&&moods[4]===true,'pet gets happier through pages');
ok((await pg.textContent('#app')).includes('Az első lépés'),'last page');
await pg.click('[data-act="intro"][data-s="7"]');ok((await pg.textContent('#app')).includes('Este két perc'),'back works');
await pg.click('[data-act="intro"][data-s="8"]');
await pg.fill('#intro-one','Megírom a bemutatkozó levelet');await pg.click('[data-act="introdone"][data-one="1"]');
ok(await pg.evaluate(()=>S.onboarded&&S.tasks.some(t=>t.proud&&t.title==='Megírom a bemutatkozó levelet')),'finish creates the one thing');
ok((await pg.textContent('#app')).includes('Megírom a bemutatkozó levelet')&&(await pg.textContent('#tabs')).includes('Napirend'),'app shown after intro');
await pg.reload();ok(!(await pg.textContent('#app')).includes('Üdvözöl a Horárium'),'intro not shown again');
// replay from settings and skip
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.click('[data-act="introAgain"]');ok((await pg.textContent('#app')).includes('Üdvözöl'),'replay from settings');
await pg.click('[data-act="introdone"]');ok(await pg.evaluate(()=>S.onboarded)&&(await pg.textContent('#tabs')).includes('Ma'),'skip works');
// no-pet path
await pg.evaluate(()=>{S.onboarded=false;introStep=1;render()});await pg.click('[data-act="introNoPet"]');await pg.click('[data-act="intro"][data-s="2"]');
ok(!(await pg.isVisible('.ipet'))&&await pg.evaluate(()=>!S.settings.pet.on),'without pet');
// existing user with data does not see intro
const p2=await b.newPage();await p2.addInitScript(()=>localStorage.setItem('horarium-v1',JSON.stringify({v:2,tasks:[{id:'a',date:'2026-10-01',title:'x',mode:'munka',plan:25,done:0}],log:{},hourLog:{},plan:{}})));
await p2.goto(require('./env').URL);ok(!(await p2.textContent('#app')).includes('Üdvözöl'),'existing user skips intro');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
