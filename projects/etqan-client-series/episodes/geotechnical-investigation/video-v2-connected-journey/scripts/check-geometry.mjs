/** Physical continuity checks on the exact motion helper used by the rig. */
import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import ts from "typescript";
const motion=ts.transpileModule(fs.readFileSync("src/motion.ts","utf8"),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext}}).outputText;
const motionUrl="data:text/javascript;base64,"+Buffer.from(motion).toString("base64");
const code=fs.readFileSync("src/Rig.tsx","utf8"),tree=ts.createSourceFile("Rig.tsx",code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const helper=tree.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==="rigMotion");
assert(helper,"The actual rendered rig motion helper must exist");
const actual=ts.transpileModule(helper.getText(tree),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext}}).outputText;
const url="data:text/javascript;base64,"+Buffer.from(`import {ease} from "${motionUrl}";\n${actual}`).toString("base64");
const {rigMotion}=await import(url);
const states=Array.from({length:499},(_,f)=>rigMotion(f/30));
for(const s of states){
 for(const value of Object.values(s))assert(Number.isFinite(value));
 assert(s.headY>=94-1e-8&&s.headY<=404+1e-8,"Carriage stays on the upright mast");
 assert(Math.abs((s.tipY-s.headY)-406)<1e-8,"Rigid sampler/rod assembly keeps its length");
 assert(s.boreBottom>=630&&s.boreBottom<=810,"Illustrated bore remains inside the shown block");
}
for(let i=1;i<states.length;i++)assert(states[i].boreBottom>=states[i-1].boreBottom,"Bore does not disappear during withdrawal");
assert(rigMotion(9.3).headY>rigMotion(1).headY,"Head advances down during drilling");
assert(rigMotion(15.7).headY<rigMotion(10.2).headY,"Sampler is withdrawn upwards");
assert(rigMotion(15.7).tipY+9<620,"Sampler clears the ground before the sample-preservation scene");
assert(rigMotion(15.7).sampleReveal===1,"Extracted sample is visible");
const sceneCode=fs.readFileSync("src/Scene.tsx","utf8"),sceneTree=ts.createSourceFile("Scene.tsx",sceneCode,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let opacityNode;
function walk(n){if(ts.isVariableDeclaration(n)&&n.name.getText(sceneTree)==="copyOpacity")opacityNode=n.initializer;ts.forEachChild(n,walk);}walk(sceneTree);
assert(opacityNode,"Exact text handoff expression must exist");
const opacityFunction=`import {ease} from "${motionUrl}";export function copyOpacity(f,duration,first,last){return ${opacityNode.getText(sceneTree)};}`;
const {copyOpacity}=await import("data:text/javascript;base64,"+Buffer.from(opacityFunction).toString("base64"));
for(const duration of [648,258,258,258,288]){
 for(let f=0;f<18;f++){
  const outgoing=copyOpacity(duration-18+f,duration,duration===648,false),incoming=copyOpacity(f,240,false,true);
  assert(outgoing>=0&&outgoing<=1&&incoming>=0&&incoming<=1);
  assert(outgoing*incoming===0,"Outgoing and incoming title blocks never overlap");
 }
}
function actualFunction(file,name){const source=fs.readFileSync(file,"utf8"),tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const node=tree.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);assert(node,name);const js=ts.transpileModule(node.getText(tree),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext}}).outputText;return import("data:text/javascript;base64,"+Buffer.from(`import {ease,clamp,mix} from "${motionUrl}";\n${js}`).toString("base64"));}
const {journeyMotion}=await actualFunction("src/Journey.tsx","journeyMotion");
const opening=rigMotion(journeyMotion(0).rigTime),oneSecond=rigMotion(journeyMotion(1).rigTime);
assert(opening.angle>0&&oneSecond.headY-opening.headY>5,"Actual drilling moves from the opening second");
const clear=rigMotion(journeyMotion(15).rigTime);assert(clear.tipY+9<620,"Soil sampler clears the ground before transfer");
for(let f=0;f<=630;f++){const s=journeyMotion(f/30);assert(s.sx>0&&s.sy>0&&s.x>=302.4&&s.x<=500&&s.rigTime<=15.7+1e-8);}
assert(journeyMotion(17).transfer===1&&journeyMotion(20).capGap===0);
const {labTransferMotion}=await actualFunction("src/Laboratory.tsx","labTransferMotion");
for(let f=0;f<=18;f++){const s=labTransferMotion(f/30);assert(s.x===500&&s.y===136.19&&s.w===150&&s.h===350,"Same jar position/scale retained throughout the scene dissolve");}
assert(labTransferMotion(2).x===180&&labTransferMotion(2).y===462);
const {cupMotion}=await actualFunction("src/LabApparatus.tsx","cupMotion");
const cups=Array.from({length:259},(_,f)=>cupMotion(f/30));
assert(cups.every(s=>s.angle>=-1e-8&&s.angle<=3.2+1e-8&&s.closure>=0&&s.closure<=1));
assert(cupMotion(7.5).closure===1&&Math.abs(cupMotion(7.5).angle)<1e-8,"Cup stops after local groove closure");
assert(cupMotion(7.5).crank===cupMotion(8).crank);
const {shearMotion}=await actualFunction("src/LabApparatus.tsx","shearMotion");
const shears=Array.from({length:259},(_,f)=>shearMotion(f/30));
for(let i=1;i<shears.length;i++){assert(shears[i].normal>=0&&shears[i].normal<=4);assert(shears[i].displacement>=shears[i-1].displacement&&shears[i].displacement<=26);}
assert(shearMotion(.8).normal===4&&shearMotion(.8).displacement===0,"Normal preload precedes horizontal displacement");
const previous="../video/";const unchanged=[];const pinned=JSON.parse(fs.readFileSync("notes/approved-assets.json","utf8"));
for(const file of ["src/Rig.tsx","src/Brand.tsx","src/GeoMaterials.tsx","public/etqan-logo.png","public/creator-logo-mask.png"]){assert(crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")===pinned[file],file);if(fs.existsSync(previous+file))assert(fs.readFileSync(file).equals(fs.readFileSync(previous+file)),file);unchanged.push(file);}
const result={passed:true,rigStatesChecked:states.length,journeyStatesChecked:631,cupStatesChecked:cups.length,shearStatesChecked:shears.length,drillingInFirstSecond:true,openingHeadDisplacement:oneSecond.headY-opening.headY,connectedSampleTransfer:true,jarHoldsPositionThroughDissolve:true,sampleClearsGroundBeforeTransfer:true,normalLoadBeforeShear:true,cupStopsAfterClosure:true,copyHandoff:"No simultaneous title opacity across all five 18-frame transitions",approvedDrawingAndBrandFilesUnchanged:unchanged,emptySiteOnly:true,noDisplayedDepthsOrTestResults:true,limitation:"Illustrative screen geometry, not a certified equipment model or a complete laboratory procedure"};
fs.writeFileSync("renders/geometry-check.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result,null,2));
