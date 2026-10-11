const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:require('./env').CHROMIUM});const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
 // simulated Claude viewer with downloads capability
 let pg=await b.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.addInitScript(()=>{window.__saved=null;window.claude={use:async n=>n==="downloads"?{save:async r=>{window.__saved=r;return{status:"saved"}}}:null}});
 await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.click('[data-act="export"]');await pg.waitForTimeout(200);
 const sv=await pg.evaluate(()=>window.__saved);ok(sv&&sv.filename.startsWith('horarium-')&&JSON.parse(sv.data).settings,'viewer save via downloads capability');
 ok((await pg.textContent('#app')).includes('Elmentettük az adataidat'),'saved message');
 // declined
 await pg.evaluate(()=>{window.claude={use:async n=>n==="downloads"?{save:async()=>{throw{code:"declined"}}}:null}});await pg.click('[data-act="export"]');await pg.waitForTimeout(200);
 ok((await pg.textContent('#app')).includes('A mentés elmaradt'),'declined handled');
 // capability absent in viewer
 await pg.evaluate(()=>{window.claude={use:async()=>null}});await pg.click('[data-act="export"]');await pg.waitForTimeout(200);
 ok((await pg.textContent('#app')).includes('nem tudunk fájlba menteni'),'absent capability explained');
 ok(errs.length===0,'no page errors '+errs.join('|'));await b.close()})();
