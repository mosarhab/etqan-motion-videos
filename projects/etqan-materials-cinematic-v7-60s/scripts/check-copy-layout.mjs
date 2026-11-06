/** Measure the actual shared caption layout in every standalone test scene. */
import {openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
const compositions=['SoilBorehole','SoilFormation','Proctor','FieldDensity','SoilResistivity','FreshConcrete','ConcreteCompression','UltrasonicUPV','ConcreteCore','AsphaltFormation','Marshall','Binder'];
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',logLevel:'error',chromiumOptions:{gl:'angle-egl'}});
const results=[];
try {
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 for (const composition of compositions) {
  await page.goto({url:`http://localhost:3008/${composition}`,timeout:30000});
  const result=await page.evaluate(async()=>{
   for(let i=0;i<200&&!document.querySelector('[data-benefit]');i++)await new Promise(r=>setTimeout(r,100));
   await document.fonts.ready;
   const canvas=[...document.querySelectorAll('canvas')].find(c=>c.width>=1000);
   if(!canvas)throw new Error('Test preview canvas missing');
   const r=canvas.getBoundingClientRect(),scale=r.width/1080;
   const box=el=>{const b=el.getBoundingClientRect();const range=document.createRange();range.selectNodeContents(el);const text=range.getBoundingClientRect();return {text:el.textContent.trim(),x:(b.left-r.left)/scale,y:260+(b.top-r.top)/scale,width:b.width/scale,height:b.height/scale,textWidth:text.width/scale, fontSize:parseFloat(getComputedStyle(el).fontSize),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth};};
   return {benefits:[...document.querySelectorAll('[data-benefit]')].map(box),titles:[...document.querySelectorAll('[data-test-title]')].map(box)};
  });
  if(!result.benefits.length)throw new Error('No benefit in '+composition);
  for(const b of result.benefits)if(Math.abs(b.y-1642)>1||b.x<79||b.x+b.width>1001||b.y+b.height>1770||b.scrollWidth>b.clientWidth||b.fontSize!==38)throw new Error('Benefit overflow: '+composition+' '+JSON.stringify(b));
  for(const b of result.titles)if(b.y<410||b.y+b.height>650||b.scrollWidth>b.clientWidth||b.textWidth>b.width+1)throw new Error('Title overflow: '+composition+' '+JSON.stringify(b));
  results.push({composition,...result});
 }
 fs.writeFileSync('renders/copy-layout.json',JSON.stringify({passed:true,caption_top:1642,footer_top:1812,compositions:results},null,2)+'\n');
 console.log('Actual Cairo titles and shared lower captions fit in all',results.length,'test compositions');
} finally {await browser.close({silent:true});}
