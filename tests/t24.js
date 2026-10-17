const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;save();render()});
// each species produces a sound without throwing, through the real WebAudio graph
for(const sp of ['kutya','macska','nyul','horcsog','felho','moha','ismeretlen']){
  const err=await pg.evaluate(species=>{try{ensureAudio();petSound(species);return null}catch(e){return e.message}},sp);
  ok(err===null,'petSound runs for '+sp+(err?': '+err:''));
}
// the schedule alert path calls it: a task starting right now should trigger a pet sound and a trick, not the focus-timer melody
await pg.clock.install({time:new Date(2026,9,12,9,0,0)});
await pg.evaluate(()=>{S.settings.alerts=true;S.settings.pet.species='macska';alertStamp=Date.now()-10000;
  S.tasks=[{id:uid(),date:today(),title:'Indul most',mode:'munka',plan:30,done:0,star:false,completed:false,postponed:0,start:hm(new Date().getHours()*60+new Date().getMinutes())}];
  window.__sound=null;window.__beep=0;window.__petSoundOrig=petSound;window.__beepOrig=beep;
  petSound=function(s){window.__sound=s;return window.__petSoundOrig(s)};
  beep=function(){window.__beep++;return window.__beepOrig()};
  save()});
await pg.evaluate(()=>alertsDue());
ok(await pg.evaluate(()=>window.__sound==='macska'),'alertsDue calls petSound with the current species');
ok(await pg.evaluate(()=>window.__beep===0),'the focus-timer melody is not used for schedule alerts');
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
