import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderFrames} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
const root=process.cwd();process.env.TMPDIR='work/tmp';process.env.XDG_CONFIG_HOME='work/chrome-config';process.env.XDG_CACHE_HOME='work/chrome-cache';
const mode=process.argv[2]||'video';const out=path.join(root,'out/etqan-cinematic-3d-60s.mp4');
if(mode==='video'&&fs.existsSync(out))throw new Error('Output exists; refusing overwrite');
const url=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(root,'work/bundle'),enableCaching:true});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}});
try{
const composition=await selectComposition({serveUrl:url,id:'EtqanCinematic3D60s',puppeteerInstance:browser,timeoutInMilliseconds:120000});
if(composition.durationInFrames!==1800||composition.fps!==30||composition.width!==1080||composition.height!==1920)throw Error('Composition specification mismatch');
fs.writeFileSync('work/composition-proof.json',JSON.stringify(composition,null,2));
if(mode==='qa'){
 const frames=process.argv.slice(3).map(Number);const set=process.env.QA_SET||'preview-01';fs.mkdirSync('work/qa/'+set,{recursive:false});
 for(const frame of frames.length?frames:[90,420,650,900,1190,1460,1650,1765]){const output=path.join(root,`work/qa/${set}/frame-${String(frame).padStart(4,'0')}.png`);const start=Date.now();await renderStill({serveUrl:url,composition,frame,output,puppeteerInstance:browser,imageFormat:'png',timeoutInMilliseconds:120000,logLevel:'warn',onBrowserLog:x=>{if(x.type==='error')console.log('BROWSER',x.text);}});console.log('QA',frame,((Date.now()-start)/1000).toFixed(2),'sec');}
}else{
 const dir=path.join(root,'work/rendered-frames');
 const sourceFiles=fs.readdirSync('src',{recursive:true}).filter(x=>/\.(tsx?|json)$/.test(x)).sort();
 const hasher=crypto.createHash('sha256');for(const f of sourceFiles)hasher.update(f).update(fs.readFileSync(path.join('src',f)));const sourceHash=hasher.digest('hex');
 const take=process.env.RENDER_TAKE||'native-3d-v1';const renderRoot=path.join(root,'work',take);fs.mkdirSync(renderRoot,{recursive:true});
 const started=Date.now();
 const renderHalf=async(worker,from,to)=>{
  const own=worker===0?browser:await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'swangle'}});
  const folder=path.join(renderRoot,'worker-'+worker);fs.mkdirSync(folder,{recursive:true});const checkpoint=path.join(folder,'checkpoint.json');
  if(fs.existsSync(checkpoint)&&JSON.parse(fs.readFileSync(checkpoint,'utf8')).sourceHash!==sourceHash)throw Error('Source changed since frame capture; choose a fresh RENDER_TAKE');
  fs.writeFileSync(checkpoint,JSON.stringify({sourceHash,from,to,worker,complete:false}));
  const done=new Set(fs.readdirSync(folder).filter(x=>/element-\d+\.jpeg$/.test(x)).map(x=>Number(x.match(/(\d+)\.jpeg$/)[1])));
  const missing=Array.from({length:to-from+1},(_,i)=>from+i).filter(x=>!done.has(x));let last=-1;
  try{
   if(missing.length)await renderFrames({serveUrl:url,composition,frames:missing,outputDir:folder,inputProps:{},imageFormat:'jpeg',jpegQuality:96,muted:true,concurrency:1,puppeteerInstance:own,timeoutInMilliseconds:120000,logLevel:'warn',onBrowserLog:x=>{if(x.type==='error'&&/Shader Error|VALIDATE_STATUS|WebGLProgram/.test(x.text))throw Error('WebGL shader failure: '+x.text);},onStart:()=>console.log('START_WORKER',worker,'missing',missing.length,'range',from,to),onFrameUpdate:n=>{const step=Math.floor(n/15);if(step!==last){last=step;console.log('WORKER',worker,'FRAMES',done.size+n,'/',to-from+1,'ELAPSED',Math.round((Date.now()-started)/1000));}}});
   const files=fs.readdirSync(folder).filter(x=>/element-\d+\.jpeg$/.test(x));if(files.length!==to-from+1)throw Error('Incomplete worker '+worker);
   fs.writeFileSync(checkpoint,JSON.stringify({sourceHash,from,to,worker,complete:true}));return{folder,files};
  }finally{if(worker!==0)await own.close({silent:true});}
 };
 const workers=await Promise.all([renderHalf(0,0,899),renderHalf(1,900,1799)]);
 if(fs.existsSync(dir))throw Error('Final frame link folder already exists; preserving it');fs.mkdirSync(dir);
 for(const worker of workers)for(const name of worker.files){const frame=Number(name.match(/(\d+)\.jpeg$/)[1]);fs.linkSync(path.join(worker.folder,name),path.join(dir,`element-${String(frame).padStart(4,'0')}.jpeg`));}
 fs.writeFileSync('work/render-complete.json',JSON.stringify({sourceHash,frames:1800,fps:30,width:1080,height:1920,webglWidth:720,webglHeight:1280}));
 const names=fs.readdirSync(dir).filter(x=>x.endsWith('.jpeg')).sort();if(names.length!==1800)throw Error('Frame count mismatch');const digits=names[0].match(/(\d+)\.jpeg$/)[1].length;
 execFileSync('/usr/bin/ffmpeg',['-hide_banner','-n','-framerate','30','-i',path.join(dir,`element-%0${digits}d.jpeg`),'-i',path.join(root,'public/assets/original-score.m4a'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-crf','18','-preset','medium','-vf','scale=out_range=tv:out_color_matrix=bt709','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-c:a','copy','-frames:v','1800','-t','60','-movflags','+faststart',out],{stdio:'inherit'});console.log('RENDER_COMPLETE',out);
}
}finally{await browser.close({silent:true});}
