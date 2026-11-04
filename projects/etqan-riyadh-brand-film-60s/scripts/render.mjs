import {bundle} from '@remotion/bundler';
import {selectComposition,renderFrames,renderStill,openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=process.cwd();
// Relative temporary paths keep Chromium Unix-domain sockets below the OS path limit.
process.env.TMPDIR='work/tmp';
process.env.XDG_CONFIG_HOME='work/chrome-config';
process.env.XDG_CACHE_HOME='work/chrome-cache';
const mode=process.argv[2]||'video';
const stillSet=process.env.STILL_SET||'artifacts-final';
fs.mkdirSync(path.join(root,'work',stillSet),{recursive:true});
const out=path.join(root,'out/etqan-riyadh-brand-film-60s-final.mp4');
if(mode==='video'&&fs.existsSync(out))throw new Error('MP4 destination already exists; choose a new output file instead of overwriting');
const url=await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(root,'work/bundle-final'),enableCaching:true});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{disableWebSecurity:false}});
try{
 const composition=await selectComposition({serveUrl:url,id:'EtqanRiyadhBrandFilm60s',puppeteerInstance:browser});
 if(composition.durationInFrames!==1800||composition.fps!==30||composition.width!==1080||composition.height!==1920)throw new Error('Composition metadata mismatch');
 fs.writeFileSync('work/composition-metadata.json',JSON.stringify(composition,null,2));
 console.log('VERIFIED: 1800 frames, 1080x1920, 30 fps');
 if(mode==='stills'){
  const frames=[0,90,205,270,365,455,509,620,850,1000,1160,1290,1400,1580,1679,1740,1799];
  for(let i=0;i<frames.length;i+=3){await Promise.all(frames.slice(i,i+3).map(async frame=>{
   const output=path.join(root,`work/${stillSet}/frame-${String(frame).padStart(4,'0')}.png`);
   if(fs.existsSync(output))throw new Error('Still destination exists: '+output);
   await renderStill({serveUrl:url,composition,frame,output,imageFormat:'png',puppeteerInstance:browser,logLevel:'error'});
   console.log('STILL',frame);
  }));}
 }else{
  let last=-1;
  const frameDir=path.join(root,'work/rendered-frames-final');
  const completed=path.join(root,'work/rendered-frames-final-complete.json');
  if(!fs.existsSync(completed)){
   if(fs.existsSync(frameDir))throw new Error('Frame directory already exists without completion proof; choose a new directory');
   fs.mkdirSync(frameDir);
   const frames=await renderFrames({serveUrl:url,composition,outputDir:frameDir,inputProps:{},imageFormat:'jpeg',jpegQuality:95,muted:true,puppeteerInstance:browser,concurrency:2,logLevel:'warn',onStart:({frameCount})=>console.log('Rendering',frameCount,'frames'),onFrameUpdate:(rendered)=>{const step=Math.floor(rendered/90);if(step!==last){last=step;console.log(`FRAMES ${rendered}/1800`);}}});
   if(frames.frameCount!==1800)throw new Error('Incorrect rendered frame count');
   fs.writeFileSync(completed,JSON.stringify({frameCount:frames.frameCount,compositionId:composition.id,width:1080,height:1920,fps:30},null,2));
  }
  const names=fs.readdirSync(frameDir).filter(x=>x.endsWith('.jpeg')).sort();
  if(names.length!==1800)throw new Error('Expected 1800 persistent JPEG frames');
  const digits=names[0].match(/(\d+)\.jpeg$/)[1].length;
  const sequence=path.join(frameDir,`element-%0${digits}d.jpeg`);
  console.log('Encoding H.264 and original score with system FFmpeg');
  execFileSync('/usr/bin/ffmpeg',['-hide_banner','-n','-framerate','30','-start_number','0','-i',sequence,'-i',path.join(root,'public/assets/original-score.wav'),'-filter:a','volume=0.75','-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r','30','-frames:v','1800','-c:a','aac','-b:a','192k','-ar','48000','-t','60','-movflags','+faststart',out],{stdio:'inherit'});
  console.log('RENDER_COMPLETE',out);
 }
}finally{await browser.close({silent:true});}
