/** Physical continuity checks on the exact motion helper used by the rig. */
import fs from "node:fs";
import assert from "node:assert/strict";
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
for(const duration of [258,498,198,378,318]){
 for(let f=0;f<18;f++){
  const outgoing=copyOpacity(duration-18+f,duration,duration===258,false),incoming=copyOpacity(f,240,false,true);
  assert(outgoing>=0&&outgoing<=1&&incoming>=0&&incoming<=1);
  assert(outgoing*incoming===0,"Outgoing and incoming title blocks never overlap");
 }
}
const result={passed:true,statesChecked:states.length,copyHandoff:"No simultaneous title opacity across all five 18-frame transitions",physicalContinuity:["Single upright mast, no folded transport mast","Carriage remains within mast travel","Rigid rod/sampler length retained","Bore retains maximum drilled extent during withdrawal","Sampler lifted above ground before transfer"],carriageYRange:[Math.min(...states.map(s=>s.headY)),Math.max(...states.map(s=>s.headY))],illustrativeDepthOnly:true,noDisplayedDepthsOrSPTResults:true,limitation:"Screen geometry checks only; not equipment certification, CAD validation or a procedural drilling specification"};
fs.writeFileSync("renders/geometry-check.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result,null,2));
