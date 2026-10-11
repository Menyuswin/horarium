const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pg=await b.newPage({viewport:{width:390,height:900},deviceScaleFactor:1.5});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.clock.install({time:new Date(2026,9,16,18,0,0)}); // Friday
await pg.goto(require('./env').URL);
await pg.evaluate(()=>{S.onboarded=true;S.settings.simple=false;S.settings.pet.name='B';
  S.weekly['2026-10-05']={change:'Délelőttre teszem a nehéz feladatot'};
  const mk=(d,min)=>({id:uid(),actual:min,planned:min,start:new Date(2026,9,d,10).getTime(),outcome:'igen',pauses:[],distractions:[]});
  S.sessions=[mk(2,25),mk(5,70),mk(5,60),mk(12,40),mk(16,150)];save();render()});
await pg.click('[data-v="het"]');const t=await pg.textContent('#app');
ok(t.includes('A múlt héten ezt tűzted ki: Délelőttre teszem a nehéz feladatot'),'last week reminder');
ok(t.includes('A hét vége felé jársz'),'end-of-week nudge');
ok(t.includes('Október')&&t.includes('5 ó 45 p fókusz 4 napon')&&t.includes('A legerősebb nap október 16., 2 ó 30 p'),'month summary: '+(t.match(/\d+ ó[^.]*napon[^.]*\.[^.]*\./)||[''])[0]);
ok(await pg.evaluate(()=>document.querySelector('.mcal .l4.now')!==null),'today cell strongest and marked');
await pg.fill('#w-good','Sok mély munka');await pg.fill('#w-change','Kevesebb értekezlet');await pg.click('[data-act="wsave"]');
ok(await pg.evaluate(()=>S.weekly['2026-10-12'].change==='Kevesebb értekezlet')&&(await pg.textContent('#app')).includes('Elmentettük a heti visszatekintést'),'week review saved');
await pg.locator('.mcal').screenshot({path:require('./env').out('month.png')});
ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
