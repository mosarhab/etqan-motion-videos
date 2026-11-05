import React, { useMemo } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import data from "../geography.json";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  View,
  smooth,
  mix,
  glow,
} from "../World";
import { Fonts, Footer } from "../Type";
function map() {
  const c = document.createElement("canvas");
  c.width = 4096;
  c.height = 2048;
  const x = c.getContext("2d")!;
  x.scale(2, 2);
  x.fillStyle = "#061527";
  x.fillRect(0, 0, 2048, 1024);
  for (const f of data) {
    x.beginPath();
    const polys =
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    for (const poly of polys)
      for (const ring of poly) {
        ring.forEach((p: any, i: number) =>
          i
            ? x.lineTo(((p[0] + 180) / 360) * 2048, ((90 - p[1]) / 180) * 1024)
            : x.moveTo(((p[0] + 180) / 360) * 2048, ((90 - p[1]) / 180) * 1024),
        );
        x.closePath();
      }
    x.fillStyle = f.name === "Saudi Arabia" ? "#c4a14f" : "#284553";
    x.fill("evenodd");
  }
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}
export function Opening() {
  const t = useCurrentFrame() / 30,
    a = smooth(t / 3),
    lon = (mix(16, 46.7, a) * Math.PI) / 180,
    lat = (mix(18, 24.7, a) * Math.PI) / 180,
    r = mix(13.6, 10.2, a);
  const view: View = {
    position: [
      r * Math.cos(lat) * Math.sin(lon),
      r * Math.sin(lat),
      r * Math.cos(lat) * Math.cos(lon),
    ],
    target: [0, 0.1, 0],
    fov: 39,
  };
  const tex = useMemo(map, []);
  return (
    <AbsoluteFill>
      <Fonts />
      <Canvas space>
        <Camera view={view} />
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <sphereGeometry args={[3.0, 96, 64]} />
          <meshStandardMaterial map={tex} roughness={0.8} metalness={0.12} />
        </mesh>
        <mesh>
          <sphereGeometry args={[3.04, 96, 64]} />
          <shaderMaterial
            transparent
            blending={T.AdditiveBlending}
            side={T.BackSide}
            depthWrite={false}
            vertexShader={`varying vec3 N;varying vec3 P;void main(){N=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);P=p.xyz;gl_Position=projectionMatrix*p;}`}
            fragmentShader={`varying vec3 N;varying vec3 P;void main(){float a=pow(1.-abs(dot(normalize(N),normalize(-P))),3.);gl_FragColor=vec4(.08,.35,.65,a*.7);}`}
          />
        </mesh>
        <Dust t={t} />
      </Canvas>
      <Finish />
      <Footer text="من قلب الرياض" t={t} start={0.25} end={2.95} />
    </AbsoluteFill>
  );
}
