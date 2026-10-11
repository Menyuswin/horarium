const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{
const b=await chromium.launch({executablePath:require('./env').CHROMIUM});
const ctx=await b.newContext({acceptDownloads:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
await pg.goto(require('./env').URL);await pg.evaluate(()=>{if(!S.onboarded){S.onboarded=true;save();render()}});
await pg.fill('#f-title','Exportált feladat');await pg.click('[data-act="add"]');
await pg.evaluate(()=>{S.petMins=300;S.settings.pet.name='Bodri';save()});
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));
const [dl]=await Promise.all([pg.waitForEvent('download'),pg.click('[data-act="export"]')]);
const f=__dirname+'/exp.json';await dl.saveAs(f);
const j=JSON.parse(fs.readFileSync(f,'utf8'));
ok(dl.suggestedFilename().startsWith('horarium-')&&j.tasks[0].title==='Exportált feladat'&&j.petMins===300,'export file '+dl.suggestedFilename());
ok((await pg.textContent('.alert')).includes('Elmentettük az adataidat'),'export message');
// wipe and import back
await pg.evaluate(()=>{S=defaults();S.onboarded=true;save();render()});
await pg.setInputFiles('#imp-file',f);await pg.waitForSelector('[data-act="impok"]');
ok((await pg.textContent('.alert')).includes('1 feladat'),'import preview');
ok(await pg.evaluate(()=>S.tasks.length===0),'nothing replaced before confirm');
await pg.click('[data-act="impok"]');
ok(await pg.evaluate(()=>S.tasks[0].title==='Exportált feladat'&&S.petMins===300&&S.settings.pet.name==='Bodri'),'import restores state');
await pg.reload();ok(await pg.evaluate(()=>S.tasks.length===1),'persists after reload');
// bad file
fs.writeFileSync(__dirname+'/bad.json','{"hello":1}');
await pg.click('[data-v="beall"]');await pg.evaluate(()=>document.querySelectorAll('details.sec').forEach(d=>{d.open=true;openSecs.add(d.dataset.sec)}));await pg.setInputFiles('#imp-file',__dirname+'/bad.json');await pg.waitForTimeout(300);
ok((await pg.textContent('#app')).includes('nem Horárium-mentés')&&await pg.evaluate(()=>S.tasks.length===1),'bad file rejected');
// cancel
await pg.setInputFiles('#imp-file',f);await pg.waitForSelector('[data-act="impno"]');await pg.click('[data-act="impno"]');
ok(!(await pg.isVisible('[data-act="impok"]')),'cancel import');
ok(errs.length===0,'no page errors '+errs.join('|'));
await b.close()})();
