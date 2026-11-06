import {openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
const copy=fs.readFileSync('src/Copy.ts','utf8');
const cases=[...copy.matchAll(/"([^"]+)": "([^"]+)"/g)].map(([,title,benefit])=>({title,benefit}));
const widths={'جسات التربة':610,'اختبار البروكتور':500,'اختبار الهبوط':480,'درجة حرارة الخرسانة':600,'الموجات فوق الصوتية':540,'الثبات والانسياب':470};
const font='data:font/ttf;base64,'+fs.readFileSync('public/Cairo-Variable.ttf').toString('base64');
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',logLevel:'error',chromiumOptions:{gl:'angle-egl'}});
try{
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.goto({url:'about:blank',timeout:30000});
 const result=await page.evaluate(async(font,cases,widths)=>{
  const face=new FontFace('EtqanAudit',`url(${font})`,{weight:'200 1000'});await face.load();document.fonts.add(face);
  const canvas=document.createElement('canvas'),c=canvas.getContext('2d');c.direction='rtl';
  return cases.map(row=>{const width=widths[row.title]||480;c.font='600 45px EtqanAudit';const titleWidth=c.measureText(row.title).width;c.font='500 32px EtqanAudit';const benefitWidth=c.measureText(row.benefit).width;return {...row,width,titleWidth,benefitWidth,fits:titleWidth<=width&&benefitWidth<=width+30};});
 },font,cases,widths);
 fs.writeFileSync('work/copy-layout.json',JSON.stringify(result,null,2)+'\n');
 if(result.some(r=>!r.fits))throw new Error('Copy overflow: '+JSON.stringify(result.filter(r=>!r.fits)));
 console.log('Measured',result.length,'title/benefit pairs in Cairo: all fit their boxes');
}finally{await browser.close({silent:true});}
