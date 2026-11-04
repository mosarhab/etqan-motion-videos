import {openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
process.env.TMPDIR='work/tmp';process.env.XDG_CONFIG_HOME='work/chrome-config';process.env.XDG_CACHE_HOME='work/chrome-cache';
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
try{
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1,isMobile:false,hasTouch:false,isLandscape:true});
 await page.goto({url:'http://localhost:3000/EtqanRiyadhBrandFilm60s',timeout:30000,options:{waitUntil:'load'}});
 for(let n=0;n<40;n++){
  if(await page.evaluate(()=>document.body.innerText.includes('EtqanRiyadhBrandFilm60s')&&document.querySelectorAll('[lang=ar]').length>0))break;
  await new Promise(r=>setTimeout(r,250));
 }
 const studio=await page.evaluate(()=>({url:location.href,title:document.title,svgCount:document.querySelectorAll('svg').length,compositionListed:document.body.innerText.includes('EtqanRiyadhBrandFilm60s'),compositionRendered:document.querySelectorAll('[lang=ar]').length>0}));
 const studioShot=await page._client().send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 fs.writeFileSync('work/artifacts-v2/studio-confirmed.png',Buffer.from(studioShot.value.data,'base64'));
 await page.goto({url:'http://localhost:3001/preview.html',timeout:30000,options:{waitUntil:'load'}});
 const playback=await page.evaluate(async()=>{
  const video=document.querySelector('video');
  if(!video)throw new Error('Video element absent');
  if(video.readyState<1)await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',()=>reject(new Error('Media error')),{once:true})});
  await new Promise(resolve=>{video.addEventListener('seeked',resolve,{once:true});video.currentTime=46;});
  video.muted=true;await video.play();await new Promise(r=>setTimeout(r,400));video.pause();
  return {duration:video.duration,width:video.videoWidth,height:video.videoHeight,currentTime:video.currentTime,readyState:video.readyState,error:video.error};
 });
 const screenshot=await page._client().send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
 fs.writeFileSync('work/artifacts-v2/playable-preview.png',Buffer.from(screenshot.value.data,'base64'));
 fs.writeFileSync('work/browser-preview-proof.json',JSON.stringify({studio,playback},null,2));
 if(!studio.compositionListed||!studio.compositionRendered||playback.duration!==60||playback.width!==1080||playback.height!==1920||playback.currentTime<46||playback.error)throw new Error('Preview verification failed');
 console.log(JSON.stringify({studio,playback},null,2));
}finally{await browser.close({silent:true});}
