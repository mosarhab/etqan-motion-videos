import React, { useMemo } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import geography from "../geography.json";
import { Canvas, Camera, Dust, Finish, ease, mix } from "../World";
import { Title } from "../Type";
function earthTexture() {
  const c = document.createElement("canvas");
  c.width = 4096;
  c.height = 2048;
  const ctx = c.getContext("2d")!;
  ctx.scale(2, 2);
  ctx.fillStyle = "#061529";
  ctx.fillRect(0, 0, 2048, 1024);
  for (const f of geography) {
    ctx.beginPath();
    const polys =
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    for (const poly of polys)
      for (const ring of poly) {
        ring.forEach((p: any, i: number) => {
          const x = ((p[0] + 180) / 360) * 2048,
            y = ((90 - p[1]) / 180) * 1024;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.closePath();
      }
    ctx.fillStyle = f.name === "Saudi Arabia" ? "#c9a23f" : "#294953";
    ctx.fill("evenodd");
    if (f.name === "Saudi Arabia") {
      ctx.strokeStyle = "#ffe092";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}
const Atmosphere = () => (
  <mesh scale={1.025}>
    <sphereGeometry args={[3.6, 96, 64]} />
    <shaderMaterial
      transparent
      blending={T.AdditiveBlending}
      side={T.BackSide}
      depthWrite={false}
      vertexShader={`varying vec3 vN;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vP=p.xyz;gl_Position=projectionMatrix*p;}`}
      fragmentShader={`varying vec3 vN;varying vec3 vP;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(-vP))),3.);gl_FragColor=vec4(.15,.48,.85,f*.75);}`}
    />
  </mesh>
);
function Clouds() {
  const t = useCurrentFrame() / 30;
  return (
    <mesh rotation={[0, -Math.PI / 2 + t * 0.001, 0]}>
      <sphereGeometry args={[3.616, 96, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ time: { value: t } }}
        vertexShader={`varying vec2 vUv;varying vec3 vN;void main(){vUv=uv;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
        fragmentShader={`varying vec2 vUv;varying vec3 vN;uniform float time;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}void main(){vec2 p=vUv*vec2(20.,34.);float n=noise(p)*.5+noise(p*2.)*.25+noise(p*4.)*.125;float c=smoothstep(.51,.72,n)*.24;float light=.4+.6*max(0.,dot(normalize(vN),normalize(vec3(-1.,1.,1.))));gl_FragColor=vec4(vec3(.65,.79,.87)*light,c);}`}
      />
    </mesh>
  );
}
function Globe() {
  const tex = useMemo(earthTexture, []);
  const cityPositions = useMemo(() => {
    const pts: number[] = [];
    const cities = [
      [46.7, 24.7],
      [39.2, 21.5],
      [31, 30],
      [44, 33],
      [55, 25],
      [51, 35],
      [28, 41],
      [77, 28],
      [73, 19],
      [67, 24],
      [2, 49],
      [12, 42],
      [37, 55],
      [100, 13],
      [116, 40],
      [121, 31],
    ];
    for (const [lon, lat] of cities)
      for (let i = 0; i < 80; i++) {
        const lo =
            ((lon +
              Math.sin(i * 12.3) *
                Math.cos(i * 7.2) *
                0.7 *
                Math.sqrt(i / 80)) *
              Math.PI) /
            180,
          la =
            ((lat +
              Math.cos(i * 3.41) *
                Math.sin(i * 8.1) *
                0.7 *
                Math.sqrt(i / 80)) *
              Math.PI) /
            180;
        pts.push(
          3.61 * Math.cos(la) * Math.sin(lo),
          3.61 * Math.sin(la),
          3.61 * Math.cos(la) * Math.cos(lo),
        );
      }
    return new Float32Array(pts);
  }, []);
  return (
    <group>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[3.6, 128, 96]} />
        <meshStandardMaterial map={tex} metalness={0.15} roughness={0.87} />
      </mesh>
      <Atmosphere />
      <Clouds />
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cityPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffd581"
          size={0.006}
          sizeAttenuation
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
export function Earth() {
  const f = useCurrentFrame(),
    t = f / 30;
  const a = ease(t / 8);
  const r = mix(16.5, 8.2, a);
  const lon = (mix(-12, 46.7, a) * Math.PI) / 180,
    lat = (mix(14, 24.7, a) * Math.PI) / 180;
  return (
    <AbsoluteFill>
      <Canvas space>
        <Camera
          position={[
            r * Math.cos(lat) * Math.sin(lon),
            r * Math.sin(lat),
            r * Math.cos(lat) * Math.cos(lon),
          ]}
          target={[0, 0.2, 0]}
          fov={41}
        />
        <directionalLight
          position={[-7, 5, 8]}
          intensity={3.4}
          color="#b0d9ff"
        />
        <Globe />
        <Dust time={t} space />
      </Canvas>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 75% 28%,rgba(108,173,231,.12),transparent 40%)",
        }}
      />
      <Finish />
      <Title
        text="من قلب الرياض"
        enter={64}
        duration={240}
        size={76}
        bottom={280}
      />
    </AbsoluteFill>
  );
}
