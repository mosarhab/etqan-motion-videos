import React, { useMemo, useRef, useLayoutEffect } from "react";
import * as T from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import data from "../geography.json";
import {
  Canvas,
  Camera,
  Dust,
  Finish,
  View,
  V3,
  smooth,
  mix,
  lerp3,
  project,
  Cyl,
  Path,
  navy,
  gold,
  glow,
  rand,
} from "../World";
import { Fonts, Footer } from "../Type";
const RIYADH = { lon: 46.6753, lat: 24.7136 };
function globeMap() {
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
    x.fillStyle = f.name === "Saudi Arabia" ? "#d2ac4d" : "#305767";
    x.fill("evenodd");
  }
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}
function spherePoint(lon: number, lat: number, r: number): V3 {
  return [
    r * Math.cos((lat * Math.PI) / 180) * Math.sin((lon * Math.PI) / 180),
    r * Math.sin((lat * Math.PI) / 180),
    r * Math.cos((lat * Math.PI) / 180) * Math.cos((lon * Math.PI) / 180),
  ];
}
function Globe({ t }: { t: number }) {
  const a = smooth(t / 3.65),
    lon = mix(17, RIYADH.lon, smooth(t / 2.6)),
    lat = mix(18, RIYADH.lat, smooth(t / 2.6));
  const p = spherePoint(lon, lat, mix(14.7, 4.8, a));
  const city = spherePoint(RIYADH.lon, RIYADH.lat, 3.025);
  const view: View = {
    position: p,
    target: lerp3([0, 0, 0], city, smooth((t - 0.6) / 3) * 0.84),
    fov: 39,
  };
  const tex = useMemo(globeMap, []);
  return (
    <Canvas space>
      <Camera view={view} />
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[3, 96, 64]} />
        <meshStandardMaterial map={tex} roughness={0.74} metalness={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.045, 96, 64]} />
        <shaderMaterial
          transparent
          blending={T.AdditiveBlending}
          side={T.BackSide}
          depthWrite={false}
          vertexShader={`varying vec3 N;varying vec3 P;void main(){N=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);P=p.xyz;gl_Position=projectionMatrix*p;}`}
          fragmentShader={`varying vec3 N;varying vec3 P;void main(){float a=pow(1.-abs(dot(normalize(N),normalize(-P))),3.);gl_FragColor=vec4(.08,.35,.65,a*.7);}`}
        />
      </mesh>
      <mesh
        position={city}
        scale={0.018 + 0.012 * smooth((t - 1.5) / 0.6)}
        material={glow}
      >
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>
      <Dust t={t} />
    </Canvas>
  );
}
function SaudiOutline() {
  const geo = useMemo(() => {
    const f = data.find((f) => f.name === "Saudi Arabia")!;
    const polys =
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    const shapes: T.Shape[] = [];
    for (const poly of polys) {
      const ring = poly[0] as number[][];
      const shape = new T.Shape();
      ring.forEach((p, i) => {
        const x = (p[0] - RIYADH.lon) * Math.cos((RIYADH.lat * Math.PI) / 180),
          y = p[1] - RIYADH.lat;
        i ? shape.lineTo(x, y) : shape.moveTo(x, y);
      });
      shape.closePath();
      shapes.push(shape);
    }
    return new T.ExtrudeGeometry(shapes, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.03,
      bevelSegments: 2,
      curveSegments: 3,
      steps: 1,
    });
  }, []);
  return (
    <mesh
      geometry={geo}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.15, 0]}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial color="#446675" metalness={0.38} roughness={0.58} />
      <lineSegments>
        <edgesGeometry args={[geo, 24]} />
        <lineBasicMaterial color="#c9b57d" transparent opacity={0.5} />
      </lineSegments>
    </mesh>
  );
}
/** City blocks are an abstract city texture, not an invented street or parcel map. */
function CityBlocks() {
  const ref = useRef<T.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const o = new T.Object3D(),
      c = new T.Color();
    for (let i = 0; i < 256; i++) {
      const row = Math.floor(i / 16),
        col = i % 16;
      const x = (col - 7.5) * 0.106 + (col >= 8 ? 0.045 : -0.045),
        z = (row - 7.5) * 0.106 + (row >= 8 ? 0.045 : -0.045);
      const h = 0.022 + Math.pow(rand(i + 22), 4) * 0.24;
      o.position.set(x, 0.04 + h / 2, z);
      o.scale.set(
        0.055 + rand(i * 3 + 4) * 0.021,
        h,
        0.05 + rand(i * 3 + 9) * 0.025,
      );
      o.rotation.y = 0;
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
      c.set(i % 7 === 0 ? "#678591" : i % 3 === 0 ? "#324f61" : "#456b7d");
      ref.current.setColorAt(i, c);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, []);
  return (
    <group rotation={[0, -0.17, 0]}>
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, 256]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.36} roughness={0.48} />
      </instancedMesh>
      <Path
        points={[
          [-0.94, 0.045, 0],
          [-0.35, 0.045, 0],
          [0.35, 0.045, 0],
          [0.94, 0.045, 0],
        ]}
        width={0.007}
        mat={gold}
      />
      <Path
        points={[
          [0, 0.045, -0.94],
          [0, 0.045, -0.35],
          [0, 0.045, 0.35],
          [0, 0.045, 0.94],
        ]}
        width={0.007}
        mat={gold}
      />
    </group>
  );
}
function LocalMap({ t }: { t: number }) {
  const a = smooth(t / 3.5);
  const view: View = {
    position: lerp3([5.8, 8.5, 12], [1.6, 4.2, 6.4], a),
    target: [0, 0, 0],
    fov: 39,
  };
  const p = project([0, 0.4, 0], view);
  return (
    <AbsoluteFill>
      <Canvas>
        <Camera view={view} />
        <SaudiOutline />
        <group scale={1.65}>
          <CityBlocks />
        </group>
        <Cyl p={[0, 0.28, 0]} r={0.012} h={0.4} mat={gold} />
        <mesh position={[0, 0.5, 0]} material={glow}>
          <sphereGeometry args={[0.055, 24, 16]} />
        </mesh>
        {[0, 1].map((i) => (
          <mesh
            key={i}
            position={[0, 0.025, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[
                0.19 + i * 0.09 + 0.025 * Math.sin(t * 2),
                0.196 + i * 0.09 + 0.025 * Math.sin(t * 2),
                64,
              ]}
            />
            <meshBasicMaterial
              color="#efc95d"
              transparent
              opacity={0.7 - i * 0.24}
              side={T.DoubleSide}
            />
          </mesh>
        ))}
        <Path
          points={[
            [-0.9, 0.04, 0.27],
            [-0.25, 0.04, 0.24],
            [0.25, 0.04, 0.24],
            [0.9, 0.04, 0.27],
          ]}
          width={0.007}
          mat={gold}
        />
        <Dust t={t} />
      </Canvas>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: p[0] - 150,
          top: p[1] - 105,
          width: 300,
          textAlign: "center",
          color: "#ffe4a2",
          fontFamily: "EtqanCairo",
          fontWeight: 700,
          fontSize: 48,
          opacity: smooth(t / 0.5),
          textShadow: "0 3px 20px #061426",
        }}
      >
        الرياض
      </div>
    </AbsoluteFill>
  );
}
export function Opening() {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  return (
    <AbsoluteFill>
      <Fonts />
      {t < 4.05 && <Globe t={t} />}
      {t >= 3.35 && (
        <AbsoluteFill style={{ opacity: smooth((t - 3.35) / 0.7) }}>
          <LocalMap t={t - 3.35} />
        </AbsoluteFill>
      )}
      <Finish />
      <Footer text="من قلب الرياض" t={t} start={0.15} end={3.45} />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          bottom: 330,
          left: 95,
          right: 95,
          color: "#fff",
          fontFamily: "EtqanCairo",
          textAlign: "center",
          opacity: smooth((t - 4.1) / 0.55),
        }}
      >
        <div style={{ fontSize: 43, fontWeight: 650, lineHeight: 1.8 }}>
          مختبر اتقان البناء لفحص التربة و المواد
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            color: "#eac873",
            marginTop: 16,
          }}
        >
          حي القادسية، الرياض
        </div>
      </div>
    </AbsoluteFill>
  );
}
