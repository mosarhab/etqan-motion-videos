import {openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium',chromiumOptions:{gl:'angle-egl'},logLevel:'error'});
try{
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.goto({url:'http://localhost:3008/BrandFrame',timeout:30000});
 const result=await page.evaluate(async()=>{
  for(let i=0;i<150&&!document.querySelector('[data-brand="footer"]');i++)await new Promise(r=>setTimeout(r,100));
  await document.fonts.ready;
  const footer=document.querySelector('[data-brand="footer"]');if(!footer)throw new Error('Frame preview not loaded');
  const f=footer.getBoundingClientRect(),scale=f.width/904;
  const box=el=>{const r=el.getBoundingClientRect();return {x:88+(r.left-f.left)/scale,y:1843+(r.top-f.top)/scale,width:r.width/scale,height:r.height/scale,text:el.innerText||''};};
  const fields={};for(const el of document.querySelectorAll('[data-contact]'))fields[el.getAttribute('data-contact')]=box(el);
  const company=box(document.querySelector('[data-brand="company"]'));
  const logo=box(document.querySelector('img[src*="etqan-logo.png"]'));
  const creator=box(document.querySelector('[data-brand="creator"]'));
  return {footer:box(footer),fields,company,logo,creator};
 });
 if(result.footer.width<903||result.footer.width>905)throw new Error('Unexpected frame scale');
 for(const [name,b] of Object.entries(result.fields))if(b.x<88-.5||b.x+b.width>992.5||b.y<1842||b.y+b.height>1888)throw new Error('Contact overflow: '+name);
 if(result.company.width>461||result.company.y+result.company.height>225)throw new Error('Company header overflow');
 if(result.fields.phone.text!=='0535588975'||result.fields.email.text!=='info@etqanelbnaa.com')throw new Error('Contact mismatch');
 fs.writeFileSync('renders/frame-layout.json',JSON.stringify(result,null,2)+'\n');console.log('Corporate header and all footer fields fit their reserved frame areas');
}finally{await browser.close({silent:true});}
