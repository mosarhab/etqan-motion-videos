// Evaluate the actual production motion helper, not a duplicate animation model.
import ts from "typescript";
import fs from "node:fs";
const toUrl = s => "data:text/javascript;base64," + Buffer.from(s).toString("base64");
const compile = s => ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const source = ts.createSourceFile("Equipment.tsx",fs.readFileSync("src/Equipment.tsx","utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const functions=source.statements.filter(s=>ts.isFunctionDeclaration(s)&&["liftProfile","slumpState"].includes(s.name?.text)).map(s=>s.getText(source)).join("\n");
const motion=toUrl(compile(fs.readFileSync("src/motion.ts","utf8")));
const {slumpState}=await import(toUrl(compile(`import {clamp,ease} from ${JSON.stringify(motion)};\n${functions}`)));
let maximumError=0,previousLift=0;
for(let frame=0;frame<=540;frame++){
 const t=frame/30,s=slumpState(t),v=s.h/3*(s.R*s.R+s.R*s.r+s.r*s.r);
 maximumError=Math.max(maximumError,Math.abs(v-1661200)/1661200);
 if(![s.h,s.r,s.R,s.lift,s.side,s.lower].every(Number.isFinite))throw new Error("Non-finite geometry");
 if(t<=10.3 && Math.abs(s.side)>1e-8)throw new Error("Cone moves sideways during lift");
 if(t>=5&&t<=10){if(s.lift<previousLift)throw new Error("Vertical lift reverses");previousLift=s.lift;}
 if(t>10.3&&t<12.2&&622-s.lift+s.lower>=622-s.h)throw new Error("Cone not clear before moving aside");
 if(t>=12.2&&Math.abs(s.side+320)>1e-8)throw new Error("Cone lowered before horizontal travel completes");
}
if(maximumError>1e-10)throw new Error("Illustrated specimen changes volume");
const last=slumpState(18);
if(Math.abs(last.lift-last.lower)>1e-8 || 580+last.side+134>=580-last.R)throw new Error("Final set-down geometry collides");
const result={passed:true,frames_checked:541,maximum_relative_frustum_volume_error:maximumError,vertical_lift_seconds:5,horizontal_move_after_full_clearance:true,set_down_after_moving_aside:true,specimen_and_cone_separated_at_end:true,limits:"Engineering schematic checks, not an actual measured slump result or calibrated physical simulation. Equipment display has no fabricated temperature reading."};
fs.writeFileSync("renders/geometry-check.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result,null,2));
