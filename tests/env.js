// Shared settings for the browser checks: where the app and Chromium are.
const path=require('path'),os=require('os'),fs=require('fs');
const OUT=process.env.HORARIUM_OUT||path.join(os.tmpdir(),'horarium-tests');
fs.mkdirSync(OUT,{recursive:true});
module.exports={
  URL:'file://'+path.resolve(__dirname,'..','index.html'),
  CHROMIUM:process.env.CHROMIUM||'/opt/pw-browsers/chromium',
  out:f=>path.join(OUT,f)
};
