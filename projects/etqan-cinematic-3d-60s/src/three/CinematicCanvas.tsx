import React,{useLayoutEffect,useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import * as T from 'three';
import {World,environment,camera,ramp,mix} from './core';
import {concreteWorld} from './concrete';
import {soilWorld} from './soil';
import {asphaltWorld} from './asphalt';
import {globeWorld,mapWorld} from './geography';
import {laboratoryWorld,closingWorld} from './laboratory';
export const STARTS=[0,240,540,750,1050,1350,1590,1710];
export const LENGTHS=[240,300,210,300,300,240,120,90];
const vertex='varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}';
const fragment=`varying vec2 v;uniform sampler2D imageA;uniform sampler2D depthA;uniform sampler2D imageB;uniform sampler2D depthB;uniform float blend;uniform vec2 resolution;uniform float focusA;uniform float focusB;uniform float apertureA;uniform float apertureB;uniform float time;float viewZ(float d){return (0.08*140.)/((140.-0.08)*d-140.);}vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}vec3 grade(sampler2D tex,sampler2D dep,vec2 uv,float focus,float aperture){float z=-viewZ(texture2D(dep,uv).x);float blur=min(3.,abs(z-focus)/max(1.,z)*aperture*38.);vec2 d=vec2(max(.28,blur))/resolution;vec3 c=texture2D(tex,uv).rgb*.28;c+=texture2D(tex,uv+vec2(d.x,0)).rgb*.12;c+=texture2D(tex,uv-vec2(d.x,0)).rgb*.12;c+=texture2D(tex,uv+vec2(0,d.y)).rgb*.12;c+=texture2D(tex,uv-vec2(0,d.y)).rgb*.12;c+=texture2D(tex,uv+d).rgb*.06;c+=texture2D(tex,uv-d).rgb*.06;c+=texture2D(tex,uv+vec2(d.x,-d.y)).rgb*.06;c+=texture2D(tex,uv+vec2(-d.x,d.y)).rgb*.06;vec3 glow=texture2D(tex,uv+vec2(8.,0.)/resolution).rgb+texture2D(tex,uv-vec2(8.,0.)/resolution).rgb+texture2D(tex,uv+vec2(0.,8.)/resolution).rgb+texture2D(tex,uv-vec2(0.,8.)/resolution).rgb;c+=max(vec3(0.),glow*.25-1.2)*.12;return c;}void main(){vec3 c=grade(imageA,depthA,v,focusA,apertureA);if(blend>.0001)c=mix(c,grade(imageB,depthB,v,focusB,apertureB),blend);float vig=1.-.18*pow(length((v-.5)*vec2(1.,.8)),1.5);c=aces(c*1.12*vig);c=pow(c,vec3(1./2.2));float grain=fract(sin(dot(v*resolution,vec2(12.9898,78.233))+time*7.13)*43758.5453)-.5;c+=grain*.004;gl_FragColor=vec4(c,1.);}`;
const Frame=({offset}:{offset:number})=>{const {gl}=useThree();const localFrame=useCurrentFrame();const frame=localFrame+offset;
 const setup=useMemo(()=>{gl.shadowMap.enabled=true;gl.shadowMap.type=T.VSMShadowMap;gl.outputColorSpace=T.LinearSRGBColorSpace;gl.toneMapping=T.NoToneMapping;const env=environment(gl);const worlds=new Map<number,World>();const makeWorld=[globeWorld,mapWorld,laboratoryWorld,soilWorld,concreteWorld,asphaltWorld,asphaltWorld,closingWorld];const getWorld=(index:number)=>{if(!worlds.has(index))worlds.set(index,makeWorld[index](env));return worlds.get(index)!;};const target=()=>{const rt=new T.WebGLRenderTarget(720,1280,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,type:T.HalfFloatType,depthBuffer:true,samples:2});rt.depthTexture=new T.DepthTexture(720,1280,T.UnsignedShortType);return rt;};const a=target(),b=target();const uniforms={imageA:{value:a.texture},imageB:{value:b.texture},depthA:{value:a.depthTexture},depthB:{value:b.depthTexture},blend:{value:0},resolution:{value:new T.Vector2(720,1280)},focusA:{value:10},focusB:{value:10},apertureA:{value:.1},apertureB:{value:.1},time:{value:0}};const material=new T.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,depthTest:false,depthWrite:false,toneMapped:false});return{getWorld,a,b,uniforms,material};},[gl]);
 useLayoutEffect(()=>{
  let active=STARTS.findIndex((s,i)=>frame>=s&&(i===7||frame<STARTS[i+1]));if(active<0)active=7;
  const current=frame-STARTS[active];
  const shot=(index:number,seconds:number)=>{if(index!==6){const w=setup.getWorld(index);w.update(seconds);return w;}const segment=Math.min(2,Math.floor(Math.max(0,seconds)/1.3333333)),type=[3,4,5][segment],w=setup.getWorld(type);w.update(6+seconds*.45);const angle=.6+seconds*.16;if(type===3)camera(w,[Math.sin(angle)*7.6,3.7,Math.cos(angle)*10],[.1,2.4,0],35,.14);else if(type===4)camera(w,[Math.sin(angle)*5.8,3.4,Math.cos(angle)*7.9],[0,2.5,0],40,.15);else camera(w,[Math.sin(angle)*5.6,3.1,Math.cos(angle)*8.5],[0,2,.15],38,.15);return w;};
  const draw=(index:number,seconds:number,target:T.WebGLRenderTarget,which:'A'|'B')=>{const w=shot(index,seconds);gl.setRenderTarget(target);gl.render(w.scene,w.camera);setup.uniforms[which==='A'?'focusA':'focusB'].value=w.focus;setup.uniforms[which==='A'?'apertureA':'apertureB'].value=w.aperture;};
  let blend=0;
  if(active>0&&current<16){draw(active-1,(LENGTHS[active-1]+current)/30,setup.a,'A');draw(active,current/30,setup.b,'B');blend=ramp(current,0,15);}
  else if(active===6&&(current>=40&&current<48||current>=80&&current<88)){const boundary=current>=80?80:40;draw(6,(boundary-.1)/30,setup.a,'A');draw(6,current/30,setup.b,'B');blend=ramp(current,boundary,boundary+7);}
  else draw(active,current/30,setup.a,'A');
  gl.setRenderTarget(null);setup.uniforms.blend.value=blend;setup.uniforms.time.value=frame;
 },[frame,gl,setup]);
 return <mesh material={setup.material} frustumCulled={false}><planeGeometry args={[2,2]}/></mesh>};
export const CinematicCanvas=({offset=0}:{offset?:number})=>{const{width,height}=useVideoConfig();return <ThreeCanvas width={width} height={height} dpr={2/3} gl={{antialias:false,preserveDrawingBuffer:false,alpha:false,powerPreference:'high-performance'}} camera={{position:[0,0,1]}} frameloop="never"><Frame offset={offset}/></ThreeCanvas>};
