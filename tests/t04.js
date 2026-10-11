const {chromium}=require('playwright-core');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const pg=await b.newPage({viewport:{width:420,height:900}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.addInitScript(()=>{if(!localStorage.getItem('horarium-v1'))localStorage.setItem('horarium-v1',JSON.stringify({v:2,tasks:[],log:{},hourLog:{},plan:{}}))});
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
ok(await pg.isVisible('#pet-svg'),'pet shown for old state (default on)');
ok((await pg.textContent('#app')).match(/álmos|várja az első|szunyókál/)!==null,'sleepy at 0 focus');
await pg.waitForFunction(()=>!petBusy);await pg.click('[data-act="petpoke"]');ok(await pg.evaluate(()=>document.getElementById('pet-svg').classList.contains('t-hearts')),'poke -> hearts');
await pg.waitForTimeout(2400);
// levels & moods
const shots={};
for(const [sp,mins,today] of [['kutya',0,0],['macska',130,130],['nyul',500,70],['horcsog',1000,130]]){
  await pg.evaluate(([sp,mins,today])=>{S.settings.pet.species=sp;S.petMins=mins;S.sessions=today?[{id:'a',actual:today,start:Date.now()-3600000,outcome:'igen',pauses:[],distractions:[]}]:[];save();render()},[sp,mins,today]);
  await pg.locator('.pet-panel').screenshot({path:require("./env").out(`pet_${sp}.png`)});
}
await pg.evaluate(()=>{Math.random=()=>0.99});for(const t of ['lick','spin','hop','dance','flip']){await pg.evaluate(n=>{petBusy=false;petTrick(n)},t);ok(await pg.evaluate(n=>document.getElementById('pet-svg').classList.contains('t-'+n),t),'trick '+t);await pg.waitForTimeout(2400);ok(await pg.evaluate(n=>!document.getElementById('pet-svg').classList.contains('t-'+n),t),'trick '+t+' ends')}
// credit via session
await pg.evaluate(()=>{S.petMins=40;S.sessions=[];S.timer={taskId:'x',phase:'focus',startAt:Date.now()-10*60000,began:Date.now()-10*60000,durMs:3000000,pauses:[],distractions:[]};stopTimer(false)});
ok(await pg.evaluate(()=>S.petMins)===50&&(await pg.textContent('#app')).includes('szintet lépett'),'minutes credited + level-up note');
// settings
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.click('[data-act="pspecies"][data-k="macska"]');await pg.fill('[data-set="petname"]','Tigris');await pg.press('[data-set="petname"]','Tab');
ok(await pg.evaluate(()=>S.settings.pet.species==='macska'&&S.settings.pet.name==='Tigris'),'settings species+name');
await pg.click('[data-act="peton"]');await pg.click('[data-v="ma"]');ok(!(await pg.isVisible('#pet-svg')),'pet off hides panel');
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
